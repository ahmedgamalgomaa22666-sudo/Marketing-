/**
 * Public website content — single source of truth for the site and the printable CV.
 *
 * RULE: only verified facts. Anything in [square brackets] is a placeholder and is rendered
 * visibly as one. Replace placeholders with verified details (employer names, dates, numbers)
 * or delete them. Never add achievements, logos or testimonials that cannot be evidenced.
 */

export const person = {
  name: "Ahmed Gamal El-Din Gomaa",
  headline: "Pharmaceutical Sales Leadership · Business Development · B2B Consultative Selling · GCC Markets",
  summary:
    "Commercial leader with 15+ years in pharmaceutical sales and B2B business development across the UAE, Saudi Arabia and Egypt — launching products, developing markets and using sales analytics to turn data into commercial decisions.",
  location: "[City, Country]",
  email: "[your.email@example.com]",
  linkedin: "[LinkedIn profile URL]",
  phone: "[Phone — optional]",
  availability: "Open to conversations about commercial leadership and business development roles across the GCC.",
};

export const keyFacts = [
  { value: "15+", label: "years in commercial sales" },
  { value: "3", label: "markets: UAE · Saudi Arabia · Egypt" },
  { value: "B2B", label: "consultative selling & business development" },
  { value: "Data", label: "sales analytics & performance management" },
];

export const about = [
  "I have spent more than fifteen years in commercial roles, most of them in pharmaceutical sales leadership. My work has covered the full commercial cycle: preparing and executing product launches, building presence in new territories, leading sales teams, and managing relationships with the customers and stakeholders who influence decisions.",
  "Across the UAE, Saudi Arabia and Egypt, I have learned that growth comes from disciplined fundamentals — knowing which accounts matter, understanding the people behind a decision, following up consistently, and measuring what actually moves the numbers. I increasingly apply the same discipline to B2B business development beyond pharma, and I build my own tools to do it well.",
];

export const trackRecord = [
  {
    title: "Pharmaceutical sales leadership",
    body: "Leading sales teams and territories in regulated, relationship-driven markets.",
    evidence: "[Add verified result — e.g. team size led, growth vs. target, ranking]",
  },
  {
    title: "Product launches",
    body: "Preparing and executing product launches: targeting, messaging, field execution and early-adoption tracking.",
    evidence: "[Add verified launch — product category, market, outcome]",
  },
  {
    title: "Market development",
    body: "Opening and growing territories and accounts across the UAE, Saudi Arabia and Egypt.",
    evidence: "[Add verified result — e.g. new accounts, market share, coverage]",
  },
  {
    title: "B2B business development",
    body: "Consultative selling to organisational buyers: account prioritisation, stakeholder mapping, discovery and follow-up discipline.",
    evidence: "[Add verified result — e.g. pipeline built, deals closed]",
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
  { group: "Commercial leadership", items: ["Pharmaceutical sales leadership", "Team coaching & performance management", "Territory & account planning", "Product launch execution"] },
  { group: "Business development", items: ["B2B consultative selling", "Account qualification & prioritisation", "Stakeholder mapping", "Discovery & needs analysis", "Pipeline & follow-up discipline"] },
  { group: "Analytics & problem-solving", items: ["Sales analytics & KPI tracking", "Funnel & conversion analysis", "Commercial problem-solving", "[Tools — e.g. CRM, Excel, BI]"] },
  { group: "Markets", items: ["United Arab Emirates", "Saudi Arabia", "Egypt", "GCC healthcare & B2B environments"] },
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

export const projects = [
  {
    slug: "bd-operating-system",
    title: "B2B Business Development Operating System",
    kicker: "Proof of work · Product",
    summary:
      "A working BD operating system I designed and built: account qualification, stakeholder mapping, discovery, opportunity mapping, pipeline, follow-up discipline and commercial analytics — configurable for any B2B company. First use case: a corporate-training business in the UAE and Saudi Arabia.",
    points: [
      "Transparent 0–100 account fit score with reasons and risks",
      "Stakeholder maps, discovery briefs and a deal coach that label guesses as hypotheses",
      "Honest funnel analytics — no metric without underlying data",
      "Reusable core + company profiles (industry modules are optional)",
    ],
    links: [
      { label: "Read the case study", href: "/projects/bd-operating-system" },
      { label: "Open the live demo", href: "/workspace/demo" },
    ],
  },
  {
    slug: "bloom-marketing-plan",
    title: "12-month marketing plan — business school (sample work)",
    kicker: "Strategy · Sample",
    summary: "A structured marketing plan: SWOT, personas, positioning, KPIs, channel strategy, funnel, quarterly roadmap and budget split. Figures are illustrative targets, not results.",
    points: ["Audience personas and positioning", "Channel mix, funnel and budget allocation", "Measurement framework and 30-day action plan"],
    links: [{ label: "View the plan", href: "/marketing-site/bloom-marketing-plan.html" }],
  },
];

export const nav = [
  { href: "/#about", label: "About" },
  { href: "/#track-record", label: "Track record" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#case-studies", label: "Case studies" },
  { href: "/#projects", label: "Projects" },
  { href: "/cv", label: "CV" },
  { href: "/#contact", label: "Contact" },
];

export function isPlaceholder(text: string): boolean {
  return /^\[.*\]$/.test(text.trim());
}
