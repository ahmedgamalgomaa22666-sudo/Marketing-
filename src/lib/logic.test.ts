import { describe, expect, it } from "vitest";
import { commercialMetrics, funnelConversions, furthestStage, overdue, pipelineKpis, rate } from "./analytics";
import { DEFAULT_WEIGHTS } from "./config";
import { createDemoDatabase, HERO_ACCOUNT_ID } from "./demo/seed";
import { buildAccountBrief } from "./intelligence/brief";
import { coachDeal } from "./intelligence/dealCoach";
import { buildBusinessCase, capabilityGaps, matchProgrammes } from "./intelligence/mapper";
import { BANNED_PHRASES, templateDraft } from "./intelligence/outreach";
import { computeFitScore } from "./scoring";
import type { Account } from "./types";

const TODAY = "2026-09-24";
const db = createDemoDatabase(TODAY);
const scoreFor = (id: string, weights = DEFAULT_WEIGHTS) => {
  const account = db.accounts.find((a) => a.id === id)!;
  return computeFitScore({
    account,
    score: db.accountScores.find((s) => s.accountId === id),
    contacts: db.contacts.filter((c) => c.accountId === id),
    activities: db.activities.filter((a) => a.accountId === id),
    weights,
    today: TODAY,
  });
};

describe("Account Fit Score", () => {
  it("stays within 0–100 and dimension points sum to the total", () => {
    for (const a of db.accounts) {
      const s = scoreFor(a.id);
      expect(s.total).toBeGreaterThanOrEqual(0);
      expect(s.total).toBeLessThanOrEqual(100);
      expect(Math.round(s.dimensions.reduce((t, d) => t + d.points, 0))).toBe(s.total);
    }
  });

  it("scores the hero account highly and explains why", () => {
    const s = scoreFor(HERO_ACCOUNT_ID);
    expect(s.total).toBeGreaterThanOrEqual(75);
    expect(s.band).toBe("High fit");
    expect(s.strengths).toContain("Identified HR / L&D stakeholder");
    expect(s.strengths).toContain("GCC expansion — potential multi-country programme");
  });

  it("flags risks for an account with no stakeholders or engagement", () => {
    const s = scoreFor("acc-dunehaven");
    expect(s.risks).toContain("No stakeholders mapped yet");
    expect(s.risks).toContain("No engagement yet");
    expect(s.total).toBeLessThan(scoreFor(HERO_ACCOUNT_ID).total);
  });

  it("normalises custom weights to 100", () => {
    const weights = { ...DEFAULT_WEIGHTS, marketFit: 40, engagement: 0 };
    const s = scoreFor(HERO_ACCOUNT_ID, weights);
    expect(s.dimensions.reduce((t, d) => t + d.max, 0)).toBeCloseTo(100);
    expect(s.dimensions.find((d) => d.key === "engagement")!.max).toBe(0);
  });
});

describe("Funnel analytics", () => {
  const acc = (stage: Account["stage"], highestStage = stage): Account => ({ ...db.accounts[0], id: stage + highestStage, stage, highestStage });

  it("returns null (not 0%) when there is no underlying data", () => {
    expect(rate(0, 0)).toBeNull();
    expect(funnelConversions([]).every((c) => c.rate === null)).toBe(true);
    expect(commercialMetrics([], [], TODAY).responseRate).toBeNull();
  });

  it("counts lost accounts at the furthest stage they reached", () => {
    const accounts = [acc("Contacted"), acc("Engaged"), acc("Lost", "Proposal"), acc("Won")];
    const kpis = pipelineKpis(accounts);
    expect(kpis.contacted).toBe(4);
    expect(kpis.proposals).toBe(2);
    expect(kpis.lost).toBe(1);
    const [c2e, , , , p2w] = funnelConversions(accounts);
    expect(c2e.rate).toBeCloseTo(3 / 4);
    expect(p2w.rate).toBeCloseTo(1 / 2);
    expect(commercialMetrics(accounts, [], TODAY).winRate).toBeCloseTo(1 / 2);
  });

  it("never moves the highest stage backwards", () => {
    expect(furthestStage("Proposal", "Contacted")).toBe("Proposal");
    expect(furthestStage("Contacted", "Meeting")).toBe("Meeting");
    expect(furthestStage("Proposal", "Lost")).toBe("Proposal");
  });

  it("finds overdue planned activities only", () => {
    const late = overdue(db.activities, TODAY);
    expect(late.length).toBeGreaterThan(0);
    expect(late.every((a) => a.status === "planned" && a.date < TODAY)).toBe(true);
  });
});

