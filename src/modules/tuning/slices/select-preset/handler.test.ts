import { describe, expect, it } from "vitest";
import { handler } from "./handler";
import type { Preset } from "../../model";

// The note names of a preset's strings, from the lowest to the highest.
function labelsOf(preset: Preset): string[] {
  return preset.strings.map((string) => string.label);
}

describe("select preset", () => {
  it("TASK-2#1 standard tuning E2 A2 D3 G3 B3 E4 is selected by default and each string is named", () => {
    const preset = handler();
    expect(preset.name).toBe("standard");
    expect(labelsOf(preset)).toEqual(["E2", "A2", "D3", "G3", "B3", "E4"]);
  });

  it("TASK-2#2 drop D changes only the low string to D2", () => {
    const preset = handler("drop-d");
    expect(labelsOf(preset)).toEqual(["D2", "A2", "D3", "G3", "B3", "E4"]);
    expect(labelsOf(preset).slice(1)).toEqual(["A2", "D3", "G3", "B3", "E4"]);
  });
});
