---
description: Health module. Reports that the app runs. No datastore, so it owns no tables and has no store or migrations.
---

Purpose: answer whether the app is up.

Public API: `check`.

Tables owned: none.

Slices:

- `check`: returns status `ok` and the app version.
