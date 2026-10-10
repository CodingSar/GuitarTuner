import type { Song, SongNote } from "../../model";
import { BUNDLED_SONGS } from "../../songs";

// Parses "string/fret" tokens separated by spaces, e.g. "2/1 1/3".
function parseNotes(notes: string): SongNote[] {
  return notes
    .trim()
    .split(/\s+/)
    .map((token) => {
      const [string = 0, fret = 0] = token.split("/").map(Number);
      return { string, fret };
    });
}

export function handler(): readonly Song[] {
  return BUNDLED_SONGS.map((song) => ({
    title: song.title,
    tempo: song.tempo,
    notes: parseNotes(song.notes),
  }));
}
