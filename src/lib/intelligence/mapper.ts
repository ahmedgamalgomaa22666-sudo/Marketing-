import { CAPABILITIES } from "../config";
import type { BusinessCase, CapabilityKey, LeadershipLevel, MapperInputs, Programme } from "../types";

/** Business challenges a BD can select in the Training Opportunity Mapper. */
export const CHALLENGES: {
  key: string;
  label: string;
  gaps: CapabilityKey[];
  outcome: string;
  question: string;
}[] = [
  { key: "new-managers", label: "Rapid promotion of new managers", gaps: ["people-management", "coaching", "delegation"], outcome: "Faster, more confident transition into management and fewer escalations", question: "How are new managers supported during their first 90 days?" },
  { key: "sales-underperformance", label: "Sales underperformance", gaps: ["consultative-selling", "negotiation", "sales-leadership"], outcome: "Higher conversion and deal quality", question: "Where in the sales process are deals being lost?" },
  { key: "cross-functional-friction", label: "Cross-functional friction", gaps: ["collaboration", "communication", "people-management"], outcome: "Faster decisions and fewer hand-off failures between teams", question: "Which hand-offs between teams cause the most delay or rework?" },
  { key: "leadership-pipeline", label: "Weak leadership pipeline / succession", gaps: ["strategic-leadership", "change-leadership", "coaching"], outcome: "Ready-now successors for critical roles", question: "Which critical roles have no ready successor today?" },
  { key: "transformation", label: "Transformation or restructuring", gaps: ["change-leadership", "communication", "strategic-leadership"], outcome: "Leaders who sustain adoption of the change", question: "What do leaders need to do differently for the change to stick?" },
  { key: "customer-experience", label: "Inconsistent customer experience", gaps: ["customer-experience", "coaching", "communication"], outcome: "More consistent service standards across teams and sites", question: "Where is customer experience most inconsistent, and why?" },
  { key: "national-talent", label: "Developing national talent", gaps: ["people-management", "business-acumen", "communication"], outcome: "Accelerated readiness of national talent for leadership roles", question: "What stops national hires progressing into leadership roles faster?" },
  { key: "market-expansion", label: "Scaling into new GCC markets", gaps: ["strategic-leadership", "business-acumen", "collaboration"], outcome: "Leaders able to build and run teams in new markets", question: "What capabilities will leaders in new markets need in year one?" },
  { key: "decision-quality", label: "Slow or intuition-led decisions", gaps: ["data-decisions", "business-acumen"], outcome: "Faster, evidence-based management decisions", question: "Which recurring decisions would benefit most from better data use?" },
  { key: "retention", label: "Low engagement / high attrition", gaps: ["people-management", "coaching", "communication"], outcome: "Improved engagement and retention in target teams", question: "What do exit interviews say about managers?" },
];

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

/** Step 2: translate selected challenges into ranked capability gaps. */
export function capabilityGaps(challengeKeys: string[], extra: CapabilityKey[] = []): GapResult[] {
  const map = new Map<CapabilityKey, GapResult>();
  const add = (cap: CapabilityKey, weight: number, reason: string) => {
    const existing = map.get(cap) ?? { capability: cap, label: CAPABILITIES[cap], weight: 0, because: [] };
    existing.weight += weight;
    if (!existing.because.includes(reason)) existing.because.push(reason);
    map.set(cap, existing);
  };
  for (const key of challengeKeys) {
    const c = CHALLENGES.find((x) => x.key === key);
    // Earlier gaps in each challenge are the primary ones.
    c?.gaps.forEach((cap, i) => add(cap, 3 - i, c.label));
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
  "How would the business measure success 6 months after the programme?",
  "What timing, format and group size would work operationally?",
];

/** Step 4: assemble a business case. Everything is framed as a hypothesis to validate. */
export function buildBusinessCase(inputs: MapperInputs, gaps: GapResult[], matches: ProgrammeMatch[]): BusinessCase {
  const selected = CHALLENGES.filter((c) => inputs.challenges.includes(c.key));
  const top = matches[0]?.programme;
  const gapLabels = gaps.slice(0, 3).map((g) => g.label.toLowerCase());
  return {
    challenge:
      selected.length > 0
        ? `${selected.map((c) => c.label).join("; ")} — in a ${inputs.growthStage.toLowerCase()} ${inputs.industry.toLowerCase()} organisation.`
        : "Business challenge not yet defined.",
    capabilityGap: gapLabels.length ? `Hypothesis: ${inputs.targetGroup || "the target group"} may need stronger ${joinList(gapLabels)}.` : "No capability gap identified yet.",
    suggestedSolution: top ? `${top.name}${top.isDemo ? " (DEMO placeholder — replace with the relevant real Bloom programme)" : ""}` : "No matching programme in the catalogue — consider a custom design.",
    targetAudience: `${inputs.targetGroup || "Target group to be confirmed"} · ${inputs.leadershipLevel}`,
    expectedOutcome: inputs.desiredOutcome.trim() || selected[0]?.outcome || "Outcome to be agreed with the sponsor.",
    discoveryQuestions: unique([...selected.map((c) => c.question), "What has already been tried, and what did it achieve?", "What would make this a priority in the next two quarters?"]).slice(0, 5),
    validationQuestions: VALIDATION_QUESTIONS,
  };
}

function unique<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}

export function joinList(xs: string[]): string {
  if (xs.length <= 1) return xs.join("");
  return `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}
