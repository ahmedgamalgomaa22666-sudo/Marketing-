/**
 * DEMO DATASET — fictional companies, people and activities.
 * Not actual Bloom customer information. Programmes are DEMO placeholders.
 * Monetary values are intentionally left empty.
 */
import { DEFAULT_WEIGHTS } from "../config";
import { addDays, todayISO } from "../dates";
import type {
  Account,
  AccountScore,
  AccountStage,
  Activity,
  ActivityType,
  Contact,
  Database,
  Level,
  Opportunity,
  OpportunityStage,
  Programme,
  Seniority,
  SignalKey,
  SizeBand,
  StakeholderRole,
  User,
} from "../types";

export const SCHEMA_VERSION = 1;
export const HERO_ACCOUNT_ID = "acc-meridian";

type AccountRow = [
  key: string,
  name: string,
  country: Account["country"],
  city: string,
  industry: Account["industry"],
  size: SizeBand,
  stage: AccountStage,
  highest: AccountStage,
  priority: Level,
  potential: Level,
  signals: SignalKey[],
  tags: string[],
  ratings: [need: number, strategic: number],
  lastContacted: number | null,
  nextFollowUp: number | null,
  owner: string,
  notes: string,
];

const ACCOUNTS: AccountRow[] = [
  ["meridian", "Meridian Gulf Healthcare", "UAE", "Dubai", "Healthcare", "1000-4999", "Engaged", "Engaged", "High", "High", ["rapid-growth", "gcc-expansion", "new-managers"], ["flagship", "leadership"], [5, 5], -3, 1, "u-2", "Opening four clinics in 18 months including first KSA sites. Head of L&D replied positively to first message."],
  ["najd", "Najd Precision Industries", "Saudi Arabia", "Riyadh", "Manufacturing", "1000-4999", "Qualified", "Qualified", "High", "High", ["nationalisation", "new-managers"], ["vision-2030"], [4, 4], -6, 2, "u-3", "Localisation drive — promoting national operators to supervisor roles."],
  ["falconridge", "Falconridge Hospitality Group", "UAE", "Abu Dhabi", "Hospitality", "5000+", "Meeting", "Meeting", "High", "High", ["gcc-expansion", "customer-experience", "nationalisation"], ["flagship", "multi-country"], [4, 5], -2, 3, "u-2", "Three new properties planned. Meeting held with VP People."],
  ["sahra", "Sahra Digital Bank", "Saudi Arabia", "Riyadh", "Financial Services", "1000-4999", "Proposal", "Proposal", "High", "High", ["digital-transformation", "sales-pressure"], ["transformation"], [4, 4], -9, -2, "u-3", "Proposal submitted for managers leading digital change."],
  ["tamarind", "Tamarind Retail Co.", "UAE", "Dubai", "Retail", "5000+", "Contacted", "Contacted", "Medium", "High", ["customer-experience"], ["frontline"], [3, 3], -12, 0, "u-2", ""],
  ["qamar", "Qamar Health Clinics", "Saudi Arabia", "Jeddah", "Healthcare", "250-999", "Researching", "Researching", "Medium", "Medium", ["rapid-growth"], [], [3, 3], null, 4, "u-3", ""],
  ["oryxline", "Oryxline Technologies", "UAE", "Dubai", "Technology", "250-999", "Engaged", "Engaged", "Medium", "Medium", ["rapid-growth", "new-managers"], ["tech"], [4, 3], -5, 6, "u-2", "Engineering leads promoted quickly after Series C."],
  ["harbourline", "Harbourline Advisory", "UAE", "Abu Dhabi", "Professional Services", "250-999", "Won", "Won", "Medium", "Medium", ["sales-pressure"], ["reference-candidate"], [4, 3], -15, 20, "u-1", "Pilot cohort agreed. Delivery planning underway."],
  ["dunehaven", "Dunehaven Resorts", "Saudi Arabia", "Jeddah", "Hospitality", "1000-4999", "Target", "Target", "High", "High", ["gcc-expansion", "nationalisation"], ["giga-project"], [3, 4], null, null, "u-3", "Pre-opening team forming for coastal resort portfolio."],
  ["ruyah", "Ruyah Insurance", "UAE", "Sharjah", "Financial Services", "250-999", "Nurture", "Engaged", "Low", "Medium", ["restructuring"], [], [2, 2], -70, 30, "u-2", "Paused during merger integration. Revisit next quarter."],
  ["wadicrest", "Wadi Crest Foods", "Saudi Arabia", "Dammam", "Manufacturing", "1000-4999", "Contacted", "Contacted", "Medium", "Medium", ["nationalisation"], [], [3, 3], -8, -1, "u-3", ""],
  ["palmgate", "Palmgate Engineering Consultants", "Saudi Arabia", "Riyadh", "Professional Services", "1000-4999", "Lost", "Proposal", "Medium", "Medium", ["leadership-succession"], [], [3, 3], -25, null, "u-1", "Lost on timing — budget moved to next fiscal year."],
  ["lumora", "Lumora Pay", "UAE", "Dubai", "Technology", "50-249", "Target", "Target", "Low", "Low", [], [], [2, 2], null, 14, "u-2", ""],
  ["zaytoun", "Zaytoun Retail Group", "Saudi Arabia", "Riyadh", "Retail", "1000-4999", "Engaged", "Engaged", "High", "High", ["sales-pressure", "customer-experience"], ["frontline"], [4, 4], -40, null, "u-3", "Good first call, then went quiet."],
  ["azurite", "Azurite Care Hospitals", "Saudi Arabia", "Dammam", "Healthcare", "5000+", "Target", "Target", "High", "High", ["leadership-succession", "new-l&d-leader"], ["flagship"], [3, 4], null, null, "u-3", "New Chief People Officer announced publicly."],
  ["vantora", "Vantora Industrial Group", "UAE", "Abu Dhabi", "Manufacturing", "5000+", "Researching", "Researching", "Medium", "High", ["digital-transformation"], [], [3, 3], null, 5, "u-1", ""],
  ["mirabel", "Mirabel Hotels & Residences", "UAE", "Ras Al Khaimah", "Hospitality", "250-999", "Contacted", "Contacted", "Medium", "Medium", ["customer-experience"], [], [3, 2], -4, 7, "u-2", ""],
  ["tessellate", "Tessellate Consulting", "Saudi Arabia", "Riyadh", "Professional Services", "50-249", "Negotiation", "Negotiation", "Medium", "Medium", ["rapid-growth"], [], [3, 3], -1, 2, "u-1", "Negotiating cohort size and start date."],
];

