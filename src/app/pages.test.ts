import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

// The page files are read as text from the repo root. Nothing is built.
function readPage(name: string): string {
  return readFileSync(new URL(`../../${name}`, import.meta.url), "utf8");
}

type NavButton = { href: string | undefined; text: string };

// The page's nav buttons: links with class token nav-button inside <nav aria-label="Pages">.
function navButtons(html: string): NavButton[] {
  const nav = /<nav\b[^>]*aria-label="Pages"[^>]*>([\s\S]*?)<\/nav>/.exec(html);
  const anchors = nav?.[1]?.match(/<a\b[\s\S]*?<\/a>/g) ?? [];
  return anchors.flatMap((anchor) => {
    const open = /<a\b[^>]*>/.exec(anchor)?.[0] ?? "";
    const classes = attrValue(open, "class")?.split(/\s+/) ?? [];
    if (!classes.includes("nav-button")) return [];
    return [
      {
        href: attrValue(open, "href"),
        text: anchor.replace(/<[^>]*>/g, "").trim(),
      },
    ];
  });
}

// Value of one attribute in an opening tag, or undefined when absent.
function attrValue(tag: string, name: string): string | undefined {
  return new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
}

// The opening tag of the element with the given id, or undefined when absent.
function tagWithId(html: string, id: string): string | undefined {
  return new RegExp(`<[a-zA-Z][^>]*\\sid="${id}"[^>]*>`).exec(html)?.[0];
}

describe("pages", () => {
  it("TASK-13#4 the Tuner and Practice pages link to each other, and each loads its own module script", () => {
    const tuner = readPage("index.html");
    const practice = readPage("practice.html");

    expect(tuner).toContain('href="practice.html"');
    expect(practice).toContain('href="index.html"');
    expect(tuner).toContain('src="/src/app/index.ts"');
    expect(practice).toContain('src="/src/app/practice-page.ts"');
  });

  it("TASK-21#1 GIVEN the Tuner page is open WHEN it is shown THEN the link to the Practice page is a button labelled Practice", () => {
    expect(navButtons(readPage("index.html"))).toContainEqual({
      href: "practice.html",
      text: "Practice",
    });
  });

  it("TASK-21#2 GIVEN the Practice page is open WHEN it is shown THEN the link to the Tuner page is a button labelled Tuner", () => {
    expect(navButtons(readPage("practice.html"))).toContainEqual({
      href: "index.html",
      text: "Tuner",
    });
  });

  it("TASK-21#3 GIVEN either nav button WHEN it is tapped THEN the browser opens the other page, and the button is at least 44 px tall", () => {
    expect(navButtons(readPage("index.html"))).toContainEqual({
      href: "practice.html",
      text: "Practice",
    });
    expect(navButtons(readPage("practice.html"))).toContainEqual({
      href: "index.html",
      text: "Tuner",
    });
    const css = readPage("src/app/theme.css");
    const rule = /\.nav-button\s*\{([^}]*)\}/.exec(css);
    expect(rule?.[1] ?? "").toMatch(/min-height:\s*44px/);
  });

  it("TASK-20#1 GIVEN a song is chosen WHEN the practice page shows it THEN the BPM field is a number input that shows the tempo", () => {
    const bpm = tagWithId(readPage("practice.html"), "bpm") ?? "";

    expect(bpm).toMatch(/^<input\b/);
    expect(attrValue(bpm, "type")).toBe("number");
  });

  it("TASK-20#3 GIVEN the BPM field holds a value outside 20 to 240 WHEN Start is pressed THEN the field has limits 20 and 240", () => {
    const bpm = tagWithId(readPage("practice.html"), "bpm") ?? "";

    expect(attrValue(bpm, "min")).toBe("20");
    expect(attrValue(bpm, "max")).toBe("240");
  });

  it("TASK-20#3 GIVEN the BPM field holds a value that is not a whole number from 20 to 240 WHEN Start is pressed THEN the page has an alert that says why", () => {
    const error = tagWithId(readPage("practice.html"), "bpm-error") ?? "";

    expect(error).toMatch(/^<[a-zA-Z]+\b/);
    expect(attrValue(error, "role")).toBe("alert");
  });

  it("TASK-20#4 GIVEN the BPM field holds a whole number WHEN the -/+ button is pressed THEN the page has a minus button and a plus button", () => {
    const html = readPage("practice.html");

    expect(tagWithId(html, "tempo-minus")).toMatch(/^<button\b/);
    expect(tagWithId(html, "tempo-plus")).toMatch(/^<button\b/);
  });

  it("TASK-20#5 GIVEN the player changed the BPM WHEN Reset to song default is pressed THEN the page has that reset button", () => {
    const html = readPage("practice.html");

    expect(tagWithId(html, "tempo-reset")).toMatch(/^<button\b/);
    expect(html).toContain("Reset to song default");
  });
});
