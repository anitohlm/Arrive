import os
import logging
from datetime import datetime, date
from db import get_user, save_user

log = logging.getLogger("gratitudechain.streak")

# Matches frontend MILESTONES in app.html — the UI only celebrates these days.
MILESTONE_DAYS = [7, 100, 200, 250, 300]

def process_streak(user_id: str) -> dict:
    user = get_user(user_id)
    # UTC so streak math aligns with save_entry's UTC timestamp and Cosmos dates.
    today = datetime.utcnow().date()
    last_entry = user.get("lastEntryDate")
    streak = user.get("streak", 0)

    # Monthly grace reset — mirrors db.use_grace_day so both code paths stay in sync.
    current_month = today.strftime("%Y-%m")
    if user.get("graceMonth") != current_month:
        user["graceMonth"] = current_month
        user["graceRemaining"] = 1
        user["graceUsed"] = 0
    grace_remaining = user.get("graceRemaining", 1)

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
        elif days_since == 2 and grace_remaining > 0:
            # Use grace day — chain stays intact
            streak += 1
            user["graceRemaining"] = grace_remaining - 1
            user["graceUsed"] = user.get("graceUsed", 0) + 1
            log.info("grace day used (user=%s, month=%s)", user_id, current_month)
        else:
            # Chain broken — restart. Grace is not refunded; monthly reset handles next month.
            streak = 1
            log.info("chain restarted (user=%s, days_since=%s)", user_id, days_since)
    else:
        # First entry ever
        streak = 1

    # Check for milestone
    milestone = streak if streak in MILESTONE_DAYS else None

    # Save updated user
    user["streak"] = streak
    user["lastEntryDate"] = str(today)
    save_user(user)

    return {
        "streak": streak,
        "milestone": milestone,
        "already_logged": False,
        "message": f"Day {streak} — keep going! 🔗"
    }