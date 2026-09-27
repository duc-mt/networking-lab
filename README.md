# Network Engineering Portfolio


[![CI](https://github.com/duc-mt/network-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/duc-mt/network-portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/duc-mt/network-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/duc-mt/network-portfolio/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-2ea44f)](https://duc-mt.github.io/network-portfolio/)

Static portfolio of interactive networking labs. No build step — plain HTML/CSS/JS, deployed as-is to GitHub Pages.

**Live demo:** `https://duc-mt.github.io/network-portfolio/` _(placeholder — update once pushed)_

## Structure

The site is organized around 8 lab **formats** — see `docs/prompt-templates.md` for what each one is, when to use it, and the prompt that generates it (and `docs/prompt-scenarios.md` for quick-copy scenario examples in English and Vietnamese).

```
/
├── index.html                    # Landing page: hero, about, skills, searchable/filterable project grid
├── assets/
│   ├── css/
│   │   └── theme.css              # Shared CSS (identical across every page — scrollbar, transitions)
│   ├── js/
│   │   ├── theme-init.js          # Shared no-FOUC theme script, loaded first in every page's <head>
│   │   └── projects.js            # Project registry + type taxonomy — the only file you edit to add a lab
│   └── images/                    # Reserved for future favicon/screenshots (currently empty)
├── projects/
│   ├── protocol/                  # State-machine labs (e.g. ospf-adjacency.html)
│   ├── troubleshooting/           # Symptom → root cause labs
│   ├── packet-walk/               # Firewall/NAT packet-trace labs
│   ├── change-mop/                # Change management / cutover labs
│   ├── automation/                # Script/API workflow labs
│   ├── failover/                  # HA/failover drill labs
│   ├── topology-design/           # Static topology/routing-table reference dashboards
│   └── diagnostic-playbook/       # Tabbed catalogs of failure-mode snapshots
├── docs/
│   ├── prompt-templates.md        # One reusable prompt per folder above, plus a table of which to use when
│   └── prompt-scenarios.md        # Quick-copy scenario blocks per prompt — placeholder + example, EN + VI
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # Lint + format check on every PR/push
│   │   └── deploy.yml             # Publishes main to GitHub Pages
│   └── pull_request_template.md
├── .gitignore
├── .pre-commit-config.yaml        # Optional local pre-commit hook (Prettier + ESLint)
├── .prettierrc
├── eslint.config.js
├── package.json                   # devDependencies only — Prettier/ESLint, not needed to view the site
├── CONTRIBUTING.md
└── README.md
```

Every page (homepage and every lab) is still a self-contained HTML file at heart: Tailwind CSS via CDN, Font Awesome via CDN, Inter + Fira Code fonts, no bundler. The only shared local files are `assets/css/theme.css` and `assets/js/theme-init.js` — a handful of lines identical across every page (scrollbar styling, the no-FOUC theme script) that used to be copy-pasted into each new lab. Everything specific to one page — the homepage's hero animation, a lab's `labTimeline` and topology/packet CSS — stays inline in that page, so generating a new lab from a prompt in `docs/prompt-templates.md` still produces one drop-in HTML file (plus two include lines — see that doc).

## Run locally

No install needed to just view the site:

```bash
# Option A — VS Code "Live Server" extension: right-click index.html → "Open with Live Server"

# Option B — any local static server, e.g.:
npx http-server .
# or
python -m http.server 8000
```

Then visit the printed URL (serving the folder matters more than which server — it makes relative paths behave exactly like they will on GitHub Pages; opening `index.html` directly via `file://` also works, just double-check paths after any structural change).

`npm install` is **only** needed for the optional dev tooling (linting/formatting) — see "Local tooling" below.

## Deploy on GitHub Pages

This repo deploys via GitHub Actions (`.github/workflows/deploy.yml`), not the "Deploy from a branch" setting:

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Source** and select **"GitHub Actions"** (not "Deploy from a branch" — that setting would conflict with the workflow).
3. Push to `main` (or run the workflow manually from the Actions tab) — `deploy.yml` publishes automatically.
4. The site appears at `https://<username>.github.io/<repo>/`.

`ci.yml` runs lint/format checks on every PR and push; it doesn't gate `deploy.yml` directly, so it's worth enabling a branch-protection rule requiring CI to pass before merging to `main` (Settings → Branches).

## Local tooling

Prettier (formatting) and ESLint (linting `assets/js/*.js` only — see `eslint.config.js` for why inline lab scripts are excluded) are dev-only; they don't affect the deployed site.

```bash
npm install
npm run format:check   # or `npm run format` to auto-fix
npm run lint
```

Optional: install the pre-commit hook so these run automatically before each commit — see `CONTRIBUTING.md`.

## Adding a new lab

1. Pick the matching prompt in `docs/prompt-templates.md` — one per format (protocol, troubleshooting, packet-walk, change-mop, automation, failover, topology-design, diagnostic-playbook) — and generate the lab HTML with it. If you just finished troubleshooting something real, the troubleshooting prompt is the one to reach for while the details are fresh.
2. Save it under the matching folder: `projects/<type>/<slug>.html` — e.g. `projects/failover/hsrp-drill.html`.
3. Swap the AI-generated no-FOUC script / scrollbar CSS for the two shared includes (`assets/css/theme.css`, `assets/js/theme-init.js`) — see `docs/prompt-templates.md` for the exact snippet — and add the "← Portfolio" back-link, pointing to `../../index.html` (copy the header block from `projects/protocol/ospf-adjacency.html` and adjust the title).
4. Open `assets/js/projects.js` and add one object to the `PROJECTS` array:
    ```js
    {
        title: "HSRP Failover Drill",
        topic: "Routing",                              // subject domain — free text, see below
        description: "One-line summary shown on the card.",
        type: "failover",                              // must be a key in PROJECT_TYPES — see below
        tags: ["HSRP", "Convergence", "Timers"],       // searchable keywords
        href: "projects/failover/hsrp-drill.html",
        status: "live",                                 // or "soon" for a muted placeholder card
        dateAdded: "2026-10-01"
    }
    ```

Nothing in `index.html` changes when you add a lab — it reads `assets/js/projects.js` at runtime to build the grid, the filter chips, the topic dropdown, the search index, and the "N labs live" hero line.

### `type` vs `topic` — two independent axes

- **`type`** — the UI _format_ the lab uses (state machine, logic tree, pipeline, static reference graph, tabbed catalog, etc). Must be one of the 8 keys defined in `PROJECT_TYPES` at the top of `assets/js/projects.js` (`protocol`, `troubleshooting`, `packet-walk`, `change-mop`, `automation`, `failover`, `topology-design`, `diagnostic-playbook`). Drives the lab's folder, icon, gradient color, and the fixed filter chips — inherited from the type, not set per project (override with an `icon`/`accent` field only to break from the default).
- **`topic`** — the _subject domain_ (e.g. "Routing", "Switching", "Security", "Automation"). Independent of `type`: two labs can share a type but different topics (STP and VLAN are both `protocol`-type, but "Switching" topic; OSPF is also `protocol`-type but "Routing" topic). Free text — the "Topic" dropdown on the homepage is built from whatever values actually show up in `PROJECTS`.

If you want a new `type` (a genuinely new UI format, not just a new topic), add it to `PROJECT_TYPES` with its own `label`/`short`/`icon`/`accent`, create the matching `projects/<key>/` folder, and add a prompt for it to `docs/prompt-templates.md` following the pattern of the existing ones — this is exactly how `topology-design` was added.

## Search, filtering & sorting

- A live **search box** — matches title, description, topic, type label, and tags.
- **Type filter chips** — one per format in `PROJECT_TYPES`, plus "All", always shown with a live count even for types with only "soon" placeholders.
- A **Topic dropdown** — built dynamically from whatever `topic` values exist in `PROJECTS`.
- A **Newest / A–Z sort** — "Newest" sorts by each entry's `dateAdded`.

All four are driven entirely by `assets/js/projects.js`.

## Theme

Dark/light mode is stored in `localStorage` under the key `portfolio-theme`. Every page loads `assets/js/theme-init.js` as the very first thing in `<head>` (before Tailwind), so there's no flash of the wrong theme, and the choice persists across pages. The toggle button's own wiring differs slightly per page (the homepage uses a global `toggleTheme()`; the OSPF lab wires it through its `app.toggleTheme()` class method) — deliberately left unmerged during the assets refactor to avoid touching working per-page logic; see `assets/js/theme-init.js`'s own comment for why.

## Known caveats (not bugs)

- **Tailwind CDN console warning** ("should not be used in production") — expected. The Play CDN isn't optimized for production traffic, but for a static portfolio like this it's fine; ignore the warning.
- **Font Awesome icons may show as empty boxes when previewed inside Claude's chat UI.** Claude's in-app HTML preview only allows external stylesheets from `fonts.googleapis.com`; Font Awesome's CSS comes from `cdnjs.cloudflare.com`, so the preview silently blocks it. This is a preview-sandbox limitation only — a real browser (and GitHub Pages) has no such restriction. **Do not** "fix" this by switching Font Awesome to its JS/SVG build — that build permanently replaces `<i class="fas fa-x">` with a static `<svg>` on load, which breaks every place these labs swap icons at runtime via `.className` reassignment (theme toggle, play/pause, per-step packet icons). Verify icons in an actual browser or the deployed Pages URL, not the in-chat preview.

