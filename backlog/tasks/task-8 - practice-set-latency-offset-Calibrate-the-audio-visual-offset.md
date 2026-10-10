---
id: TASK-8
title: 'practice/set-latency-offset: Calibrate the audio-visual offset'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 11:41'
updated_date: '2026-10-10 16:22'
labels:
  - 'module:practice'
milestone: Play falling notes
dependencies: []
modified_files:
  - src/modules/practice/slices/set-latency-offset/handler.ts
  - src/modules/practice/slices/set-latency-offset/handler.test.ts
  - src/modules/practice/index.ts
  - src/modules/practice/_about.md
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Output and input latency make a hit look late or early. The player needs a way to correct the offset so judged hits match what they hear.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Player sets an audio-visual offset in milliseconds; hits are judged against the adjusted time; stored note times stay unchanged
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Implement the offset slice: src/modules/practice/slices/set-latency-offset/handler.ts. handler(ms) returns LatencyOffset { ms, adjust(time) } where adjust(time) = time - ms; stored note times are not touched. Covers #1. Targeted: npx vitest run src/modules/practice/slices/set-latency-offset
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
user confirmed the ASSUMED criterion (AC text now without the prefix)

start: 11838bd36b66f3c64a5c79b61404cdf8e42c2bdf

step 1: handler returns { ms, adjust(time) = time - ms }; note times untouched; targeted test passed; check exit 0

gap: record-hit does not yet use LatencyOffset.adjust; hit judging against adjusted time is not wired, so AC #1 is not checked. Needs a plan step for record-hit or the practice route that adjusts inputs.
<!-- SECTION:NOTES:END -->