type ContactRow = [account: string, name: string, title: string, dept: string, seniority: Seniority, role: StakeholderRole, lastInteraction: number | null, nextAction: string];

const CONTACTS: ContactRow[] = [
  ["meridian", "Dr. Layla Haddad", "Chief Human Resources Officer", "Human Resources", "C-level", "Decision Maker", -20, "Meet once the L&D case is shaped"],
  ["meridian", "Omar Farouk", "Head of Learning & Development", "Learning & Development", "Head / Manager", "Champion", -3, "Discovery call on new clinic manager readiness"],
  ["meridian", "Samir Khoury", "Chief Operating Officer", "Operations", "C-level", "Influencer", null, "Understand operational impact of new openings"],
  ["meridian", "Grace Mensah", "Director of Nursing", "Clinical Operations", "VP / Director", "User", null, ""],
  ["najd", "Faisal Al Harbi", "HR Director", "Human Resources", "VP / Director", "Decision Maker", -6, "Confirm pilot group size"],
  ["najd", "Noura Al Qahtani", "Talent Development Manager", "Talent", "Head / Manager", "Champion", -6, "Share supervisor competency framework"],
  ["najd", "Tariq Aziz", "Procurement Lead", "Procurement", "Head / Manager", "Procurement", null, "Vendor registration requirements"],
  ["falconridge", "Hana Rahman", "VP People & Culture", "People & Culture", "VP / Director", "Decision Maker", -2, "Send meeting recap"],
  ["falconridge", "Daniel Costa", "Learning Manager", "Learning & Development", "Head / Manager", "Champion", -2, ""],
  ["falconridge", "Mariam Saleh", "Cluster General Manager", "Operations", "VP / Director", "Influencer", null, ""],
  ["sahra", "Abdullah Al Otaibi", "Chief Human Capital Officer", "Human Capital", "C-level", "Decision Maker", -9, "Proposal decision"],
  ["sahra", "Reem Al Dossary", "Head of Leadership Development", "Learning & Development", "Head / Manager", "Champion", -9, "Answer proposal questions"],
  ["sahra", "Yousef Khalil", "Procurement Manager", "Procurement", "Head / Manager", "Procurement", null, ""],
  ["tamarind", "Aisha Karim", "Head of Retail Training", "Learning & Development", "Head / Manager", "Unknown", -12, "Follow up on LinkedIn note"],
  ["qamar", "Ibrahim Nasser", "HR Manager", "Human Resources", "Head / Manager", "Unknown", null, "First outreach once research is done"],
  ["oryxline", "Sofia Petrova", "VP Engineering", "Engineering", "VP / Director", "Influencer", -5, ""],
  ["oryxline", "Karim Haddad", "Head of People", "People", "Head / Manager", "Champion", -5, "Book discovery call"],
  ["harbourline", "Elena Rossi", "Managing Partner", "Leadership", "C-level", "Decision Maker", -15, "Kick-off planning"],
  ["harbourline", "Ahmed Saeed", "HR Business Partner", "Human Resources", "Head / Manager", "Champion", -15, ""],
  ["ruyah", "Nadia Hussein", "L&D Specialist", "Learning & Development", "Specialist", "User", -70, "Check in after merger"],
  ["wadicrest", "Majed Al Shehri", "HR Director", "Human Resources", "VP / Director", "Unknown", -8, "Follow up by phone"],
  ["palmgate", "Lina Barakat", "Head of Talent", "Talent", "Head / Manager", "Champion", -25, "Nurture — revisit budget next FY"],
  ["zaytoun", "Salman Al Ghamdi", "Chief Commercial Officer", "Commercial", "C-level", "Decision Maker", -40, ""],
  ["zaytoun", "Dina Mahmoud", "Training Manager", "Learning & Development", "Head / Manager", "Champion", -40, "Re-engage with store manager angle"],
  ["mirabel", "Chris Walker", "Director of Human Resources", "Human Resources", "VP / Director", "Unknown", -4, ""],
  ["tessellate", "Rania Aboud", "Managing Director", "Leadership", "C-level", "Decision Maker", -1, "Agree cohort size"],
  ["tessellate", "Hassan Jaber", "Operations Manager", "Operations", "Head / Manager", "Gatekeeper", -1, ""],
];

