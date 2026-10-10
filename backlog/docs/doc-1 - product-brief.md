---
id: doc-1
title: product-brief
type: specification
created_date: '2026-10-10 11:00'
updated_date: '2026-10-10 11:00'
---
# GuitarTuner

Browser guitar tuner plus a 6-string falling-note practice view with adjustable speed.

| Field | Value | Source |
|---|---|---|
| name | GuitarTuner | ASSUMED: repo name; concept names no product |
| one-liner | Browser guitar tuner plus a 6-string falling-note practice view with adjustable speed | CONCEPT.md: "This application is supposed to be able to do guitar tuning." / "a 6 string guitar view with the notes coming down" |
| users | Solo guitarists, no accounts | user, 2026-10-10 |
| core jobs | Tune each string by mic pitch detection; play the right string and fret as notes fall; toggle fall speed faster or slower | CONCEPT.md: tuning; falling notes; "toggles to indicate how fast or slow". Tuning method: user, 2026-10-10 |
| scale | Single user, no server, client-side only | user, 2026-10-10 |
| data sensitivity and compliance | No personal data (no accounts, no stored data). Mic audio used live, not stored. No regulated regime | user answers (no accounts); mic storage ASSUMED |
| deploy target | Web app in browser | user, 2026-10-10 |
| integrations | Browser microphone input and audio output only; no external systems | ASSUMED: concept names none |
| non-goals | User accounts and cloud sync; sheet music or tab import; mobile or native builds | user, 2026-10-10 |
| language preference | No preference; stack phase chooses and records it | user, 2026-10-10 |
