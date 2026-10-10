import { startListening } from "../modules/tuner";
import type { Listener, ListeningState, MicSource } from "../modules/tuner";

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

const statusText: Record<ListeningState, string> = {
  idle: "Idle",
  pending: "Waiting for microphone permission",
  listening: "Listening",
  denied: "Microphone access denied",
};

// Wires the Start and Stop controls to the tuner's listening slice.
export function mountListening(view: ListeningView, mic: MicSource): void {
  let listener: Listener | undefined;

  const render = (state: ListeningState): void => {
    view.status.textContent = statusText[state];
    view.start.hidden = !(state === "idle" || state === "denied");
    view.stop.hidden = !(state === "pending" || state === "listening");
    view.readout.hidden = true;
  };

  view.start.onClick(() => {
    listener = startListening(mic, render);
  });
  view.stop.onClick(() => {
    listener?.stop();
  });

  render("idle");
}
