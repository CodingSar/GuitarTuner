import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

// The page files are read as text from the repo root. Nothing is built.
function readPage(name: string): string {
  return readFileSync(new URL(`../../${name}`, import.meta.url), "utf8");
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
});
