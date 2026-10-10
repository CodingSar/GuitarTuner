import { describe, it, expect } from "vitest";
import { handler } from "./handler";
import type { Song } from "../../model";

const song: Song = {
  title: "Test",
  tempo: 120,
  notes: [
    { string: 1, fret: 0 },
    { string: 2, fret: 3 },
    { string: 3, fret: 2 },
  ],
};

describe("to-practice", () => {
  it("TASK-12#3 GIVEN a valid song WHEN it is converted for practice THEN it becomes the note sequence and step length the start-session handler accepts", () => {
    const practice = handler(song);

    expect(practice.sequence).toEqual([
      { string: 1, fret: 0 },
      { string: 2, fret: 3 },
      { string: 3, fret: 2 },
    ]);
    expect(practice.stepMs).toBe(500);
  });

  it("TASK-20#2 GIVEN the player chose a whole-number BPM of 90 WHEN the song is converted for practice THEN the step length is 60000 divided by 90 ms", () => {
    const practice = handler(song, 90);

    expect(practice.stepMs).toBe(60000 / 90);
  });
});
