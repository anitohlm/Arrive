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