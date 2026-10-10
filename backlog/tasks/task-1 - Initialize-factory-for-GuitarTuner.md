---
id: TASK-1
title: Initialize factory for GuitarTuner
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 10:56'
updated_date: '2026-10-10 11:11'
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
- [x] #2 Brief ratified and stored as Backlog doc product-brief
- [x] #3 Domain and concern facets ratified
- [x] #4 Stack and architecture ratified: stack.md has no TBD, decisions recorded in init-decisions
- [ ] #5 Practice packs ratified, vendored, locked and compiled; new packs proposed upstream
- [ ] #6 Environment provisioned and stack overlays written
- [ ] #7 Backlog seeded with milestones and draft slices
- [ ] #8 Walking skeleton green: install, migrations, check command, full tests, check-harness, CI
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
criterion 1: origin=git@github.com:CodingSar/GuitarTuner.git (product, empty at start), harness=git@github.com:CodingSar/GhostInside.git; merge-base HEAD harness/main = 017dad9 (= HEAD); CONCEPT.md verbatim from user; projectName=GuitarTuner; gh logged in as CodingSar; template guard passed (user confirmed product clone).

criterion 2: doc product-brief (doc-1); decisions decision-1 (deploy: browser), decision-2 (tuning: mic), decision-3 (users: solo, no accounts), decision-4 (scale: client-side, no server); init-decisions doc-2 holds gate rows. Gate ratified 2026-10-10 (accept all). Brief gate rows: name ASSUMED repo name; data/mic storage ASSUMED; integrations ASSUMED (no external). Note for stack gate: no-server/no-storage supersedes HD-2 default datastore. evidence: product-brief doc-1 has all 10 fields, each with source; init-decisions doc-2 has one row per gate item.

criterion 3: facets ratified (accept): domain/music-training (miss), concern/security-web (miss). Central index empty at fetch (commit 6acaf49), so both misses need deep-research in practices phase. Rejected: domain/audio-processing; concern/privacy-gdpr; concern/accessibility. Facet rows recorded in init-decisions doc-2 with ref '-' (classification, not product decision). evidence: practices.py status output (miss, miss); ratified list here.

criterion 4: stack ratified (accept all, 2026-10-10). Stack facets: lang/typescript (datastore none, no framework). decision-5 (stack row set), decision-6 (Supersedes HD-2: no datastore); HD-11 kept. Overrides: meta/product/persistence.md (none). Research: Biome vs ESLint+Prettier and dep-cruiser vs eslint-plugin-boundaries (subagent); Biome rejected for unverified TS 6 coverage. evidence: ! grep -q TBD meta/product/stack.md exit 0; npm ci exit 0; scripts/check.sh exit 0; check-harness exit 0; decisions decision-5, decision-6; init-decisions doc-2 rows. Known gap: jscpd analyzes 0 files until src has a file of 5+ lines (warns, exits 0). Boundary rules probed with temporary slice files and removed.
<!-- SECTION:NOTES:END -->
