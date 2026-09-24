"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { Download, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { formatRate } from "@/lib/analytics";
import { ROLE_TYPES, STANDARD_METRICS, STATUSES, TIERS } from "@/lib/evidence/config";
import {
  applyFilter,
  buildBackup,
  capabilityGaps,
  cvDraft,
  cvMissing,
  funnelRatios,
  funnelTotals,
  groupBy,
  hasStory,
  NO_FILTER,
  parseBackup,
  qualityIndicators,
  qualityRank,
  roleType,
  strength,
  yearOf,
  type EvidenceBackup,
  type EvidenceFilter,
  type Group,
  type Strength,
} from "@/lib/evidence/logic";
import { useData } from "@/lib/store/DataProvider";
import type { CareerContext, EvidenceEntry } from "@/lib/types";
import { Badge, BarRow, Button, Card, EmptyState, Modal, Select, Stat } from "../ui";
import { ContextForm, EvidenceForm } from "./forms";

const STRENGTH_TONE: Record<Strength, "brand" | "blue" | "slate"> = { Strong: "brand", Moderate: "blue", Weak: "slate" };

export function StrengthBadge({ e }: { e: EvidenceEntry }) {
  const s = strength(e);
  return <Badge tone={STRENGTH_TONE[s]}>{s} evidence</Badge>;
}

function Meta({ e, contexts }: { e: EvidenceEntry; contexts: CareerContext[] }) {
  const ctx = contexts.find((c) => c.id === e.contextId);
  return (
    <p className="mt-1 text-xs text-slate-500">
      {[ctx?.name, e.role || "Role not recorded", e.market, e.date ?? "Undated", e.status, e.confidentiality].filter(Boolean).join(" · ")}
      {e.approvedForPublic && " · Approved for public use"}
    </p>
  );
}

/* ---------------------------------------------------------------- Log */

