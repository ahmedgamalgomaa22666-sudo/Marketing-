import { rate } from "../analytics";
import type { CareerContext, EvidenceEntry, EvidenceStatus, EvidenceTier, RoleType } from "../types";
import { BACKUP_APP, BACKUP_KIND, BACKUP_VERSION, CAPABILITIES, FUNNEL_RATIOS, STANDARD_METRICS, STATUSES, TIERS } from "./config";

/* ---------------------------------------------------------------- Strength (quality, not a score) */

export type Strength = "Strong" | "Moderate" | "Weak";
const STRENGTH_ORDER: Strength[] = ["Weak", "Moderate", "Strong"];

const tierRank = (t: EvidenceTier) => TIERS.indexOf(t);
const statusRank = (s: EvidenceStatus) => (s === "Verified" ? 2 : s === "Supported" ? 1 : 0);

/** A result is measurable when it has a value or states a number. */
export function isMeasurable(e: EvidenceEntry): boolean {
  return e.value !== null || /\d/.test(e.result);
}

/**
 * Evidence strength from tier, status and measurability — never from quantity.
 * Strong requires an Outcome/Achievement that is measurable AND Supported/Verified, so no number
 * of self-recorded activities can outrank one verified achievement.
 */
export function strength(e: EvidenceEntry): Strength {
  const high = tierRank(e.tier) >= tierRank("Outcome");
  if (high && isMeasurable(e) && statusRank(e.status) >= 1) return "Strong";
  if ((high && (isMeasurable(e) || statusRank(e.status) >= 1)) || (e.tier === "Output" && isMeasurable(e) && statusRank(e.status) >= 1)) return "Moderate";
  return "Weak";
}

export function strongest(entries: EvidenceEntry[]): Strength | null {
  if (entries.length === 0) return null;
  return entries.map(strength).sort((a, b) => STRENGTH_ORDER.indexOf(b) - STRENGTH_ORDER.indexOf(a))[0];
}

/** Sort key: strength first, then tier, then status. */
export function qualityRank(e: EvidenceEntry): number {
  return STRENGTH_ORDER.indexOf(strength(e)) * 100 + tierRank(e.tier) * 10 + statusRank(e.status);
}

/* ---------------------------------------------------------------- Roles & filters */

export function roleType(e: EvidenceEntry, contexts: CareerContext[]): RoleType | "Unspecified" {
  const ctx = contexts.find((c) => c.id === e.contextId);
  return ctx?.roles.find((r) => r.title === e.role)?.type ?? "Unspecified";
}

export function yearOf(e: EvidenceEntry): string {
  return e.date && /^\d{4}/.test(e.date) ? e.date.slice(0, 4) : "Undated";
}

export interface EvidenceFilter {
  scope: "all" | "current" | string; // "all" · "current" (non-archived contexts) · a context id
  roleType: string; // "" = any
  year: string;
  market: string;
  industry: string;
}

export const NO_FILTER: EvidenceFilter = { scope: "all", roleType: "", year: "", market: "", industry: "" };

export function applyFilter(entries: EvidenceEntry[], contexts: CareerContext[], f: EvidenceFilter): EvidenceEntry[] {
  const current = new Set(contexts.filter((c) => !c.archived).map((c) => c.id));
  return entries.filter(
    (e) =>
      (f.scope === "all" || (f.scope === "current" ? current.has(e.contextId) : e.contextId === f.scope)) &&
      (!f.roleType || roleType(e, contexts) === f.roleType) &&
      (!f.year || yearOf(e) === f.year) &&
      (!f.market || e.market === f.market) &&
      (!f.industry || e.industry === f.industry),
  );
}

/* ---------------------------------------------------------------- Analytics */

export interface Group {
  key: string;
  count: number;
  strongest: Strength | null;
}

