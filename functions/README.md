# Arrive scheduled jobs

Two Azure Function Timer Triggers. Both run **daily**; the backend filters
per-user so insights only fire on each user's personal milestone day
(counted from the date of their first entry, *not* the calendar month/year).

| Function | Runs | Fires insight when |
|---|---|---|
| `monthly_portraits` | daily @ 09:00 UTC | `days-since-startDate` is a positive multiple of 30 |
| `yearly_insights` | daily @ 10:00 UTC | `days-since-startDate` is a positive multiple of 365 |

So a user who first logged on **April 15** gets monthly portraits on
May 15, June 14, July 14, ... and a yearly insight on April 15 next year.
A user who first logged on **October 3** gets theirs on a different cadence.

Both iterate all users in Cosmos, filter by the milestone rule, and
generate their paragraph reflections.

## One-time setup

### 1. Create the Function App in Azure

Portal → Create a resource → **Function App**

- Plan: **Consumption (Serverless)** — free tier, 1M executions/month
- Runtime: **Python 3.11**
- Region: Southeast Asia (same as main app)
- Name: `arrive-scheduler`
- Resource group: `gratitudechain-rg`

### 2. Set app settings (Function App → Configuration)

```
ARRIVE_API_BASE   https://arrive.azurewebsites.net
CRON_SECRET       <long random string, e.g. openssl rand -hex 32>
```

### 3. Add the SAME CRON_SECRET to the main App Service

Go to `arrive` web app → Configuration → add:

```
CRON_SECRET   <same value as above>
```

Restart both apps.

### 4. Install Azure Functions Core Tools (one-time, locally)

```powershell
winget install Microsoft.Azure.FunctionsCoreTools
# OR
npm i -g azure-functions-core-tools@4
```

### 5. Deploy

From this `functions/` directory:

```powershell
cd functions
func azure functionapp publish arrive-scheduler
```

## Verify

In the Azure Portal → `arrive-scheduler` → **Functions** tab, you should see both
`monthly_portraits` and `yearly_insights` listed.

To test a trigger manually without waiting for the schedule:

```
Function → Code + Test → Test/Run → Run
```

Or hit the batch endpoint directly from your terminal:

```powershell
$secret = "<your CRON_SECRET>"
Invoke-RestMethod -Uri "https://arrive.azurewebsites.net/cron/monthly-portraits" `
  -Method Post -Headers @{"X-Cron-Secret" = $secret}
# → { processed: N, ok: N, fail: 0 }
```

## Cron format cheat sheet

Azure uses 6-field NCRONTAB: `{seconds} {minutes} {hours} {day} {month} {day-of-week}`.

| Cron | Meaning |
|---|---|
| `0 0 9 1 * *` | 09:00:00 on day 1 of every month |
| `0 0 10 1 1 *` | 10:00:00 on January 1st |
| `0 */5 * * * *` | Every 5 minutes (for testing) |
| `0 0 * * * *` | Top of every hour |

Edit `schedule=` in `function_app.py` and redeploy to change.