type OppRow = [account: string, name: string, stage: OpportunityStage, programmes: string[], problem: string, nextStep: string, nextStepDate: number | null, closeDate: number | null, probability: number | null];

const OPPORTUNITIES: OppRow[] = [
  ["najd", "Supervisor Development Pilot", "Qualified", ["prog-ftm"], "National operators promoted to supervisor with limited people-leadership preparation (hypothesis confirmed by Talent Development).", "Share pilot outline with Talent Development", 2, 60, null],
  ["falconridge", "Service Leadership Pathway", "Meeting", ["prog-ldp", "prog-comm"], "New property openings need supervisors and heads of department ready to lead service teams.", "Send meeting recap and agree proposal scope", 1, 75, null],
  ["sahra", "Leading Digital Change — People Managers", "Proposal", ["prog-ldp"], "Managers expected to lead digital adoption without change-leadership support.", "Proposal decision follow-up", -2, 20, 50],
  ["harbourline", "Consultative Selling for Managers", "Won", ["prog-sell"], "Managers expected to grow client accounts but trained only in delivery.", "Delivery kick-off", 20, -10, 100],
  ["palmgate", "Succession Leadership Cohort", "Lost", ["prog-exec"], "Thin bench for senior engineering leadership roles.", "", null, -25, 0],
  ["tessellate", "First-Time Manager Cohort", "Negotiation", ["prog-ftm"], "Rapid growth has put new managers in charge of client teams.", "Agree cohort size and start date", 2, 14, 70],
];

type ActivityRow = [account: string, type: ActivityType, status: "done" | "planned", day: number, summary: string, outcome: Activity["outcome"], contactName?: string, opp?: string];

