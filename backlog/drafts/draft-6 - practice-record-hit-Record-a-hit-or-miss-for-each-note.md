---
id: DRAFT-6
title: 'practice/record-hit: Record a hit or miss for each note'
status: Draft
assignee: []
created_date: '2026-10-10 11:41'
labels:
  - 'module:practice'
milestone: Play falling notes
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Core job from product-brief: play the right string and fret as notes fall. Each note needs a judged outcome so the player sees what they got right. A pluck outside the timing window must not count as a hit.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GIVEN a note falling through the hit line WHEN the player plays the right string and fret within the timing window THEN the hit is recorded [brief: core jobs]
- [ ] #2 GIVEN a note passes the hit line WHEN no matching input arrives within the timing window THEN the note is marked missed [brief: core jobs]
<!-- AC:END -->
