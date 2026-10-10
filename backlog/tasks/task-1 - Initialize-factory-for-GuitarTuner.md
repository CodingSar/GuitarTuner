---
id: TASK-1
title: Initialize factory for GuitarTuner
status: In Progress
assignee:
  - '@claude'
created_date: '2026-10-10 10:56'
updated_date: '2026-10-10 11:41'
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
- [x] #5 Practice packs ratified, vendored, locked and compiled; new packs proposed upstream
- [ ] #6 Environment provisioned and stack overlays written
- [x] #7 Backlog seeded with milestones and draft slices
- [ ] #8 Walking skeleton green: install, migrations, check command, full tests, check-harness, CI
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
criterion 1: origin=git@github.com:CodingSar/GuitarTuner.git (product, empty at start), harness=git@github.com:CodingSar/GhostInside.git; merge-base HEAD harness/main = 017dad9 (= HEAD); CONCEPT.md verbatim from user; projectName=GuitarTuner; gh logged in as CodingSar; template guard passed (user confirmed product clone).

criterion 2: doc product-brief (doc-1); decisions decision-1 (deploy: browser), decision-2 (tuning: mic), decision-3 (users: solo, no accounts), decision-4 (scale: client-side, no server); init-decisions doc-2 holds gate rows. Gate ratified 2026-10-10 (accept all). Brief gate rows: name ASSUMED repo name; data/mic storage ASSUMED; integrations ASSUMED (no external). Note for stack gate: no-server/no-storage supersedes HD-2 default datastore. evidence: product-brief doc-1 has all 10 fields, each with source; init-decisions doc-2 has one row per gate item.

criterion 3: facets ratified (accept): domain/music-training (miss), concern/security-web (miss). Central index empty at fetch (commit 6acaf49), so both misses need deep-research in practices phase. Rejected: domain/audio-processing; concern/privacy-gdpr; concern/accessibility. Facet rows recorded in init-decisions doc-2 with ref '-' (classification, not product decision). evidence: practices.py status output (miss, miss); ratified list here.

criterion 4: stack ratified (accept all, 2026-10-10). Stack facets: lang/typescript (datastore none, no framework). decision-5 (stack row set), decision-6 (Supersedes HD-2: no datastore); HD-11 kept. Overrides: meta/product/persistence.md (none). Research: Biome vs ESLint+Prettier and dep-cruiser vs eslint-plugin-boundaries (subagent); Biome rejected for unverified TS 6 coverage. evidence: ! grep -q TBD meta/product/stack.md exit 0; npm ci exit 0; scripts/check.sh exit 0; check-harness exit 0; decisions decision-5, decision-6; init-decisions doc-2 rows. Known gap: jscpd analyzes 0 files until src has a file of 5+ lines (warns, exits 0). Boundary rules probed with temporary slice files and removed.

criterion 5: packs ratified 2026-10-10 (accept all, incl. enforcement plan). Vendored and locked: lang/typescript (26 rules: 18 MUST, 8 SHOULD), domain/music-training (27: 21 MUST, 6 SHOULD), concern/security-web (28: 24 MUST, 4 SHOULD); all new, so local until PRs merge. Enforcement compiled: eslint rules (TS-005, TS-010, SEC-014, SEC-015 incl. no-new-func), tsconfig noUncheckedIndexedAccess (TS-013), .npmrc ignore-scripts=true (SEC-019), SECURITY.md (SEC-026), check-cmd rules appended to scripts/check.sh with forbid helper for negated rules. Test rules (15 music, TS-017) go to seed. Review rules (4 TS, 12 music, 19 security) go to provision overlay. Upstream PRs: lang/typescript CodingSar/GhostInsidePractices#1, domain/music-training #2, concern/security-web #3. evidence: practices.py verify ok (3 packs match lock); scripts/check.sh exit 0; check-harness exit 0; propose exit 0 x3; forbid probe confirmed (unsafe- in index.html fails check). Open: enable private vulnerability reporting on the repo (SECURITY.md points at it); SEC-027 security.txt path not yet written (review, provision). jscpd analyzes 0 files (known gap).

criterion 6 (partial): provisioned .nvmrc, .github/workflows/ci.yml (SHAs pinned, permissions contents read, no pull_request_target), README.md (product), overlays orchestrate/test/implement under meta/product/overlays/. BLOCKED: P3 .claude/settings.json allow entries (npm ci, npm run, npx vitest/eslint/prettier/tsc/knip, scripts/check.sh, check-harness.sh). The Edit was denied by the auto-mode classifier (Self-Modification); not retried by any other route. Needs user to approve or add the entries. Evidence: npm ci exit 0 (ignore-scripts=true, no install errors); scripts/check.sh exit 0; check-harness.sh exit 0; ci.yml parses (yaml), steps as specified; npx vitest run exit 1 'No test files found' (expected until criterion 8). Criterion 6 stays unchecked until P3 lands.

criterion 7: milestones m-0 Tune by microphone, m-1 Play falling notes, m-2 Adjust fall speed; drafts DRAFT-1..8 slices (tuning/select-preset, tuning/set-reference, tuner/start-listening, tuner/read-pitch, practice/start-session, practice/record-hit, practice/set-latency-offset, practice/set-fall-speed) with module labels and milestones; DRAFT-9 Practice tests with 16 pack-tagged criteria (15 domain/music-training + TS-017). Every slice criterion has exactly one tag or ASSUMED prefix. evidence: backlog milestone list and draft list show all of the above.
<!-- SECTION:NOTES:END -->
