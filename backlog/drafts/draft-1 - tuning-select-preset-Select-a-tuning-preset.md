---
id: DRAFT-1
title: 'tuning/select-preset: Select a tuning preset'
status: Draft
assignee: []
created_date: '2026-10-10 11:41'
labels:
  - 'module:tuning'
milestone: Tune by microphone
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Tuning by microphone needs a known target note for each string before any reading means anything. Core job from product-brief: tune each string by mic pitch detection, standard tuning first, reference adjustable.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GIVEN the app is open WHEN the player opens the tuner THEN standard tuning E2 A2 D3 G3 B3 E4 is selected and each string is named [brief: core jobs]
- [ ] #2 ASSUMED: the player can select drop D, which changes only the low string to D2
<!-- AC:END -->
