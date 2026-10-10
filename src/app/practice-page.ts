// Composition root for the practice page: wires the controls to the practice
// controller and draws its notes to the canvas. No business rules.
import { listSongs } from "../modules/practice";
import { audioClock } from "./audio-clock";
import { mountPractice } from "./practice-view";

// Looks up an element by id. A missing element is a broken page, so fail loudly.
function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Practice page is missing #${id}`);
  return element as T;
}

const LANE_COUNT = 6;
const NOTE_RADIUS = 14;
const EDGE_MARGIN = 20;
const PALETTE = {
  background: "#101014",
  lane: "#3a3a48",
  hitLine: "#f2c94c",
  note: "#56ccf2",
  label: "#0b0b0f",
};

// The canvas drawing context. Without one the page cannot draw, so fail loudly.
function contextOf(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Practice page canvas has no 2D context");
  return ctx;
}

const canvas = byId<HTMLCanvasElement>("stage");
const select = byId<HTMLSelectElement>("song");
const ctx = contextOf(canvas);

const context = new AudioContext();
const clock = audioClock(context);
const hitLineY = 0.8 * canvas.height;
const songs = listSongs();
const practice = mountPractice(songs, clock, hitLineY);

select.append(
  ...songs.map((song, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = song.title;
    return option;
  }),
);
select.addEventListener("change", () => {
  practice.selectSong(Number(select.value));
});
practice.selectSong(0);

const actions: Record<string, () => void> = {
  start: () => {
    void context.resume();
    practice.start();
  },
  pause: () => practice.pause(),
  resume: () => practice.resume(),
  slower: () => practice.slower(),
  faster: () => practice.faster(),
};
for (const [id, action] of Object.entries(actions)) {
  byId<HTMLButtonElement>(id).addEventListener("click", action);
}

// Canvas x of a string row: row 0 is the top string.
function laneX(row: number): number {
  return ((row + 0.5) * canvas.width) / LANE_COUNT;
}

function drawFrame(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = PALETTE.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = PALETTE.lane;
  ctx.lineWidth = 1;
  for (let row = 0; row < LANE_COUNT; row++) {
    ctx.beginPath();
    ctx.moveTo(laneX(row), 0);
    ctx.lineTo(laneX(row), canvas.height);
    ctx.stroke();
  }

  ctx.strokeStyle = PALETTE.hitLine;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, hitLineY);
  ctx.lineTo(canvas.width, hitLineY);
  ctx.stroke();

  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const note of practice.frame()) {
    if (note.y < -EDGE_MARGIN || note.y > canvas.height + EDGE_MARGIN) continue;
    const x = laneX(note.row);
    ctx.fillStyle = PALETTE.note;
    ctx.beginPath();
    ctx.arc(x, note.y, NOTE_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = PALETTE.label;
    ctx.fillText(String(note.fret), x, note.y);
  }
}

function tick(): void {
  drawFrame(ctx);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
