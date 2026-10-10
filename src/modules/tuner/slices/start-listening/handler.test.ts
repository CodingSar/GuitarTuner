import { describe, expect, it } from "vitest";
import { handler } from "./handler";
import type { ListeningState, MicSource, MicStream } from "./handler";

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
    releases: () => releases,
  };
}

function recorder() {
  const states: ListeningState[] = [];
  return {
    states,
    onState: (state: ListeningState) => {
      states.push(state);
    },
  };
}

describe("start listening", () => {
  it("TASK-4#1 pending state shows until the browser grants the microphone", async () => {
    const mic = fakeMic();
    const { states, onState } = recorder();
    const listener = handler(mic.source, onState);
    expect(states).toEqual(["pending"]);
    mic.grant();
    await listener.ready;
    expect(states).toEqual(["pending", "listening"]);
  });

  it("TASK-4#2 denied state shows and no pitch readout appears when microphone access is denied", async () => {
    const mic = fakeMic();
    const { states, onState } = recorder();
    const listener = handler(mic.source, onState);
    mic.deny();
    await listener.ready;
    expect(states.at(-1)).toBe("denied");
    expect(states).not.toContain("listening");
    expect(listener.state).toBe("denied");
  });

  it("TASK-4#3 microphone is released and no audio is stored when listening stops", async () => {
    const mic = fakeMic();
    const { states, onState } = recorder();
    const listener = handler(mic.source, onState);
    mic.grant();
    await listener.ready;
    listener.stop();
    expect(mic.releases()).toBe(1);
    expect(states.at(-1)).toBe("idle");
  });

  it("TASK-4#4 microphone is released and state stays idle when the grant arrives after the player stops", async () => {
    const mic = fakeMic();
    const { states, onState } = recorder();
    const listener = handler(mic.source, onState);
    listener.stop();
    mic.grant();
    await listener.ready;
    expect(mic.releases()).toBe(1);
    expect(states.at(-1)).toBe("idle");
    expect(states).not.toContain("listening");
    expect(listener.state).toBe("idle");
  });
});

describe("start listening (TASK-10)", () => {
  it("TASK-10#11 Pending, denied (NotAllowedError) are separate states", async () => {
    const mic = fakeMic();
    const { states, onState } = recorder();
    const listener = handler(mic.source, onState);
    expect(listener.state).toBe("pending");
    mic.deny();
    await listener.ready;
    expect(listener.state).toBe("denied");
    expect(states).toEqual(["pending", "denied"]);
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
  };
}

describe("start listening (TASK-10 states)", () => {
  it("TASK-10#11 Pending, denied (NotAllowedError), no device (NotFoundError) and constraint failure (OverconstrainedError) are separate states, no device (NotFoundError) case", async () => {
    const mic = failingMic("NotFoundError");
    const listener = handler(mic.source, () => {});
    mic.fail();
    // Settle ready; the state is what this test checks.
    await listener.ready.catch(() => undefined);
    expect(listener.state).toBe("no-device");
  });

  it("TASK-10#11 Pending, denied (NotAllowedError), no device (NotFoundError) and constraint failure (OverconstrainedError) are separate states, constraint failure (OverconstrainedError) case", async () => {
    const mic = failingMic("OverconstrainedError");
    const listener = handler(mic.source, () => {});
    mic.fail();
    // Settle ready; the state is what this test checks.
    await listener.ready.catch(() => undefined);
    expect(listener.state).toBe("constraint-failed");
  });
});
