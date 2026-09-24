import { SIZE_BANDS, STAKEHOLDER_ROLES } from "../config";
import type { WorkspaceProfile } from "../profile/types";
import type { FitScore } from "../scoring";
import type { Account, Activity, CapabilityKey, Contact, Programme, StakeholderRole } from "../types";
import { capabilityGaps, matchProgrammes, type ProgrammeMatch } from "./mapper";
import { recommendNextAction, type NextAction } from "./nextAction";

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
  profile: WorkspaceProfile,
  account: Account,
  contacts: Contact[],
  activities: Activity[],
  programmes: Programme[],
  score: FitScore,
  today?: string,
): AccountBrief {
  const playbook = profile.playbooks[account.industry] ?? profile.defaultPlaybook;
  const insights = account.signals.map((s) => profile.signals[s]).filter(Boolean);
  const needLabel = (c: string) => profile.needs[c] ?? c;

  const priorities = [...insights.map((i) => i.hypothesis), ...playbook.priorities].slice(0, 5).map((p) => `Hypothesis: ${capitalise(p)}.`);

  // Signal capabilities count double: they come from observations about this account.
  const signalCaps = insights.flatMap((i) => i.needs);
  const weights = new Map<CapabilityKey, number>();
  signalCaps.forEach((c) => weights.set(c, (weights.get(c) ?? 0) + 2));
  playbook.needs.forEach((c) => weights.set(c, (weights.get(c) ?? 0) + 1));
  const rankedCaps = [...weights.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c).slice(0, 4);
  const gaps = rankedCaps.map((capability) => ({
    capability,
    label: needLabel(capability),
    hypothesis: `Hypothesis: ${needLabel(capability).toLowerCase()} may be a priority need — validate with the ${profile.buyerFunction.label} stakeholder.`,
  }));

  const stakeholders = STAKEHOLDER_ROLES.map((role) => ({ role, contacts: contacts.filter((c) => c.role === role) })).filter((g) => g.contacts.length > 0);
  const coverageGaps: string[] = [];
  if (!contacts.some((c) => c.role === "Decision Maker")) coverageGaps.push("No decision maker identified");
  if (!contacts.some((c) => c.role === "Champion")) coverageGaps.push("No internal champion yet");
  if (!contacts.some((c) => c.role === "Procurement")) coverageGaps.push("Procurement contact unknown");

  const leadInsight = insights[0];
  const salesAngle = leadInsight
    ? `${playbook.angle} Lead with the observation that ${account.name} is ${leadInsight.observation}, and ask how it affects their priorities.`
    : playbook.angle;

  const solutions = matchProgrammes(
    capabilityGaps(profile, [], rankedCaps).map((g, i) => ({ ...g, weight: rankedCaps.length - i })),
    programmes,
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
    recordedSignals: account.signals.map((s) => profile.signals[s]?.label ?? s),
    priorities,
    gaps,
    stakeholders,
    coverageGaps,
    salesAngle,
    discoveryQuestions: [...new Set([...insights.map((i) => i.question), ...playbook.questions, "How is learning investment decided and measured today?"])].slice(0, 6),
    objections: playbook.objections,
    nextAction: recommendNextAction(profile, account, contacts, activities, today),
    solutions,
  };
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
