---
id: TASK-19
title: 'Practice: first note reaches the hit line 3 seconds after Start'
status: Done
assignee:
  - '@claude'
created_date: '2026-10-10 19:07'
updated_date: '2026-10-10 19:12'
labels:
  - 'module:practice'
dependencies: []
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The first note drops straight at the hit line, so the player has no time to get ready after pressing Start. A fixed 3 second lead-in gives the player time to find the string and fret before the first note is due.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 GIVEN a practice session is started WHEN the first note is placed THEN it reaches the hit line 3000 ms after Start, whatever the tempo
- [x] #2 GIVEN a session is running WHEN later notes are placed THEN each note reaches the hit line one step (60000 divided by the tempo, in ms) after the note before it
- [x] #3 GIVEN a session is paused during the lead-in WHEN it is resumed THEN the first note's time to hit is the lead-in left at the pause, with no time lost to the pause
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Test first: src/modules/practice/slices/start-session/handler.test.ts. Covers criteria 1, 2, 3. Retire: src/modules/practice/slices/start-session/handler.test.ts :: TASK-6#1 a started session drops each note down the six-string view in sequence order -> rewrite as TASK-19#1
2. Implement: src/modules/practice/slices/start-session/handler.ts. Add LEAD_IN_MS = 3000 and set hitTime to startTime + LEAD_IN_MS + index * stepMs. Covers criteria 1, 2, 3. Targeted: npx vitest run src/modules/practice/slices/start-session
3. Tidy: fix and check findings only, behaviour unchanged.
Retire: src/modules/practice/slices/start-session/handler.test.ts :: TASK-6#2 a paused session freezes the notes and resume continues from the same positions -> rewrite as TASK-19#3
Retire: src/modules/practice/slices/start-session/handler.test.ts :: TASK-10#13 Pausing suspends the AudioContext so that notes freeze with the audio clock -> delete
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: 9fabf027830c5afed52f6b9c2b65128d9c4016b8

Deviation: practice-view.test.ts had 9 timing tests asserting the old first hit (1000 ms). Not in the plan's Retire list. Moved their hit-time clocks +2000 ms (commit d0a5539). Header comment and TASK-18#1 reset test updated to match. No assertion values changed.
Validation: npx vitest run start-session: 3/3 (TASK-19#1, #2, #3). npx vitest run full: 93/93 passed, 24 files. scripts/check.sh: eslint, prettier, depcruise, jscpd, knip, tsc all clean.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
First note now reaches the hit line at Start + 3000 ms at any tempo (LEAD_IN_MS in start-session/handler.ts). Later notes stay one step apart. Pausing in the lead-in keeps the remaining lead-in on resume. Verified by TASK-19#1-#3 tests (pass), the full Vitest suite (93/93) and scripts/check.sh (clean).
<!-- SECTION:FINAL_SUMMARY:END -->
