// Composition root: wires modules to the page. No business rules.
import { check } from "../modules/health";
import { mountListening } from "./listening-view";
import type { Control, ListeningView, PanelView } from "./listening-view";
import { browserMicrophone } from "./microphone";
import { mountReference } from "./reference-view";
import type { ReferenceView } from "./reference-view";
import { mountTuning } from "./tuning-view";
import type { TuningView } from "./tuning-view";
import type { TunerDisplay } from "./tuner-display";

// Writes the health answer into the element it is given.
export function renderHealth(target: HTMLElement): void {
  target.textContent = JSON.stringify(check());
}

// Looks up an element by id. A missing element is a broken page, so fail loudly.
function byId<T extends HTMLElement>(doc: Document, id: string): T {
  const element = doc.getElementById(id);
  if (!element) throw new Error(`Tuner page is missing #${id}`);
  return element as T;
}

// Exposes an element's hidden flag as a boolean.
function hiddenFlag(element: HTMLElement): { hidden: boolean } {
  return {
    get hidden() {
      return Boolean(element.hidden);
    },
    set hidden(value: boolean) {
      element.hidden = value;
    },
  };
}

// Exposes an element's text as a string-or-null property.
function readoutOf(element: HTMLElement): {
  hidden: boolean;
  textContent: string | null;
} {
  return Object.assign(hiddenFlag(element), {
    get textContent() {
      return element.textContent;
    },
    set textContent(value: string | null) {
      element.textContent = value;
    },
  });
}

// Writes the string labels as a list, and marks the row of the nearest string.
function stringsOf(
  doc: Document,
  list: HTMLElement,
): TuningView["strings"] & {
  mark(label: string | undefined): void;
} {
  return {
    setLabels(labels: readonly string[]) {
      list.replaceChildren(
        ...labels.map((label) => {
          const item = doc.createElement("li");
          item.textContent = label;
          return item;
        }),
      );
    },
    mark(label: string | undefined) {
      for (const item of Array.from(list.children)) {
        if (item.textContent === label) {
          item.setAttribute("aria-current", "true");
        } else {
          item.removeAttribute("aria-current");
        }
      }
    },
  };
}

// Shows the note name, the meter needle and the in-tune state, and marks the string.
function panelOf(
  doc: Document,
  strings: ReturnType<typeof stringsOf>,
): PanelView {
  const panel = byId<HTMLElement>(doc, "panel");
  const note = byId<HTMLElement>(doc, "note");
  const needle = byId<HTMLElement>(doc, "needle");
  return {
    show(display: TunerDisplay) {
      note.textContent = display.note;
      needle.hidden = display.position === undefined;
      needle.style.left = `${(display.position ?? 0.5) * 100}%`;
      panel.dataset.state =
        display.position === undefined
          ? "none"
          : display.inTune
            ? "in-tune"
            : "reading";
      strings.mark(display.label);
    },
  };
}

// Adapts a button to the Control the listening view expects.
function control(button: HTMLButtonElement): Control {
  return Object.assign(hiddenFlag(button), {
    onClick(fn: () => void) {
      button.addEventListener("click", fn);
    },
  });
}

// Wires the tuner page's elements to the listening view.
export function mountTunerPage(doc: Document): void {
  const strings = stringsOf(doc, byId<HTMLElement>(doc, "strings"));
  const view: ListeningView = {
    status: byId<HTMLElement>(doc, "status"),
    start: control(byId<HTMLButtonElement>(doc, "start")),
    stop: control(byId<HTMLButtonElement>(doc, "stop")),
    readout: readoutOf(byId<HTMLElement>(doc, "readout")),
    panel: panelOf(doc, strings),
  };
  const select = byId<HTMLSelectElement>(doc, "preset");
  const tuningView: TuningView = {
    preset: {
      get value() {
        return select.value;
      },
      onChange(fn: () => void) {
        select.addEventListener("change", fn);
      },
    },
    strings,
  };
  const tuning = mountTuning(tuningView);
  const referenceInput = byId<HTMLInputElement>(doc, "reference");
  const referenceView: ReferenceView = {
    input: {
      get value() {
        return referenceInput.value;
      },
      onChange(fn: () => void) {
        referenceInput.addEventListener("input", fn);
      },
    },
  };
  const reference = mountReference(referenceView);
  mountListening(view, browserMicrophone, undefined, () =>
    tuning.targets(reference.hz()),
  );
}

mountTunerPage(document);
