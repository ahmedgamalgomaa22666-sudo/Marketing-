import { DEFAULT_WEIGHTS } from "../../config";
import type { IndustryPlaybook, WorkspaceProfile } from "../types";

/**
 * Ahmed Gamal's personal BD profile — industry-neutral, portable across employers.
 * Starts empty (no sample data) with placeholder offerings to replace.
 */
const PLAYBOOK: IndustryPlaybook = {
  context: "B2B buyers typically act when a business priority (growth, cost, risk or customer experience) is under visible pressure and has an owner with budget.",
  priorities: [
    "a growth or efficiency target may be putting pressure on the operating model",
    "leadership may be looking for measurable outcomes rather than new tools or services",
  ],
  needs: ["revenue-growth", "process-efficiency", "customer-retention"],
  angle: "Lead with the business outcome the buyer is accountable for, and ask how they are approaching it today.",
  objections: [
    { objection: "We already work with a provider.", approach: "Explore what works well and where gaps remain; position as complementary or as a benchmark." },
    { objection: "This isn't a priority right now.", approach: "Ask what is a priority this year and whether the underlying problem affects it; agree a check-in date." },
  ],
  questions: ["What business outcome are you accountable for this year?", "What has already been tried, and what did it achieve?"],
};

export const personalProfile: WorkspaceProfile = {
  id: "personal",
  company: { name: "Personal BD Workspace", industry: "B2B (any industry)", description: "Ahmed Gamal's personal business development workspace — portable across employers and markets." },
  demoNotice: null,
  markets: ["UAE", "Saudi Arabia", "Egypt"],
  industries: ["Healthcare", "Pharmaceuticals", "Technology", "Retail", "Financial Services", "Manufacturing", "Professional Services", "Government / Semi-government"],
  idealCustomerProfile: ["Define your ideal customer profile in src/lib/profile/personal/index.ts"],
  buyerRoles: ["Economic buyer / budget holder", "Functional head", "Operations leader", "Procurement"],
  buyerFunction: { label: "functional buyer", pattern: /\b(operations|commercial|procurement|finance|strategy|business|general manager)\b/i },
  needs: {
    "revenue-growth": "Revenue growth",
    "process-efficiency": "Process efficiency",
    "cost-reduction": "Cost reduction",
    "customer-retention": "Customer retention",
    "risk-compliance": "Risk & compliance",
    "digital-enablement": "Digital enablement",
    "market-expansion": "Market expansion",
  },
  signals: {
    expansion: { label: "Expanding into new markets", hypothesis: "market expansion may create new operational and commercial requirements", observation: "expanding into new markets", needs: ["market-expansion", "process-efficiency"], question: "What needs to be in place for the new markets to succeed?", kind: "strategic" },
    "new-leadership": { label: "New leadership appointed", hypothesis: "a new leader may be reviewing priorities and suppliers", observation: "setting new priorities under new leadership", needs: ["revenue-growth"], question: "What would a successful first year look like for the new leadership?", kind: "context" },
    investment: { label: "New funding or investment", hypothesis: "new investment may come with growth targets that need delivery capacity", observation: "investing for growth", needs: ["revenue-growth", "digital-enablement"], question: "Which growth targets does the investment depend on?" },
    restructuring: { label: "Merger or restructuring", hypothesis: "restructuring may create efficiency and integration needs", observation: "reorganising the business", needs: ["process-efficiency", "cost-reduction"], question: "Where is integration hardest right now?" },
    regulation: { label: "Regulatory change", hypothesis: "regulatory change may create compliance deadlines", observation: "adapting to regulatory change", needs: ["risk-compliance"], question: "Which regulatory deadlines matter most this year?" },
    "performance-pressure": { label: "Performance pressure", hypothesis: "missed targets may be driving a search for new approaches", observation: "working to improve performance", needs: ["revenue-growth", "customer-retention"], question: "Which metric matters most to leadership right now?" },
  },
  playbooks: {},
  defaultPlaybook: PLAYBOOK,
  challenges: [
    { key: "growth", label: "Growth below target", needs: ["revenue-growth", "market-expansion"], outcome: "Revenue growth back on plan", question: "Where exactly is growth falling short?" },
    { key: "efficiency", label: "Inefficient processes", needs: ["process-efficiency", "cost-reduction", "digital-enablement"], outcome: "Lower cost to serve and faster cycle times", question: "Which process causes the most delay or rework?" },
    { key: "churn", label: "Customer churn", needs: ["customer-retention", "revenue-growth"], outcome: "Improved retention of key customers", question: "Why do customers leave, according to your own data?" },
    { key: "compliance", label: "Compliance or risk exposure", needs: ["risk-compliance", "process-efficiency"], outcome: "Reduced risk and audit-ready processes", question: "Which risk worries leadership most?" },
    { key: "expansion", label: "Entering new markets", needs: ["market-expansion", "revenue-growth"], outcome: "Successful entry into target markets", question: "What must be true for the new market to be profitable?" },
    { key: "digital", label: "Manual, disconnected systems", needs: ["digital-enablement", "process-efficiency"], outcome: "Connected, data-driven operations", question: "Where do teams re-enter the same data today?" },
  ],
  marketAttractiveness: {},
  audienceLevels: ["Operational teams", "Managers", "Executives"],
  qualification: { weights: { ...DEFAULT_WEIGHTS }, labels: {} },
  terminology: { offering: "Offering", offerings: "Offerings", need: "Business need", potential: "Estimated potential" },
  outreach: { audience: "commercial and operations leaders" },
  modules: {
    opportunityMapper: {
      title: "Opportunity Mapper",
      subtitle: "Business problem → need → potential solution → business outcome → discovery questions → next action.",
      needLabel: "Need",
      solutionLabel: "Potential solution",
      outcomeLabel: "Business outcome",
    },
  },
  starterOfferings: () => [
    { id: "off-a", name: "PLACEHOLDER — Offering A", isDemo: true, description: "Replace with a real product or service.", capabilities: ["revenue-growth", "customer-retention"], levels: ["Managers", "Executives"], format: "To be defined" },
    { id: "off-b", name: "PLACEHOLDER — Offering B", isDemo: true, description: "Replace with a real product or service.", capabilities: ["process-efficiency", "digital-enablement", "cost-reduction"], levels: ["Operational teams", "Managers"], format: "To be defined" },
  ],
};
