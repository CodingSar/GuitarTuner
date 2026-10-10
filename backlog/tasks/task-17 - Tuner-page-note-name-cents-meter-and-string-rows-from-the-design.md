---
id: TASK-17
title: 'Tuner page: note name, cents meter and string rows from the design'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 18:24'
updated_date: '2026-10-10 18:37'
labels:
  - ui
dependencies:
  - TASK-16
modified_files:
  - index.html
  - src/app/theme.css
  - src/app/index.ts
  - src/app/tuner-display.ts
  - src/app/tuner-display.test.ts
  - src/app/listening-view.ts
  - src/app/listening-view.test.ts
  - src/app/tuning-view.ts
  - src/app/tuning-view.test.ts
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
TASK-16 applied the approved tuner design's colours, type and layout, but not its content. The design also shows the nearest note name in large type, a cents meter with a centre mark, and the preset's strings as rows with the string being tuned marked. The tuner readout is text-only today, so a player cannot see how far off a string is at a glance. Presentation is the goal; the pitch reading and its in-tune rule stay as they are. Design board is TASK-15.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 While listening, the tuner shows the nearest note name in large type, and shows a placeholder when no pitch is read
- [x] #2 A cents meter with a centre mark moves with the cents reading, and its in-tune state uses the same rule as the existing readout text
- [ ] #3 The preset's strings are shown as rows, and the string currently nearest the pitch is marked
- [x] #4 Tests cover the note name, meter and marked-row states from a pitch reading, and the tuner's behaviour is unchanged
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Pure display model in src/app/tuner-display.ts: describeDisplay(reading) gives the note name (nearest label, or a dash placeholder when no pitch), meter position (cents clamped to +-50, mapped to 0..1, centre at 0.5) and inTune (the reading's inTune flag, so same rule as the readout). Test file src/app/tuner-display.test.ts with TASK-17#1 to #4 cases. AC1, AC2, AC4.
2. Listening view: optional panel on ListeningView with show(display). tick() shows describeReading-matched display from each reading; render() shows the placeholder whenever state is not listening. Existing readout text and tests unchanged. Test: a steady tone drives the panel and stop resets it. AC1, AC2, AC3, AC4.
3. Strings as rows: tuning-view writes labels through strings.setLabels(labels) instead of textContent (the join stays the same, so the TASK-2 behaviour holds); index.ts renders <li> rows and marks the row whose label matches the reading with aria-current. Update tuning-view.test fake only to record labels, assertions unchanged. AC3, AC4.
4. index.html: wrap note, meter, readout in #panel; status, controls, strings list in #side; #note, #meter, #needle, #strings as ul. Keep ids used by tests (readout, status, start, stop, preset, reference). pages.test href/src untouched.
5. theme.css: tuner layout (phone stack with 16px gutter, desktop two columns), note name large (112px phone / 176px desktop), meter track and needle with green in-tune state, string rows with marked row; Plex fonts as already linked. Dark mode via existing tokens. AC1.
6. Checks: npx vitest run (full green), scripts/check.sh exit 0; visual check of tuner page at 390px and 1280px light and dark in headless Firefox if available, screenshots to scratchpad. AC1 needs that evidence; AC2 is practice (TASK-18), not touched here. Leave TASK-17 ACs checked only on evidence.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Built per plan. New pure module src/app/tuner-display.ts (displayOf, NO_PITCH); ListeningView gets optional panel (show(display)), fed each tick and reset to NO_PITCH on every non-listening render. TuningView.strings now setLabels(labels); tuning-view.test asserts the label list (same two cases). index.ts: stringsOf renders <li> rows and marks aria-current on the nearest; panelOf drives #note, #needle, #panel data-state. index.html: #panel (note, meter, readout) and #side (status, controls, presets, reference, #strings as ul). theme.css: 112px phone / 176px desktop note, meter with centre tick, needle, string rows, desktop two-column via main:has(#panel).
Verified: npx vitest run 85/85 pass; scripts/check.sh exit 0 (listening-view.test.ts trimmed to the 300-line cap). Headless Firefox screenshots at 390px and 1280px (light): placeholder, meter with centre tick, six string rows, two-column desktop layout (scratchpad phone.png, desktop.png).
Not verified: live reading state in a browser (needs a microphone), dark mode, and the marked-row DOM update (no DOM test environment in the repo; mapping covered by tuner-display.test and listening-view.test). Hz values from the design not shown: the reading carries no Hz field and no AC asks for it.
<!-- SECTION:NOTES:END -->
