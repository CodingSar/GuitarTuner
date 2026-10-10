import { describe, it, expect } from "vitest";
import { handler } from "./handler";

// Open strings in Hz, standard tuning. Index 0 is string 1 (high E E4),
// index 5 is string 6 (low E E2).
const openHz = [329.63, 246.94, 196.0, 146.83, 110.0, 82.41];

describe("map-pitch", () => {
  it("TASK-14#1 a pitch within 50 cents of a fret on a string is passed as that string and fret", () => {
    // 92.50 Hz is string 6 fret 2 (F#2). No other fret is within 50 cents.
    expect(handler(92.5, openHz)).toEqual({ string: 6, fret: 2 });
  });

  it("TASK-14#1 a tied pitch maps to the preferred candidate when it is one of the tied positions", () => {
    // 329.63 Hz is E4: string 1 fret 0 and string 2 fret 5 are both within 50 cents.
    expect(handler(329.63, openHz, { string: 2, fret: 5 })).toEqual({
      string: 2,
      fret: 5,
    });
  });

  it("TASK-14#2 a detected pitch more than 50 cents from every fret is ignored", () => {
    // 60 Hz is below open E2 (82.41 Hz), the lowest fret on any string.
    expect(handler(60, openHz)).toBeUndefined();
  });
});