export function LogView() {
  const { db, remove } = useData();
  const [editing, setEditing] = useState<EvidenceEntry | "new" | null>(null);
  const [editingCtx, setEditingCtx] = useState<CareerContext | "new" | null>(null);
  const [ctxFilter, setCtxFilter] = useState("");
  const [tier, setTier] = useState("");
  const [status, setStatus] = useState("");
  const contexts = db.careerContexts;
  const entries = db.evidence
    .filter((e) => (!ctxFilter || e.contextId === ctxFilter) && (!tier || e.tier === tier) && (!status || e.status === status))
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "") || qualityRank(b) - qualityRank(a));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card
        title={`Evidence log (${db.evidence.length})`}
        action={<Button variant="primary" onClick={() => setEditing("new")} disabled={contexts.length === 0}><Plus size={15} /> Record evidence</Button>}
        className="lg:col-span-2"
      >
        <div className="mb-3 grid gap-2 sm:grid-cols-3">
          <Select aria-label="Context" value={ctxFilter} onChange={(e) => setCtxFilter(e.target.value)} options={[{ value: "", label: "All contexts" }, ...contexts.map((c) => ({ value: c.id, label: c.name }))]} />
          <Select aria-label="Tier" value={tier} onChange={(e) => setTier(e.target.value)} options={[{ value: "", label: "All tiers" }, ...TIERS]} />
          <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={[{ value: "", label: "All statuses" }, ...STATUSES]} />
        </div>
        {entries.length === 0 ? (
          <EmptyState title="No evidence recorded" description="Record activities, outputs, outcomes and achievements as they happen — in your own words, without confidential details." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {entries.map((e) => (
              <li key={e.id} className="flex items-start gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge>{e.tier}</Badge>
                    <StrengthBadge e={e} />
                  </div>
                  <p className="mt-1 text-sm text-slate-800">{e.result}</p>
                  <Meta e={e} contexts={contexts} />
                </div>
                <button type="button" onClick={() => setEditing(e)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Edit evidence"><Pencil size={15} /></button>
                <button type="button" onClick={() => confirm("Delete this evidence entry?") && remove("evidence", e.id)} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete evidence"><Trash2 size={15} /></button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="space-y-4">
        <Card title="Career contexts" action={<Button onClick={() => setEditingCtx("new")}><Plus size={15} /> Add</Button>}>
          <ul className="space-y-3">
            {contexts.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {c.name} {c.archived && <Badge className="ml-1">Archived</Badge>}
                  </p>
                  <p className="text-xs text-slate-500">
                    {c.startYear}–{c.endYear ?? "present"} · {c.roles.map((r) => r.title).join(" → ") || "No roles"}
                  </p>
                </div>
                <button type="button" onClick={() => setEditingCtx(c)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Edit ${c.name}`}><Pencil size={14} /></button>
              </li>
            ))}
          </ul>
        </Card>
        <BackupCard />
      </div>

      {editing && <EvidenceForm entry={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}
      {editingCtx && <ContextForm context={editingCtx === "new" ? undefined : editingCtx} onClose={() => setEditingCtx(null)} />}
    </div>
  );
}

function BackupCard() {
  const { db, replaceCareerData } = useData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<EvidenceBackup | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const exportFile = () => {
    const blob = new Blob([JSON.stringify(buildBackup(db.careerContexts, db.evidence), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `career-evidence-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setDone("Backup downloaded.");
  };

  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setError("");
    setDone("");
    if (!file) return;
    const parsed = parseBackup(await file.text());
    if (parsed.ok) setPending(parsed.backup);
    else setError(parsed.error);
  };

  return (
    <Card title="Backup">
      <p className="text-sm text-slate-600">Your evidence lives only in this browser. Export a backup regularly and keep it somewhere safe.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={exportFile}><Download size={15} /> Export JSON</Button>
        <Button onClick={() => fileRef.current?.click()}><Upload size={15} /> Restore…</Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={pick} />
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      {done && <p className="mt-2 text-sm text-brand-700">{done}</p>}
      {pending && (
        <Modal
          open
          title="Restore Career Evidence?"
          onClose={() => setPending(null)}
          footer={
            <>
              <Button onClick={() => setPending(null)}>Cancel</Button>
              <Button
                variant="danger"
                onClick={() => {
                  replaceCareerData(pending.careerContexts, pending.evidence);
                  setPending(null);
                  setDone("Career Evidence restored.");
                }}
              >
                Replace my Career Evidence
              </Button>
            </>
          }
        >
          <p className="text-sm text-slate-700">
            The backup from {pending.exportedAt.slice(0, 10)} contains <strong>{pending.careerContexts.length} career contexts</strong> and <strong>{pending.evidence.length} evidence entries</strong>.
          </p>
          <p className="mt-2 text-sm text-slate-700">
            This will <strong>replace</strong> your current {db.careerContexts.length} contexts and {db.evidence.length} entries. Other workspace data is not affected. Export a backup first if you are unsure.
          </p>
        </Modal>
      )}
    </Card>
  );
}

/* ---------------------------------------------------------------- Analytics */

function GroupCard({ title, groups }: { title: string; groups: Group[] }) {
  const max = Math.max(1, ...groups.map((g) => g.count));
  return (
    <Card title={title}>
      {groups.length === 0 ? (
        <p className="text-sm text-slate-500">No evidence.</p>
      ) : (
        groups.map((g) => (
          <div key={g.key} className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <BarRow label={g.key} value={g.count} max={max} />
            </div>
            {g.strongest && <Badge tone={STRENGTH_TONE[g.strongest]} className="w-20 justify-center">{g.strongest}</Badge>}
          </div>
        ))
      )}
    </Card>
  );
}

export function AnalyticsView() {
  const { db } = useData();
  const contexts = db.careerContexts;
  const [f, setF] = useState<EvidenceFilter>(NO_FILTER);
  const entries = useMemo(() => applyFilter(db.evidence, contexts, f), [db.evidence, contexts, f]);
  const uniq = (xs: string[]) => [...new Set(xs.filter(Boolean))].sort();
  const totals = funnelTotals(entries);
  const q = qualityIndicators(entries);
  const gaps = capabilityGaps(entries);
  const set = (patch: Partial<EvidenceFilter>) => setF((p) => ({ ...p, ...patch }));

  return (
    <div className="space-y-4">
      <div className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-3 lg:grid-cols-5">
        <Select aria-label="Scope" value={f.scope} onChange={(e) => set({ scope: e.target.value })} options={[{ value: "all", label: "Entire career" }, { value: "current", label: "Current contexts" }, ...contexts.map((c) => ({ value: c.id, label: c.name }))]} />
        <Select aria-label="Role type" value={f.roleType} onChange={(e) => set({ roleType: e.target.value })} options={[{ value: "", label: "All role types" }, ...ROLE_TYPES, "Unspecified"]} />
        <Select aria-label="Year" value={f.year} onChange={(e) => set({ year: e.target.value })} options={[{ value: "", label: "All years" }, ...uniq(db.evidence.map(yearOf))]} />
        <Select aria-label="Market" value={f.market} onChange={(e) => set({ market: e.target.value })} options={[{ value: "", label: "All markets" }, ...uniq(db.evidence.map((e) => e.market))]} />
        <Select aria-label="Industry" value={f.industry} onChange={(e) => set({ industry: e.target.value })} options={[{ value: "", label: "All industries" }, ...uniq(db.evidence.map((e) => e.industry))]} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TIERS.map((t) => {
          const list = entries.filter((e) => e.tier === t);
          return <Stat key={t} label={t} value={list.length} sub={list.length ? `${list.filter((e) => strength(e) === "Strong").length} strong · ${list.filter((e) => strength(e) === "Moderate").length} moderate` : "No evidence"} />;
        })}
      </div>
      <p className="text-xs text-slate-500">Strength reflects tier, status and measurability — not the number of entries. There is no overall score.</p>

      <div className="grid gap-4 lg:grid-cols-3">
        <GroupCard title="By employer context" groups={groupBy(entries, (e) => contexts.find((c) => c.id === e.contextId)?.name ?? "Unknown")} />
        <GroupCard title="By role type" groups={groupBy(entries, (e) => roleType(e, contexts))} />
        <GroupCard title="By role" groups={groupBy(entries, (e) => e.role)} />
        <GroupCard title="By year" groups={groupBy(entries, yearOf)} />
        <GroupCard title="By market" groups={groupBy(entries, (e) => e.market)} />
        <GroupCard title="By industry" groups={groupBy(entries, (e) => e.industry)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GroupCard title="By capability" groups={groupBy(entries, (e) => (e.capabilities.length ? e.capabilities : ["No capability tagged"]))} />
        <Card title="BD funnel (recorded values only)">
          <ul className="space-y-1.5 text-sm">
            {STANDARD_METRICS.map((m) => (
              <li key={m.key} className="flex justify-between gap-3">
                <span className="text-slate-600">{m.label}</span>
                <span className="font-semibold tabular-nums text-slate-900">{m.key in totals ? totals[m.key].toLocaleString() : "—"}</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Conversion ratios</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {funnelRatios(totals).map((r) => (
              <li key={r.label} className="flex justify-between gap-3">
                <span className="text-slate-600">{r.label}</span>
                <span className="font-semibold tabular-nums text-slate-900">{formatRate(r.rate)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">“—” means the numerator or denominator has not been recorded.</p>
        </Card>
        <Card title="Evidence gaps">
          <ul className="space-y-1.5 text-sm text-slate-700">
            <li>{q.needsVerification} entries self-recorded or needing verification</li>
            <li>{q.achievementsUnverified} achievements without supporting evidence</li>
            <li>{q.withoutNumber} entries without a number</li>
            <li>{q.withoutDate} entries without a date</li>
            <li>{q.withoutContribution} entries without your contribution</li>
            <li>{q.approvedForPublic} entries approved for public use</li>
          </ul>
          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Capabilities with no or weak evidence</h3>
          <p className="mt-1 text-sm text-slate-600">{gaps.length ? gaps.map((g) => g.capability).join(" · ") : "None — every capability has at least moderate evidence."}</p>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- CV-ready */

export function CvReadyView() {
  const { db } = useData();
  const entries = [...db.evidence].sort((a, b) => qualityRank(b) - qualityRank(a));
  if (entries.length === 0) return <EmptyState title="No evidence yet" description="Record evidence first; strong entries will appear here as CV bullet candidates." />;
  return (
    <div className="space-y-3">
      <p className="rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600">
        Drafts are assembled only from your own fields — no numbers, scope, timeframes, clients or outcomes are added. Missing pieces are listed so you can measure them. Nothing here is published.
      </p>
      {entries.map((e) => {
        const missing = cvMissing(e);
        return (
          <Card key={e.id}>
            <div className="flex flex-wrap gap-1.5">
              <StrengthBadge e={e} />
              <Badge>{e.tier}</Badge>
              <Badge>{e.status}</Badge>
              {e.approvedForPublic ? <Badge tone="brand">Approved for public use</Badge> : <Badge tone="amber">Not approved</Badge>}
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Draft (private)</p>
            <p className="text-sm text-slate-900">{cvDraft(e, db.careerContexts)}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Public-safe version</p>
            <p className="text-sm text-slate-700">{e.publicVersion || <span className="text-slate-400">Not written</span>}</p>
            {missing.length > 0 && (
              <p className="mt-3 text-sm text-amber-800">
                <span className="font-medium">Missing: </span>
                {missing.join(" · ")}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- Interview stories */

export function StoriesView() {
  const { db } = useData();
  const stories = db.evidence.filter(hasStory).sort((a, b) => qualityRank(b) - qualityRank(a));
  const candidates = db.evidence.filter((e) => !hasStory(e) && strength(e) !== "Weak");
  return (
    <div className="space-y-4">
      <p className="rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600">Private interview preparation. Only what you wrote is shown; empty parts stay empty.</p>
      {stories.length === 0 ? (
        <EmptyState title="No interview stories yet" description="Open an evidence entry and fill in Situation, Action, Result and Lesson under “Interview story”." />
      ) : (
        stories.map((e) => (
          <Card key={e.id} title={e.result}>
            <div className="mb-2 flex flex-wrap gap-1.5">
              <StrengthBadge e={e} />
              <Badge>{e.status}</Badge>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {(["situation", "action", "result", "lesson"] as const).map((k) => (
                <div key={k}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{k}</dt>
                  <dd className="text-slate-800">{e.star[k] || <span className="text-slate-400">Not recorded</span>}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ))
      )}
      {candidates.length > 0 && (
        <Card title="Candidates for a story">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {candidates.map((e) => (
              <li key={e.id}>{e.result}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
