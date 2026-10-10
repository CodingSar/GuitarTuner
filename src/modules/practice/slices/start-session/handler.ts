// The clock is an I/O port, injected in milliseconds. The session keeps no
// audio and stores nothing. String 1 is the high E; fret is 0 or more.
export interface NoteSpec {
  readonly string: number;
  readonly fret: number;
}

export interface Clock {
  now(): number;
}

interface FallingNote {
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

const LEAD_IN_MS = 3000;

export function handler(
  sequence: readonly NoteSpec[],
  clock: Clock,
  stepMs: number,
): PracticeSession {
  const startTime = clock.now();
  const notes: readonly FallingNote[] = sequence.map((spec, index) => ({
    index,
    string: spec.string,
    fret: spec.fret,
    hitTime: startTime + LEAD_IN_MS + index * stepMs,
  }));

  let pausedTotal = 0;
  let pausedAt: number | undefined;

  const audioNow = (): number => {
    const now = pausedAt === undefined ? clock.now() : pausedAt;
    return now - pausedTotal;
  };

  return {
    notes,
    timeToHit(index: number): number {
      const note = notes[index];
      if (note === undefined) {
        throw new RangeError(`no note at index ${index}`);
      }
      return note.hitTime - audioNow();
    },
    pause(): void {
      if (pausedAt === undefined) {
        pausedAt = clock.now();
      }
    },
    resume(): void {
      if (pausedAt !== undefined) {
        pausedTotal += clock.now() - pausedAt;
        pausedAt = undefined;
      }
    },
  };
}
