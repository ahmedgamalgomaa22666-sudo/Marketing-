import { describe, expect, it } from "vitest";
import * as site from "./site";

const allText = JSON.stringify(site).toLowerCase();

function strings(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(strings);
  if (v && typeof v === "object") return Object.values(v).flatMap(strings);
  return [];
}

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

  it("publishes no placeholder text — missing fields are null and hidden", () => {
    const published = strings(site).filter((s) => /\[[^\]]*\]/.test(s));
    expect(published).toEqual([]);
  });

  it("claims no revenue, deals or clients won for business development roles", () => {
    const bd = strings(site.experience.filter((e) => e.chapter === "Business development")).join(" ").toLowerCase();
    expect(bd).not.toMatch(/revenue|closed|won |deals|clients won|\$|aed|sar/);
  });

  it("keeps the five verified results in their verified wording", () => {
    expect(site.results.map((r) => r.statement)).toEqual([
      "Achieved 400% of target on a pharmaceutical product launch.",
      "Built Eraloner to the #1 market position in Minya and Fayoum within 24 months.",
      "Delivered +240% growth on Decancit.",
      "Increased Ezapril Co. monthly volume approximately 5x, from 5,000 to 25,000 packs.",
      "Recognised as Best Acting Supervisor 2024 company-wide at Apex Pharma.",
    ]);
  });

  it("does not present the owner as UAE-based", () => {
    expect(site.person.location).toBe("Egypt · Open to UAE & GCC Opportunities");
    expect(allText).not.toMatch(/based in (the )?(uae|dubai)/);
  });
});
