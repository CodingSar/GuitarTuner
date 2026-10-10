---
description: Tuner module. Reads the guitar through the microphone. No datastore, so it owns no tables and has no store or migrations.
---

Purpose: listen to the microphone for tuning.

Public API: `startListening`.

Tables owned: none.

Slices:

- `start-listening`: opens the microphone and reports pending, listening, or denied; stop releases it.
