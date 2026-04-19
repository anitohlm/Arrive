import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from orchestrator import handle_open_app, handle_submit_entry, handle_monthly_insights
from agents.insight_agent import generate_post_insight
from agents.grace_agent import generate_grace_message
from agents.yearly_insights_agent import get_yearly_insights
from pydantic import BaseModel
from typing import List, Optional

load_dotenv()

app = FastAPI(title="GratitudeChain API", version="1.0.0")

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

@app.post("/yearly-insights")
async def yearly_insights(req: YearlyInsightsRequest):
    data = req.dict()
    result = get_yearly_insights(data)
    return result

@app.post("/monthly-insights")
def monthly_insights(request: InsightsRequest):
    result = handle_monthly_insights(request.user_id)
    return result