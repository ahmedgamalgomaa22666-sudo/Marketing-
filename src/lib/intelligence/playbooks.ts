import type { CapabilityKey, Industry, SignalKey } from "../types";

/**
 * Industry and signal knowledge used to build hypotheses. Written as general market
 * patterns, never as facts about a specific company. Edit freely as Bloom learns.
 */

export interface IndustryPlaybook {
  context: string;
  priorities: string[];
  gaps: CapabilityKey[];
  angle: string;
  objections: { objection: string; approach: string }[];
  questions: string[];
}

export const PLAYBOOKS: Record<Industry, IndustryPlaybook> = {
  Healthcare: {
    context: "GCC healthcare is expanding capacity quickly, with pressure on clinical-to-management transitions, patient experience and workforce nationalisation.",
    priorities: [
      "clinicians promoted into unit or department management may lack people-leadership preparation",
      "patient-experience consistency across new facilities may be a board-level concern",
    ],
    gaps: ["people-management", "coaching", "customer-experience", "change-leadership"],
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
    gaps: ["people-management", "delegation", "collaboration", "communication"],
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
    gaps: ["customer-experience", "coaching", "people-management", "sales-leadership"],
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
    gaps: ["customer-experience", "people-management", "coaching", "communication"],
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
    gaps: ["change-leadership", "consultative-selling", "data-decisions", "strategic-leadership"],
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
    gaps: ["consultative-selling", "people-management", "communication", "business-acumen"],
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
    gaps: ["people-management", "change-leadership", "data-decisions", "communication"],
    angle: "Build the frontline and plant leadership that localisation and growth depend on.",
    objections: [
      { objection: "Technical training is our priority.", approach: "Explore how supervisors' people skills affect safety, quality and retention alongside technical training." },
      { objection: "Shift work makes classroom training hard.", approach: "Ask about shift patterns and explore on-site or split-session delivery." },
    ],
    questions: ["How are high-performing operators prepared to become supervisors?", "Where do handovers between shifts or departments break down?"],
  },
};

export interface SignalInsight {
  hypothesis: string;
  observation: string;
  capabilities: CapabilityKey[];
  question: string;
}

export const SIGNAL_INSIGHTS: Record<SignalKey, SignalInsight> = {
  "rapid-growth": {
    hypothesis: "rapid team growth may create first-line manager development needs",
    observation: "growing the team quickly",
    capabilities: ["people-management", "delegation", "coaching"],
    question: "As the team grows, where are managers feeling the strain first?",
  },
  "gcc-expansion": {
    hypothesis: "GCC expansion may require leaders who can build and run teams in new markets",
    observation: "expanding into new GCC markets",
    capabilities: ["strategic-leadership", "collaboration", "business-acumen"],
    question: "What leadership capability will the new-market teams need in their first year?",
  },
  "new-managers": {
    hypothesis: "a wave of newly promoted managers may need structured transition support",
    observation: "promoting many people into first-time manager roles",
    capabilities: ["people-management", "coaching", "delegation"],
    question: "How are newly promoted managers supported in their first 90 days?",
  },
  nationalisation: {
    hypothesis: "nationalisation targets may require accelerated development of national talent into leadership roles",
    observation: "investing in national talent development",
    capabilities: ["people-management", "business-acumen", "communication"],
    question: "How are national hires being prepared for leadership roles?",
  },
  "digital-transformation": {
    hypothesis: "digital transformation may depend on leaders who can lead change and use data in decisions",
    observation: "running a digital transformation programme",
    capabilities: ["change-leadership", "data-decisions"],
    question: "Which leadership behaviours will make or break the transformation?",
  },
  restructuring: {
    hypothesis: "a merger or restructuring may create alignment and change-leadership needs",
    observation: "bringing teams together through a restructure",
    capabilities: ["change-leadership", "collaboration", "communication"],
    question: "Where is alignment between the combined teams hardest right now?",
  },
  "sales-pressure": {
    hypothesis: "commercial growth targets may expose consultative selling and sales leadership gaps",
    observation: "pushing for commercial growth",
    capabilities: ["consultative-selling", "negotiation", "sales-leadership"],
    question: "What is holding back conversion — pipeline volume, sales conversations or sales management?",
  },
  "customer-experience": {
    hypothesis: "a customer-experience focus may require frontline leaders who coach service behaviours",
    observation: "focusing on customer experience",
    capabilities: ["customer-experience", "coaching", "communication"],
    question: "Where does customer experience vary most, and who owns fixing it?",
  },
  "leadership-succession": {
    hypothesis: "succession planning may reveal gaps in the senior leadership pipeline",
    observation: "strengthening the leadership pipeline",
    capabilities: ["strategic-leadership", "change-leadership", "coaching"],
    question: "How ready are successors for your critical leadership roles?",
  },
  "new-l&d-leader": {
    hypothesis: "a newly appointed HR/L&D leader may be reviewing the learning strategy and provider mix",
    observation: "setting a new learning agenda",
    capabilities: ["strategic-leadership"],
    question: "What would a successful first year look like for the learning function?",
  },
};
