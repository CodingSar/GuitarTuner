---
id: TASK-7
title: 'practice/record-hit: Record a hit or miss for each note'
status: Done
assignee:
  - '@claude'
created_date: '2026-10-10 11:41'
updated_date: '2026-10-10 16:19'
labels:
  - 'module:practice'
milestone: Play falling notes
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Core job from product-brief: play the right string and fret as notes fall. Each note needs a judged outcome so the player sees what they got right. A pluck outside the timing window must not count as a hit.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 GIVEN a note falling through the hit line WHEN the player plays the right string and fret within the timing window THEN the hit is recorded [brief: core jobs]
- [x] #2 GIVEN a note passes the hit line WHEN no matching input arrives within the timing window THEN the note is marked missed [brief: core jobs]
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Test first: src/modules/practice/slices/record-hit/handler.test.ts with one failing test per criterion (TASK-7#1 hit inside window, TASK-7#2 missed after window with no input). Stub src/modules/practice/slices/record-hit/handler.ts (not implemented). Re-export in src/modules/practice/index.ts as recordHit.
2. Implement the pure judge in record-hit/handler.ts: handler(note, inputs, windowMs, now) returns 'hit' | 'missed' | 'pending'. A matching input has the same string and fret and time within windowMs of note.hitTime. Hit when a match exists. Missed when now is past hitTime + windowMs with no match. Pending otherwise. The timing window is a parameter; no default value is chosen here.
3. Catalog: add record-hit line to src/modules/practice/_about.md.
4. Tidy run for check findings. Verify: full test, scripts/check.sh.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: 978793ad1291f448e5bcdd309320ec487634023c

step 2: judge body in record-hit/handler.ts. Verify: full suite 31/31 pass, scripts/check.sh exit 0, changed files all on plan.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added practice/record-hit: pure judge handler(note, inputs, windowMs, now) returning hit, missed or pending. A played input counts only when string and fret match and it lands within windowMs of hitTime. Past the window with no match it is missed. Window is a parameter; no default chosen. Verified: TASK-7#1 and TASK-7#2 pass in npx vitest run; full suite 31/31; scripts/check.sh exit 0.
<!-- SECTION:FINAL_SUMMARY:END -->
