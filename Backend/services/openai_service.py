import os

from openai import OpenAI


def _client() -> OpenAI:
    return OpenAI(api_key=os.environ["OPENAI_API_KEY"])


def embed(text: str) -> list[float]:
    """Convert text to a vector using OpenAI text-embedding-3-small."""
    result = _client().embeddings.create(model="text-embedding-3-small", input=text)
    return result.data[0].embedding


def chat(messages: list[dict]) -> str:
    """Send a message list to gpt-4o-mini and return the response string."""
    result = _client().chat.completions.create(model="gpt-4o-mini", messages=messages)
    return result.choices[0].message.content
