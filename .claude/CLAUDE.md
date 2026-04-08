# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Engineering Failures Archive — a static web application documenting 50+ catastrophic engineering disasters spanning 1847-2023. The site provides browsable disaster records with filtering, search, and detailed narrative pages. 

## Architecture

**Tech Stack**: Vanilla HTML/CSS/JavaScript + JSON data + Python scraper
**Planned addition**: Python FastAPI backend + OpenAI API → engineering AI chat assistant

**Core Data Flow**:
- Single JSON file (`raw_failures.json`) stores all disaster records in a `disasters` array
- Client-side JavaScript loads this JSON and renders dynamically
- Currently static — backend being added for AI chat feature

**Page Structure**:
1. **index.html** (landing) → `script.js` — Hero section with featured disasters (6 handpicked FAIL-IDs)
2. **archive.html** (list view) → `archive.js` — Full disaster grid with filter/sort/search
3. **disaster.html** (detail) → `disaster.js` — Individual disaster narrative + diagram + video
4. **styles.css** — Shared styling (Orbitron font, grid layout, dark theme with glow effects)

**Key Patterns**:
- URL params carry state: `?discipline=Civil`, `?id=FAIL-005` parsed in each JS file
- Disaster ID format: `FAIL-###` (zero-padded, e.g., `FAIL-001`, `FAIL-050`)
- Disasters can be featured by hardcoding their ID in `script.js` `featured` array
- Diagrams auto-loaded by number: `diagrams/5.svg` → FAIL-005 (no leading zero, any image type)

## Common Development Tasks

**Viewing the site locally**:
```bash
cd /Users/danielchang/stupid\ website
python3 -m http.server 8000
# Visit http://localhost:8000
```

**Adding/editing disasters**:
- Edit `raw_failures.json` directly — array of objects with fields: `id`, `name`, `year`, `location`, `discipline`, `type`, `cause`
- Valid disciplines: `Civil`, `Mechanical`, `Electrical`, `Chemical` (used for filtering counts + chips)
- Cause field should be markdown-ready (rendered in detail page)

**Adding diagrams**:
- Place in `diagrams/` folder, named by disaster number: `diagrams/5.svg` for FAIL-005
- Supports `.svg`, `.png`, `.jpg`, `.jpeg`, `.webp`
- SVGs should use `viewBox="0 0 1080 742"` for perfect 16:11 aspect ratio
- Referenced automatically by disaster.js with no JSON changes

**Adding videos**:
- Edit `VIDEOS` object in `disaster.js` (top of file)
- Add entry: `'FAIL-005': { url: 'https://youtube.com/...', label: '...' }`
- Omit entry to hide video section for that disaster

**Scraping/updating disaster data**:
```bash
python3 scraper.py
# Outputs new/updated entries to raw_failures.json with validation (year 1800-2025, no dupes)
```
Scraper ID counter auto-increments; restart from a clean counter if needed by editing `self.id_counter` in the source.

**Making featured disasters**:
- Edit the `featured` array in `script.js` (lines 27-34) — add/remove FAIL-IDs
- Grid displays exactly what's in that array (rendered in order)

## File Manifest

| File | Purpose |
|------|---------|
| `index.html` | Landing page hero + featured 6-disaster grid |
| `script.js` | Loads JSON, updates category counts, renders featured disasters + timeline |
| `archive.html` | Full archive list with filter chips + search + sort |
| `archive.js` | Filtering, sorting, search logic; URL param parsing for pre-filter |
| `disaster.html` | Detail page template (narrative + diagram + video) |
| `disaster.js` | Parses `?id=` param, fetches disaster, populates page + handles VIDEOS lookup |
| `styles.css` | Global styles (fonts, layout, animations, theme) |
| `raw_failures.json` | Single source of truth — all disaster records |
| `scraper.py` | Python script to gather/validate disaster data |
| `diagrams/` | Static diagram assets (organized by number, e.g., `46-1.svg` for FAIL-046 variations) |
| `.vscode/launch.json` | VS Code debug config |
| `settings.json` | Python env manager preference |
| `api/chat.py` | *(planned)* FastAPI backend endpoint — receives chat messages, calls OpenAI, returns response |
| `.env` | *(planned)* `OPENAI_API_KEY=sk-...` — never commit, never expose to browser |
| `.gitignore` | *(planned)* must include `.env` |

