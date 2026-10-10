import { describe, it, expect } from "vitest";
import type { Judgment } from "../record-hit/handler";
import { handler } from "./handler";

describe("tally-judgments", () => {
  it("TASK-18#1 hits and missed are counted from the hit and missed judgments, and pending ones are not counted", () => {
    const judgments: readonly Judgment[] = [
      "hit",
      "missed",
      "hit",
      "pending",
      "hit",
    ];

    const tally = handler(judgments);

    expect(tally.hits).toBe(3);
    expect(tally.missed).toBe(1);
  });

  it("TASK-18#1 streak is the trailing run of hits, and pending entries are skipped while counting it", () => {
    const judgments: readonly Judgment[] = [
      "missed",
      "hit",
      "pending",
      "hit",
      "hit",
      "pending",
    ];

    expect(handler(judgments).streak).toBe(3);
  });

  it("TASK-18#1 a miss resets the streak to 0", () => {
    const judgments: readonly Judgment[] = ["hit", "hit", "hit", "missed"];

    expect(handler(judgments).streak).toBe(0);
  });

  it("TASK-18#1 empty input gives zero hits, zero missed and a streak of 0", () => {
    expect(handler([])).toEqual({ hits: 0, missed: 0, streak: 0 });
  });
});
