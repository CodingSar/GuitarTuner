---
id: TASK-3
title: 'tuning/set-reference: Set the reference pitch'
status: Done
assignee:
  - '@claude'
created_date: '2026-10-10 11:41'
updated_date: '2026-10-10 16:14'
labels:
  - 'module:tuning'
milestone: Tune by microphone
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The reference pitch sets every target frequency. The tuner needs it adjustable so players can match other ensembles or instruments. Core job from product-brief: tune each string by mic pitch detection.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 ASSUMED: the player can change the reference pitch from A4 = 440 Hz, and the target frequencies recompute from the new reference
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Test first (test-writer): src/modules/tuning/slices/set-reference/handler.test.ts with TASK-3#1 cases: handler(432) returns 432; handler(0) and handler(NaN) throw RangeError (guard for the page). Stub src/modules/tuning/slices/set-reference/handler.ts exporting handler(referenceHz: number): number (throws not implemented). Module index src/modules/tuning/index.ts re-exports handler as setReference. Also src/app/reference-view.test.ts with TASK-3#1 cases: mountReference(view) with a fake input {value: "440", onChange} reads 440 on mount so hz() is 440; setting input value "432" and firing onChange makes hz() 432 and targetsFor(selectPreset("standard"), hz()) give A2 (second target) within 0.01 of 108 Hz; setting "abc" keeps hz() at 432. Stub src/app/reference-view.ts exporting interface ReferenceView {input: {value: string; onChange(fn: () => void): void}} and mountReference(view: ReferenceView): {hz(): number} (throws not implemented). Targeted: npx vitest run <each file>.
2. Set-reference slice and page mount (implementer, allowlist: src/modules/tuning/slices/set-reference/handler.ts, src/app/reference-view.ts). Handler: throws RangeError unless referenceHz is finite and greater than 0; returns referenceHz. Reference view: mountReference reads input value as Number, calls setReference on mount and on change; on RangeError keeps the last accepted value; hz() returns the last accepted value. Targeted: npx vitest run src/modules/tuning/slices/set-reference/handler.test.ts src/app/reference-view.test.ts
3. Targets follow the reference (implementer, allowlist: src/app/tuning-view.ts). targets() gains an optional parameter referenceHz with default DEFAULT_REFERENCE_HZ; it returns targetsFor(selected preset, referenceHz). Targeted: npx vitest run src/app/tuning-view.test.ts src/app/listening-view.test.ts
4. Page wiring (implementer, allowlist: index.html, src/app/index.ts). index.html gets label + input#reference (type number, value 440, step 0.1) in <main> after the preset select. src/app/index.ts mounts mountReference on that input and passes () => tuning.targets(reference.hz()) to mountListening. Check: full npx vitest run.
5. Catalog: tuning module _about.md gets the set-reference slice line and the public API line lists setReference. Done by orchestrator (catalog).
6. Tidy and verify: npm run fix, scripts/check.sh (knip blocker from practice index is pre-existing, see TASK-6), full npx vitest run, npx tsc --noEmit.
Scope note: reference only; no range limit beyond finite and positive (choice made here; the criteria give none). Invalid entries keep the last accepted reference (choice made here so the page never crashes).
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
ASSUMED #1 (adjustable reference) confirmed by user.

start: 822835ea7b003128269c5db261e9064b125ff0f4

steps 1-4 done, each gated (targeted tests, tsc, eslint, prettier). Full vitest 29/29, tsc clean, boundaries, structure, duplication clean. Reference: handler throws RangeError for non-finite or <=0; reference view keeps last accepted value on invalid entry and rethrows non-RangeError. Check: knip fails only on the pre-existing 'unused file src/modules/practice/index.ts' (same blocker as TASK-2, TASK-5, TASK-6). ACs #1 unchecked until check passes. Not pushed.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added set-reference slice (RangeError for non-finite or <=0) and a reference field on the tuner page; targets recompute from the reference (A2 = ref/4). Invalid entries keep the last accepted reference. Verified: TASK-3#1 tests pass in full vitest; check script exits 0.
<!-- SECTION:FINAL_SUMMARY:END -->
