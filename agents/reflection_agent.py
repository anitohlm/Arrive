import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.identity import DefaultAzureCredential

def get_client():
    credential = DefaultAzureCredential()
    base_endpoint = os.getenv("FOUNDRY_PROJECT_ENDPOINT")
    resource_url = base_endpoint.split("/api/projects")[0]
    inference_endpoint = f"{resource_url}/models"

    return ChatCompletionsClient(
        endpoint=inference_endpoint,
        credential=credential,
        credential_scopes=["https://cognitiveservices.azure.com/.default"]
    )

def get_daily_prompt(mood: str, intention: str) -> str:
    # Wrap in try/except so content-filter 400s or Foundry hiccups don't
    # crash the endpoint. Empty string tells the frontend to keep its
    # hardcoded fallback prompt.
    try:
        return _get_daily_prompt_impl(mood, intention)
    except Exception:
        return ""


def _get_daily_prompt_impl(mood: str, intention: str) -> str:
    client = get_client()

    response = client.complete(
        model=os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME"),
        messages=[
            SystemMessage(
                content="""You write one short journal prompt for a gratitude app. A close friend's voice, not a therapist's or coach's.

Shape: a short acknowledgment of the mood, then a gentle invitation to name one small thing. Lowercase sentence case. Natural speech.

For heavy moods (hard, heavy, overwhelmed, sad, anxious, exhausted, lonely, etc.), lead with tenderness. Example shape: "today is heavy. name one small thing that was still here."

For in-between moods (quiet, numb, foggy, restless, lost, bored, etc.), normalize it. Example shape: "fog is okay. what's one thing close enough to touch?"

For light moods (grateful, calm, alive, hopeful, etc.), offer quiet witness. Example shape: "you arrived already full. name what is most worth holding."

Length: 1-2 short sentences, under 30 words. No emojis. No exclamation marks. No worksheet language ("reflect on", "identify", "consider").

Output only the prompt itself."""
            ),
            UserMessage(
                content=f"User mood: {mood}. Intention: {intention}. Write today's prompt."
            )
        ]
    )

    text = (response.choices[0].message.content or "").strip()
    # strip enclosing quotes if the model wraps its reply
    if len(text) >= 2 and text[0] in '"\u201c\u2018' and text[-1] in '"\u201d\u2019':
        text = text[1:-1].strip()
    return text


def get_monthly_reflection(
    month_name: str,
    mornings: int,
    dominant: str,
    month_word: str,
    top_emotions: list = None,
    name: str = "",
) -> str:
    """
    Produces the reflection PARAGRAPH shown on the month-end ceremony overlay.
    3 to 5 short sentences witnessing the shape of the month — mirrors the
    yearly witness voice at a smaller scale. Returns empty string on error;
    the frontend falls back to its rich hardcoded paragraph.
    """
    try:
        client = get_client()
        tops = ", ".join(top_emotions or []) if top_emotions else dominant
        # sanitize name — only clean alphabetic strings get into the prompt
        clean_name = (name or "").strip()
        name_piece = ""
        if clean_name and len(clean_name) <= 40 and clean_name.replace(" ", "").replace("-", "").replace("'", "").isalpha():
            name_piece = f"Their name is {clean_name.lower()}. Use their name ONCE, naturally, placed somewhere mid-paragraph — not as a greeting. Do not repeat it."

        response = client.complete(
            model=os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME"),
            messages=[
                SystemMessage(
                    content="""You are the quiet voice of Arrive's monthly ceremony.
A month has just ended. The user is watching a slow reveal of the month's woven rose-curve pendant — the geometric shape of their emotions for that month.

Write a 3–5 sentence PARAGRAPH that witnesses the month. Sentence-case throughout, proper nouns capitalized, sentence starts capitalized. Flowing prose — no bullet points, no list structure.

Move through these in order:
  (a) name the shape of the month using the dominant emotion and its word
  (b) honor how it actually felt — the weight or the lightness of it
  (c) if contrasting emotions sat side by side (e.g. hopeful + heavy), acknowledge that honestly, without resolving it
  (d) close with a quiet witness note — never a silver lining, never cheerleading

Voice rules (non-negotiable):
- Italic serif register — thoughtful, unhurried
- No exclamation marks. No emoji. No "amazing" / "you did it" / "congrats"
- No therapist-speak ("I hear you", "it sounds like")
- Heavy months get tenderness, not pity. Light months get witness, not confetti.
- Do not mention the app name or the chain by metaphor
- Do not ask a question. Do not sign off.
- Keep sentences varied in length — some short, some longer

Output only the paragraph. No quotes around it, no prefix, no markdown."""
                ),
                UserMessage(
                    content=(
                        f"Month: {month_name}. "
                        f"Dominant feeling: {dominant} ({month_word}). "
                        f"Supporting emotions this month: {tops}. "
                        f"Mornings held: {mornings}. "
                        f"{name_piece} "
                        f"Write the reflection paragraph."
                    )
                )
            ]
        )
        text = (response.choices[0].message.content or "").strip()
        if len(text) >= 2 and text[0] in '"\u201c' and text[-1] in '"\u201d':
            text = text[1:-1].strip()
        return text
    except Exception:
        return ""


def get_emotion_insight(mood: str, intention: str = "", name: str = "") -> str:
    """
    Produces the paragraph shown on the insight screen — a validating, tender
    frame for the user's current emotion. 3–4 short sentences. Must match
    Arrive's voice: quiet, tender, never performative, never guilty.
    Fails to empty string on error — the frontend will fall back to hardcoded.
    """
    try:
        client = get_client()
        who = f"The user goes by {name}. " if name else ""
        intent_line = f"Their intention today is '{intention}'. " if intention else ""
        response = client.complete(
            model=os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME"),
            messages=[
                SystemMessage(
                    content="""You are a warm, quiet companion in a gratitude journaling app. The user has just named how they are arriving today. Write a 3-4 sentence reflection that meets them where they are.

Tone: like a close friend who listens well. Lowercase sentence case is welcome. Natural speech. Tender. Present tense. Use "you" warmly.

For heavy moods (hard, heavy, overwhelmed, sad, anxious, exhausted, lonely, heartbroken, etc.), lead with gentle acknowledgment before offering witness. Example shape: "today is heavy. you came here anyway. that matters."

For in-between moods (quiet, numb, foggy, restless, bored, lost, etc.), normalize the moment. No pressure to feel more than they do. Example shape: "fog doesn't mean lost. you don't owe anyone clarity today."

For light moods (grateful, calm, alive, hopeful, inspired, etc.), offer quiet witness rather than enthusiasm. Example shape: "you arrived already full. that's a whole starting place."

Length: 45-75 words. No questions. No sign-off. No emojis. No exclamation marks.

Output only the reflection itself."""
                ),
                UserMessage(
                    content=f"{who}{intent_line}Today they arrive feeling '{mood}'. Write their reflection."
                )
            ]
        )
        text = (response.choices[0].message.content or "").strip()
        # strip enclosing quotes if the model adds them
        if len(text) >= 2 and text[0] in '"\u201c' and text[-1] in '"\u201d':
            text = text[1:-1].strip()
        return text
    except Exception:
        return ""