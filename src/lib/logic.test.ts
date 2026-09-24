import { describe, expect, it } from "vitest";
import { commercialMetrics, funnelConversions, furthestStage, overdue, pipelineKpis, rate } from "./analytics";
import { DEFAULT_WEIGHTS } from "./config";
import { buildAccountBrief } from "./intelligence/brief";
import { coachDeal } from "./intelligence/dealCoach";
import { buildBusinessCase, capabilityGaps, matchProgrammes } from "./intelligence/mapper";
import { recommendNextAction } from "./intelligence/nextAction";
import { BANNED_PHRASES, firstName, templateDraft } from "./intelligence/outreach";
import { personalProfile as profile } from "./profile/personal";
import { computeFitScore } from "./scoring";
import { emptyDatabase } from "./store/empty";
import { fixtureDb, HERO } from "./test/fixtures";
import type { Account } from "./types";

const TODAY = "2026-09-24";
const db = fixtureDb(profile, TODAY);
const account = (id: string) => db.accounts.find((a) => a.id === id)!;
const scoreFor = (id: string, weights = DEFAULT_WEIGHTS) =>
  computeFitScore({
    account: account(id),
    score: db.accountScores.find((s) => s.accountId === id),
    contacts: db.contacts.filter((c) => c.accountId === id),
    activities: db.activities.filter((a) => a.accountId === id),
    weights,
    profile,
    today: TODAY,
  });

