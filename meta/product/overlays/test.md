# Test-writer overlay: GuitarTuner stack

- Test file: `handler.test.ts` in the slice folder, one file per slice. It
  matches the stack pattern `^.*\.test\.ts$`.
- Test title: `TASK-n#k <criterion text>` inside `it(...)`.
- Imports: `import { describe, it, expect } from "vitest";`. Type contracts:
  `expectTypeOf`.
- Datastore: none. No reset step. Each test builds its own inputs.
- Clock, Web Audio, and getUserMedia are injected. Tests pass fakes. Never call
  `setTimeout`, `requestAnimationFrame`, or the browser audio APIs from a test.
- Stub body: `throw new Error("not implemented");`.
- Module `index` re-export: `export { handler as <camelCaseSlice> } from "./slices/<slice>/handler";`.
