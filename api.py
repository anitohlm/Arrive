import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, constr, EmailStr, Field
from orchestrator import handle_open_app, handle_submit_entry, handle_monthly_insights
from agents.insight_agent import generate_post_insight
from agents.grace_agent import generate_grace_message
from agents.yearly_insights_agent import get_yearly_insights
from agents.reflection_agent import get_emotion_insight, get_monthly_reflection
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

load_dotenv()
log = logging.getLogger("gratitudechain")
limiter = Limiter(key_func=get_remote_address, default_limits=[])

app = FastAPI(title="GratitudeChain API", version="1.0.0")

# Allow the static preview (port 8765) + local dev origins to talk to the API.
# In production, replace with the actual domain.
# Set to True only when cookie-based auth lands; re-review origin list at that time for CSRF.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8765",
        "http://127.0.0.1:8765",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Rate limiting (slowapi). Per-IP limits on AI + write routes. ──
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"ok": False, "reason": "rate-limited"})

# ── Request models ──
# All string fields are length-capped. Emails use EmailStr where the field is
# actually an email; user-supplied "id" / nickname / mood / content strings
# use constr with explicit max_length to prevent payload-size DoS and unbounded
# Foundry token bills.
class OpenAppRequest(BaseModel):
    user_id: constr(max_length=64)
    mood: constr(max_length=64)
    intention: constr(max_length=64)
    hours_absent: float = 0.0

class PhotoAttachment(BaseModel):
    dataUrl: constr(max_length=500_000, pattern=r"^data:image/(jpeg|png|webp);base64,")
    width: Optional[int] = None
    height: Optional[int] = None

class VoiceAttachment(BaseModel):
    dataUrl: constr(max_length=2_000_000, pattern=r"^data:audio/(webm|mp4|ogg);base64,")
    mime: Optional[constr(max_length=32)] = "audio/webm"

class SubmitEntryRequest(BaseModel):
    user_id: constr(max_length=64)
    content: constr(max_length=2000)
    mood: constr(max_length=64)
    intention: constr(max_length=64)
    photos: Optional[List[PhotoAttachment]] = Field(None, max_length=3)
    voice: Optional[VoiceAttachment] = None

class PostInsightRequest(BaseModel):
    content: constr(max_length=2000)
    mood: constr(max_length=64)
    day_number: int = 1

class GraceRequest(BaseModel):
    days_missed: int = 1
    streak_before: int = 1
    last_emotion: constr(max_length=64) = ""
    days_away: int = 1

class InsightsRequest(BaseModel):
    user_id: constr(max_length=64)

class YearlyInsightsRequest(BaseModel):
    total_mornings: int
    dominant_emotion: constr(max_length=64)
    year_word: constr(max_length=64)
    fullest_month: constr(max_length=32)
    top_emotions: List[constr(max_length=64)] = Field(default_factory=list, max_length=20)
    longest_entry_excerpt: Optional[constr(max_length=500)] = ""

class ReflectionRequest(BaseModel):
    mood: constr(max_length=64)
    intention: Optional[constr(max_length=64)] = ""
    name: Optional[constr(max_length=64)] = ""

class MonthlyReflectionRequest(BaseModel):
    month_name: constr(max_length=32)
    mornings: int
    dominant: constr(max_length=64)
    month_word: constr(max_length=64)
    top_emotions: List[constr(max_length=64)] = Field(default_factory=list, max_length=20)

class UserRegisterRequest(BaseModel):
    user_id: constr(max_length=64)
    email: EmailStr
    name: Optional[constr(max_length=64)] = ""
    birthday: Optional[constr(max_length=16)] = ""

class LinkRequestBody(BaseModel):
    user_id: constr(max_length=64)
    user_email: EmailStr
    nickname: constr(max_length=60)
    target_email: EmailStr

class LinkAcceptBody(BaseModel):
    link_id: constr(max_length=64)
    user_id: constr(max_length=64)

class LinkDeclineBody(BaseModel):
    link_id: constr(max_length=64)
    user_id: constr(max_length=64)

# ── Routes ──
@app.get("/health")
def health():
    return {"status": "ok", "app": "GratitudeChain"}

@app.post("/open-app")
def open_app(request: OpenAppRequest):
    result = handle_open_app(
        user_id=request.user_id,
        mood=request.mood,
        intention=request.intention,
        hours_absent=request.hours_absent
    )
    return result

