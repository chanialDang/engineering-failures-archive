import os
import json
from pathlib import Path

from openai import OpenAI
from fastapi import APIRouter

from models.schemas import ChatRequest, ChatResponse
from db.supabase import search_documents

router = APIRouter()

# ── Step 3: Load disaster data once at startup ────────────────────────────────
# Path: Backend/routes/chat.py → up 3 levels → frontend/raw_failures.json
_data_path = Path(__file__).parent.parent.parent / "frontend" / "raw_failures.json"
with open(_data_path) as f:
    DISASTERS = json.load(f)["disasters"]

# ── Step 5: System prompt ─────────────────────────────────────────────────────
SYSTEM_PROMPT = ("You are an expert assistant on engineering failures and incidents. "
                 "Use the provided context from the archive to answer questions "
                 "accurately and concisely. If the context doesn't contain enough "
                 "information to answer, say so honestly rather than guessing."
                 )


# ── Step 4: Keyword search fallback ──────────────────────────────────────────
def keyword_search(message: str) -> list[str]:
    """Simple substring match against disaster fields — used when RAG isn't set up."""
    msg = message.lower()
    matches = []
    for d in DISASTERS:
        searchable = [str(d.get(field, "")) for field in ("name", "type", "discipline", "location", "year")]
        if any(msg in val.lower() for val in searchable):
            matches.append(
                f"{d['id']} — {d['name']} ({d['year']}, {d['discipline']}, {d['location']}): {d['cause']}"
            )
    return matches[:5]


# ── Step 7: Embedding helper (for Supabase RAG) ───────────────────────────────
def embed(client: OpenAI, text: str) -> list[float]:
    """Convert text to a vector using OpenAI embeddings."""
    result = client.embeddings.create(model="text-embedding-3-small", input=text)
    return result.data[0].embedding


# ── Step 6: Route handler ─────────────────────────────────────────────────────
@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

    # Try Supabase vector search first; fall back to keyword match
    try:
        context_chunks = search_documents(embed(client, req.message))
    except Exception:
        context_chunks = []

    if not context_chunks:
        context_chunks = keyword_search(req.message)

    context_block = "\n\n".join(context_chunks) if context_chunks else "No specific records matched."

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT + f"\n\nRelevant archive records:\n{context_block}"},
        *req.history,
        {"role": "user", "content": req.message},
    ]

    result = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
    return ChatResponse(response=result.choices[0].message.content)
