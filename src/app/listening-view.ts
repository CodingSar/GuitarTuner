import type { MicSource } from "../modules/tuner";

// A clickable control on the tuner page. The page keeps only what it shows.
export interface Control {
  hidden: boolean;
  onClick(fn: () => void): void;
}

// The parts of the tuner page the listening view writes to and reads from.
export interface ListeningView {
  status: { textContent: string | null };
  start: Control;
  stop: Control;
  readout: { hidden: boolean };
}

// Wires the Start and Stop controls to the tuner's listening slice.
export function mountListening(view: ListeningView, mic: MicSource): void {
  throw new Error("not implemented");
}
