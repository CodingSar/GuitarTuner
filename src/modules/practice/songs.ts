// Song data for the list-songs slice. Data only: later songs are added here.
// Notes are written as "string/fret" tokens, space-separated, on standard
// tuning. String 1 is the high E. The list-songs handler parses them.
export interface SongData {
  readonly title: string;
  readonly tempo: number;
  readonly notes: string;
}

// Bundled public-domain songs, hand-entered as note sequences.
export const BUNDLED_SONGS: readonly SongData[] = [
  {
    title: "Twinkle Twinkle Little Star",
    tempo: 100,
    notes: "2/1 2/1 1/3 1/3 1/5 1/5 1/3 1/1 1/1 1/0 1/0 2/3 2/3 2/1",
  },
  {
    title: "Ode to Joy",
    tempo: 108,
    notes: "1/0 1/0 1/1 1/3 1/3 1/1 1/0 2/3 2/1 2/1 2/3 1/0 1/0 2/3 2/3",
  },
  {
    title: "Frere Jacques",
    tempo: 100,
    notes:
      "2/1 2/3 1/0 2/1 2/1 2/3 1/0 2/1 1/0 1/1 1/3 1/0 1/1 1/3 1/3 1/5 1/3 1/1 1/0 2/1 1/3 1/5 1/3 1/1 1/0 2/1 2/1 3/0 2/1 2/1 3/0 2/1",
  },
];
