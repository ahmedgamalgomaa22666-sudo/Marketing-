"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge, Button, Card, EmptyState, Field, Input, Modal, PageHeader, Textarea } from "@/components/ui";
import { useData } from "@/lib/store/DataProvider";
import type { CapabilityKey, LeadershipLevel, Programme } from "@/lib/types";

export default function OfferingsPage() {
  const { db, profile, remove } = useData();
  const t = profile.terminology;
  const [editing, setEditing] = useState<Programme | "new" | null>(null);
  const inUse = (id: string) => db.opportunities.some((o) => o.programmeIds.includes(id));

  return (
    <>
      <PageHeader
        title={`${t.offering} catalogue`}
        subtitle={`Editable. The ${profile.modules.opportunityMapper.title} and account briefs match needs against these ${t.offerings.toLowerCase()}.`}
        actions={<Button variant="primary" onClick={() => setEditing("new")}><Plus size={15} /> Add {t.offering.toLowerCase()}</Button>}
      />
      <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        {t.offerings} marked <strong>DEMO / PLACEHOLDER</strong> are not official {profile.company.name} {t.offerings.toLowerCase()}. Replace them with the real catalogue before using the system with clients.
      </p>
      {db.programmes.length === 0 ? (
        <EmptyState title={`No ${t.offerings.toLowerCase()}`} description={`Add ${t.offerings.toLowerCase()} and tag the needs each one addresses.`} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {db.programmes.map((p) => (
            <Card
              key={p.id}
              title={p.name}
              action={
                <div className="flex gap-1">
                  <button type="button" onClick={() => setEditing(p)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Edit ${p.name}`}><Pencil size={15} /></button>
                  <button
                    type="button"
                    onClick={() => confirm(inUse(p.id) ? `${p.name} is linked to opportunities. Delete anyway?` : `Delete ${p.name}?`) && remove("programmes", p.id)}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${p.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              }
            >
              <div className="mb-2 flex flex-wrap gap-1.5">
                {p.isDemo ? <Badge tone="amber">DEMO placeholder</Badge> : <Badge tone="brand">{profile.company.name}</Badge>}
                <Badge>{p.format}</Badge>
              </div>
              <p className="text-sm text-slate-600">{p.description}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Needs addressed</p>
              <div className="mt-1 flex flex-wrap gap-1">{p.capabilities.map((c) => <Badge key={c} tone="brand">{profile.needs[c] ?? c}</Badge>)}</div>
              <p className="mt-3 text-xs text-slate-500">Audience: {p.levels.join(", ")}</p>
            </Card>
          ))}
        </div>
      )}
      {editing && <ProgrammeForm programme={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}
    </>
  );
}

function ProgrammeForm({ programme, onClose }: { programme?: Programme; onClose: () => void }) {
  const { profile, upsert } = useData();
  const t = profile.terminology;
  const LEVELS = profile.audienceLevels;
  const [f, setF] = useState({
    name: programme?.name ?? "",
    description: programme?.description ?? "",
    format: programme?.format ?? "",
    capabilities: programme?.capabilities ?? ([] as CapabilityKey[]),
    levels: programme?.levels ?? ([] as LeadershipLevel[]),
    isDemo: programme?.isDemo ?? false,
  });
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return setError("Name is required");
    if (f.capabilities.length === 0) return setError("Tag at least one need so the mapper can match it");
    upsert("programmes", { ...f, id: programme?.id, name: f.name.trim() });
    onClose();
  };

  const toggle = <T,>(list: T[], v: T, on: boolean) => (on ? [...list, v] : list.filter((x) => x !== v));

  return (
    <Modal
      open
      title={programme ? `Edit ${t.offering.toLowerCase()}` : `Add ${t.offering.toLowerCase()}`}
      onClose={onClose}
      footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" type="submit" form="prog-form">Save</Button></>}
    >
      <form id="prog-form" onSubmit={submit} className="grid gap-3" noValidate>
        {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <Field label={`${t.offering} name *`}>
          <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoFocus />
        </Field>
        <Field label="Description">
          <Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        </Field>
        <Field label="Format">
          <Input value={f.format} onChange={(e) => setF({ ...f, format: e.target.value })} placeholder="e.g. 6 half-day modules, blended" />
        </Field>
        <fieldset>
          <legend className="mb-1 text-xs font-medium text-slate-600">Needs addressed *</legend>
          <div className="grid gap-1 sm:grid-cols-2">
            {(Object.keys(profile.needs) as CapabilityKey[]).map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" className="accent-brand-700" checked={f.capabilities.includes(c)} onChange={(e) => setF({ ...f, capabilities: toggle(f.capabilities, c, e.target.checked) })} />
                {profile.needs[c]}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-1 text-xs font-medium text-slate-600">Audience levels</legend>
          <div className="grid gap-1 sm:grid-cols-2">
            {LEVELS.map((l) => (
              <label key={l} className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" className="accent-brand-700" checked={f.levels.includes(l)} onChange={(e) => setF({ ...f, levels: toggle(f.levels, l, e.target.checked) })} />
                {l}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="accent-brand-700" checked={f.isDemo} onChange={(e) => setF({ ...f, isDemo: e.target.checked })} />
          This is a placeholder (not an official {profile.company.name} {t.offering.toLowerCase()})
        </label>
      </form>
    </Modal>
  );
}
