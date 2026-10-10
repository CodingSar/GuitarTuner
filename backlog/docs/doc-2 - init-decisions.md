---
id: doc-2
title: init-decisions
type: specification
created_date: '2026-10-10 11:00'
updated_date: '2026-10-10 11:11'
---
# init-decisions

Brief gate ratified 2026-10-10 (accept all). Rows cite product `decision-n` or harness `HD-n`; `-` means not a decision (fact, assumption, or user-stated scope).

| Ref | Item | Choice | Rationale | Rejected alternatives | Criterion |
|---|---|---|---|---|---|
| - | name | GuitarTuner | ASSUMED: repo name | - | criterion 2 |
| - | one-liner | Browser guitar tuner plus 6-string falling-note practice view with adjustable speed | CONCEPT.md lines 1-2 | - | criterion 2 |
| decision-3 | users | Solo guitarists, no accounts | User answer | Guitarists with saved progress; teachers and students | criterion 2 |
| decision-2 | core jobs | Tune by mic pitch detection; play falling notes on string and fret; toggle fall speed | CONCEPT.md lines 1-2; tuning method from user answer | Reference tones only; both | criterion 2 |
| decision-4 | scale | Single user, client-side, no server | User answer | Small hosted service; large hosted service | criterion 2 |
| - | data sensitivity and compliance | No personal data; mic audio used live, not stored; no regulated regime | Derived from user answers (no accounts); mic storage ASSUMED | Store recordings; accounts with personal data | criterion 2 |
| decision-1 | deploy target | Web app in browser | User answer | Desktop app (Electron or Tauri); mobile app; CLI | criterion 2 |
| - | integrations | Browser microphone input and audio output only; no external systems | ASSUMED: concept names none | Hosted backend; external services | criterion 2 |
| - | non-goals | User accounts and cloud sync; sheet music or tab import; mobile or native builds | User answers | - | criterion 2 |
| - | language preference | No preference; stack phase chooses and records it | User answer | Must be TypeScript; must be Python | criterion 2 |
| - | facet domain/music-training | Miss in central index; ratified | Core jobs: pitch tuning, falling-note play, speed toggle | domain/audio-processing (pitch detection is a technique, not a field rule) | criterion 3 |
| - | facet concern/security-web | Miss in central index; ratified | Deploy target: browser app; integrations: browser mic and audio | concern/privacy-gdpr (no personal data, no regime); concern/accessibility (no brief field raises it) | criterion 3 |

Stack gate ratified 2026-10-10 (accept all). Stack rows cite `decision-5` (stack decision); the datastore rows cite `decision-6` (`Supersedes HD-2`); architecture keeps HD-11.

| Ref | Item | Choice | Rationale | Rejected alternatives | Criterion |
|---|---|---|---|---|---|
| decision-5 | language and version | TypeScript 6.0.3 on Node 24.21.0 LTS | Brief: browser app, no language preference; TS 7 blocked by typescript-eslint peer `<6.1.0` | TypeScript 7.0.2; plain JavaScript | criterion 4 |
| decision-5 | framework | none (Vite is the build tool only) | Brief: canvas view and tuner readout need no framework | React; Svelte; Vue | criterion 4 |
| decision-5 | package manager | npm | Ships with Node 24 | pnpm | criterion 4 |
| decision-5 | install command | `npm ci` | Lockfile-exact install | `npm install` | criterion 4 |
| decision-5 | source root | src (default) | - | - | criterion 4 |
| decision-5 | source extensions | .ts | No UI framework, so no TSX | .ts,.tsx | criterion 4 |
| decision-5 | test file pattern | `^.*\.test\.ts$` | Vitest naming | `*.spec.ts` | criterion 4 |
| decision-5 | name case | kebab (default) | - | snake; camel | criterion 4 |
| decision-5 | entry file stems | index, handler (default) | HD-11 | - | criterion 4 |
| decision-6 | datastore | none | Brief: no accounts, no stored data | PostgreSQL (HD-2); IndexedDB or localStorage | criterion 4 |
| decision-6 | connection variable | none | No datastore | `DATABASE_URL` | criterion 4 |
| decision-6 | migration command | none | No datastore | - | criterion 4 |
| decision-5 | test command (full) | `npx vitest run` | Vitest 5.0.3 is the Vite-native runner | node:test; Jest | criterion 4 |
| decision-5 | test command (targeted) | `npx vitest run <path>` | Same runner | - | criterion 4 |
| decision-5 | check command | `scripts/check.sh` (default) | - | - | criterion 4 |
| decision-5 | fix command | `npm run fix` | Formatter and linter in fix mode | - | criterion 4 |
| decision-5 | linter | ESLint 10.12.0 + typescript-eslint 8.71.1 | Both verified against TS 6 peers | Biome 2.5.15 (TS 6 coverage unverified; smaller type-aware rule set) | criterion 4 |
| decision-5 | formatter | Prettier 3.9.10 | Mainstream, no peers | Biome formatter | criterion 4 |
| decision-5 | import boundary checker | dependency-cruiser 18.5.0 | Independent of lint stack; slice, index, shared, and app rules verified by probe | eslint-plugin-boundaries 7.2.0 (ESLint-only; entry-point rule deprecated) | criterion 4 |
| decision-5 | duplication checker | jscpd 5.4.1, tests excluded (default) | - | - | criterion 4 |
| decision-5 | dead code checker | knip 6.41.0 | Stack-native | - | criterion 4 |
| decision-5 | dependencies approved | list in `stack.md`; exact pins in `package.json` | Skeleton needs tooling only | pitchy 4.1.0: deferred to a product feature decision | criterion 4 |
| HD-11 | architecture | modules of slices, default kept, default caps | Small app; no tables, so store and migrations parts are inactive | flat slices (HD-1 as written); layered folders | criterion 4 |
