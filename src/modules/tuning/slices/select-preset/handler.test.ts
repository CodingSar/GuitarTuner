import { describe, expect, expectTypeOf, it } from "vitest";
import { handler } from "./handler";
import { targetsFor } from "../../model";
import type { Preset, PresetName } from "../../model";

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

describe("select preset (TASK-10)", () => {
  it("TASK-10#2 Every target frequency equals R times 2 to the power k over 12, with k the semitone offset from A4 and R the active reference", () => {
    // Semitone offsets from A4 for E2 A2 D3 G3 B3 E4, with R = 432 Hz.
    const semitones = [-29, -24, -19, -14, -10, -5];
    const targets = targetsFor(handler(), 432);
    expect(targets).toHaveLength(6);
    semitones.forEach((k, i) => {
      expect(targets[i]?.hz).toBeCloseTo(432 * 2 ** (k / 12), 9);
    });
  });

  it("TASK-10#4 Standard targets at A4 = 440 Hz are E2 82.41, A2 110, D3 146.83, G3 196, B3 246.94 and E4 329.63 Hz", () => {
    const targets = targetsFor(handler("standard"), 440);
    expect(targets.map((target) => target.label)).toEqual([
      "E2",
      "A2",
      "D3",
      "G3",
      "B3",
      "E4",
    ]);
    const hz = [82.41, 110, 146.83, 196, 246.94, 329.63];
    hz.forEach((expected, i) => {
      expect(targets[i]?.hz).toBeCloseTo(expected, 2);
    });
  });

  it("TASK-10#5 A tuning preset is six entries of string, note and semitone offset, and drop D changes only the low string", () => {
    const standard = handler("standard");
    const dropD = handler("drop-d");
    expect(standard.strings).toHaveLength(6);
    expect(dropD.strings).toHaveLength(6);
    expect(
      dropD.strings.every(
        (string) =>
          typeof string.label === "string" && typeof string.midi === "number",
      ),
    ).toBe(true);
    expect(dropD.strings[0]).toEqual({ label: "D2", midi: 38 });
    expect(dropD.strings.slice(1)).toEqual(standard.strings.slice(1));
  });

  it("TASK-10#16 Public contracts are typed with expectTypeOf in Vitest test files", () => {
    expectTypeOf(handler).returns.toEqualTypeOf<Preset>();
    expectTypeOf<Preset["name"]>().toEqualTypeOf<PresetName>();
  });
});
