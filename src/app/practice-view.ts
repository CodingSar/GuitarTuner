import {
  layoutFallingNotes,
  setFallSpeed,
  startSession,
  toPractice,
  type PlacedNote,
  type PracticeSession,
  type Song,
} from "../modules/practice";

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

type Direction = "slow" | "fast";

export function mountPractice(
  songs: readonly Song[],
  clock: PracticeClock,
  hitLineY: number,
): PracticeController {
  const fall = setFallSpeed({ slowPerMs: 0.15, fastPerMs: 0.3, rampMs: 500 });
  let chosen: Song | undefined;
  let session: PracticeSession | undefined;
  let direction: Direction = "slow";

  // The session's audio time. It freezes with the session on pause, so the
  // view freezes with or without a stopped clock. 0 before Start.
  function audioTime(): number {
    if (session === undefined) return 0;
    const first = session.notes[0];
    if (first === undefined) return 0;
    return first.hitTime - session.timeToHit(0);
  }

  return {
    selectSong(index: number): void {
      chosen = songs[index];
    },
    start(): void {
      if (chosen === undefined) return;
      const { sequence, stepMs } = toPractice(chosen);
      session = startSession(sequence, clock, stepMs);
    },
    pause(): void {
      session?.pause();
      clock.pause();
    },
    resume(): void {
      session?.resume();
      clock.resume();
    },
    slower(): void {
      if (direction !== "fast") return;
      fall.toggle(audioTime());
      direction = "slow";
    },
    faster(): void {
      if (direction !== "slow") return;
      fall.toggle(audioTime());
      direction = "fast";
    },
    frame(): readonly PlacedNote[] {
      if (session === undefined) return [];
      const notes = session.notes.map((note) => ({
        string: note.string,
        hitTime: note.hitTime,
      }));
      const t = audioTime();
      return layoutFallingNotes(notes, t, fall.speedAt(t), hitLineY);
    },
  };
}
