"""
One-time script: embed all disasters from raw_failures.json and load into Supabase.

Run from the Backend/ directory:
    python seed_supabase.py

Requires .env with OPENAI_API_KEY, SUPABASE_URL, SUPABASE_KEY.
Safe to re-run — clears existing documents first.
"""

import json
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

from db.supabase import clear_documents, insert_document
from services.openai_service import embed

DATA_PATH = Path(__file__).parent / "raw_failures.json"


def build_chunk(d: dict) -> str:
    return (
        f"{d.get('id', '?')} — {d.get('name', '?')} "
        f"({d.get('year', '?')}, {d.get('discipline', '?')}, {d.get('location', '?')}): "
        f"{d.get('cause', '')}"
    )


def main():
    with open(DATA_PATH) as f:
        disasters = json.load(f)["disasters"]

    print(f"Loaded {len(disasters)} disasters. Clearing existing documents...")
    clear_documents()

    for i, d in enumerate(disasters, 1):
        chunk = build_chunk(d)
        vector = embed(chunk)
        insert_document(chunk, vector)
        print(f"  [{i}/{len(disasters)}] {d.get('id')} — {d.get('name')}")

    print(f"\nDone. {len(disasters)} documents seeded into Supabase.")


if __name__ == "__main__":
    main()
