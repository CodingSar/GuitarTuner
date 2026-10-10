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
  readonly ready: Promise<void>;
  stop(): void;
}

export function handler(
  mic: MicSource,
  onState: (state: ListeningState) => void,
): Listener {
  throw new Error("not implemented");
}
