import type { Song, SongNote } from "../../model";

export function handler(song: Song): {
  readonly sequence: readonly SongNote[];
  readonly stepMs: number;
} {
  throw new Error("not implemented");
}
