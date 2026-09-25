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
    expect(site.person.intro).toMatch(/15\+ years of sales, market development and leadership experience/);
    expect(site.person.intro).not.toMatch(/15\+ years[^,]*business development/);
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

  it("dates business development honestly in the hero (since 2026, never 15+ years)", () => {
    expect(site.hero.lead).toMatch(/with 15\+ years of sales, market development and leadership experience\.$/);
    expect(site.hero.support).toMatch(/^Hands-on B2B business development across the UAE, Saudi Arabia and wider GCC markets since 2026\./);
    for (const text of [site.hero.lead, site.hero.support, site.person.availability, ...strings(site.businessDevelopment.capabilities)]) {
      expect(text).not.toMatch(/\d+\+? years (of |in )?(b2b )?business development/i);
    }
  });

  it("keeps recruiters first: hero CTA hierarchy and results label", () => {
    expect([site.hero.primaryCta, site.hero.secondaryCta, site.hero.tertiaryCta]).toEqual(["View my track record", "View CV", "Contact me"]);
    expect(site.hero.resultsLabel).toBe("Selected Commercial Results · Apex Pharma");
    expect(site.resultsEmployer).toBe("Apex Pharma");
  });

  it("claims no client results, numbers or guarantees in capabilities, hero or contact copy", () => {
    const copy = [site.hero.support, site.person.availability, ...strings(site.businessDevelopment.capabilities)].join(" ").toLowerCase().replaceAll("since 2026", ""); // the only permitted figure: the verified BD start year
    expect(copy).not.toMatch(/\b\d[\d,.]*\b|%|revenue|deals|closed|clients won|guarantee|proven|increase[sd]? (sales|revenue)|roi\b/);
    expect(site.businessDevelopment.capabilities.map((c) => c.title)).toEqual([
      "B2B prospect & account research",
      "Decision-maker mapping",
      "GCC market research",
      "Consultative outreach",
      "Opportunity qualification",
      "Pipeline development & follow-up",
    ]);
    const bdCompanies = site.experience.filter((e) => e.chapter === "Business development").map((e) => e.company);
    for (const c of site.businessDevelopment.capabilities) {
      expect(bdCompanies.some((company) => company.startsWith(c.where.split(" · ")[0])), c.title).toBe(true);
    }
  });

  it("never positions the owner as a developer, engineer, founder, agency or SaaS specialist", () => {
    expect(allText).not.toMatch(/software developer|web developer|ai engineer|\bengineer\b|\bsaas\b|\bfounder of\b|\bagency\b|\bconsultant\b/);
  });

  it("contact copy invites both recruiters and project enquiries", () => {
    const text = site.person.availability.toLowerCase();
    expect(text).toMatch(/recruiters and hiring managers/);
    expect(text).toMatch(/b2b business development projects/);
  });

  it("never links public content to the private workspace or AI API", () => {
    expect(allText).not.toMatch(/\/workspace|\/api\//);
  });

  it("does not present the owner as UAE-based", () => {
    expect(site.person.location).toBe("Egypt · Open to UAE & GCC Opportunities");
    expect(allText).not.toMatch(/based in (the )?(uae|dubai)/);
  });
});

describe("publication inputs", () => {
  it("publishes the approved contact details and CV, but never a phone number", () => {
    expect(site.person.email).toBe("ahmedgamalgomaa226@yahoo.com");
    expect(site.person.linkedin).toBe("https://www.linkedin.com/in/ahmed-gamal-063245a7");
    expect(site.person.cvFile).toBe("/Ahmed-Gamal-CV.pdf");
    expect(allText).not.toMatch(/\+?20[\s-]?100|01000366228|036[\s-]?6228|phone/);
  });
});
