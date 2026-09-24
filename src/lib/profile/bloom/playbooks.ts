import type { ChallengeDef, IndustryPlaybook, SignalDef } from "../types";

/**
 * Industry and signal knowledge used to build hypotheses. Written as general market
 * patterns, never as facts about a specific company. Edit freely as Bloom learns.
 */

export const PLAYBOOKS: Record<string, IndustryPlaybook> = {
  Healthcare: {
    context: "GCC healthcare is expanding capacity quickly, with pressure on clinical-to-management transitions, patient experience and workforce nationalisation.",
    priorities: [
      "clinicians promoted into unit or department management may lack people-leadership preparation",
      "patient-experience consistency across new facilities may be a board-level concern",
    ],
    needs: ["people-management", "coaching", "customer-experience", "change-leadership"],
    angle: "Help clinical leaders lead teams, not just treat patients — protecting patient experience while the network grows.",
    objections: [
      { objection: "Our clinicians have no time away from the floor.", approach: "Explore modular, short-format sessions scheduled around shift patterns; ask what format has worked before." },
      { objection: "We already run mandatory clinical training.", approach: "Position leadership capability as complementary to clinical CPD; ask how managers are prepared for people leadership today." },
    ],
    questions: ["How are clinicians prepared when they step into their first management role?", "Where does patient-experience performance vary most between sites?"],
  },
  Technology: {
    context: "Tech firms in the region scale fast, often promoting strong engineers into management and competing hard for talent.",
    priorities: [
      "fast-promoted engineering and product managers may need people-management foundations",
      "retention of high performers may depend on the quality of first-line managers",
    ],
    needs: ["people-management", "delegation", "collaboration", "communication"],
    angle: "Turn strong technical contributors into managers people want to stay for.",
    objections: [
      { objection: "We prefer online, self-paced learning.", approach: "Ask about completion and behaviour change from current platforms; explore blended cohorts with applied projects." },
      { objection: "Our managers are too busy shipping.", approach: "Explore the cost of manager-driven attrition; propose short, applied sprints tied to real team challenges." },
    ],
    questions: ["What happens to an engineer's support when they become a team lead?", "Where do product and engineering teams collide most often?"],
  },
  Retail: {
    context: "Retail groups manage large frontline workforces across many sites, where store and area managers drive sales and customer experience.",
    priorities: [
      "store and area manager capability may explain performance variance between locations",
      "frontline customer experience and conversion may be key commercial levers",
    ],
    needs: ["customer-experience", "coaching", "people-management", "sales-leadership"],
    angle: "Close the gap between best- and worst-performing stores by developing the managers who run them.",
    objections: [
      { objection: "Staff turnover is too high to invest in training.", approach: "Explore whether manager quality is itself a driver of turnover; focus investment on store managers who stay." },
      { objection: "Budgets are set centrally by head office.", approach: "Ask who owns the capability budget and what business case format head office expects." },
    ],
    questions: ["What distinguishes your top-performing store managers?", "How is coaching on the shop floor happening today?"],
  },
  Hospitality: {
    context: "Hospitality in the UAE and KSA is growing with tourism and giga-project pipelines; service leadership and nationalisation targets are recurring themes.",
    priorities: [
      "new property openings may require a pipeline of ready supervisors and department heads",
      "service consistency and guest experience may depend on frontline leadership",
    ],
    needs: ["customer-experience", "people-management", "coaching", "communication"],
    angle: "Build a bench of service leaders ready for every new opening.",
    objections: [
      { objection: "We have an internal academy.", approach: "Explore where the academy's scope ends — often leadership and management above supervisor level — and how Bloom could complement it." },
      { objection: "Operational peaks make scheduling impossible.", approach: "Ask about low-season windows and modular formats aligned to rosters." },
    ],
    questions: ["How many supervisor and head-of-department roles will new openings require?", "How are national hires developed into leadership roles?"],
  },
  "Financial Services": {
    context: "Banks, insurers and fintechs face digital transformation, regulation and customer-centric selling pressures, with strong nationalisation agendas.",
    priorities: [
      "digital transformation may require leaders who can drive change and data-led decisions",
      "relationship managers may need to move from product-push to consultative advice",
    ],
    needs: ["change-leadership", "consultative-selling", "data-decisions", "strategic-leadership"],
    angle: "Equip leaders and relationship teams for a digital, advice-led market.",
    objections: [
      { objection: "Everything must go through a formal procurement panel.", approach: "Ask about panel timing, vendor registration requirements and who sponsors new suppliers." },
      { objection: "We partner with international business schools already.", approach: "Explore gaps in local relevance, scale or cost; position as complementary for middle management." },
    ],
    questions: ["Which leadership behaviours does your transformation depend on most?", "How are relationship managers measured today — product volume or client outcomes?"],
  },
  "Professional Services": {
    context: "Consulting, legal, engineering and advisory firms rely on client-facing managers who must lead teams while selling and delivering.",
    priorities: [
      "senior consultants moving to manager may struggle to balance delivery, people and business development",
      "growth may depend on partners and managers selling more consultatively",
    ],
    needs: ["consultative-selling", "people-management", "communication", "business-acumen"],
    angle: "Develop the player-managers who win and deliver the work.",
    objections: [
      { objection: "Billable hours make training time expensive.", approach: "Frame in terms of revenue per manager and client retention; explore compact formats." },
      { objection: "Our global network provides training.", approach: "Ask how well global content fits GCC clients and local teams; offer region-specific application." },
    ],
    questions: ["How do managers split time between delivery, team and business development?", "Who owns business-development capability building?"],
  },
  Manufacturing: {
    context: "Industrial and manufacturing growth, especially under Saudi Vision 2030 localisation, increases demand for supervisors and plant leadership.",
    priorities: [
      "localisation and new plants may require developing national supervisors quickly",
      "operational excellence initiatives may stall without capable frontline leaders",
    ],
    needs: ["people-management", "change-leadership", "data-decisions", "communication"],
    angle: "Build the frontline and plant leadership that localisation and growth depend on.",
    objections: [
      { objection: "Technical training is our priority.", approach: "Explore how supervisors' people skills affect safety, quality and retention alongside technical training." },
      { objection: "Shift work makes classroom training hard.", approach: "Ask about shift patterns and explore on-site or split-session delivery." },
    ],
    questions: ["How are high-performing operators prepared to become supervisors?", "Where do handovers between shifts or departments break down?"],
  },
};

