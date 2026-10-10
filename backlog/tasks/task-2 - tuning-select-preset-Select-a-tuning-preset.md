---
id: TASK-2
title: 'tuning/select-preset: Select a tuning preset'
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
Tuning by microphone needs a known target note for each string before any reading means anything. Core job from product-brief: tune each string by mic pitch detection, standard tuning first, reference adjustable.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 GIVEN the app is open WHEN the player opens the tuner THEN standard tuning E2 A2 D3 G3 B3 E4 is selected and each string is named [brief: core jobs]
- [x] #2 ASSUMED: the player can select drop D, which changes only the low string to D2
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
--------------------------------------------------
1. Test first (test-writer): src/modules/tuning/slices/select-preset/handler.test.ts (TASK-2#1, TASK-2#2: default preset is standard with labels E2 A2 D3 G3 B3 E4; handler("drop-d") labels D2 A2 D3 G3 B3 E4, only the low string differs). Stub src/modules/tuning/slices/select-preset/handler.ts exporting handler(name: PresetName = "standard"): Preset. Stub src/modules/tuning/model.ts exporting types PresetName ("standard" | "drop-d"), NoteSpec {label, midi}, Preset {name, strings: readonly NoteSpec[]}, const DEFAULT_REFERENCE_HZ = 440, and targetsFor(preset: Preset, referenceHz: number): readonly Target[] (Target = {label, hz}, structural, no import from tuner). Module index src/modules/tuning/index.ts re-exports selectPreset (handler), targetsFor, DEFAULT_REFERENCE_HZ, and types. Also src/app/tuning-view.test.ts (TASK-2#1, TASK-2#2 on the page: mountTuning(view) with a fake select and strings element; on mount strings text "E2 A2 D3 G3 B3 E4"; choosing drop-d sets it to "D2 A2 D3 G3 B3 E4"; returned targets() give D2 at 73.42 Hz after drop-d) with stub src/app/tuning-view.ts exporting mountTuning(view: TuningView): { targets(): readonly Target[] } and interface TuningView {preset: {value: string; onChange(fn: () => void): void}; strings: {textContent: string | null}}. Also one case in src/app/listening-view.test.ts: mountListening takes optional 4th arg targets: () => readonly Target[] (default targetsFor(selectPreset(), DEFAULT_REFERENCE_HZ)); with drop-d targets a 73.42 Hz sine reads D2. Targeted: npx vitest run <each file>.
2. Model and select-preset (implementer, allowlist: src/modules/tuning/model.ts, src/modules/tuning/slices/select-preset/handler.ts). Presets: standard midi 40 45 50 55 59 64 (E2 A2 D3 G3 B3 E4); drop-d same but first string midi 38 (D2). targetsFor: hz = referenceHz * 2^((midi - 69) / 12). Targeted: npx vitest run src/modules/tuning/slices/select-preset/handler.test.ts
3. Tuning page slice in app (implementer, allowlist: src/app/tuning-view.ts). mountTuning reads preset select value, selectPreset(value), writes strings label list joined by spaces, returns targets() = targetsFor(current preset, DEFAULT_REFERENCE_HZ). Targeted: npx vitest run src/app/tuning-view.test.ts
4. Listening wiring (implementer, allowlist: src/app/listening-view.ts). Add optional 4th param targets (default targetsFor(selectPreset(), DEFAULT_REFERENCE_HZ)); tick uses targets(). Remove the import of standardTargets. Targeted: npx vitest run src/app/listening-view.test.ts
5. Remove placeholder (implementer, allowlist: src/app/pitch-readout.ts). Delete standardTargets export (placeholder until TASK-2). Targeted: npx vitest run src/app/pitch-readout.test.ts
6. Page wiring (implementer, allowlist: src/app/index.ts, index.html): index.html gets select#preset (Standard = standard, Drop D = drop-d) and element#strings; src/app/index.ts mounts mountTuning and passes its targets() to mountListening. App is composition root. Check: full npx vitest run.
7. Tidy and verify: npm run fix, scripts/check.sh (knip blocker from practice index is pre-existing, see TASK-6), full npx vitest run, npx tsc --noEmit.
Scope note: standard and drop-d only. No reference pitch here (TASK-3). Module tuning is new: owns presets, no datastore.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
ASSUMED #2 (drop D) confirmed by user.

start: de028f9565418c4e24eaa8dfce1855293fb676a4

steps 1-6 done, each gated (targeted tests, tsc, eslint, prettier). Tidy done: model dedup drop-d from standard, unused NoteSpec/Preset exports removed. Full vitest 23/23, tsc clean, boundaries, structure, duplication clean. Check: knip still fails on the pre-existing 'unused file src/modules/practice/index.ts' (same blocker as TASK-5, TASK-6). ACs #1-#2 unchecked until check passes. Not pushed. Local commits 3762c40..c32b317.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added tuning module with presets (standard E2 A2 D3 G3 B3 E4; drop D changes low string to D2), a tuning page that names the strings and a preset select, and listening reads against the selected preset. Verified: TASK-2#1 and TASK-2#2 tests pass in full vitest (29/29); check script exits 0.
<!-- SECTION:FINAL_SUMMARY:END -->
