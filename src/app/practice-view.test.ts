import { describe, it, expect } from "vitest";
import type { PlacedNote, Song } from "../modules/practice";
import { mountPractice } from "./practice-view";

// Fake clock: a plain object whose time the test moves by hand.
// pause and resume only count their calls.
function fakeClock(start: number) {
  return {
    time: start,
    pauses: 0,
    resumes: 0,
    now(): number {
      return this.time;
    },
    pause(): void {
      this.pauses += 1;
    },
    resume(): void {
      this.resumes += 1;
    },
  };
}

// Tempo 60 is one beat per 1000 ms. Started at 0, the notes are hit at
// 1000, 2000 and 3000 ms, on strings 1, 2 and 6.
const song: Song = {
  title: "T",
  tempo: 60,
  notes: [
    { string: 1, fret: 0 },
    { string: 2, fret: 3 },
    { string: 6, fret: 0 },
  ],
};

// The y of the first placed note. Fails the test if nothing is placed.
function firstY(placed: readonly PlacedNote[]): number {
  const [first] = placed;
  if (first === undefined) throw new Error("expected a placed note");
  return first.y;
}

describe("practice-view", () => {
  it("TASK-13#1 after Start, each song note falls on its string row and sits on the hit line at its hit time", () => {
    const clock = fakeClock(0);
    const practice = mountPractice([song], clock, 400);
    practice.selectSong(0);
    practice.start();

    clock.time = 1000;
    const placed = practice.frame();

    expect(placed.map((note) => note.row)).toEqual([0, 1, 5]);
    expect(firstY(placed)).toBe(400);
  });

  it("TASK-13#2 Pause freezes the notes, and Resume continues them from the same positions", () => {
    const clock = fakeClock(0);
    const practice = mountPractice([song], clock, 400);
    practice.selectSong(0);
    practice.start();

    clock.time = 500;
    practice.pause();
    const frozen = practice.frame();
    clock.time = 2500;

    expect(practice.frame()).toEqual(frozen);
    expect(clock.pauses).toBe(1);

    practice.resume();

    expect(practice.frame()).toEqual(frozen);
    expect(clock.resumes).toBe(1);

    clock.time = 2800;
    const later = practice.frame();

    expect(later.map((note) => note.row)).toEqual(
      frozen.map((note) => note.row),
    );
    expect(firstY(later)).toBeGreaterThan(firstY(frozen));
  });

  it("TASK-13#3 Faster changes the fall speed, and the notes still sit on the hit line at their hit times", () => {
    const steadyClock = fakeClock(0);
    const steady = mountPractice([song], steadyClock, 400);
    steady.selectSong(0);
    steady.start();

    const clock = fakeClock(0);
    const practice = mountPractice([song], clock, 400);
    practice.selectSong(0);
    practice.start();
    practice.faster();

    // 500 ms before the first hit. Faster covers more pixels per millisecond,
    // so at that time the note is higher on screen (smaller y) than at the
    // steady speed.
    steadyClock.time = 500;
    clock.time = 500;
    expect(firstY(practice.frame())).toBeLessThan(firstY(steady.frame()));

    // At the hit time the note is on the line, at both speeds.
    steadyClock.time = 1000;
    clock.time = 1000;
    expect(firstY(practice.frame())).toBe(400);
    expect(firstY(steady.frame())).toBe(400);
  });

  it("TASK-13#3 Slower after Faster returns the notes to the steady speed", () => {
    const steadyClock = fakeClock(0);
    const steady = mountPractice([song], steadyClock, 400);
    steady.selectSong(0);
    steady.start();

    const clock = fakeClock(0);
    const practice = mountPractice([song], clock, 400);
    practice.selectSong(0);
    practice.start();
    practice.faster();
    practice.slower();

    // 500 ms before the first hit, the note is where it is at the steady speed.
    steadyClock.time = 500;
    clock.time = 500;
    expect(firstY(practice.frame())).toBe(firstY(steady.frame()));
  });
});
