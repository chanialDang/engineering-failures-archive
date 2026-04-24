import logging
import os

from openai import OpenAI

logger = logging.getLogger(__name__)


def _make_client() -> OpenAI:
    key = os.environ.get("OPENAI_API_KEY", "")
    if not key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=key, timeout=30)


_client = _make_client()


def embed(text: str) -> list[float]:
    try:
        result = _client.embeddings.create(model="text-embedding-3-small", input=text)
        return result.data[0].embedding
    except Exception:
        logger.exception("OpenAI embed failed")
        raise


def chat(messages: list[dict]) -> str:
    try:
        result = _client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        return result.choices[0].message.content
    except Exception:
        logger.exception("OpenAI chat failed")
        raise
