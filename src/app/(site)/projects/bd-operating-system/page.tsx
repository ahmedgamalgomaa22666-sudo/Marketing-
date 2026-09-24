import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowRight } from "@/components/siteIcons";
import { ActionLink } from "@/components/site";

export const metadata: Metadata = {
  title: "B2B Business Development Operating System",
  description: "Case study: a reusable BD operating system for account qualification, stakeholder mapping, discovery, pipeline and follow-up discipline.",
};

const CORE = [
  ["Accounts & qualification", "Transparent 0–100 fit score across six weighted dimensions, each with plain-language reasons and risks."],
  ["Stakeholder mapping", "Buying groups by role — decision maker, champion, influencer, procurement — with coverage gaps flagged."],
  ["Discovery", "Account briefs with discovery questions and likely objections; every inferred need labelled as a hypothesis."],
  ["Opportunity mapper", "Business problem → need → potential solution → business outcome → discovery questions → next action."],
  ["Pipeline & deal coach", "Stage-aware coaching: what we know, what we don't, risks, questions and a suggested next step."],
  ["Follow-up discipline", "Overdue, today and upcoming actions; high-priority accounts with no next action surface on the dashboard."],
  ["Commercial analytics", "Response, engagement, qualification, meeting, proposal and win rates — shown as “—” when data doesn't exist."],
  ["Outreach preparation", "Short, human drafts for review. Nothing is ever sent automatically; no scraping, no mass messaging."],
];

export default function BdOsCaseStudy() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-700">Proof of work · Case study</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-ink-900 sm:text-5xl">B2B Business Development Operating System</h1>
      <p className="mt-5 text-lg leading-relaxed text-stone-600">
        A working product I designed and built to run business development systematically: decide which accounts matter, understand who decides, form and test hypotheses, and never lose a follow-up.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ActionLink href="/workspace/demo">
          Open the live demo <ArrowRight />
        </ActionLink>
        <ActionLink href="/workspace" variant="secondary">
          Go to the workspace
        </ActionLink>
      </div>

      <Block title="The problem">
        <p>
          B2B sales — in pharma, healthcare, training or professional services — is slow, multi-stakeholder and consultative. Without a system, business development drifts into ad-hoc outreach: no shared view of which accounts matter most, who the real buyers are, what problem the offer solves, or what the next action is. Generic CRMs record activity; they rarely help decide what to do next.
        </p>
      </Block>

      <Block title="What it does">
        <div className="grid gap-4 sm:grid-cols-2">
          {CORE.map(([t, d]) => (
            <div key={t} className="rounded-lg border border-stone-200 bg-white p-4">
              <h3 className="font-semibold text-ink-900">{t}</h3>
              <p className="mt-1 text-sm text-stone-600">{d}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Architecture: reusable core + company profiles">
        <p>
          The core workflow — accounts, contacts, qualification, stakeholders, discovery, opportunities, pipeline, activities, follow-ups, next best action and analytics — is industry-neutral. A <em>workspace profile</em> configures it for one company: markets, ideal customer profile, buyer roles, qualification weights, needs catalogue, terminology and optional industry modules.
        </p>
        <p className="mt-3">
          <strong className="text-ink-900">First use case — a corporate-training business in the UAE and Saudi Arabia.</strong> Its profile turns the generic Opportunity Mapper into a <em>Training Opportunity Mapper</em> (business problem → learning / capability gap → programme → expected business outcome), with fictional, clearly labelled demo data. A second, generic B2B profile starts empty and proves the core runs without any industry-specific code.
        </p>
      </Block>

      <Block title="Design principles">
        <ul className="list-disc space-y-2 pl-5">
          <li>Transparent over clever: every score and recommendation shows its reasons.</li>
          <li>Hypotheses, not facts: inferred needs are labelled and phrased to be validated.</li>
          <li>Human in the loop: recommendations require validation; outreach is drafted, never sent.</li>
          <li>Honest metrics: no rate is shown without underlying records; no invented revenue.</li>
          <li>Privacy by design: no scraping, no credential handling, contacts editable and deletable.</li>
          <li>Zero running cost: works fully without paid APIs; AI assistance is optional.</li>
        </ul>
      </Block>

      <Block title="What it demonstrates">
        <p>
          Account targeting and qualification, stakeholder management, consultative discovery, pipeline management, follow-up discipline and commercial analytics — the same fundamentals I have applied in pharmaceutical sales leadership — translated into a working tool.
        </p>
      </Block>

      <Block title="Built with">
        <p className="text-sm">Next.js, TypeScript and Tailwind CSS · pure, unit-tested business logic · local-first storage with a Supabase schema ready · optional Claude integration behind a provider interface.</p>
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
