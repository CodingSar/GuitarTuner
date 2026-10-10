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
  it("TASK-19#1 the first note reaches the hit line 3000 ms after Start, whatever the tempo", () => {
    const slow = handler(threeNotes, fakeClock(0), 1000);
    const fast = handler(threeNotes, fakeClock(0), 500);

    expect(slow.timeToHit(0)).toBe(3000);
    expect(fast.timeToHit(0)).toBe(3000);
  });

  it("TASK-19#2 each later note reaches the hit line one step after the note before it", () => {
    const clock = fakeClock(0);
    const session = handler(threeNotes, clock, 500);

    expect(session.timeToHit(0)).toBe(3000);
    expect(session.timeToHit(1)).toBe(3500);
    expect(session.timeToHit(2)).toBe(4000);
  });

  it("TASK-19#3 a session paused during the lead-in resumes with the lead-in left at the pause and no time lost", () => {
    const clock = fakeClock(0);
    const session = handler(threeNotes, clock, 1000);

    clock.time = 1000;
    session.pause();
    clock.time = 5000;
    session.resume();

    expect(session.timeToHit(0)).toBe(2000);

    clock.time = 5500;

    expect(session.timeToHit(0)).toBe(1500);
  });
});
