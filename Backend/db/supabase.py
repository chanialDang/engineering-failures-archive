import os
from typing import Optional
from supabase import create_client, Client

# Initialize the Supabase client using credentials from environment variables
url: str = os.environ["SUPABASE_URL"]
key: str = os.environ["SUPABASE_KEY"]
client: Client = create_client(url, key)


# Retrieve a single setting value by key from the settings table
def get_setting(key: str) -> Optional[str]:
    result = client.table("settings").select("value").eq("key", key).maybe_single().execute()
    return result.data["value"] if result.data else None


# Insert or update a setting key/value pair in the settings table
def save_setting(key: str, value: str) -> None:
    client.table("settings").upsert({"key": key, "value": value}).execute()


# Call the match_documents RPC to find relevant chunks by vector similarity
# Returns empty list if the RPC or table doesn't exist yet (RAG not set up)
def search_documents(embedding: list[float], match_count: int = 5) -> list[str]:
    try:
        result = client.rpc(
            "match_documents",
            {"query_embedding": embedding, "match_count": match_count},
        ).execute()
        return [row["content"] for row in result.data] if result.data else []
    except Exception:
        return []
