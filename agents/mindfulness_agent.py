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

def get_exercise(mood: str) -> str:
    client = get_client()

    response = client.complete(
        model=os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME"),
        messages=[
            SystemMessage(
                content="""You are a calm, supportive mindfulness guide for Arrive.
When given a user's mood, guide them through a short breathing
or grounding exercise.
Give clear numbered steps. Maximum 5 steps.
Be calm, gentle, and never clinical.
No medical advice ever."""
            ),
            UserMessage(
                content=f"User mood: {mood}. Guide me through a short mindfulness exercise."
            )
        ]
    )

    return response.choices[0].message.content