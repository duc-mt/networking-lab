# Understood Errors & Prevention Rules

This document logs resolved UI design and implementation errors in the `networking-lab` portfolio project, along with generalized rules to prevent reoccurrence.

---

## 1. UI Component Structural Drift in New Labs

### Symptom

Creating a new lab file from scratch resulted in inconsistent custom header bars (`glass-header`), custom tab buttons (`kb-tab`), missing node card layer badges, and non-standard terminal headers.

### Root Cause

Relying on ad-hoc HTML generation instead of explicitly copying established component markup patterns from existing project files (`projects/protocol/stp-visual-compare.html`, `projects/troubleshooting/vxlan-mtu-blackhole.html`).

### Generalized Rule

Before generating any new lab page HTML:

1. Inspect reference files in `projects/` for component structure.
2. Copy exact markup for Header, Mode Toggle Bar, 5-layer Node Cards, and Mac Terminal Console.
3. Validate FontAwesome 6 icon class names against verified project lists (e.g. use `fa-route`, never invented names like `fa-router`).

---

## 2. Canvas Overlay & SVG Area Border Overlaps

### Symptom

Legend overlays positioned inside the topology canvas overlapped bottom SVG area bounding box borders, and shrinking area boxes caused node cards to clip outside area boundaries.

### Root Cause

Inadequate canvas height (`h-[480px]`) and fixed area bounding box heights (`height="80%"`) without calculating node card bounds and legend overlay margins.

### Generalized Rule

When creating multi-area topology canvases with bottom legend overlays:

1. Set topology canvas height to at least `h-[540px]`.
2. Set area SVG bounding rects to `y="5%"` and `height="78%"`, placing the bottom border of area boxes at 83%.
3. Center node cards within the 5%–78% vertical band (e.g. top row `y: 26%`, middle row `y: 45%`, bottom row `y: 62%`).
4. Position embedded glassmorphic legend overlays at `bottom-3.5` (below 83%), guaranteeing zero overlap between legends, area borders, and node cards.
