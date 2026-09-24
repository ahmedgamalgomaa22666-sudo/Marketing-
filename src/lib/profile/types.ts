import type { ScoreDimension } from "../config";
import type { Database, Programme } from "../types";

/**
 * A WorkspaceProfile configures the reusable BD Operating System for one company:
 * who it sells to, what it sells, how it qualifies, and what it calls things.
 * The core (accounts → contacts → qualification → opportunities → pipeline → activities →
 * analytics) never refers to a specific company or industry — only to the active profile.
 */

export interface SignalDef {
  label: string;
  hypothesis: string;
  observation: string;
  needs: string[];
  question: string;
  /** need (default): evidence of a need · strategic: raises strategic value · both · context: informs the brief only. */
  kind?: "need" | "strategic" | "both" | "context";
}

export interface IndustryPlaybook {
  context: string;
  priorities: string[];
  needs: string[];
  angle: string;
  objections: { objection: string; approach: string }[];
  questions: string[];
}

export interface ChallengeDef {
  key: string;
  label: string;
  needs: string[];
  outcome: string;
  question: string;
}

export interface WorkspaceProfile {
  id: string;
  company: { name: string; industry: string; description: string };
  /** Shown as a banner across the workspace when the data is sample data. */
  demoNotice: string | null;
  markets: string[];
  /** Target industries (part of the ideal customer profile). */
  industries: string[];
  idealCustomerProfile: string[];
  buyerRoles: string[];
  /** The function that usually owns the buying decision, e.g. "HR / L&D". */
  buyerFunction: { label: string; pattern: RegExp };
  /** Catalogue of needs the offerings address (capabilities, use cases…). key → label. */
  needs: Record<string, string>;
  signals: Record<string, SignalDef>;
  playbooks: Record<string, IndustryPlaybook>;
  defaultPlaybook: IndustryPlaybook;
  challenges: ChallengeDef[];
  /** 0–1 attractiveness per market × industry; missing pairs default to 0.7. */
  marketAttractiveness: Record<string, Record<string, number>>;
  audienceLevels: string[];
  qualification: {
    weights: Record<ScoreDimension, number>;
    labels: Partial<Record<ScoreDimension, { label: string; help: string }>>;
  };
  terminology: {
    offering: string;
    offerings: string;
    need: string;
    potential: string;
  };
  /** audience: who we usually write to · signature: organisation line under the sender name (optional). */
  outreach: { audience: string; signature?: string };
  modules: {
    opportunityMapper: {
      title: string;
      subtitle: string;
      needLabel: string;
      solutionLabel: string;
      outcomeLabel: string;
    };
  };
  /** Starter offerings for a fresh workspace (placeholders until real ones are added). */
  starterOfferings: () => Omit<Programme, "createdAt" | "updatedAt">[];
  /** Optional sample dataset used by "Reset demo data". */
  createDemoData?: (today: string) => Database;
}
