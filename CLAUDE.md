# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Engineering Failures Archive — a static web application documenting 50+ catastrophic engineering disasters spanning 1847-2023. The site provides browsable disaster records with filtering, search, and detailed narrative pages.

## Architecture

**Tech Stack**: Vanilla HTML/CSS/JavaScript + JSON data + Python scraper

**Core Data Flow**:
- Single JSON file (`raw_failures.json`) stores all disaster records in a `disasters` array
- Client-side JavaScript loads this JSON and renders dynamically
- No build system or backend needed — entirely static, runs in browser

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
| `script.js` | Loads JSON, updates category counts, renders featured disasters |
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

## Git Workflow

After every meaningful unit of work, commit and push to GitHub so progress is never lost and any change can be reverted.

- Remote: `https://github.com/chanialDang/engineering-failures-archive` (branch `main`)
- Commit after each logical change — don't batch unrelated edits into one commit
- Write concise, descriptive commit messages: what changed and why, not just "update files"
- Always push immediately after committing: `git push origin main`

```bash
git add <changed files>
git commit -m "short description of what changed and why"
git push origin main
```

## Notes

- No server-side logic — all rendering happens in the browser after JSON fetch
- Search is case-insensitive substring match against name, location, type, year
- Discipline counts in archive view auto-calculated from raw_failures.json on each load
- `landing.js` is unused (legacy) — ignore it
- Grid layouts are CSS Grid; responsive via media queries (check styles.css for breakpoints)
