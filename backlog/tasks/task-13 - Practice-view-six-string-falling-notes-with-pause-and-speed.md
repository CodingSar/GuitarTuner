---
id: TASK-13
title: 'Practice view: six-string falling notes with pause and speed'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 17:33'
updated_date: '2026-10-10 17:52'
labels:
  - 'module:practice'
  - ui
dependencies:
  - TASK-6
  - TASK-9
  - TASK-12
modified_files:
  - src/app/practice-view.ts
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Core job from the product brief: play the right string and fret as notes fall, with toggles for faster or slower. Notes are visual only, with no backing audio. This view is the first consumer of the practice module, so it also clears the knip blocker recorded on TASK-6. Styling is out of scope here; TASK-16 applies the approved design.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GIVEN a song is selected WHEN the player presses Start THEN notes fall down six string rows and cross a visible hit line at their hit times
- [ ] #2 GIVEN a running session WHEN the player presses Pause and then Resume THEN notes freeze and continue from the same positions
- [ ] #3 GIVEN a running session WHEN the player picks Slower or Faster THEN the fall speed changes and the hit times do not move
- [ ] #4 GIVEN the app is open WHEN the player switches between the Tuner and Practice pages THEN each page shows and works on its own
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Module: practice (existing, no datastore). New slice layout-falling-notes is pure geometry: it places each note on a row (string 1 is row 0, the top, string 6 is row 5) and at y = hitLineY - (hitTime - now) * speed, where speed is pixels per millisecond from set-fall-speed. Hit times never change; only now and speed move. The app controller app/practice-view.ts wires the practice module (startSession, toPractice, setFallSpeed, layoutFallingNotes) to Start, Pause, Resume, Slower, Faster and a song picker. The page script only draws to a canvas. Pause uses the audio clock (AudioContext suspend) plus session.pause(), as in TASK-10. The second page is practice.html, linked from index.html.
Fixed settings in the page: slowPerMs 0.15, fastPerMs 0.30, rampMs 500, hitLineY 80% of canvas height.

1. Test first (test-writer). Create slices/layout-falling-notes/handler.ts with a stub handler(notes: readonly LayoutNote[], now: number, speed: number, hitLineY: number): readonly PlacedNote[], where LayoutNote = { string, hitTime } and PlacedNote = { row, y }. Export both types. Re-export as layoutFallingNotes from practice index.ts and add the slice line to practice _about.md. Tests in slices/layout-falling-notes/handler.test.ts: TASK-13#1 six rows (string 1..6 map to rows 0..5, distinct) and a note placed exactly on hitLineY at now == hitTime, above it before. TASK-13#3 with two speeds, the y at now == hitTime is hitLineY for both, and they differ at now == hitTime - 500.
   Create app/practice-view.ts with exported types and a stub mountPractice(songs: readonly Song[], clock: PracticeClock, hitLineY: number): PracticeController, where PracticeClock = { now(): number; pause(): void; resume(): void } and PracticeController = { selectSong(index: number): void; start(): void; pause(): void; resume(): void; slower(): void; faster(): void; frame(): readonly PlacedNote[] }. The stub throws not implemented. Tests in app/practice-view.test.ts, using a fake clock (plain object with time moved by hand) and fake pause/resume that count calls:
   TASK-13#1 after selectSong(0) and start(), frame() returns one placed note per song note with rows in 0..5, and the note at its hit time sits on hitLineY.
   TASK-13#2 after pause(), advancing the fake clock leaves frame() unchanged; after resume() the notes continue from those positions. Assert that the clock's pause and resume were called.
   TASK-13#3 after slower() or faster(), the y of a note 500 ms before its hit time changes, and its y at hit time is still hitLineY.
   Create app/pages.test.ts (node fs read of index.html and practice.html text): TASK-13#4 index.html links to practice.html, practice.html links back to index.html, and each page loads a different module script (index.html loads /src/app/index.ts, practice.html loads /src/app/practice-page.ts). Do not require the page to be built.
   Criteria covered: 1, 2, 3, 4. Targeted: npx vitest run src/modules/practice src/app

2. Layout slice (implementer). Allowlist: src/modules/practice/slices/layout-falling-notes/handler.ts. Covers 1 and 3 (layout level). Targeted: npx vitest run src/modules/practice/slices/layout-falling-notes

3. Practice controller (implementer). Allowlist: src/app/practice-view.ts. Calls startSession, toPractice, setFallSpeed, layoutFallingNotes through the practice index only. start() calls clock.resume() and creates a session from the selected song (stepMs from toPractice). pause() calls session.pause() and clock.pause(). resume() calls both resumes. slower/faster call the fall-speed toggle at clock.now(). frame() uses clock.now() and fall speed speedAt(now). Covers 1, 2, 3. Targeted: npx vitest run src/app/practice-view.test.ts

4. Page wiring (implementer). Allowlist: practice.html (new), src/app/practice-page.ts (new), index.html (one link to practice.html), vite.config.ts (build.rollupOptions.input for index.html and practice.html, paths from import.meta.url), knip.json (add src/app/practice-page.ts to entry). practice-page.ts creates an AudioContext and audioClock, mounts the controller, wires buttons and the song select, draws frame() to a canvas in requestAnimationFrame with six rows and a hit line. No logic beyond drawing and wiring. Covers 4. Targeted: npx vitest run src/app/pages.test.ts. Then npx tsc --noEmit.

5. Tidy and verify (orchestrator): npm run fix, scripts/check.sh, full npx vitest run, npx vite build (confirm both pages build). Browser run not available here; AC2 and AC3 evidence is the controller tests, not a live page.
Wiring: the practice page is the route for the view (step 4 is the app/ mapping).

Revision after step 3 deviation (orchestrator decision): (a) frame() and the fall-speed toggles use the session's audio time, not clock.now(): audioTime = firstNote.hitTime - session.timeToHit(0) (0 before start). The session already freezes its own time on pause, so the view freezes with or without a stopped clock. (b) start() does not call clock.resume(); the page resumes the AudioContext on the Start click before calling start(). Pause and resume still call the clock. (c) slower() and faster() keep a direction flag (initial slow); a toggle runs only when the requested speed differs from the current one, so Slower from the start stays slow. (d) Test fix: practice-view.test.ts TASK-13#3 expects the faster note at 500 ms before its hit to be HIGHER on screen (smaller y), since at a fixed time before the hit a faster note covers more pixels. Add one test: after faster() then slower(), the y at 500 ms before the hit equals the steady-speed y. Retire: src/app/practice-view.test.ts :: TASK-13#3 (faster direction) -> rewrite as TASK-13#3.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: 57dc8dc5cfb88e20a2a8622e85d786ffeeb7b7e2

test-first: 6 new tests fail (5 not implemented, 1 ENOENT practice.html on pages test); 62 others pass. Controller test asserts clock pause/resume counts (plan asked; guide forbids call counts) accepted, not retried.

step 2: layout-falling-notes handler; targeted tests pass (2/2); tsc clean.

step 3 (rerun after revision): practice controller; targeted tests pass (4/4); tsc clean.
<!-- SECTION:NOTES:END -->
