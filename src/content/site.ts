/**
 * PUBLIC PLATFORM CONTENT — the single source for the website and the printable CV.
 *
 * Rules
 * - Only verified facts supplied by Ahmed. Wording of results must not be strengthened.
 * - Unverified fields are `null` = UNPUBLISHED. The site hides them gracefully; nothing
 *   placeholder-like is ever shown publicly. Fill them in here when verified
 *   (see docs/PUBLICATION_CHECKLIST.md).
 * - SHOW > CLAIM: every claim should point to evidence. No generic adjectives.
 * - 15+ years = COMMERCIAL SALES experience. Business development began in 2026 and is
 *   presented as such. No revenue, deals or clients won are claimed for BD roles.
 * - This file is never generated from private workspace data. Evidence may only be added here
 *   manually, anonymised and approved (see docs/ROADMAP.md → Evidence Log).
 */

type Maybe = string | null;

/** True when a field is filled in and may be published. */
export function has(value: Maybe | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export const person = {
  name: "Ahmed Gamal El-Din Gomaa",
  brand: "Ahmed Gamal",
  brandLine: "Commercial & Business Development",
  headline: "Commercial Sales Leadership · Business Development · B2B Consultative Selling · GCC Markets",
  /** One-sentence answer to "Who is Ahmed?" */
  intro:
    "15+ years in pharmaceutical commercial sales — from medical representative to acting district supervisor — now working remotely in B2B business development for businesses in the UAE and GCC.",
  location: "Egypt · Open to UAE & GCC Opportunities",
  /** UNPUBLISHED until provided. */
  email: null as Maybe,
  /** UNPUBLISHED until provided, e.g. "https://www.linkedin.com/in/…". */
  linkedin: null as Maybe,
  /** UNPUBLISHED until the final PDF is added to /public, e.g. "/Ahmed-Gamal-CV.pdf". */
  cvFile: null as Maybe,
  availability:
    "Open to conversations with CEOs, founders, commercial directors and recruiters about business development and commercial roles in the UAE, Saudi Arabia and the wider GCC.",
};

/** Verified commercial results — all achieved at Apex Pharma. Do not strengthen the wording. */
export const results = [
  { id: "launch", value: "400%", label: "of target on a pharmaceutical product launch", statement: "Achieved 400% of target on a pharmaceutical product launch." },
  { id: "eraloner", value: "#1", label: "market position for Eraloner in Minya and Fayoum within 24 months", statement: "Built Eraloner to the #1 market position in Minya and Fayoum within 24 months." },
  { id: "decancit", value: "+240%", label: "growth delivered on Decancit", statement: "Delivered +240% growth on Decancit." },
  { id: "ezapril", value: "~5×", label: "Ezapril Co. monthly volume, from 5,000 to 25,000 packs", statement: "Increased Ezapril Co. monthly volume approximately 5x, from 5,000 to 25,000 packs." },
  { id: "award", value: "2024", label: "Best Acting Supervisor, company-wide at Apex Pharma", statement: "Recognised as Best Acting Supervisor 2024 company-wide at Apex Pharma." },
];
export const resultsEmployer = "Apex Pharma";

export const about = {
  title: "A commercial career built on results in the field",
  paragraphs: [
    "I started in pharmaceutical sales in 2010 and have worked in commercial roles ever since. At Apex Pharma I progressed from Medical Representative to Senior Medical Representative and, since 2024, Acting District Supervisor — launching products, building market position territory by territory, turning around products that were losing ground, and leading a field team.",
    "In 2026 I began applying that experience to B2B business development, working remotely from Egypt: as a Remote Sales Specialist for Pella Nova / Pella Group, and as a Freelance Business Developer for Bloom Business School. It is a new chapter, and I approach it the way I approached every territory — a clear method, disciplined follow-up and honest measurement.",
  ],
  facts: [
    { label: "Commercial sales experience", value: "15+ years (since 2010)" },
    { label: "Current role", value: "Acting District Supervisor, Apex Pharma" },
    { label: "Business development", value: "Since 2026 — remote, UAE / GCC B2B" },
    { label: "Location", value: "Egypt · Open to UAE & GCC opportunities" },
    { label: "Education", value: "B.Sc. Pharmaceutical Sciences, Minia University" },
  ],
};

/** "What commercial problems can Ahmed solve?" — each problem points to evidence. */
export const problems = [
  { problem: "Launching a product into a market", evidence: "400% of target on a pharmaceutical product launch" },
  { problem: "Building market leadership in a territory", evidence: "Eraloner built to #1 in Minya and Fayoum within 24 months" },
  { problem: "Turning around a product", evidence: "+240% growth delivered on Decancit" },
  { problem: "Growing product volume", evidence: "Ezapril Co. monthly volume ~5×, from 5,000 to 25,000 packs" },
  { problem: "Leading a field team", evidence: "Best Acting Supervisor 2024, company-wide at Apex Pharma" },
  { problem: "Opening B2B conversations with senior decision-makers", evidence: "Current remote BD work across UAE, Saudi Arabia and Egypt (since 2026)" },
];

/**
 * Experience. `points` are published as written; add verified points only.
 * Acting District Supervisor — UNPUBLISHED until verified: team size, territory.
 */
export const experience = [
  {
    chapter: "Business development",
    company: "Pella Nova / Pella Group",
    location: "Dubai-based business · remote",
    period: "2026 – Present",
    roles: [{ title: "Remote Sales Specialist", period: "2026 – Present" }],
    points: [
      "B2B outbound prospecting and account research",
      "Personalised outreach to C-level and senior decision-makers",
      "Discovery, qualification and consultative solution selling",
      "Pipeline development across the UAE, Saudi Arabia and Egypt",
    ],
  },
  {
    chapter: "Business development",
    company: "Bloom Business School",
    location: "Freelance · remote",
    period: "2026 – Present",
    roles: [{ title: "Freelance Business Developer", period: "2026 – Present" }],
    points: [
      "B2B corporate business development for executive education and corporate learning solutions",
      "Target-account identification across the UAE and Saudi Arabia",
      "HR / L&D stakeholder mapping and qualification",
    ],
  },
  {
    chapter: "Commercial sales leadership",
    company: "Apex Pharma",
    location: "Egypt",
    period: "2011 – Present",
    roles: [
      { title: "Acting District Supervisor", period: "2024 – Present" },
      { title: "Senior Medical Representative", period: "2016 – 2024" },
      { title: "Medical Representative", period: "2011 – 2016" },
    ],
    points: [
      "Best Acting Supervisor 2024, company-wide",
      "400% of target on a pharmaceutical product launch",
      "Eraloner built to the #1 market position in Minya and Fayoum within 24 months",
      "+240% growth delivered on Decancit",
      "Ezapril Co. monthly volume increased approximately 5x, from 5,000 to 25,000 packs",
    ],
  },
  {
    chapter: "Commercial sales leadership",
    company: "Sigma Pharmaceutical Company",
    location: "Egypt",
    period: "2010 – 2011",
    roles: [{ title: "Medical Sales Representative", period: "2010 – 2011" }],
    points: [] as string[],
  },
];

export const businessDevelopment = {
  intro:
    "I approach business development the way I learned to build a territory: choose the right accounts, understand the people and the problem, earn the conversation, and follow through. The product changes — a medicine, a training programme, a service — the discipline does not.",
  pillars: [
    { title: "Account strategy", body: "Prioritise accounts on explicit criteria — fit, need, access, strategic value, engagement — before spending time on them." },
    { title: "Stakeholder mapping", body: "Identify who decides, who champions, who influences and who controls procurement. Never rely on a single contact." },
    { title: "Consultative discovery", body: "Lead with the client's business problem; treat assumptions as hypotheses and validate them before proposing." },
    { title: "Decision-maker outreach", body: "Short, relevant messages to senior people — a clear business reason and one genuine question." },
    { title: "Follow-up discipline", body: "Every priority account has a dated next action. Many opportunities are lost to silence, not to competitors." },
    { title: "Commercial analytics", body: "Measure response, engagement, qualification and conversion honestly — and change the approach when the data says so." },
  ],
  /** "Why could Ahmed create value in a GCC commercial role?" — reasoned, not claimed. */
  gccValue: [
    { title: "Proven in the field", body: "Launch, market-position, turnaround and volume results at Apex Pharma in competitive pharmaceutical markets." },
    { title: "Leadership recognised", body: "Named Best Acting Supervisor 2024 company-wide at Apex Pharma." },
    { title: "Already working with GCC B2B markets", body: "Remote business development since 2026 across the UAE, Saudi Arabia and Egypt." },
    { title: "Structured and data-literate", body: "Google Data Analytics certificate, and a personal BD system for prioritisation and measurement (see Commercial Lab)." },
  ],
  markets: ["United Arab Emirates", "Saudi Arabia", "Wider GCC", "International / remote B2B"],
};

/**
 * Case studies built on verified results. `situation`, `actions` and `lessons` are
 * UNPUBLISHED (null) until Ahmed provides them — do not write fictional details.
 */
export const caseStudies = [
  { id: "launch", tag: "Product launch", title: "A pharmaceutical product launch", result: "400% of target", situation: null as Maybe, actions: null as Maybe, lessons: null as Maybe },
  { id: "eraloner", tag: "Market development", title: "Eraloner in Minya and Fayoum", result: "#1 market position within 24 months", situation: null as Maybe, actions: null as Maybe, lessons: null as Maybe },
  { id: "decancit", tag: "Product turnaround", title: "Decancit", result: "+240% growth", situation: null as Maybe, actions: null as Maybe, lessons: null as Maybe },
];

/** Commercial Lab — proof of work. */
export const lab = [
  {
    slug: "bd-intelligence-workspace",
    title: "BD Intelligence Workspace",
    kicker: "Proof of work · personal system",
    summary:
      "The personal system I designed and use to plan business development: account prioritisation, stakeholder mapping, discovery and meeting preparation, next-best-action planning and personal BD metrics. It works alongside an employer's CRM — it never replaces it — and moves with me across companies and industries.",
    points: [
      "Transparent account prioritisation with reasons and risks",
      "Discovery briefs that separate hypotheses from facts",
      "Personal BD metrics — the basis for future verified evidence",
    ],
    href: "/projects/bd-operating-system",
  },
];

export const skills = [
  { group: "Commercial", items: ["Product launches", "Territory & market development", "Product turnarounds", "Key account relationships"] },
  { group: "Leadership", items: ["Field team supervision & coaching", "Performance follow-up", "Strategic leadership & management (certified)"] },
  { group: "Business development", items: ["B2B outbound prospecting", "Account research & prioritisation", "Stakeholder mapping", "Discovery & qualification"] },
  { group: "Analytics & marketing", items: ["Data analytics (Google certificate)", "Sales & funnel analysis", "Marketing (professional diploma)"] },
];

/** `issuer` / `year` are UNPUBLISHED (null) until verified. */
export const education = [{ name: "B.Sc. Pharmaceutical Sciences", issuer: "Minia University" as Maybe, year: null as Maybe }];

export const certifications = [
  { name: "Google Data Analytics Professional Certificate", issuer: null as Maybe, year: null as Maybe },
  { name: "Strategic Leadership & Management", issuer: "University of Illinois / Coursera" as Maybe, year: null as Maybe },
  { name: "Leading People and Teams", issuer: "University of Michigan / Coursera" as Maybe, year: null as Maybe },
  { name: "Marketing Professional Diploma", issuer: null as Maybe, year: null as Maybe },
];

export const nav = [
  { href: "/#about", label: "About" },
  { href: "/#track-record", label: "Track record" },
  { href: "/#experience", label: "Experience" },
  { href: "/#business-development", label: "Business development" },
  { href: "/#case-studies", label: "Case studies" },
  { href: "/#lab", label: "Commercial Lab" },
  { href: "/cv", label: "CV" },
  { href: "/#contact", label: "Contact" },
];

/** Legacy helper: bracketed text is treated as unpublished. */
export function isPlaceholder(text: string): boolean {
  return /^\[.*\]$/.test(text.trim());
}
