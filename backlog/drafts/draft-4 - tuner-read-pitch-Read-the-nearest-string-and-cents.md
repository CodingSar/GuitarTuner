---
id: DRAFT-4
title: 'tuner/read-pitch: Read the nearest string and cents'
status: Draft
assignee: []
created_date: '2026-10-10 11:41'
labels:
  - 'module:tuner'
milestone: Tune by microphone
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Core job from product-brief: tune each string by mic pitch detection. The reading must name the nearest string and show how far off it is, or say when no reliable pitch exists.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GIVEN a steady tone near a target string WHEN it is detected THEN the nearest string and its deviation in cents are shown [brief: core jobs]
- [ ] #2 GIVEN no reliable pitch in the input WHEN the tuner reads it THEN no value is shown and the app says there is no reliable pitch [brief: core jobs]
- [ ] #3 ASSUMED: a reading within plus or minus 5 cents of the target is shown as in tune
<!-- AC:END -->