@app.post("/submit-entry")
@limiter.limit("30/minute")
def submit_entry(request: Request, body: SubmitEntryRequest):
    photos_payload = [p.dict() for p in (body.photos or [])]
    voice_payload  = body.voice.dict() if body.voice else None
    result = handle_submit_entry(
        user_id=body.user_id,
        content=body.content,
        mood=body.mood,
        intention=body.intention,
        photos=photos_payload,
        voice=voice_payload,
    )
    return result

@app.post("/post-insight")
@limiter.limit("20/minute")
def post_insight(request: Request, body: PostInsightRequest):
    try:
        insight = generate_post_insight(
            content=body.content,
            mood=body.mood,
            day_number=body.day_number
        )
        return {"success": True, "insight": insight}
    except Exception:
        log.exception("/post-insight failed")
        return {"success": False, "insight": ""}

@app.post("/grace-message")
@limiter.limit("10/minute")
def grace_message(request: Request, body: GraceRequest):
    try:
        message = generate_grace_message(
            days_missed=body.days_missed,
            streak_before=body.streak_before,
            last_emotion=body.last_emotion,
            days_away=body.days_away
        )
        return {"success": True, "message": message}
    except Exception:
        log.exception("/grace-message failed")
        return {"success": False, "message": ""}

@app.post("/monthly-reflection")
@limiter.limit("5/minute")
def monthly_reflection(request: Request, req: MonthlyReflectionRequest):
    """
    One-sentence reflection for the month-end ceremony overlay.
    Fails quietly — frontend falls back to PORTRAIT_MESSAGES.
    """
    try:
        text = get_monthly_reflection(
            month_name=req.month_name,
            mornings=req.mornings,
            dominant=req.dominant,
            month_word=req.month_word,
            top_emotions=req.top_emotions or [],
        )
        return {"success": bool(text), "reflection": text}
    except Exception:
        log.exception("/monthly-reflection failed")
        return {"success": False, "reflection": ""}

# ── User registration — creates / updates a user doc keyed by user_id
# with an email so they become discoverable for alongside linking. ──
@app.post("/user/register")
@limiter.limit("5/hour")
def user_register(request: Request, req: UserRegisterRequest):
    try:
        from db import register_user
        doc = register_user(
            user_id=req.user_id,
            email=req.email,
            name=req.name or "",
            birthday=req.birthday or "",
        )
        return {"ok": True, "email": doc.get("email","")}
    except ValueError as ve:
        # Email already registered to a different user_id.
        if str(ve) == "email-taken":
            return {"ok": False, "reason": "email-taken"}
        log.exception("/user/register validation failed")
        return {"ok": False}
    except Exception:
        log.exception("/user/register failed")
        return {"ok": False}

# ── Walking-alongside: email-based linking, Cosmos-backed. ──
# Privacy: /link/request always returns {ok:true} regardless of whether the
# target email matches a known user. This prevents email enumeration. If the
# target exists, they'll see the invitation on their /link/pending call.
@app.post("/link/request")
@limiter.limit("10/hour")
def link_request(request: Request, req: LinkRequestBody):
    try:
        from db import create_link_request
        create_link_request(
            requester_id=req.user_id,
            requester_email=req.user_email,
            requester_nickname=req.nickname or "",
            target_email=req.target_email,
        )
        return {"ok": True}
    except Exception:
        log.exception("/link/request failed")
        # Still return ok — don't leak infrastructure state either
        return {"ok": True}

@app.get("/link/pending")
def link_pending(user_id: str):
    # Caller passes their own user_id; server derives the email from the users
    # container. Prevents harvesting anyone's invites by knowing their email.
    try:
        from db import get_user_email, list_pending_links_for
        email = get_user_email(user_id)
        if not email:
            # User hasn't registered an email yet — no invites are addressable to them.
            return {"ok": True, "pending": []}
        links = list_pending_links_for(email)
        # Strip requester's raw email from the payload — only show nickname until accepted
        slim = [
            {
                "id": L["id"],
                "requester_nickname": L.get("requester_nickname",""),
                "created_at": L.get("created_at",""),
            }
            for L in links
        ]
        return {"ok": True, "pending": slim}
    except Exception:
        log.exception("/link/pending failed")
        return {"ok": False, "pending": []}

