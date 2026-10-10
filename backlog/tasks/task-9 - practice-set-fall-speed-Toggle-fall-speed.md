---
id: TASK-9
title: 'practice/set-fall-speed: Toggle fall speed'
status: Done
assignee:
  - '@claude'
created_date: '2026-10-10 11:41'
updated_date: '2026-10-10 16:24'
labels:
  - 'module:practice'
milestone: Adjust fall speed
dependencies: []
modified_files:
  - src/modules/practice/slices/set-fall-speed/handler.ts
  - src/modules/practice/slices/set-fall-speed/handler.test.ts
  - src/modules/practice/index.ts
  - src/modules/practice/_about.md
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Core job from product-brief: toggle fall speed faster or slower. Speed changes how fast notes are drawn, never when they are due to be hit.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 GIVEN notes are falling WHEN the player toggles faster or slower THEN the drawn speed changes and every hit time stays the same [brief: core jobs]
- [x] #2 The speed change ramps over a short period instead of jumping
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Implement the fall-speed slice: src/modules/practice/slices/set-fall-speed/handler.ts. handler(settings) returns FallSpeed { speedAt(now), toggle(now), drawnDistance(hitTime, now) }. speedAt ramps linearly from the speed in effect at the toggle to the target over settings.rampMs; drawnDistance = (hitTime - now) * speedAt(now); hit times are never changed. Covers #1 and #2. Targeted: npx vitest run src/modules/practice/slices/set-fall-speed
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
user confirmed the ASSUMED criterion (AC text now without the prefix)

start: 5c1cfb6d5a7432911d7b87c8081bcacb87bfd11b

step 1: speedAt ramps linearly over rampMs and holds target exactly after; drawnDistance = (hitTime - now) * speedAt(now); targeted tests 2/2; full suite 34/34; check exit 0

known edge: rampMs = 0 gives NaN at the toggle instant (no test, not guarded)
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added practice/set-fall-speed: handler(settings) returns FallSpeed. Toggle switches the target between slowPerMs and fastPerMs and ramps linearly over rampMs; drawnDistance(hitTime, now) = (hitTime - now) * speedAt(now), and hit times are never changed. Verified: TASK-9#1 (speed 0.2 and drawn distance 160 after the ramp) and TASK-9#2 (speed strictly between 0.1 and 0.2 mid-ramp) pass; full suite 34/34; scripts/check.sh exit 0. Not wired to a route: the practice UI does not exist yet.
<!-- SECTION:FINAL_SUMMARY:END -->
