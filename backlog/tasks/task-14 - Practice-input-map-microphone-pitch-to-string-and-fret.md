---
id: TASK-14
title: 'Practice input: map microphone pitch to string and fret'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 17:34'
updated_date: '2026-10-10 18:05'
labels:
  - 'module:practice'
  - tuner
dependencies:
  - TASK-13
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Judging hits (TASK-7) needs played input as string and fret, but the tuner only reports the nearest string and cents. Default choice: map a detected pitch to the fret on the selected tuning whose pitch is nearest, and ignore pitches more than 50 cents from any fret (ASSUMED tolerance, half a semitone). Visual hit and miss feedback comes from the existing record-hit logic.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GIVEN practice is running with the mic on WHEN a pitch within tolerance of a fret on a string is detected THEN it is passed to record-hit as that string and fret
- [x] #2 GIVEN a detected pitch more than 50 cents from every fret WHEN it is read THEN it is ignored and no input is recorded
- [x] #3 GIVEN a note reaches the hit line WHEN the matching string and fret arrive within the timing window THEN the note is shown as hit, otherwise as missed
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Module: practice (existing, no datastore). Reuses record-hit for judging (hit only when string and fret match within the window; otherwise missed after the window, pending before). Pitch reaches the practice module as a plain frequency: the page reads the tuner's Reading (label and cents) and rebuilds hz = target.hz * 2^(cents/1200), so the tuner module is not changed. The tuner's detector searches 60-1000 Hz only, so frets above about 19 on string 1 are not readable; this is a known limit, not fixed here.
Default reading (from the task description): a pitch maps to the nearest fret on the selected tuning, within 50 cents, over all six strings (string 1 is the high E). A pitch on the same note from two strings (for example E4 is string 1 fret 0 and string 2 fret 5) is a tie; the tie goes to the note in play, when that note is one of the tied candidates; otherwise to the lowest string. Window: 150 ms (ASSUMED; no criterion gives a value). Judging uses the controller's audio time, so pause freezes it.

1. Test first (test-writer). New slice slices/map-pitch/handler.ts: handler(hz: number, openHz: readonly number[], prefer?: { readonly string: number; readonly fret: number }): { readonly string: number; readonly fret: number } | undefined. openHz index 0 is string 1. Stub throws not implemented. Re-export as mapPitch from the practice index and add the slice line to practice _about.md. Tests in slices/map-pitch/handler.test.ts: TASK-14#2 a pitch more than 50 cents from every fret returns undefined; TASK-14#1 a pitch on a fret (within 50 cents) returns that string and fret, and a tied pitch returns the preferred candidate. Also add to src/app/practice-view.test.ts (controller): TASK-14#1 after start, hear(hz, openHz) with the pitch of the note in play at its hit time records a hit input, and judgments() shows that note as hit; TASK-14#2 hear with a pitch far from every fret records nothing and that note is judged missed after the window; TASK-14#3 a note whose matching pitch arrives after the window is judged missed, and one within the window is hit. Add stub methods to PracticeController: hear(hz: number, openHz: readonly number[]): void and judgments(): readonly Judgment[] (import the type Judgment through the practice index). The stub mountPractice is unchanged. Use an inline song and a fake clock; open strings E2 A2 D3 G3 B3 E4 (string 1 index 0 is the high E: use openHz = [329.63, 246.94, 196.00, 146.83, 110.00, 82.41] as string 1 to string 6). Criteria covered: 1, 2, 3.

2. Map pitch (implementer). Allowlist: src/modules/practice/slices/map-pitch/handler.ts. Covers 1 and 2 at the slice level. Targeted: npx vitest run src/modules/practice/slices/map-pitch

3. Controller (implementer). Allowlist: src/app/practice-view.ts. hear(hz, openHz): when the session exists, maps hz with mapPitch over openHz, preferring the note nearest the audio time, and if a candidate is found records { string, fret, time: audioTime() } as a PlayedInput. judgments(): per note, recordHit(note, inputs, WINDOW_MS, audioTime()). Covers 1, 2, 3. Targeted: npx vitest run src/app/practice-view.test.ts

4. Page (implementer). Allowlist: practice.html (add a Mic toggle button #mic), src/app/practice-page.ts. Mic on: browserMicrophone.open(), then each frame readPitch(samples, sampleRate, targets) where targets come from the tuning preset Standard (use tuning targetsFor/selectPreset through the tuning index), and when the reading is a reading, hz = target.hz * 2^(cents/1200) and practice.hear(hz, openHz). Draw note fill by judgment: hit green, missed grey, pending the current note colour. Mic off stops and releases. Covers 4 wiring only; no criterion of its own. Check: npx tsc --noEmit, npx vite build.

5. Verify (orchestrator): npm run fix, scripts/check.sh, full npx vitest run.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: ea25833db5a7d394bc6e0cab01955fe780fc5c60

Validation: npm run fix; scripts/check.sh exit 0 (format, boundaries, structure, duplication, knip, tsc); npx vitest run 77/77 passed. AC2 and AC3 proven by map-pitch slice tests and practice-view controller tests (150 ms window ASSUMED). AC1 NOT checked: the mic-on path (practice-page.ts, Mic button) and canvas colours are wired and build, but have not run in a browser; the controller side of AC1 is covered by tests. Decision taken: tie between same-note frets goes to the note in play, else lowest string. Fix during step 5: start() clears the pitch inputs so a replay does not reuse old hits (regression test added). Known limit: tuner searches 60-1000 Hz only, so high frets on string 1 are not readable.
<!-- SECTION:NOTES:END -->
