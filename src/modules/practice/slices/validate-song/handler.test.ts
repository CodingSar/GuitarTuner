import { describe, it, expect } from "vitest";
import { handler } from "./handler";
import type { Song, SongNote } from "../../model";

// Builds a song whose notes are the given list; title and tempo are fixed.
function songWith(notes: readonly SongNote[]): Song {
  return { title: "Test", tempo: 120, notes };
}

describe("validate-song", () => {
  it("TASK-12#2 a song whose notes are all in range passes validation", () => {
    const song = songWith([
      { string: 1, fret: 0 },
      { string: 2, fret: 3 },
      { string: 6, fret: 24 },
    ]);

    expect(handler(song)).toEqual({ ok: true });
  });

  it("TASK-12#2 GIVEN a note with a string outside 1-6 WHEN the song is validated THEN validation fails and names the note index", () => {
    const song = songWith([
      { string: 1, fret: 0 },
      { string: 2, fret: 3 },
      { string: 7, fret: 2 },
    ]);

    const result = handler(song);

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("expected validation to fail");
    }
    expect(result.noteIndex).toBe(2);
    expect(result.message).toContain("2");
  });

  it("TASK-12#2 GIVEN a note with a string of 0 WHEN the song is validated THEN validation fails and names the note index", () => {
    const song = songWith([
      { string: 1, fret: 0 },
      { string: 0, fret: 0 },
    ]);

    const result = handler(song);

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("expected validation to fail");
    }
    expect(result.noteIndex).toBe(1);
    expect(result.message).toContain("1");
  });

  it("TASK-12#2 GIVEN a note with a fret outside 0-24 WHEN the song is validated THEN validation fails and names the note index", () => {
    const song = songWith([
      { string: 1, fret: 25 },
      { string: 2, fret: 3 },
    ]);

    const result = handler(song);

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("expected validation to fail");
    }
    expect(result.noteIndex).toBe(0);
    expect(result.message).toContain("0");
  });
});
