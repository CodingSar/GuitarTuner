---
description: Practice module. Turns a string and fret sequence into falling notes and judges hits. No datastore, so it owns no tables and has no store or migrations.
---

Purpose: run a falling-note practice session from a string and fret sequence.

Public API: `startSession`.

Tables owned: none.

Slices:

- `start-session`: turns a sequence into falling notes with fixed hit times; pause and resume hold the notes at their positions.
- `record-hit`: judges one falling note as hit, missed, or pending from the inputs played within the timing window.
- `set-latency-offset`: holds the audio-visual offset in milliseconds and maps a time onto the adjusted time that hits are judged against.
