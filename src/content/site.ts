/**
 * PUBLIC PLATFORM CONTENT — the single source for the website and the printable CV.
 *
 * Rules
 * - Only verified facts supplied by Ahmed. Anything in [square brackets] is a placeholder and
 *   is rendered visibly as one; replace it or delete it before publication.
 * - SHOW > CLAIM: every claim should point to evidence. No generic adjectives.
 * - 15+ years = COMMERCIAL SALES experience. Business development roles began in 2026 and are
 *   presented as such — never as 15 years of BD.
 * - This file is never generated from private workspace data. Evidence may only be added here
 *   manually, anonymised and approved (see docs/ROADMAP.md → Evidence Log).
 *
 * Every result below is editable: review wording, context and figures before publishing.
 */

export const person = {
  name: "Ahmed Gamal El-Din Gomaa",
  brand: "Ahmed Gamal",
  brandLine: "Commercial & Business Development",
  headline: "Commercial Sales Leadership · Business Development · B2B Consultative Selling · GCC Markets",
  /** One-sentence answer to "Who is Ahmed?" */
  intro:
    "15+ years in pharmaceutical commercial sales — from medical representative to acting district supervisor — now applying that commercial discipline to B2B business development for Dubai-based businesses.",
  location: "[City, Country]",
  email: "[professional.email@example.com]",
  linkedin: "[https://www.linkedin.com/in/your-profile]",
  /** Path of an uploaded CV PDF in /public (e.g. "/Ahmed-Gamal-CV.pdf"). Placeholder until provided. */
  cvFile: "[/Ahmed-Gamal-CV.pdf]",
  availability:
    "Open to conversations with CEOs, founders, commercial directors and recruiters about business development and commercial roles in the UAE, Saudi Arabia and the wider GCC.",
};

/**
 * Verified commercial results. Editable before publication — confirm wording and add context.
 * `context` fields in [brackets] are optional details (product area, year, employer); anonymise
 * product names if required.
 */
export const results = [
  { id: "launch", value: "400%", label: "of target on a product launch", context: "[Year · therapeutic area — optional]" },
  { id: "position", value: "#1", label: "market position in Minya & Fayoum within 24 months", context: "[Product / therapeutic area — optional]" },
  { id: "turnaround", value: "+240%", label: "growth on a product turnaround", context: "[Period · starting position — optional]" },
  { id: "volume", value: "~5×", label: "monthly volume growth — 5,000 → 25,000 packs", context: "[Period — optional]" },
  { id: "award", value: "2024", label: "Best Acting Supervisor, company-wide", context: "Apex Pharma" },
];

export const about = {
  title: "A commercial career built on results in the field",
  paragraphs: [
    "I started in pharmaceutical sales in 2010 and have spent my career since then in commercial roles: launching products, building market position territory by territory, turning around products that were losing ground, and — as Acting District Supervisor at Apex Pharma — leading and coaching a field team.",
    "Since 2026 I have been applying that experience to B2B business development: remote sales and business development work for Dubai-based Pella Nova / Pella Group, and freelance business development for Bloom Business School. It is an early-stage chapter, and I treat it the way I treated every territory — with a clear method, disciplined follow-up and honest measurement.",
  ],
  facts: [
    { label: "Commercial sales experience", value: "15+ years (since 2010)" },
    { label: "Current role", value: "Acting District Supervisor, Apex Pharma" },
    { label: "Business development", value: "Since 2026 — Dubai-based B2B" },
    { label: "Education", value: "B.Sc. Pharmaceutical Sciences, Minia University" },
  ],
};

/** "What commercial problems can Ahmed solve?" — each problem links to evidence. */
export const problems = [
  { problem: "Launching a product into a market", evidence: "400% of target on a product launch" },
  { problem: "Building market leadership in a territory", evidence: "#1 in Minya & Fayoum within 24 months" },
  { problem: "Turning around an underperforming product", evidence: "+240% growth; ~5× monthly volume" },
  { problem: "Leading and developing a field team", evidence: "Best Acting Supervisor 2024, company-wide" },
  { problem: "Opening B2B conversations with decision-makers", evidence: "Current BD work for Dubai-based businesses (2026 –)" },
];

