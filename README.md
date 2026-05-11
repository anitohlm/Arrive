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
- **Azure Functions** — daily timer-triggered Portraits + yearly insights
- **Azure Static Web Apps** — vanilla-JS frontend, free tier
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
| 5 | **Mindfulness** | Guides a short breathing or grounding exercise. Switches from breath to grounding when the user has been anxious for 3+ days in a row (breathwork can worsen entrenched anxiety — grounding pulls them back into the body). |
| 6 | **Monthly Insights** | Generates the month-end Gratitude Portrait copy |
| 7 | **Yearly Insights** | Composes a personalized year-in-review paragraph at 365 mornings — addressed by name, reflecting the emotional shape of the whole year |

## Three Support Modules

These aren't Foundry agents — they run entirely offline, before or alongside the AI layer.

| Module | Role |
|---|---|
| **Safety Classifier** (`agents/safety.py`) | Regex-based detection for abuse / self-harm / suicidal-ideation disclosures. Runs **before** the AI is called; short-circuits to real resources (988, RAINN, Childhelp, Philippines DSWD 1343, findahelpline.com). The entry is never saved to the chain. *A gratitude app should know when to stop being a gratitude app.* |
| **Streak Engine** (`agents/streak_agent.py`) | Pure math — streak computation, milestone detection (days 7 / 100 / 200 / 250 / 300), grace-day accounting (one per month). |
| **Adaptive Layer** (`agents/user_context.py`) | Reads the user's last 7 entries to extract recent-pattern signals: emotion streak, brevity trend, missed-day rate, dominant emotion, shift detection. Every AI agent receives this as an **ADAPTATION** block appended to its system prompt — so the reply tunes length, tone, and suggestions to what the user has actually been carrying. The visible artifact is a **"noticing" chip** on the post-insight screen (`noticing · three mornings of anxious behind you. today feels different.`). |

## Voice

One close-friend register across every piece of AI output in the app: tender, unhurried, lowercase-friendly sentence case. Never "amazing," never "you did it," never "I hear you that..." Just one true thing said back to the user, morning after morning.

## Ceremonies

- **Month-end ceremony** — the month's rose-curve pendant weaves itself into form, emerging in the dominant emotion's color
- **Streak milestones** at days 7, 100, 200, 250, 300 — one quiet line, no confetti
- **Birthday ceremony** — the knot that falls on your birthday is marked with your birthstone
- **Year-end ceremony** — twelve monthly pendants arrayed for you to pick one to carry forward as a permanent necklace

## Other features

- **Walking alongside** — link up to three people who can see *that* you showed up today, never *what* you wrote. The whole point is presence without surveillance.
- **Time capsules** — write a sealed letter to your future self. Capsules glow only on or after their unlock day, so the surprise stays a surprise.
- **Constellation heatmap** — a year-at-a-glance grid of your mornings, colored by emotion.
- **Memory resurface** — on a heavy morning, a past entry semantically matched to today's mood surfaces on the insight screen — your own words, handed back.

## Safety + Privacy

- Crisis disclosures never reach the AI and never save to the chain
- Every Cosmos record is scoped to `user_id` (no cross-user reads)
- Azure Cosmos encrypts at rest and in transit
- Prompt-injection defended via `<user_entry>` tag wrapping + explicit system-prompt guard
- User can delete any time via the demo panel's nuclear reset
