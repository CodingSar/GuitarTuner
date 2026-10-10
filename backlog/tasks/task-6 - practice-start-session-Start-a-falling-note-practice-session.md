---
id: TASK-6
title: 'practice/start-session: Start a falling-note practice session'
status: To Do
assignee:
  - '@claude'
created_date: '2026-10-10 11:41'
updated_date: '2026-10-10 15:24'
labels:
  - 'module:practice'
milestone: Play falling notes
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Core job from product-brief: play the right string and fret as notes fall. The practice view turns a string and fret sequence into falling notes. Pause must hold the notes still so the player can stop without losing their place.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GIVEN a string and fret sequence WHEN the player starts a session THEN each note falls down the six-string view in sequence order [brief: core jobs]
- [ ] #2 GIVEN a running session WHEN the player pauses and then resumes THEN the notes freeze on pause and continue from the same positions [brief: core jobs]
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Test-first (test-writer): src/modules/practice/slices/start-session/handler.test.ts with one test per criterion (TASK-6#1, TASK-6#2). Stub src/modules/practice/slices/start-session/handler.ts exporting handler(sequence: readonly NoteSpec[], clock: Clock, stepMs: number): PracticeSession and the types NoteSpec, FallingNote, Clock, PracticeSession (signature-only, throws not implemented). Module index src/modules/practice/index.ts re-exports startSession (as the overlay names it).
2. Catalogs (orchestrator): src/_about.md row for practice; src/modules/practice/_about.md with purpose and slice line.
3. Implement (implementer, allowlist: src/modules/practice/slices/start-session/handler.ts only): notes get hitTime = clock start + (index + 1) * stepMs, fixed at creation. audioNow = clock.now() minus total paused time while paused; pause() freezes audioNow, resume() continues from the same value. Targeted: npx vitest run src/modules/practice/slices/start-session/handler.test.ts
4. Tidy (check findings only) and verify: npm run fix, scripts/check.sh, full npx vitest run.
Scope note: no page wiring in this task; the view that draws notes is not in TASK-6 criteria. Follow-up if wanted.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: 9a046395c9d4309bc638fb24272988d2511ca4a9

step 1: handler implemented, targeted tests 2/2 pass. Tidy: tsc findings in test file fixed (destructure + narrow). Full tests 11/11 pass, tsc clean. BLOCKED at check: knip reports src/modules/practice/index.ts unused and FallingNote unused export. No app consumer exists until a practice view is built. Needs decision: wire into app/, allow in knip.json, or defer.

Deferred (option 3, sensible default). Handler + 2 tests pass; tsc clean; eslint/prettier clean. FallingNote export dropped. Index kept: structure.py requires a module index file, so it cannot be removed. Remaining blocker: knip 'Unused files: src/modules/practice/index.ts'. Clears when a practice view imports the index, or when knip.json gets an entry (needs user go-ahead, not done). ACs #1/#2 left unchecked until check passes. TASK-7 not started; same blocker.
<!-- SECTION:NOTES:END -->
