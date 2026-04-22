# Arrive

**one morning at a time.**

A one-minute-a-day gratitude journal built on a keystone-habit design thesis: *the gentler the accountability, the higher the return rate.* Built for the CWB Hackathon 2026.

## Prior Work Disclosure
The product concept and business plan were developed prior to the hackathon. All code in this repository was written exclusively during the hackathon period (April 2 – May 3, 2026). No prior codebase was used.

## Tech Stack
- **Azure AI Foundry** — model hosting
- **Microsoft Agent Framework** — six specialized AI agents
- **Azure Cosmos DB** — user profiles, links, journal entries
- **Azure AI Search** — semantic memory resurface
- **Azure App Service** — API hosting
- **FastAPI** — REST API
- **Managed Identity + DefaultAzureCredential** — zero hardcoded keys

## Six AI Agents

| Agent | Role |
|-------|------|
| Reflection | Daily prompt, emotion-insight paragraph, monthly & yearly witness reflections |
| Insight | Quiet post-submit "friend voice" line after each entry |
| Grace | Soft re-entry message after a missed day (never shame) |
| Memory | Resurfaces a past entry semantically matched to today's mood |
| Mindfulness | Breathing exercise for anxious / overwhelmed arrivals |
| Yearly Insights | Personalized year-in-review paragraph at 365 mornings |

## Safety layer

Disclosures of abuse, self-harm, or suicidal ideation are detected by a keyword classifier **before** the AI is called. The AI is skipped entirely and a high-contrast card surfaces real resources (988, RAINN, Childhelp, Philippines DSWD 1343, findahelpline.com). The entry is never saved to the chain. *A gratitude app should know when to stop being a gratitude app.*

## Voice

Every agent shares one rulebook: sentence case, never celebratory, never therapist-speak, no emojis, no exclamation marks. Tender, witnessing, unhurried — the voice of a close friend sitting next to you.
