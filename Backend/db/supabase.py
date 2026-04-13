import os
from typing import Optional
from supabase import create_client, Client

url: str = os.environ["SUPABASE_URL"]
key: str = os.environ["SUPABASE_KEY"]
client: Client = create_client(url, key)


def get_setting(key: str) -> Optional[str]:
    result = client.table("settings").select("value").eq("key", key).maybe_single().execute()
    return result.data["value"] if result.data else None


def save_setting(key: str, value: str) -> None:
    client.table("settings").upsert({"key": key, "value": value}).execute()


def search_documents(embedding: list[float], match_count: int = 5) -> list[str]:
    try:
        result = client.rpc(
            "match_documents",
            {"query_embedding": embedding, "match_count": match_count},
        ).execute()
        return [row["content"] for row in result.data] if result.data else []
    except Exception:
        return []