describe("Account Fit Score", () => {
  it("stays within 0–100 and dimension points sum to the total", () => {
    for (const a of db.accounts) {
      const s = scoreFor(a.id);
      expect(s.total).toBeGreaterThanOrEqual(0);
      expect(s.total).toBeLessThanOrEqual(100);
      expect(Math.round(s.dimensions.reduce((t, d) => t + d.points, 0))).toBe(s.total);
    }
  });

  it("scores a well-mapped, engaged account highly and explains why", () => {
    const s = scoreFor(HERO);
    expect(s.band).toBe("High fit");
    expect(s.strengths).toContain("Decision maker identified");
    expect(s.strengths.some((x) => x.startsWith("Expanding into new markets"))).toBe(true);
    expect(s.risks).toContain("Procurement structure unknown");
  });

  it("flags risks for an account with no stakeholders or engagement", () => {
    const s = scoreFor("acc-cold");
    expect(s.risks).toContain("No stakeholders mapped yet");
    expect(s.risks).toContain("No engagement yet");
    expect(s.total).toBeLessThan(scoreFor(HERO).total);
  });

  it("normalises custom weights to 100", () => {
    const s = scoreFor(HERO, { ...DEFAULT_WEIGHTS, marketFit: 40, engagement: 0 });
    expect(s.dimensions.reduce((t, d) => t + d.max, 0)).toBeCloseTo(100);
    expect(s.dimensions.find((d) => d.key === "engagement")!.max).toBe(0);
  });

  it("contains no employer- or industry-specific wording", () => {
    const text = [...scoreFor(HERO).strengths, ...scoreFor(HERO).risks].join(" ");
    expect(text).not.toMatch(/bloom|L&D|training/i);
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

  it("computes response rate only from outbound touches with a recorded outcome", () => {
    expect(commercialMetrics(db.accounts, db.activities, TODAY).responseRate).toBeCloseTo(1 / 2);
  });

  it("never moves the highest stage backwards", () => {
    expect(furthestStage("Proposal", "Contacted")).toBe("Proposal");
    expect(furthestStage("Contacted", "Meeting")).toBe("Meeting");
    expect(furthestStage("Proposal", "Lost")).toBe("Proposal");
  });

  it("finds overdue planned activities only", () => {
    const late = overdue(db.activities, TODAY);
    expect(late.map((a) => a.id)).toEqual(["a-late"]);
  });
});

describe("Opportunity Mapper", () => {
  it("translates a business problem into ranked needs", () => {
    const gaps = capabilityGaps(profile, ["efficiency"]);
    expect(gaps[0].capability).toBe("process-efficiency");
    expect(gaps.map((g) => g.capability)).toEqual(expect.arrayContaining(["cost-reduction", "digital-enablement"]));
  });

  it("matches needs to the best offering", () => {
    const matches = matchProgrammes(capabilityGaps(profile, ["growth"]), db.programmes);
    expect(matches[0].programme.id).toBe("off-a");
    expect(matches.length).toBeLessThanOrEqual(3);
    expect(matchProgrammes([], db.programmes)).toEqual([]);
  });

  it("labels the need as a hypothesis and flags placeholder offerings", () => {
    const inputs = { industry: "Pharmaceuticals", sizeBand: "1000-4999", growthStage: "Rapid growth", challenges: ["efficiency"], targetGroup: "Operations managers", audienceLevel: "Managers", desiredOutcome: "", urgency: "High", knownGaps: "" } as const;
    const gaps = capabilityGaps(profile, [...inputs.challenges]);
    const bc = buildBusinessCase(profile, { ...inputs, challenges: [...inputs.challenges] }, gaps, matchProgrammes(gaps, db.programmes, inputs.audienceLevel));
    expect(bc.capabilityGap.startsWith("Hypothesis:")).toBe(true);
    expect(bc.suggestedSolution).toContain("placeholder");
    expect(bc.discoveryQuestions.length).toBeGreaterThan(0);
    expect(bc.nextAction).toBeTruthy();
  });
});

describe("Brief, deal coach, next action and outreach", () => {
  it("labels every inferred priority and need as a hypothesis", () => {
    const brief = buildAccountBrief(profile, account(HERO), db.contacts, db.activities, db.programmes, scoreFor(HERO), TODAY);
    expect(brief.priorities.every((p) => p.startsWith("Hypothesis:"))).toBe(true);
    expect(brief.gaps.every((g) => g.hypothesis.startsWith("Hypothesis:"))).toBe(true);
  });

  it("produces 5 discovery, 3 follow-up questions and 3 objections, and flags overdue steps", () => {
    const c = coachDeal(profile, db.opportunities[0], account(HERO), db.contacts, db.activities, scoreFor(HERO), TODAY);
    expect(c.discoveryQuestions).toHaveLength(5);
    expect(c.followUpQuestions).toHaveLength(3);
    expect(c.objections).toHaveLength(3);
    expect(c.risks.some((r) => r.includes("overdue"))).toBe(true);
  });

  it("puts overdue actions first, then prefers the champion by first name", () => {
    const contacts = db.contacts.filter((c) => c.accountId === HERO);
    expect(recommendNextAction(profile, account(HERO), contacts, db.activities, TODAY).action).toMatch(/overdue/);
    expect(recommendNextAction(profile, account(HERO), contacts, [], TODAY).action).toContain("Omar");
    expect(firstName("Dr. Sara Nasser")).toBe("Sara");
  });

  it("keeps drafts short and free of banned phrasing", () => {
    for (const type of ["linkedin", "email", "follow-up", "meeting-follow-up", "re-engagement"] as const) {
      const draft = templateDraft({ type, companyName: "Example Co", country: "UAE", contactName: "Omar Farouk", contactTitle: "Head of Operations", observation: "expanding into new markets", capability: "Process efficiency", stage: "Engaged", cta: "a 20-minute conversation", senderName: "Ahmed", senderOrg: "", audience: profile.outreach.audience });
      expect(BANNED_PHRASES.some((p) => draft.body.toLowerCase().includes(p))).toBe(false);
      expect(draft.body).toContain("Omar");
      if (type === "linkedin") expect(draft.body.length).toBeLessThanOrEqual(300);
    }
  });
});

describe("Workspace", () => {
  it("starts empty with placeholder offerings only", () => {
    const fresh = emptyDatabase(profile);
    expect(fresh.accounts).toHaveLength(0);
    expect(fresh.programmes.every((p) => p.isDemo)).toBe(true);
    expect(fresh.users[0].name).toBe("Ahmed Gamal");
  });
});
