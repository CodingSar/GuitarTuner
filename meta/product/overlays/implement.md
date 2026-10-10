# Implementer overlay: GuitarTuner stack

- Migrations: none. The datastore is none, so `store` and `migrations/` do not apply.
- Fix command: `npm run fix`.
- Boundary violation: `npm run boundaries` names the rule and the file. Fix the
  import through the module's `index`.
- Idioms (TypeScript, strict):
  - No `any`. Type unknown values as `unknown` and narrow them.
  - No non-null `!`. Use `import type` for type-only imports.
  - Indexed reads may be `undefined`. Handle them.
  - Write text with `textContent` or canvas `fillText`. No `innerHTML`, `eval`, or string timers.
  - Parse stored data with `JSON.parse`.
- Review rules: the packet carries `meta/product/practices/review.md`. No
  rule needs a verbatim note here, since every tool a rule names is in the stack.
