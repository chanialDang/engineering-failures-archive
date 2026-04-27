# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project
Engineering Failures Archive — static site, 50+ disaster records (1847–2023). Filterable archive with detail pages.

**Stack**: Vanilla HTML/CSS/JS + `raw_failures.json` + Python scraper. FastAPI (monolithic) + Supabase (Postgres + pgvector) + OpenAI (GPT-4o-mini chat + text-embedding-3-small) deployed on Railway.

**Pages**:
1. `index.html` + `script.js` — Landing: hero, stats, timeline, featured grid
2. `archive.html` + `archive.js` — Full archive: filter chips, search, sort
3. `disaster.html` + `disaster.js` — Detail: narrative, diagram, video

**Key patterns**:
- URL state: `?discipline=Civil`, `?id=FAIL-005`
- ID format: `FAIL-###` (zero-padded)
- Diagrams: `diagrams/5.svg` → FAIL-005 (no leading zero; supports svg/png/jpg/jpeg/webp)
- Featured list: hardcoded array in `script.js`

## Commands

**Backend (run from `backend/`):**
```bash
# Install deps
pip install -r requirements.txt

# Start dev server (reads .env automatically)
uvicorn main:app --reload --port 8000

# Seed Supabase vector store (one-time; safe to re-run — clears first)
python seed_supabase.py
```

**Frontend**: open any `.html` directly in a browser, or use `python -m http.server` from the project root. No build step.

**Required env vars** (in `backend/.env`):
```
OPENAI_API_KEY=...
SUPABASE_URL=...
SUPABASE_KEY=...
ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app  # comma-separated; defaults to localhost:3000
```

## Files
| File | Purpose |
|------|---------|
| `raw_failures.json` | Source of truth — `disasters[]` with fields: `id`, `name`, `year`, `location`, `discipline`, `type`, `cause` |
| `imagery.js` | `getImagery(disaster)` → `{hero, thumb, credit, alt}`. Per-disaster overrides + discipline/type fallbacks (Wikimedia archival + Unsplash thematic). Loaded before `script.js`/`archive.js`/`disaster.js` on every page that displays cards. |
| `script.js` | Landing logic, `buildTimeline()`, featured array, `setHeroBackground()`, `initParallax()` |
| `archive.js` | Filter/sort/search, URL param parsing, FLIP-style fade transitions on filter |
| `disaster.js` | `?id=` parsing, `VIDEOS` object at top of file, `buildRelated()`, `initCinemaParallax()` |
| `styles.css` | Global styles. V2 redesign block at end (~line 2050+): cinematic hero, editorial numerals, cinematic image cards, archive thumbnail+accent-bar cards, ds-cinema-hero, related-disasters strip |
| `scraper.py` | Gathers/validates data → `raw_failures.json` |
| `backend/main.py` | FastAPI app entry — mounts middleware + routes |
| `backend/models/schemas.py` | Pydantic request/response models |
| `backend/db/supabase.py` | Only file that touches Supabase — never import supabase elsewhere |
| `backend/services/openai_service.py` | All OpenAI API calls — the only layer allowed to call OpenAI |
| `backend/services/rag_service.py` | Vector search + context injection |
| `backend/requirements.txt` | Python dependencies — fastapi, uvicorn, openai, supabase, python-dotenv, pydantic |
| `.env` | `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY` — never commit |

Unused: `landing.js` (legacy — ignore)

## Design System (DONE — do not revert)
**Palette**: Dark `#1a1814`/`#000` (hero/dark) · Beige `#f7f4ef` (body) · White cards · Red `#c0392b` accent  
**Font**: `Space Mono` everywhere — no Orbitron  
**Cards**: `border-radius: 18px`, hover `translateY(-6px)`  
**Buttons/chips/search**: `border-radius: 980px` pill  
**Navbar**: `rgba(0,0,0,0.72)` + blur, fixed, "EFA" logo — identical across all pages  
**Scroll reveal**: `.reveal`, Intersection Observer, `opacity + translateY(30px)`

**Landing sections** (in order):
1. Hero — 100vh `#000`, pill CTAs
2. Stats strip — beige, hardcoded stats (1.5M+, 80%, $100B+, 7yr) — NOT archive counts
3. Why — beige, narrative text
4. Timeline — dark, 10 disasters from `raw_failures.json` via `buildTimeline()`
5. Featured — white, 3-col card grid, staggered reveal
6. Categories — dark, 4-tile strip
7. CTA — dark, oversized headline + pill button