## Current Design System (COMPLETED — April 2026)

Full site redesign is done across all three pages. Do not revert or re-plan this.

**Palette (hybrid)**:
- Hero / dark sections: `#1a1814` (archive near-black), hero at `#000`
- Body sections: `var(--bg-dark)` = `#f7f4ef` (warm beige)
- Cards: `var(--bg-card)` = `#ffffff`
- Accent: `#c0392b` (red, single accent throughout)

**Typography**: `Space Mono` everywhere — headings, body labels, badges, IDs. No Orbitron anywhere.

**Components**:
- All cards: `border-radius: 18px`, hover `translateY(-6px)`
- All buttons/chips/search: `border-radius: 980px` pill
- Navbar: dark glass (`rgba(0,0,0,0.72)` + blur), fixed, "EFA" logo — identical across all pages
- Scroll reveal: Intersection Observer, `.reveal` class, `opacity + translateY(30px)` → visible

**Landing page sections** (`index.html` + `script.js`):
1. Hero — 100vh `#000`, Space Mono stacked headline, pill CTAs
2. Stats strip — warm beige, 4 impact stats (1.5M+, 80%, $100B+, 7yr) — NOT the archive counts
3. Why — warm beige, single-column narrative text
4. Timeline — dark `#1a1814`, 10 disasters from 1847–2023, built from `raw_failures.json` by `buildTimeline()` in `script.js`
5. Featured — white bg, 3-col card grid, staggered reveal
6. Categories — dark `#1a1814`, 4-tile horizontal strip
7. Final CTA — dark, Space Mono oversized line + pill button

**Archive page** (`archive.html`): eyebrow + title header, pill search + filter chips, 18px controls-wrapper
**Disaster page** (`disaster.html`): 18px card/panel radius, pill nav buttons, same EFA navbar

## Planned: AI Chat Backend

Engineering-focused AI assistant using OpenAI API, backed by `raw_failures.json` data.

**Architecture**:
```
Browser chat UI → POST /api/chat → FastAPI (api/chat.py) → OpenAI API → response
```

**Three components**:
1. **API key** — stored in `.env` as `OPENAI_API_KEY=sk-...`, read server-side only. Never in JS or HTML.
2. **System prompt** — instructs OpenAI to act as engineering failure expert, sent with every request
3. **Context injection** — backend loads `raw_failures.json`, finds relevant disaster, injects data into prompt before calling OpenAI. This makes it answer from the actual archive, not just training data.

**Running the backend locally**:
```bash
cd /Users/danielchang/stupid\ website
pip install fastapi uvicorn openai python-dotenv
uvicorn api.chat:app --reload --port 8001
# Frontend static site still on port 8000
# Backend API on port 8001
```

**Key implementation notes**:
- Use `python-dotenv` to load `.env` — `load_dotenv()` at top of `chat.py`
- CORS must allow `http://localhost:8000` (the static site origin)
- Frontend `fetch()` calls `http://localhost:8001/api/chat` with `{ message: "..." }`
- Backend reads `raw_failures.json` at startup, keeps it in memory
- Disaster matching: search `name`, `type`, `discipline` fields for keywords in the user message
- Model to use: `gpt-4o-mini` (cheap, fast, good enough for Q&A)
- For deployment: swap FastAPI for Vercel Functions (`api/chat.js`) — same logic, no server needed

**DO NOT**:
- Put the API key in any `.js`, `.html`, or `.json` file
- Commit `.env` to git (add to `.gitignore` first)
- Call OpenAI directly from the browser

## Notes

- Search is case-insensitive substring match against name, location, type, year
- Discipline counts in archive view auto-calculated from raw_failures.json on each load
- `landing.js` is unused (legacy) — ignore it
- Grid layouts are CSS Grid; responsive via media queries (check styles.css for breakpoints)
