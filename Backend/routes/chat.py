import json
import logging
import os
from pathlib import Path

from fastapi import APIRouter, Request

from limiter import limiter
from models.schemas import ChatRequest, ChatResponse
from services.openai_service import chat as openai_chat
from services.rag_service import get_context

logger = logging.getLogger(__name__)
router = APIRouter()

_default_path = Path(__file__).parent.parent / "raw_failures.json"
_data_path = os.getenv("DATA_PATH", str(_default_path))

try:
    with open(_data_path) as f:
        DISASTERS = json.load(f)["disasters"]
except FileNotFoundError:
    logger.warning("raw_failures.json not found at %s — keyword search disabled", _data_path)
    DISASTERS = []

SYSTEM_PROMPT = (
    "You are an expert assistant on engineering failures and incidents. "
    "Use the provided context from the archive to answer questions "
    "accurately and concisely. If the context doesn't contain enough "
    "information to answer, say so honestly rather than guessing."
)


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat(request: Request, req: ChatRequest):
    try:
        context = get_context(req.message, DISASTERS)
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT + f"\n\nRelevant archive records:\n{context}"},
            *req.history,
            {"role": "user", "content": req.message},
        ]
        return ChatResponse(response=openai_chat(messages))
    except Exception:
        logger.exception("Chat endpoint error")
        return ChatResponse(response="Something went wrong. Please try again.")
