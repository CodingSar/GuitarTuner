import type { MicAnalysis, MicSource, MicStream } from "../modules/tuner";

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
    // Analysis only: the source feeds the analyser and never reaches the speakers.
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 4096;
    source.connect(analyser);
    const buffer = new Float32Array(analyser.fftSize);
    const analysis: MicAnalysis = {
      sampleRate: context.sampleRate,
      samples() {
        analyser.getFloatTimeDomainData(buffer);
        return buffer;
      },
    };
    return {
      analysis,
      release() {
        for (const track of stream.getTracks()) track.stop();
        void context.close();
      },
    };
  },
};
