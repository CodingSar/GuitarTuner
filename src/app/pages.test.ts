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
});
