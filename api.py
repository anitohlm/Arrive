import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from orchestrator import handle_open_app, handle_submit_entry, handle_monthly_insights
from agents.insight_agent import generate_post_insight
from agents.grace_agent import generate_grace_message
from agents.yearly_insights_agent import get_yearly_insights
from agents.reflection_agent import get_emotion_insight, get_monthly_reflection
from pydantic import BaseModel
from typing import List, Optional

load_dotenv()

app = FastAPI(title="GratitudeChain API", version="1.0.0")

# Allow the static preview (port 8765) + local dev origins to talk to the API.
# In production, replace with the actual domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8765",
        "http://127.0.0.1:8765",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request models ──
class OpenAppRequest(BaseModel):
    user_id: str
    mood: str
    intention: str
    hours_absent: float = 0.0

class SubmitEntryRequest(BaseModel):
    user_id: str
    content: str
    mood: str
    intention: str

class PostInsightRequest(BaseModel):
    content: str
    mood: str
    day_number: int = 1

class GraceRequest(BaseModel):
    days_missed: int = 1
    streak_before: int = 1
    last_emotion: str = ""
    days_away: int = 1

class InsightsRequest(BaseModel):
    user_id: str

class YearlyInsightsRequest(BaseModel):
    total_mornings: int
    dominant_emotion: str
    year_word: str
    fullest_month: str
    top_emotions: List[str]
    longest_entry_excerpt: Optional[str] = ""

class ReflectionRequest(BaseModel):
    mood: str
    intention: Optional[str] = ""
    name: Optional[str] = ""

class MonthlyReflectionRequest(BaseModel):
    month_name: str
    mornings: int
    dominant: str
    month_word: str
    top_emotions: List[str] = []

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
def submit_entry(request: SubmitEntryRequest):
    result = handle_submit_entry(
        user_id=request.user_id,
        content=request.content,
        mood=request.mood,
        intention=request.intention
    )
    return result

@app.post("/post-insight")
def post_insight(request: PostInsightRequest):
    try:
        insight = generate_post_insight(
            content=request.content,
            mood=request.mood,
            day_number=request.day_number
        )
        return {"success": True, "insight": insight}
    except Exception as e:
        return {"success": False, "insight": "", "error": str(e)}

@app.post("/grace-message")
def grace_message(request: GraceRequest):
    try:
        message = generate_grace_message(
            days_missed=request.days_missed,
            streak_before=request.streak_before,
            last_emotion=request.last_emotion,
            days_away=request.days_away
        )
        return {"success": True, "message": message}
    except Exception as e:
        return {"success": False, "message": "", "error": str(e)}

@app.post("/monthly-reflection")
def monthly_reflection(req: MonthlyReflectionRequest):
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
    except Exception as e:
        return {"success": False, "reflection": "", "error": str(e)}

@app.post("/reflection")
def reflection(req: ReflectionRequest):
    """
    Live reflection paragraph for the insight screen.
    Shown after arrival, before journaling.
    Fails quietly — frontend falls back to hardcoded INSIGHTS.
    """
    try:
        text = get_emotion_insight(mood=req.mood, intention=req.intention or "", name=req.name or "")
        return {"success": bool(text), "insight": text}
    except Exception as e:
        return {"success": False, "insight": "", "error": str(e)}

# ── DEBUG — Cosmos reachability. Remove before production. ──
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

# ── DEBUG — surfaces the real Azure error. Remove before production. ──
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
async def yearly_insights(req: YearlyInsightsRequest):
    data = req.dict()
    result = get_yearly_insights(data)
    return result

@app.post("/monthly-insights")
def monthly_insights(request: InsightsRequest):
    result = handle_monthly_insights(request.user_id)
    return result