@app.get("/link/active")
def link_active(user_id: str):
    try:
        from db import list_active_links_for
        links = list_active_links_for(user_id)
        # Slim projection — strip raw emails + Cosmos internal metadata
        # (_etag, _rid, _ts, _self, _attachments) from the client payload.
        slim = [
            {
                "id": L["id"],
                "role": "requester" if L.get("requester_user_id") == user_id else "target",
                "partner_nickname": L.get("requester_nickname", ""),
                "accepted_at": L.get("accepted_at", ""),
            }
            for L in links
        ]
        return {"ok": True, "links": slim}
    except Exception:
        log.exception("/link/active failed")
        return {"ok": False, "links": []}

@app.post("/link/accept")
def link_accept(req: LinkAcceptBody):
    try:
        from db import accept_link, get_user_email
        email = get_user_email(req.user_id)
        if not email:
            return {"ok": False, "reason": "no-email-on-file"}
        result = accept_link(req.link_id, req.user_id, email)
        return result
    except Exception:
        log.exception("/link/accept failed")
        return {"ok": False, "reason": "server-error"}

@app.post("/link/decline")
def link_decline(req: LinkDeclineBody):
    try:
        from db import decline_link, get_user_email
        email = get_user_email(req.user_id)
        if not email:
            return {"ok": False, "reason": "no-email-on-file"}
        result = decline_link(req.link_id, email)
        return result
    except Exception:
        log.exception("/link/decline failed")
        return {"ok": False}

@app.post("/reflection")
@limiter.limit("20/minute")
def reflection(request: Request, req: ReflectionRequest):
    """
    Live reflection paragraph for the insight screen.
    Shown after arrival, before journaling.
    Fails quietly — frontend falls back to hardcoded INSIGHTS.
    """
    try:
        text = get_emotion_insight(mood=req.mood, intention=req.intention or "", name=req.name or "")
        return {"success": bool(text), "insight": text}
    except Exception:
        log.exception("/reflection failed")
        return {"success": False, "insight": ""}

# ── DEBUG — Cosmos reachability + Azure Foundry round-trip. ──
# Gated behind GC_DEBUG=1 so the routes aren't even registered in production.
if os.getenv("GC_DEBUG") == "1":
    @app.get("/debug/cosmos")
    def debug_cosmos():
        import traceback
        try:
            from db import entries_container, users_container, memory_container
            # a trivial round-trip: count items (small DB = fast)
            def count(container):
                q = list(container.query_items(
                    query="SELECT VALUE COUNT(1) FROM c",
                    enable_cross_partition_query=True
                ))
                return q[0] if q else 0
            return {
                "ok": True,
                "cosmos_database_env": os.getenv("COSMOS_DATABASE", "NOT SET"),
                "connection_string_set": bool(os.getenv("COSMOS_CONNECTION_STRING")),
                "entries_count": count(entries_container),
                "users_count": count(users_container),
                "memory_count": count(memory_container),
            }
        except Exception as e:
            return {
                "ok": False,
                "cosmos_database_env": os.getenv("COSMOS_DATABASE", "NOT SET"),
                "connection_string_set": bool(os.getenv("COSMOS_CONNECTION_STRING")),
                "error_type": type(e).__name__,
                "error_msg": str(e),
                "trace": traceback.format_exc(),
            }

    @app.get("/debug/reflection")
    def debug_reflection(mood: str = "calm"):
        import traceback
        from agents.reflection_agent import get_client
        try:
            client = get_client()
            response = client.complete(
                model=os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME"),
                messages=[
                    {"role": "system", "content": "You are a warm companion. One short sentence."},
                    {"role": "user", "content": f"User feels {mood}. Reflect."}
                ]
            )
            return {
                "ok": True,
                "endpoint_env": os.getenv("FOUNDRY_PROJECT_ENDPOINT", "NOT SET"),
                "model_env": os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME", "NOT SET"),
                "response": response.choices[0].message.content,
            }
        except Exception as e:
            return {
                "ok": False,
                "endpoint_env": os.getenv("FOUNDRY_PROJECT_ENDPOINT", "NOT SET"),
                "model_env": os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME", "NOT SET"),
                "error_type": type(e).__name__,
                "error_msg": str(e),
                "trace": traceback.format_exc(),
            }

@app.post("/yearly-insights")
@limiter.limit("2/minute")
async def yearly_insights(request: Request, req: YearlyInsightsRequest):
    try:
        data = req.dict()
        return get_yearly_insights(data)
    except Exception:
        log.exception("/yearly-insights failed")
        raise

@app.post("/monthly-insights")
def monthly_insights(request: InsightsRequest):
    try:
        return handle_monthly_insights(request.user_id)
    except Exception:
        log.exception("/monthly-insights failed")
        raise