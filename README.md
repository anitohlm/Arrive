# Arrive

**one morning at a time.**

A one-minute-a-day gratitude journal built on a keystone-habit design thesis: *the gentler the accountability, the higher the return rate.* Built for the CWB Hackathon 2026.

## 🌿 Live demo

> **App:** [https://mango-wave-04adc570f.7.azurestaticapps.net](https://mango-wave-04adc570f.7.azurestaticapps.net)
> **Backend health:** [https://arrive.azurewebsites.net/health](https://arrive.azurewebsites.net/health)

Open the demo URL in any modern browser — sign in with your name, write a morning entry, and the full pipeline (Foundry agents + Cosmos persistence + AI Search memory + scheduled Functions) runs against live Azure services.

**For judges in a hurry:** open the **DEMO** pill at the top-left → *seed 30 days* → tap the chain heart → *arrive* → *month-end* → *year-end*. You'll see the full ceremony arc — knot, pendant, year necklace — in under two minutes.

## Prior Work Disclosure
The product concept and business plan were developed prior to the hackathon. All code in this repository was written exclusively during the hackathon period (April 2 – May 3, 2026). No prior codebase was used.

## Tech Stack
- **Azure AI Foundry** — model hosting for all seven AI agents
- **Microsoft Agent Framework** — shared voice rulebook across agents
- **Azure Cosmos DB** — user profiles, links, journal entries
- **Azure AI Search** — semantic memory resurface
- **Azure App Service** — FastAPI backend hosting
- **Managed Identity + DefaultAzureCredential** — zero hardcoded keys
- **FastAPI** — REST API with slowapi rate limiting + Pydantic validation

## Seven AI Agents

All seven call **Azure AI Foundry** via `DefaultAzureCredential`. They share one voice rulebook: sentence case, never celebratory, never therapist-speak, no emojis.

| # | Agent | Role |
|---|-------|------|
| 1 | **Reflection** | Daily prompt, emotion-insight paragraph, and monthly witness reflection (3–5 sentences) |
| 2 | **Insight** | Quiet post-submit "friend voice" line after each entry lands on the chain |
| 3 | **Grace** | Soft re-entry message after a missed day — no shame, just welcome |
| 4 | **Memory** | Resurfaces a past entry semantically matched to today's mood via Azure AI Search |
| 5 | **Mindfulness** | Guides a short breathing exercise when you arrive anxious or overwhelmed |
| 6 | **Monthly Insights** | Generates the month-end Gratitude Portrait copy |
| 7 | **Yearly Insights** | Composes a personalized year-in-review paragraph at 365 mornings — addressed by name, reflecting the emotional shape of the whole year |

## Two Support Modules

These aren't Foundry agents — they run entirely offline, before or alongside the AI layer.

| Module | Role |
|---|---|
| **Safety Classifier** (`agents/safety.py`) | Regex-based detection for abuse / self-harm / suicidal-ideation disclosures. Runs **before** the AI is called; short-circuits to real resources (988, RAINN, Childhelp, Philippines DSWD 1343, findahelpline.com). The entry is never saved to the chain. *A gratitude app should know when to stop being a gratitude app.* |
| **Streak Engine** (`agents/streak_agent.py`) | Pure math — streak computation, milestone detection (days 7 / 100 / 200 / 250 / 300), grace-day accounting (one per month). |

## Voice

One close-friend register across every piece of AI output in the app: tender, unhurried, lowercase-friendly sentence case. Never "amazing," never "you did it," never "I hear you that..." Just one true thing said back to the user, morning after morning.

## Ceremonies

- **Month-end ceremony** — the month's rose-curve pendant weaves itself into form, emerging in the dominant emotion's color
- **Streak milestones** at days 7, 100, 200, 250, 300 — one quiet line, no confetti
- **Birthday ceremony** — the knot that falls on your birthday is marked with your birthstone
- **Year-end ceremony** — twelve monthly pendants arrayed for you to pick one to carry forward as a permanent necklace

## Safety + Privacy

- Crisis disclosures never reach the AI and never save to the chain
- Every Cosmos record is scoped to `user_id` (no cross-user reads)
- Azure Cosmos encrypts at rest and in transit
- Prompt-injection defended via `<user_entry>` tag wrapping + explicit system-prompt guard
- User can delete any time via the demo panel's nuclear reset
