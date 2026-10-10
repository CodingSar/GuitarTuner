---
id: TASK-10
title: Practice tests
status: To Do
assignee: []
created_date: '2026-10-10 11:41'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Test rules that the vendored practice packs require, so the test writer covers them. Each criterion quotes one test rule from meta/product/practices/enforced.md.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A pitch deviation in cents equals 1200 times log2 of measured over target frequency and is shown against the active reference [pack: domain/music-training DOM-001]
- [ ] #2 Every target frequency equals R times 2 to the power k over 12, with k the semitone offset from A4 and R the active reference [pack: domain/music-training DOM-002]
- [ ] #3 The reference defaults to A4 = 440 Hz, and changing it recomputes the whole target table [pack: domain/music-training DOM-003]
- [ ] #4 Standard targets at A4 = 440 Hz are E2 82.41, A2 110, D3 146.83, G3 196, B3 246.94 and E4 329.63 Hz [pack: domain/music-training DOM-004]
- [ ] #5 A tuning preset is six entries of string, note and semitone offset, and drop D changes only the low string [pack: domain/music-training DOM-005]
- [ ] #6 The detector frequency band reaches the lowest target of the active preset, about 73.4 Hz for drop D [pack: domain/music-training DOM-006]
- [ ] #7 Sub-octave and super-octave candidates are checked against the periodicity measure before a pitch is reported [pack: domain/music-training DOM-008]
- [ ] #8 The time-domain buffer holds exactly fftSize samples, with fftSize a power of two from 32 to 32768 [pack: domain/music-training DOM-010]
- [ ] #9 A reading more than 50 cents from the selected target shows wrong string or octave instead of a deviation [pack: domain/music-training DOM-011]
- [ ] #10 Microphone capture starts only in a secure context, and the start control appears only when navigator.mediaDevices exists [pack: domain/music-training DOM-013]
- [ ] #11 Pending, denied (NotAllowedError), no device (NotFoundError) and constraint failure (OverconstrainedError) are separate states [pack: domain/music-training DOM-014]
- [ ] #12 Note positions and hit judgments derive from AudioContext.currentTime, and requestAnimationFrame is used only for drawing [pack: domain/music-training DOM-018]
- [ ] #13 Pausing suspends the AudioContext so that notes freeze with the audio clock [pack: domain/music-training DOM-020]
- [ ] #14 Hits are judged against currentTime minus baseLatency and outputLatency plus the calibration offset, and stored note times are never edited [pack: domain/music-training DOM-021]
- [ ] #15 Hit time is fixed when a note is created, and the speed toggle changes only the drawn distance per millisecond [pack: domain/music-training DOM-023]
- [ ] #16 Public contracts are typed with expectTypeOf in Vitest test files [pack: lang/typescript TS-017]
<!-- AC:END -->
