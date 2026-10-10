import { describe, expect, it } from "vitest";
import { handler } from "./handler";
import { DEFAULT_REFERENCE_HZ, PRESETS, targetsFor } from "../../model";

describe("set reference", () => {
  it("TASK-3#1 the player sets the reference pitch to 432 Hz and 432 is returned", () => {
    expect(handler(432)).toBe(432);
  });

  it("TASK-3#1 a reference of 0 Hz is refused with a RangeError", () => {
    expect(() => handler(0)).toThrow(RangeError);
  });

  it("TASK-3#1 a reference of NaN is refused with a RangeError", () => {
    expect(() => handler(Number.NaN)).toThrow(RangeError);
  });
});

describe("set reference (TASK-10)", () => {
  it("TASK-10#3 The reference defaults to A4 = 440 Hz, and changing it recomputes the whole target table", () => {
    expect(DEFAULT_REFERENCE_HZ).toBe(440);
    const atDefault = targetsFor(PRESETS.standard, DEFAULT_REFERENCE_HZ);
    const retuned = targetsFor(PRESETS.standard, handler(432));
    expect(atDefault[1]?.hz).toBeCloseTo(110, 9);
    expect(retuned).toHaveLength(atDefault.length);
    atDefault.forEach((target, i) => {
      expect(retuned[i]?.hz).not.toBe(target.hz);
    });
    expect(retuned[1]?.hz).toBeCloseTo(108, 9);
  });
});
