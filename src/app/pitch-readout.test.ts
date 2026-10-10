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

describe("pitch readout (TASK-10)", () => {
  it("TASK-10#9 A reading more than 50 cents from the selected target shows wrong string or octave instead of a deviation", () => {
    const sharp = describeReading({
      kind: "reading",
      label: "E2",
      cents: 60,
      inTune: false,
    });
    const flat = describeReading({
      kind: "reading",
      label: "E2",
      cents: -60,
      inTune: false,
    });
    expect(sharp).toContain("Wrong string or octave");
    expect(sharp).not.toContain("cents");
    expect(flat).toContain("Wrong string or octave");
    expect(flat).not.toContain("cents");
    // A reading within 50 cents still shows its deviation.
    const near = describeReading({
      kind: "reading",
      label: "E2",
      cents: 40,
      inTune: false,
    });
    expect(near).toContain("+40 cents");
  });
});
