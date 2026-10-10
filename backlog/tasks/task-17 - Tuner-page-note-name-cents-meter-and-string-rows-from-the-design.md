---
id: TASK-17
title: 'Tuner page: note name, cents meter and string rows from the design'
status: To Do
assignee: []
created_date: '2026-10-10 18:24'
labels:
  - ui
dependencies:
  - TASK-16
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
TASK-16 applied the approved tuner design's colours, type and layout, but not its content. The design also shows the nearest note name in large type, a cents meter with a centre mark, and the preset's strings as rows with the string being tuned marked. The tuner readout is text-only today, so a player cannot see how far off a string is at a glance. Presentation is the goal; the pitch reading and its in-tune rule stay as they are. Design board is TASK-15.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 While listening, the tuner shows the nearest note name in large type, and shows a placeholder when no pitch is read
- [ ] #2 A cents meter with a centre mark moves with the cents reading, and its in-tune state uses the same rule as the existing readout text
- [ ] #3 The preset's strings are shown as rows, and the string currently nearest the pitch is marked
- [ ] #4 Tests cover the note name, meter and marked-row states from a pitch reading, and the tuner's behaviour is unchanged
<!-- AC:END -->