export function groupBy(entries: EvidenceEntry[], keyOf: (e: EvidenceEntry) => string | string[]): Group[] {
  const map = new Map<string, EvidenceEntry[]>();
  for (const e of entries) {
    const keys = [keyOf(e)].flat().map((k) => k || "Not recorded");
    for (const k of keys) map.set(k, [...(map.get(k) ?? []), e]);
  }
  return [...map.entries()].map(([key, list]) => ({ key, count: list.length, strongest: strongest(list) })).sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

/** Sum of recorded values per standard BD metric; metrics with no entries are absent (not 0). */
export function funnelTotals(entries: EvidenceEntry[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const e of entries) {
    if (e.metricKey && e.value !== null) totals[e.metricKey] = (totals[e.metricKey] ?? 0) + e.value;
  }
  return totals;
}

export function funnelRatios(totals: Record<string, number>) {
  return FUNNEL_RATIOS.map((r) => ({
    ...r,
    rate: r.num in totals && r.den in totals ? rate(totals[r.num], totals[r.den]) : null,
  }));
}

export { STANDARD_METRICS };

/** Capabilities with no evidence, or only weak evidence — where CV claims need support. */
export function capabilityGaps(entries: EvidenceEntry[]) {
  return CAPABILITIES.map((cap) => {
    const list = entries.filter((e) => e.capabilities.includes(cap));
    return { capability: cap, count: list.length, strongest: strongest(list) };
  }).filter((c) => c.strongest === null || c.strongest === "Weak");
}

export function qualityIndicators(entries: EvidenceEntry[]) {
  return {
    needsVerification: entries.filter((e) => e.status === "Self-recorded" || e.status === "Needs verification").length,
    achievementsUnverified: entries.filter((e) => e.tier === "Achievement" && statusRank(e.status) < 1).length,
    withoutNumber: entries.filter((e) => !isMeasurable(e)).length,
    withoutDate: entries.filter((e) => !e.date).length,
    withoutContribution: entries.filter((e) => !e.contribution.trim()).length,
    approvedForPublic: entries.filter((e) => e.approvedForPublic).length,
  };
}

/* ---------------------------------------------------------------- CV-ready & interview */

/** What a CV bullet built from this entry is still missing. Never filled in automatically. */
export function cvMissing(e: EvidenceEntry): string[] {
  const missing: string[] = [];
  if (!e.result.trim()) missing.push("result");
  if (!isMeasurable(e)) missing.push("a number (measurement)");
  if (!e.date) missing.push("timeframe / date");
  if (!e.market.trim()) missing.push("market / scope");
  if (!e.contribution.trim()) missing.push("your specific contribution");
  if (statusRank(e.status) < 1) missing.push("supporting evidence or verification source");
  if (!e.publicVersion.trim()) missing.push("public-safe version (needed before any external use)");
  return missing;
}

/** Draft assembled verbatim from the entry's own fields; gaps are shown, never invented. */
export function cvDraft(e: EvidenceEntry, contexts: CareerContext[]): string {
  const ctx = contexts.find((c) => c.id === e.contextId);
  const scope = [ctx?.name, e.market, e.date ? yearOf(e) : null].filter(Boolean).join(", ");
  const result = e.result.trim() || "[missing: result]";
  const contribution = e.contribution.trim() ? ` — ${e.contribution.trim()}` : "";
  return `${result}${contribution}${scope ? ` (${scope})` : ""}`;
}

export function hasStory(e: EvidenceEntry): boolean {
  return Object.values(e.star).some((v) => v.trim());
}

/* ---------------------------------------------------------------- Public firewall helpers */

/** An entry may be approved for public use only with a public-safe version. */
export function canApprove(e: Pick<EvidenceEntry, "publicVersion">): boolean {
  return e.publicVersion.trim().length > 0;
}

/* ---------------------------------------------------------------- Backup */

export interface EvidenceBackup {
  app: string;
  kind: string;
  version: number;
  exportedAt: string;
  careerContexts: CareerContext[];
  evidence: EvidenceEntry[];
}

export function buildBackup(careerContexts: CareerContext[], evidence: EvidenceEntry[]): EvidenceBackup {
  return { app: BACKUP_APP, kind: BACKUP_KIND, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), careerContexts, evidence };
}

/** Validates an evidence backup file. Returns the parsed backup or a human-readable error. */
export function parseBackup(text: string): { ok: true; backup: EvidenceBackup } | { ok: false; error: string } {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: "This file is not valid JSON." };
  }
  const d = data as Partial<EvidenceBackup>;
  if (!d || d.app !== BACKUP_APP || d.kind !== BACKUP_KIND) return { ok: false, error: "This file is not a Career Evidence backup from this application." };
  if (d.version !== BACKUP_VERSION) return { ok: false, error: `Unsupported backup version (${String(d.version)}).` };
  if (!Array.isArray(d.careerContexts) || !Array.isArray(d.evidence)) return { ok: false, error: "The backup is missing its career contexts or evidence." };
  const badCtx = d.careerContexts.find((c) => typeof c?.id !== "string" || typeof c?.name !== "string" || !Array.isArray(c?.roles));
  if (badCtx) return { ok: false, error: "A career context in the backup is malformed." };
  const ids = new Set(d.careerContexts.map((c) => c.id));
  const badEv = d.evidence.find(
    (e) => typeof e?.id !== "string" || !TIERS.includes(e?.tier) || !STATUSES.includes(e?.status) || typeof e?.result !== "string" || !ids.has(e?.contextId) || typeof e?.star !== "object",
  );
  if (badEv) return { ok: false, error: "An evidence entry in the backup is malformed or points to a missing career context." };
  return { ok: true, backup: d as EvidenceBackup };
}
