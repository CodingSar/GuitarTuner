---
id: TASK-4
title: 'tuner/start-listening: Start and stop microphone listening'
status: To Do
assignee: []
created_date: '2026-10-10 11:41'
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
<!-- AC:END -->
