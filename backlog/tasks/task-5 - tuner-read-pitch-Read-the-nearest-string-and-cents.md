---
id: TASK-5
title: 'tuner/read-pitch: Read the nearest string and cents'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 11:41'
updated_date: '2026-10-10 15:30'
labels:
  - 'module:tuner'
milestone: Tune by microphone
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Core job from product-brief: tune each string by mic pitch detection. The reading must name the nearest string and show how far off it is, or say when no reliable pitch exists.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GIVEN a steady tone near a target string WHEN it is detected THEN the nearest string and its deviation in cents are shown [brief: core jobs]
- [ ] #2 GIVEN no reliable pitch in the input WHEN the tuner reads it THEN no value is shown and the app says there is no reliable pitch [brief: core jobs]
- [ ] #3 ASSUMED: a reading within plus or minus 5 cents of the target is shown as in tune
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Test first (test-writer): src/modules/tuner/slices/read-pitch/handler.test.ts with one test per criterion (TASK-5#1, #2, #3). Stub src/modules/tuner/slices/read-pitch/handler.ts exporting readPitch(samples: Float32Array, sampleRate: number, targets: readonly Target[]): Reading, types Target {label, hz}, Reading = {kind:"reading", label, cents, inTune} | {kind:"none"}. Re-export readPitch and types from src/modules/tuner/index.ts. Also src/app/pitch-readout.test.ts (describeReading: reading shows label and signed cents, in tune says so; none says No reliable pitch) with stub src/app/pitch-readout.ts. Also one new case in src/app/listening-view.test.ts: mountListening takes optional 3rd arg schedule (default requestAnimationFrame); after grant, a scheduled frame with a 110 Hz sine shows A2 in readout. Targeted: npx vitest run <each file>.
2. Read-pitch (implementer, allowlist src/modules/tuner/slices/read-pitch/handler.ts): autocorrelation over samples, clarity threshold 0.9 else kind none; cents = 1200*log2(f/target.hz) for nearest target by abs cents; inTune = abs(cents) <= 5. Targeted: read-pitch handler.test.ts.
3. Mic analysis port (implementer, allowlist src/modules/tuner/slices/start-listening/handler.ts): MicStream gains optional analysis?: { sampleRate: number; samples(): Float32Array }. Targeted: start-listening handler.test.ts (must stay green).
4. Browser analysis (implementer, allowlist src/app/microphone.ts): AudioContext + AnalyserNode on the stream, fills analysis. Browser-only, no unit test; verified by tsc and check.
5. Readout text (implementer, allowlist src/app/pitch-readout.ts): describeReading and standardTargets (E2 A2 D3 G3 B3 E4, placeholder until TASK-2). Targeted: pitch-readout.test.ts.
6. Wiring (implementer, allowlist src/app/listening-view.ts): when listening, schedule frame, read samples, readPitch, write readout via describeReading, show readout; hide when not listening. Targeted: listening-view.test.ts.
7. Tidy and verify: npm run fix, scripts/check.sh, full npx vitest run.
Scope note: standardTargets is app-side until TASK-2 lands; the tuning module is not touched.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: 073fe7d1ed68804fff87943875d2238ab0251541. ASSUMED #3 (±5 cents) confirmed by user.
<!-- SECTION:NOTES:END -->