const ACTIVITIES: ActivityRow[] = [
  ["meridian", "LinkedIn", "done", -10, "Relevance-led note to Head of L&D about new clinic manager readiness", "positive", "Omar Farouk"],
  ["meridian", "Call", "done", -3, "Intro call — expansion into KSA confirmed; clinic managers promoted from clinical roles", "positive", "Omar Farouk"],
  ["meridian", "Follow-up", "planned", 1, "Book discovery session with Head of L&D", null, "Omar Farouk"],
  ["najd", "Meeting", "done", -6, "Qualification call — pilot interest for 25 supervisors", "positive", "Noura Al Qahtani", "najd"],
  ["najd", "Email", "planned", 2, "Share pilot outline with Talent Development", null, "Noura Al Qahtani", "najd"],
  ["falconridge", "Meeting", "done", -2, "Discovery meeting with VP People — openings pipeline and service standards", "positive", "Hana Rahman", "falconridge"],
  ["falconridge", "Email", "planned", 0, "Send meeting recap to VP People", null, "Hana Rahman", "falconridge"],
  ["sahra", "Proposal", "done", -9, "Proposal submitted for digital change leadership", null, "Reem Al Dossary", "sahra"],
  ["sahra", "Follow-up", "planned", -2, "Proposal decision follow-up with Head of Leadership Development", null, "Reem Al Dossary", "sahra"],
  ["tamarind", "LinkedIn", "done", -12, "Connection note to Head of Retail Training", "no-response", "Aisha Karim"],
  ["tamarind", "Follow-up", "planned", 0, "Follow up with a store manager coaching angle", null, "Aisha Karim"],
  ["qamar", "Note", "done", -2, "Research: clinic network growing; HR manager identified", null],
  ["oryxline", "Email", "done", -9, "Email to Head of People on engineering manager transition", "positive", "Karim Haddad"],
  ["oryxline", "Call", "done", -5, "Call — 12 new team leads this year; interested in a short programme", "positive", "Karim Haddad"],
  ["harbourline", "Meeting", "done", -15, "Agreement on pilot cohort", "positive", "Elena Rossi", "harbourline"],
  ["ruyah", "Email", "done", -70, "Check-in — paused due to merger", "neutral", "Nadia Hussein"],
  ["wadicrest", "Call", "done", -8, "Call to HR Director — asked to follow up next week", "neutral", "Majed Al Shehri"],
  ["wadicrest", "Call", "planned", -1, "Follow-up call to HR Director", null, "Majed Al Shehri"],
  ["palmgate", "Note", "done", -25, "Lost — budget moved to next fiscal year. Relationship with Head of Talent is good.", null, "Lina Barakat", "palmgate"],
  ["zaytoun", "Call", "done", -40, "Discovery call with Training Manager — store manager coaching gap discussed", "positive", "Dina Mahmoud"],
  ["zaytoun", "Email", "done", -30, "Follow-up email with case for store manager coaching", "no-response", "Dina Mahmoud"],
  ["mirabel", "Email", "done", -4, "First email to HR Director on guest-experience leadership", "no-response", "Chris Walker"],
  ["mirabel", "LinkedIn", "planned", 7, "LinkedIn follow-up to HR Director", null, "Chris Walker"],
  ["tessellate", "Meeting", "done", -1, "Negotiation meeting — cohort of 12 vs 16 under discussion", "positive", "Rania Aboud", "tessellate"],
  ["tessellate", "Call", "planned", 2, "Confirm cohort size and start date", null, "Rania Aboud", "tessellate"],
  ["vantora", "Note", "done", -1, "Research: digital transformation programme announced in annual report", null],
];

const PROGRAMMES: [id: string, name: string, description: string, caps: Programme["capabilities"], levels: Programme["levels"], format: string][] = [
  ["prog-ldp", "DEMO — Leadership Development Programme", "Placeholder for a mid-level leadership programme. Replace with the real Bloom offer.", ["strategic-leadership", "change-leadership", "coaching", "communication"], ["Middle management", "Senior leaders"], "Blended cohort (placeholder)"],
  ["prog-ftm", "DEMO — First-Time Manager Programme", "Placeholder for new-manager transition support.", ["people-management", "coaching", "delegation", "communication"], ["Frontline", "Middle management"], "Modular cohort (placeholder)"],
  ["prog-sell", "DEMO — Consultative Selling Programme", "Placeholder for consultative and value-based selling.", ["consultative-selling", "negotiation", "customer-experience"], ["Individual contributors", "Frontline"], "Workshop series (placeholder)"],
  ["prog-exec", "DEMO — Executive Leadership Programme", "Placeholder for senior executive development.", ["strategic-leadership", "change-leadership", "business-acumen", "data-decisions"], ["Senior leaders", "Executives"], "Executive modules (placeholder)"],
  ["prog-comm", "DEMO — Communication & Collaboration Programme", "Placeholder for cross-functional communication and collaboration.", ["collaboration", "communication", "customer-experience"], ["Individual contributors", "Frontline", "Middle management"], "Workshops (placeholder)"],
  ["prog-sales-lead", "DEMO — Sales Leadership Programme", "Placeholder for sales manager coaching and pipeline leadership.", ["sales-leadership", "coaching", "negotiation", "data-decisions"], ["Frontline", "Middle management"], "Blended cohort (placeholder)"],
];

