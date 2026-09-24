"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { OpportunityForm } from "@/components/forms";
import { Badge, Button, Card, Field, Hypothesis, Input, PageHeader, Select, Textarea, cx } from "@/components/ui";
import { SIZE_BANDS } from "@/lib/config";
import { addDays, todayISO } from "@/lib/dates";
import { buildBusinessCase, capabilityGaps, matchProgrammes } from "@/lib/intelligence/mapper";
import type { WorkspaceProfile } from "@/lib/profile/types";
import { useData } from "@/lib/store/DataProvider";
import type { Account, CapabilityKey, MapperInputs } from "@/lib/types";

const GROWTH = ["Early growth", "Rapid growth", "Mature", "Transformation"] as const;

/** Pre-fill from the account's recorded signals: each signal maps to the challenge whose needs overlap most. */
function prefill(profile: WorkspaceProfile, account?: Account): MapperInputs {
  const signals = (account?.signals ?? []).map((s) => profile.signals[s]).filter(Boolean);
  const bestChallenge = (needs: string[]) =>
    profile.challenges
      .map((c) => ({ key: c.key, overlap: c.needs.filter((n) => needs.includes(n)).length }))
      .sort((a, b) => b.overlap - a.overlap)
      .find((c) => c.overlap > 0)?.key;
  const challenges = [...new Set(signals.map((s) => bestChallenge(s.needs)).filter((c): c is string => !!c))].slice(0, 2);
  const growing = signals.some((s) => s.kind === "strategic" || s.kind === "both");
  return {
    industry: account?.industry ?? profile.industries[0] ?? "",
    sizeBand: account?.sizeBand ?? "1000-4999",
    growthStage: growing ? "Rapid growth" : "Mature",
    challenges,
    targetGroup: "",
    audienceLevel: profile.audienceLevels[Math.min(1, profile.audienceLevels.length - 1)] ?? "",
    desiredOutcome: "",
    urgency: account?.priority ?? "Medium",
    knownGaps: "",
  };
}

