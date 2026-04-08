---
name: SVG Diagram Standards
description: Confirmed parameter set for all Engineering Failures Archive diagrams — skip re-asking these each session
type: project
---

All parameters confirmed by user. Apply these defaults to every diagram in this project without re-asking.

**Canvas**: `viewBox="0 0 1080 742"`, 16:11 aspect ratio, `width="1080" height="742"`

**Color palette**:
- Background (dark): `#2a2218`
- Red (critical/failure): `#c0392b`
- Amber (labels/accent): `#c0a870`
- Blue (water/structural): `#3a6a9a`
- Green (nominal/holds): `#2a7a2a`
- Light text: `#faf6ee`, `#f0ece4`
- Panel background: `#faf6ee`
- Panel header: `#3a2e1e`

**Typography**:
- Primary font: `Georgia, serif`
- Title: 14px, letter-spacing 3, `#f0ece4`
- Subtitle: 9px, letter-spacing 1.5, `#c0a870`
- Panel headers: 9.5px, letter-spacing 1, `#f0ece4`
- Body labels: 7.5–8.5px
- Small annotations: 6.5–7px
- Monospace not required unless code/data

**Stroke weights**:
- Primary structural lines: 2–2.5px
- Secondary/bulkhead lines: 1–1.5px
- Dashed critical elements: 2.8px, dasharray 6,3
- Annotation lines: 0.8px

**Arrowhead markers**: `#arr` (dark), `#arrR` (red), `#arrB` (blue) — defined in `<defs>`

**Layout vertical fit**:
- Content pre-scale often exceeds 742px; `transform="scale(1, 0.8628)"` wrapper is acceptable and intentional
- The scale compresses y-axis to fit tall content into 742px height
- All coordinate work happens in pre-scale space (~850px tall)

**Diagram types in this project**: cross-section engineering failure diagrams with ship/structure views, detail panels (A/B/C), annotated footer, interactive hotspots

**Grouping conventions**: descriptive comments (e.g., `<!-- PANEL A: RIVET FAILURE -->`), no strict id/class requirements beyond hotspot ids

**Legend/annotation**: Title block at top, legend box top-left, 3-panel detail row, annotated footer at bottom

**Overlap resolution priority**: labels over connectors, connectors route around shape bodies, deck/compartment labels inside hull shapes

**Why:** User confirmed all 10 standard parameter questions with "yes to all" — no need to re-ask in future sessions.

**How to apply:** Skip the parameter confirmation checklist at session start. Jump directly to audit phase.
