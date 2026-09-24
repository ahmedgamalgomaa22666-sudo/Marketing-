"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ArrowLeft, Compass, ExternalLink, MessageSquareText, Pencil, Plus, Trash2 } from "lucide-react";
import { ActivityList } from "@/components/ActivityList";
import { BriefView } from "@/components/BriefView";
import { AccountForm, ActivityForm, OpportunityForm } from "@/components/forms";
import { ScoreCard } from "@/components/ScoreCard";
import { StakeholderMap } from "@/components/StakeholderMap";
import { Badge, Button, ButtonLink, Card, EmptyState, PriorityBadge, ScorePill, Select, StageBadge, Tabs } from "@/components/ui";
import { ACCOUNT_STAGES, SIGNALS, SIZE_BANDS } from "@/lib/config";
import { formatDate, relativeDay } from "@/lib/dates";
import { buildAccountBrief } from "@/lib/intelligence/brief";
import { useData } from "@/lib/store/DataProvider";
import type { AccountStage } from "@/lib/types";

type Tab = "overview" | "stakeholders" | "brief" | "opportunities" | "activity";
const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview & score" },
  { key: "stakeholders", label: "Stakeholder map" },
  { key: "brief", label: "Intelligence brief" },
  { key: "opportunities", label: "Opportunities" },
  { key: "activity", label: "Activity" },
];

