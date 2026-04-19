import os
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex,
    SimpleField,
    SearchableField,
    SearchFieldDataType
)
from azure.core.credentials import AzureKeyCredential

def get_search_client():
    return SearchClient(
        endpoint=os.getenv("SEARCH_ENDPOINT"),
        index_name=os.getenv("SEARCH_INDEX"),
        credential=AzureKeyCredential(os.getenv("SEARCH_KEY"))
    )

def create_index_if_not_exists():
    index_client = SearchIndexClient(
        endpoint=os.getenv("SEARCH_ENDPOINT"),
        credential=AzureKeyCredential(os.getenv("SEARCH_KEY"))
    )

    index = SearchIndex(
        name=os.getenv("SEARCH_INDEX"),
        fields=[
            SimpleField(name="id", type=SearchFieldDataType.String, key=True),
            SimpleField(name="userId", type=SearchFieldDataType.String, filterable=True),
            SearchableField(name="content", type=SearchFieldDataType.String),
            SimpleField(name="mood", type=SearchFieldDataType.String, filterable=True),
            SimpleField(name="dayNumber", type=SearchFieldDataType.Int32, sortable=True),
            SimpleField(name="timestamp", type=SearchFieldDataType.String, sortable=True)
        ]
    )

    try:
        index_client.create_index(index)
        print("✅ Search index created!")
    except Exception as e:
        print(f"✅ Index already exists: {e}")

def index_entry(entry: dict):
    client = get_search_client()
    client.upload_documents(documents=[{
        "id": entry["id"],
        "userId": entry["userId"],
        "content": entry["content"],
        "mood": entry.get("mood", "neutral"),
        "dayNumber": entry.get("dayNumber", 1),
        "timestamp": entry.get("timestamp", "")
    }])

def search_memories(user_id: str, mood: str, top: int = 3) -> list:
    client = get_search_client()

    # Escape single quotes per OData 4.0 string literal rules to prevent filter injection.
    safe_uid = user_id.replace("'", "''")
    results = client.search(
        search_text=f"grateful thankful {mood}",
        filter=f"userId eq '{safe_uid}'",
        top=top,
        order_by=["dayNumber desc"]
    )

    memories = []
    for r in results:
        memories.append({
            "day": r["dayNumber"],
            "content": r["content"],
            "mood": r["mood"]
        })

    return memories