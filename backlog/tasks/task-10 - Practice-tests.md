---
id: TASK-10
title: Practice tests
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 11:41'
updated_date: '2026-10-10 16:34'
labels: []
dependencies: []
modified_files:
  - src/modules/tuner/slices/read-pitch/handler.test.ts
  - src/modules/tuning/slices/select-preset/handler.test.ts
  - src/modules/tuning/slices/set-reference/handler.test.ts
  - src/modules/practice/slices/start-session/handler.test.ts
  - src/modules/practice/slices/set-fall-speed/handler.test.ts
  - src/modules/tuner/slices/start-listening/handler.test.ts
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Test rules that the vendored practice packs require, so the test writer covers them. Each criterion quotes one test rule from meta/product/practices/enforced.md.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A pitch deviation in cents equals 1200 times log2 of measured over target frequency and is shown against the active reference [pack: domain/music-training DOM-001]
- [x] #2 Every target frequency equals R times 2 to the power k over 12, with k the semitone offset from A4 and R the active reference [pack: domain/music-training DOM-002]
- [x] #3 The reference defaults to A4 = 440 Hz, and changing it recomputes the whole target table [pack: domain/music-training DOM-003]
- [x] #4 Standard targets at A4 = 440 Hz are E2 82.41, A2 110, D3 146.83, G3 196, B3 246.94 and E4 329.63 Hz [pack: domain/music-training DOM-004]
- [x] #5 A tuning preset is six entries of string, note and semitone offset, and drop D changes only the low string [pack: domain/music-training DOM-005]
- [x] #6 The detector frequency band reaches the lowest target of the active preset, about 73.4 Hz for drop D [pack: domain/music-training DOM-006]
- [ ] #7 Sub-octave and super-octave candidates are checked against the periodicity measure before a pitch is reported [pack: domain/music-training DOM-008]
- [ ] #8 The time-domain buffer holds exactly fftSize samples, with fftSize a power of two from 32 to 32768 [pack: domain/music-training DOM-010]
- [ ] #9 A reading more than 50 cents from the selected target shows wrong string or octave instead of a deviation [pack: domain/music-training DOM-011]
- [ ] #10 Microphone capture starts only in a secure context, and the start control appears only when navigator.mediaDevices exists [pack: domain/music-training DOM-013]
- [ ] #11 Pending, denied (NotAllowedError), no device (NotFoundError) and constraint failure (OverconstrainedError) are separate states [pack: domain/music-training DOM-014]
- [ ] #12 Note positions and hit judgments derive from AudioContext.currentTime, and requestAnimationFrame is used only for drawing [pack: domain/music-training DOM-018]
- [ ] #13 Pausing suspends the AudioContext so that notes freeze with the audio clock [pack: domain/music-training DOM-020]
- [ ] #14 Hits are judged against currentTime minus baseLatency and outputLatency plus the calibration offset, and stored note times are never edited [pack: domain/music-training DOM-021]
- [x] #15 Hit time is fixed when a note is created, and the speed toggle changes only the drawn distance per millisecond [pack: domain/music-training DOM-023]
- [x] #16 Public contracts are typed with expectTypeOf in Vitest test files [pack: lang/typescript TS-017]
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Regression tests for criteria the code already meets: src/modules/tuner/slices/read-pitch/handler.test.ts covers #1 (cents = 1200 log2 of measured over target) and #6 (73.4 Hz reads as D2 in drop D). Targeted: npx vitest run src/modules/tuner/slices/read-pitch
2. src/modules/tuning/slices/select-preset/handler.test.ts covers #2 (targetsFor R*2^(k/12)), #4 (standard targets at 440 Hz), #5 (six entries; drop D changes only low string), #16 (expectTypeOf on Preset). Targeted: npx vitest run src/modules/tuning/slices/select-preset
3. src/modules/tuning/slices/set-reference/handler.test.ts covers #3 (DEFAULT_REFERENCE_HZ is 440; changing reference recomputes targetsFor). Targeted: npx vitest run src/modules/tuning/slices/set-reference
4. src/modules/practice/slices/start-session/handler.test.ts covers #13 observable part (notes hold their timeToHit while paused, resume continues). Targeted: npx vitest run src/modules/practice/slices/start-session
5. src/modules/practice/slices/set-fall-speed/handler.test.ts covers #15 (hit time fixed; toggle changes only drawn distance per ms). Targeted: npx vitest run src/modules/practice/slices/set-fall-speed
6. src/modules/tuner/slices/start-listening/handler.test.ts covers #11 pending and denied states only. Targeted: npx vitest run src/modules/tuner/slices/start-listening
7. Open criteria as it.todo, no assertion, so the full suite stays green: #7 and #9 in read-pitch test file; #8, #10, #11 (NotFoundError, OverconstrainedError) in start-listening test file; #12 in start-session test file; #14 in src/modules/practice/slices/record-hit/handler.test.ts (judging wiring is TASK-8 gap). Targeted per file as above.
8. Full suite: npx vitest run. Then check: scripts/check.sh. No source (non-test) files change; no stubs; no implementer step.

Decision noted: gate relaxed for criteria already met (user-approved). it.todo used for unimplemented criteria, not failing tests, to keep main green.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: 9fb015612381bde864185d67916544a0cf175d20

step 1-6: regression tests written (test-writer); it.todo removed (test.md 7 forbids todo). 44 pass, 0 todo. Not checked: #7 #8 #9 #10 #11(NotFound/Overconstrained) #12 #13 (AudioContext not used in slice) #14 (judging wiring, TASK-8). check exit 0.
<!-- SECTION:NOTES:END -->
