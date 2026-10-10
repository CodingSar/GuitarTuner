---
id: TASK-12
title: Bundled song library as note sequences
status: Done
assignee:
  - '@claude'
created_date: '2026-10-10 17:33'
updated_date: '2026-10-10 17:43'
labels:
  - 'module:practice'
  - song
dependencies: []
documentation:
  - doc-1
modified_files:
  - src/modules/practice/songs.ts
  - src/modules/practice/slices/list-songs/handler.ts
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The product brief excludes sheet-music and tab import, so songs must ship in the repo as hand-entered note sequences. Default choice: public-domain tunes only, so nothing is copied from licensed tabs. The player chooses a song and the practice view plays it back as visual notes. Tempo sets the note spacing. Later songs are added as data, not code.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 GIVEN the app ships WHEN the song list loads THEN it contains at least three public-domain songs, each with a title, a tempo, and a note sequence
- [x] #2 GIVEN a note with a string outside 1-6 or a fret outside 0-24 WHEN the song is validated THEN validation fails and names the note index
- [x] #3 GIVEN a valid song WHEN it is converted for practice THEN it becomes the note sequence and step length the start-session handler accepts
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Module: practice (existing). No datastore, no migrations, no store. Song data is shared by three slices, so types go in model.ts. Bundled data goes in songs.ts at module root (data, not code). Tempo is BPM, one note per beat, so stepMs = 60000 / tempo. Validation: string integer 1-6, fret integer 0-24, tempo > 0, title non-empty. The result names the note index 0-based, the same index start-session uses.
Bundled songs (public domain traditional or Beethoven 1823, hand-entered): Twinkle Twinkle Little Star (100 BPM), Ode to Joy (108 BPM), Frere Jacques (100 BPM).

1. Test first (test-writer). Create src/modules/practice/model.ts with types Song { title, tempo, notes: readonly SongNote[] } and SongNote { string, fret }. Create signature-only stubs: slices/list-songs/handler.ts (handler(): readonly Song[]), slices/validate-song/handler.ts (handler(song: Song): ValidationResult, with ValidationResult = { ok: true } | { ok: false; noteIndex: number; message: string }), slices/to-practice/handler.ts (handler(song: Song): { sequence: readonly SongNote[]; stepMs: number }). Re-export all three handlers and the types from src/modules/practice/index.ts. Add the three slices to src/modules/practice/_about.md. Tests: slices/list-songs/handler.test.ts (#1), slices/validate-song/handler.test.ts (#2), slices/to-practice/handler.test.ts (#3, with stepMs = 60000 / tempo and sequence equal to the song notes). Criteria covered: 1, 2, 3. Targeted: npx vitest run src/modules/practice
2. Bundled data and list-songs (implementer). Allowlist: src/modules/practice/songs.ts (new, exports BUNDLED_SONGS: readonly Song[] with the three songs above; the note positions are on standard tuning, string 1 = high E), src/modules/practice/slices/list-songs/handler.ts. Covers 1. Targeted: npx vitest run src/modules/practice/slices/list-songs
3. validate-song (implementer). Allowlist: src/modules/practice/slices/validate-song/handler.ts. Covers 2. Targeted: npx vitest run src/modules/practice/slices/validate-song
4. to-practice (implementer). Allowlist: src/modules/practice/slices/to-practice/handler.ts. Covers 3. Input is assumed valid; no check here. Targeted: npx vitest run src/modules/practice/slices/to-practice
5. Tidy and verify (orchestrator): npm run fix, scripts/check.sh, full npx vitest run.
Wiring: no route, command or job reaches these slices yet. The song picker is TASK-13's concern, so no app/ step here.

Song data for step 2, written as string/fret pairs (E4=1/0, F4=1/1, G4=1/3, A4=1/5, C4=2/1, D4=2/3, G3=3/0, C3=5/3). Twinkle Twinkle (100): 2/1 2/1 1/3 1/3 1/5 1/5 1/3 1/1 1/1 1/0 1/0 2/3 2/3 2/1. Ode to Joy (108): 1/0 1/0 1/1 1/3 1/3 1/1 1/0 2/3 2/1 2/1 2/3 1/0 1/0 2/3 2/3. Frere Jacques (100): 2/1 2/3 1/0 2/1 2/1 2/3 1/0 2/1 1/0 1/1 1/3 1/0 1/1 1/3 1/3 1/5 1/3 1/1 1/0 2/1 1/3 1/5 1/3 1/1 1/0 2/1 2/1 3/0 2/1 2/1 3/0 2/1. Titles: 'Twinkle Twinkle Little Star', 'Ode to Joy', 'Frere Jacques'.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: 64539092ee6efe1a816bdefb7d3fddbb88501e2e

test-first: 6 new tests fail with 'not implemented'; 56 others pass. Test-writer wrote 4 tests under TASK-12#2 (guide says one per criterion); accepted, not retried.

step 2: songs.ts data and list-songs handler; targeted list-songs test passes (1/1); tsc clean.

step 3: validate-song handler; targeted tests pass (4/4); tsc clean. Also checks empty title and tempo > 0 (plan), noteIndex -1 for those.

step 4: to-practice handler; targeted test passes (1/1); tsc clean.

tidy: jscpd clone in songs.ts. Notes now one string per song ('string/fret' tokens), parsed in list-songs handler. Output identical (checked against HEAD data). check.sh exits 0; full vitest 62/62; jscpd 0 clones.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added a bundled song library to the practice module: three public-domain songs (Twinkle Twinkle Little Star, Ode to Joy, Frere Jacques) stored as string/fret strings in songs.ts and parsed by list-songs; validate-song checks string 1-6 and fret 0-24 per note and names the 0-based note index; to-practice maps a song to the note sequence and stepMs = 60000 / tempo. Verified: vitest full suite 62/62 passing after tidy, targeted tests list-songs 1/1, validate-song 4/4, to-practice 1/1, scripts/check.sh exit 0, tsc clean. Gaps: to-practice test checks the returned shape but does not pass it into start-session, so 'accepted by start-session' is covered by type shape only; validate-song has 4 tests under TASK-12#2 (guide says one per criterion); parseNotes defaults missing tokens to 0 silently.
<!-- SECTION:FINAL_SUMMARY:END -->
