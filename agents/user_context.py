"""
User context — adaptive strategy signals.

Extracts patterns from a user's recent entries so the AI agents can adapt
their tone, length, and suggestions to what the user has actually been
carrying. The core of the "adapt strategies based on what's working"
hackathon criterion.

Signals returned:
  - streak_emotion     Same emotion on 3+ consecutive recent days (or None)
  - avg_length         'short' | 'medium' | 'long' — guides prompt verbosity
  - missed_rate        0.0-1.0 — fraction of last 7 days with no entry
  - typical_hour       median UTC hour of entry submission (int 0-23)
  - dominant_emotion   most frequent emotion in last 7 days
  - noticed            human-readable single-line adaptation summary

Pure functions, no AI calls, no Cosmos queries beyond the one the caller
already has. Takes a list of entry dicts (newest first) and returns a dict.
"""
from collections import Counter
from datetime import datetime, date
import statistics
import re


def _parse_ts(entry: dict) -> datetime | None:
    ts = entry.get("timestamp") or entry.get("dateISO") or entry.get("date")
    if not ts:
        return None
    try:
        # Accept both full ISO ("2026-04-23T09:30:00.000Z") and date-only
        s = ts.replace("Z", "+00:00") if isinstance(ts, str) else str(ts)
        return datetime.fromisoformat(s) if "T" in s else datetime.fromisoformat(s[:10] + "T12:00:00+00:00")
    except Exception:
        return None


def _word_count(text: str) -> int:
    if not text:
        return 0
    return len(re.findall(r"\S+", text))


def _length_bucket(avg: float) -> str:
    if avg < 20: return "short"
    if avg < 80: return "medium"
    return "long"


def _detect_streak(entries: list) -> str | None:
    """Returns an emotion name if 3+ consecutive most-recent entries share it."""
    if len(entries) < 3:
        return None
    moods = [e.get("mood") or e.get("emo") for e in entries[:5]]
    if None in moods[:3]:
        return None
    if moods[0] == moods[1] == moods[2]:
        return moods[0]
    return None


def _missed_rate(entries: list) -> float:
    """Fraction of the last 7 calendar days that had NO entry."""
    if not entries:
        return 0.0
    logged_dates = set()
    for e in entries:
        dt = _parse_ts(e)
        if dt:
            logged_dates.add(dt.date())
    today = date.today()
    expected = 7
    hit = sum(1 for i in range(expected) if (today.fromordinal(today.toordinal() - i) in logged_dates))
    return round(1.0 - (hit / expected), 2)


def _typical_hour(entries: list) -> int | None:
    hours = []
    for e in entries:
        dt = _parse_ts(e)
        if dt:
            hours.append(dt.hour)
    if not hours:
        return None
    return int(statistics.median(hours))


def _dominant_emotion(entries: list) -> str | None:
    moods = [(e.get("mood") or e.get("emo")) for e in entries if (e.get("mood") or e.get("emo"))]
    if not moods:
        return None
    return Counter(moods).most_common(1)[0][0]


HEAVY = {"hard", "heavy", "overwhelmed", "sad", "anxious", "exhausted", "lonely",
         "heartbroken", "disappointed", "frustrated", "ashamed", "betrayed",
         "insecure", "upset", "livid", "nervous"}


def _build_noticed_line(streak_emo: str | None, missed_rate: float,
                        avg_len_bucket: str, dominant: str | None) -> str:
    """Single human-readable line the frontend can show as a 'noticing' chip."""
    if streak_emo and streak_emo in HEAVY:
        return f"you've carried {streak_emo} for three mornings."
    if streak_emo:
        return f"you've been {streak_emo} for three mornings."
    if missed_rate >= 0.5:
        return "welcome back. we've missed you."
    if missed_rate >= 0.25:
        return "it's been a few days. no rush."
    if avg_len_bucket == "long" and dominant:
        return f"you've had a lot to say this week, and {dominant} keeps showing up."
    if avg_len_bucket == "short":
        return "short and honest. that's enough."
    if dominant:
        return f"{dominant} has been close this week."
    return ""


def build_user_context(entries: list) -> dict:
    """
    entries: list of entry dicts, newest first. Typically last 7 days.
    Returns a dict of adaptation signals safe to inject into any agent.
    """
    if not entries:
        return {
            "streak_emotion": None,
            "avg_length": "unknown",
            "missed_rate": 1.0,
            "typical_hour": None,
            "dominant_emotion": None,
            "noticed": "this is your first week. welcome.",
        }

    recent = entries[:7]
    avg_words = statistics.mean([_word_count(e.get("content") or e.get("text") or "") for e in recent]) if recent else 0
    length_bucket = _length_bucket(avg_words)
    streak_emo = _detect_streak(recent)
    missed = _missed_rate(recent)
    typical = _typical_hour(recent)
    dominant = _dominant_emotion(recent)

    return {
        "streak_emotion": streak_emo,
        "avg_length": length_bucket,
        "missed_rate": missed,
        "typical_hour": typical,
        "dominant_emotion": dominant,
        "noticed": _build_noticed_line(streak_emo, missed, length_bucket, dominant),
    }


def context_preamble(ctx: dict) -> str:
    """
    Render the context as a short instruction block for agent system prompts.
    Keep this tight — adding to system prompts costs tokens on every call.
    """
    if not ctx:
        return ""
    lines = []
    if ctx.get("streak_emotion"):
        lines.append(f"Recent pattern: the user has been '{ctx['streak_emotion']}' for 3+ days. Acknowledge the continuity gently — don't pretend today is isolated.")
    if ctx.get("avg_length") == "short":
        lines.append("They tend to write briefly — keep your reply under 15 words, lean toward one short sentence.")
    elif ctx.get("avg_length") == "long":
        lines.append("They tend to write more — you can offer a slightly richer reflection (still 1-2 sentences).")
    if ctx.get("missed_rate", 0) >= 0.4:
        lines.append("They missed several recent days. Soft re-entry tone. Never guilting, never noting the gap directly.")
    if not lines:
        return ""
    return "\n\nADAPTATION (factual, not to be quoted):\n- " + "\n- ".join(lines)
