---
id: TASK-20
title: 'Practice: player sets the BPM'
status: Done
assignee:
  - '@claude'
created_date: '2026-10-10 19:07'
updated_date: '2026-10-10 19:41'
labels:
  - 'module:practice'
  - ui
dependencies: []
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The tempo is fixed per song, but the player wants to set the BPM themselves to practise slower or faster than the song's default.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 GIVEN a song is chosen WHEN the practice page shows it THEN the BPM field shows that song's tempo
- [x] #2 GIVEN the player types a whole-number BPM WHEN Start is pressed THEN the notes are spaced 60000 divided by that BPM ms apart
- [x] #3 GIVEN the BPM field holds a value that is not a whole number from 20 to 240 WHEN Start is pressed THEN the session does not start and the field says why
- [x] #4 GIVEN the BPM field holds a whole number WHEN the -/+ button is pressed THEN the BPM moves by 5 and stays within 20 to 240
- [x] #5 GIVEN the player changed the BPM WHEN Reset to song default is pressed THEN the BPM field shows the chosen song's tempo
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Tempo is a whole number from 20 to 240 BPM. Note spacing is 60000 / BPM ms; hit times keep the 3 s lead-in from TASK-19. Range and controls follow the approved mockup (-/+ step 5, Reset to song default).

0. Dependency (orchestrator-owned, separate commit): npm install -D jsdom@30.1.1 (exact pin; 30.1.2 is too new for the two-week rule). Add jsdom to meta/product/stack.md approved list. Files: package.json, package-lock.json, meta/product/stack.md. Used by step 5 tests via a per-file `// @vitest-environment jsdom` comment.

1. Model and validation. src/modules/practice/model.ts exports TEMPO_MIN = 20 and TEMPO_MAX = 240. New slice validate-tempo: handler(text: string) returns { ok: true; bpm: number } or { ok: false; reason: string }. Accepts only digits forming a whole number in 20..240; rejects empty, decimals, letters, negatives, out-of-range, with a reason saying "Enter a whole number from 20 to 240". Covers AC#3 (validation). Files: src/modules/practice/model.ts, src/modules/practice/slices/validate-tempo/handler.ts, src/modules/practice/index.ts (export validateTempo, TempoResult, TEMPO_MIN, TEMPO_MAX), src/modules/practice/_about.md (slice line). Target: npx vitest run src/modules/practice/slices/validate-tempo

2. Slice adjust-tempo: handler(bpm: number, delta: number) returns bpm + delta clamped to TEMPO_MIN..TEMPO_MAX. Covers AC#4 (clamp part). Files: src/modules/practice/slices/adjust-tempo/handler.ts, src/modules/practice/index.ts (export adjustTempo), src/modules/practice/_about.md. Target: npx vitest run src/modules/practice/slices/adjust-tempo

3. Slice to-practice: handler(song: Song, tempo: number = song.tempo) so stepMs = 60000 / tempo. Covers AC#2 (spacing). Files: src/modules/practice/slices/to-practice/handler.ts, src/modules/practice/_about.md.
   Change: src/modules/practice/slices/to-practice/handler.ts :: handler(song: Song) -> handler(song: Song, tempo?: number)

4. src/app/practice-view.ts: PracticeController gains defaultTempo(): number (tempo of the chosen song) and start(tempo?: number), passed to toPractice. Covers AC#1 (default value) and AC#2 (start uses the given tempo). Files: src/app/practice-view.ts; test-writer adds cases to src/app/practice-view.test.ts (keep existing tests). Target: npx vitest run src/app/practice-view.test.ts

5. App layer src/app/tempo-field.ts: mountTempoField(elements, practice) with elements = { input, error, minus, plus, reset }. Functions: showDefault() sets input to practice.defaultTempo() and clears the error; startFromField() runs validateTempo on input value, on failure shows reason in error and does not start, on success clears error and calls practice.start(bpm); minus/plus click call adjustTempo(current, -5/+5) and write back; reset click calls showDefault(). Covers AC#1 (field shows tempo), AC#3 (field message), AC#4 (buttons), AC#5 (reset). Files: src/app/tempo-field.ts, src/app/tempo-field.test.ts (// @vitest-environment jsdom, test-writer writes it, implementer makes it pass). Each file under 200 lines source, 300 test.

6. Wiring. practice.html: label "Tempo (BPM)" with input#bpm (type=number, inputmode=numeric, min=20, max=240, step=1, value=100), buttons #tempo-minus (aria-label "Slower by 5 BPM", text -), #tempo-plus (aria-label "Faster by 5 BPM", text +), p#bpm-error (role=alert, empty), button #tempo-reset "Reset to song default", and hint "Whole number, 20 to 240. Notes are spaced 60000 ÷ BPM ms apart." Follow Desktop-Practice mockup for placement. src/app/practice-page.ts: mount tempo-field, call showDefault() at load and on each song card click, Start button and song card click use startFromField(). Note: song card click currently calls start() directly; it must go through startFromField(). Files: practice.html, src/app/practice-page.ts, src/app/pages.test.ts (add a markup check for input#bpm, #bpm-error, #tempo-reset). Target: npx vitest run src/app/pages.test.ts

Final check: npx vitest run (full suite), scripts/check.sh. Manual browser check of the page wiring is noted in the task notes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: c978bf9b04717b95d16e9bbd5370f2ca7a46c7f1

step 1: ok, validate-tempo 9/9 (5a0debe)
step 2: ok, adjust-tempo 4/4 (8d06623)
step 3: ok, to-practice 2/2, tempo ?? song.tempo (commit below)

step 4: ok, practice-view 15/15 (defaultTempo throws only when no song chosen)

step 5: ok, tempo-field 8/8, boundaries clean

step 6: ok, pages.test 9/9, full suite 125/125, check.sh exit 0
step 7 (added, not in plan allowlist): src/app/theme.css, #tempo styling and desktop grid placement (row 4 under songs, tally moved to row 5). Needed so the section lands between songs and tally, not below the stage. Desktop layout not checked visually.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
BPM field on the practice page (range 20 to 240). Song tempo shows on load and on card click; Start and card click check the field (whole number 20 to 240) and show the reason when invalid; -/+ move by 5 within range; Reset to song default restores the song tempo; note spacing is 60000 / BPM ms. Evidence: full suite 125/125 (npx vitest run), scripts/check.sh exit 0, pushed 445de83. Targeted tests: validate-tempo 9/9, adjust-tempo 4/4, to-practice 2/2, practice-view 15/15, tempo-field 8/8, pages 9/9. Deviations: range 20 to 240 (AC wording 'positive whole number'); jsdom pinned to 30.1.1 (30.1.2 younger than two weeks); step 7 added (theme.css, not in plan allowlist) for desktop placement, not checked visually; theme.css is over the 200-line source cap (pre-existing, not split).
<!-- SECTION:FINAL_SUMMARY:END -->
