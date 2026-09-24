"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { PROFILES } from "@/lib/profile";
import { useData } from "@/lib/store/DataProvider";

export default function DemoPage() {
  const { profile, resetDemo, switchProfile } = useData();
  const [reset, setReset] = useState(false);
  const guide = profile.demoGuide;
  const withGuide = Object.values(PROFILES).filter((p) => p.demoGuide);

  if (!guide) {
    return (
      <>
        <PageHeader title="Guided demo" />
        <EmptyState
          title={`No guided demo for ${profile.company.name}`}
          description="Guided demos belong to a workspace profile. Switch to a demo workspace to present it."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {withGuide.map((p) => (
                <Button key={p.id} variant="primary" onClick={() => switchProfile(p.id)}>
                  Open {p.company.name} demo
                </Button>
              ))}
            </div>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="5-minute executive demo"
        subtitle={`A guided path through the BD Operating System, configured for ${profile.company.name}. All data is fictional demo data.`}
        actions={
          <Button onClick={async () => { await resetDemo(); setReset(true); }}>
            <RotateCcw size={15} /> {reset ? "Demo data reset" : "Reset demo data first"}
          </Button>
        }
      />
      <Card>
        <p className="text-sm text-slate-700">
          <strong>Story:</strong> {guide.story}
        </p>
      </Card>
      <ol className="mt-4 space-y-3">
        {guide.steps.map((s, i) => (
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
