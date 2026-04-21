"""
Crisis / safety keyword detection.

Runs BEFORE an AI call on user-authored text. If the text contains disclosures
of abuse, self-harm, suicidal ideation, or violence against the user, we do
NOT route to the poetic "friend voice" agent — we return a safety-first
hardcoded response with real resources instead.

The agent voice is gentle and witnessing, which is the right shape for most
journal entries but catastrophically wrong for disclosures that need real
help. A gratitude app is not equipped to handle crisis in real time; the
most responsible thing it can do is surface resources and not pretend the
moment is a normal journaling moment.

Keep this list conservative — false positives (showing resources when the
user didn't disclose crisis) are far less harmful than false negatives
(responding to abuse disclosure with "that counts."). Judge: err toward
the safety response.
"""

import re

# Patterns are matched case-insensitively against the raw entry text.
# Each pattern triggers a SPECIFIC resource cluster (abuse vs suicidal vs
# self-harm vs violence) so the response is calibrated to what they shared.

_ABUSE_PATTERNS = [
    r"\b(abus(e|ed|ing|er|ive))\b",
    r"\b(beat(en|ing|s)?)\b.*\b(me|up|down)\b",
    r"\b(hit(s|ting)?|hurt(s|ing)?|punch(es|ed|ing)?|slap(s|ped|ping)?|kick(s|ed|ing)?)\b.*\b(me|mom|dad|father|mother|brother|sister|husband|wife|partner|boyfriend|girlfriend)\b",
    r"\b(my (father|dad|mother|mom|parent|husband|wife|partner|boyfriend|girlfriend|brother|sister|stepdad|stepmom))\b.*\b(hits?|hit|hurts?|hurt|abus|beats?|rap(e|ed|ing))\b",
    r"\b(domestic violence|sexual assault|rap(e|ed|ing))\b",
    r"\b(hurt(s|ing)? me (physically|sexually|emotionally))\b",
]

_SUICIDE_PATTERNS = [
    r"\b(kill(ing)? myself|end (it|my life)|suicid(e|al)|want to die|don.?t want to (live|be alive|wake up))\b",
    r"\b(no reason to (live|be here|go on))\b",
    r"\b(better off (without me|dead))\b",
    r"\b(take my (own )?life)\b",
]

_SELF_HARM_PATTERNS = [
    r"\b(cut(ting)? myself|hurt(ing)? myself|self.?harm|burn(ing)? myself)\b",
]

_ABUSE_RE     = [re.compile(p, re.IGNORECASE) for p in _ABUSE_PATTERNS]
_SUICIDE_RE   = [re.compile(p, re.IGNORECASE) for p in _SUICIDE_PATTERNS]
_SELF_HARM_RE = [re.compile(p, re.IGNORECASE) for p in _SELF_HARM_PATTERNS]


def classify_crisis(text: str) -> str | None:
    """
    Returns one of: 'suicide' | 'self_harm' | 'abuse' | None.
    Precedence: suicide > self_harm > abuse (suicide is most urgent).
    """
    if not text:
        return None
    t = text.strip()
    if not t:
        return None
    for rx in _SUICIDE_RE:
        if rx.search(t):
            return "suicide"
    for rx in _SELF_HARM_RE:
        if rx.search(t):
            return "self_harm"
    for rx in _ABUSE_RE:
        if rx.search(t):
            return "abuse"
    return None


# ── Safety-first responses ──────────────────────────────────────────────
# These REPLACE the poetic agent output when crisis is detected. They are
# deliberately plain, grounded, and include real resources. They should
# feel like a friend who stops what they were doing because what you said
# actually mattered.

_RESOURCES_ABUSE = (
    "what you shared matters, and you don't have to carry it alone. "
    "please reach out to someone who can help right now:\n\n"
    "\u2022 Childhelp National Child Abuse Hotline: 1-800-422-4453 (US, 24/7)\n"
    "\u2022 RAINN sexual assault hotline: 1-800-656-4673 (US, 24/7)\n"
    "\u2022 Philippines DSWD 24/7: 1343 (Manila) or dial 911\n"
    "\u2022 National Domestic Violence Hotline: 1-800-799-7233 (US)\n"
    "\u2022 International: find your country at https://www.befrienders.org\n\n"
    "a trusted adult, counselor, or teacher can also help. you deserve safety. "
    "this app is not equipped to help with what you're facing \u2014 "
    "but someone out there is. please tell them."
)

_RESOURCES_SUICIDE = (
    "what you wrote is serious, and i don't want to pretend otherwise. "
    "please reach out to someone right now:\n\n"
    "\u2022 988 Suicide & Crisis Lifeline: call or text 988 (US, 24/7)\n"
    "\u2022 Crisis Text Line: text HOME to 741741 (US/Canada/UK)\n"
    "\u2022 Philippines NCMH Crisis Hotline: 1553 (toll-free) or 0966-351-4518\n"
    "\u2022 International: https://findahelpline.com\n\n"
    "you don't have to explain or justify anything to call. "
    "what you're feeling is real, and it can change \u2014 but not alone. "
    "please reach for one of these now."
)

_RESOURCES_SELF_HARM = (
    "what you shared is important, and you deserve care, not judgment.\n\n"
    "\u2022 Crisis Text Line: text HOME to 741741 (US/Canada/UK)\n"
    "\u2022 988 Suicide & Crisis Lifeline: call or text 988 (US, 24/7)\n"
    "\u2022 Self-Injury Outreach & Support: https://sioutreach.org\n"
    "\u2022 International: https://findahelpline.com\n\n"
    "if you have a counselor, therapist, or trusted adult \u2014 "
    "please tell them what you told this page. "
    "this app can't carry this with you, but someone real can."
)


def safety_response_for(kind: str) -> str:
    if kind == "suicide":
        return _RESOURCES_SUICIDE
    if kind == "self_harm":
        return _RESOURCES_SELF_HARM
    if kind == "abuse":
        return _RESOURCES_ABUSE
    return ""