**Archive**: eyebrow + title header, pill search + filter chips  
**Disaster**: 18px card/panel radius, pill nav buttons

## Editing Content
- Disasters: edit `raw_failures.json`; valid disciplines: `Civil`, `Mechanical`, `Electrical`, `Chemical`; `cause` is markdown
- Diagrams: drop `diagrams/{number}.svg` — auto-loaded, no JSON edit needed; SVGs use `viewBox="0 0 1080 742"`
- Videos: add to `VIDEOS` in `disaster.js`: `'FAIL-005': { url: '...', label: '...' }`
- Featured: edit `featured` array in `script.js`

## Backend Architecture

**Monolithic FastAPI** — one Python 3.11 process, `uvicorn main:app`. All concerns are organized folders inside that single process. Nothing is a separate service.

**Deployed**: Railway (backend) + Vercel (frontend)  
**Database**: Supabase — Postgres + pgvector for RAG document search  
**AI**: OpenAI GPT-4o (chat) + text-embedding-3-small (embeddings)

### Folder Structure
```
backend/
├── main.py                    ← app entry, mounts middleware + routes + rate limiter
├── limiter.py                  ← slowapi Limiter instance (imported by main + routes)
├── middleware/cors.py          ← CORS: allow only Vercel frontend domain (GET/POST only)
├── routes/chat.py              ← POST /chat — rate-limited 20/min per IP
├── routes/settings.py          ← POST/GET /settings — returns 404/500 HTTPException on error
├── services/openai_service.py  ← all OpenAI API calls live here
├── services/rag_service.py     ← vector search + context injection
├── models/schemas.py           ← Pydantic request/response models with Field validators
├── db/supabase.py              ← ONLY file that touches Supabase; exposes ping()
├── supabase_schema.sql         ← run once in Supabase SQL editor to create tables + RPC
├── .env                        ← never commit — OPENAI_API_KEY, SUPABASE_URL, SUPABASE_KEY
└── requirements.txt            ← includes slowapi==0.1.9
```

### RAG / Chat Data Flow
1. `POST /api/chat` receives `{message, history}` (message ≤ 2000 chars)
2. `rag_service.get_context()` embeds the message via OpenAI → vector search via Supabase RPC `match_documents`
3. If vector search returns nothing (Supabase down or empty), falls back to keyword search over in-memory `DISASTERS` list
4. Context + system prompt + history + user message → `openai_service.chat()` → GPT-4o-mini
5. The `seed_supabase.py` script must be re-run whenever `raw_failures.json` changes to keep the vector store in sync

### Security Layers (outermost first)
1. **middleware/cors.py** — blocks all origins except Vercel frontend; allows only GET/POST
2. **limiter.py + SlowAPIMiddleware** — caps /chat at 20 requests/minute per IP (429 on excess)
3. **models/schemas.py** — Pydantic + Field validators; malformed/oversized data returns 422
4. **routes/** — only `/chat`, `/settings`, `/health` exist; nothing else reachable
5. **services/** — API key validated at startup; loaded from `.env` only; sole OpenAI caller
6. **db/supabase.py** — sole Supabase interface; save_setting rejects keys >256 / values >4096 chars
7. **logging + try/except on every route** — errors logged with exc_info; stack traces never in HTTP responses

### Rules (never break these)
- `.env` never committed — `.gitignore` must include it
- Stack traces never returned in HTTP responses
- `db/supabase.py` is the only file allowed to import `supabase`
- `services/` is the only layer allowed to call OpenAI

## Notes
- Search: case-insensitive substring on name/location/type/year
- Discipline counts: auto-calculated from JSON on load
- Grid: CSS Grid, responsive via breakpoints in `styles.css`
- Chat widget is on every page: `index.html` (via `script.js`), `archive.html`, `disaster.html`, `why.html`, `sources.html` (via `chat-widget.js`). Same SVG speech-bubble icon on all pages.
- Chat widget renders markdown + math: marked.js + KaTeX loaded via CDN on all pages; `appendMsg()` uses `marked.parse()` then `renderMathInElement()`
- `chat-widget.js` — standalone IIFE with all chat widget logic; loaded by all pages except `index.html` (which uses `script.js`) and `chat.html` (full-page chat)
