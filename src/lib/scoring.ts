import { DEFAULT_WEIGHTS, MARKET_ATTRACTIVENESS, SCORE_DIMENSIONS, SIGNALS, SIZE_BANDS, type ScoreDimension } from "./config";
import { daysBetween, todayISO } from "./dates";
import type { Account, AccountScore, Activity, Contact } from "./types";
import { funnelIndex } from "./analytics";

export interface DimensionResult {
  key: ScoreDimension;
  label: string;
  /** 0–1 share of the dimension achieved. */
  fraction: number;
  max: number;
  points: number;
}

export interface FitScore {
  total: number;
  band: "High fit" | "Medium fit" | "Low fit";
  dimensions: DimensionResult[];
  strengths: string[];
  risks: string[];
}

export interface ScoreInput {
  account: Account;
  score?: AccountScore;
  contacts: Contact[];
  activities: Activity[];
  weights?: Record<ScoreDimension, number>;
  today?: string;
}

const HR_DEPT = /\b(hr|human|people|talent|learning|l&d|capability|academy)\b/i;
const NEED_SIGNALS = ["rapid-growth", "new-managers", "nationalisation", "digital-transformation", "restructuring", "sales-pressure", "customer-experience", "leadership-succession"] as const;

/** Engagement credit by furthest funnel stage reached. */
const STAGE_ENGAGEMENT = [0, 0.1, 0.3, 0.6, 0.75, 0.85, 1, 1, 1];

export function isHrContact(c: Contact): boolean {
  return HR_DEPT.test(c.department) || HR_DEPT.test(c.title);
}

/**
 * Transparent Account Fit Score (0–100). Every dimension is a 0–1 fraction multiplied by
 * its weight, and every point comes with a plain-language reason or risk.
 */
export function computeFitScore({ account, score, contacts, activities, weights = DEFAULT_WEIGHTS, today = todayISO() }: ScoreInput): FitScore {
  const strengths: string[] = [];
  const risks: string[] = [];
  const f: Record<ScoreDimension, number> = {
    marketFit: 0,
    companyPotential: 0,
    trainingNeed: 0,
    stakeholderAccess: 0,
    strategicRelevance: 0,
    engagement: 0,
  };

  // Market fit
  const market = MARKET_ATTRACTIVENESS[account.country][account.industry];
  f.marketFit = market;
  if (market >= 0.85) strengths.push(`Attractive ${account.industry.toLowerCase()} learning market in ${account.country}`);
  else if (market < 0.7) risks.push(`${account.industry} is a lower-priority learning market in ${account.country}`);

  // Company potential
  const band = SIZE_BANDS.find((b) => b.id === account.sizeBand) ?? SIZE_BANDS[0];
  f.companyPotential = band.points;
  if (band.points >= 0.85) strengths.push(`Large workforce (${band.label})`);
  else if (band.points < 0.5) risks.push("Smaller workforce may limit programme scale");

  // Training need: BD rating (70%) + observable need signals (30%)
  const needRating = score?.ratings.trainingNeed ?? 0;
  const needSignals = account.signals.filter((s) => (NEED_SIGNALS as readonly string[]).includes(s));
  f.trainingNeed = (needRating / 5) * 0.7 + (Math.min(needSignals.length, 3) / 3) * 0.3;
  needSignals.slice(0, 3).forEach((s) => strengths.push(`Signal: ${SIGNALS[s]}`));
  if (!score) risks.push("Training need not yet assessed");
  else if (needRating <= 2) risks.push("Limited evidence of a learning need — validate in discovery");

  // Stakeholder access
  const hasHr = contacts.some(isHrContact);
  const hasDm = contacts.some((c) => c.role === "Decision Maker");
  const hasChampion = contacts.some((c) => c.role === "Champion");
  f.stakeholderAccess = (hasHr ? 0.4 : 0) + (hasDm ? 0.3 : 0) + (hasChampion ? 0.3 : 0);
  if (hasHr) strengths.push("Identified HR / L&D stakeholder");
  if (hasDm) strengths.push("Decision maker identified");
  if (hasChampion) strengths.push("Internal champion identified");
  if (contacts.length === 0) risks.push("No stakeholders mapped yet");
  else {
    if (!hasDm) risks.push("Decision maker not yet identified");
    if (!hasHr) risks.push("No HR / L&D contact identified");
  }
  if (!contacts.some((c) => c.role === "Procurement") && funnelIndex(account.highestStage) >= funnelIndex("Contacted")) {
    risks.push("Procurement structure unknown");
  }
  const dmIds = contacts.filter((c) => c.role === "Decision Maker").map((c) => c.id);
  if (dmIds.length && !activities.some((a) => a.status === "done" && a.contactId !== null && dmIds.includes(a.contactId))) {
    risks.push("Decision maker not yet engaged directly");
  }

  // Strategic relevance: BD rating (80%) + expansion / succession signals (20%)
  const stratRating = score?.ratings.strategicRelevance ?? 0;
  const expansion = account.signals.includes("gcc-expansion");
  const succession = account.signals.includes("leadership-succession");
  f.strategicRelevance = (stratRating / 5) * 0.8 + (expansion || succession ? 0.2 : 0);
  if (expansion) strengths.push("GCC expansion — potential multi-country programme");
  if (stratRating >= 4) strengths.push("High strategic / reference value for Bloom");
  if (score && stratRating <= 2) risks.push("Low strategic relevance rating");

  // Engagement
  const idx = funnelIndex(account.highestStage);
  let engagement = idx >= 0 ? STAGE_ENGAGEMENT[idx] : 0;
  if (account.stage === "Lost") engagement = 0.1;
  if (account.stage === "Nurture") engagement *= 0.5;
  const recentPositive = activities.some((a) => a.status === "done" && a.outcome === "positive" && daysBetween(a.date, today) <= 30);
  if (recentPositive) engagement = Math.min(1, engagement + 0.2);
  f.engagement = engagement;
  if (idx >= funnelIndex("Engaged") && account.stage !== "Lost") strengths.push(`Two-way engagement (${account.highestStage} reached)`);
  else risks.push("No engagement yet");
  if (account.lastContactedAt && daysBetween(account.lastContactedAt, today) > 30 && !["Won", "Lost"].includes(account.stage)) {
    risks.push("No contact in over 30 days");
  }

  const totalWeight = Object.values(weights).reduce((s, w) => s + w, 0) || 1;
  const dimensions = SCORE_DIMENSIONS.map(({ key, label }) => {
    const max = (weights[key] / totalWeight) * 100;
    const fraction = Math.max(0, Math.min(1, f[key]));
    return { key, label, fraction, max, points: fraction * max };
  });
  const total = Math.round(dimensions.reduce((s, d) => s + d.points, 0));

  return {
    total,
    band: total >= 75 ? "High fit" : total >= 55 ? "Medium fit" : "Low fit",
    dimensions,
    strengths,
    risks,
  };
}
