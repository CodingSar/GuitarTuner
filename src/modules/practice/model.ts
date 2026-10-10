// Song data shared by the list-songs, validate-song, and to-practice slices.
// String 1 is the high E; fret is 0 or more. Types only.
export interface SongNote {
  readonly string: number;
  readonly fret: number;
}

export interface Song {
  readonly title: string;
  readonly tempo: number;
  readonly notes: readonly SongNote[];
}
