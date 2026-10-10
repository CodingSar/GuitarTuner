import { describe, it, expect } from "vitest";
import { handler } from "./handler";

describe("list-songs", () => {
  it("TASK-12#1 GIVEN the app ships WHEN the song list loads THEN it contains at least three public-domain songs, each with a title, a tempo, and a note sequence", () => {
    const songs = handler();

    expect(songs.length).toBeGreaterThanOrEqual(3);
    for (const song of songs) {
      expect(song.title.length).toBeGreaterThan(0);
      expect(song.tempo).toBeGreaterThan(0);
      expect(song.notes.length).toBeGreaterThan(0);
      for (const note of song.notes) {
        expect(Number.isInteger(note.string)).toBe(true);
        expect(note.string).toBeGreaterThanOrEqual(1);
        expect(note.string).toBeLessThanOrEqual(6);
        expect(Number.isInteger(note.fret)).toBe(true);
        expect(note.fret).toBeGreaterThanOrEqual(0);
        expect(note.fret).toBeLessThanOrEqual(24);
      }
    }
  });
});
