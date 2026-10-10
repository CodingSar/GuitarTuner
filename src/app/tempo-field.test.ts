// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import {
  mountTempoField,
  type TempoFieldElements,
  type TempoPractice,
} from "./tempo-field";

const MESSAGE = "Enter a whole number from 20 to 240";

// Fresh page elements for one test. The field is a text box here, so the typed
// text is kept as typed and the field's own check decides what it means.
function fields(value: string): TempoFieldElements {
  const input = document.createElement("input");
  input.value = value;
  return {
    input,
    error: document.createElement("p"),
    minus: document.createElement("button"),
    plus: document.createElement("button"),
    reset: document.createElement("button"),
  };
}

// A practice controller for a song at the given tempo. Its calls are mocks.
function fakePractice(tempo: number): TempoPractice {
  return { defaultTempo: vi.fn(() => tempo), start: vi.fn() };
}

describe("tempo-field", () => {
  it("TASK-20#1 GIVEN a song is chosen WHEN the practice page shows it THEN the BPM field shows the song's tempo, 72", () => {
    const elements = fields("");
    const { showDefault } = mountTempoField(elements, fakePractice(72));

    showDefault();

    expect(elements.input.value).toBe("72");
  });

  it("TASK-20#3 GIVEN the BPM field holds the whole number 120 WHEN Start is pressed THEN the session starts at 120 and the field shows no error", () => {
    const elements = fields("120");
    const practice = fakePractice(72);
    const { startFromField } = mountTempoField(elements, practice);

    startFromField();

    expect(practice.start).toHaveBeenCalledWith(120);
    expect(elements.error.textContent).toBe("");
  });

  it("TASK-20#3 GIVEN the BPM field holds the letters abc WHEN Start is pressed THEN the session does not start and the field says why", () => {
    const elements = fields("abc");
    const practice = fakePractice(72);
    const { startFromField } = mountTempoField(elements, practice);

    startFromField();

    expect(practice.start).not.toHaveBeenCalled();
    expect(elements.error.textContent).toBe(MESSAGE);
  });

  it("TASK-20#3 GIVEN the BPM field holds the decimal 100.5 WHEN Start is pressed THEN the session does not start and the field says why", () => {
    const elements = fields("100.5");
    const practice = fakePractice(72);
    const { startFromField } = mountTempoField(elements, practice);

    startFromField();

    expect(practice.start).not.toHaveBeenCalled();
    expect(elements.error.textContent).toBe(MESSAGE);
  });

  it("TASK-20#3 GIVEN the BPM field holds 300, above the range WHEN Start is pressed THEN the session does not start and the field says why", () => {
    const elements = fields("300");
    const practice = fakePractice(72);
    const { startFromField } = mountTempoField(elements, practice);

    startFromField();

    expect(practice.start).not.toHaveBeenCalled();
    expect(elements.error.textContent).toBe(MESSAGE);
  });

  it("TASK-20#4 GIVEN the BPM field holds 100 WHEN the plus button is pressed THEN the field shows 105", () => {
    const elements = fields("100");
    mountTempoField(elements, fakePractice(72));

    elements.plus.click();

    expect(elements.input.value).toBe("105");
  });

  it("TASK-20#4 GIVEN the BPM field holds 22 WHEN the minus button is pressed THEN the field shows 20, the lower limit", () => {
    const elements = fields("22");
    mountTempoField(elements, fakePractice(72));

    elements.minus.click();

    expect(elements.input.value).toBe("20");
  });

  it("TASK-20#5 GIVEN the player changed the BPM to 150 WHEN Reset to song default is pressed THEN the field shows the chosen song's tempo, 72", () => {
    const elements = fields("100");
    mountTempoField(elements, fakePractice(72));
    elements.input.value = "150";

    elements.reset.click();

    expect(elements.input.value).toBe("72");
  });
});
