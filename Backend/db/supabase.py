import logging
import os
from typing import Optional

import httpx
from supabase import create_client, Client

logger = logging.getLogger(__name__)

try:
    url: str = os.environ["SUPABASE_URL"]
    key: str = os.environ["SUPABASE_KEY"]
    client: Client = create_client(url, key)
except KeyError as e:
    logger.error("Missing Supabase environment variable: %s", e)
    raise


def ping() -> bool:
    client.table("settings").select("key").limit(1).execute()
    return True


def get_setting(key: str) -> Optional[str]:
    result = client.table("settings").select("value").eq("key", key).maybe_single().execute()
    return result.data["value"] if result.data else None


def save_setting(key: str, value: str) -> None:
    if len(key) > 256:
        raise ValueError("Settings key exceeds 256 characters")
    if len(value) > 4096:
        raise ValueError("Settings value exceeds 4096 characters")
    client.table("settings").upsert({"key": key, "value": value}).execute()


def clear_documents() -> None:
    client.table("documents").delete().neq("id", 0).execute()


def insert_document(content: str, embedding: list[float]) -> None:
    client.table("documents").insert({"content": content, "embedding": embedding}).execute()


def search_documents(embedding: list[float], match_count: int = 5) -> list[str]:
    try:
        result = client.rpc(
            "match_documents",
            {"query_embedding": embedding, "match_count": match_count},
        ).execute()
        return [row["content"] for row in result.data] if result.data else []
    except httpx.HTTPError:
        logger.exception("Supabase network error during vector search")
        return []
    except Exception:
        logger.exception("Supabase vector search failed unexpectedly")
        return []
