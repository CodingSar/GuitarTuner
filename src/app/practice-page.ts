// Composition root for the practice page: wires the controls to the practice
// controller, feeds it the microphone pitch and draws its notes to the canvas.
// No business rules.
import { listSongs } from "../modules/practice";
import { readPitch, startListening } from "../modules/tuner";
import type { Listener, MicSource, MicStream } from "../modules/tuner";
import {
  DEFAULT_REFERENCE_HZ,
  selectPreset,
  targetsFor,
} from "../modules/tuning";
import { audioClock } from "./audio-clock";
import { browserMicrophone } from "./microphone";
import { fillOf, labelOf, palette } from "./practice-palette";
import { mountPractice } from "./practice-view";
import { mountSongCards, showTally } from "./practice-panel";
import type { TallyElements } from "./practice-panel";

// Looks up an element by id. A missing element is a broken page, so fail loudly.
function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Practice page is missing #${id}`);
  return element as T;
}

const LANE_COUNT = 6;
const NOTE_RADIUS = 14;
const EDGE_MARGIN = 20;
// The canvas drawing context. Without one the page cannot draw, so fail loudly.
function contextOf(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Practice page canvas has no 2D context");
  return ctx;
}

const canvas = byId<HTMLCanvasElement>("stage");
const songsBox = byId<HTMLElement>("songs");
const tallyElements: TallyElements = {
  hits: byId<HTMLElement>("hits"),
  missed: byId<HTMLElement>("missed"),
  streak: byId<HTMLElement>("streak"),
};
const ctx = contextOf(canvas);

const context = new AudioContext();
const clock = audioClock(context);
const hitLineY = 0.8 * canvas.height;
const songs = listSongs();
const practice = mountPractice(songs, clock, hitLineY);

// The Standard preset as the tuner reads it, lowest string first. openHz is in
// string order 1 to 6, where string 1 is the high E, so the list is reversed.
const targets = targetsFor(selectPreset("standard"), DEFAULT_REFERENCE_HZ);
const openHz = targets.map((target) => target.hz).reverse();

const markChosen = mountSongCards(songsBox, songs, (index) => {
  practice.selectSong(index);
  void context.resume();
  practice.start();
  markChosen(index);
});
practice.selectSong(0);
markChosen(0);

// One open microphone: its listener, and the stream the browser hands over.
interface MicSession {
  readonly listener: Listener;
  readonly tap: { stream?: MicStream };
}
let mic: MicSession | undefined;
const micButton = byId<HTMLButtonElement>("mic");

// Stops listening and releases the microphone. Does nothing when it is off.
function micOff(): void {
  mic?.listener.stop();
  mic = undefined;
  micButton.textContent = "Mic on";
}

// Opens the microphone through the tuner's listening slice, as the tuner page does.
function micOn(): void {
  const tap: { stream?: MicStream } = {};
  const source: MicSource = {
    open: async () => {
      const opened = await browserMicrophone.open();
      tap.stream = opened;
      return opened;
    },
  };
  const listener = startListening(source, (state) => {
    const failed =
      state === "denied" ||
      state === "no-device" ||
      state === "constraint-failed";
    if (failed && mic?.listener === listener) micOff();
  });
  mic = { listener, tap };
  micButton.textContent = "Mic off";
}

function toggleMic(): void {
  if (mic === undefined) micOn();
  else micOff();
}

const actions: Record<string, () => void> = {
  start: () => {
    void context.resume();
    practice.start();
  },
  pause: () => practice.pause(),
  resume: () => practice.resume(),
  slower: () => practice.slower(),
  faster: () => practice.faster(),
  mic: toggleMic,
};
for (const [id, action] of Object.entries(actions)) {
  byId<HTMLButtonElement>(id).addEventListener("click", action);
}

// Reads the pitch once per frame while the microphone is listening and hands it to practice.
function listen(): void {
  const stream = mic?.tap.stream;
  if (mic?.listener.state !== "listening" || stream?.analysis === undefined)
    return;
  const reading = readPitch(
    stream.analysis.samples(),
    stream.analysis.sampleRate,
    targets,
  );
  if (reading.kind !== "reading") return;
  const target = targets.find((candidate) => candidate.label === reading.label);
  if (target === undefined) return;
  practice.hear(target.hz * 2 ** (reading.cents / 1200), openHz);
}

// Canvas x of a string row: row 0 is the top string.
function laneX(row: number): number {
  return ((row + 0.5) * canvas.width) / LANE_COUNT;
}

function drawFrame(ctx: CanvasRenderingContext2D): void {
  const colours = palette();
  ctx.fillStyle = colours.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = colours.lane;
  ctx.lineWidth = 1;
  for (let row = 0; row < LANE_COUNT; row++) {
    ctx.beginPath();
    ctx.moveTo(laneX(row), 0);
    ctx.lineTo(laneX(row), canvas.height);
    ctx.stroke();
  }

  ctx.strokeStyle = colours.hitLine;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, hitLineY);
  ctx.lineTo(canvas.width, hitLineY);
  ctx.stroke();

  ctx.font = `600 14px "IBM Plex Sans", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Judged once per frame. Its order matches the frame's notes.
  const judged = practice.judgments();
  for (const [index, note] of practice.frame().entries()) {
    if (note.y < -EDGE_MARGIN || note.y > canvas.height + EDGE_MARGIN) continue;
    const x = laneX(note.row);
    const judgment = judged[index] ?? "pending";
    ctx.fillStyle = fillOf(judgment);
    ctx.beginPath();
    ctx.arc(x, note.y, NOTE_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = labelOf(judgment);
    ctx.fillText(String(note.fret), x, note.y);
  }
}

function tick(): void {
  drawFrame(ctx);
  listen();
  showTally(tallyElements, practice.tally());
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
