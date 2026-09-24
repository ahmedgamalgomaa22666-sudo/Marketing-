import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Personal Business Development Platform",
  description: "Case study: the personal BD platform Ahmed Gamal uses alongside any company CRM — account strategy, discovery preparation, win/loss learning and personal BD metrics.",
};

const SPLIT = [
  ["Company CRM (Bitrix, HubSpot, Salesforce, Zoho, Dynamics…)", ["Official customer and company records", "Team pipeline and forecasting", "Company reporting and compliance", "Owned by the employer"]],
  ["My personal BD platform", ["Account strategy and prioritisation logic", "Stakeholder thinking, discovery and meeting preparation", "Objection analysis, next-best-action planning, win/loss learning", "Personal BD metrics, frameworks and development — owned by me"]],
] as const;

const CAPABILITIES = [
  ["Account prioritisation", "A transparent 0–100 fit score across six weighted dimensions, each with plain-language reasons and risks."],
  ["Stakeholder mapping", "Buying groups by role — decision maker, champion, influencer, procurement — with coverage gaps flagged."],
  ["Discovery preparation", "Briefs with discovery questions and likely objections; every inferred need labelled as a hypothesis."],
  ["Opportunity thinking", "Business problem → need → potential solution → business outcome → discovery questions → next action."],
  ["Deal coaching", "What I know, what I don't, risks, questions and a suggested next step — stage by stage."],
  ["Personal BD metrics", "Response, engagement, qualification, meeting, proposal and win rates — shown as “—” until real data exists."],
];

export default function PlatformCaseStudy() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-700">Commercial project · Case study</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-ink-900 sm:text-5xl">Personal Business Development Platform</h1>
      <p className="mt-5 text-lg leading-relaxed text-stone-600">
        A personal intelligence layer for business development that I designed and use alongside whichever CRM my employer runs. It keeps my method consistent across companies and industries — and turns my BD work into measurable evidence.
      </p>

      <Block title="The problem">
        <p>
          Company CRMs are built to record the company&apos;s customers and pipeline. They rarely help an individual decide which accounts deserve attention, prepare properly for a senior conversation, learn systematically from wins and losses, or carry that know-how from one employer to the next.
        </p>
      </Block>

      <Block title="A clear separation">
        <div className="grid gap-4 sm:grid-cols-2">
          {SPLIT.map(([title, items]) => (
            <div key={title} className="rounded-lg border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-ink-900">{title}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-600">
                {items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm">Official customer records stay in the company CRM. The personal platform holds my thinking, preparation and learning.</p>
      </Block>

      <Block title="What it does">
        <div className="grid gap-4 sm:grid-cols-2">
          {CAPABILITIES.map(([t, d]) => (
            <div key={t} className="rounded-lg border border-stone-200 bg-white p-4">
              <h3 className="font-semibold text-ink-900">{t}</h3>
              <p className="mt-1 text-sm text-stone-600">{d}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Company-independent by design">
        <p>
          The core has no industry built in. Markets, target industries, buyer roles, needs and terminology are configuration — so the same platform works whether I sell training, software, healthcare services, pharmaceuticals, medical devices or consulting.
        </p>
      </Block>

      <Block title="Principles">
        <ul className="list-disc space-y-2 pl-5">
          <li>Transparent over clever: every score and recommendation shows its reasons.</li>
          <li>Hypotheses, not facts: inferred needs are labelled and validated in discovery.</li>
          <li>Human in the loop: outreach is drafted for review, never sent automatically.</li>
          <li>Honest metrics: no rate without underlying records; no invented numbers.</li>
          <li>Privacy first: no scraping, no bulk messaging, contacts editable and deletable.</li>
        </ul>
      </Block>

      <Block title="What it demonstrates">
        <p>
          Account strategy, stakeholder management, consultative discovery, commercial analytics and follow-up discipline — the fundamentals I have practised through years of commercial and pharmaceutical sales leadership, made explicit and measurable.
        </p>
      </Block>
    </article>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12 text-[17px] leading-relaxed text-stone-700">
      <h2 className="mb-4 font-serif text-2xl text-ink-900">{title}</h2>
      {children}
    </section>
  );
}