export function createDemoDatabase(today: string = todayISO()): Database {
  const stamp = new Date().toISOString();
  const base = { createdAt: stamp, updatedAt: stamp };
  const d = (n: number | null) => (n === null ? null : addDays(today, n));

  const users: User[] = [
    { id: "u-1", name: "Demo BD Manager", role: "Head of Corporate Sales (demo)", ...base },
    { id: "u-2", name: "Demo BD Executive — UAE", role: "Business Development (demo)", ...base },
    { id: "u-3", name: "Demo BD Executive — KSA", role: "Business Development (demo)", ...base },
  ];

  const accounts: Account[] = ACCOUNTS.map(([key, name, country, city, industry, sizeBand, stage, highestStage, priority, trainingPotential, signals, tags, , last, next, ownerId, notes], i) => ({
    id: `acc-${key}`,
    name,
    country,
    city,
    industry,
    sizeBand,
    website: `https://${key}.example`,
    ownerId,
    stage,
    highestStage,
    priority,
    trainingPotential,
    signals,
    tags,
    notes,
    lastContactedAt: d(last),
    nextFollowUpAt: d(next),
    isDemo: true,
    ...base,
    createdAt: addDays(today, -60 + i),
  }));

  const accountScores: AccountScore[] = ACCOUNTS.map(([key, , , , , , , , , , , , [need, strategic]]) => ({
    id: `score-${key}`,
    accountId: `acc-${key}`,
    ratings: { trainingNeed: need, strategicRelevance: strategic },
    evidence: "Demo rating — replace with BD judgement based on real evidence.",
    ...base,
  }));

  const contacts: Contact[] = CONTACTS.map(([acc, name, title, department, seniority, role, last, nextAction], i) => ({
    id: `con-${i + 1}`,
    accountId: `acc-${acc}`,
    name,
    title,
    department,
    seniority,
    role,
    linkedinUrl: "",
    email: `${name.toLowerCase().replace(/^dr\. /, "").replace(/[^a-z]+/g, ".")}@${acc}.example`,
    phone: "",
    notes: "",
    lastInteractionAt: d(last),
    nextAction,
    ...base,
  }));

  const contactId = (acc: string, name?: string) => contacts.find((c) => c.accountId === `acc-${acc}` && c.name === name)?.id ?? null;

  const opportunities: Opportunity[] = OPPORTUNITIES.map(([acc, name, stage, programmeIds, businessProblem, nextStep, nextStepDate, closeDate, probability]) => {
    const accContacts = contacts.filter((c) => c.accountId === `acc-${acc}`);
    const primary = accContacts.find((c) => c.role === "Champion") ?? accContacts[0];
    return {
      id: `opp-${acc}`,
      accountId: `acc-${acc}`,
      name,
      stage,
      programmeIds,
      primaryContactId: primary?.id ?? null,
      contactIds: accContacts.map((c) => c.id),
      estimatedValue: null,
      currency: ACCOUNTS.find((a) => a[0] === acc)?.[2] === "UAE" ? "AED" : "SAR",
      probability,
      targetCloseDate: d(closeDate),
      businessProblem,
      nextStep,
      nextStepDate: d(nextStepDate),
      notes: "",
      ...base,
    };
  });

  const activities: Activity[] = ACTIVITIES.map(([acc, type, status, day, summary, outcome, contactName, opp], i) => ({
    id: `act-${i + 1}`,
    accountId: `acc-${acc}`,
    opportunityId: opp ? `opp-${opp}` : null,
    contactId: contactId(acc, contactName),
    type,
    status,
    date: addDays(today, day),
    summary,
    outcome,
    ...base,
  }));

  const programmes: Programme[] = PROGRAMMES.map(([id, name, description, capabilities, levels, format]) => ({
    id,
    name,
    isDemo: true,
    description,
    capabilities,
    levels,
    format,
    ...base,
  }));

  return {
    version: SCHEMA_VERSION,
    seededAt: today,
    users,
    accounts,
    accountScores,
    contacts,
    opportunities,
    activities,
    programmes,
    recommendations: [],
    settings: { weights: { ...DEFAULT_WEIGHTS } },
  };
}

export function emptyDatabase(programmes: Programme[] = [], users: User[] = []): Database {
  return {
    version: SCHEMA_VERSION,
    seededAt: todayISO(),
    users,
    accounts: [],
    accountScores: [],
    contacts: [],
    opportunities: [],
    activities: [],
    programmes,
    recommendations: [],
    settings: { weights: { ...DEFAULT_WEIGHTS } },
  };
}
