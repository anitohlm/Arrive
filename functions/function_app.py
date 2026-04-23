"""
Arrive scheduled jobs — Azure Functions (Timer Triggers).

Two triggers:
  - monthly_portraits  → 1st of each month @ 09:00 UTC
  - yearly_insights    → January 1st @ 10:00 UTC

Both call batch endpoints on the main App Service which iterate all users
and generate their paragraph reflections.

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
# "0 0 9 1 * *" = at 09:00:00 UTC on day 1 of every month
@app.timer_trigger(schedule="0 0 9 1 * *", arg_name="timer", run_on_startup=False)
def monthly_portraits(timer: func.TimerRequest) -> None:
    logging.info("[arrive-cron] monthly_portraits firing")
    try:
        result = _call("/cron/monthly-portraits")
        logging.info("[arrive-cron] monthly_portraits result: %s", result)
    except Exception:
        logging.exception("[arrive-cron] monthly_portraits FAILED")


# "0 0 10 1 1 *" = at 10:00:00 UTC on January 1st
@app.timer_trigger(schedule="0 0 10 1 1 *", arg_name="timer", run_on_startup=False)
def yearly_insights(timer: func.TimerRequest) -> None:
    logging.info("[arrive-cron] yearly_insights firing")
    try:
        result = _call("/cron/yearly-insights")
        logging.info("[arrive-cron] yearly_insights result: %s", result)
    except Exception:
        logging.exception("[arrive-cron] yearly_insights FAILED")
