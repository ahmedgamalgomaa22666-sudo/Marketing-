import type { ACCOUNT_STAGES, ACTIVITY_TYPES, CURRENCIES, OPPORTUNITY_STAGES, SIZE_BANDS, STAKEHOLDER_ROLES } from "./config";

/** Profile-defined values (see WorkspaceProfile): markets, industries, needs, signals, audience levels. */
export type Country = string;
export type Industry = string;
export type CapabilityKey = string;
export type SignalKey = string;
export type LeadershipLevel = string;
export type SizeBand = (typeof SIZE_BANDS)[number]["id"];
export type AccountStage = (typeof ACCOUNT_STAGES)[number];
export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number];
export type StakeholderRole = (typeof STAKEHOLDER_ROLES)[number];
export type ActivityType = (typeof ACTIVITY_TYPES)[number];
export type Level = "Low" | "Medium" | "High";
export type Seniority = "C-level" | "VP / Director" | "Head / Manager" | "Specialist";

interface Base {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends Base {
  name: string;
  role: string;
}

export interface Account extends Base {
  name: string;
  country: Country;
  city: string;
  industry: Industry;
  sizeBand: SizeBand;
  website: string;
  ownerId: string;
  stage: AccountStage;
  /** Furthest funnel stage ever reached — keeps conversion honest after Lost / Nurture. */
  highestStage: AccountStage;
  priority: Level;
  /** Estimated size of the opportunity for the active profile's offerings. */
  potential: Level;
  signals: SignalKey[];
  tags: string[];
  notes: string;
  lastContactedAt: string | null;
  nextFollowUpAt: string | null;
  isDemo: boolean;
}

export interface AccountScore extends Base {
  accountId: string;
  /** BD judgement 0–5, the only non-derived score inputs. */
  ratings: { needStrength: number; strategicRelevance: number };
  evidence: string;
}

export interface Contact extends Base {
  accountId: string;
  name: string;
  title: string;
  department: string;
  seniority: Seniority;
  role: StakeholderRole;
  linkedinUrl: string;
  email: string;
  phone: string;
  notes: string;
  lastInteractionAt: string | null;
  nextAction: string;
}

export interface Opportunity extends Base {
  accountId: string;
  name: string;
  stage: OpportunityStage;
  programmeIds: string[];
  primaryContactId: string | null;
  contactIds: string[];
  /** Optional — never populated with invented figures. */
  estimatedValue: number | null;
  currency: (typeof CURRENCIES)[number];
  probability: number | null;
  targetCloseDate: string | null;
  businessProblem: string;
  nextStep: string;
  nextStepDate: string | null;
  notes: string;
}

export interface Activity extends Base {
  accountId: string;
  opportunityId: string | null;
  contactId: string | null;
  type: ActivityType;
  status: "planned" | "done";
  summary: string;
  /** When it happened (done) or is due (planned). */
  date: string;
  outcome: "positive" | "neutral" | "no-response" | null;
}

/** An offering (product, service, programme…) from the workspace catalogue. */
export interface Programme extends Base {
  name: string;
  isDemo: boolean;
  description: string;
  capabilities: CapabilityKey[];
  levels: LeadershipLevel[];
  format: string;
}

export interface MapperInputs {
  industry: Industry;
  sizeBand: SizeBand;
  growthStage: "Early growth" | "Rapid growth" | "Mature" | "Transformation";
  challenges: string[];
  targetGroup: string;
  audienceLevel: LeadershipLevel;
  desiredOutcome: string;
  urgency: Level;
  knownGaps: string;
}

export interface BusinessCase {
  challenge: string;
  capabilityGap: string;
  suggestedSolution: string;
  targetAudience: string;
  expectedOutcome: string;
  discoveryQuestions: string[];
  validationQuestions: string[];
  nextAction: string;
}

export interface OpportunityRecommendation extends Base {
  accountId: string;
  opportunityId: string | null;
  inputs: MapperInputs;
  gaps: CapabilityKey[];
  programmeIds: string[];
  businessCase: BusinessCase;
  validated: boolean;
}

export interface Settings {
  weights: Record<import("./config").ScoreDimension, number>;
}

export type Offering = Programme;

export interface Database {
  version: number;
  profileId: string;
  seededAt: string;
  users: User[];
  accounts: Account[];
  accountScores: AccountScore[];
  contacts: Contact[];
  opportunities: Opportunity[];
  activities: Activity[];
  programmes: Programme[];
  recommendations: OpportunityRecommendation[];
  settings: Settings;
}

export type CollectionName = Exclude<keyof Database, "version" | "profileId" | "seededAt" | "settings">;
