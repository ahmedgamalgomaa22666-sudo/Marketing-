import { CAPABILITIES, SIGNALS, SIZE_BANDS, STAKEHOLDER_ROLES } from "../config";
import type { FitScore } from "../scoring";
import type { Account, Activity, CapabilityKey, Contact, LeadershipLevel, Programme, StakeholderRole } from "../types";
import { capabilityGaps, matchProgrammes, type ProgrammeMatch } from "./mapper";
import { recommendNextAction, type NextAction } from "./nextAction";
import { PLAYBOOKS, SIGNAL_INSIGHTS } from "./playbooks";

export interface AccountBrief {
  overview: { label: string; value: string }[];
  context: string;
  recordedSignals: string[];
  priorities: string[];
  gaps: { capability: CapabilityKey; label: string; hypothesis: string }[];
  stakeholders: { role: StakeholderRole; contacts: Contact[] }[];
  coverageGaps: string[];
  salesAngle: string;
  discoveryQuestions: string[];
  objections: { objection: string; approach: string }[];
  nextAction: NextAction;
  solutions: ProgrammeMatch[];
}

export function buildAccountBrief(
  account: Account,
  contacts: Contact[],
  activities: Activity[],
  programmes: Programme[],
  score: FitScore,
  today?: string,
): AccountBrief {
  const playbook = PLAYBOOKS[account.industry];
  const insights = account.signals.map((s) => SIGNAL_INSIGHTS[s]);

  const priorities = [...insights.map((i) => i.hypothesis), ...playbook.priorities].slice(0, 5).map((p) => `Hypothesis: ${capitalise(p)}.`);

  // Signal capabilities count double: they come from observations about this account.
  const signalCaps = insights.flatMap((i) => i.capabilities);
  const weights = new Map<CapabilityKey, number>();
  signalCaps.forEach((c) => weights.set(c, (weights.get(c) ?? 0) + 2));
  playbook.gaps.forEach((c) => weights.set(c, (weights.get(c) ?? 0) + 1));
  const rankedCaps = [...weights.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c).slice(0, 4);
  const gaps = rankedCaps.map((capability) => ({
    capability,
    label: CAPABILITIES[capability],
    hypothesis: `Hypothesis: ${CAPABILITIES[capability].toLowerCase()} may be a development need — validate with HR / L&D.`,
  }));

  const stakeholders = STAKEHOLDER_ROLES.map((role) => ({ role, contacts: contacts.filter((c) => c.role === role) })).filter((g) => g.contacts.length > 0);
  const coverageGaps: string[] = [];
  if (!contacts.some((c) => c.role === "Decision Maker")) coverageGaps.push("No decision maker identified");
  if (!contacts.some((c) => c.role === "Champion")) coverageGaps.push("No internal champion yet");
  if (!contacts.some((c) => c.role === "Procurement")) coverageGaps.push("Procurement contact unknown");

  const leadInsight = insights[0];
  const salesAngle = leadInsight
    ? `${playbook.angle} Lead with the observation that ${account.name} is ${leadInsight.observation}, and ask how it affects their managers.`
    : playbook.angle;

  const level: LeadershipLevel = account.signals.includes("leadership-succession") ? "Senior leaders" : account.signals.includes("new-managers") || account.signals.includes("rapid-growth") ? "Frontline" : "Middle management";
  const solutions = matchProgrammes(
    capabilityGaps([], rankedCaps).map((g, i) => ({ ...g, weight: rankedCaps.length - i })),
    programmes,
    level,
  );

  const band = SIZE_BANDS.find((b) => b.id === account.sizeBand);
  return {
    overview: [
      { label: "Market", value: `${account.city}, ${account.country}` },
      { label: "Industry", value: account.industry },
      { label: "Size", value: band?.label ?? account.sizeBand },
      { label: "Stage", value: account.stage },
      { label: "Priority", value: account.priority },
      { label: "Fit score", value: `${score.total} / 100 (${score.band})` },
    ],
    context: playbook.context,
    recordedSignals: account.signals.map((s) => SIGNALS[s]),
    priorities,
    gaps,
    stakeholders,
    coverageGaps,
    salesAngle,
    discoveryQuestions: [...new Set([...insights.map((i) => i.question), ...playbook.questions, "How is learning investment decided and measured today?"])].slice(0, 6),
    objections: playbook.objections,
    nextAction: recommendNextAction(account, contacts, activities, today),
    solutions,
  };
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
