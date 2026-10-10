---
id: doc-2
title: init-decisions
type: specification
created_date: '2026-10-10 11:00'
updated_date: '2026-10-10 11:00'
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

Note for the stack gate: a server-less, storage-less product supersedes the HD-2 default datastore (PostgreSQL). That needs its own decision titled `Supersedes HD-2: ...`, to be raised at the stack gate, not here.
