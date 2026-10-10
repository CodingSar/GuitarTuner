---
id: TASK-16
title: Apply the approved design to the tuner and practice pages
status: To Do
assignee: []
created_date: '2026-10-10 17:34'
updated_date: '2026-10-10 17:34'
labels:
  - ui
dependencies:
  - TASK-13
  - TASK-15
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implements the approved design from the design task. Behaviour stays as it is; this task changes presentation only. The phone layout needs a 16px side gutter and no horizontal scroll.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GIVEN the approved design WHEN the tuner page is viewed THEN its layout, colors, and type match the design at phone and desktop widths
- [ ] #2 GIVEN the approved design WHEN the practice page is viewed THEN the falling-note view and controls match the design
- [ ] #3 GIVEN the OS is set to dark mode WHEN either page loads THEN the dark theme from the design applies
- [ ] #4 GIVEN the styling is applied WHEN the existing tests run THEN they still pass with no changes to behaviour
<!-- AC:END -->
