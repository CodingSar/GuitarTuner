// The practice canvas colours, read from the page's design tokens so the drawing
// follows light and dark mode. Judgment colours are chosen here too.
import type { Judgment } from "../modules/practice";

function readPalette() {
  const style = getComputedStyle(document.documentElement);
  const token = (name: string): string =>
    style.getPropertyValue(`--${name}`).trim();
  return {
    background: token("surface"),
    lane: token("line"),
    hitLine: token("accent"),
    note: token("pending"),
    hit: token("ok"),
    missed: token("missed"),
    label: token("ground"),
    ink: token("ink"),
  };
}

let current = readPalette();
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    current = readPalette();
  });

// The colours in use now. Read it each frame, not once, so a scheme change applies.
export function palette(): ReturnType<typeof readPalette> {
  return current;
}

// The fill of a note by its judgment. Pending notes keep the note colour.
export function fillOf(judgment: Judgment): string {
  const colours = palette();
  return {
    pending: colours.note,
    hit: colours.hit,
    missed: colours.missed,
  }[judgment];
}

// The fret label colour by judgment: ink on a missed note, the ground colour otherwise.
export function labelOf(judgment: Judgment): string {
  const colours = palette();
  return judgment === "missed" ? colours.ink : colours.label;
}