export const SIGNALS: Record<string, SignalDef> = {
  "rapid-growth": {
    label: "Rapid headcount growth",
    hypothesis: "rapid team growth may create first-line manager development needs",
    observation: "growing the team quickly",
    needs: ["people-management", "delegation", "coaching"],
    question: "As the team grows, where are managers feeling the strain first?",
  },
  "gcc-expansion": {
    kind: "strategic",
    label: "Expanding across the GCC",
    hypothesis: "GCC expansion may require leaders who can build and run teams in new markets",
    observation: "expanding into new GCC markets",
    needs: ["strategic-leadership", "collaboration", "business-acumen"],
    question: "What leadership capability will the new-market teams need in their first year?",
  },
  "new-managers": {
    label: "Many newly promoted managers",
    hypothesis: "a wave of newly promoted managers may need structured transition support",
    observation: "promoting many people into first-time manager roles",
    needs: ["people-management", "coaching", "delegation"],
    question: "How are newly promoted managers supported in their first 90 days?",
  },
  nationalisation: {
    label: "Emiratisation / Saudisation targets",
    hypothesis: "nationalisation targets may require accelerated development of national talent into leadership roles",
    observation: "investing in national talent development",
    needs: ["people-management", "business-acumen", "communication"],
    question: "How are national hires being prepared for leadership roles?",
  },
  "digital-transformation": {
    label: "Digital transformation programme",
    hypothesis: "digital transformation may depend on leaders who can lead change and use data in decisions",
    observation: "running a digital transformation programme",
    needs: ["change-leadership", "data-decisions"],
    question: "Which leadership behaviours will make or break the transformation?",
  },
  restructuring: {
    label: "Merger or restructuring",
    hypothesis: "a merger or restructuring may create alignment and change-leadership needs",
    observation: "bringing teams together through a restructure",
    needs: ["change-leadership", "collaboration", "communication"],
    question: "Where is alignment between the combined teams hardest right now?",
  },
  "sales-pressure": {
    label: "Commercial / sales growth pressure",
    hypothesis: "commercial growth targets may expose consultative selling and sales leadership gaps",
    observation: "pushing for commercial growth",
    needs: ["consultative-selling", "negotiation", "sales-leadership"],
    question: "What is holding back conversion — pipeline volume, sales conversations or sales management?",
  },
  "customer-experience": {
    label: "Customer experience focus",
    hypothesis: "a customer-experience focus may require frontline leaders who coach service behaviours",
    observation: "focusing on customer experience",
    needs: ["customer-experience", "coaching", "communication"],
    question: "Where does customer experience vary most, and who owns fixing it?",
  },
  "leadership-succession": {
    kind: "both",
    label: "Leadership succession planning",
    hypothesis: "succession planning may reveal gaps in the senior leadership pipeline",
    observation: "strengthening the leadership pipeline",
    needs: ["strategic-leadership", "change-leadership", "coaching"],
    question: "How ready are successors for your critical leadership roles?",
  },
  "new-l&d-leader": {
    kind: "context",
    label: "New HR / L&D leader appointed",
    hypothesis: "a newly appointed HR/L&D leader may be reviewing the learning strategy and provider mix",
    observation: "setting a new learning agenda",
    needs: ["strategic-leadership"],
    question: "What would a successful first year look like for the learning function?",
  },
};

