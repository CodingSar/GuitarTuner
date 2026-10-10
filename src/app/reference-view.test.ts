import { describe, expect, it } from "vitest";
import { mountReference } from "./reference-view";
import type { ReferenceView } from "./reference-view";
import { selectPreset, targetsFor } from "../modules/tuning";

// Fake reference input. onChange stores the handler so the test can fire it.
function fakeInput(value: string) {
  let changed: (() => void) | undefined;
  const input = {
    value,
    onChange: (fn: () => void) => {
      changed = fn;
    },
  };
  return {
    input,
    // Types a new value into the field and fires its change handler.
    enter(next: string): void {
      input.value = next;
      if (changed === undefined) throw new Error("input has no change handler");
      changed();
    },
  };
}

describe("reference view", () => {
  it("TASK-3#1 the reference starts at A4 = 440 Hz when the field reads 440", () => {
    const { input } = fakeInput("440");
    const view: ReferenceView = { input };
    const reference = mountReference(view);
    expect(reference.hz()).toBe(440);
  });

  it("TASK-3#1 entering 432 makes the reference 432 Hz and the standard A2 target 108 Hz", () => {
    const field = fakeInput("440");
    const reference = mountReference({ input: field.input });
    field.enter("432");
    expect(reference.hz()).toBe(432);
    const targets = targetsFor(selectPreset("standard"), reference.hz());
    expect(Math.abs((targets[1]?.hz ?? Number.NaN) - 108)).toBeLessThan(0.01);
  });

  it("TASK-3#1 entering abc after 432 keeps the reference at 432 Hz without throwing", () => {
    const field = fakeInput("440");
    const reference = mountReference({ input: field.input });
    field.enter("432");
    field.enter("abc");
    expect(reference.hz()).toBe(432);
  });
});
