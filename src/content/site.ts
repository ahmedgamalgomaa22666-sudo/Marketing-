/**
 * Public website content — single source of truth for the site and the printable CV.
 *
 * RULE: only verified facts. Anything in [square brackets] is a placeholder and is rendered
 * visibly as one. Replace placeholders with verified details (employer names, dates, numbers)
 * or delete them. Never add achievements, logos or testimonials that cannot be evidenced.
 */

export const person = {
  name: "Ahmed Gamal El-Din Gomaa",
  /** Short brand used in the header and titles. */
  brand: "Ahmed Gamal",
  brandLine: "International Business Development",
  headline: "Commercial Growth · B2B Business Development · Consultative Selling · GCC Markets",
  summary:
    "Commercial professional with 15+ years in sales — from pharmaceutical sales leadership, product launches and territory development to B2B business development, consultative selling and C-level outreach across the UAE, Saudi Arabia and Egypt.",
  location: "[City, Country]",
  email: "[your.email@example.com]",
  linkedin: "[LinkedIn profile URL]",
  phone: "[Phone — optional]",
  availability:
    "Open to conversations with founders, CEOs and commercial leaders about business development and commercial growth roles in the UAE, Saudi Arabia and the wider GCC — and international or remote B2B roles.",
};

export const keyFacts = [
  { value: "15+", label: "years in commercial sales" },
  { value: "3", label: "markets: UAE · Saudi Arabia · Egypt" },
  { value: "B2B", label: "business development & consultative selling" },
  { value: "Data", label: "commercial analytics & pipeline discipline" },
];

export const about = [
  "My career has been built in commercial roles — most of it in pharmaceutical sales leadership. That work covered the full commercial cycle: preparing and executing product launches, developing territories and markets, leading and coaching sales teams, and building relationships with the customers and senior stakeholders who shape decisions.",
  "Today I focus on international business development: identifying the right accounts, reaching decision-makers at C-level, understanding their business problems through consultative discovery, and developing accounts over time. Alongside whichever CRM my employer uses, I keep a personal BD platform for account strategy, preparation and learning — so my approach stays consistent and my results are measured, not guessed.",
];

export const trackRecord = [
  {
    title: "Commercial & sales leadership",
    body: "Leading pharmaceutical sales teams and territories in regulated, relationship-driven markets.",
    evidence: "[Add verified result — e.g. team size led, growth vs. target, ranking]",
  },
  {
    title: "Product launches",
    body: "Preparing and executing launches: targeting, messaging, field execution and early-adoption tracking.",
    evidence: "[Add verified launch — product category, market, outcome]",
  },
  {
    title: "Territory & market development",
    body: "Opening and growing territories and accounts across the UAE, Saudi Arabia and Egypt.",
    evidence: "[Add verified result — e.g. new accounts, coverage, share]",
  },
  {
    title: "B2B business development",
    body: "Account prioritisation, C-level outreach, consultative discovery and disciplined follow-up with organisational buyers.",
    evidence: "[Add verified result — e.g. meetings secured, pipeline built, deals closed]",
  },
  {
    title: "Account development",
    body: "Growing existing relationships by mapping stakeholders, understanding priorities and expanding scope over time.",
    evidence: "[Add verified result — e.g. account growth, retention, expansion]",
  },
  {
    title: "Commercial analytics",
    body: "Using sales and pipeline data to decide where to focus, what to change and how to forecast.",
    evidence: "[Add verified example — e.g. analysis that changed a decision]",
  },
];

export const experience = [
  {
    role: "[Job title] — Pharmaceutical Sales Leadership",
    company: "[Company name]",
    period: "[Year – Present]",
    location: "[UAE / Saudi Arabia]",
    points: ["[Scope: team, territory, portfolio]", "[Key verified achievement]", "[Key verified achievement]"],
  },
  {
    role: "[Job title] — Business Development / Sales",
    company: "[Company name]",
    period: "[Year – Year]",
    location: "[Market]",
    points: ["[Scope]", "[Key verified achievement]"],
  },
  {
    role: "[Job title] — Pharmaceutical Sales",
    company: "[Company name]",
    period: "[Year – Year]",
    location: "Egypt",
    points: ["[Scope]", "[Key verified achievement]"],
  },
];

