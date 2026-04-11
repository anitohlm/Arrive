import os
from dotenv import load_dotenv
from agents.reflection_agent import get_daily_prompt
from agents.streak_agent import process_streak
from agents.memory_agent import resurface_memories
from agents.mindfulness_agent import get_exercise
from agents.insights_agent import generate_portrait
from db import save_entry
from search import index_entry
from datetime import datetime
import uuid

load_dotenv()

def handle_open_app(user_id: str, mood: str, intention: str, hours_absent: float) -> dict:
    """
    Called when user opens the app.
    Returns: daily prompt + memories (if needed) + exercise (if stressed)
    """
    result = {}

    # Always get today's prompt
    result["prompt"] = get_daily_prompt(mood, intention)

    # If hard day or absent 18+ hours — resurface memories
    if mood in ["hard", "stressed", "anxious"] or hours_absent >= 18:
        result["memories"] = resurface_memories(user_id, mood)

    # If stressed or anxious — offer mindfulness exercise
    if mood in ["stressed", "anxious", "hard"]:
        result["exercise"] = get_exercise(mood)

    return result


def handle_submit_entry(user_id: str, content: str, mood: str, intention: str) -> dict:
    """
    Called when user submits their daily gratitude entry.
    Returns: streak info + milestone if any
    """
    # Process streak
    streak_result = process_streak(user_id)

    if streak_result.get("already_logged"):
        return {
            "success": False,
            "message": "Already logged today! Come back tomorrow. 🌙"
        }

    # Save entry to Cosmos DB
    entry = {
        "id": str(uuid.uuid4()),
        "userId": user_id,
        "content": content,
        "mood": mood,
        "intention": intention,
        "dayNumber": streak_result["streak"],
        "timestamp": datetime.utcnow().isoformat()
    }
    save_entry(entry)

    # Index entry in AI Search for memory resurface
    index_entry(entry)

    return {
        "success": True,
        "streak": streak_result["streak"],
        "milestone": streak_result["milestone"],
        "message": streak_result["message"]
    }


def handle_monthly_insights(user_id: str) -> dict:
    """
    Called by Azure Functions on 1st of each month.
    Returns: Gratitude Portrait
    """
    portrait = generate_portrait(user_id)
    return {
        "userId": user_id,
        "portrait": portrait
    }