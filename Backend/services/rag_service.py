import logging

import openai

from db.supabase import search_documents
from services.openai_service import embed

logger = logging.getLogger(__name__)


def keyword_search(message: str, disasters: list[dict]) -> list[str]:
    msg = message.lower()
    matches = []
    for d in disasters:
        searchable = [str(d.get(f, "")) for f in ("name", "type", "discipline", "location", "year")]
        if any(msg in val.lower() for val in searchable):
            matches.append(
                f"{d.get('id', '?')} — {d.get('name', '?')} "
                f"({d.get('year', '?')}, {d.get('discipline', '?')}, {d.get('location', '?')}): "
                f"{d.get('cause', '')}"
            )
    return matches[:5]


def get_context(message: str, disasters: list[dict]) -> str:
    try:
        chunks = search_documents(embed(message))
    except openai.OpenAIError:
        logger.exception("Embedding failed, falling back to keyword search")
        chunks = []

    if not chunks:
        chunks = keyword_search(message, disasters)

    return "\n\n".join(chunks) if chunks else "No specific records matched."
