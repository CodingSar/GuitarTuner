import type { Song, SongNote } from "../../model";

export function handler(
  song: Song,
  tempo?: number,
): {
  readonly sequence: readonly SongNote[];
  readonly stepMs: number;
} {
  return { sequence: song.notes, stepMs: 60000 / song.tempo };
}
