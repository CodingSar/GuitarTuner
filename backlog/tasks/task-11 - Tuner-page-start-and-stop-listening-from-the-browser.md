---
id: TASK-11
title: 'Tuner page: start and stop listening from the browser'
status: To Do
assignee: []
created_date: '2026-10-10 15:10'
updated_date: '2026-10-10 15:10'
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

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
ASSUMED criteria #1 and #2 are copy defaults. User said choose sensible defaults, so confirmed as defaults.
<!-- SECTION:NOTES:END -->
