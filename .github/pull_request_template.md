## What does this PR do?

<!-- One or two sentences. Link an issue if there is one. -->

## Type of change

- [ ] `feat` — new lab, new feature, or new site capability
- [ ] `fix` — bug fix
- [ ] `refactor` — code/structure change with no behavior change
- [ ] `docs` — documentation only
- [ ] `chore` — tooling, CI, config, dependencies
- [ ] `style` — formatting only, no logic change

## If this adds/changes a lab

- [ ] Saved under the correct `projects/<type>/` folder (see `docs/prompt-templates.md`)
- [ ] Header has the shared theme includes (`assets/css/theme.css`, `../../assets/js/theme-init.js`) and the "← Portfolio" back-link
- [ ] Added/updated its entry in `assets/js/projects.js` (`type`, `topic`, `tags`, `status`, `dateAdded`)

## Checks before requesting review

- [ ] `npm run format:check` passes
- [ ] `npm run lint` passes
- [ ] Opened the page(s) in an actual browser (not just Claude's in-chat preview — see README "Known caveats") and confirmed the UI/theme/animations still work
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `style:`)
