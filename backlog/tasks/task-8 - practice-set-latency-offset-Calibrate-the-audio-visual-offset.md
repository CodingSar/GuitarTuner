---
id: TASK-8
title: 'practice/set-latency-offset: Calibrate the audio-visual offset'
status: Done
assignee:
  - '@claude'
created_date: '2026-10-10 11:41'
updated_date: '2026-10-10 17:02'
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
- [x] #1 Player sets an audio-visual offset in milliseconds; hits are judged against the adjusted time; stored note times stay unchanged
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Test first (test-writer): src/modules/practice/slices/record-hit/handler.test.ts gets one test TASK-8#1. Note hitTime 1000, offset as literal { adjust: (t) => t - 100 } (no cross-slice import). Input at 1150, window 100: with offset and now 1150, expect hit; note object unchanged. Without offset, same input at now 1050, expect pending. Signature-only edit in record-hit/handler.ts: add optional offset param, body unchanged. Covers TASK-8#1. Targeted: npx vitest run src/modules/practice/slices/record-hit
2. Implement (implementer): src/modules/practice/slices/record-hit/handler.ts. When offset is given, each input time is compared as offset.adjust(input.time) against note.hitTime. Without offset, behaviour is unchanged. Allowlist: that one file. Covers TASK-8#1. Targeted: npx vitest run src/modules/practice/slices/record-hit
3. Full suite: npx vitest run. Then scripts/check.sh. Exit 0 required.

Change: src/modules/practice/slices/record-hit/handler.ts :: handler(note, inputs, windowMs, now) -> handler(note, inputs, windowMs, now, offset?)

Wiring: no app/ route for practice exists yet, so no wiring step. Judging with offset is reached only through the module index.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
user confirmed the ASSUMED criterion (AC text now without the prefix)

start: 11838bd36b66f3c64a5c79b61404cdf8e42c2bdf

step 1: handler returns { ms, adjust(time) = time - ms }; note times untouched; targeted test passed; check exit 0

gap: record-hit does not yet use LatencyOffset.adjust; hit judging against adjusted time is not wired, so AC #1 is not checked. Needs a plan step for record-hit or the practice route that adjusts inputs.

step 2: record-hit judges with offset.adjust(input.time) when offset given; implementer RESULT ok. Verify: record-hit 3/3 pass (TASK-7#1, TASK-7#2, TASK-8#1); full suite 45/45 pass; check exit 0 after npm run fix (Prettier wrap on the changed line only). Decision: user chose option A (optional offset param on record-hit). No app/ route for practice exists, so no wiring step; offset judging reached through module index only.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Offset-aware hit judging: record-hit takes optional offset (LatencyOffset.adjust). Input times are adjusted before the window check; note times are never changed. Verified: TASK-8#1 test in record-hit fails before the change (expected 'missed' to be 'hit') and passes after; full suite 45/45; scripts/check.sh exit 0. Route wiring for practice is not built yet.
<!-- SECTION:FINAL_SUMMARY:END -->