export const experience = [
  {
    chapter: "Business development",
    company: "Pella Nova / Pella Group",
    location: "Dubai-based · remote",
    period: "2026 – Present",
    roles: [{ title: "Remote Sales Specialist — business development exposure", period: "2026 – Present" }],
    points: ["[Scope — e.g. markets, segments, type of clients approached]", "[What you do — e.g. prospecting, discovery calls, proposals]"],
  },
  {
    chapter: "Business development",
    company: "Bloom Business School",
    location: "Freelance",
    period: "2026 – Present",
    roles: [{ title: "Freelance Business Developer", period: "2026 – Present" }],
    points: ["[Scope — e.g. corporate training accounts, markets]", "[What you do — e.g. account research, outreach, meetings]"],
  },
  {
    chapter: "Commercial sales leadership",
    company: "Apex Pharma",
    location: "Egypt",
    period: "2011 – Present",
    roles: [
      { title: "Acting District Supervisor", period: "[Year] – Present" },
      { title: "Senior Medical Representative", period: "[Year – Year]" },
      { title: "Medical Representative", period: "2011 – [Year]" },
    ],
    points: ["Best Acting Supervisor 2024, company-wide", "[Team size and territory you supervise]", "[Link verified results to this role, if applicable]"],
  },
  {
    chapter: "Commercial sales leadership",
    company: "Sigma Pharmaceutical Company",
    location: "Egypt",
    period: "2010 – 2011",
    roles: [{ title: "Medical Sales Representative", period: "2010 – 2011" }],
    points: ["[Territory / portfolio — optional]"],
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
    { title: "Proven in the field", body: "Launch, market-position, turnaround and volume results achieved in competitive pharmaceutical markets." },
    { title: "Leadership recognised", body: "Named Best Acting Supervisor 2024 company-wide at Apex Pharma." },
    { title: "Already working in the region's B2B market", body: "Business development work for Dubai-based businesses since 2026." },
    { title: "Structured and data-literate", body: "Google Data Analytics certificate, and a personal BD system for prioritisation and measurement (see Commercial Lab)." },
  ],
  markets: ["United Arab Emirates", "Saudi Arabia", "Wider GCC", "International / remote B2B"],
};

/**
 * Case studies from verified results. Situation/approach details are placeholders to complete
 * (anonymise products or customers if needed). The result line is verified.
 */
export const caseStudies = [
  {
    id: "launch",
    tag: "Product launch",
    title: "A launch delivered at 400% of target",
    result: "400% of target",
    situation: "[Market, product category and competitive context — anonymise if needed]",
    approach: "[Targeting, key customers, messaging, field execution]",
    lesson: "[What you would repeat in any new market]",
  },
  {
    id: "position",
    tag: "Market development",
    title: "From entry to #1 in Minya & Fayoum in 24 months",
    result: "#1 market position within 24 months",
    situation: "[Starting position and competitors]",
    approach: "[Account prioritisation, relationships, coverage, follow-up]",
    lesson: "[What this shows about building a territory]",
  },
  {
    id: "turnaround",
    tag: "Turnaround",
    title: "Turning a declining product around: +240%",
    result: "+240% growth",
    situation: "[Why the product was underperforming]",
    approach: "[Diagnosis, actions taken, how progress was tracked]",
    lesson: "[What you learned about turnarounds]",
  },
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
  { group: "Business development", items: ["B2B consultative selling", "Account prioritisation", "Stakeholder mapping", "Decision-maker outreach"] },
  { group: "Analytics & marketing", items: ["Data analytics (Google certificate)", "Sales & funnel analysis", "Marketing (professional diploma)"] },
];

export const education = [{ name: "B.Sc. Pharmaceutical Sciences", issuer: "Minia University", year: "[Year]" }];

export const certifications = [
  { name: "Google Data Analytics Professional Certificate", issuer: "Google / Coursera", year: "[Year]" },
  { name: "Strategic Leadership & Management", issuer: "University of Illinois / Coursera", year: "[Year]" },
  { name: "Leading People and Teams", issuer: "University of Michigan / Coursera", year: "[Year]" },
  { name: "Marketing Professional Diploma", issuer: "[Issuing institution]", year: "[Year]" },
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

export function isPlaceholder(text: string): boolean {
  return /^\[.*\]$/.test(text.trim());
}
