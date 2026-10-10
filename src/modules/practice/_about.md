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
- `set-fall-speed`: holds the drawn fall speed, ramps it on toggle, and computes drawn distance from a fixed hit time; hit times never change.
- `list-songs`: returns the bundled songs, each with a title, a tempo, and a note sequence.
- `validate-song`: checks that every note has a string 1-6 and a fret 0-24, and names the index of a note that fails.
- `to-practice`: turns a song into the note sequence and a step length in milliseconds, one note per beat.
- `layout-falling-notes`: places each note on its string row and at a canvas y from its hit time, the current time, and the fall speed; hit times never change.
- `map-pitch`: maps a detected pitch in hertz to the nearest string and fret on the open strings within 50 cents, preferring a given candidate on a tie; a pitch further than 50 cents from every fret maps to nothing.
