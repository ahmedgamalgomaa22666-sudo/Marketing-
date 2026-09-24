/**
 * Core, industry-neutral configuration of the BD Operating System: company size bands,
 * the B2B pipeline, stakeholder roles, activity types and the qualification framework.
 * Anything company- or industry-specific belongs in a WorkspaceProfile (src/lib/profile).
 */

export const SIZE_BANDS = [
  { id: "50-249", label: "50–249 employees", points: 0.35 },
  { id: "250-999", label: "250–999 employees", points: 0.6 },
  { id: "1000-4999", label: "1,000–4,999 employees", points: 0.85 },
  { id: "5000+", label: "5,000+ employees", points: 1 },
] as const;

/** Account pipeline, in funnel order. Won/Lost/Nurture are terminal or parked states. */
export const ACCOUNT_STAGES = [
  "Target",
  "Researching",
  "Contacted",
  "Engaged",
  "Qualified",
  "Meeting",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
  "Nurture",
] as const;

/** Stages that form the linear funnel (Lost/Nurture sit outside it). */
export const FUNNEL_STAGES = [
  "Target",
  "Researching",
  "Contacted",
  "Engaged",
  "Qualified",
  "Meeting",
  "Proposal",
  "Negotiation",
  "Won",
] as const;

export const OPPORTUNITY_STAGES = ["Qualified", "Meeting", "Proposal", "Negotiation", "Won", "Lost"] as const;

export const STAKEHOLDER_ROLES = [
  "Decision Maker",
  "Influencer",
  "Champion",
  "User",
  "Gatekeeper",
  "Procurement",
  "Unknown",
] as const;

export const ACTIVITY_TYPES = ["Call", "LinkedIn", "Email", "WhatsApp", "Meeting", "Proposal", "Follow-up", "Note"] as const;
export const OUTBOUND_TYPES = ["Call", "LinkedIn", "Email", "WhatsApp", "Follow-up"] as const;

export type ScoreDimension =
  | "marketFit"
  | "companyPotential"
  | "needStrength"
  | "stakeholderAccess"
  | "strategicRelevance"
  | "engagement";

export const SCORE_DIMENSIONS: { key: ScoreDimension; label: string; help: string }[] = [
  { key: "marketFit", label: "Market Fit", help: "Market and industry attractiveness for the offering" },
  { key: "companyPotential", label: "Company Potential", help: "Company size — the scale of the opportunity" },
  { key: "needStrength", label: "Need Strength", help: "BD rating of evidence for a need, plus observed signals" },
  { key: "stakeholderAccess", label: "Stakeholder Access", help: "Known functional buyer, decision maker and champion" },
  { key: "strategicRelevance", label: "Strategic Relevance", help: "BD rating of flagship / reference / expansion value" },
  { key: "engagement", label: "Engagement", help: "Pipeline progress and recent two-way activity" },
];

export const DEFAULT_WEIGHTS: Record<ScoreDimension, number> = {
  marketFit: 20,
  companyPotential: 20,
  needStrength: 20,
  stakeholderAccess: 15,
  strategicRelevance: 15,
  engagement: 10,
};

export const CURRENCIES = ["AED", "SAR", "EGP", "USD", "EUR"] as const;
