import { addDays } from "../dates";
import type { WorkspaceProfile } from "../profile/types";
import { emptyDatabase } from "../store/empty";
import type { Account, Activity, Contact, Database, Opportunity } from "../types";

/** Small, neutral, fictional dataset for unit tests only. */
export const HERO = "acc-hero";

export function fixtureDb(profile: WorkspaceProfile, today: string): Database {
  const db = emptyDatabase(profile);
  const stamp = `${today}T09:00:00.000Z`;
  const base = { createdAt: stamp, updatedAt: stamp };
  const acc = (id: string, over: Partial<Account>): Account => ({
    id, name: id, country: "UAE", city: "Dubai", industry: "Pharmaceuticals", sizeBand: "1000-4999", website: "", ownerId: "u-me",
    stage: "Target", highestStage: "Target", priority: "Medium", potential: "Medium", signals: [], tags: [], notes: "",
    lastContactedAt: null, nextFollowUpAt: null, isDemo: true, ...base, ...over,
  });
  const con = (id: string, accountId: string, name: string, title: string, department: string, role: Contact["role"]): Contact => ({
    id, accountId, name, title, department, seniority: "VP / Director", role, linkedinUrl: "", email: "", phone: "", notes: "", lastInteractionAt: null, nextAction: "", ...base,
  });
  const act = (id: string, accountId: string, over: Partial<Activity>): Activity => ({
    id, accountId, opportunityId: null, contactId: null, type: "Call", status: "done", summary: id, date: today, outcome: null, ...base, ...over,
  });

  db.accounts = [
    acc(HERO, { stage: "Engaged", highestStage: "Engaged", priority: "High", signals: ["expansion", "performance-pressure"], lastContactedAt: addDays(today, -3) }),
    acc("acc-cold", { sizeBand: "50-249", priority: "High" }),
    acc("acc-lost", { stage: "Lost", highestStage: "Proposal" }),
    acc("acc-won", { stage: "Won", highestStage: "Won" }),
  ];
  db.accountScores = [
    { id: "s1", accountId: HERO, ratings: { needStrength: 5, strategicRelevance: 5 }, evidence: "", ...base },
    { id: "s2", accountId: "acc-cold", ratings: { needStrength: 2, strategicRelevance: 2 }, evidence: "", ...base },
  ];
  db.contacts = [
    con("c-dm", HERO, "Dr. Sara Nasser", "Chief Commercial Officer", "Commercial", "Decision Maker"),
    con("c-ch", HERO, "Omar Farouk", "Head of Operations", "Operations", "Champion"),
  ];
  const opp: Opportunity = {
    id: "opp-1", accountId: HERO, name: "Efficiency initiative", stage: "Proposal", programmeIds: ["off-b"], primaryContactId: "c-ch", contactIds: ["c-ch"],
    estimatedValue: null, currency: "AED", probability: null, targetCloseDate: null, businessProblem: "Manual order processing", nextStep: "Proposal follow-up",
    nextStepDate: addDays(today, -2), notes: "", ...base,
  };
  db.opportunities = [opp];
  db.activities = [
    act("a-pos", HERO, { contactId: "c-ch", outcome: "positive", date: addDays(today, -3) }),
    act("a-none", "acc-cold", { type: "Email", outcome: "no-response", date: addDays(today, -5) }),
    act("a-late", HERO, { status: "planned", type: "Follow-up", date: addDays(today, -1), opportunityId: "opp-1" }),
  ];
  return db;
}
