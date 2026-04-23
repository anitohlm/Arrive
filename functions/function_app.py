"""
Arrive scheduled jobs — Azure Functions (Timer Triggers).

Two triggers — both run DAILY. The backend's /cron/* endpoints filter per
user so the insight only fires on that user's personal milestone day
(day 30/60/90/... from their first entry for monthly; day 365/730/...
for yearly). A user who started April 15 gets their monthly portrait on
May 15, June 15, ...; a user who started October 3 gets theirs on the
3rd of each subsequent month.

  - monthly_portraits  → daily @ 09:00 UTC
  - yearly_insights    → daily @ 10:00 UTC

Protected by CRON_SECRET — the Function sends an X-Cron-Secret header;
the backend rejects the request if it doesn't match the env var.

Env vars (set on Function App → Configuration → Application settings):
  ARRIVE_API_BASE   e.g. https://arrive.azurewebsites.net
  CRON_SECRET       any long random string, must match App Service env
"""
import logging
import os
import azure.functions as func
import requests

app = func.FunctionApp()

API_BASE = os.getenv("ARRIVE_API_BASE", "https://arrive.azurewebsites.net")
CRON_SECRET = os.getenv("CRON_SECRET", "")


def _call(path: str):
    url = f"{API_BASE}{path}"
    headers = {"X-Cron-Secret": CRON_SECRET}
    logging.info("[arrive-cron] POST %s", url)
    resp = requests.post(url, headers=headers, timeout=600)
    logging.info("[arrive-cron] %s → %s %s", url, resp.status_code, resp.text[:500])
    resp.raise_for_status()
    return resp.json()


# cron: "seconds minutes hours day-of-month month day-of-week"
# "0 0 9 * * *" = daily at 09:00:00 UTC — backend filters per-user by
# days-since-startDate % 30 so only users at their 30/60/90/... mark fire.
@app.timer_trigger(schedule="0 0 9 * * *", arg_name="timer", run_on_startup=False)
def monthly_portraits(timer: func.TimerRequest) -> None:
    logging.info("[arrive-cron] monthly_portraits firing (daily check)")
    try:
        result = _call("/cron/monthly-portraits")
        logging.info("[arrive-cron] monthly_portraits result: %s", result)
    except Exception:
        logging.exception("[arrive-cron] monthly_portraits FAILED")


# "0 0 10 * * *" = daily at 10:00 UTC — backend filters per-user by
# days-since-startDate % 365 so only users at their 365/730/... mark fire.
@app.timer_trigger(schedule="0 0 10 * * *", arg_name="timer", run_on_startup=False)
def yearly_insights(timer: func.TimerRequest) -> None:
    logging.info("[arrive-cron] yearly_insights firing (daily check)")
    try:
        result = _call("/cron/yearly-insights")
        logging.info("[arrive-cron] yearly_insights result: %s", result)
    except Exception:
        logging.exception("[arrive-cron] yearly_insights FAILED")
