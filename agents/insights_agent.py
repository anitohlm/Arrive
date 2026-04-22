import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.identity import DefaultAzureCredential
from db import get_recent_entries

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

def generate_portrait(user_id: str) -> str:
    # Get last 30 entries from Cosmos DB
    entries = get_recent_entries(user_id, limit=30)

    if not entries:
        return "No entries yet! Start your gratitude chain today."

    # Format entries for AI
    entries_text = "\n".join([
        f"Day {e.get('dayNumber', '?')}: {e.get('content', '')}"
        for e in entries
    ])

    client = get_client()

    response = client.complete(
        model=os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME"),
        messages=[
            SystemMessage(
                content="""You are a thoughtful insights analyst for Arrive.
Analyze the user's gratitude entries from the past month.
Identify patterns and generate a warm Gratitude Portrait.
Format your response exactly like this:

🌟 Top themes: [3 recurring themes]
👥 People who matter: [most mentioned people or 'yourself' if none]
😊 Overall mood: [emotional tone in a few words]
✨ Your month in one word: [one powerful word]
💌 A message for you: [one warm, personal sentence]

Be specific, warm, and personal. Never generic."""
            ),
            UserMessage(
                content=f"Here are my gratitude entries:\n{entries_text}\n\nGenerate my Gratitude Portrait."
            )
        ]
    )

    return response.choices[0].message.content