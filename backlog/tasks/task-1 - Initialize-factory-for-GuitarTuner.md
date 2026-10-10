---
id: TASK-1
title: Initialize factory for GuitarTuner
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 10:56'
updated_date: '2026-10-10 10:57'
labels:
  - init-factory
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Run of the init-factory skill.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Preflight passed: harness remote with shared history
- [ ] #2 Brief ratified and stored as Backlog doc product-brief
- [ ] #3 Domain and concern facets ratified
- [ ] #4 Stack and architecture ratified: stack.md has no TBD, decisions recorded in init-decisions
- [ ] #5 Practice packs ratified, vendored, locked and compiled; new packs proposed upstream
- [ ] #6 Environment provisioned and stack overlays written
- [ ] #7 Backlog seeded with milestones and draft slices
- [ ] #8 Walking skeleton green: install, migrations, check command, full tests, check-harness, CI
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
criterion 1: origin=git@github.com:CodingSar/GuitarTuner.git (product, empty at start), harness=git@github.com:CodingSar/GhostInside.git; merge-base HEAD harness/main = 017dad9 (= HEAD); CONCEPT.md verbatim from user; projectName=GuitarTuner; gh logged in as CodingSar; template guard passed (user confirmed product clone).
<!-- SECTION:NOTES:END -->
