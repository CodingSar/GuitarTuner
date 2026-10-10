// Sample source the browser hands over for reading.
export interface MicAnalysis {
  readonly sampleRate: number;
  samples(): Float32Array;
}

// The browser microphone is an I/O port. The handler keeps the open stream
// and no audio.
export interface MicStream {
  release(): void;
  // Optional so a stream without analysis, such as the test fakes, still works.
  readonly analysis?: MicAnalysis;
}

export interface MicSource {
  open(): Promise<MicStream>;
}

export type ListeningState = "idle" | "pending" | "listening" | "denied";

export interface Listener {
  readonly state: ListeningState;
  readonly ready: Promise<void>;
  stop(): void;
}

export function handler(
  mic: MicSource,
  onState: (state: ListeningState) => void,
): Listener {
  let state: ListeningState = "pending";
  let stopped = false;
  let stream: MicStream | undefined;

  const set = (next: ListeningState) => {
    state = next;
    onState(next);
  };

  set("pending");

  const ready = mic.open().then(
    (opened) => {
      if (stopped) {
        opened.release();
        return;
      }
      stream = opened;
      set("listening");
    },
    (error: unknown) => {
      if ((error as Error | undefined)?.name !== "NotAllowedError") throw error;
      set("denied");
    },
  );

  return {
    get state() {
      return state;
    },
    ready,
    stop() {
      stopped = true;
      stream?.release();
      stream = undefined;
      set("idle");
    },
  };
}
