import os
from datetime import date
from azure.cosmos import CosmosClient, PartitionKey
from azure.cosmos.exceptions import CosmosResourceNotFoundError
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

# Links: walking-alongside relationships, keyed by /id so each link lives in its
# own partition. Queries are cross-partition (fine for demo-scale <100 users).
# Create once if missing so first-run in a fresh DB doesn't crash.
try:
    links_container = database.create_container_if_not_exists(
        id="links",
        partition_key=PartitionKey(path="/id"),
    )
except Exception:
    links_container = database.get_container_client("links")


# ── user-by-id helpers ───────────────────────────────────────
def get_user_email(user_id: str) -> str:
    """Return the user's registered email, or '' if the user doc has none /
    the user is brand-new. Never raises on missing-user."""
    if not user_id:
        return ""
    try:
        doc = users_container.read_item(item=user_id, partition_key=user_id)
    except CosmosResourceNotFoundError:
        return ""
    return (doc.get("email") or "").strip().lower()


# ── user-by-email lookup ─────────────────────────────────────
def find_user_by_email(email: str):
    """Returns the user doc or None. Case-insensitive match."""
    if not email:
        return None
    email_lc = email.strip().lower()
    hits = list(users_container.query_items(
        query="SELECT * FROM c WHERE LOWER(c.email) = @e",
        parameters=[{"name": "@e", "value": email_lc}],
        enable_cross_partition_query=True,
    ))
    return hits[0] if hits else None


def register_user(user_id: str, email: str, name: str = "", birthday: str = ""):
    """Create or update a user doc. Called on profile-submit so the user is
    discoverable by email for alongside linking. Enforces email uniqueness —
    raises ValueError('email-taken') if the email is bound to a different
    user_id."""
    if email:
        email_lc = email.strip().lower()
        existing = find_user_by_email(email_lc)
        if existing and existing.get("id") != user_id:
            raise ValueError("email-taken")
    doc = get_user(user_id)
    doc["id"] = user_id
    if email: doc["email"] = email.strip().lower()
    if name: doc["name"] = name
    if birthday: doc["birthday"] = birthday
    save_user(doc)
    return doc


# ── link operations ─────────────────────────────────────────
import uuid as _uuid
from datetime import datetime as _dt, timedelta as _td

LINK_TTL_HOURS = 48 * 7  # 1 week pending expiry — generous for hackathon

def create_link_request(requester_id: str, requester_email: str, requester_nickname: str, target_email: str):
    """Always succeeds (no email enumeration). If target email doesn't match
    a known user, the link still saves — if that user signs up later, they'll
    see the invite. Duplicate pending links from same requester → target are
    collapsed (no spam)."""
    target_email_lc = (target_email or "").strip().lower()

    # Per-recipient flood cap — 5 pending invites per 24h regardless of who is
    # sending. Complements the per-IP /link/request limit by capping distributed
    # spam against a single victim. Silently "succeeds" to preserve the
    # no-enumeration posture (caller can't tell throttle from success).
    recent_count = list(links_container.query_items(
        query=(
            "SELECT VALUE COUNT(1) FROM c "
            "WHERE LOWER(c.target_email) = @t "
            "AND c.status = 'pending' "
            "AND c.created_at > @cutoff"
        ),
        parameters=[
            {"name": "@t", "value": target_email_lc},
            {"name": "@cutoff", "value": (_dt.utcnow() - _td(hours=24)).isoformat()},
        ],
        enable_cross_partition_query=True,
    ))
    count = recent_count[0] if recent_count else 0
    if count >= 5:
        return {"id": "throttled", "status": "throttled"}

    # Collapse duplicate pending invites
    existing = list(links_container.query_items(
        query=(
            "SELECT * FROM c WHERE c.requester_user_id = @r "
            "AND LOWER(c.target_email) = @t AND c.status = 'pending'"
        ),
        parameters=[
            {"name": "@r", "value": requester_id},
            {"name": "@t", "value": target_email_lc},
        ],
        enable_cross_partition_query=True,
    ))
    if existing:
        return existing[0]

    now = _dt.utcnow()
    doc = {
        "id": "link_" + _uuid.uuid4().hex[:16],
        "requester_user_id": requester_id,
        "requester_email": (requester_email or "").strip().lower(),
        "requester_nickname": requester_nickname or "",
        "target_email": target_email_lc,
        "target_user_id": None,
        "status": "pending",
        "created_at": now.isoformat(),
        "expires_at": (now + _td(hours=LINK_TTL_HOURS)).isoformat(),
    }
    links_container.upsert_item(doc)
    return doc


