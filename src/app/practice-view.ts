import type { PlacedNote, Song } from "../modules/practice";

// The audio clock the practice view runs on. now() is in milliseconds.
export interface PracticeClock {
  now(): number;
  pause(): void;
  resume(): void;
}

// What the practice page calls: pick a song, run it, adjust the fall speed,
// and read the notes to draw.
export interface PracticeController {
  selectSong(index: number): void;
  start(): void;
  pause(): void;
  resume(): void;
  slower(): void;
  faster(): void;
  frame(): readonly PlacedNote[];
}

export function mountPractice(
  songs: readonly Song[],
  clock: PracticeClock,
  hitLineY: number,
): PracticeController {
  throw new Error("not implemented");
}
