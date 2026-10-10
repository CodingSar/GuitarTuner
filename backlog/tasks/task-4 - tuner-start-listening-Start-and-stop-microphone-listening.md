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
1. Slice folder src/modules/tuner/slices/start-listening/. Module src/modules/tuner/ is new (no datastore, no store, no migrations, no model). Handler types live in handler.ts: MicStream { release(): void }, MicSource { open(): Promise<MicStream> } as the browser microphone port, ListeningState = idle | pending | listening | denied, Listener { readonly state, stop(): void }. Implement handler(mic, onState) so it emits pending before awaiting mic.open(), emits listening on grant and keeps the stream, emits denied on a rejection named NotAllowedError and keeps no stream, and stop() releases the stream and emits idle. No audio buffer anywhere. Covers criteria 1, 2, 3. Allowlist: slices/start-listening/handler.ts. Targeted: npx vitest run src/modules/tuner/slices/start-listening/handler.test.ts
2. Wiring: none. No UI route or command exists yet to reach this slice; app/ wiring of the browser MicSource adapter waits for the UI task. Recorded here so the orchestrator does not add an app/ step.

2. Slice src/modules/tuner/slices/start-listening/handler.ts. Add a stopped flag: stop() while pending sets it. When the grant then arrives, release the new stream at once and do not emit listening; state stays idle. Covers criterion 4. Allowlist: slices/start-listening/handler.ts and its test file (test-writer step only). Targeted: npx vitest run src/modules/tuner/slices/start-listening/handler.test.ts
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
