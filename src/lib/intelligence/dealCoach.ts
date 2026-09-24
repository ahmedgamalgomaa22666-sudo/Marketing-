import { daysBetween, todayISO } from "../dates";
import type { FitScore } from "../scoring";
import type { Account, Activity, Contact, Opportunity, OpportunityStage } from "../types";
import { PLAYBOOKS } from "./playbooks";

export interface DealCoaching {
  known: string[];
  unknown: string[];
  risks: string[];
  discoveryQuestions: string[];
  followUpQuestions: string[];
  objections: { objection: string; approach: string }[];
  nextAction: string;
  lastInteraction: Activity | null;
  nextScheduled: Activity | null;
}

const DISCOVERY: Record<OpportunityStage, string[]> = {
  Qualified: [
    "Consider exploring what triggered interest in this now — what changed?",
    "Validate whether the problem is felt by the business sponsor, not only by HR.",
    "Consider asking how the target group is developed today and what has not worked.",
    "Validate who else must agree before a programme goes ahead.",
    "Consider exploring how success would be measured six months after the programme.",
  ],
  Meeting: [
    "Consider asking the decision maker how this initiative links to this year's business priorities.",
    "Validate the size and seniority of the target group.",
    "Consider exploring preferred format: cohort, modular, in-house or blended.",
    "Validate the budget range and which budget line it would come from.",
    "Consider asking what would make them choose one provider over another.",
  ],
  Proposal: [
    "Validate whether the proposal reflects the business problem in their own words.",
    "Consider asking what is missing before they can recommend it internally.",
    "Validate the decision date and the steps between now and then.",
    "Consider exploring procurement requirements: vendor registration, documents, payment terms.",
    "Consider asking who else is being evaluated.",
  ],
  Negotiation: [
    "Validate which terms remain open and who can agree them.",
    "Consider exploring whether scope, timing or group size could flex instead of price.",
    "Validate the start date and participant nomination process.",
    "Consider asking what could still delay the signature.",
    "Validate how impact will be reported to the sponsor.",
  ],
  Won: [
    "Consider exploring what made them choose Bloom — useful for future positioning.",
    "Validate the success measures agreed for delivery.",
    "Consider asking which other teams face a similar challenge.",
    "Validate the reporting cadence the sponsor expects.",
    "Consider asking whether they would act as a reference after delivery.",
  ],
  Lost: [
    "Consider asking what the deciding factor was.",
    "Validate whether the need still exists and when it might be revisited.",
    "Consider exploring what Bloom could have done differently.",
    "Validate whether the relationship can continue through insight sharing.",
    "Consider asking who else in the organisation may have a related need.",
  ],
};

const FOLLOW_UPS = [
  "You mentioned [their point] — can you say more about how it shows up day to day?",
  "What would happen if nothing changes in the next 12 months?",
  "Who would be most affected — positively or negatively — by this programme?",
];

const GENERIC_OBJECTIONS = [
  { objection: "There's no budget this year.", approach: "Explore the budget cycle and whether a smaller pilot could be funded now; validate who could unlock budget." },
  { objection: "We can do this in-house.", approach: "Acknowledge internal strengths; explore capacity, external perspective and whether a blended model helps." },
];

export function coachDeal(opp: Opportunity, account: Account, contacts: Contact[], activities: Activity[], score: FitScore, today: string = todayISO()): DealCoaching {
  const oppContacts = contacts.filter((c) => opp.contactIds.includes(c.id) || c.id === opp.primaryContactId);
  const acts = activities.filter((a) => a.opportunityId === opp.id || (a.accountId === account.id && !a.opportunityId));
  const done = acts.filter((a) => a.status === "done").sort((a, b) => b.date.localeCompare(a.date));
  const planned = acts.filter((a) => a.status === "planned").sort((a, b) => a.date.localeCompare(b.date));

  const known: string[] = [];
  if (opp.businessProblem) known.push(`Business problem (as understood): ${opp.businessProblem}`);
  if (oppContacts.length) known.push(`${oppContacts.length} stakeholder(s) involved: ${oppContacts.map((c) => `${c.name} (${c.role})`).join(", ")}`);
  if (opp.estimatedValue !== null) known.push(`Estimated value: ${opp.estimatedValue.toLocaleString()} ${opp.currency}`);
  if (opp.targetCloseDate) known.push(`Target close date: ${opp.targetCloseDate}`);

  const unknown: string[] = [];
  const hasDm = oppContacts.some((c) => c.role === "Decision Maker");
  if (!opp.businessProblem) unknown.push("The business problem in the client's own words");
  if (!hasDm) unknown.push("Who makes the final decision");
  if (!contacts.some((c) => c.role === "Procurement")) unknown.push("Procurement process and vendor requirements");
  if (opp.estimatedValue === null) unknown.push("Budget range / estimated value");
  if (!opp.targetCloseDate) unknown.push("Decision timeline");
  unknown.push("How success will be measured");

  const risks: string[] = [];
  if (oppContacts.length <= 1) risks.push("Potential risk: single-threaded — only one stakeholder engaged.");
  if (!hasDm && ["Meeting", "Proposal", "Negotiation"].includes(opp.stage)) risks.push("Potential risk: advanced stage without decision-maker access.");
  const last = done[0] ?? null;
  if (!last || daysBetween(last.date, today) > 14) risks.push("Potential risk: no recorded interaction in the last 14 days.");
  if (!opp.nextStep) risks.push("Potential risk: no agreed next step.");
  else if (opp.nextStepDate && opp.nextStepDate < today) risks.push("Potential risk: the agreed next step is overdue.");
  if (opp.targetCloseDate && opp.targetCloseDate < today && !["Won", "Lost"].includes(opp.stage)) risks.push("Potential risk: target close date has passed.");
  score.risks.filter((r) => r.includes("Procurement")).forEach((r) => risks.push(`Potential risk: ${r.toLowerCase()}.`));

  const nextAction = !hasDm && opp.stage !== "Won" && opp.stage !== "Lost"
    ? "Possible next step: ask your champion to introduce you to the decision maker, framed around the business outcome."
    : opp.nextStep
      ? `Possible next step: ${opp.nextStep}`
      : "Possible next step: agree a dated next step with the primary stakeholder.";

  return {
    known,
    unknown,
    risks: [...new Set(risks)],
    discoveryQuestions: DISCOVERY[opp.stage],
    followUpQuestions: FOLLOW_UPS,
    objections: [PLAYBOOKS[account.industry].objections[0], ...GENERIC_OBJECTIONS].slice(0, 3),
    nextAction,
    lastInteraction: last,
    nextScheduled: planned[0] ?? null,
  };
}
