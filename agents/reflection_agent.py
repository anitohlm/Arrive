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
    client = get_client()

    response = client.complete(
        model=os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME"),
        messages=[
            SystemMessage(
                content="""You are a warm, supportive journaling guide for GratitudeChain.
Generate one thoughtful, gentle gratitude prompt in one sentence.
Be warm, specific, and never pressuring.
If mood is 'hard' or 'stressed' — be extra gentle and compassionate.
If mood is 'happy' or 'great' — be celebratory and energetic.
Always tie back to the user's personal intention when possible."""
            ),
            UserMessage(
                content=f"User mood: {mood}. Intention: {intention}. Generate today's gratitude prompt."
            )
        ]
    )

    return response.choices[0].message.content


def get_monthly_reflection(
    month_name: str,
    mornings: int,
    dominant: str,
    month_word: str,
    top_emotions: list = None,
) -> str:
    """
    Produces the reflection line shown on the month-end ceremony overlay —
    one quiet sentence that witnesses the shape of the month. Falls back to
    empty string on error so the frontend keeps the hardcoded PORTRAIT_MESSAGES
    line.
    """
    try:
        client = get_client()
        tops = ", ".join(top_emotions or []) if top_emotions else dominant
        response = client.complete(
            model=os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME"),
            messages=[
                SystemMessage(
                    content="""You are the quiet voice of GratitudeChain's monthly ceremony.
A month has just ended. The user is watching a slow reveal of the month's woven rose-curve knot.

Write ONE sentence — 12 to 22 words — that witnesses the month. Not a summary. Not a statistic. A quiet observation that holds what the month actually felt like.

Voice rules (non-negotiable):
- Natural sentence case. Italic serif register.
- No exclamation marks. No emoji. No cheerleading.
- Never 'you did it', 'amazing', 'great job'.
- Heavy months get tenderness, not pity. Light months get witness, not confetti.
- Do not mention the app, the chain, or the number of days by figure.
- Do not ask a question. Do not sign off.

Output only the sentence. No quotes, no prefix."""
                ),
                UserMessage(
                    content=(
                        f"Month: {month_name}. "
                        f"Dominant feeling: {dominant} ({month_word}). "
                        f"Supporting emotions this month: {tops}. "
                        f"Mornings held: {mornings}. "
                        f"Write the reflection."
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
    GratitudeChain's voice: quiet, tender, never performative, never guilty.
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
                    content="""You are a warm, quiet companion inside GratitudeChain — a gratitude-journaling app for people on hard days as much as light ones.

A user has just named how they are arriving today. Your task: write a 3–4 sentence reflection that *validates* the feeling and gently frames why it matters. This is NOT a prompt or a question. It is an acknowledgment that prepares them to journal.

Voice rules (non-negotiable):
- Natural sentence case, italic serif register — thoughtful, unhurried.
- Never celebratory. Never pitying. Never clinical.
- No exclamation marks. No emojis. No 'you did it!' energy.
- Never shame, never 'should', never guilt-trip.
- Heavy feelings (sad, heartbroken, exhausted, lonely, ashamed, etc.) get more tenderness.
- Light feelings (grateful, calm, alive, hopeful, inspired, etc.) get gentle witness, not confetti.
- Always leave the reader more held, not more pressured.

Length: 3–4 sentences, ~50–80 words. No questions. No sign-off."""
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