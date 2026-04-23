import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.identity import DefaultAzureCredential

from .user_context import context_preamble


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

def get_exercise(mood: str, user_context: dict | None = None) -> str:
    client = get_client()

    base_system = """You are a calm, supportive mindfulness guide for Arrive.
When given a user's mood, guide them through a short breathing
or grounding exercise.

ADAPTATION RULES:
- If the user has been anxious or frustrated for 3+ days in a row, SWITCH
  from breathing to a grounding exercise (5-4-3-2-1 senses or body-scan).
  Repeated breathwork when anxiety is already a pattern can worsen it;
  grounding pulls them back into the body.
- If the user has been sad/heavy/exhausted for 3+ days, offer a gentle
  body-scan or a soft self-compassion phrase, NOT energetic breathing.
- Otherwise, default to a short breathing exercise.

Give clear numbered steps. Maximum 5 steps.
Be calm, gentle, and never clinical.
No medical advice ever."""

    system_content = base_system + context_preamble(user_context or {})

    response = client.complete(
        model=os.getenv("FOUNDRY_MODEL_DEPLOYMENT_NAME"),
        messages=[
            SystemMessage(content=system_content),
            UserMessage(
                content=f"User mood: {mood}. Guide me through a short mindfulness exercise."
            )
        ]
    )

    return response.choices[0].message.content