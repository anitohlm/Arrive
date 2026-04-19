import os
import json
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


SYSTEM_PROMPT = """
You are the GratitudeChain year-end reflection agent.
The user has completed a full year of daily gratitude journaling.
You write in the GratitudeChain voice: lowercase, intimate,
poetic but never flowery, honest, never toxic-positive.
Never use the words: journey, amazing, incredible, proud of you,
congratulations, well done, you did it.
Write as if the chain itself is speaking — it witnessed everything,
every morning, every mood, every word. It does not celebrate.
It holds. It remembers.
"""


def build_prompt(data: dict) -> str:
    total_mornings = data.get("total_mornings", 0)
    dominant_emotion = data.get("dominant_emotion", "calm")
    year_word = data.get("year_word", "stillness")
    fullest_month = data.get("fullest_month", "")
    top_emotions = data.get("top_emotions", [])
    longest_entry_excerpt = data.get("longest_entry_excerpt", "")

    top_str = ", ".join(top_emotions) if top_emotions else dominant_emotion

    prompt = f"""
This person completed their year with GratitudeChain.
Here is what the chain recorded:

Total mornings logged: {total_mornings} out of 365
Dominant emotion of the year: {dominant_emotion} ({year_word})
Fullest month (most entries): {fullest_month}
Top emotions across the year: {top_str}
A line from their longest entry: "{longest_entry_excerpt}"

Write exactly three things:

1. closing_line
One sentence only. Lowercase throughout.
Must reference their exact number of mornings ({total_mornings})
and their year word ({year_word}).
It should feel like the chain speaking — final, quiet, true.
Example format: "287 mornings of becoming. the chain held them all."
Do not copy this example. Write something original.

2. year_narrative
Two to three sentences. Lowercase throughout.
Reflect the actual emotional shape of this year —
the dominant emotion, the fullest month, what they carried.
If the top emotions include contrasting ones (e.g. hopeful + heavy,
alive + sad), acknowledge that honestly.
Do not be congratulatory. Do not resolve everything neatly.
This is a witness statement, not a pep talk.

3. pendant_whisper
One short line. Lowercase.
This appears when the user places their chosen month as a pendant.
Warm and final. References the idea of carrying something forward.
Do not include a specific month name — that will be added separately.
Example: "it will hang with you into year two."
Do not copy this example. Write something original.

Respond in valid JSON only. No extra text. No markdown. No backticks.
Exactly this structure:
{{
  "closing_line": "...",
  "year_narrative": "...",
  "pendant_whisper": "..."
}}
"""
    return prompt.strip()


FALLBACKS = {
    "closing_line": "the chain remembers every morning you arrived.",
    "year_narrative": "you showed up. again and again, through whatever the year held. the chain kept the record.",
    "pendant_whisper": "it will hang with you into what comes next."
}


def get_yearly_insights(data: dict) -> dict:
    try:
        client = get_client()
        model = os.getenv("CHAT_MODEL", "claude-haiku-4-5-2")

        response = client.complete(
            model=model,
            messages=[
                SystemMessage(content=SYSTEM_PROMPT),
                UserMessage(content=build_prompt(data))
            ],
            temperature=0.85,
            model_extras={"max_completion_tokens": 400}
        )

        raw = response.choices[0].message.content.strip()

        # strip markdown fences if model adds them
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        result = json.loads(raw)

        # validate all three keys present
        return {
            "closing_line": result.get("closing_line") or FALLBACKS["closing_line"],
            "year_narrative": result.get("year_narrative") or FALLBACKS["year_narrative"],
            "pendant_whisper": result.get("pendant_whisper") or FALLBACKS["pendant_whisper"]
        }

    except json.JSONDecodeError:
        return FALLBACKS.copy()
    except Exception as e:
        print(f"[yearly_insights_agent] error: {e}")
        return FALLBACKS.copy()