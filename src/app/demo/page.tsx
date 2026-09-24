"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button, Card, PageHeader } from "@/components/ui";
import { HERO_ACCOUNT_ID } from "@/lib/demo/seed";
import { useData } from "@/lib/store/DataProvider";

const STEPS: { title: string; href: string; cta: string; say: string; show: string }[] = [
  { title: "Open the dashboard", href: "/", cta: "Dashboard", say: "This is how the BD team starts every day: pipeline, conversion and what needs doing today.", show: "KPI row, Today's priorities with overdue follow-ups." },
  { title: "See the GCC opportunity pipeline", href: "/", cta: "Dashboard", say: "18 target accounts across the UAE and Saudi Arabia, with honest conversion rates at every stage.", show: "Funnel conversion, Pipeline by stage, Pipeline by market." },
  { title: "Open a high-potential company", href: `/accounts/${HERO_ACCOUNT_ID}`, cta: "Meridian Gulf Healthcare", say: "Meridian Gulf Healthcare — a fictional hospital group expanding into KSA.", show: "Header: fit score, stage, priority." },
  { title: "Show why it scores highly", href: `/accounts/${HERO_ACCOUNT_ID}?tab=overview`, cta: "Fit score", say: "No black box. Six weighted dimensions, each with its reasons — and the risks we still need to close.", show: "Score breakdown, 'Why it scores', 'Risks & unknowns'. Mention weights are configurable in Settings." },
  { title: "Show the stakeholder map", href: `/accounts/${HERO_ACCOUNT_ID}?tab=stakeholders`, cta: "Stakeholders", say: "Corporate learning is a group decision. We map who decides, who champions and who is missing.", show: "Decision maker vs champion, coverage gap: procurement unknown." },
  { title: "Show the Account Intelligence Brief", href: `/accounts/${HERO_ACCOUNT_ID}?tab=brief`, cta: "Brief", say: "A one-page call-prep brief. Everything inferred is labelled as a hypothesis to validate — we never pretend a guess is a fact.", show: "Priorities and capability gaps as hypotheses, discovery questions, objections, next action." },
  { title: "Run the Training Opportunity Mapper", href: `/mapper?account=${HERO_ACCOUNT_ID}`, cta: "Mapper", say: "Now we translate the business problem into capability needs.", show: "Step 1 is pre-filled from the account's signals. Click Next to Step 2 — capability gaps." },
  { title: "Match the problem to a Bloom capability", href: `/mapper?account=${HERO_ACCOUNT_ID}`, cta: "Mapper", say: "The gaps are matched against Bloom's programme catalogue — here, clearly labelled DEMO placeholders until the real catalogue is added.", show: "Step 3 fit %, Step 4 business case. Tick the validation box." },
  { title: "Show outreach preparation", href: `/outreach?account=${HERO_ACCOUNT_ID}&contact=con-2`, cta: "Outreach", say: "A short, human draft with a clear business reason. The system never sends anything — a person reviews every word.", show: "Switch between LinkedIn / Email / Meeting follow-up; 'Before you send' checks." },
  { title: "Create the opportunity", href: `/mapper?account=${HERO_ACCOUNT_ID}`, cta: "Mapper → Create opportunity", say: "Once validated, the business case becomes a tracked opportunity with a dated next step.", show: "In Step 4 click 'Create opportunity' → Save. You land on the Deal Coach for the new deal." },
  { title: "Show the next action on the dashboard", href: "/", cta: "Dashboard", say: "The next step is now in the follow-up system — nothing falls through the cracks.", show: "Account stage moved to Qualified; the new next step appears under Follow-ups (upcoming) and in Recent activity once done." },
];

export default function DemoPage() {
  const { resetDemo } = useData();
  const [reset, setReset] = useState(false);

  return (
    <>
      <PageHeader
        title="5-minute executive demo"
        subtitle="A guided path through the product for Bloom leadership. All data is fictional demo data."
        actions={
          <Button onClick={async () => { await resetDemo(); setReset(true); }}>
            <RotateCcw size={15} /> {reset ? "Demo data reset" : "Reset demo data first"}
          </Button>
        }
      />
      <Card>
        <p className="text-sm text-slate-700">
          <strong>Story:</strong> “Our corporate BD should be systematic — prioritised accounts, mapped buyers, validated needs, disciplined follow-up. This is what that looks like.”
        </p>
      </Card>
      <ol className="mt-4 space-y-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-white">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-900">{s.title}</h2>
                <Link href={s.href} className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
                  {s.cta} <ArrowRight size={14} />
                </Link>
              </div>
              <p className="mt-1 text-sm text-slate-700">“{s.say}”</p>
              <p className="mt-1 text-xs text-slate-500">Show: {s.show}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
