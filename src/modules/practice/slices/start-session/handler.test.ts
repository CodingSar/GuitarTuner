import { describe, it, expect } from "vitest";
import { handler, type NoteSpec } from "./handler";

// Fake clock: a plain object whose time the test moves by hand.
function fakeClock(start: number) {
  return {
    time: start,
    now(): number {
      return this.time;
    },
  };
}

const threeNotes: readonly NoteSpec[] = [
  { string: 1, fret: 0 },
  { string: 2, fret: 3 },
  { string: 3, fret: 2 },
];

describe("start-session", () => {
  it("TASK-6#1 a started session drops each note down the six-string view in sequence order", () => {
    const clock = fakeClock(0);
    const session = handler(threeNotes, clock, 1000);

    expect(
      session.notes.map((note) => ({
        index: note.index,
        string: note.string,
        fret: note.fret,
      })),
    ).toEqual([
      { index: 0, string: 1, fret: 0 },
      { index: 1, string: 2, fret: 3 },
      { index: 2, string: 3, fret: 2 },
    ]);

    const hitTimes = session.notes.map((note) => note.hitTime);
    expect(hitTimes[1]).toBeGreaterThan(hitTimes[0]);
    expect(hitTimes[2]).toBeGreaterThan(hitTimes[1]);
    expect(session.timeToHit(0)).toBe(1000);
  });

  it("TASK-6#2 a paused session freezes the notes and resume continues from the same positions", () => {
    const clock = fakeClock(0);
    const session = handler(threeNotes, clock, 1000);

    clock.time = 500;
    session.pause();
    clock.time = 2500;

    expect(session.timeToHit(0)).toBe(500);
    expect(session.timeToHit(1)).toBe(1500);

    session.resume();

    expect(session.timeToHit(0)).toBe(500);
    expect(session.timeToHit(1)).toBe(1500);

    clock.time = 2800;

    expect(session.timeToHit(0)).toBe(200);
    expect(session.timeToHit(1)).toBe(1200);
  });
});
