import type { EvidenceStatus, EvidenceTier, RoleType } from "../types";

/** Ordered weakest → strongest. */
export const TIERS: EvidenceTier[] = ["Activity", "Output", "Outcome", "Achievement"];
export const STATUSES: EvidenceStatus[] = ["Self-recorded", "Needs verification", "Supported", "Verified"];
export const CONFIDENTIALITY = ["Private", "Internal", "Confidential"] as const;
export const ROLE_TYPES: RoleType[] = ["Individual contributor", "Leadership", "Business development"];

export const TIER_HELP: Record<EvidenceTier, string> = {
  Activity: "Work you did — e.g. 50 target accounts researched",
  Output: "Direct result of the work — e.g. 15 decision-makers engaged",
  Outcome: "Business result — e.g. 5 qualified opportunities",
  Achievement: "Commercial result or recognition — e.g. 2 opportunities converted",
};

export const CATEGORIES = [
  "BD activity",
  "BD pipeline",
  "Product launch",
  "Growth",
  "Market share / position",
  "Leadership",
  "Team development",
  "Recognition",
  "Commercial project",
  "Other",
];

/** Capabilities that evidence can support. Edit freely. */
export const CAPABILITIES = [
  "Prospecting & account research",
  "Decision-maker engagement",
  "Discovery & qualification",
  "Consultative selling",
  "Pipeline development",
  "Product launch",
  "Market development",
  "Product turnaround",
  "Commercial growth",
  "Key account management",
  "Team leadership",
  "Coaching & team development",
  "Commercial analytics",
  "Commercial projects",
];

/** Standard BD funnel metrics. Using them lets the analytics compute ratios. */
export const STANDARD_METRICS: { key: string; label: string; tier: EvidenceTier }[] = [
  { key: "accounts-researched", label: "Target accounts researched", tier: "Activity" },
  { key: "decision-makers-engaged", label: "Decision-makers engaged", tier: "Output" },
  { key: "positive-responses", label: "Positive responses", tier: "Output" },
  { key: "qualified-opportunities", label: "Qualified opportunities", tier: "Outcome" },
  { key: "meetings", label: "Meetings generated", tier: "Outcome" },
  { key: "proposals", label: "Proposals", tier: "Outcome" },
  { key: "wins", label: "Wins (converted opportunities)", tier: "Achievement" },
];

/** Funnel ratios: numerator ÷ denominator — shown only when both are recorded. */
export const FUNNEL_RATIOS: { label: string; num: string; den: string }[] = [
  { label: "Engagement (decision-makers ÷ accounts researched)", num: "decision-makers-engaged", den: "accounts-researched" },
  { label: "Response (positive ÷ decision-makers engaged)", num: "positive-responses", den: "decision-makers-engaged" },
  { label: "Qualification (qualified ÷ positive responses)", num: "qualified-opportunities", den: "positive-responses" },
  { label: "Meetings (meetings ÷ qualified)", num: "meetings", den: "qualified-opportunities" },
  { label: "Proposals (proposals ÷ meetings)", num: "proposals", den: "meetings" },
  { label: "Win rate (wins ÷ proposals)", num: "wins", den: "proposals" },
];

export const BACKUP_APP = "ahmed-gamal-bd-platform";
export const BACKUP_KIND = "career-evidence";
export const BACKUP_VERSION = 1;
