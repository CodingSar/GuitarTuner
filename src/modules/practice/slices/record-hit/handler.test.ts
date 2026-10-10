import { describe, it, expect } from "vitest";
import { handler, type JudgedNote, type PlayedInput } from "./handler";

const WINDOW_MS = 100;

const note: JudgedNote = { string: 1, fret: 0, hitTime: 1000 };

describe("record-hit", () => {
  it("TASK-7#1 a note falling through the hit line is recorded as hit when the right string and fret are played within the timing window", () => {
    const inputs: readonly PlayedInput[] = [{ string: 1, fret: 0, time: 1050 }];

    expect(handler(note, inputs, WINDOW_MS, 1050)).toBe("hit");
  });

  it("TASK-7#2 a note that passes the hit line with no matching input inside the timing window is marked missed", () => {
    const inputs: readonly PlayedInput[] = [];

    expect(handler(note, inputs, WINDOW_MS, 1200)).toBe("missed");
  });
});