function MapperView() {
  const params = useSearchParams();
  const router = useRouter();
  const { db, profile, upsert } = useData();
  const mod = profile.modules.opportunityMapper;
  const STEPS = ["Business problem", mod.needLabel, mod.solutionLabel, "Business case"];
  const [accountId, setAccountId] = useState(params.get("account") ?? "");
  const account = db.accounts.find((a) => a.id === accountId);
  const [inputs, setInputs] = useState<MapperInputs>(() => prefill(profile, db.accounts.find((a) => a.id === params.get("account"))));
  const [step, setStep] = useState(0);
  const [excluded, setExcluded] = useState<CapabilityKey[]>([]);
  const [chosen, setChosen] = useState<string[] | null>(null);
  const [validated, setValidated] = useState(false);
  const [creating, setCreating] = useState(false);
  const [saved, setSaved] = useState(false);
  const set = <K extends keyof MapperInputs>(k: K, v: MapperInputs[K]) => setInputs((p) => ({ ...p, [k]: v }));

  const allGaps = useMemo(() => capabilityGaps(profile, inputs.challenges), [profile, inputs.challenges]);
  const gaps = useMemo(() => allGaps.filter((g) => !excluded.includes(g.capability)), [allGaps, excluded]);
  const matches = useMemo(() => matchProgrammes(gaps, db.programmes, inputs.audienceLevel), [gaps, db.programmes, inputs.audienceLevel]);
  const selectedIds = chosen ?? matches.slice(0, 1).map((m) => m.programme.id);
  const orderedMatches = [...matches.filter((m) => selectedIds.includes(m.programme.id)), ...matches.filter((m) => !selectedIds.includes(m.programme.id))];
  const businessCase = buildBusinessCase(profile, inputs, gaps, orderedMatches);

  const contacts = db.contacts.filter((c) => c.accountId === accountId);
  const champion = contacts.find((c) => c.role === "Champion") ?? contacts[0];

  const selectAccount = (id: string) => {
    setAccountId(id);
    setInputs(prefill(profile, db.accounts.find((a) => a.id === id)));
    setExcluded([]);
    setChosen(null);
    setValidated(false);
  };

  const saveRecommendation = (opportunityId: string | null) => {
    if (!accountId) return;
    upsert("recommendations", { accountId, opportunityId, inputs, gaps: gaps.map((g) => g.capability), programmeIds: selectedIds, businessCase, validated });
    setSaved(true);
  };

  const canNext = step !== 0 || inputs.challenges.length > 0;

  return (
    <>
      <PageHeader
        title={mod.title}
        subtitle={mod.subtitle}
      />

      <ol className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              disabled={i > 0 && inputs.challenges.length === 0}
              onClick={() => setStep(i)}
              className={cx(
                "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm disabled:opacity-50",
                i === step ? "border-brand-600 bg-brand-50 font-medium text-brand-900" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
              )}
            >
              <span className={cx("flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold", i < step ? "bg-brand-700 text-white" : i === step ? "bg-brand-700 text-white" : "bg-slate-200 text-slate-600")}>
                {i < step ? <Check size={12} /> : i + 1}
              </span>
              {s}
            </button>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <Card title="Step 1 — Business problem & situation">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Account (optional)" hint={account ? "Pre-filled from recorded signals — adjust as needed" : "Needed to save or create an opportunity"}>
              <Select value={accountId} onChange={(e) => selectAccount(e.target.value)} options={[{ value: "", label: "— Explore without an account —" }, ...db.accounts.map((a) => ({ value: a.id, label: a.name }))]} />
            </Field>
            <Field label="Industry">
              <Select value={inputs.industry} onChange={(e) => set("industry", e.target.value as MapperInputs["industry"])} options={profile.industries.includes(inputs.industry) ? profile.industries : [inputs.industry, ...profile.industries]} />
            </Field>
            <Field label="Company size">
              <Select value={inputs.sizeBand} onChange={(e) => set("sizeBand", e.target.value as MapperInputs["sizeBand"])} options={SIZE_BANDS.map((b) => ({ value: b.id, label: b.label }))} />
            </Field>
            <Field label="Growth stage">
              <Select value={inputs.growthStage} onChange={(e) => set("growthStage", e.target.value as MapperInputs["growthStage"])} options={GROWTH} />
            </Field>
            <Field label="Target employee group">
              <Input value={inputs.targetGroup} onChange={(e) => set("targetGroup", e.target.value)} placeholder="e.g. New clinic managers" />
            </Field>
            <Field label="Audience level">
              <Select value={inputs.audienceLevel} onChange={(e) => set("audienceLevel", e.target.value)} options={profile.audienceLevels} />
            </Field>
            <Field label="Urgency">
              <Select value={inputs.urgency} onChange={(e) => set("urgency", e.target.value as MapperInputs["urgency"])} options={["High", "Medium", "Low"]} />
            </Field>
            <Field label="Desired outcome" className="sm:col-span-2">
              <Input value={inputs.desiredOutcome} onChange={(e) => set("desiredOutcome", e.target.value)} placeholder="e.g. New clinic managers fully effective within 6 months" />
            </Field>
          </div>
          <fieldset className="mt-4">
            <legend className="mb-2 text-xs font-medium text-slate-600">Business challenge(s) *</legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {profile.challenges.map((c) => {
                const on = inputs.challenges.includes(c.key);
                return (
                  <label key={c.key} className={cx("flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm", on ? "border-brand-600 bg-brand-50 text-brand-900" : "border-slate-200 text-slate-700 hover:border-slate-300")}>
                    <input
                      type="checkbox"
                      className="accent-brand-700"
                      checked={on}
                      onChange={(e) => {
                        set("challenges", e.target.checked ? [...inputs.challenges, c.key] : inputs.challenges.filter((x) => x !== c.key));
                        setChosen(null);
                      }}
                    />
                    {c.label}
                  </label>
                );
              })}
            </div>
            {inputs.challenges.length === 0 && <p className="mt-2 text-xs text-amber-700">Select at least one business challenge to continue.</p>}
          </fieldset>
          <Field label="Known learning gaps (optional)" className="mt-4">
            <Textarea value={inputs.knownGaps} onChange={(e) => set("knownGaps", e.target.value)} placeholder="Anything the client has already told you" />
          </Field>
        </Card>
      )}

      {step === 1 && (
        <Card title={`Step 2 — ${mod.needLabel}`}>
          <p className="mb-3 text-sm text-slate-600">The selected business problems translate into these possible needs. Untick any that don&apos;t apply.</p>
          <ul className="space-y-2">
            {allGaps.map((g) => {
              const on = !excluded.includes(g.capability);
              return (
                <li key={g.capability}>
                  <label className={cx("flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5", on ? "border-slate-200 bg-white" : "border-dashed border-slate-200 bg-slate-50 opacity-60")}>
                    <input type="checkbox" className="mt-1 accent-brand-700" checked={on} onChange={(e) => { setExcluded(e.target.checked ? excluded.filter((x) => x !== g.capability) : [...excluded, g.capability]); setChosen(null); }} />
                    <span className="flex-1">
                      <span className="text-sm font-medium text-slate-900">Hypothesis: {g.label}</span>
                      <span className="block text-xs text-slate-500">Because: {g.because.join("; ")}</span>
                    </span>
                    <Badge tone={g.weight >= 3 ? "brand" : "slate"}>{g.weight >= 3 ? "Primary" : "Supporting"}</Badge>
                  </label>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {step === 2 && (
        <Card title={`Step 3 — ${mod.solutionLabel}`}>
          <p className="mb-3 text-sm text-slate-600">Matched against the editable {profile.terminology.offerings.toLowerCase()} catalogue. Select the solution(s) to propose.</p>
          {matches.length === 0 ? (
            <p className="text-sm text-slate-500">No {profile.terminology.offering.toLowerCase()} covers these needs. Consider a custom solution, or add one to the catalogue.</p>
          ) : (
            <ul className="space-y-2">
              {matches.map((m) => {
                const on = selectedIds.includes(m.programme.id);
                return (
                  <li key={m.programme.id}>
                    <label className={cx("flex cursor-pointer items-start gap-3 rounded-md border px-3 py-3", on ? "border-brand-600 bg-brand-50" : "border-slate-200 bg-white hover:border-slate-300")}>
                      <input type="checkbox" className="mt-1 accent-brand-700" checked={on} onChange={(e) => setChosen(e.target.checked ? [...selectedIds, m.programme.id] : selectedIds.filter((x) => x !== m.programme.id))} />
                      <span className="flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">{m.programme.name}</span>
                          {m.programme.isDemo && <Badge tone="amber">Placeholder</Badge>}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          Covers {m.covered.map((c) => profile.needs[c] ?? c).join(", ")} {m.levelMatch ? `· suited to ${inputs.audienceLevel.toLowerCase()}` : ""}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block text-lg font-semibold tabular-nums text-slate-900">{m.fit}%</span>
                        <span className="text-[11px] text-slate-500">fit</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      )}

      {step === 3 && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Step 4 — Business case" className="lg:col-span-2">
            <dl className="space-y-3 text-sm">
              <CaseRow label="Business problem" value={businessCase.challenge} />
              <CaseRow label={mod.needLabel} value={businessCase.capabilityGap} hypothesis />
              <CaseRow label={mod.solutionLabel} value={businessCase.suggestedSolution} />
              <CaseRow label="Target audience" value={businessCase.targetAudience} />
              <CaseRow label={mod.outcomeLabel} value={businessCase.expectedOutcome} />
              <CaseRow label="Next action" value={businessCase.nextAction} />
            </dl>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Discovery questions</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">{businessCase.discoveryQuestions.map((q) => <li key={q}>{q}</li>)}</ol>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Validation questions</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">{businessCase.validationQuestions.map((q) => <li key={q}>{q}</li>)}</ol>
              </div>
            </div>
          </Card>
          <Card title="Validate & act">
            <label className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <input type="checkbox" className="mt-0.5 accent-brand-700" checked={validated} onChange={(e) => setValidated(e.target.checked)} />
              I have reviewed this recommendation. It is a hypothesis until confirmed with the client.
            </label>
            {!accountId && <p className="mt-3 text-xs text-slate-500">Choose an account in Step 1 to save this or create an opportunity.</p>}
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="primary" disabled={!validated || !accountId} onClick={() => setCreating(true)}>
                Create opportunity
              </Button>
              <Button disabled={!validated || !accountId || saved} onClick={() => saveRecommendation(null)}>
                {saved ? "Recommendation saved" : "Save recommendation only"}
              </Button>
              {account && (
                <Link href={`/workspace/outreach?account=${account.id}${champion ? `&contact=${champion.id}` : ""}&capability=${gaps[0]?.capability ?? ""}`} className="text-center text-sm font-medium text-brand-700 hover:underline">
                  Prepare outreach from this case →
                </Link>
              )}
            </div>
          </Card>
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <Button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft size={15} /> Back
        </Button>
        {step < 3 && (
          <Button variant="primary" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            Next: {STEPS[step + 1]} <ArrowRight size={15} />
          </Button>
        )}
      </div>

      {creating && account && (
        <OpportunityForm
          accountId={account.id}
          prefill={{
            name: `${inputs.targetGroup || gaps[0]?.label || "Capability"} development`,
            stage: "Qualified",
            programmeIds: selectedIds,
            businessProblem: `${businessCase.challenge} ${businessCase.capabilityGap}`,
            primaryContactId: champion?.id ?? null,
            contactIds: contacts.filter((c) => ["Decision Maker", "Champion"].includes(c.role)).map((c) => c.id),
            nextStep: `Validate the need and success measures with ${champion?.name ?? `the ${profile.buyerFunction.label} lead`}`,
            nextStepDate: addDays(todayISO(), 2),
          }}
          onClose={() => setCreating(false)}
          onSaved={(oid) => {
            saveRecommendation(oid);
            router.push(`/workspace/opportunities/${oid}`);
          }}
        />
      )}
    </>
  );
}

function CaseRow({ label, value, hypothesis }: { label: string; value: string; hypothesis?: boolean }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd>{hypothesis ? <ul><Hypothesis>{value}</Hypothesis></ul> : <span className="text-slate-800">{value}</span>}</dd>
    </div>
  );
}

export default function MapperPage() {
  return (
    <Suspense>
      <MapperView />
    </Suspense>
  );
}
