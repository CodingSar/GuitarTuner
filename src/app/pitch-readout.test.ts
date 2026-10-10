import { describe, expect, it } from "vitest";
import { describeReading } from "./pitch-readout";

describe("pitch readout", () => {
  it("TASK-5#1 the readout shows the nearest string and its deviation in cents", () => {
    const text = describeReading({
      kind: "reading",
      label: "A2",
      cents: 12,
      inTune: false,
    });
    expect(text).toContain("A2");
    expect(text).toContain("+12");
  });

  it("TASK-5#3 the readout says in tune when the reading is within plus or minus 5 cents", () => {
    const text = describeReading({
      kind: "reading",
      label: "A2",
      cents: 4,
      inTune: true,
    });
    expect(text).toContain("in tune");
  });

  it("TASK-5#2 the readout says there is no reliable pitch when there is no reading", () => {
    expect(describeReading({ kind: "none" })).toBe("No reliable pitch");
  });
});
