// The browser microphone is an I/O port. The handler keeps the open stream
// and no audio.
export interface MicStream {
  release(): void;
}

export interface MicSource {
  open(): Promise<MicStream>;
}

export type ListeningState = "idle" | "pending" | "listening" | "denied";

export interface Listener {
  readonly state: ListeningState;
  stop(): void;
}

export function handler(
  mic: MicSource,
  onState: (state: ListeningState) => void,
): Promise<Listener> {
  let state: ListeningState = "pending";
  let stream: MicStream | undefined;
  onState(state);

  const set = (next: ListeningState) => {
    state = next;
    onState(next);
  };

  return mic.open().then(
    (opened) => {
      stream = opened;
      set("listening");
      return {
        get state() {
          return state;
        },
        stop() {
          stream?.release();
          stream = undefined;
          set("idle");
        },
      };
    },
    (error: unknown) => {
      if ((error as Error | undefined)?.name !== "NotAllowedError") throw error;
      set("denied");
      return {
        get state() {
          return state;
        },
        stop() {
          set("idle");
        },
      };
    },
  );
}
