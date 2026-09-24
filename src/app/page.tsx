"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { ActivityList } from "@/components/ActivityList";
import { BarRow, Badge, ButtonLink, Card, PageHeader, PriorityBadge, ScorePill, StageBadge, Stat } from "@/components/ui";
import { commercialMetrics, countryDistribution, dueToday, formatRate, funnelConversions, hasNextAction, isOpen, overdue, pipelineKpis, stageDistribution } from "@/lib/analytics";
import { formatDate, todayISO } from "@/lib/dates";
import { recommendNextAction } from "@/lib/intelligence/nextAction";
import { useData } from "@/lib/store/DataProvider";

export default function DashboardPage() {
  const { db, scoreFor } = useData();
  const today = todayISO();

  const data = useMemo(() => {
    const scored = db.accounts.map((a) => ({ account: a, score: scoreFor(a.id)?.total ?? 0 }));
    const open = scored.filter((s) => isOpen(s.account) && s.account.stage !== "Nurture");
    return {
      kpis: pipelineKpis(db.accounts),
      conversions: funnelConversions(db.accounts),
      metrics: commercialMetrics(db.accounts, db.activities, today),
      stages: stageDistribution(db.accounts),
      countries: countryDistribution(db.accounts),
      overdue: overdue(db.activities, today),
      today: dueToday(db.activities, today),
      noNextAction: open.filter((s) => s.account.priority === "High" && !hasNextAction(s.account, db.activities, today)).sort((a, b) => b.score - a.score),
      top: [...open].sort((a, b) => b.score - a.score).slice(0, 6),
      recent: db.activities.filter((a) => a.status === "done").sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6),
    };
  }, [db, scoreFor, today]);

  if (db.accounts.length === 0) {
    return (
      <>
        <PageHeader title="GCC Corporate Pipeline" subtitle="UAE & Saudi Arabia" />
        <Card>
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-slate-700">No target accounts yet</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">Add your first target account to start building the pipeline, or restore the demo dataset from Settings.</p>
            <div className="mt-4 flex justify-center gap-2">
              <ButtonLink href="/accounts?new=1" variant="primary">Add account</ButtonLink>
              <ButtonLink href="/settings">Settings</ButtonLink>
            </div>
          </div>
        </Card>
      </>
    );
  }

  const { kpis, metrics } = data;
  const maxStage = Math.max(...data.stages.map((s) => s.count));
  const maxCountry = Math.max(...data.countries.map((c) => c.total));

  return (
    <>
      <PageHeader
        title="GCC Corporate Pipeline"
        subtitle={`UAE & Saudi Arabia · ${formatDate(today)}`}
        actions={
          <>
            <ButtonLink href="/activities">Follow-ups</ButtonLink>
            <ButtonLink href="/accounts" variant="primary">Target accounts</ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
        <Stat label="Target accounts" value={kpis.total} href="/accounts" />
        <Stat label="Contacted" value={kpis.contacted} sub="reached stage" />
        <Stat label="Engaged" value={kpis.engaged} sub="reached stage" />
        <Stat label="Qualified" value={kpis.qualified} sub="reached stage" />
        <Stat label="Meetings" value={kpis.meetings} sub="reached stage" />
        <Stat label="Proposals" value={kpis.proposals} sub="reached stage" />
        <Stat label="Won" value={kpis.won} href="/accounts?stage=Won" />
        <Stat label="Lost" value={kpis.lost} href="/accounts?stage=Lost" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card title="Today's priorities" action={<Badge tone={data.overdue.length ? "amber" : "slate"}>{data.overdue.length} overdue</Badge>} className="lg:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700">Overdue follow-ups</h3>
          <ActivityList activities={data.overdue} empty="No overdue follow-ups — good discipline." />
          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Due today</h3>
          <ActivityList activities={data.today} empty="Nothing scheduled for today." />
        </Card>

        <Card title="High-priority accounts with no next action">
          {data.noNextAction.length === 0 ? (
            <p className="text-sm text-slate-500">Every high-priority account has a planned next action.</p>
          ) : (
            <ul className="space-y-3">
              {data.noNextAction.map(({ account, score }) => {
                const next = recommendNextAction(account, db.contacts.filter((c) => c.accountId === account.id), db.activities, today);
                return (
                  <li key={account.id}>
                    <Link href={`/accounts/${account.id}`} className="group block">
                      <div className="flex items-center gap-2">
                        <ScorePill score={score} />
                        <span className="text-sm font-medium text-slate-800 group-hover:text-brand-700">{account.name}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Suggested: {next.action}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Funnel conversion">
          <ul className="space-y-2.5">
            {data.conversions.map((c) => (
              <li key={c.from} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-600">
                  {c.from} <ArrowRight size={12} className="inline text-slate-400" /> {c.to}
                </span>
                <span className="text-right">
                  <span className="font-semibold tabular-nums text-slate-900">{formatRate(c.rate)}</span>
                  <span className="ml-2 text-xs tabular-nums text-slate-400">
                    {c.toCount}/{c.fromCount}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">Based on the furthest stage each account has reached. “—” means no data yet.</p>
        </Card>

        <Card title="Pipeline by stage">
          {data.stages.map((s) => (
            <BarRow key={s.stage} label={s.stage} value={s.count} max={maxStage} href={`/accounts?stage=${encodeURIComponent(s.stage)}`} />
          ))}
        </Card>

        <Card title="Pipeline by market">
          <div className="space-y-4">
            {data.countries.map((c) => (
              <div key={c.country}>
                <BarRow label={c.country} value={c.total} max={maxCountry} href={`/accounts?country=${encodeURIComponent(c.country)}`} />
                <p className="pl-[8.25rem] text-xs text-slate-500">
                  {c.active} active · {c.won} won
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-sm">
            <Metric label="Response rate" value={formatRate(metrics.responseRate)} />
            <Metric label="Engagement rate" value={formatRate(metrics.engagementRate)} />
            <Metric label="Qualification rate" value={formatRate(metrics.qualificationRate)} />
            <Metric label="Meeting conversion" value={formatRate(metrics.meetingConversion)} />
            <Metric label="Proposal conversion" value={formatRate(metrics.proposalConversion)} />
            <Metric label="Win rate" value={formatRate(metrics.winRate)} />
            <Metric label="Activities (30 days)" value={String(metrics.activitiesCompleted30d)} />
            <Metric label="Overdue actions" value={String(metrics.overdueActions)} />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Highest-priority target accounts" action={<Link href="/accounts" className="text-xs font-medium text-brand-700 hover:underline">All accounts</Link>} className="lg:col-span-2">
          <div className="-mx-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="px-4 pb-2 font-medium">Fit</th>
                  <th className="pb-2 font-medium">Account</th>
                  <th className="pb-2 font-medium">Stage</th>
                  <th className="pb-2 font-medium">Priority</th>
                  <th className="px-4 pb-2 font-medium">Next follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.top.map(({ account, score }) => (
                  <tr key={account.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2">
                      <ScorePill score={score} />
                    </td>
                    <td className="py-2">
                      <Link href={`/accounts/${account.id}`} className="font-medium text-slate-800 hover:text-brand-700">
                        {account.name}
                      </Link>
                      <div className="text-xs text-slate-500">
                        {account.industry} · {account.city}, {account.country}
                      </div>
                    </td>
                    <td className="py-2">
                      <StageBadge stage={account.stage} />
                    </td>
                    <td className="py-2">
                      <PriorityBadge priority={account.priority} />
                    </td>
                    <td className="px-4 py-2 text-slate-600">{formatDate(account.nextFollowUpAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Recent activity">
          <ActivityList activities={data.recent} empty="No activity logged yet." />
        </Card>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="font-semibold tabular-nums text-slate-900">{value}</span>
    </div>
  );
}
