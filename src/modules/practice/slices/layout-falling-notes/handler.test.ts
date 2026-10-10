import { describe, it, expect } from "vitest";
import { handler, type LayoutNote } from "./handler";

describe("layout-falling-notes", () => {
  it("TASK-13#1 six strings fall down six distinct rows, and a note sits on the hit line at its hit time and above it before", () => {
    // Strings 1 to 5 are hit at now. String 6 is hit 500 ms later, so it is above the line.
    const notes: readonly LayoutNote[] = [
      { string: 1, fret: 0, hitTime: 1000 },
      { string: 2, fret: 3, hitTime: 1000 },
      { string: 3, fret: 2, hitTime: 1000 },
      { string: 4, fret: 2, hitTime: 1000 },
      { string: 5, fret: 3, hitTime: 1000 },
      { string: 6, fret: 0, hitTime: 1500 },
    ];

    expect(handler(notes, 1000, 0.2, 400)).toEqual([
      { row: 0, y: 400, fret: 0 },
      { row: 1, y: 400, fret: 3 },
      { row: 2, y: 400, fret: 2 },
      { row: 3, y: 400, fret: 2 },
      { row: 4, y: 400, fret: 3 },
      { row: 5, y: 300, fret: 0 },
    ]);
  });

  it("TASK-13#3 two fall speeds put a note on the hit line at its hit time, and at 500 ms before it the notes are at different heights", () => {
    const notes: readonly LayoutNote[] = [{ string: 1, fret: 0, hitTime: 1000 }];

    expect(handler(notes, 1000, 0.15, 400)[0]?.y).toBe(400);
    expect(handler(notes, 1000, 0.3, 400)[0]?.y).toBe(400);

    expect(handler(notes, 500, 0.15, 400)[0]?.y).toBe(325);
    expect(handler(notes, 500, 0.3, 400)[0]?.y).toBe(250);
  });
});
