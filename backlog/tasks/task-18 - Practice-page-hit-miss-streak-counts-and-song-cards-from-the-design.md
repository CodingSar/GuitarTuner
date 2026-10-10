---
id: TASK-18
title: 'Practice page: hit/miss/streak counts and song cards from the design'
status: Done
assignee:
  - '@claude'
created_date: '2026-10-10 18:24'
updated_date: '2026-10-10 18:55'
labels:
  - ui
dependencies:
  - TASK-16
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
TASK-16 applied the approved practice design's colours and layout, but not its content. The design also shows Hits, Missed and Streak counts, and lists the songs as cards rather than a plain select. Players get no running score today. Presentation plus the counts; judging and song playback stay as they are. Design board is TASK-15.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Hits, Missed and Streak counts show on the practice page, update as each note is judged, and reset when a new song is selected
- [x] #2 The song choices are shown as cards that match the approved design, and selecting a card plays that song
- [x] #3 Tests cover the counts, the streak reset on a miss, and song selection, and existing practice behaviour is unchanged
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Test first, slice tally-judgments (test-writer). Create src/modules/practice/slices/tally-judgments/handler.test.ts with TASK-18#1 tests: hits and missed counts, streak is the trailing run of hits with pending skipped, a miss resets the streak to 0, empty input gives zeros. Stub handler.ts as export function handler(judgments: readonly Judgment[]): Tally throwing not implemented, with type Tally = { hits, missed, streak }. Allowlist: that slice folder. Command: npx vitest run src/modules/practice/slices/tally-judgments
2. Test first, practice view (test-writer). In src/app/practice-view.test.ts add TASK-18#1 tests: tally() is zeros before start, counts match judged notes after start, tally() is zeros as soon as selectSong picks a different song than the one playing. Add TASK-18#2 test: selectSong(i) then start() plays song i (frame() notes match song i). Add tally(): Tally to PracticeController in src/app/practice-view.ts as a stub throwing not implemented. Allowlist: src/app/practice-view.test.ts and src/app/practice-view.ts (signature stub only). Command: npx vitest run src/app/practice-view.test.ts
3. Implement tally-judgments (implementer). Write handler.ts. Export handler and type Tally from src/modules/practice/index.ts. Add the slice line to src/modules/practice/_about.md. Allowlist: the slice folder handler.ts, index.ts, _about.md. Covers TASK-18#1. Command: npx vitest run src/modules/practice
4. Implement practice view tally (implementer). In src/app/practice-view.ts record the index of the chosen song alongside the song. Set the playing index in start(). tally() returns zeros when playing index differs from chosen index, else calls the tally slice on judgments(). judgments() unchanged. Allowlist: src/app/practice-view.ts. Covers TASK-18#1, TASK-18#2. Command: npx vitest run src/app/practice-view.test.ts
5. Card and tally DOM helpers (implementer). Create src/app/practice-panel.ts, under 200 lines, exporting mountSongCards(container, songs, onPick) that builds one button per song with title and tempo, marks the chosen card with the accent border, and showTally(elements, tally) that writes hits, missed and streak. No unit test: vitest has no DOM environment, same as practice-page.ts. Allowlist: src/app/practice-panel.ts. Covers TASK-18#1 display and #2 cards. Command: npx tsc --noEmit
6. Markup (implementer). In practice.html replace the label and select with an empty container div id songs, and add tally elements with ids hits, missed and streak, shown in the design order. Keep the canvas, buttons and links. Allowlist: practice.html. Command: npx vitest run src/app/pages.test.ts
7. Wire the page (implementer). In src/app/practice-page.ts remove the select handling. Call mountSongCards with a pick handler that runs selectSong(i) then start(), and on every tick call showTally(practice.tally()). Keep the file under 200 lines; move anything that would exceed into practice-panel.ts. Allowlist: src/app/practice-page.ts and src/app/practice-panel.ts. Covers TASK-18#1 and #2. Command: npx vitest run src/app
8. Styles (implementer). In src/app/theme.css add card and tally styles from the approved design: cards 56px tall with 12px radius, selected card with 2px accent border, tally tiles with mono numbers, phone tally as one row. Keep the existing dark mode token rules. Allowlist: src/app/theme.css. Command: npx vitest run src/app
9. Tidy (implementer or test-writer by file). Run npm run fix, then scripts/check.sh. Route findings by file: source files of this plan to implementer tidy; test files to test-writer tidy. Findings outside this plan stop the run.
10. Verify. Full suite npx vitest run and scripts/check.sh must both pass. Then commit per step locally with TASK-18 in the message, push once to origin main, record --check-ac evidence, final summary, and set Done.
Notes: AC2 phone design has no card list; cards are shown at every width and this is flagged to the user. Card click means select and start (plays). Streak = trailing run of hits over resolved notes, pending skipped.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: 1a1e65a13bc75d72b478f6e31290b59d9f8e29ed
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Practice page shows Hits, Missed and Streak counts (tally-judgments slice via PracticeController.tally), updated as notes are judged and reset on a new song choice. Song choices are card buttons (mountSongCards) styled from the design; clicking a card selects and starts that song. Tests: handler.test.ts (TASK-18#1 counts, streak trailing run, miss reset, empty), practice-view.test.ts (TASK-18#1 tally zeros/counts/reset on song change, TASK-18#2 selecting plays that song). Existing TASK-13/14 tests unchanged. Check script and full suite pass (93 tests). Not verified: visual match against the design in a browser; phone layout shows cards too (design phone has no card list). Depends on TASK-16.
<!-- SECTION:FINAL_SUMMARY:END -->
