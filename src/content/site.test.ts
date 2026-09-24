import { describe, expect, it } from "vitest";
import * as site from "./site";

const allText = JSON.stringify(site).toLowerCase();

describe("public content guardrails", () => {
  it("avoids unsupported generic self-descriptions", () => {
    for (const phrase of ["results-driven", "dynamic leader", "passionate professional", "seasoned", "visionary"]) {
      expect(allText).not.toContain(phrase);
    }
  });

  it("never presents 15+ years as business development experience", () => {
    expect(allText).not.toMatch(/15\+ years (of |in )?(b2b )?business development/);
    expect(site.person.intro).toMatch(/15\+ years in pharmaceutical commercial sales/);
  });

  it("keeps contact details and CV file as placeholders until real values are provided", () => {
    for (const v of [site.person.email, site.person.linkedin, site.person.cvFile]) {
      expect(site.isPlaceholder(v) || !v.includes("example")).toBe(true);
    }
  });

  it("shows every verified result with a value and a label", () => {
    expect(site.results.length).toBeGreaterThanOrEqual(5);
    expect(site.results.every((r) => r.value && r.label)).toBe(true);
  });
});
