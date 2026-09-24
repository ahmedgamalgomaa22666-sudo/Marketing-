"use client";

import { useState, type FormEvent } from "react";
import { ACCOUNT_STAGES, ACTIVITY_TYPES, CURRENCIES, OPPORTUNITY_STAGES, SIZE_BANDS, STAKEHOLDER_ROLES } from "@/lib/config";
import { addDays, todayISO } from "@/lib/dates";
import { useData } from "@/lib/store/DataProvider";
import type { Account, Activity, Contact, Opportunity, SignalKey } from "@/lib/types";
import { Button, Field, Input, Modal, Select, Textarea } from "./ui";

const LEVELS = ["High", "Medium", "Low"] as const;
const SENIORITY = ["C-level", "VP / Director", "Head / Manager", "Specialist"] as const;

function isUrl(v: string) {
  return v === "" || /^https?:\/\/\S+\.\S+/.test(v);
}

function FormFooter({ onClose, formId, label = "Save" }: { onClose: () => void; formId: string; label?: string }) {
  return (
    <>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="primary" type="submit" form={formId}>
        {label}
      </Button>
    </>
  );
}

/* ---------------------------------------------------------------- Account */

export function AccountForm({ account, onClose, onSaved }: { account?: Account; onClose: () => void; onSaved?: (id: string) => void }) {
  const { db, profile, upsert } = useData();
  const withCurrent = (list: string[], v?: string) => (v && !list.includes(v) ? [v, ...list] : list);
  const needLabel = profile.qualification.labels.needStrength?.label ?? "Need strength";
  const score = account ? db.accountScores.find((s) => s.accountId === account.id) : undefined;
  const [f, setF] = useState({
    name: account?.name ?? "",
    country: account?.country ?? profile.markets[0] ?? "",
    city: account?.city ?? "",
    industry: account?.industry ?? profile.industries[0] ?? "",
    sizeBand: account?.sizeBand ?? SIZE_BANDS[1].id,
    website: account?.website ?? "",
    ownerId: account?.ownerId ?? db.users[0]?.id ?? "",
    stage: account?.stage ?? "Target",
    priority: account?.priority ?? "Medium",
    potential: account?.potential ?? "Medium",
    signals: account?.signals ?? ([] as SignalKey[]),
    tags: account?.tags.join(", ") ?? "",
    notes: account?.notes ?? "",
    nextFollowUpAt: account?.nextFollowUpAt ?? "",
    needStrength: score?.ratings.needStrength ?? 3,
    strategicRelevance: score?.ratings.strategicRelevance ?? 3,
    evidence: score?.evidence ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!f.name.trim()) errs.name = "Company name is required";
    if (db.accounts.some((a) => a.name.trim().toLowerCase() === f.name.trim().toLowerCase() && a.id !== account?.id)) errs.name = "An account with this name already exists";
    if (!f.city.trim()) errs.city = "City is required";
    if (!isUrl(f.website)) errs.website = "Use a full URL, e.g. https://company.com";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const saved = upsert("accounts", {
      id: account?.id,
      name: f.name.trim(),
      country: f.country,
      city: f.city.trim(),
      industry: f.industry,
      sizeBand: f.sizeBand,
      website: f.website.trim(),
      ownerId: f.ownerId,
      stage: f.stage,
      highestStage: account ? account.highestStage : f.stage,
      priority: f.priority,
      potential: f.potential,
      signals: f.signals,
      tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
      notes: f.notes,
      lastContactedAt: account?.lastContactedAt ?? null,
      nextFollowUpAt: f.nextFollowUpAt || null,
      isDemo: account?.isDemo ?? false,
    });
    upsert("accountScores", {
      id: score?.id,
      accountId: saved.id,
      ratings: { needStrength: Number(f.needStrength), strategicRelevance: Number(f.strategicRelevance) },
      evidence: f.evidence,
    });
    onSaved?.(saved.id);
    onClose();
  };

  return (
    <Modal open title={account ? `Edit ${account.name}` : "New target account"} onClose={onClose} footer={<FormFooter onClose={onClose} formId="account-form" />}>
      <form id="account-form" onSubmit={submit} className="grid gap-3 sm:grid-cols-2" noValidate>
        <Field label="Company name *" error={errors.name} className="sm:col-span-2">
          <Input value={f.name} onChange={(e) => set("name", e.target.value)} autoFocus />
        </Field>
        <Field label="Country">
          <Select value={f.country} onChange={(e) => set("country", e.target.value as Account["country"])} options={withCurrent(profile.markets, account?.country)} />
        </Field>
        <Field label="City *" error={errors.city}>
          <Input value={f.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label="Industry">
          <Select value={f.industry} onChange={(e) => set("industry", e.target.value as Account["industry"])} options={withCurrent(profile.industries, account?.industry)} />
        </Field>
        <Field label="Company size">
          <Select value={f.sizeBand} onChange={(e) => set("sizeBand", e.target.value as Account["sizeBand"])} options={SIZE_BANDS.map((b) => ({ value: b.id, label: b.label }))} />
        </Field>
        <Field label="Website" error={errors.website}>
          <Input value={f.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" />
        </Field>
        <Field label="Account owner">
          <Select value={f.ownerId} onChange={(e) => set("ownerId", e.target.value)} options={db.users.map((u) => ({ value: u.id, label: u.name }))} />
        </Field>
        <Field label="Pipeline stage">
          <Select value={f.stage} onChange={(e) => set("stage", e.target.value as Account["stage"])} options={ACCOUNT_STAGES} />
        </Field>
        <Field label="Strategic priority">
          <Select value={f.priority} onChange={(e) => set("priority", e.target.value as Account["priority"])} options={LEVELS} />
        </Field>
        <Field label={profile.terminology.potential}>
          <Select value={f.potential} onChange={(e) => set("potential", e.target.value as Account["potential"])} options={LEVELS} />
        </Field>
        <Field label="Next follow-up">
          <Input type="date" value={f.nextFollowUpAt} onChange={(e) => set("nextFollowUpAt", e.target.value)} />
        </Field>
        <fieldset className="sm:col-span-2">
          <legend className="mb-1 text-xs font-medium text-slate-600">Observed business signals (only record what you have evidence for)</legend>
          <div className="grid gap-1 sm:grid-cols-2">
            {(Object.keys(profile.signals) as SignalKey[]).map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="accent-brand-700"
                  checked={f.signals.includes(s)}
                  onChange={(e) => set("signals", e.target.checked ? [...f.signals, s] : f.signals.filter((x) => x !== s))}
                />
                {profile.signals[s].label}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label={`${needLabel} rating (0–5)`} hint="BD judgement based on evidence">
          <Input type="number" min={0} max={5} value={f.needStrength} onChange={(e) => set("needStrength", Math.max(0, Math.min(5, Number(e.target.value))))} />
        </Field>
        <Field label="Strategic relevance rating (0–5)" hint="Flagship, reference or expansion value">
          <Input type="number" min={0} max={5} value={f.strategicRelevance} onChange={(e) => set("strategicRelevance", Math.max(0, Math.min(5, Number(e.target.value))))} />
        </Field>
        <Field label="Evidence for ratings" className="sm:col-span-2">
          <Input value={f.evidence} onChange={(e) => set("evidence", e.target.value)} placeholder="e.g. Head of L&D confirmed 40 new managers this year" />
        </Field>
        <Field label="Tags (comma-separated)" className="sm:col-span-2">
          <Input value={f.tags} onChange={(e) => set("tags", e.target.value)} />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <Textarea value={f.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}

/* ---------------------------------------------------------------- Contact */

export function ContactForm({ accountId, contact, onClose }: { accountId: string; contact?: Contact; onClose: () => void }) {
  const { upsert } = useData();
  const [f, setF] = useState({
    name: contact?.name ?? "",
    title: contact?.title ?? "",
    department: contact?.department ?? "",
    seniority: contact?.seniority ?? "Head / Manager",
    role: contact?.role ?? "Unknown",
    linkedinUrl: contact?.linkedinUrl ?? "",
    email: contact?.email ?? "",
    phone: contact?.phone ?? "",
    notes: contact?.notes ?? "",
    nextAction: contact?.nextAction ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!f.name.trim()) errs.name = "Name is required";
    if (!f.title.trim()) errs.title = "Job title is required";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) errs.email = "Enter a valid email";
    if (f.linkedinUrl && !/^https:\/\/([a-z]+\.)?linkedin\.com\//i.test(f.linkedinUrl)) errs.linkedinUrl = "Use a linkedin.com profile URL";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    upsert("contacts", { ...f, id: contact?.id, accountId, name: f.name.trim(), title: f.title.trim(), lastInteractionAt: contact?.lastInteractionAt ?? null });
    onClose();
  };

  return (
    <Modal open title={contact ? `Edit ${contact.name}` : "Add stakeholder"} onClose={onClose} footer={<FormFooter onClose={onClose} formId="contact-form" />}>
      <form id="contact-form" onSubmit={submit} className="grid gap-3 sm:grid-cols-2" noValidate>
        <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:col-span-2">
          Only store contact details obtained legitimately (e.g. business cards, introductions, public professional profiles). Contacts can be edited or deleted at any time.
        </p>
        <Field label="Name *" error={errors.name}>
          <Input value={f.name} onChange={(e) => set("name", e.target.value)} autoFocus />
        </Field>
        <Field label="Job title *" error={errors.title}>
          <Input value={f.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Department">
          <Input value={f.department} onChange={(e) => set("department", e.target.value)} placeholder="e.g. Learning & Development" />
        </Field>
        <Field label="Seniority">
          <Select value={f.seniority} onChange={(e) => set("seniority", e.target.value as Contact["seniority"])} options={SENIORITY} />
        </Field>
        <Field label="Stakeholder role">
          <Select value={f.role} onChange={(e) => set("role", e.target.value as Contact["role"])} options={STAKEHOLDER_ROLES} />
        </Field>
        <Field label="LinkedIn URL" error={errors.linkedinUrl}>
          <Input value={f.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} placeholder="https://www.linkedin.com/in/…" />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Phone (if legitimately available)">
          <Input value={f.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Next action" className="sm:col-span-2">
          <Input value={f.nextAction} onChange={(e) => set("nextAction", e.target.value)} />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <Textarea value={f.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}

/* ---------------------------------------------------------------- Opportunity */

export function OpportunityForm({ accountId, opportunity, prefill, onClose, onSaved }: {
  accountId?: string;
  opportunity?: Opportunity;
  prefill?: Partial<Opportunity>;
  onClose: () => void;
  onSaved?: (id: string) => void;
}) {
  const { db, upsert } = useData();
  const init = { ...prefill, ...opportunity };
  const [acc, setAcc] = useState(opportunity?.accountId ?? accountId ?? db.accounts[0]?.id ?? "");
  const contacts = db.contacts.filter((c) => c.accountId === acc);
  const account = db.accounts.find((a) => a.id === acc);
  const [f, setF] = useState({
    name: init.name ?? "",
    stage: init.stage ?? "Qualified",
    programmeIds: init.programmeIds ?? [],
    primaryContactId: init.primaryContactId ?? "",
    contactIds: init.contactIds ?? [],
    estimatedValue: init.estimatedValue?.toString() ?? "",
    currency: init.currency ?? (account?.country === "Saudi Arabia" ? "SAR" : "AED"),
    probability: init.probability?.toString() ?? "",
    targetCloseDate: init.targetCloseDate ?? "",
    businessProblem: init.businessProblem ?? "",
    nextStep: init.nextStep ?? "",
    nextStepDate: init.nextStepDate ?? addDays(todayISO(), 3),
    notes: init.notes ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!acc) errs.account = "Choose an account";
    if (!f.name.trim()) errs.name = "Opportunity name is required";
    if (f.estimatedValue && !(Number(f.estimatedValue) >= 0)) errs.estimatedValue = "Enter a positive number or leave empty";
    if (f.probability && !(Number(f.probability) >= 0 && Number(f.probability) <= 100)) errs.probability = "0–100";
    if (!f.nextStep.trim() && !["Won", "Lost"].includes(f.stage)) errs.nextStep = "Every open opportunity needs a next step";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const saved = upsert("opportunities", {
      id: opportunity?.id,
      accountId: acc,
      name: f.name.trim(),
      stage: f.stage,
      programmeIds: f.programmeIds,
      primaryContactId: f.primaryContactId || null,
      contactIds: [...new Set([...f.contactIds, ...(f.primaryContactId ? [f.primaryContactId] : [])])],
      estimatedValue: f.estimatedValue === "" ? null : Number(f.estimatedValue),
      currency: f.currency,
      probability: f.probability === "" ? null : Number(f.probability),
      targetCloseDate: f.targetCloseDate || null,
      businessProblem: f.businessProblem,
      nextStep: f.nextStep,
      nextStepDate: f.nextStepDate || null,
      notes: f.notes,
    });
    // Keep follow-up discipline: the next step becomes a planned activity on the dashboard.
    const existingPlan = db.activities.find((a) => a.opportunityId === saved.id && a.status === "planned" && a.summary === f.nextStep);
    if (f.nextStep.trim() && f.nextStepDate && !existingPlan && !["Won", "Lost"].includes(f.stage)) {
      upsert("activities", {
        accountId: acc,
        opportunityId: saved.id,
        contactId: f.primaryContactId || null,
        type: "Follow-up",
        status: "planned",
        date: f.nextStepDate,
        summary: f.nextStep,
        outcome: null,
      });
    }
    onSaved?.(saved.id);
    onClose();
  };

  return (
    <Modal open title={opportunity ? `Edit ${opportunity.name}` : "New opportunity"} onClose={onClose} footer={<FormFooter onClose={onClose} formId="opp-form" />}>
      <form id="opp-form" onSubmit={submit} className="grid gap-3 sm:grid-cols-2" noValidate>
        <Field label="Account *" error={errors.account}>
          <Select value={acc} onChange={(e) => setAcc(e.target.value)} disabled={!!opportunity || !!accountId} options={db.accounts.map((a) => ({ value: a.id, label: a.name }))} />
        </Field>
        <Field label="Opportunity name *" error={errors.name}>
          <Input value={f.name} onChange={(e) => set("name", e.target.value)} autoFocus />
        </Field>
        <Field label="Stage">
          <Select value={f.stage} onChange={(e) => set("stage", e.target.value as Opportunity["stage"])} options={OPPORTUNITY_STAGES} />
        </Field>
        <Field label="Primary stakeholder">
          <Select value={f.primaryContactId} onChange={(e) => set("primaryContactId", e.target.value)} options={[{ value: "", label: "— Not set —" }, ...contacts.map((c) => ({ value: c.id, label: `${c.name} (${c.role})` }))]} />
        </Field>
        {contacts.length > 0 && (
          <fieldset className="sm:col-span-2">
            <legend className="mb-1 text-xs font-medium text-slate-600">Other stakeholders</legend>
            <div className="grid gap-1 sm:grid-cols-2">
              {contacts.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" className="accent-brand-700" checked={f.contactIds.includes(c.id)} onChange={(e) => set("contactIds", e.target.checked ? [...f.contactIds, c.id] : f.contactIds.filter((x) => x !== c.id))} />
                  {c.name} <span className="text-slate-400">· {c.role}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <fieldset className="sm:col-span-2">
          <legend className="mb-1 text-xs font-medium text-slate-600">Potential solution(s)</legend>
          <div className="grid gap-1 sm:grid-cols-2">
            {db.programmes.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" className="accent-brand-700" checked={f.programmeIds.includes(p.id)} onChange={(e) => set("programmeIds", e.target.checked ? [...f.programmeIds, p.id] : f.programmeIds.filter((x) => x !== p.id))} />
                {p.name}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Business problem" className="sm:col-span-2">
          <Textarea value={f.businessProblem} onChange={(e) => set("businessProblem", e.target.value)} placeholder="In the client's words, once confirmed" />
        </Field>
        <Field label="Next step *" error={errors.nextStep}>
          <Input value={f.nextStep} onChange={(e) => set("nextStep", e.target.value)} />
        </Field>
        <Field label="Next step date">
          <Input type="date" value={f.nextStepDate} onChange={(e) => set("nextStepDate", e.target.value)} />
        </Field>
        <Field label="Estimated value (optional)" hint="Leave empty until a real figure exists" error={errors.estimatedValue}>
          <div className="flex gap-2">
            <Input inputMode="numeric" value={f.estimatedValue} onChange={(e) => set("estimatedValue", e.target.value)} />
            <Select className="w-24" value={f.currency} onChange={(e) => set("currency", e.target.value as Opportunity["currency"])} options={CURRENCIES} />
          </div>
        </Field>
        <Field label="Probability % (optional)" error={errors.probability}>
          <Input inputMode="numeric" value={f.probability} onChange={(e) => set("probability", e.target.value)} />
        </Field>
        <Field label="Target close date (optional)">
          <Input type="date" value={f.targetCloseDate} onChange={(e) => set("targetCloseDate", e.target.value)} />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <Textarea value={f.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}

/* ---------------------------------------------------------------- Activity */

export function ActivityForm({ accountId, opportunityId, activity, defaultStatus = "done", onClose }: {
  accountId?: string;
  opportunityId?: string | null;
  activity?: Activity;
  defaultStatus?: Activity["status"];
  onClose: () => void;
}) {
  const { db, upsert } = useData();
  const [acc, setAcc] = useState(activity?.accountId ?? accountId ?? "");
  const [f, setF] = useState({
    type: activity?.type ?? (defaultStatus === "planned" ? "Follow-up" : "Call"),
    status: activity?.status ?? defaultStatus,
    date: activity?.date ?? (defaultStatus === "planned" ? addDays(todayISO(), 2) : todayISO()),
    summary: activity?.summary ?? "",
    outcome: activity?.outcome ?? "",
    contactId: activity?.contactId ?? "",
    opportunityId: activity?.opportunityId ?? opportunityId ?? "",
    followUpDate: "",
    followUpSummary: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));
  const contacts = db.contacts.filter((c) => c.accountId === acc);
  const opps = db.opportunities.filter((o) => o.accountId === acc);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!acc) errs.account = "Choose an account";
    if (!f.summary.trim()) errs.summary = "Describe what happened or what is planned";
    if (!f.date) errs.date = "Date is required";
    if (f.followUpDate && !f.followUpSummary.trim()) errs.followUpSummary = "Describe the next action";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    upsert("activities", {
      id: activity?.id,
      accountId: acc,
      opportunityId: f.opportunityId || null,
      contactId: f.contactId || null,
      type: f.type,
      status: f.status,
      date: f.date,
      summary: f.summary.trim(),
      outcome: f.status === "done" && f.outcome ? (f.outcome as Activity["outcome"]) : null,
    });
    if (f.followUpDate) {
      upsert("activities", {
        accountId: acc,
        opportunityId: f.opportunityId || null,
        contactId: f.contactId || null,
        type: "Follow-up",
        status: "planned",
        date: f.followUpDate,
        summary: f.followUpSummary.trim(),
        outcome: null,
      });
    }
    onClose();
  };

  return (
    <Modal open title={activity ? "Edit activity" : f.status === "planned" ? "Plan next action" : "Log activity"} onClose={onClose} footer={<FormFooter onClose={onClose} formId="activity-form" />}>
      <form id="activity-form" onSubmit={submit} className="grid gap-3 sm:grid-cols-2" noValidate>
        <Field label="Account *" error={errors.account}>
          <Select value={acc} onChange={(e) => setAcc(e.target.value)} disabled={!!accountId || !!activity} options={[{ value: "", label: "— Choose —" }, ...db.accounts.map((a) => ({ value: a.id, label: a.name }))]} />
        </Field>
        <Field label="Status">
          <Select value={f.status} onChange={(e) => set("status", e.target.value as Activity["status"])} options={[{ value: "done", label: "Completed" }, { value: "planned", label: "Planned (next action)" }]} />
        </Field>
        <Field label="Type">
          <Select value={f.type} onChange={(e) => set("type", e.target.value as Activity["type"])} options={ACTIVITY_TYPES} />
        </Field>
        <Field label={f.status === "planned" ? "Due date *" : "Date *"} error={errors.date}>
          <Input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} />
        </Field>
        <Field label="Stakeholder">
          <Select value={f.contactId} onChange={(e) => set("contactId", e.target.value)} options={[{ value: "", label: "— None —" }, ...contacts.map((c) => ({ value: c.id, label: c.name }))]} />
        </Field>
        <Field label="Opportunity">
          <Select value={f.opportunityId} onChange={(e) => set("opportunityId", e.target.value)} options={[{ value: "", label: "— None —" }, ...opps.map((o) => ({ value: o.id, label: o.name }))]} />
        </Field>
        <Field label="Summary *" error={errors.summary} className="sm:col-span-2">
          <Textarea value={f.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>
        {f.status === "done" && f.type !== "Note" && (
          <Field label="Outcome" hint="Used for response-rate analytics">
            <Select value={f.outcome} onChange={(e) => set("outcome", e.target.value as Activity["outcome"] & string)} options={[{ value: "", label: "— Not recorded —" }, { value: "positive", label: "Positive response" }, { value: "neutral", label: "Neutral response" }, { value: "no-response", label: "No response" }]} />
          </Field>
        )}
        {f.status === "done" && !activity && (
          <div className="grid gap-3 rounded-md bg-slate-50 p-3 sm:col-span-2 sm:grid-cols-2">
            <Field label="Schedule next action (optional)">
              <Input type="date" value={f.followUpDate} onChange={(e) => set("followUpDate", e.target.value)} />
            </Field>
            <Field label="Next action" error={errors.followUpSummary}>
              <Input value={f.followUpSummary} onChange={(e) => set("followUpSummary", e.target.value)} placeholder="e.g. Send recap and proposed agenda" />
            </Field>
          </div>
        )}
      </form>
    </Modal>
  );
}
