import { readPitch, startListening } from "../modules/tuner";
import type {
  Listener,
  ListeningState,
  MicSource,
  MicStream,
} from "../modules/tuner";
import { describeReading } from "./pitch-readout";
import {
  DEFAULT_REFERENCE_HZ,
  selectPreset,
  targetsFor,
} from "../modules/tuning";
import type { Target } from "../modules/tuning";

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
  readout: { hidden: boolean; textContent: string | null };
}

const statusText: Record<ListeningState, string> = {
  idle: "Idle",
  pending: "Waiting for microphone permission",
  listening: "Listening",
  denied: "Microphone access denied",
  "no-device": "No microphone found",
  "constraint-failed": "Microphone constraints cannot be met",
};

// What the page can use for microphone capture.
export interface ListeningSupport {
  readonly secure: boolean;
  readonly mediaDevices: boolean;
}

// Reads the page's microphone support from the browser.
function detectSupport(): ListeningSupport {
  return {
    secure: globalThis.isSecureContext === true,
    mediaDevices: globalThis.navigator?.mediaDevices !== undefined,
  };
}

// Wires the Start and Stop controls to the tuner's listening slice.
export function mountListening(
  view: ListeningView,
  mic: MicSource,
  schedule: (frame: () => void) => void = (frame) => {
    requestAnimationFrame(frame);
  },
  targets: () => readonly Target[] = () =>
    targetsFor(selectPreset(), DEFAULT_REFERENCE_HZ),
  support: ListeningSupport = detectSupport(),
): void {
  const canStart = support.secure && support.mediaDevices;
  let listener: Listener | undefined;
  // The most recently opened stream, and whether the reading loop runs.
  let opened: MicStream | undefined;
  let running = false;
  // Bumped on each Start and Stop click, so a stale scheduled tick stops.
  let generation = 0;

  // Keeps the stream the browser hands over so the loop can read it.
  const tapped: MicSource = {
    open: async () => {
      const stream = await mic.open();
      opened = stream;
      return stream;
    },
  };

  // Reads the nearest string once per frame while listening.
  const tick = (gen: number): void => {
    const analysis = opened?.analysis;
    if (gen !== generation || !running || analysis === undefined) return;
    const reading = readPitch(
      analysis.samples(),
      analysis.sampleRate,
      targets(),
    );
    view.readout.textContent = describeReading(reading);
    view.readout.hidden = false;
    schedule(() => tick(gen));
  };

  const render = (state: ListeningState): void => {
    view.status.textContent = statusText[state];
    view.start.hidden =
      !canStart ||
      !(
        state === "idle" ||
        state === "denied" ||
        state === "no-device" ||
        state === "constraint-failed"
      );
    view.stop.hidden = !(state === "pending" || state === "listening");
    if (state !== "listening") view.readout.hidden = true;
    // Start the loop only when there is a stream to read.
    if (state === "listening" && opened?.analysis) {
      running = true;
      const gen = generation;
      schedule(() => tick(gen));
    }
  };

  view.start.onClick(() => {
    if (!canStart) return;
    generation += 1;
    listener = startListening(tapped, render);
  });
  view.stop.onClick(() => {
    generation += 1;
    listener?.stop();
    running = false;
    opened = undefined;
  });

  render("idle");
}
