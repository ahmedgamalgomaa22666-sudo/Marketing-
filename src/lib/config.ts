/**
 * Single place to configure the commercial model: markets, stages, roles, capabilities,
 * business signals and score weights. Rename or reorder here; the UI follows.
 */

export const COUNTRIES = ["UAE", "Saudi Arabia"] as const;

export const INDUSTRIES = [
  "Healthcare",
  "Technology",
  "Retail",
  "Hospitality",
  "Financial Services",
  "Professional Services",
  "Manufacturing",
] as const;

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

export const CAPABILITIES = {
  "people-management": "People management",
  coaching: "Coaching & feedback",
  delegation: "Delegation & accountability",
  "strategic-leadership": "Strategic leadership",
  "change-leadership": "Leading change",
  "consultative-selling": "Consultative selling",
  negotiation: "Negotiation",
  "sales-leadership": "Sales leadership",
  collaboration: "Cross-functional collaboration",
  communication: "Communication & influence",
  "customer-experience": "Customer experience",
  "business-acumen": "Business & financial acumen",
  "data-decisions": "Data-driven decision making",
} as const;

/** Observable business signals a BD can record on an account. Each drives hypotheses. */
export const SIGNALS = {
  "rapid-growth": "Rapid headcount growth",
  "gcc-expansion": "Expanding across the GCC",
  "new-managers": "Many newly promoted managers",
  nationalisation: "Emiratisation / Saudisation targets",
  "digital-transformation": "Digital transformation programme",
  restructuring: "Merger or restructuring",
  "sales-pressure": "Commercial / sales growth pressure",
  "customer-experience": "Customer experience focus",
  "leadership-succession": "Leadership succession planning",
  "new-l&d-leader": "New HR / L&D leader appointed",
} as const;

export type ScoreDimension =
  | "marketFit"
  | "companyPotential"
  | "trainingNeed"
  | "stakeholderAccess"
  | "strategicRelevance"
  | "engagement";

export const SCORE_DIMENSIONS: { key: ScoreDimension; label: string; help: string }[] = [
  { key: "marketFit", label: "Market Fit", help: "Country and industry attractiveness for corporate learning" },
  { key: "companyPotential", label: "Company Potential", help: "Workforce size — the pool of learners" },
  { key: "trainingNeed", label: "Training Need", help: "BD rating of evidence for a learning need, plus signals" },
  { key: "stakeholderAccess", label: "Stakeholder Access", help: "Known HR/L&D buyer, decision maker and champion" },
  { key: "strategicRelevance", label: "Strategic Relevance", help: "BD rating of flagship / reference / expansion value" },
  { key: "engagement", label: "Engagement", help: "Pipeline progress and recent two-way activity" },
];

export const DEFAULT_WEIGHTS: Record<ScoreDimension, number> = {
  marketFit: 20,
  companyPotential: 20,
  trainingNeed: 20,
  stakeholderAccess: 15,
  strategicRelevance: 15,
  engagement: 10,
};

/**
 * Relative attractiveness of each industry for corporate learning, per market (0–1).
 * Assumption-based starting point — calibrate with Bloom's real win data.
 */
export const MARKET_ATTRACTIVENESS: Record<(typeof COUNTRIES)[number], Record<(typeof INDUSTRIES)[number], number>> = {
  UAE: {
    Healthcare: 0.9,
    Technology: 0.8,
    Retail: 0.75,
    Hospitality: 0.85,
    "Financial Services": 0.9,
    "Professional Services": 0.8,
    Manufacturing: 0.6,
  },
  "Saudi Arabia": {
    Healthcare: 0.95,
    Technology: 0.85,
    Retail: 0.8,
    Hospitality: 0.9,
    "Financial Services": 0.9,
    "Professional Services": 0.75,
    Manufacturing: 0.8,
  },
};

export const CURRENCIES = ["AED", "SAR", "USD"] as const;
export const DEMO_NOTICE = "Demo data — not actual Bloom customer information.";