describe("Training Opportunity Mapper", () => {
  it("translates new-manager promotion into people-management gaps", () => {
    const gaps = capabilityGaps(["new-managers"]);
    expect(gaps[0].capability).toBe("people-management");
    expect(gaps.map((g) => g.capability)).toEqual(expect.arrayContaining(["coaching", "delegation"]));
  });

  it("matches sales underperformance to the selling programme", () => {
    const matches = matchProgrammes(capabilityGaps(["sales-underperformance"]), db.programmes, "Individual contributors");
    expect(matches[0].programme.id).toBe("prog-sell");
    expect(matches[0].fit).toBeGreaterThan(0);
    expect(matches.length).toBeLessThanOrEqual(3);
  });

  it("labels the gap as a hypothesis and flags DEMO programmes", () => {
    const inputs = { industry: "Healthcare", sizeBand: "1000-4999", growthStage: "Rapid growth", challenges: ["new-managers"], targetGroup: "New clinic managers", leadershipLevel: "Frontline", desiredOutcome: "", urgency: "High", knownGaps: "" } as const;
    const gaps = capabilityGaps([...inputs.challenges]);
    const bc = buildBusinessCase({ ...inputs, challenges: [...inputs.challenges] }, gaps, matchProgrammes(gaps, db.programmes, inputs.leadershipLevel));
    expect(bc.capabilityGap.startsWith("Hypothesis:")).toBe(true);
    expect(bc.suggestedSolution).toContain("DEMO");
    expect(bc.discoveryQuestions.length).toBeGreaterThan(0);
    expect(bc.validationQuestions.length).toBeGreaterThan(0);
  });

  it("returns no matches when no gaps are selected", () => {
    expect(matchProgrammes([], db.programmes)).toEqual([]);
  });
});

describe("Brief, deal coach and outreach", () => {
  it("labels every inferred priority and gap as a hypothesis", () => {
    const account = db.accounts.find((a) => a.id === HERO_ACCOUNT_ID)!;
    const brief = buildAccountBrief(account, db.contacts.filter((c) => c.accountId === account.id), db.activities, db.programmes, scoreFor(account.id), TODAY);
    expect(brief.priorities.every((p) => p.startsWith("Hypothesis:"))).toBe(true);
    expect(brief.gaps.every((g) => g.hypothesis.startsWith("Hypothesis:"))).toBe(true);
    expect(brief.solutions.length).toBeGreaterThan(0);
  });

  it("produces 5 discovery, 3 follow-up questions and 3 objections", () => {
    const opp = db.opportunities.find((o) => o.id === "opp-sahra")!;
    const account = db.accounts.find((a) => a.id === opp.accountId)!;
    const c = coachDeal(opp, account, db.contacts.filter((x) => x.accountId === account.id), db.activities, scoreFor(account.id), TODAY);
    expect(c.discoveryQuestions).toHaveLength(5);
    expect(c.followUpQuestions).toHaveLength(3);
    expect(c.objections).toHaveLength(3);
    expect(c.risks.some((r) => r.includes("overdue"))).toBe(true);
  });

  it("keeps drafts short and free of banned phrasing", () => {
    for (const type of ["linkedin", "email", "follow-up", "meeting-follow-up", "re-engagement"] as const) {
      const draft = templateDraft({ type, companyName: "Meridian Gulf Healthcare", country: "UAE", contactName: "Omar Farouk", contactTitle: "Head of L&D", observation: "expanding into new GCC markets", capability: "People management", stage: "Engaged", cta: "a 20-minute conversation", senderName: "Sam" });
      const lower = draft.body.toLowerCase();
      expect(BANNED_PHRASES.some((p) => lower.includes(p))).toBe(false);
      expect(draft.body).toContain("Omar");
      if (type === "linkedin") expect(draft.body.length).toBeLessThanOrEqual(300);
    }
  });
});
