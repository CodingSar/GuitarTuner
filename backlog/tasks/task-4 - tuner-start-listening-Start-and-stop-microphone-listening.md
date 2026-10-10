---
id: TASK-4
title: 'tuner/start-listening: Start and stop microphone listening'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 11:41'
updated_date: '2026-10-10 15:10'
labels:
  - 'module:tuner'
milestone: Tune by microphone
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The tuner reads the guitar through the browser microphone. The player must see why listening did not start, and stopping must leave nothing behind. Product-brief: no accounts, no stored data, mic audio used live.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GIVEN the tuner is open WHEN the player starts listening THEN a pending state shows until the browser grants the microphone [brief: integrations]
- [ ] #2 GIVEN the player has denied microphone access WHEN listening is requested THEN a denied state shows and no pitch readout appears [brief: integrations]
- [ ] #3 GIVEN listening is running WHEN the player stops THEN the microphone is released and no audio is stored [brief: data sensitivity and compliance]
- [ ] #4 GIVEN the player stops while microphone access is still pending WHEN the grant arrives THEN the microphone is released and the state stays idle [brief: data sensitivity and compliance]
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Interface change, slice src/modules/tuner/slices/start-listening/handler.ts. handler(mic, onState) returns Listener synchronously instead of Promise<Listener>. Listener gains readonly ready: Promise<void>, which settles when the microphone open settles (grant or denial); a rejection other than NotAllowedError makes ready reject. Reason: stop() must exist while pending (criterion 4). Change: handler.ts :: handler(mic: MicSource, onState: (state: ListeningState) => void): Promise<Listener> -> handler(mic: MicSource, onState: (state: ListeningState) => void): Listener. Retire: handler.test.ts :: TASK-4#1 pending state shows until the browser grants the microphone -> rewrite as TASK-4#1. Retire: handler.test.ts :: TASK-4#2 denied state shows and no pitch readout appears when microphone access is denied -> rewrite as TASK-4#2. Retire: handler.test.ts :: TASK-4#3 microphone is released and no audio is stored when listening stops -> rewrite as TASK-4#3. The rewrites await listener.ready instead of the old promise. Test-first step covers criteria 1-4.
2. Implement the body of handler.ts: emit pending synchronously before mic.open(); on grant, if stop was requested release the new stream and emit nothing further; otherwise keep the stream and emit listening; on NotAllowedError emit denied and keep no stream; stop() sets the stop flag, releases the held stream if any, emits idle. No audio buffer. Covers criteria 1-4. Allowlist: slices/start-listening/handler.ts. Targeted: npx vitest run src/modules/tuner/slices/start-listening/handler.test.ts
3. Wiring: none in this task. The page that calls the handler is TASK-11.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: ee7f685b130d664adb02555e01b3fd8e255971c5

step 1: handler implemented, 3/3 targeted pass; allowlist clean (handler.ts only).

tidy: npm run fix formatted src/_about.md and tuner index.ts; no logic change.

check blocked: knip 'Unused files: src/modules/tuner/index.ts'. Entry is src/app/index.ts; module not wired. Fix needs app/ wiring (plan said none) or a knip config change. Needs user decision.

gap (not covered by a criterion): stop() while pending. A grant after stop() re-enters listening with the stream held. Needs a criterion before a fix.

held In Progress (option 1): check blocked on knip unused src/modules/tuner/index.ts until the UI task imports the module. Not pushed.

scope: AC #4 added (stop-while-pending gap). Decided under user's standing instruction: choose sensible defaults, finish tasks.
<!-- SECTION:NOTES:END -->