/** Business challenges a BD can select in the (Training) Opportunity Mapper. */
export const CHALLENGES: ChallengeDef[] = [
  { key: "new-managers", label: "Rapid promotion of new managers", needs: ["people-management", "coaching", "delegation"], outcome: "Faster, more confident transition into management and fewer escalations", question: "How are new managers supported during their first 90 days?" },
  { key: "sales-underperformance", label: "Sales underperformance", needs: ["consultative-selling", "negotiation", "sales-leadership"], outcome: "Higher conversion and deal quality", question: "Where in the sales process are deals being lost?" },
  { key: "cross-functional-friction", label: "Cross-functional friction", needs: ["collaboration", "communication", "people-management"], outcome: "Faster decisions and fewer hand-off failures between teams", question: "Which hand-offs between teams cause the most delay or rework?" },
  { key: "leadership-pipeline", label: "Weak leadership pipeline / succession", needs: ["strategic-leadership", "change-leadership", "coaching"], outcome: "Ready-now successors for critical roles", question: "Which critical roles have no ready successor today?" },
  { key: "transformation", label: "Transformation or restructuring", needs: ["change-leadership", "communication", "strategic-leadership"], outcome: "Leaders who sustain adoption of the change", question: "What do leaders need to do differently for the change to stick?" },
  { key: "customer-experience", label: "Inconsistent customer experience", needs: ["customer-experience", "coaching", "communication"], outcome: "More consistent service standards across teams and sites", question: "Where is customer experience most inconsistent, and why?" },
  { key: "national-talent", label: "Developing national talent", needs: ["people-management", "business-acumen", "communication"], outcome: "Accelerated readiness of national talent for leadership roles", question: "What stops national hires progressing into leadership roles faster?" },
  { key: "market-expansion", label: "Scaling into new GCC markets", needs: ["strategic-leadership", "business-acumen", "collaboration"], outcome: "Leaders able to build and run teams in new markets", question: "What capabilities will leaders in new markets need in year one?" },
  { key: "decision-quality", label: "Slow or intuition-led decisions", needs: ["data-decisions", "business-acumen"], outcome: "Faster, evidence-based management decisions", question: "Which recurring decisions would benefit most from better data use?" },
  { key: "retention", label: "Low engagement / high attrition", needs: ["people-management", "coaching", "communication"], outcome: "Improved engagement and retention in target teams", question: "What do exit interviews say about managers?" },
];
