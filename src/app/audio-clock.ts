// The audio context the practice view reads its clock from.
export interface ClockContext {
  readonly currentTime: number;
  readonly baseLatency: number;
  readonly outputLatency: number;
  suspend(): Promise<void>;
  resume(): Promise<void>;
}

// The practice clock: note positions, heard time, and pause and resume.
export interface AudioClock {
  now(): number;
  heard(): number;
  pause(): void;
  resume(): void;
}

export function audioClock(context: ClockContext): AudioClock {
  return {
    now: () => context.currentTime * 1000,
    heard: () =>
      (context.currentTime - context.baseLatency - context.outputLatency) * 1000,
    pause: () => {
      void context.suspend();
    },
    resume: () => {
      void context.resume();
    },
  };
}
