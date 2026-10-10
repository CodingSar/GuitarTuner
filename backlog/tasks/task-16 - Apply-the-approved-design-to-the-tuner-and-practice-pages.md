---
id: TASK-16
title: Apply the approved design to the tuner and practice pages
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 17:34'
updated_date: '2026-10-10 18:29'
labels:
  - ui
dependencies:
  - TASK-13
  - TASK-15
modified_files:
  - index.html
  - practice.html
  - src/app/theme.css
  - src/app/practice-page.ts
  - src/app/practice-palette.ts
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
- [x] #3 GIVEN the OS is set to dark mode WHEN either page loads THEN the dark theme from the design applies
- [x] #4 GIVEN the styling is applied WHEN the existing tests run THEN they still pass with no changes to behaviour
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Shared theme: add src/app/theme.css with design tokens on :root (light), dark overrides under @media (prefers-color-scheme: dark) guarded by :root:not([data-theme="light"]) and :root[data-theme="dark"]; body background explicit; IBM Plex fonts; tuner and practice layout (phone 16px gutter, desktop two-column, canvas CSS-scaled with max-width 100%). Link the stylesheet and Google Fonts css2 from index.html and practice.html. Criteria #1, #2, #3. Files: src/app/theme.css (new), index.html, practice.html. Test: npx vitest run src/app/pages.test.ts (must stay green, href/src untouched). Visual check: headless Firefox screenshots at 390px and 1280px, light and dark.
2. Practice canvas palette: practice-page.ts reads the palette from the CSS custom properties on document.documentElement (background, surface, lane/line, accent hit line, pending, ok, missed, ink, ground) and re-reads on prefers-color-scheme change, so dark mode follows the OS. Canvas internal size, LANE_COUNT, NOTE_RADIUS, hit line ratio (0.8) and judging stay unchanged. Criteria #2, #3, #4. Files: src/app/practice-page.ts. Test: npx vitest run (full), then scripts/check.sh.
3. Tidy: npm run fix, then scripts/check.sh until clean; full npx vitest run green. Criteria #4.
Assumptions: lanes = 6 (design shows 6 columns, 5 divider lines); hit line stays 0.8 of canvas height (design 0.84) to keep judging unchanged; tuner string rows and practice stats/songs list need new markup or JS, out of scope, reported as gaps.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: ffd4945637f300a7da1b9cbeb88ab00ed39b393c

Step 1: theme.css, Google Fonts link, stylesheet link in index.html and practice.html. Step 2: canvas palette read from tokens in new src/app/practice-palette.ts (split out to keep practice-page.ts under the 200-line cap). Follow-up: dropped the :root[data-theme=dark] block, since nothing sets data-theme and it was a jscpd clone of the media block. Dark follows OS only; data-theme=light still opts out. Deviates from the plan's step 1 wording. Checks: npx vitest run 77/77 pass; scripts/check.sh exit 0. Evidence: headless Firefox screenshots at 390 and 1280, light and dark, in scratchpad. Gaps still open: tuner big note name, cents meter and string rows; practice Hits/Missed/Streak stats and song list. Need new markup and JS, so AC1 and AC2 stay unchecked until the user decides.

User decided: keep TASK-16 In Progress; AC1 and AC2 stay unchecked until TASK-17 and TASK-18 land. Re-verified: npx vitest run 77/77 pass; scripts/check.sh exit 0.
<!-- SECTION:NOTES:END -->