def list_pending_links_for(email: str):
    """All links where I'm the target and status is still pending."""
    if not email: return []
    email_lc = email.strip().lower()
    now_iso = _dt.utcnow().isoformat()
    return list(links_container.query_items(
        query=(
            "SELECT * FROM c WHERE LOWER(c.target_email) = @e "
            "AND c.status = 'pending' AND c.expires_at > @now"
        ),
        parameters=[
            {"name": "@e", "value": email_lc},
            {"name": "@now", "value": now_iso},
        ],
        enable_cross_partition_query=True,
    ))


def list_active_links_for(user_id: str):
    """All accepted links where I am either requester or target."""
    return list(links_container.query_items(
        query=(
            "SELECT * FROM c WHERE c.status = 'active' AND "
            "(c.requester_user_id = @uid OR c.target_user_id = @uid)"
        ),
        parameters=[{"name": "@uid", "value": user_id}],
        enable_cross_partition_query=True,
    ))


def accept_link(link_id: str, acceptor_user_id: str, acceptor_email: str):
    """Flip a pending link to active. Acceptor must match the target_email."""
    acceptor_email_lc = (acceptor_email or "").strip().lower()
    try:
        doc = links_container.read_item(item=link_id, partition_key=link_id)
    except CosmosResourceNotFoundError:
        return {"ok": False, "reason": "not-found"}
    if doc.get("status") != "pending":
        return {"ok": False, "reason": "not-pending"}
    if (doc.get("target_email") or "").lower() != acceptor_email_lc:
        return {"ok": False, "reason": "email-mismatch"}
    doc["status"] = "active"
    doc["target_user_id"] = acceptor_user_id
    doc["accepted_at"] = _dt.utcnow().isoformat()
    links_container.upsert_item(doc)
    return {"ok": True, "link": doc}


def decline_link(link_id: str, acceptor_email: str):
    acceptor_email_lc = (acceptor_email or "").strip().lower()
    try:
        doc = links_container.read_item(item=link_id, partition_key=link_id)
    except CosmosResourceNotFoundError:
        return {"ok": False, "reason": "not-found"}
    if (doc.get("target_email") or "").lower() != acceptor_email_lc:
        return {"ok": False, "reason": "email-mismatch"}
    doc["status"] = "declined"
    doc["declined_at"] = _dt.utcnow().isoformat()
    links_container.upsert_item(doc)
    return {"ok": True}

def get_user(user_id: str) -> dict:
    try:
        return users_container.read_item(
            item=user_id,
            partition_key=user_id
        )
    except CosmosResourceNotFoundError:
        # New user — return default profile. Other Cosmos errors propagate so
        # a transient outage doesn't silently wipe streak state on reconnect.
        return {
            "id": user_id,
            "streak": 0,
            "lastEntryDate": None,
            "startDate": None,
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
    return list(entries_container.query_items(
        query="SELECT * FROM c WHERE c.userId = @uid ORDER BY c.dayNumber DESC OFFSET 0 LIMIT @n",
        parameters=[
            {"name": "@uid", "value": user_id},
            {"name": "@n", "value": int(limit)},
        ],
        partition_key=user_id,
    ))

def get_entries_by_month(user_id: str, year: int, month: int) -> list:
    """Get all entries for a specific month (for Gratitude Portrait)."""
    year, month = int(year), int(month)
    start = f"{year}-{str(month).zfill(2)}-01"
    if month == 12:
        end = f"{year+1}-01-01"
    else:
        end = f"{year}-{str(month+1).zfill(2)}-01"
    return list(entries_container.query_items(
        query=(
            "SELECT * FROM c WHERE c.userId = @uid "
            "AND c.timestamp >= @start AND c.timestamp < @end "
            "ORDER BY c.dayNumber ASC"
        ),
        parameters=[
            {"name": "@uid", "value": user_id},
            {"name": "@start", "value": start},
            {"name": "@end", "value": end},
        ],
        partition_key=user_id,
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
    # Validate format — downstream slicing assumes strict ISO "YYYY-MM-DD".
    try:
        date.fromisoformat(missed_date)
    except ValueError:
        raise ValueError(f"missed_date must be ISO YYYY-MM-DD, got: {missed_date!r}")

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