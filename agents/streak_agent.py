import os
from datetime import datetime, date
from db import get_user, save_user

MILESTONE_DAYS = [7, 14, 30, 60, 100, 365]

def process_streak(user_id: str) -> dict:
    user = get_user(user_id)
    today = date.today()
    last_entry = user.get("lastEntryDate")
    streak = user.get("streak", 0)
    grace_used = user.get("graceUsed", 0)

    if last_entry:
        last_date = date.fromisoformat(last_entry)
        days_since = (today - last_date).days

        if days_since == 0:
            # Already logged today
            return {
                "streak": streak,
                "milestone": None,
                "message": "Already logged today!",
                "already_logged": True
            }
        elif days_since == 1:
            # Consecutive day — streak grows
            streak += 1
        elif days_since == 2 and grace_used < 1:
            # Use grace day — chain stays intact
            streak += 1
            grace_used += 1
            print("💛 Grace day used!")
        else:
            # Chain broken — restart
            streak = 1
            grace_used = 0
            print("🔗 Chain restarted")
    else:
        # First entry ever
        streak = 1

    # Check for milestone
    milestone = streak if streak in MILESTONE_DAYS else None

    # Save updated user
    user["streak"] = streak
    user["lastEntryDate"] = str(today)
    user["graceUsed"] = grace_used
    save_user(user)

    return {
        "streak": streak,
        "milestone": milestone,
        "already_logged": False,
        "message": f"Day {streak} — keep going! 🔗"
    }