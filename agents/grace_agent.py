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


def generate_grace_message(days_missed: int, streak_before: int, last_emotion: str = "", days_away: int = 1) -> str:
    """
    Generate a personalized comfort message for a user who missed a day.
    The message should feel like a warm friend welcoming them back.
    """
    client = get_client()

    response = client.complete(
        model=os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME"),
        messages=[
            SystemMessage(
                content="""You are the gentle voice of GratitudeChain — a gratitude journaling app.

A user missed a day (or more) and has come back. Your job is to write a short, warm, personal comfort message that makes them feel welcomed back — not guilty.

Rules:
- Write 2-3 sentences max. Short and tender.
- Never guilt them. Never say "you should have" or "don't let it happen again."
- Acknowledge the gap with compassion. Life happens. That's human.
- Celebrate that they came back. Returning is the hardest part.
- If they missed 1 day: be light and gentle. "You blinked. That's allowed."
- If they missed 2-3 days: be understanding. "A few days away. The chain waited for you."
- If they missed 7+ days: be deeply warm. "You've been gone a while. Welcome home."
- If their last emotion was heavy (hard, heavy, overwhelmed, exhausted, sad): be extra tender.
- If their last emotion was light (grateful, calm, hopeful): be quietly celebratory about their return.
- Mention the chain or knot subtly if natural, but don't force it.
- Write in the voice of a wise, caring friend — not a therapist.

Examples of tone:
- "One day off doesn't undo what you've built. You're here now."
- "The chain didn't break. It just waited."
- "You came back. That's the whole point of this."
- "Some days the only gratitude is showing up again. This is that day."
"""
            ),
            UserMessage(
                content=f"Days missed: {days_missed}\nStreak before the gap: {streak_before} days\nDays since last entry: {days_away}\nLast emotion logged: {last_emotion or 'unknown'}"
            )
        ]
    )

    return response.choices[0].message.content
