---
id: TASK-11
title: 'Tuner page: start and stop listening from the browser'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 15:10'
updated_date: '2026-10-10 15:12'
labels:
  - 'module:tuner'
milestone: m-0
dependencies:
  - TASK-4
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
TASK-4 has a microphone handler but nothing in the app reaches it, so knip flags the tuner module as unused and check fails. The player needs a page with a Start and Stop control and a status line that tells them why listening did not start. Defaults chosen without mockups: plain text status, no framework (stack.md).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 ASSUMED: GIVEN the page has loaded WHEN the tuner starts THEN the status reads Idle and a Start listening control is shown
- [ ] #2 ASSUMED: GIVEN the player presses Start listening WHEN the browser has not yet granted the microphone THEN the status reads Waiting for microphone permission
- [ ] #3 GIVEN the player has denied microphone access WHEN the player presses Start listening THEN the status reads Microphone access denied and no pitch readout appears [brief: integrations]
- [ ] #4 GIVEN listening is running WHEN the player presses Stop THEN the status reads Idle and the microphone is released [brief: data sensitivity and compliance]
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Test-first, slice-less app code: src/app/listening-view.ts (stub) and src/app/listening-view.test.ts. Export interface Control { hidden: boolean; onClick(fn: () => void): void }, interface ListeningView { status: { textContent: string | null }; start: Control; stop: Control; readout: { hidden: boolean } }, and function mountListening(view: ListeningView, mic: MicSource): void (stub throws not implemented). Tests use a fake view and a fake MicSource from the tuner module index. Covers criteria 1-4. Mapping: mount shows status Idle and start visible; clicking start while mic pending shows Waiting for microphone permission; denial shows Microphone access denied and readout stays hidden; grant shows Listening and clicking stop shows Idle and releases the mic. Start is visible when state is idle or denied; Stop is visible when pending or listening. Allowlist: src/app/listening-view.ts, src/app/listening-view.test.ts. Targeted: npx vitest run src/app/listening-view.test.ts
2. Implement mountListening in src/app/listening-view.ts: map each TASK-4 state to the status text (idle Idle, pending Waiting for microphone permission, listening Listening, denied Microphone access denied), keep start and stop visibility per state, start calls startListening(mic, render) and stores the listener, stop calls the stored listener's stop. Covers criteria 1-4. Allowlist: src/app/listening-view.ts. Targeted: npx vitest run src/app/listening-view.test.ts
3. Wiring: src/app/microphone.ts (browser MicSource over navigator.mediaDevices.getUserMedia audio, stop releases every track), src/app/index.ts (bind the real DOM elements to ListeningView and call mountListening with the browser mic), index.html at repo root with start and stop buttons, status line, readout line hidden, and a module script for src/app/index.ts. No new tests; check is the gate. Allowlist: src/app/microphone.ts, src/app/index.ts, index.html. Targeted: npx vitest run
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
ASSUMED criteria #1 and #2 are copy defaults. User said choose sensible defaults, so confirmed as defaults.

start: 4419f9d10ee861a2b9f70d303fe728ef0d00610b
<!-- SECTION:NOTES:END -->
