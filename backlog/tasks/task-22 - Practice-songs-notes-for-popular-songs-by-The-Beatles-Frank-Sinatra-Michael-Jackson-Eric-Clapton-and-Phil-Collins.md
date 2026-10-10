---
id: TASK-22
title: >-
  Practice songs: notes for popular songs by The Beatles, Frank Sinatra, Michael
  Jackson, Eric Clapton and Phil Collins
status: To Do
assignee: []
created_date: '2026-10-10 19:07'
labels:
  - 'module:practice'
  - song
dependencies: []
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The player wants to practise songs they know, not only the bundled public-domain tunes. Each song is hand-entered as note data, like the existing songs. Note: TASK-12 chose public-domain songs only; this task overrides that default for these songs, and the user must confirm it before work starts.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GIVEN the song list loads WHEN it is read THEN it contains at least one song each by The Beatles, Frank Sinatra, Michael Jackson, Eric Clapton and Phil Collins
- [ ] #2 GIVEN each added song WHEN it is validated THEN validation passes and its tempo is above 0
- [ ] #3 GIVEN the list loads WHEN it is read THEN the three public-domain songs from TASK-12 are still there
<!-- AC:END -->
