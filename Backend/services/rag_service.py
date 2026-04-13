from db.supabase import search_documents
from services.openai_service import embed


def keyword_search(message: str, disasters: list[dict]) -> list[str]:
    """Substring match against disaster fields — fallback when vector search fails."""
    msg = message.lower()
    matches = []
    for d in disasters:
        searchable = [str(d.get(f, "")) for f in ("name", "type", "discipline", "location", "year")]
        if any(msg in val.lower() for val in searchable):
            matches.append(
                f"{d['id']} — {d['name']} ({d['year']}, {d['discipline']}, {d['location']}): {d['cause']}"
            )
    return matches[:5]


def get_context(message: str, disasters: list[dict]) -> str:
    """Return a context block for the chat prompt.

    Tries Supabase vector search first; falls back to keyword search.
    Always returns a non-empty string.
    """
    chunks: list[str] = []

    try:
        chunks = search_documents(embed(message))
    except Exception:
        pass

    if not chunks:
        chunks = keyword_search(message, disasters)

    return "\n\n".join(chunks) if chunks else "No specific records matched."
