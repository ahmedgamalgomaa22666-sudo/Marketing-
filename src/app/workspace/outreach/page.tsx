"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Check, Copy, RotateCcw, Sparkles } from "lucide-react";
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, Textarea, ButtonLink } from "@/components/ui";
import { todayISO } from "@/lib/dates";
import { CTA_OPTIONS, MESSAGE_TYPES, reviewChecks, templateDraft, type MessageType, type OutreachDraft } from "@/lib/intelligence/outreach";
import { useData } from "@/lib/store/DataProvider";
import type { CapabilityKey } from "@/lib/types";

function OutreachView() {
  const params = useSearchParams();
  const { db, profile, upsert } = useData();
  const NEEDS = profile.needs;
  const firstNeed = Object.keys(NEEDS)[0] ?? "";
  const [accountId, setAccountId] = useState(params.get("account") ?? db.accounts[0]?.id ?? "");
  const account = db.accounts.find((a) => a.id === accountId);
  const contacts = db.contacts.filter((c) => c.accountId === accountId);
  const [contactId, setContactId] = useState(params.get("contact") ?? "");
  const contact = contacts.find((c) => c.id === contactId) ?? contacts.find((c) => c.role === "Champion") ?? contacts[0];

  const observations = useMemo(() => (account?.signals ?? []).map((s) => profile.signals[s]?.observation).filter((o): o is string => !!o), [account, profile]);
  const defaultCapability = (params.get("capability") as CapabilityKey) || (account ? profile.signals[account.signals[0]]?.needs[0] : undefined) || firstNeed;

  const [type, setType] = useState<MessageType>((MESSAGE_TYPES.find((t) => t.key === params.get("type"))?.key ?? "linkedin") as MessageType);
  const [observation, setObservation] = useState(observations[0] ?? "");
  const [capability, setCapability] = useState<CapabilityKey>(defaultCapability in NEEDS ? defaultCapability : firstNeed);
  const [cta, setCta] = useState(CTA_OPTIONS[0]);
  const [sender, setSender] = useState("");
  const [aiDraft, setAiDraft] = useState<OutreachDraft | null>(null);
  const [edited, setEdited] = useState<string | null>(null);
  const [provider, setProvider] = useState<"template" | "anthropic">("template");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then((d) => setProvider(d.provider === "anthropic" ? "anthropic" : "template"))
      .catch(() => setProvider("template"));
  }, []);

  const input = {
    type,
    companyName: account?.name ?? "",
    country: account?.country ?? "",
    contactName: contact?.name ?? "",
    contactTitle: contact?.title ?? "",
    observation,
    capability: NEEDS[capability] ?? capability,
    stage: account?.stage ?? "",
    cta,
    senderName: sender,
    senderOrg: profile.outreach.signature ?? "",
    audience: profile.outreach.audience,
  };
  const template = templateDraft(input);
  const draft = aiDraft ?? template;
  const body = edited ?? draft.body;
  const checks = reviewChecks(input, body);

  // Any input change invalidates AI output and manual edits.
  const resetDraft = () => {
    setAiDraft(null);
    setEdited(null);
    setLogged(false);
  };

  const improve = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/outreach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      if (!res.ok) throw new Error();
      setAiDraft(await res.json());
      setEdited(null);
    } catch {
      setAiDraft({ ...template, checks: ["AI drafting was unavailable — showing the template draft.", ...template.checks] });
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    const text = draft.subject ? `Subject: ${draft.subject}\n\n${body}` : body;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Clipboard blocked — the user can still select the text manually. */
    }
  };

  const logSent = () => {
    if (!account) return;
    upsert("activities", {
      accountId: account.id,
      opportunityId: null,
      contactId: contact?.id ?? null,
      type: type === "linkedin" ? "LinkedIn" : type === "follow-up" || type === "re-engagement" ? "Follow-up" : "Email",
      status: "done",
      date: todayISO(),
      summary: `${MESSAGE_TYPES.find((t) => t.key === type)?.label} sent to ${contact?.name ?? "stakeholder"} (${(NEEDS[capability] ?? capability).toLowerCase()})`,
      outcome: null,
    });
    if (account.stage === "Target" || account.stage === "Researching") upsert("accounts", { ...account, stage: "Contacted", highestStage: account.highestStage === "Target" || account.highestStage === "Researching" ? "Contacted" : account.highestStage });
    setLogged(true);
  };

  if (db.accounts.length === 0) {
    return <EmptyState title="No accounts yet" description="Add an account and a stakeholder to prepare outreach." action={<ButtonLink href="/workspace/accounts?new=1" variant="primary">Add account</ButtonLink>} />;
  }

  return (
    <>
      <PageHeader title="Outreach preparation" subtitle="Drafts for human review. Nothing is ever sent from this system — copy, edit and send it yourself." />
      <div className="grid gap-4 lg:grid-cols-5">
        <Card title="Context" className="lg:col-span-2">
          <div className="grid gap-3">
            <Field label="Account">
              <Select
                value={accountId}
                onChange={(e) => {
                  const next = db.accounts.find((a) => a.id === e.target.value);
                  setAccountId(e.target.value);
                  setContactId("");
                  setObservation(next?.signals[0] ? (profile.signals[next.signals[0]]?.observation ?? "") : "");
                  resetDraft();
                }}
                options={db.accounts.map((a) => ({ value: a.id, label: a.name }))}
              />
            </Field>
            <Field label="Stakeholder">
              {contacts.length === 0 ? (
                <p className="text-sm text-amber-700">No stakeholders mapped for this account yet.</p>
              ) : (
                <Select value={contact?.id ?? ""} onChange={(e) => { setContactId(e.target.value); resetDraft(); }} options={contacts.map((c) => ({ value: c.id, label: `${c.name} — ${c.title}` }))} />
              )}
            </Field>
            <Field label="Message type">
              <Select value={type} onChange={(e) => { setType(e.target.value as MessageType); resetDraft(); }} options={MESSAGE_TYPES.map((t) => ({ value: t.key, label: t.label }))} />
            </Field>
            <Field label="Business hypothesis / observation" hint="Only use observations you can verify. Leave empty if unsure.">
              <Input list="observations" value={observation} onChange={(e) => { setObservation(e.target.value); resetDraft(); }} placeholder="e.g. expanding into new GCC markets" />
              <datalist id="observations">{observations.map((o) => <option key={o} value={o} />)}</datalist>
            </Field>
            <Field label="Relevant Bloom capability">
              <Select value={capability} onChange={(e) => { setCapability(e.target.value as CapabilityKey); resetDraft(); }} options={Object.entries(NEEDS).map(([value, label]) => ({ value, label }))} />
            </Field>
            <Field label="Call to action">
              <Select value={cta} onChange={(e) => { setCta(e.target.value); resetDraft(); }} options={CTA_OPTIONS} />
            </Field>
            <Field label="Your name">
              <Input value={sender} onChange={(e) => { setSender(e.target.value); resetDraft(); }} placeholder="Signs the message" />
            </Field>
            {account && <p className="text-xs text-slate-500">Sales stage: {account.stage}</p>}
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          <Card
            title="Draft for review"
            action={<Badge tone={draft.source === "claude" ? "violet" : "slate"}>{draft.source === "claude" ? "Claude-assisted draft" : "Template draft"}</Badge>}
          >
            {draft.subject && (
              <p className="mb-2 text-sm">
                <span className="text-slate-500">Subject: </span>
                <span className="font-medium text-slate-900">{draft.subject}</span>
              </p>
            )}
            <Textarea aria-label="Draft message" rows={type === "linkedin" ? 5 : 12} value={body} onChange={(e) => setEdited(e.target.value)} />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>{edited !== null ? "Edited by you" : "Unedited draft"}</span>
              <span className="tabular-nums">{body.length} characters</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="primary" onClick={copy}>
                {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy"}
              </Button>
              {provider === "anthropic" && (
                <Button onClick={improve} disabled={loading}>
                  <Sparkles size={15} /> {loading ? "Drafting…" : "Draft with Claude"}
                </Button>
              )}
              {(aiDraft || edited !== null) && (
                <Button variant="ghost" onClick={resetDraft}>
                  <RotateCcw size={15} /> Reset to template
                </Button>
              )}
              <Button onClick={logSent} disabled={!account || logged}>
                {logged ? "Logged as activity" : "I sent it — log activity"}
              </Button>
            </div>
          </Card>

          <Card title="Before you send">
            <ul className="space-y-1.5 text-sm text-slate-700">
              {[...new Set([...(aiDraft?.checks.filter((c) => c.startsWith("AI")) ?? []), ...checks])].map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-slate-400" /> {c}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Principles: a clear business reason, one genuine question, short, no generic praise or pressure. Mass or automated outreach is intentionally not supported.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function OutreachPage() {
  return (
    <Suspense>
      <OutreachView />
    </Suspense>
  );
}
