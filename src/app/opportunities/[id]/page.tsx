"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, ArrowLeft, HelpCircle, MessageSquareText, Pencil, Plus, Trash2 } from "lucide-react";
import { ActivityList } from "@/components/ActivityList";
import { ActivityForm, OpportunityForm } from "@/components/forms";
import { Badge, Button, ButtonLink, Card, EmptyState, ScorePill, Select, StageBadge } from "@/components/ui";
import { OPPORTUNITY_STAGES } from "@/lib/config";
import { formatDate, relativeDay } from "@/lib/dates";
import { coachDeal } from "@/lib/intelligence/dealCoach";
import { useData } from "@/lib/store/DataProvider";
import type { OpportunityStage } from "@/lib/types";

export default function OpportunityPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { db, scoreFor, upsert, remove } = useData();
  const [modal, setModal] = useState<"edit" | "log" | "plan" | null>(null);

  const opp = db.opportunities.find((o) => o.id === id);
  const account = opp ? db.accounts.find((a) => a.id === opp.accountId) : undefined;
  const score = account ? scoreFor(account.id) : null;
  const contacts = useMemo(() => db.contacts.filter((c) => c.accountId === opp?.accountId), [db.contacts, opp?.accountId]);
  const coach = useMemo(() => (opp && account && score ? coachDeal(opp, account, contacts, db.activities, score) : null), [opp, account, score, contacts, db.activities]);

  if (!opp || !account || !score || !coach) {
    return <EmptyState title="Opportunity not found" action={<ButtonLink href="/opportunities">Back to opportunities</ButtonLink>} />;
  }

  const primary = contacts.find((c) => c.id === opp.primaryContactId);
  const others = contacts.filter((c) => opp.contactIds.includes(c.id) && c.id !== opp.primaryContactId);
  const programmes = db.programmes.filter((p) => opp.programmeIds.includes(p.id));
  const history = db.activities.filter((a) => a.opportunityId === opp.id).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <Link href="/opportunities" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft size={14} /> Opportunities
      </Link>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{opp.name}</h1>
            <StageBadge stage={opp.stage} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            <Link href={`/accounts/${account.id}`} className="font-medium text-slate-700 hover:text-brand-700">{account.name}</Link> · {account.city}, {account.country}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-slate-500">
            Stage
            <Select className="w-36" value={opp.stage} onChange={(e) => upsert("opportunities", { ...opp, stage: e.target.value as OpportunityStage })} options={OPPORTUNITY_STAGES} />
          </label>
          <ButtonLink href={`/outreach?account=${account.id}${primary ? `&contact=${primary.id}` : ""}&type=meeting-follow-up`}>
            <MessageSquareText size={15} /> Draft follow-up
          </ButtonLink>
          <Button onClick={() => setModal("edit")}>
            <Pencil size={15} /> Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <Card title="Deal Coach" action={<span className="text-xs text-slate-500">Supports your judgement — does not replace it</span>}>
            <div className="grid gap-4 sm:grid-cols-3">
              <Fact label="Pipeline stage" value={<StageBadge stage={opp.stage} />} />
              <Fact label="Account Fit Score" value={<ScorePill score={score.total} />} />
              <Fact label="Last interaction" value={coach.lastInteraction ? `${coach.lastInteraction.type} · ${relativeDay(coach.lastInteraction.date)}` : "None recorded"} />
            </div>
            <div className="mt-4 rounded-md border border-brand-200 bg-brand-50 px-3 py-2.5 text-sm text-brand-900">
              <strong className="font-semibold">Recommended next action. </strong>
              {coach.nextAction}
              {coach.nextScheduled && <span className="block text-xs text-brand-800/80">Scheduled: {coach.nextScheduled.summary} · {relativeDay(coach.nextScheduled.date)}</span>}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <List title="What we know" items={coach.known} empty="Nothing confirmed yet." />
              <List title="What we don't know yet" items={coach.unknown} icon={<HelpCircle size={14} className="mt-0.5 shrink-0 text-slate-400" />} />
            </div>
            <List className="mt-4" title="Likely risks" items={coach.risks} empty="No material risks flagged." icon={<AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />} />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">5 discovery questions</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">{coach.discoveryQuestions.map((q) => <li key={q}>{q}</li>)}</ol>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">3 follow-up questions</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">{coach.followUpQuestions.map((q) => <li key={q}>{q}</li>)}</ol>
              </div>
            </div>

            <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">3 possible objections</h3>
            <ul className="mt-2 space-y-2.5 text-sm">
              {coach.objections.map((o) => (
                <li key={o.objection} className="rounded-md bg-slate-50 px-3 py-2">
                  <p className="font-medium text-slate-800">“{o.objection}”</p>
                  <p className="mt-0.5 text-slate-600">Suggested approach: {o.approach}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Activity history" action={<div className="flex gap-2"><Button onClick={() => setModal("plan")}><Plus size={15} /> Plan</Button><Button onClick={() => setModal("log")}><Plus size={15} /> Log</Button></div>}>
            <ActivityList activities={history} showAccount={false} editable empty="No activities linked to this opportunity yet." />
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Card title="Opportunity details">
            <dl className="space-y-3 text-sm">
              <Row label="Business problem" value={opp.businessProblem || "Not yet confirmed"} />
              <Row label="Next step" value={opp.nextStep ? `${opp.nextStep} · ${formatDate(opp.nextStepDate)}` : "—"} />
              <Row label="Potential solution" value={programmes.length ? programmes.map((p) => p.name).join(", ") : "—"} />
              <Row label="Primary stakeholder" value={primary ? `${primary.name} (${primary.role})` : "Not set"} />
              <Row label="Other stakeholders" value={others.length ? others.map((c) => `${c.name} (${c.role})`).join(", ") : "—"} />
              <Row label="Estimated value" value={opp.estimatedValue !== null ? `${opp.estimatedValue.toLocaleString()} ${opp.currency}` : "Not estimated"} />
              <Row label="Probability" value={opp.probability !== null ? `${opp.probability}%` : "—"} />
              <Row label="Target close date" value={formatDate(opp.targetCloseDate)} />
              {opp.notes && <Row label="Notes" value={opp.notes} />}
            </dl>
            {programmes.some((p) => p.isDemo) && <Badge tone="amber" className="mt-3">Includes DEMO programme placeholders</Badge>}
          </Card>
          <Button
            variant="danger"
            onClick={() => {
              if (confirm(`Delete opportunity "${opp.name}"?`)) {
                remove("opportunities", opp.id);
                router.push("/opportunities");
              }
            }}
          >
            <Trash2 size={15} /> Delete opportunity
          </Button>
        </div>
      </div>

      {modal === "edit" && <OpportunityForm opportunity={opp} onClose={() => setModal(null)} />}
      {modal === "log" && <ActivityForm accountId={account.id} opportunityId={opp.id} onClose={() => setModal(null)} />}
      {modal === "plan" && <ActivityForm accountId={account.id} opportunityId={opp.id} defaultStatus="planned" onClose={() => setModal(null)} />}
    </>
  );
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-sm text-slate-800">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}

function List({ title, items, empty, icon, className }: { title: string; items: string[]; empty?: string; icon?: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {items.length === 0 && <li className="text-sm text-slate-500">{empty}</li>}
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-700">
            {icon ?? <span className="mt-2 size-1 shrink-0 rounded-full bg-slate-400" />}
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
