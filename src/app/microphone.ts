import type { MicSource, MicStream } from "../modules/tuner";

// The browser microphone. Processing is off so the raw pitch reaches the tuner.
// Nothing is stored or recorded; release() stops the tracks.
export const browserMicrophone: MicSource = {
  async open(): Promise<MicStream> {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
    return {
      release() {
        for (const track of stream.getTracks()) track.stop();
      },
    };
  },
};