export const skills = [
  { group: "Business development", items: ["B2B business development", "C-level outreach", "Consultative selling & discovery", "Account qualification & prioritisation", "Stakeholder mapping", "Account development"] },
  { group: "Commercial leadership", items: ["Pharmaceutical sales leadership", "Team leadership & coaching", "Product launches", "Territory & market development"] },
  { group: "Analytics", items: ["Commercial analytics & KPI tracking", "Pipeline & funnel analysis", "Commercial problem-solving", "[Tools — e.g. CRM, Excel, BI]"] },
  { group: "Markets", items: ["United Arab Emirates", "Saudi Arabia", "Egypt", "Wider GCC"] },
];

export const caseStudies = [
  {
    title: "Product launch in a competitive therapeutic area",
    tag: "Launch",
    situation: "[Market, product category and starting position — anonymise if needed]",
    approach: "[Targeting, stakeholder engagement, field execution, tracking]",
    result: "[Verified outcome — uptake, share, growth vs. plan]",
  },
  {
    title: "Turning around an underperforming territory",
    tag: "Market development",
    situation: "[Territory, gap vs. target, root causes]",
    approach: "[Account prioritisation, call planning, coaching, analytics]",
    result: "[Verified outcome]",
  },
];

export const certifications = [
  { name: "[Certification or programme name]", issuer: "[Issuer]", year: "[Year]" },
  { name: "[Degree]", issuer: "[University]", year: "[Year]" },
];

/** How I approach business development — method, not claims. */
export const businessDevelopment = {
  intro:
    "Business development, for me, is a discipline: choose the right accounts, understand the people and the problem, earn the conversation, and follow through. The same approach applies whether the product is a medicine, a service, software or a programme.",
  pillars: [
    { title: "Commercial growth", body: "Start from the growth target and work back to the accounts, markets and activities that can realistically deliver it." },
    { title: "Market development", body: "Build presence in a market step by step: segment, prioritise, win reference accounts, then expand coverage." },
    { title: "Account strategy", body: "Prioritise accounts on explicit criteria — fit, need, access, strategic value and engagement — and plan each key account." },
    { title: "Stakeholder management", body: "Map the buying group: who decides, who champions, who influences and who controls procurement. Never rely on a single thread." },
    { title: "Consultative selling", body: "Lead with the client's business problem. Treat assumptions as hypotheses and validate them through discovery before proposing." },
    { title: "C-level outreach", body: "Short, relevant, respectful outreach to senior decision-makers — a clear business reason and one genuine question." },
    { title: "Commercial analytics", body: "Measure the funnel honestly — response, engagement, qualification, conversion and win rates — and act on what the data shows." },
    { title: "Sales leadership", body: "Set clear priorities, coach on real accounts, and build follow-up discipline so no opportunity is lost to inattention." },
  ],
  markets: ["United Arab Emirates", "Saudi Arabia", "Wider GCC", "International / remote B2B"],
};

export const projects = [
  {
    slug: "bd-operating-system",
    title: "Personal Business Development Platform",
    kicker: "Proof of work · How I think about BD",
    summary:
      "A personal intelligence layer I designed and use alongside any company CRM: account strategy, stakeholder mapping, discovery and meeting preparation, objection analysis, next-best-action planning, win/loss learning and personal BD metrics. Company-independent — it moves with me from employer to employer.",
    points: [
      "Complements the employer's CRM (Bitrix, HubSpot, Salesforce…) — never replaces it",
      "Transparent account prioritisation with reasons and risks",
      "Discovery briefs that separate hypotheses from facts",
      "Personal BD metrics that turn activity into evidence for CVs and interviews",
    ],
    links: [{ label: "Read the case study", href: "/projects/bd-operating-system" }],
  },
];

export const nav = [
  { href: "/#about", label: "About" },
  { href: "/#track-record", label: "Track record" },
  { href: "/#experience", label: "Experience" },
  { href: "/#business-development", label: "Business development" },
  { href: "/#case-studies", label: "Case studies" },
  { href: "/#projects", label: "Projects" },
  { href: "/cv", label: "CV" },
  { href: "/#contact", label: "Contact" },
];

export function isPlaceholder(text: string): boolean {
  return /^\[.*\]$/.test(text.trim());
}
