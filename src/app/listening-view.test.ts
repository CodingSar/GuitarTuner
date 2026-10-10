import { describe, it, expect } from "vitest";
import type { MicSource, MicStream } from "../modules/tuner";
import { mountListening } from "./listening-view";
import type { Control, ListeningView } from "./listening-view";

// Fake browser microphone. open() returns a promise the test settles.
function fakeMic() {
  let resolveOpen: (stream: MicStream) => void = () => {};
  let rejectOpen: (reason: Error) => void = () => {};
  const opened = new Promise<MicStream>((resolve, reject) => {
    resolveOpen = resolve;
    rejectOpen = reject;
  });
  let releases = 0;
  const source: MicSource = { open: () => opened };
  return {
    source,
    grant: () => {
      resolveOpen({
        release: () => {
          releases += 1;
        },
      });
    },
    deny: () => {
      const error = new Error("microphone access denied");
      error.name = "NotAllowedError";
      rejectOpen(error);
    },
    // Resolves after the open promise has settled and the view has reacted.
    settled: () => opened.then(() => undefined, () => undefined),
    releases: () => releases,
  };
}

type FakeControl = Control & { click: () => void };

// Fake control. onClick stores the handler so the test can press it.
function fakeControl(hidden: boolean): FakeControl {
  let handler: (() => void) | undefined;
  return {
    hidden,
    onClick: (fn: () => void) => {
      handler = fn;
    },
    click: () => {
      if (handler === undefined) throw new Error("control has no click handler");
      handler();
    },
  };
}

function fakeView() {
  const status: { textContent: string | null } = { textContent: null };
  const start = fakeControl(true);
  const stop = fakeControl(true);
  const readout = { hidden: true };
  const view: ListeningView = { status, start, stop, readout };
  return { view, status, start, stop, readout };
}

describe("listening view", () => {
  it("TASK-11#1 status reads Idle and a Start listening control is shown after the tuner starts", () => {
    const { view, status, start } = fakeView();
    mountListening(view, fakeMic().source);
    expect(status.textContent).toBe("Idle");
    expect(start.hidden).toBe(false);
  });

  it("TASK-11#2 status reads Waiting for microphone permission when Start listening is pressed before the microphone is granted", () => {
    const { view, status, start } = fakeView();
    mountListening(view, fakeMic().source);
    start.click();
    expect(status.textContent).toBe("Waiting for microphone permission");
  });

  it("TASK-11#3 status reads Microphone access denied and no pitch readout appears when the player has denied microphone access", async () => {
    const { view, status, start, readout } = fakeView();
    const mic = fakeMic();
    mountListening(view, mic.source);
    mic.deny();
    start.click();
    await mic.settled();
    expect(status.textContent).toBe("Microphone access denied");
    expect(readout.hidden).toBe(true);
  });

  it("TASK-11#4 status reads Idle and the microphone is released when the player presses Stop while listening is running", async () => {
    const { view, status, start, stop } = fakeView();
    const mic = fakeMic();
    mountListening(view, mic.source);
    start.click();
    mic.grant();
    await mic.settled();
    stop.click();
    expect(status.textContent).toBe("Idle");
    expect(mic.releases()).toBe(1);
  });
});
