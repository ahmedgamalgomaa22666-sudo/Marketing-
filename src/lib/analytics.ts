import { ACCOUNT_STAGES, COUNTRIES, FUNNEL_STAGES, OUTBOUND_TYPES } from "./config";
import { daysBetween, todayISO } from "./dates";
import type { Account, AccountStage, Activity } from "./types";

/** Position in the linear funnel; -1 for Lost / Nurture. */
export function funnelIndex(stage: AccountStage): number {
  return (FUNNEL_STAGES as readonly string[]).indexOf(stage);
}

export function reached(account: Account, stage: AccountStage): boolean {
  return funnelIndex(account.highestStage) >= funnelIndex(stage);
}

/** Returns the further of two stages; used when an account moves forward. */
export function furthestStage(a: AccountStage, b: AccountStage): AccountStage {
  return funnelIndex(b) > funnelIndex(a) ? b : a;
}

/** null when the denominator is zero — never a fabricated rate. */
export function rate(numerator: number, denominator: number): number | null {
  return denominator > 0 ? numerator / denominator : null;
}

export function formatRate(r: number | null): string {
  return r === null ? "—" : `${Math.round(r * 100)}%`;
}

export interface Conversion {
  from: AccountStage;
  to: AccountStage;
  fromCount: number;
  toCount: number;
  rate: number | null;
}

const CONVERSION_PAIRS: [AccountStage, AccountStage][] = [
  ["Contacted", "Engaged"],
  ["Engaged", "Qualified"],
  ["Qualified", "Meeting"],
  ["Meeting", "Proposal"],
  ["Proposal", "Won"],
];

export function funnelConversions(accounts: Account[]): Conversion[] {
  return CONVERSION_PAIRS.map(([from, to]) => {
    const fromCount = accounts.filter((a) => reached(a, from)).length;
    const toCount = accounts.filter((a) => reached(a, to)).length;
    return { from, to, fromCount, toCount, rate: rate(toCount, fromCount) };
  });
}

export function pipelineKpis(accounts: Account[]) {
  const count = (s: AccountStage) => accounts.filter((a) => reached(a, s)).length;
  return {
    total: accounts.length,
    contacted: count("Contacted"),
    engaged: count("Engaged"),
    qualified: count("Qualified"),
    meetings: count("Meeting"),
    proposals: count("Proposal"),
    won: accounts.filter((a) => a.stage === "Won").length,
    lost: accounts.filter((a) => a.stage === "Lost").length,
  };
}

export function stageDistribution(accounts: Account[]) {
  return ACCOUNT_STAGES.map((stage) => ({ stage, count: accounts.filter((a) => a.stage === stage).length }));
}

export function countryDistribution(accounts: Account[]) {
  return COUNTRIES.map((country) => {
    const inCountry = accounts.filter((a) => a.country === country);
    return {
      country,
      total: inCountry.length,
      active: inCountry.filter((a) => reached(a, "Contacted") && !["Won", "Lost"].includes(a.stage)).length,
      won: inCountry.filter((a) => a.stage === "Won").length,
    };
  });
}

export function commercialMetrics(accounts: Account[], activities: Activity[], today: string = todayISO()) {
  const outbound = activities.filter((a) => a.status === "done" && (OUTBOUND_TYPES as readonly string[]).includes(a.type) && a.outcome !== null);
  const responded = outbound.filter((a) => a.outcome !== "no-response").length;
  const [contactedToEngaged, engagedToQualified, qualifiedToMeeting, meetingToProposal] = funnelConversions(accounts);
  const won = accounts.filter((a) => a.stage === "Won").length;
  const lostLate = accounts.filter((a) => a.stage === "Lost" && reached(a, "Proposal")).length;
  return {
    responseRate: rate(responded, outbound.length),
    engagementRate: contactedToEngaged.rate,
    qualificationRate: engagedToQualified.rate,
    meetingConversion: qualifiedToMeeting.rate,
    proposalConversion: meetingToProposal.rate,
    winRate: rate(won, won + lostLate),
    activitiesCompleted30d: activities.filter((a) => a.status === "done" && a.type !== "Note" && daysBetween(a.date, today) <= 30 && daysBetween(a.date, today) >= 0).length,
    overdueActions: overdue(activities, today).length,
  };
}

export function overdue(activities: Activity[], today: string = todayISO()): Activity[] {
  return activities.filter((a) => a.status === "planned" && a.date < today).sort((a, b) => a.date.localeCompare(b.date));
}

export function dueToday(activities: Activity[], today: string = todayISO()): Activity[] {
  return activities.filter((a) => a.status === "planned" && a.date === today);
}

export function upcoming(activities: Activity[], today: string = todayISO()): Activity[] {
  return activities.filter((a) => a.status === "planned" && a.date > today).sort((a, b) => a.date.localeCompare(b.date));
}

/** An account "has a next action" if it has a planned activity or a future follow-up date. */
export function hasNextAction(account: Account, activities: Activity[], today: string = todayISO()): boolean {
  return (
    activities.some((a) => a.accountId === account.id && a.status === "planned") ||
    (account.nextFollowUpAt !== null && account.nextFollowUpAt >= today)
  );
}

export function isOpen(account: Account): boolean {
  return !["Won", "Lost"].includes(account.stage);
}
