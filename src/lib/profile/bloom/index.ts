import { DEFAULT_WEIGHTS } from "../../config";
import type { WorkspaceProfile } from "../types";
import { CHALLENGES, PLAYBOOKS, SIGNALS } from "./playbooks";
import { BLOOM_DEMO_GUIDE } from "./demoGuide";
import { createBloomDemoData, BLOOM_OFFERINGS } from "./seed";

/**
 * FIRST USE CASE — Bloom Business School (corporate training / executive education).
 * Everything here is configuration; the core BD Operating System never imports it directly.
 */
export const bloomProfile: WorkspaceProfile = {
  id: "bloom",
  company: {
    name: "Sample: Bloom Business School",
    industry: "Corporate Training / Executive Education (fictional sample data)",
    description: "Corporate learning, executive education and leadership development for organisations in the UAE and Saudi Arabia.",
  },
  demoNotice: "Demo data — not actual Bloom customer information. Programmes shown are DEMO placeholders.",
  markets: ["UAE", "Saudi Arabia"],
  industries: ["Healthcare", "Technology", "Retail", "Hospitality", "Financial Services", "Professional Services", "Manufacturing"],
  idealCustomerProfile: [
    "Organisations with 250+ employees in the UAE or Saudi Arabia",
    "Growing, restructuring or expanding across the GCC",
    "An HR / L&D function with a development budget",
    "Visible leadership, management or commercial capability pressure",
  ],
  buyerRoles: ["HR Director / CHRO", "Head of Learning & Development", "Talent Development Leader", "Learning Manager", "CEO / Founder (SMEs)", "Senior business decision-maker"],
  buyerFunction: { label: "HR / L&D", pattern: /\b(hr|human|people|talent|learning|l&d|capability|academy)\b/i },
  needs: {
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
  },
  signals: SIGNALS,
  playbooks: PLAYBOOKS,
  defaultPlaybook: PLAYBOOKS["Professional Services"],
  challenges: CHALLENGES,
  // Assumption-based starting point — calibrate with real win data.
  marketAttractiveness: {
    UAE: { Healthcare: 0.9, Technology: 0.8, Retail: 0.75, Hospitality: 0.85, "Financial Services": 0.9, "Professional Services": 0.8, Manufacturing: 0.6 },
    "Saudi Arabia": { Healthcare: 0.95, Technology: 0.85, Retail: 0.8, Hospitality: 0.9, "Financial Services": 0.9, "Professional Services": 0.75, Manufacturing: 0.8 },
  },
  audienceLevels: ["Individual contributors", "Frontline", "Middle management", "Senior leaders", "Executives"],
  qualification: {
    weights: { ...DEFAULT_WEIGHTS },
    labels: {
      needStrength: { label: "Training Need", help: "BD rating of evidence for a learning need, plus signals" },
      stakeholderAccess: { label: "Stakeholder Access", help: "Known HR / L&D buyer, decision maker and champion" },
      marketFit: { label: "Market Fit", help: "Country and industry attractiveness for corporate learning" },
      companyPotential: { label: "Company Potential", help: "Workforce size — the pool of learners" },
    },
  },
  terminology: { offering: "Programme", offerings: "Programmes", need: "Learning / capability gap", potential: "Estimated training potential" },
  outreach: { audience: "HR and L&D leaders", signature: "Bloom Business School" },
  modules: {
    opportunityMapper: {
      title: "Training Opportunity Mapper",
      subtitle: "Translate a business problem into capability needs, a Bloom programme and a business case — for you to validate with the client.",
      needLabel: "Learning / capability gap",
      solutionLabel: "Bloom programme",
      outcomeLabel: "Expected business outcome",
    },
  },
  starterOfferings: () => BLOOM_OFFERINGS,
  createDemoData: createBloomDemoData,
  demoGuide: BLOOM_DEMO_GUIDE,
};
