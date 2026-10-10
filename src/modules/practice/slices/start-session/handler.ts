// The clock is an I/O port, injected in milliseconds. The session keeps no
// audio and stores nothing. String 1 is the high E; fret is 0 or more.
export interface NoteSpec {
  readonly string: number;
  readonly fret: number;
}

export interface Clock {
  now(): number;
}

export interface FallingNote {
  readonly index: number;
  readonly string: number;
  readonly fret: number;
  readonly hitTime: number;
}

export interface PracticeSession {
  readonly notes: readonly FallingNote[];
  timeToHit(index: number): number;
  pause(): void;
  resume(): void;
}

export function handler(
  sequence: readonly NoteSpec[],
  clock: Clock,
  stepMs: number,
): PracticeSession {
  throw new Error("not implemented");
}
