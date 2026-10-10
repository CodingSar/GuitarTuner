---
description: Tuning module. Holds the tuning presets and the reference pitch that set each string's target. No datastore, so it owns no tables and has no store or migrations.
---

Purpose: name the target note of each string for the chosen tuning.

Public API: `selectPreset`, `setReference`, `targetsFor`, `DEFAULT_REFERENCE_HZ`.

Tables owned: none.

Slices:

- `select-preset`: returns a tuning preset by name; standard by default, drop D changes only the low string to D2.
- `set-reference`: accepts a reference pitch for A4 in hertz; refuses zero, negative and non-numbers with a RangeError.
