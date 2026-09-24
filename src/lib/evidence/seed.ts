import { nowStamp } from "../dates";
import type { CareerContext, EvidenceEntry } from "../types";

/**
 * Starter career data — ONLY facts Ahmed has verified. Evidence starts Self-recorded, Private
 * and not approved for public use. No dates, sources, actions or numbers are added beyond
 * the verified statements; empty fields are for Ahmed to complete.
 */
export function starterContexts(): CareerContext[] {
  const s = nowStamp();
  const base = { createdAt: s, updatedAt: s, archived: false };
  return [
    {
      ...base, id: "ctx-sigma", name: "Sigma Pharmaceutical Company", publicLabel: "", industry: "Pharmaceuticals", markets: ["Egypt"], startYear: "2010", endYear: "2011", archived: true,
      roles: [{ title: "Medical Sales Representative", type: "Individual contributor", start: "2010", end: "2011" }],
    },
    {
      ...base, id: "ctx-apex", name: "Apex Pharma", publicLabel: "", industry: "Pharmaceuticals", markets: ["Egypt"], startYear: "2011", endYear: null,
      roles: [
        { title: "Medical Representative", type: "Individual contributor", start: "2011", end: "2016" },
        { title: "Senior Medical Representative", type: "Individual contributor", start: "2016", end: "2024" },
        { title: "Acting District Supervisor", type: "Leadership", start: "2024", end: null },
      ],
    },
    {
      ...base, id: "ctx-pella", name: "Pella Nova / Pella Group", publicLabel: "", industry: "", markets: ["UAE", "Saudi Arabia", "Egypt"], startYear: "2026", endYear: null,
      roles: [{ title: "Remote Sales Specialist", type: "Business development", start: "2026", end: null }],
    },
    {
      ...base, id: "ctx-bloom", name: "Bloom Business School", publicLabel: "", industry: "Corporate training / executive education", markets: ["UAE", "Saudi Arabia"], startYear: "2026", endYear: null,
      roles: [{ title: "Freelance Business Developer", type: "Business development", start: "2026", end: null }],
    },
  ];
}

export function starterEvidence(): EvidenceEntry[] {
  const s = nowStamp();
  const entry = (id: string, over: Partial<EvidenceEntry>): EvidenceEntry => ({
    id, createdAt: s, updatedAt: s,
    date: null, contextId: "ctx-apex", role: "", market: "Egypt", industry: "Pharmaceuticals", tier: "Achievement", category: "Other",
    metricKey: null, metric: "", value: null, result: "", context: "", contribution: "", capabilities: [],
    status: "Self-recorded", verificationSource: "", confidentiality: "Private", publicVersion: "", approvedForPublic: false,
    star: { situation: "", action: "", result: "", lesson: "" },
    ...over,
  });
  return [
    entry("ev-launch", { category: "Product launch", metric: "% of launch target", value: 400, result: "Achieved 400% of target on a pharmaceutical product launch.", capabilities: ["Product launch"] }),
    entry("ev-eraloner", { category: "Market share / position", metric: "Market position (rank)", value: 1, result: "Built Eraloner to the #1 market position in Minya and Fayoum within 24 months.", capabilities: ["Market development"] }),
    entry("ev-decancit", { category: "Growth", metric: "Growth %", value: 240, result: "Delivered +240% growth on Decancit.", capabilities: ["Product turnaround"] }),
    entry("ev-ezapril", { category: "Growth", metric: "Monthly volume (packs)", value: 25000, result: "Increased Ezapril Co. monthly volume approximately 5x, from 5,000 to 25,000 packs.", capabilities: ["Commercial growth"] }),
    entry("ev-award", { date: "2024", role: "Acting District Supervisor", category: "Recognition", metric: "Company-wide award", result: "Recognised as Best Acting Supervisor 2024 company-wide at Apex Pharma.", capabilities: ["Team leadership"] }),
  ];
}
