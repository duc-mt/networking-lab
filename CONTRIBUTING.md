# Contributing

This is a solo portfolio, but it follows a lightweight version of standard team practices so it stays maintainable as it grows.

## Branching — GitHub Flow

1. Branch off `main`: `git checkout -b feat/hsrp-failover-lab`
2. Commit your work (see commit convention below).
3. Open a PR into `main` using the template in `.github/pull_request_template.md`.
4. CI (`.github/workflows/ci.yml`) must pass — it runs Prettier's format check and ESLint.
5. Merge. `.github/workflows/deploy.yml` publishes `main` to GitHub Pages automatically.

`main` is always deployable — don't commit directly to it for anything beyond a trivial typo fix.

## Commit convention — Conventional Commits

Every commit message follows `<type>: <description>`:

| Type       | When to use it                                        |
| ---------- | ----------------------------------------------------- |
| `feat`     | A new lab, a new site feature (e.g. search, a filter) |
| `fix`      | A bug fix                                             |
| `refactor` | Restructuring code/files with no behavior change      |
| `docs`     | README, CONTRIBUTING, prompt templates, comments      |
| `chore`    | Tooling, CI config, dependency bumps, `.gitignore`    |
| `style`    | Formatting only (e.g. a Prettier pass)                |

Examples:

```
feat: add HSRP failover drill lab
fix: correct back-link path in troubleshooting lab template
refactor: extract shared theme CSS/JS into assets/
docs: update README with new folder structure
chore: add ESLint flat config
```

## Local setup

No `npm install` is required to just **view** the site — see the README's "Run locally" section. `npm install` is only needed if you want linting/formatting tooling or the pre-commit hook:

```bash
npm install
npx pre-commit install   # optional but recommended — runs Prettier/ESLint checks before each commit
```

Before opening a PR:

```bash
npm run format:check   # or `npm run format` to auto-fix
npm run lint
```

## Adding a new lab

See the README's "Adding a new lab" section and `docs/prompt-templates.md` — that's the actual workflow (prompt → save under `projects/<type>/` → register in `assets/js/projects.js`), this file just covers the git/commit mechanics around it.

## A note on the lab HTML files

Files under `projects/**/*.html` are meant to stay single, self-contained HTML files (see `docs/prompt-templates.md` for why) aside from the two shared includes (`theme.css`, `theme-init.js`). Please don't split their inline CSS/JS into further external files as part of an unrelated PR — if you have a good reason to, raise it as its own `refactor` PR so it can be reviewed on its own.
