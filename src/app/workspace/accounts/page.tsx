"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { AccountForm } from "@/components/forms";
import { Badge, Button, EmptyState, Input, PageHeader, PriorityBadge, ScorePill, Select, StageBadge } from "@/components/ui";
import { ACCOUNT_STAGES } from "@/lib/config";
import { formatDate, relativeDay, todayISO } from "@/lib/dates";
import { useData } from "@/lib/store/DataProvider";

const SORTS = [
  { value: "score", label: "Fit score" },
  { value: "followup", label: "Next follow-up" },
  { value: "contacted", label: "Last contacted" },
  { value: "name", label: "Name" },
];

function AccountsView() {
  const params = useSearchParams();
  const router = useRouter();
  const { db, profile, scoreFor } = useData();
  const [q, setQ] = useState("");
  const [country, setCountry] = useState(params.get("country") ?? "");
  const [industry, setIndustry] = useState("");
  const [stage, setStage] = useState(params.get("stage") ?? "");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("score");
  const [creating, setCreating] = useState(params.get("new") === "1");
  const today = todayISO();

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = db.accounts
      .filter((a) => !country || a.country === country)
      .filter((a) => !industry || a.industry === industry)
      .filter((a) => !stage || a.stage === stage)
      .filter((a) => !priority || a.priority === priority)
      .filter((a) => !term || [a.name, a.city, a.industry, ...a.tags].some((s) => s.toLowerCase().includes(term)))
      .map((a) => ({ account: a, score: scoreFor(a.id)?.total ?? 0 }));
    const byDate = (x: string | null, y: string | null) => (x ?? "9999").localeCompare(y ?? "9999");
    return list.sort((a, b) => {
      if (sort === "name") return a.account.name.localeCompare(b.account.name);
      if (sort === "followup") return byDate(a.account.nextFollowUpAt, b.account.nextFollowUpAt);
      if (sort === "contacted") return byDate(b.account.lastContactedAt ?? "0000", a.account.lastContactedAt ?? "0000");
      return b.score - a.score;
    });
  }, [db.accounts, scoreFor, q, country, industry, stage, priority, sort]);

  const filtered = q || country || industry || stage || priority;
  const owner = (id: string) => db.users.find((u) => u.id === id)?.name.replace("Demo ", "") ?? "—";

  return (
    <>
      <PageHeader
        title="Target accounts"
        subtitle={`${db.accounts.length} corporate accounts across the UAE and Saudi Arabia`}
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus size={16} /> New account
          </Button>
        }
      />

      <div className="mb-4 grid gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-3 lg:grid-cols-6">
        <label className="relative sm:col-span-3 lg:col-span-2">
          <span className="sr-only">Search accounts</span>
          <Search size={16} className="pointer-events-none absolute left-2.5 top-2 text-slate-400" />
          <Input className="pl-8" placeholder="Search company, city, tag…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <Select aria-label="Country" value={country} onChange={(e) => setCountry(e.target.value)} options={[{ value: "", label: "All markets" }, ...profile.markets]} />
        <Select aria-label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} options={[{ value: "", label: "All industries" }, ...profile.industries]} />
        <Select aria-label="Stage" value={stage} onChange={(e) => setStage(e.target.value)} options={[{ value: "", label: "All stages" }, ...ACCOUNT_STAGES]} />
        <Select aria-label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)} options={[{ value: "", label: "All priorities" }, "High", "Medium", "Low"]} />
        <div className="flex items-center gap-2 sm:col-span-3 lg:col-span-6">
          <span className="text-xs text-slate-500">Sort by</span>
          <Select aria-label="Sort" className="w-auto" value={sort} onChange={(e) => setSort(e.target.value)} options={SORTS} />
          <span className="ml-auto text-xs text-slate-500">
            {rows.length} shown
            {filtered && (
              <button
                type="button"
                className="ml-2 font-medium text-brand-700 hover:underline"
                onClick={() => {
                  setQ("");
                  setCountry("");
                  setIndustry("");
                  setStage("");
                  setPriority("");
                  router.replace("/workspace/accounts");
                }}
              >
                Clear filters
              </button>
            )}
          </span>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={db.accounts.length ? "No accounts match these filters" : "No accounts yet"}
          description={db.accounts.length ? "Try clearing a filter." : "Add your first target account to start."}
          action={!db.accounts.length && <Button variant="primary" onClick={() => setCreating(true)}>Add account</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Fit</th>
                <th className="py-2.5 font-medium">Company</th>
                <th className="py-2.5 font-medium">Industry</th>
                <th className="py-2.5 font-medium">Stage</th>
                <th className="py-2.5 font-medium">Priority</th>
                <th className="hidden py-2.5 font-medium lg:table-cell">Owner</th>
                <th className="hidden py-2.5 font-medium md:table-cell">Last contacted</th>
                <th className="px-4 py-2.5 font-medium">Next follow-up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({ account: a, score }) => {
                const late = a.nextFollowUpAt && a.nextFollowUpAt < today && !["Won", "Lost"].includes(a.stage);
                return (
                  <tr key={a.id} className="cursor-pointer hover:bg-slate-50" onClick={() => router.push(`/workspace/accounts/${a.id}`)}>
                    <td className="px-4 py-2.5">
                      <ScorePill score={score} />
                    </td>
                    <td className="py-2.5">
                      <Link href={`/workspace/accounts/${a.id}`} className="font-medium text-slate-900 hover:text-brand-700" onClick={(e) => e.stopPropagation()}>
                        {a.name}
                      </Link>
                      <div className="text-xs text-slate-500">
                        {a.city}, {a.country}
                        {a.tags.slice(0, 2).map((t) => (
                          <Badge key={t} className="ml-1.5">{t}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 text-slate-600">{a.industry}</td>
                    <td className="py-2.5">
                      <StageBadge stage={a.stage} />
                    </td>
                    <td className="py-2.5">
                      <PriorityBadge priority={a.priority} />
                    </td>
                    <td className="hidden py-2.5 text-slate-600 lg:table-cell">{owner(a.ownerId)}</td>
                    <td className="hidden py-2.5 text-slate-600 md:table-cell">{a.lastContactedAt ? relativeDay(a.lastContactedAt, today) : "Never"}</td>
                    <td className={`px-4 py-2.5 ${late ? "font-medium text-amber-700" : "text-slate-600"}`}>{formatDate(a.nextFollowUpAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {creating && <AccountForm onClose={() => setCreating(false)} onSaved={(id) => router.push(`/workspace/accounts/${id}`)} />}
    </>
  );
}

export default function AccountsPage() {
  return (
    <Suspense>
      <AccountsView />
    </Suspense>
  );
}
