---
id: TASK-10
title: Practice tests
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 11:41'
updated_date: '2026-10-10 17:20'
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
- [x] #8 The time-domain buffer holds exactly fftSize samples, with fftSize a power of two from 32 to 32768 [pack: domain/music-training DOM-010]
- [x] #9 A reading more than 50 cents from the selected target shows wrong string or octave instead of a deviation [pack: domain/music-training DOM-011]
- [x] #10 Microphone capture starts only in a secure context, and the start control appears only when navigator.mediaDevices exists [pack: domain/music-training DOM-013]
- [x] #11 Pending, denied (NotAllowedError), no device (NotFoundError) and constraint failure (OverconstrainedError) are separate states [pack: domain/music-training DOM-014]
- [x] #12 Note positions and hit judgments derive from AudioContext.currentTime, and requestAnimationFrame is used only for drawing [pack: domain/music-training DOM-018]
- [x] #13 Pausing suspends the AudioContext so that notes freeze with the audio clock [pack: domain/music-training DOM-020]
- [ ] #14 Hits are judged against currentTime minus baseLatency and outputLatency plus the calibration offset, and stored note times are never edited [pack: domain/music-training DOM-021]
- [x] #15 Hit time is fixed when a note is created, and the speed toggle changes only the drawn distance per millisecond [pack: domain/music-training DOM-023]
- [x] #16 Public contracts are typed with expectTypeOf in Vitest test files [pack: lang/typescript TS-017]
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Test first, all open criteria (test-writer). Files: src/modules/tuner/slices/read-pitch/handler.test.ts (#7); src/modules/tuner/slices/start-listening/handler.test.ts (#11 NotFoundError and OverconstrainedError); src/app/pitch-readout.test.ts (#9); src/app/sample-buffer.ts stub + src/app/sample-buffer.test.ts (#8); src/app/listening-view.test.ts (#10, and #11 status text for the two new states); src/app/audio-clock.ts stub + src/app/audio-clock.test.ts (#12, #13, #14). Stub only: ListeningState gains "no-device" | "constraint-failed" in start-listening/handler.ts. Targeted: npx vitest run src/app src/modules/tuner
2. #8 and #9 (implementer). Files: src/app/sample-buffer.ts (sampleBufferFor(fftSize): RangeError unless fftSize is a power of two in 32..32768; returns Float32Array(fftSize)); src/app/microphone.ts (buffer from sampleBufferFor(analyser.fftSize)); src/app/pitch-readout.ts (reading with |cents| > 50 shows "Wrong string or octave", no cents value). Targeted: npx vitest run src/app/sample-buffer.test.ts src/app/pitch-readout.test.ts
3. #7 (implementer). File: src/modules/tuner/slices/read-pitch/handler.ts. Rule: after the best lag, among local maxima of the normalized correlation whose value is at least 0.9 times the best value, report the shortest lag, then refine it with the parabolic step. Sub-octave and super-octave candidates are both checked this way. Keep all existing read-pitch tests green. Targeted: npx vitest run src/modules/tuner/slices/read-pitch
4. #11 states (implementer). File: src/modules/tuner/slices/start-listening/handler.ts. NotFoundError goes to "no-device", OverconstrainedError to "constraint-failed", both as settled states, not rejections. Other errors still rethrow. Denied and pending unchanged. Targeted: npx vitest run src/modules/tuner/slices/start-listening
5. #10 and #11 view (implementer). File: src/app/listening-view.ts. statusText covers the two new states. Start control shown for idle, denied, no-device, constraint-failed only. mountListening takes an optional support parameter {secure, mediaDevices} defaulting to window.isSecureContext and navigator.mediaDevices; the start control stays hidden and a click does nothing unless both are true. Targeted: npx vitest run src/app/listening-view.test.ts
6. #12 to #14 clock (implementer). File: src/app/audio-clock.ts. audioClock(context) returns: now() = context.currentTime in ms (satisfies practice Clock); heard() = now() minus baseLatency and outputLatency in ms; pause() calls context.suspend(), resume() calls context.resume(). Requests animation frames for drawing only; nothing here reads a frame timestamp. Judging stays in record-hit, fed heard() through the offset adjust from set-latency-offset. Targeted: npx vitest run src/app/audio-clock.test.ts
7. Tidy (main thread runs npm run fix, then scripts/check.sh). Findings in files of this plan go to implementer or test-writer tidy runs; findings outside the plan stop the run.
8. Verify and close: npx vitest run; scripts/check.sh; diff against start 1af882b limited to plan files; check ACs with test evidence; final summary; Done; push origin main.

Change: src/app/listening-view.ts :: mountListening(view, mic, schedule, targets) -> mountListening(view, mic, schedule, targets, support) (support optional, last)
Retire: none

Decisions taken by orchestrator, flagged for user: (a) #14 says "plus the calibration offset" but TASK-8 LatencyOffset.adjust subtracts ms and is Done with a test pinning it; plan keeps TASK-8 sign and the test goes through adjust. (b) #7 rule is the McLeod key-maximum style check. (c) No practice page exists, so audio-clock is not routed in app/index.ts; the criteria are met at the adapter.

Change (step 2 deviation, orchestrator decision): src/app/sample-buffer.ts :: sampleBufferFor(fftSize: number): Float32Array -> sampleBufferFor(fftSize: number): Float32Array<ArrayBuffer>. Reason: getFloatTimeDomainData needs Float32Array<ArrayBuffer>; no cast at call site.

Rewrite (orchestrator, step 5 prerequisite): src/app/listening-view.test.ts, the six existing calls to mountListening (TASK-11#1, #2, #3, #4, TASK-5#1, TASK-2#2) pass a supported object as the 5th argument, {secure: true, mediaDevices: true}, and keep the other arguments in place (use a shared const, pass schedule and targets explicitly). No assertion, name or literal value changes. Reason: criterion #10 gates the start control on secure context; these tests predate the gate. Test-writer applies it before step 5.

Rewrite (tidy, boundary rule 3): src/app/audio-clock.test.ts, the import of set-latency-offset must use the practice module index: import { setLatencyOffset } from "../modules/practice" (the index exports it as setLatencyOffset). No other change to the test. Test names, literals and assertions unchanged.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: 9fb015612381bde864185d67916544a0cf175d20

step 1-6: regression tests written (test-writer); it.todo removed (test.md 7 forbids todo). 44 pass, 0 todo. Not checked: #7 #8 #9 #10 #11(NotFound/Overconstrained) #12 #13 (AudioContext not used in slice) #14 (judging wiring, TASK-8). check exit 0.

start-2: 1af882b77f95ab73a50a4761ff232b97a900e163. Remaining ACs #7-#14 planned; #14 sign question flagged in plan.

step 1: test-first gate passed (11 new tests fail by assertion or not-implemented; 45 existing pass). Unhandled NotFound/Overconstrained rejections come from current start-listening rethrow; step 4 removes them. Commit fef966b.

step 2: first run deviation (tsc TS2345 on microphone.ts, stub return type). Orchestrator approved type-only Change on sample-buffer.ts; relaunching step 2.

step 2: ok (#8 sample-buffer, #9 readout). Commit 7da1e63.

step 3: deviation. #7 test expects 36.98 cents (150 Hz exact, tolerance 0.5); shortest-peak + existing parabolic refinement gives 35.86 cents (label D3 passes). Test expectation vs refinement needs user decision; attempt kept out of tree. Steps 4 to 6 continue.

step 4: ok (#11 handler states). Commit 3618659.

step 5 blocker: six pre-existing listening-view tests would fail with the new gate; plan line added, test-writer applies a mechanical support argument before the view step.

rewrite: six legacy listening-view tests pass explicit support; no assertion changes. Commit 01059a2. Step 5 next.

step 5: ok (#10, #11 view). Commit 701e9a3.

step 6: ok (#12, #13, #14 adapter). Commit 4162c76.

Evidence (this run): npx vitest run 55 pass, 1 fail (#7). scripts/check.sh exit 0 after tidy (prettier format, test import via practice index). ACs 8-13 checked on green targeted tests: #8 sample-buffer.test, #9 pitch-readout.test, #10 listening-view.test, #11 start-listening + listening-view tests, #12/#13 audio-clock.test. OPEN: #7 (step 3 deviation: test expects 36.98 cents, shortest-peak + parabolic refinement gives 35.86; attempt in scratchpad step3-attempt.patch, reverted). OPEN: #14 (criterion says plus calibration offset; TASK-8 adjust subtracts, test follows adjust; sign needs user decision). Not pushed: suite not fully green.
<!-- SECTION:NOTES:END -->
