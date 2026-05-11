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

## System Architecture

```
┌──────────────────────────────────────────────────────────┐
│  AZURE STATIC WEB APPS  (mango-wave-04adc570f...)        │
│  BROWSER  (index.html + js/* + css/styles.css)           │
│                                                          │
│  localStorage keys (all prefixed gc_):                   │
│    gc_user_id          UUID, first-boot generated        │
│    gc_user             {name, email, birthday, birthYear}│
│    gc_entries          cached entries array (last N)     │
│    gc_logged_today     toDateString — self-healing       │
│    gc_logged_dates     ISO dates logged                  │
│    gc_start_date       first-entry local-ISO date        │
│    gc_pendant_year_*   user's chosen year-end pendant    │
│    gc_time_capsules    future-self letters               │
│    gc_grace            {month, remaining}                │
│                                                          │
│  On /post-insight the client sends the last 7 entries    │
│  inline as `recent_entries` so the adaptive layer can    │
│  run on demo-seeded data too (no Cosmos round-trip).     │
└────────────┬─────────────────────────────────────────────┘
             │ HTTPS/JSON  (API_BASE: arrive.azurewebsites.net)
             │ CORS allow-list: *.azurestaticapps.net
┌────────────▼─────────────────────────────────────────────┐
│  AZURE APP SERVICE  (arrive.azurewebsites.net)           │
│  FASTAPI (api.py)                                        │
│    - slowapi rate-limiter (per-IP)                       │
│    - Pydantic validation (constr + EmailStr + patterns)  │
│    - X-Cron-Secret auth on /cron/* batch endpoints       │
│                                                          │
│  orchestrator.py — cross-agent workflows                 │
│                                                          │
│  ┌─ ADAPTIVE LAYER (agents/user_context.py) ──────────┐  │
│  │  Pure-Python signal extractor. Reads last 7        │  │
│  │  entries, emits:                                   │  │
│  │    • streak_emotion   (3+ days same emotion)       │  │
│  │    • avg_length       short / medium / long        │  │
│  │    • missed_rate      0.0–1.0 over 7 days          │  │
│  │    • dominant_emotion most frequent this week      │  │
│  │    • noticed          1-line shift-aware summary   │  │
│  │  context_preamble() injects an ADAPTATION block    │  │
│  │  into every agent's system prompt below.           │  │
│  └────────────────────────┬───────────────────────────┘  │
│                           │ ctx injected                 │
│  agents/ (7 AI + 3 support)                              │
│    Azure Managed Identity → DefaultAzureCredential       │
│    → Microsoft Agent Framework (azure-ai-agents)         │
│    safety.py       short-circuits AI for crisis text     │
│    streak_agent.py pure math, milestones, grace          │
│    user_context.py adaptation signals (above)            │
│                                                          │
│  db.py        → AZURE COSMOS DB  (entries/users/links)   │
│  search.py    → AZURE AI SEARCH  (text-only projection)  │
│  agents/*     → MICROSOFT FOUNDRY (chat completions)     │
└──────────────────────────────────────────────────────────┘
             ▲
             │ POST /cron/monthly-portraits  (X-Cron-Secret)
             │ POST /cron/yearly-insights
┌────────────┴─────────────────────────────────────────────┐
│  AZURE FUNCTIONS  (arrive-scheduler — Consumption plan)  │
│    monthly_portraits   Timer: daily @ 09:00 UTC          │
│    yearly_insights     Timer: daily @ 10:00 UTC          │
│  Both fire daily; backend filters per-user so insights   │
│  land on each user's personal day-30 / day-365 anchor.   │
└──────────────────────────────────────────────────────────┘
```

**How the adaptive layer feeds every agent.** On `/post-insight`, the route assembles a `ctx` dict via `build_user_context(recent_entries, today_mood)`. That dict is threaded into the agent call as `user_context=ctx`; the agent's `get_*` function calls `context_preamble(ctx)` which renders a tight `ADAPTATION` block — e.g. *"they tend to write briefly — keep your reply under 15 words"* or *"the user has been 'anxious' for 3+ days. acknowledge the continuity gently."* Reflection, Insight, and Mindfulness all honor this. The same `ctx["noticed"]` line ships back to the frontend in the response and renders as the gold **"noticing"** chip above the AI reply — making the adaptation visible to the user, not just to the model.

Full deployment topology, env vars, CORS, and rate-limit details: see [`TECHNICAL_DOCUMENTATION.md §3`](TECHNICAL_DOCUMENTATION.md#3-architecture-at-a-glance).

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

## Acknowledgments

- **Claude Code** (Anthropic) — pair-programming assistant throughout the build. Every line of code in this repo was reviewed and shipped by me; Claude Code helped me move faster on scaffolding, debugging, and refactoring.
- **Gemini** (Google) — generated the 38 emotion icons in `assets/` (grateful, anxious, tender, exhausted, and the rest of the set) plus the four arrival-category illustrations (arriving light, in between, carrying weight, hard to name).
