import { describe, it, expect } from "vitest";
import type { MicSource, MicStream, Target } from "../modules/tuner";
import { mountListening } from "./listening-view";
import type { Control, ListeningView } from "./listening-view";

// A page with secure context and navigator.mediaDevices, so start is shown.
const supported = { secure: true, mediaDevices: true };

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
    grant: (stream?: MicStream) => {
      resolveOpen(
        stream ?? {
          release: () => {
            releases += 1;
          },
        },
      );
    },
    deny: () => {
      const error = new Error("microphone access denied");
      error.name = "NotAllowedError";
      rejectOpen(error);
    },
    // Resolves after the open promise has settled and the view has reacted.
    settled: () =>
      opened.then(
        () => undefined,
        () => undefined,
      ),
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
      if (handler === undefined)
        throw new Error("control has no click handler");
      handler();
    },
  };
}

function fakeView() {
  const status: { textContent: string | null } = { textContent: null };
  const start = fakeControl(true);
  const stop = fakeControl(true);
  const readout = { hidden: true, textContent: null as string | null };
  const view: ListeningView = { status, start, stop, readout };
  return { view, status, start, stop, readout };
}

// A steady sine at the given frequency, sampled at 44100 Hz.
function sine(hz: number, length: number): Float32Array {
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    samples[i] = Math.sin((2 * Math.PI * hz * i) / 44100);
  }
  return samples;
}

describe("listening view", () => {
  it("TASK-11#1 status reads Idle and a Start listening control is shown after the tuner starts", () => {
    const { view, status, start } = fakeView();
    mountListening(view, fakeMic().source, undefined, undefined, supported);
    expect(status.textContent).toBe("Idle");
    expect(start.hidden).toBe(false);
  });

  it("TASK-11#2 status reads Waiting for microphone permission when Start listening is pressed before the microphone is granted", () => {
    const { view, status, start } = fakeView();
    mountListening(view, fakeMic().source, undefined, undefined, supported);
    start.click();
    expect(status.textContent).toBe("Waiting for microphone permission");
  });

  it("TASK-11#3 status reads Microphone access denied and no pitch readout appears when the player has denied microphone access", async () => {
    const { view, status, start, readout } = fakeView();
    const mic = fakeMic();
    mountListening(view, mic.source, undefined, undefined, supported);
    mic.deny();
    start.click();
    await mic.settled();
    expect(status.textContent).toBe("Microphone access denied");
    expect(readout.hidden).toBe(true);
  });

  it("TASK-11#4 status reads Idle and the microphone is released when the player presses Stop while listening is running", async () => {
    const { view, status, start, stop } = fakeView();
    const mic = fakeMic();
    mountListening(view, mic.source, undefined, undefined, supported);
    start.click();
    mic.grant();
    await mic.settled();
    stop.click();
    expect(status.textContent).toBe("Idle");
    expect(mic.releases()).toBe(1);
  });

  it("TASK-5#1 the readout shows the nearest string when a steady tone is heard", async () => {
    const { view, start, readout } = fakeView();
    const mic = fakeMic();
    const frames: Array<() => void> = [];
    mountListening(
      view,
      mic.source,
      (frame) => {
        frames.push(frame);
      },
      undefined,
      supported,
    );
    start.click();
    mic.grant({
      release: () => {},
      analysis: { sampleRate: 44100, samples: () => sine(110, 4096) },
    } as MicStream);
    await mic.settled();
    frames.at(-1)?.();
    expect(readout.textContent).toContain("A2");
  });

  it("TASK-2#2 the readout names D2 when a steady 73.42 Hz tone is heard with drop D selected", async () => {
    const { view, start, readout } = fakeView();
    const mic = fakeMic();
    const frames: Array<() => void> = [];
    const dropD: readonly Target[] = [
      { label: "D2", hz: 73.42 },
      { label: "A2", hz: 110 },
      { label: "D3", hz: 146.83 },
      { label: "G3", hz: 196 },
      { label: "B3", hz: 246.94 },
      { label: "E4", hz: 329.63 },
    ];
    mountListening(
      view,
      mic.source,
      (frame) => {
        frames.push(frame);
      },
      () => dropD,
      supported,
    );
    start.click();
    mic.grant({
      release: () => {},
      analysis: { sampleRate: 44100, samples: () => sine(73.42, 4096) },
    } as MicStream);
    await mic.settled();
    frames.at(-1)?.();
    expect(readout.textContent).toMatch(/^D2/);
  });
});

// Fake browser microphone whose open() fails with an error of the given name.
function failingMic(name: string) {
  let rejectOpen: (reason: Error) => void = () => {};
  const opened = new Promise<MicStream>((_resolve, reject) => {
    rejectOpen = reject;
  });
  const source: MicSource = { open: () => opened };
  return {
    source,
    fail: () => {
      const error = new Error("microphone unavailable");
      error.name = name;
      rejectOpen(error);
    },
    // Resolves after the open promise has settled and the view has reacted.
    settled: () =>
      opened.then(
        () => undefined,
        () => undefined,
      ),
  };
}

// Fake browser microphone that counts open() calls. Its open never settles.
function countingMic() {
  let opens = 0;
  const source: MicSource = {
    open: () => {
      opens += 1;
      return new Promise<MicStream>(() => {});
    },
  };
  return { source, opens: () => opens };
}

const noSchedule = (): void => {};
const noTargets = (): readonly Target[] => [];

describe("listening view (TASK-10)", () => {
  it("TASK-10#10 Microphone capture starts only in a secure context, and the start control appears only when navigator.mediaDevices exists", () => {
    // Not a secure context: start stays hidden and a click does not open the mic.
    const insecure = fakeView();
    const insecureMic = countingMic();
    mountListening(insecure.view, insecureMic.source, noSchedule, noTargets, {
      secure: false,
      mediaDevices: true,
    });
    expect(insecure.start.hidden).toBe(true);
    insecure.start.click();
    expect(insecureMic.opens()).toBe(0);

    // No navigator.mediaDevices: start stays hidden.
    const noDevices = fakeView();
    mountListening(
      noDevices.view,
      countingMic().source,
      noSchedule,
      noTargets,
      { secure: true, mediaDevices: false },
    );
    expect(noDevices.start.hidden).toBe(true);

    // Secure context with navigator.mediaDevices: start is shown.
    const ready = fakeView();
    mountListening(
      ready.view,
      countingMic().source,
      noSchedule,
      noTargets,
      supported,
    );
    expect(ready.start.hidden).toBe(false);
  });

  it("TASK-10#11 Pending, denied (NotAllowedError), no device (NotFoundError) and constraint failure (OverconstrainedError) are separate states, no device (NotFoundError) case", async () => {
    const { view, status, start } = fakeView();
    const mic = failingMic("NotFoundError");
    mountListening(view, mic.source, noSchedule, noTargets, supported);
    mic.fail();
    start.click();
    await mic.settled();
    expect(status.textContent).toBe("No microphone found");
    expect(start.hidden).toBe(false);
  });

  it("TASK-10#11 Pending, denied (NotAllowedError), no device (NotFoundError) and constraint failure (OverconstrainedError) are separate states, constraint failure (OverconstrainedError) case", async () => {
    const { view, status, start } = fakeView();
    const mic = failingMic("OverconstrainedError");
    mountListening(view, mic.source, noSchedule, noTargets, supported);
    mic.fail();
    start.click();
    await mic.settled();
    expect(status.textContent).toBe("Microphone constraints cannot be met");
    expect(start.hidden).toBe(false);
  });
});
