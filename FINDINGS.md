# Findings

Known gaps from the init-factory run (TASK-1). Each one is accepted as it
stands unless its status says otherwise.

| # | Finding | Status | Decision |
|---|---|---|---|
| 1 | Local shell runs Node 26.11.1. The pin is Node 24.21.0 (`.nvmrc`, `engines` in `package.json`). CI uses the pin and passes; local runs on 26 are not tested against the pin. | Open | Accepted by the user. Run `nvm use` (or `fnm use`) before local work. |
| 2 | Overlay path. Template `decision-7` titles the path `meta/guides/stack/`; the template guides and template TASK-5 use `meta/product/overlays/`. | Resolved here | Product uses `meta/product/overlays/`. The stale `decision-7` title is in the template and is not edited in this clone. |
| 3 | `SECURITY.md` points to GitHub private vulnerability reporting, which is not enabled on the repo. | Accepted | Local app; the user does not need it enabled. |
| 4 | `security.txt` (SEC-027) is not written. | Accepted | Local app. |
| 5 | `scripts/check.sh` SEC-002 check (`forbid grep -q "unsafe-" index.html`) passes silently while `index.html` is absent. | Accepted | Revisit when `index.html` lands. |
| 6 | jscpd (`npm run duplication`) analyzes only the markdown file. TypeScript source is not counted, so the duplication gate is weaker than it looks. | Accepted | Revisit once the product has more source. |
| 7 | Seed drafts carry `ASSUMED:` criteria: DRAFT-1 (drop D), DRAFT-2 (reference pitch), DRAFT-4 (±5 cent in-tune window), DRAFT-7 (audio-visual offset), DRAFT-8 (speed ramp). | Accepted | No mockups seen yet. Confirm before planning. |
| 8 | `pitchy` 4.1.0 is deferred as a pitch-detection dependency. | Deferred | Not needed for the skeleton. |
