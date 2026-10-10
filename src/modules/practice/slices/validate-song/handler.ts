import type { Song } from "../../model";

export type ValidationResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly noteIndex: number;
      readonly message: string;
    };

function isIntegerIn(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

export function handler(song: Song): ValidationResult {
  if (song.title === "") {
    return { ok: false, noteIndex: -1, message: "title must not be empty" };
  }
  if (!(song.tempo > 0)) {
    return { ok: false, noteIndex: -1, message: "tempo must be greater than 0" };
  }
  for (const [noteIndex, note] of song.notes.entries()) {
    if (!isIntegerIn(note.string, 1, 6)) {
      return {
        ok: false,
        noteIndex,
        message: `note ${noteIndex}: string must be an integer 1-6`,
      };
    }
    if (!isIntegerIn(note.fret, 0, 24)) {
      return {
        ok: false,
        noteIndex,
        message: `note ${noteIndex}: fret must be an integer 0-24`,
      };
    }
  }
  return { ok: true };
}
