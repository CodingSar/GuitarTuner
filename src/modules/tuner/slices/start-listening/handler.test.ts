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
    const listening = handler(mic.source, onState);
    expect(states).toEqual(["pending"]);
    mic.grant();
    await listening;
    expect(states).toEqual(["pending", "listening"]);
  });

  it("TASK-4#2 denied state shows and no pitch readout appears when microphone access is denied", async () => {
    const mic = fakeMic();
    const { states, onState } = recorder();
    const listening = handler(mic.source, onState);
    mic.deny();
    const listener = await listening;
    expect(states.at(-1)).toBe("denied");
    expect(states).not.toContain("listening");
    expect(listener.state).toBe("denied");
  });

  it("TASK-4#3 microphone is released and no audio is stored when listening stops", async () => {
    const mic = fakeMic();
    const { states, onState } = recorder();
    const listening = handler(mic.source, onState);
    mic.grant();
    const listener = await listening;
    listener.stop();
    expect(mic.releases()).toBe(1);
    expect(states.at(-1)).toBe("idle");
  });
});
