import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from orchestrator import handle_open_app, handle_submit_entry, handle_monthly_insights

load_dotenv()

app = FastAPI(title="GratitudeChain API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

class InsightsRequest(BaseModel):
    user_id: str

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

@app.post("/monthly-insights")
def monthly_insights(request: InsightsRequest):
    result = handle_monthly_insights(request.user_id)
    return result