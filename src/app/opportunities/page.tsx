"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { OpportunityForm } from "@/components/forms";
import { Button, ButtonLink, EmptyState, PageHeader, StageBadge, cx } from "@/components/ui";
import { OPPORTUNITY_STAGES } from "@/lib/config";
import { formatDate, todayISO } from "@/lib/dates";
import { useData } from "@/lib/store/DataProvider";

export default function OpportunitiesPage() {
  const { db } = useData();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const today = todayISO();
  const withValue = db.opportunities.filter((o) => o.estimatedValue !== null && !["Won", "Lost"].includes(o.stage));

  return (
    <>
      <PageHeader
        title="Opportunities"
        subtitle={
          withValue.length
            ? `${db.opportunities.length} opportunities · ${withValue.length} with an estimated value`
            : `${db.opportunities.length} opportunities · values not yet estimated`
        }
        actions={
          <Button variant="primary" onClick={() => setCreating(true)} disabled={db.accounts.length === 0}>
            <Plus size={16} /> New opportunity
          </Button>
        }
      />

      {db.opportunities.length === 0 ? (
        <EmptyState title="No opportunities yet" description="Qualify an account, then use the Training Opportunity Mapper to shape a validated opportunity." action={<ButtonLink href="/mapper" variant="primary">Open mapper</ButtonLink>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {OPPORTUNITY_STAGES.map((stage) => {
            const opps = db.opportunities.filter((o) => o.stage === stage);
            return (
              <section key={stage} className="rounded-lg border border-slate-200 bg-slate-50/60">
                <header className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
                  <StageBadge stage={stage} />
                  <span className="text-xs tabular-nums text-slate-500">{opps.length}</span>
                </header>
                <ul className="space-y-2 p-2">
                  {opps.length === 0 && <li className="px-1 py-2 text-xs text-slate-400">None</li>}
                  {opps.map((o) => {
                    const account = db.accounts.find((a) => a.id === o.accountId);
                    const late = o.nextStepDate && o.nextStepDate < today && !["Won", "Lost"].includes(o.stage);
                    return (
                      <li key={o.id}>
                        <Link href={`/opportunities/${o.id}`} className="block rounded-md border border-slate-200 bg-white px-3 py-2.5 hover:border-brand-200">
                          <div className="text-sm font-medium text-slate-900">{o.name}</div>
                          <div className="text-xs text-slate-500">{account?.name}</div>
                          {o.nextStep && (
                            <div className={cx("mt-1.5 text-xs", late ? "font-medium text-amber-700" : "text-slate-600")}>
                              Next: {o.nextStep} · {formatDate(o.nextStepDate)}
                            </div>
                          )}
                          <div className="mt-1 text-xs text-slate-400">
                            {o.estimatedValue !== null ? `${o.estimatedValue.toLocaleString()} ${o.currency}` : "Value not estimated"}
                            {o.probability !== null && ` · ${o.probability}%`}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {creating && <OpportunityForm onClose={() => setCreating(false)} onSaved={(id) => router.push(`/opportunities/${id}`)} />}
    </>
  );
}