function AccountView() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const { db, scoreFor, setAccountStage, remove } = useData();
  const initialTab = (TABS.find((t) => t.key === params.get("tab"))?.key ?? "overview") as Tab;
  const [tab, setTab] = useState<Tab>(initialTab);
  const [modal, setModal] = useState<"edit" | "opp" | "log" | "plan" | null>(null);

  const account = db.accounts.find((a) => a.id === id);
  const score = account ? scoreFor(account.id) : null;
  const contacts = useMemo(() => db.contacts.filter((c) => c.accountId === id), [db.contacts, id]);
  const activities = useMemo(() => db.activities.filter((a) => a.accountId === id).sort((a, b) => b.date.localeCompare(a.date)), [db.activities, id]);
  const opps = db.opportunities.filter((o) => o.accountId === id);
  const brief = useMemo(
    () => (account && score ? buildAccountBrief(account, contacts, activities, db.programmes, score) : null),
    [account, score, contacts, activities, db.programmes],
  );

  if (!account || !score || !brief) {
    return <EmptyState title="Account not found" description="It may have been deleted." action={<ButtonLink href="/accounts">Back to accounts</ButtonLink>} />;
  }

  const owner = db.users.find((u) => u.id === account.ownerId);
  const planned = activities.filter((a) => a.status === "planned").sort((a, b) => a.date.localeCompare(b.date));
  const done = activities.filter((a) => a.status === "done");

  const changeTab = (t: Tab) => {
    setTab(t);
    router.replace(`/accounts/${id}?tab=${t}`, { scroll: false });
  };

  return (
    <>
      <Link href="/accounts" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft size={14} /> Accounts
      </Link>

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{account.name}</h1>
            <ScorePill score={score.total} />
            <StageBadge stage={account.stage} />
            <PriorityBadge priority={account.priority} />
            {account.isDemo && <Badge tone="amber">Demo account</Badge>}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {account.industry} · {account.city}, {account.country} · {SIZE_BANDS.find((b) => b.id === account.sizeBand)?.label} · Owner: {owner?.name ?? "—"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-slate-500">
            Stage
            <Select className="w-36" value={account.stage} onChange={(e) => setAccountStage(account.id, e.target.value as AccountStage)} options={ACCOUNT_STAGES} />
          </label>
          <ButtonLink href={`/mapper?account=${account.id}`}>
            <Compass size={15} /> Map opportunity
          </ButtonLink>
          <ButtonLink href={`/outreach?account=${account.id}`}>
            <MessageSquareText size={15} /> Outreach
          </ButtonLink>
          <Button onClick={() => setModal("edit")} aria-label="Edit account">
            <Pencil size={15} />
          </Button>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={changeTab} />

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ScoreCard score={score} />
          </div>
          <div className="space-y-4 lg:col-span-2">
            <Card title="Recommended next action">
              <p className="text-sm font-medium text-slate-900">{brief.nextAction.action}</p>
              <p className="mt-1 text-sm text-slate-500">{brief.nextAction.reason}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="primary" onClick={() => setModal("plan")}>
                  <Plus size={15} /> Plan next action
                </Button>
                <Button onClick={() => setModal("log")}>Log activity</Button>
              </div>
              {planned[0] && (
                <p className="mt-3 text-xs text-slate-500">
                  Scheduled: {planned[0].summary} · {relativeDay(planned[0].date)}
                </p>
              )}
            </Card>
            <Card title="Account details">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                <Detail label="Training potential" value={account.trainingPotential} />
                <Detail label="Last contacted" value={formatDate(account.lastContactedAt)} />
                <Detail label="Next follow-up" value={formatDate(account.nextFollowUpAt)} />
                <Detail label="Created" value={formatDate(account.createdAt)} />
                <div className="col-span-2">
                  <dt className="text-xs text-slate-500">Website</dt>
                  <dd>
                    {account.website ? (
                      <a href={account.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                        {account.website.replace(/^https?:\/\//, "")} <ExternalLink size={12} />
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-slate-500">Signals</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">{account.signals.length ? account.signals.map((s) => <Badge key={s} tone="brand">{SIGNALS[s]}</Badge>) : "—"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-slate-500">Tags</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">{account.tags.length ? account.tags.map((t) => <Badge key={t}>{t}</Badge>) : "—"}</dd>
                </div>
                {account.notes && (
                  <div className="col-span-2">
                    <dt className="text-xs text-slate-500">Notes</dt>
                    <dd className="text-slate-700">{account.notes}</dd>
                  </div>
                )}
              </dl>
            </Card>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm(`Delete ${account.name} and all its contacts, opportunities and activities?`)) {
                  remove("accounts", account.id);
                  router.push("/accounts");
                }
              }}
            >
              <Trash2 size={15} /> Delete account
            </Button>
          </div>
        </div>
      )}

      {tab === "stakeholders" && <StakeholderMap accountId={account.id} />}

      {tab === "brief" && <BriefView brief={brief} accountId={account.id} />}

      {tab === "opportunities" && (
        <Card title="Opportunities" action={<Button variant="primary" onClick={() => setModal("opp")}><Plus size={15} /> New opportunity</Button>}>
          {opps.length === 0 ? (
            <EmptyState title="No opportunities yet" description="Run the Training Opportunity Mapper to shape a validated opportunity, or create one directly." action={<ButtonLink href={`/mapper?account=${account.id}`} variant="primary">Run mapper</ButtonLink>} />
          ) : (
            <ul className="divide-y divide-slate-100">
              {opps.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <Link href={`/opportunities/${o.id}`} className="font-medium text-slate-900 hover:text-brand-700">{o.name}</Link>
                    <p className="text-xs text-slate-500">Next: {o.nextStep || "—"} {o.nextStepDate && `· ${formatDate(o.nextStepDate)}`}</p>
                  </div>
                  <StageBadge stage={o.stage} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {tab === "activity" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Planned next actions" action={<Button onClick={() => setModal("plan")}><Plus size={15} /> Plan</Button>}>
            <ActivityList activities={planned} showAccount={false} editable empty="No next action planned." />
          </Card>
          <Card title="History & notes" action={<Button onClick={() => setModal("log")}><Plus size={15} /> Log</Button>}>
            <ActivityList activities={done} showAccount={false} editable empty="No activity logged yet." />
          </Card>
        </div>
      )}

      {modal === "edit" && <AccountForm account={account} onClose={() => setModal(null)} />}
      {modal === "opp" && <OpportunityForm accountId={account.id} onClose={() => setModal(null)} onSaved={(oid) => router.push(`/opportunities/${oid}`)} />}
      {modal === "log" && <ActivityForm accountId={account.id} onClose={() => setModal(null)} />}
      {modal === "plan" && <ActivityForm accountId={account.id} defaultStatus="planned" onClose={() => setModal(null)} />}
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense>
      <AccountView />
    </Suspense>
  );
}
