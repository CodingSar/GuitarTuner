import {
  layoutFallingNotes,
  mapPitch,
  recordHit,
  setFallSpeed,
  startSession,
  tallyJudgments,
  toPractice,
  type Judgment,
  type PlacedNote,
  type PlayedInput,
  type PracticeSession,
  type Song,
  type Tally,
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
  hear(hz: number, openHz: readonly number[]): void;
  judgments(): readonly Judgment[];
  tally(): Tally;
}

type Direction = "slow" | "fast";

// Judging window in milliseconds on either side of a note's hit time.
const WINDOW_MS = 150;

// The note in the session whose hit time is nearest t, or undefined if none.
function nearestNote(
  session: PracticeSession,
  t: number,
): { readonly string: number; readonly fret: number } | undefined {
  let best: PracticeSession["notes"][number] | undefined;
  let bestGap = Infinity;
  for (const note of session.notes) {
    const gap = Math.abs(note.hitTime - t);
    if (gap < bestGap) {
      best = note;
      bestGap = gap;
    }
  }
  return best;
}

export function mountPractice(
  songs: readonly Song[],
  clock: PracticeClock,
  hitLineY: number,
): PracticeController {
  const fall = setFallSpeed({ slowPerMs: 0.15, fastPerMs: 0.3, rampMs: 500 });
  let chosen: Song | undefined;
  // The index of the chosen song, and the index of the song that Start played.
  let chosenIndex: number | undefined;
  let playingIndex: number | undefined;
  let session: PracticeSession | undefined;
  let direction: Direction = "slow";
  // Pitches heard so far, as string and fret, with the audio time they came in.
  const inputs: PlayedInput[] = [];

  // The session's audio time. It freezes with the session on pause, so the
  // view freezes with or without a stopped clock. 0 before Start.
  function audioTime(): number {
    if (session === undefined) return 0;
    const first = session.notes[0];
    if (first === undefined) return 0;
    return first.hitTime - session.timeToHit(0);
  }

  const controller: PracticeController = {
    selectSong(index: number): void {
      chosen = songs[index];
      chosenIndex = index;
    },
    start(): void {
      if (chosen === undefined) return;
      const { sequence, stepMs } = toPractice(chosen);
      session = startSession(sequence, clock, stepMs);
      inputs.length = 0;
      playingIndex = chosenIndex;
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
        fret: note.fret,
        hitTime: note.hitTime,
      }));
      const t = audioTime();
      return layoutFallingNotes(notes, t, fall.speedAt(t), hitLineY);
    },
    hear(hz: number, openHz: readonly number[]): void {
      if (session === undefined) return;
      const t = audioTime();
      const candidate = mapPitch(hz, openHz, nearestNote(session, t));
      if (candidate === undefined) return;
      inputs.push({ string: candidate.string, fret: candidate.fret, time: t });
    },
    judgments(): readonly Judgment[] {
      if (session === undefined) return [];
      const t = audioTime();
      return session.notes.map((note) => recordHit(note, inputs, WINDOW_MS, t));
    },
    tally(): Tally {
      // Zeros unless the song being played is the one chosen now.
      if (playingIndex !== chosenIndex) {
        return { hits: 0, missed: 0, streak: 0 };
      }
      return tallyJudgments(controller.judgments());
    },
  };
  return controller;
}
