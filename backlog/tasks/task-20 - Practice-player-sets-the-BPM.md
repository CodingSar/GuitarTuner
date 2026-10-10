---
id: TASK-20
title: 'Practice: player sets the BPM'
status: To Do
assignee: []
created_date: '2026-10-10 19:07'
labels:
  - 'module:practice'
  - ui
dependencies: []
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The tempo is fixed per song, but the player wants to set the BPM themselves to practise slower or faster than the song's default.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GIVEN a song is chosen WHEN the practice page shows it THEN the BPM field shows that song's tempo
- [ ] #2 GIVEN the player types a whole-number BPM WHEN Start is pressed THEN the notes are spaced 60000 divided by that BPM ms apart
- [ ] #3 GIVEN the BPM field holds a value that is not a positive whole number WHEN Start is pressed THEN the session does not start and the field says why
<!-- AC:END -->
