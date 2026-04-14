import os
from azure.cosmos import CosmosClient, PartitionKey
from dotenv import load_dotenv

load_dotenv()

client = CosmosClient.from_connection_string(
    os.getenv("COSMOS_CONNECTION_STRING")
)

database = client.get_database_client(
    os.getenv("COSMOS_DATABASE")
)

entries_container = database.get_container_client("entries")
users_container = database.get_container_client("users")
memory_container = database.get_container_client("agent_memory")

def get_user(user_id: str) -> dict:
    try:
        return users_container.read_item(
            item=user_id,
            partition_key=user_id
        )
    except:
        # New user — return default profile
        return {
            "id": user_id,
            "streak": 0,
            "lastEntryDate": None,
            "startDate": None,
            "intention": "joy",
            "graceUsed": 0,
            "graceMonth": None,
            "graceRemaining": 1,
            "loggedDates": [],
            "missedDates": []
        }

def save_user(user: dict):
    users_container.upsert_item(user)

def save_entry(entry: dict):
    entries_container.upsert_item(entry)

def get_recent_entries(user_id: str, limit: int = 10) -> list:
    query = f"""
        SELECT * FROM c
        WHERE c.userId = '{user_id}'
        ORDER BY c.dayNumber DESC
        OFFSET 0 LIMIT {limit}
    """
    return list(entries_container.query_items(
        query=query,
        enable_cross_partition_query=True
    ))

def get_entries_by_month(user_id: str, year: int, month: int) -> list:
    """Get all entries for a specific month (for Gratitude Portrait)."""
    start = f"{year}-{str(month).zfill(2)}-01"
    if month == 12:
        end = f"{year+1}-01-01"
    else:
        end = f"{year}-{str(month+1).zfill(2)}-01"
    query = f"""
        SELECT * FROM c
        WHERE c.userId = '{user_id}'
        AND c.timestamp >= '{start}'
        AND c.timestamp < '{end}'
        ORDER BY c.dayNumber ASC
    """
    return list(entries_container.query_items(
        query=query,
        enable_cross_partition_query=True
    ))

def get_logged_dates(user_id: str) -> list:
    """Get the list of dates the user has logged entries."""
    user = get_user(user_id)
    return user.get("loggedDates", [])

def add_logged_date(user_id: str, date_str: str):
    """Add a date to the user's logged dates list."""
    user = get_user(user_id)
    logged = user.get("loggedDates", [])
    if date_str not in logged:
        logged.append(date_str)
        user["loggedDates"] = logged
        user["lastEntryDate"] = date_str
        save_user(user)

def use_grace_day(user_id: str, missed_date: str) -> bool:
    """
    Use a grace day to fill a missed date.
    Returns True if successful, False if no grace days remaining.
    """
    user = get_user(user_id)
    current_month = missed_date[:7]  # "2026-04"

    # reset grace if new month
    if user.get("graceMonth") != current_month:
        user["graceMonth"] = current_month
        user["graceRemaining"] = 1
        user["graceUsed"] = 0

    if user.get("graceRemaining", 0) <= 0:
        return False

    # use grace day
    user["graceRemaining"] = user.get("graceRemaining", 1) - 1
    user["graceUsed"] = user.get("graceUsed", 0) + 1

    # add the missed date to logged dates
    logged = user.get("loggedDates", [])
    if missed_date not in logged:
        logged.append(missed_date)
        logged.sort()
        user["loggedDates"] = logged

    # remove from missed dates if tracked
    missed = user.get("missedDates", [])
    if missed_date in missed:
        missed.remove(missed_date)
        user["missedDates"] = missed

    save_user(user)
    return True

def get_missed_dates(user_id: str) -> list:
    """Get dates the user missed (gaps in the chain)."""
    user = get_user(user_id)
    start_date = user.get("startDate")
    if not start_date:
        return []

    from datetime import datetime, timedelta
    start = datetime.fromisoformat(start_date)
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    logged_set = set(user.get("loggedDates", []))
    missed = []

    current = start
    while current < today:
        date_str = current.strftime("%Y-%m-%d")
        if date_str not in logged_set:
            missed.append(date_str)
        current += timedelta(days=1)

    return missed