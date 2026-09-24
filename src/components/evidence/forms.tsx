"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CAPABILITIES, CATEGORIES, CONFIDENTIALITY, ROLE_TYPES, STANDARD_METRICS, STATUSES, TIER_HELP, TIERS } from "@/lib/evidence/config";
import { canApprove } from "@/lib/evidence/logic";
import { useData } from "@/lib/store/DataProvider";
import type { CareerContext, EvidenceEntry, RoleType } from "@/lib/types";
import { Button, Field, Input, Modal, Select, Textarea } from "../ui";

const DATE_RE = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const YEAR_RE = /^\d{4}$/;

function Footer({ onClose, formId }: { onClose: () => void; formId: string }) {
  return (
    <>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="primary" type="submit" form={formId}>
        Save
      </Button>
    </>
  );
}

/* ---------------------------------------------------------------- Evidence entry */

export function EvidenceForm({ entry, onClose }: { entry?: EvidenceEntry; onClose: () => void }) {
  const { db, upsert } = useData();
  const contexts = db.careerContexts;
  const first = contexts.find((c) => !c.archived) ?? contexts[0];
  const [f, setF] = useState({
    contextId: entry?.contextId ?? first?.id ?? "",
    role: entry?.role ?? "",
    date: entry?.date ?? "",
    market: entry?.market ?? first?.markets[0] ?? "",
    industry: entry?.industry ?? first?.industry ?? "",
    tier: entry?.tier ?? "Activity",
    category: entry?.category ?? CATEGORIES[0],
    metricKey: entry?.metricKey ?? "",
    metric: entry?.metric ?? "",
    value: entry?.value?.toString() ?? "",
    result: entry?.result ?? "",
    context: entry?.context ?? "",
    contribution: entry?.contribution ?? "",
    capabilities: entry?.capabilities ?? ([] as string[]),
    status: entry?.status ?? "Self-recorded",
    verificationSource: entry?.verificationSource ?? "",
    confidentiality: entry?.confidentiality ?? "Private",
    publicVersion: entry?.publicVersion ?? "",
    approvedForPublic: entry?.approvedForPublic ?? false,
    star: entry?.star ?? { situation: "", action: "", result: "", lesson: "" },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));
  const ctx = contexts.find((c) => c.id === f.contextId);

  const chooseContext = (id: string) => {
    const c = contexts.find((x) => x.id === id);
    // Never carry values over from another context — unknown stays empty.
    setF((p) => ({ ...p, contextId: id, role: "", market: c?.markets[0] ?? "", industry: c?.industry ?? "" }));
  };

  const chooseMetric = (key: string) => {
    const m = STANDARD_METRICS.find((x) => x.key === key);
    setF((p) => ({ ...p, metricKey: key, metric: m ? m.label : p.metric, tier: m ? m.tier : p.tier }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!f.contextId) errs.contextId = "Choose a career context";
    if (!f.result.trim()) errs.result = "Describe the result in your own words";
    if (f.date && !DATE_RE.test(f.date)) errs.date = "Use YYYY, YYYY-MM or YYYY-MM-DD";
    if (f.value !== "" && Number.isNaN(Number(f.value))) errs.value = "Enter a number or leave empty";
    if (f.status === "Verified" && !f.verificationSource.trim()) errs.verificationSource = "Verified requires a verification source";
    if (f.approvedForPublic && !canApprove(f)) errs.publicVersion = "Write a public-safe version before approving";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    upsert("evidence", {
      ...f,
      id: entry?.id,
      date: f.date || null,
      metricKey: f.metricKey || null,
      value: f.value === "" ? null : Number(f.value),
      approvedForPublic: f.approvedForPublic && canApprove(f),
    });
    onClose();
  };

  return (
    <Modal open title={entry ? "Edit evidence" : "Record evidence"} onClose={onClose} footer={<Footer onClose={onClose} formId="evidence-form" />}>
      <form id="evidence-form" onSubmit={submit} className="grid gap-3 sm:grid-cols-2" noValidate>
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900 sm:col-span-2">
          Private by default. Do not store confidential customer names, prices or contract values — record the fact in your own words and use the public-safe version for anything you may share. Nothing here is published automatically.
        </p>
        <Field label="Career context *" error={errors.contextId}>
          <Select value={f.contextId} onChange={(e) => chooseContext(e.target.value)} options={contexts.map((c) => ({ value: c.id, label: c.name }))} />
        </Field>
        <Field label="Role at the time">
          <Select value={f.role} onChange={(e) => set("role", e.target.value)} options={[{ value: "", label: "— Not recorded —" }, ...(ctx?.roles ?? []).map((r) => ({ value: r.title, label: `${r.title} (${r.type})` }))]} />
        </Field>
        <Field label="Date" hint="YYYY, YYYY-MM or YYYY-MM-DD" error={errors.date}>
          <Input value={f.date} onChange={(e) => set("date", e.target.value)} placeholder="e.g. 2026-05" />
        </Field>
        <Field label="Market">
          <Input list="ev-markets" value={f.market} onChange={(e) => set("market", e.target.value)} />
          <datalist id="ev-markets">{(ctx?.markets ?? []).map((m) => <option key={m} value={m} />)}</datalist>
        </Field>
        <Field label="Industry">
          <Input value={f.industry} onChange={(e) => set("industry", e.target.value)} />
        </Field>
        <Field label="Category">
          <Select value={f.category} onChange={(e) => set("category", e.target.value)} options={CATEGORIES} />
        </Field>
        <Field label="Standard BD metric" hint="Enables funnel ratios">
          <Select value={f.metricKey} onChange={(e) => chooseMetric(e.target.value)} options={[{ value: "", label: "— Custom metric —" }, ...STANDARD_METRICS.map((m) => ({ value: m.key, label: m.label }))]} />
        </Field>
        <Field label="Tier" hint={TIER_HELP[f.tier]}>
          <Select value={f.tier} onChange={(e) => set("tier", e.target.value as EvidenceEntry["tier"])} options={TIERS} />
        </Field>
        <Field label="Metric">
          <Input value={f.metric} onChange={(e) => set("metric", e.target.value)} placeholder="e.g. Qualified opportunities" />
        </Field>
        <Field label="Value (number, optional)" error={errors.value}>
          <Input inputMode="decimal" value={f.value} onChange={(e) => set("value", e.target.value)} />
        </Field>
        <Field label="Result *" error={errors.result} className="sm:col-span-2">
          <Textarea value={f.result} onChange={(e) => set("result", e.target.value)} placeholder="What happened, as a fact — e.g. 5 qualified opportunities from 50 target accounts" />
        </Field>
        <Field label="Short context" className="sm:col-span-2">
          <Textarea rows={2} value={f.context} onChange={(e) => set("context", e.target.value)} />
        </Field>
        <Field label="My contribution" className="sm:col-span-2">
          <Textarea rows={2} value={f.contribution} onChange={(e) => set("contribution", e.target.value)} placeholder="What you personally did" />
        </Field>
        <fieldset className="sm:col-span-2">
          <legend className="mb-1 text-xs font-medium text-slate-600">Capabilities this evidence supports</legend>
          <div className="grid gap-1 sm:grid-cols-2">
            {CAPABILITIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" className="accent-brand-700" checked={f.capabilities.includes(c)} onChange={(e) => set("capabilities", e.target.checked ? [...f.capabilities, c] : f.capabilities.filter((x) => x !== c))} />
                {c}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Evidence status" hint="Only choose Verified when you can point to proof">
          <Select value={f.status} onChange={(e) => set("status", e.target.value as EvidenceEntry["status"])} options={STATUSES} />
        </Field>
        <Field label="Verification source" hint="e.g. award letter, sales report, manager confirmation" error={errors.verificationSource}>
          <Input value={f.verificationSource} onChange={(e) => set("verificationSource", e.target.value)} />
        </Field>
        <Field label="Confidentiality">
          <Select value={f.confidentiality} onChange={(e) => set("confidentiality", e.target.value as EvidenceEntry["confidentiality"])} options={[...CONFIDENTIALITY]} />
        </Field>
        <div />
        <Field label="Public-safe version" hint="Anonymised wording you could use externally — no client names or confidential figures" error={errors.publicVersion} className="sm:col-span-2">
          <Textarea rows={2} value={f.publicVersion} onChange={(e) => setF((p) => ({ ...p, publicVersion: e.target.value, approvedForPublic: e.target.value.trim() ? p.approvedForPublic : false }))} />
        </Field>
        <label className="flex items-start gap-2 text-sm text-slate-700 sm:col-span-2">
          <input type="checkbox" className="mt-0.5 accent-brand-700" disabled={!canApprove(f)} checked={f.approvedForPublic} onChange={(e) => set("approvedForPublic", e.target.checked)} />
          <span>
            Approved for public use{!canApprove(f) && <span className="text-slate-400"> — write a public-safe version first</span>}
            <span className="block text-xs text-slate-500">Approval never publishes anything; it only marks the public-safe version as available for you to use manually.</span>
          </span>
        </label>
        <details className="rounded-md border border-slate-200 p-3 sm:col-span-2">
          <summary className="cursor-pointer text-sm font-medium text-slate-700">Interview story (private) — Situation · Action · Result · Lesson</summary>
          <div className="mt-3 grid gap-3">
            {(["situation", "action", "result", "lesson"] as const).map((k) => (
              <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
                <Textarea rows={2} value={f.star[k]} onChange={(e) => set("star", { ...f.star, [k]: e.target.value })} />
              </Field>
            ))}
          </div>
        </details>
      </form>
    </Modal>
  );
}

/* ---------------------------------------------------------------- Career context */

export function ContextForm({ context, onClose }: { context?: CareerContext; onClose: () => void }) {
  const { upsert } = useData();
  const [f, setF] = useState({
    name: context?.name ?? "",
    publicLabel: context?.publicLabel ?? "",
    industry: context?.industry ?? "",
    markets: context?.markets.join(", ") ?? "",
    startYear: context?.startYear ?? "",
    endYear: context?.endYear ?? "",
    archived: context?.archived ?? false,
    roles: context?.roles ?? [{ title: "", type: "Business development" as RoleType, start: "", end: null as string | null }],
  });
  const [error, setError] = useState("");
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));
  const setRole = (i: number, patch: Partial<CareerContext["roles"][number]>) => set("roles", f.roles.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return setError("Name is required");
    if (!YEAR_RE.test(f.startYear)) return setError("Start year must be YYYY");
    if (f.endYear && !YEAR_RE.test(f.endYear)) return setError("End year must be YYYY or empty (ongoing)");
    upsert("careerContexts", {
      id: context?.id,
      name: f.name.trim(),
      publicLabel: f.publicLabel.trim(),
      industry: f.industry.trim(),
      markets: f.markets.split(",").map((m) => m.trim()).filter(Boolean),
      startYear: f.startYear,
      endYear: f.endYear || null,
      archived: f.archived,
      roles: f.roles.filter((r) => r.title.trim()).map((r) => ({ ...r, title: r.title.trim(), end: r.end || null })),
    });
    onClose();
  };

  return (
    <Modal open title={context ? `Edit ${context.name}` : "Add career context"} onClose={onClose} footer={<Footer onClose={onClose} formId="context-form" />}>
      <form id="context-form" onSubmit={submit} className="grid gap-3 sm:grid-cols-2" noValidate>
        {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">{error}</p>}
        <Field label="Employer / engagement *">
          <Input value={f.name} onChange={(e) => set("name", e.target.value)} autoFocus />
        </Field>
        <Field label="Neutral label" hint="For external use, e.g. “Pharmaceutical company, Egypt”">
          <Input value={f.publicLabel} onChange={(e) => set("publicLabel", e.target.value)} />
        </Field>
        <Field label="Industry">
          <Input value={f.industry} onChange={(e) => set("industry", e.target.value)} />
        </Field>
        <Field label="Markets (comma-separated)">
          <Input value={f.markets} onChange={(e) => set("markets", e.target.value)} />
        </Field>
        <Field label="Start year *">
          <Input value={f.startYear} onChange={(e) => set("startYear", e.target.value)} placeholder="YYYY" />
        </Field>
        <Field label="End year" hint="Empty = ongoing">
          <Input value={f.endYear} onChange={(e) => set("endYear", e.target.value)} placeholder="YYYY" />
        </Field>
        <fieldset className="sm:col-span-2">
          <legend className="mb-1 text-xs font-medium text-slate-600">Roles in this context</legend>
          <div className="space-y-2">
            {f.roles.map((r, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-[2fr_1.4fr_0.8fr_0.8fr_auto]">
                <Input aria-label="Role title" value={r.title} onChange={(e) => setRole(i, { title: e.target.value })} placeholder="Role title" />
                <Select aria-label="Role type" value={r.type} onChange={(e) => setRole(i, { type: e.target.value as RoleType })} options={ROLE_TYPES} />
                <Input aria-label="Start" value={r.start} onChange={(e) => setRole(i, { start: e.target.value })} placeholder="From" />
                <Input aria-label="End" value={r.end ?? ""} onChange={(e) => setRole(i, { end: e.target.value || null })} placeholder="To" />
                <button type="button" onClick={() => set("roles", f.roles.filter((_, j) => j !== i))} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove role">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <Button className="mt-2" onClick={() => set("roles", [...f.roles, { title: "", type: "Business development", start: "", end: null }])}>
            <Plus size={14} /> Add role
          </Button>
        </fieldset>
        <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
          <input type="checkbox" className="accent-brand-700" checked={f.archived} onChange={(e) => set("archived", e.target.checked)} />
          Archived (past employer — kept for career analytics)
        </label>
      </form>
    </Modal>
  );
}
