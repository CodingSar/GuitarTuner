---
id: TASK-21
title: 'Tuner and practice: nav links look like buttons'
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 19:07'
updated_date: '2026-10-10 19:26'
labels:
  - ui
dependencies: []
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The links between the Tuner and Practice pages look plain and out of place now that the pages are styled. Make them buttons.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GIVEN the Tuner page is open WHEN it is shown THEN the link to the Practice page is a button labelled Practice
- [ ] #2 GIVEN the Practice page is open WHEN it is shown THEN the link to the Tuner page is a button labelled Tuner
- [ ] #3 GIVEN either nav button WHEN it is tapped THEN the browser opens the other page, and the button is at least 44 px tall
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Both links stay <a> because they navigate; they look like buttons (44 px tall, same border, radius and colours as the shared button rule in theme.css). Nav moves to the top of <main> as in the mockups. Hrefs stay the same: src/app/pages.test.ts TASK-13#4 pins them.

1. Root index.html and practice.html: replace <p><a> with <nav aria-label="Pages"> holding two <a class="nav-button"> links, Tuner and Practice, at the top of <main>. The current page's link gets aria-current="page". Covers AC#1 and AC#2. Files: index.html, practice.html. Target test: npx vitest run src/app/pages.test.ts (test-writer adds cases for the nav markup).

2. src/app/theme.css: add .nav-button (min-height 44px, inline-flex, centred, padding 0 16px, border 1px solid var(--line), radius 10px, background var(--surface), colour var(--ink), no underline), a filled style for [aria-current="page"], nav[aria-label="Pages"] flex row with gap 8px and width 320px, and main:has(#panel) > nav spanning both grid columns on the Tuner page. Covers AC#3 (44 px tap height). Files: src/app/theme.css. Test-writer adds a case to src/app/pages.test.ts that reads theme.css and asserts the .nav-button rule sets min-height: 44px. Target test: npx vitest run src/app/pages.test.ts

Final check: npx vitest run (full suite) and scripts/check.sh. Tap-through to the other page is checked by hand in a browser, since no DOM test environment exists; record it in the notes.

Open choice to confirm: the AC says "button". Plan uses a styled link, not <button>, because a button cannot navigate without script. Say if you want a real <button> with JavaScript navigation instead.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
start: 2273d7ac7cdfe14c655434a948bcf6ba96d4819e
<!-- SECTION:NOTES:END -->
