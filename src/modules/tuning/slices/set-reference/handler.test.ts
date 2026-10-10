import { describe, expect, it } from "vitest";
import { handler } from "./handler";

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
