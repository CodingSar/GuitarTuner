# Persistence: none (override)

Decision: `decision-6`, "Supersedes HD-2: no datastore for GuitarTuner".
Default replaced: `HD-2` (PostgreSQL only). The product stores no data: no
accounts, no saved progress, microphone audio used live and not kept.

- No datastore. No database, no document store, no key-value store as
  primary storage. Browser storage (localStorage, IndexedDB) is not used
  unless a product decision adds it.
- No connection variable and no migration command (`meta/product/stack.md`).
- A module owns no tables and has no migrations. The architecture's `store`
  and `migrations/` parts do not apply; no module creates them.
- Tests need no datastore and no database fakes.
- A cache, queue, or any stored state needs a product decision first.
