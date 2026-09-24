import type { WorkspaceProfile } from "../profile/types";
import type { BusinessCase, CapabilityKey, LeadershipLevel, MapperInputs, Programme } from "../types";

export interface GapResult {
  capability: CapabilityKey;
  label: string;
  weight: number;
  because: string[];
}

export interface ProgrammeMatch {
  programme: Programme;
  fit: number; // 0–100
  covered: CapabilityKey[];
  levelMatch: boolean;
}

/** Step 2: translate selected business problems into ranked needs (capability gaps for Bloom). */
export function capabilityGaps(profile: WorkspaceProfile, challengeKeys: string[], extra: CapabilityKey[] = []): GapResult[] {
  const map = new Map<CapabilityKey, GapResult>();
  const add = (cap: CapabilityKey, weight: number, reason: string) => {
    const existing = map.get(cap) ?? { capability: cap, label: profile.needs[cap] ?? cap, weight: 0, because: [] };
    existing.weight += weight;
    if (!existing.because.includes(reason)) existing.because.push(reason);
    map.set(cap, existing);
  };
  for (const key of challengeKeys) {
    const c = profile.challenges.find((x) => x.key === key);
    // Earlier needs in each challenge are the primary ones.
    c?.needs.forEach((cap, i) => add(cap, 3 - i, c.label));
  }
  extra.forEach((cap) => add(cap, 1, "Recorded account signal"));
  return [...map.values()].sort((a, b) => b.weight - a.weight || a.label.localeCompare(b.label));
}

/** Step 3: rank programmes by weighted capability coverage, with a small level bonus. */
export function matchProgrammes(gaps: GapResult[], programmes: Programme[], level?: LeadershipLevel): ProgrammeMatch[] {
  const total = gaps.reduce((s, g) => s + g.weight, 0);
  if (total === 0) return [];
  return programmes
    .map((programme) => {
      const covered = gaps.filter((g) => programme.capabilities.includes(g.capability));
      const coverage = covered.reduce((s, g) => s + g.weight, 0) / total;
      const levelMatch = level ? programme.levels.includes(level) : false;
      const fit = Math.round(Math.min(1, coverage * 0.85 + (levelMatch ? 0.15 : 0)) * 100);
      return { programme, fit, covered: covered.map((g) => g.capability), levelMatch };
    })
    .filter((m) => m.covered.length > 0)
    .sort((a, b) => b.fit - a.fit)
    .slice(0, 3);
}

export const VALIDATION_QUESTIONS = [
  "Does the stakeholder agree this capability gap is real and a priority this year?",
  "Who sponsors the initiative, and who signs off budget?",
  "How would the business measure success 6 months after implementation?",
  "What timing, format and group size would work operationally?",
];

/** Step 4: assemble a business case. Everything is framed as a hypothesis to validate. */
export function buildBusinessCase(profile: WorkspaceProfile, inputs: MapperInputs, gaps: GapResult[], matches: ProgrammeMatch[]): BusinessCase {
  const selected = profile.challenges.filter((c) => inputs.challenges.includes(c.key));
  const top = matches[0]?.programme;
  const gapLabels = gaps.slice(0, 3).map((g) => g.label.toLowerCase());
  return {
    challenge:
      selected.length > 0
        ? `${selected.map((c) => c.label).join("; ")} — in a ${inputs.growthStage.toLowerCase()} ${inputs.industry.toLowerCase()} organisation.`
        : "Business challenge not yet defined.",
    capabilityGap: gapLabels.length ? `Hypothesis: ${inputs.targetGroup || "the target group"} may need stronger ${joinList(gapLabels)}.` : "No capability gap identified yet.",
    suggestedSolution: top ? `${top.name}${top.isDemo ? ` (placeholder — replace with a real ${profile.terminology.offering.toLowerCase()})` : ""}` : `No matching ${profile.terminology.offering.toLowerCase()} in the catalogue — consider a custom solution.`,
    targetAudience: `${inputs.targetGroup || "Target group to be confirmed"} · ${inputs.audienceLevel}`,
    expectedOutcome: inputs.desiredOutcome.trim() || selected[0]?.outcome || "Outcome to be agreed with the sponsor.",
    discoveryQuestions: unique([...selected.map((c) => c.question), "What has already been tried, and what did it achieve?", "What would make this a priority in the next two quarters?"]).slice(0, 5),
    validationQuestions: VALIDATION_QUESTIONS,
    nextAction: `Validate the need and success measures with the sponsor, then agree a dated next step.`,
  };
}

function unique<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}

export function joinList(xs: string[]): string {
  if (xs.length <= 1) return xs.join("");
  return `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}
