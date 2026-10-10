---
id: domain/music-training
title: Music training
researched: 2026-10-10
tier: deep
sources:
  - https://en.wikipedia.org/wiki/Cent_(music)
  - https://en.wikipedia.org/wiki/Equal_temperament
  - https://en.wikipedia.org/wiki/Concert_pitch
  - https://en.wikipedia.org/wiki/Guitar_tunings
  - https://en.wikipedia.org/wiki/Pitch_detection_algorithm
  - https://github.com/ianprime0509/pitchy
  - https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatTimeDomainData
  - https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
  - https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  - https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
  - https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
  - https://www.w3.org/TR/mediacapture-streams/
  - https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/currentTime
  - https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/baseLatency
  - https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/outputLatency
  - https://web.dev/articles/audio-scheduling
  - https://support.activision.com/guitar-hero-live/articles/advanced-calibration-for-a-guitar-hero-live-controller
  - https://osu.ppy.sh/wiki/en/Beatmap/Overall_difficulty
  - https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate
  - https://muted.io/chromatic-tuner
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC4451240
---

| ID | Level | Rule | Enforce | Source |
|---|---|---|---|---|
| DOM-001 | MUST | Compute a pitch deviation in cents as 1200 times log2 of measured over target frequency, and display it against the active reference. | test | https://en.wikipedia.org/wiki/Cent_(music) |
| DOM-002 | MUST | Derive every target frequency as R times 2 to the power k/12, with k the semitone offset from A4 and R the active reference. | test | https://en.wikipedia.org/wiki/Equal_temperament |
| DOM-003 | MUST | Default the reference to A4 = 440 Hz, let the user change it, and recompute the target table from the new reference. | test | https://en.wikipedia.org/wiki/Concert_pitch |
| DOM-004 | MUST | Store standard tuning targets at A4 = 440 Hz as E2 82.41, A2 110, D3 146.83, G3 196, B3 246.94, E4 329.63 Hz. | test | https://en.wikipedia.org/wiki/Guitar_tunings |
| DOM-005 | MUST | Represent a tuning preset as six string entries (string, note, semitone offset) and change only the entries that the preset changes; drop D changes only the low string to D. | test | https://en.wikipedia.org/wiki/Guitar_tunings |
| DOM-006 | MUST | Set the detector's frequency band to reach the lowest target of the active preset, about 73.4 Hz for drop D. | test | https://en.wikipedia.org/wiki/Guitar_tunings |
| DOM-007 | MUST | Detect pitch with an autocorrelation-family method (YIN or McLeod), not the strongest FFT bin, because the strongest bin is often a harmonic. | review | https://en.wikipedia.org/wiki/Pitch_detection_algorithm |
| DOM-008 | SHOULD | Check sub-octave and super-octave candidates against the periodicity measure before reporting a pitch, to reduce octave errors. | test | https://en.wikipedia.org/wiki/Pitch_detection_algorithm |
| DOM-009 | MUST | Show "no reliable pitch" instead of a note name or cents value when the detector's clarity is below the gate. | review | https://github.com/ianprime0509/pitchy |
| DOM-010 | MUST | Fill the time-domain buffer with exactly fftSize samples, where fftSize is a power of two from 32 to 32768. | test | https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatTimeDomainData |
| DOM-011 | MUST | Show "wrong string or octave" instead of a deviation when a reading is more than 50 cents from the selected target. | test | https://en.wikipedia.org/wiki/Cent_(music) |
| DOM-012 | SHOULD | Expose the in-tune window as a setting, defaulting to plus or minus 5 cents, and do not present that default as a standard. | review | https://muted.io/chromatic-tuner |
| DOM-013 | MUST | Start microphone capture only in a secure context, and check that navigator.mediaDevices exists before showing the start control. | test | https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts |
| DOM-014 | MUST | Show pending, denied (NotAllowedError), no device (NotFoundError) and constraint failure (OverconstrainedError) as separate states. | test | https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia |
| DOM-015 | MUST | Treat a muted microphone track as distinct from an ended track, and tell the player which one applies. | review | https://www.w3.org/TR/mediacapture-streams/ |
| DOM-016 | SHOULD | Request echoCancellation, noiseSuppression and autoGainControl as ideal false, then read track.getSettings() and show the values in effect. | review | https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints |
| DOM-017 | MUST | Keep microphone audio on the device and store or send nothing without a separate user action. | review | https://www.w3.org/TR/mediacapture-streams/ |
| DOM-018 | MUST | Position notes and judge hits from AudioContext.currentTime, and use requestAnimationFrame only for drawing. | test | https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/currentTime |
| DOM-019 | MUST | Schedule audio ahead with a short timer and lookahead window, and never use the raw timer callback time for playback. | review | https://web.dev/articles/audio-scheduling |
| DOM-020 | MUST | Pause the practice view by suspending the AudioContext, so notes freeze with the audio clock. | test | https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/currentTime |
| DOM-021 | SHOULD | Judge hits against heard time, currentTime minus baseLatency and outputLatency, plus a user calibration offset, and never edit stored note times to compensate. | test | https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/outputLatency |
| DOM-022 | MUST | Provide a visual offset control that moves note drawing without changing hit windows. | review | https://support.activision.com/guitar-hero-live/articles/advanced-calibration-for-a-guitar-hero-live-controller |
| DOM-023 | MUST | Fix each note's hit time when the note is created, and change only the drawn distance per millisecond when the speed toggle changes. | test | https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate |
| DOM-024 | SHOULD | Ramp the drawn speed over about 150 to 300 ms when the speed toggle changes, so no note jumps mid-flight. | review | https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate |
| DOM-025 | MUST | Keep a playback-rate control separate from the visual speed control, and label each one. | review | https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate |
| DOM-026 | MUST | Show the hit window in milliseconds on the practice screen, and keep it fixed for a given difficulty. | review | https://osu.ppy.sh/wiki/en/Beatmap/Overall_difficulty |
| DOM-027 | SHOULD | Make the early side of a hit window no wider than the late side, because audio that leads is detected at shorter offsets than audio that lags. | review | https://pmc.ncbi.nlm.nih.gov/articles/PMC4451240 |
