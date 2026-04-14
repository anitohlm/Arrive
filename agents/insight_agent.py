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


def generate_post_insight(content: str, mood: str, day_number: int) -> str:
    """
    Generate a personalized AI insight based on the user's journal entry.
    """
    client = get_client()

    response = client.complete(
        model=os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME"),
        messages=[
            SystemMessage(
                content="""You are a thoughtful insights analyst for GratitudeChain.
You will receive a gratitude entry from the user.
Identify patterns and generate a warm, personal insight.

Format your response exactly like this:

🌟 Top themes: [2-3 recurring themes from the entry]
😊 Mood: [emotional tone in a few words]
✦ Today in one word: [one powerful word]
💌 A message for you: [one warm personal sentence]

Be specific, warm, and personal. Never generic.
Reference specific words, feelings, or images the user used in their entry."""
            ),
            UserMessage(
                content=f"Mood: {mood}\nDay {day_number} of their streak.\n\nTheir entry:\n\"{content}\""
            )
        ]
    )

    return response.choices[0].message.content
