import { describe, it, expect } from "vitest";
import type { Reading } from "../modules/tuner";
import { NO_PITCH, displayOf } from "./tuner-display";

const reading = (cents: number, inTune = Math.abs(cents) <= 5): Reading => ({
  kind: "reading",
  label: "A2",
  cents,
  inTune,
});

describe("tuner display", () => {
  it("TASK-17#1 the note name is the nearest string label when a reading is heard", () => {
    expect(displayOf(reading(12)).note).toBe("A2");
  });

  it("TASK-17#1 the note name shows a dash placeholder when there is no reliable pitch", () => {
    expect(displayOf({ kind: "none" })).toEqual(NO_PITCH);
    expect(NO_PITCH.note).toBe("–");
  });

  it("TASK-17#2 the meter needle sits at the centre for zero cents and at the edges for -50 and +50 cents", () => {
    expect(displayOf(reading(0)).position).toBe(0.5);
    expect(displayOf(reading(-50)).position).toBe(0);
    expect(displayOf(reading(50)).position).toBe(1);
  });

  it("TASK-17#2 the meter needle is pinned to the edge for readings past 50 cents", () => {
    expect(displayOf(reading(-80)).position).toBe(0);
    expect(displayOf(reading(73)).position).toBe(1);
  });

  it("TASK-17#2 in tune follows the reading's in-tune rule, so 5 cents is in tune and 6 cents is not", () => {
    expect(displayOf(reading(5)).inTune).toBe(true);
    expect(displayOf(reading(-5)).inTune).toBe(true);
    expect(displayOf(reading(6)).inTune).toBe(false);
  });

  it("TASK-17#3 the marked string is the nearest label when a reading is heard", () => {
    expect(displayOf(reading(-20)).label).toBe("A2");
  });

  it("TASK-17#3 no string is marked and the meter is hidden when there is no reliable pitch", () => {
    const display = displayOf({ kind: "none" });
    expect(display.label).toBeUndefined();
    expect(display.position).toBeUndefined();
    expect(display.inTune).toBe(false);
  });
});
