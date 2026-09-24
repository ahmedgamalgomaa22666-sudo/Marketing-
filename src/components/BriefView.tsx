"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { CAPABILITIES } from "@/lib/config";
import type { AccountBrief } from "@/lib/intelligence/brief";
import { Badge, Button, ButtonLink, Card, Hypothesis } from "./ui";

export function BriefView({ brief, accountId }: { brief: AccountBrief; accountId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
        <span>Items marked <strong>Hypothesis</strong> are informed guesses from industry patterns and recorded signals. Validate them with the client before treating them as fact.</span>
        <Button className="no-print" onClick={() => window.print()}>
          <Printer size={14} /> Print brief
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Account overview">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {brief.overview.map((o) => (
              <div key={o.label}>
                <dt className="text-xs text-slate-500">{o.label}</dt>
                <dd className="font-medium text-slate-800">{o.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Business context">
          <p className="text-sm text-slate-700">{brief.context}</p>
          <p className="mt-1 text-xs text-slate-400">Industry pattern, not a statement about this company.</p>
          <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Recorded signals</h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {brief.recordedSignals.length === 0 ? <span className="text-sm text-slate-500">None recorded — add observed signals on the account.</span> : brief.recordedSignals.map((s) => <Badge key={s} tone="brand">{s}</Badge>)}
          </div>
        </Card>

        <Card title="Possible business priorities">
          <ul className="space-y-2">{brief.priorities.map((p) => <Hypothesis key={p}>{p}</Hypothesis>)}</ul>
        </Card>

        <Card title="Potential learning / capability gaps">
          <ul className="space-y-2">{brief.gaps.map((g) => <Hypothesis key={g.capability}>{g.hypothesis}</Hypothesis>)}</ul>
        </Card>

        <Card title="Stakeholders">
          {brief.stakeholders.length === 0 ? (
            <p className="text-sm text-slate-500">No stakeholders mapped yet.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {brief.stakeholders.map((g) => (
                <li key={g.role}>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{g.role}: </span>
                  <span className="text-slate-800">{g.contacts.map((c) => `${c.name} (${c.title})`).join("; ")}</span>
                </li>
              ))}
            </ul>
          )}
          {brief.coverageGaps.length > 0 && <p className="mt-3 text-xs text-amber-700">Gaps: {brief.coverageGaps.join(" · ")}</p>}
        </Card>

        <Card title="Likely sales angle">
          <p className="text-sm text-slate-700">{brief.salesAngle}</p>
        </Card>

        <Card title="Discovery questions">
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-700">{brief.discoveryQuestions.map((q) => <li key={q}>{q}</li>)}</ol>
        </Card>

        <Card title="Likely objections">
          <ul className="space-y-3 text-sm">
            {brief.objections.map((o) => (
              <li key={o.objection}>
                <p className="font-medium text-slate-800">“{o.objection}”</p>
                <p className="mt-0.5 text-slate-600">Response approach: {o.approach}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recommended next action">
          <p className="text-sm font-medium text-slate-900">{brief.nextAction.action}</p>
          <p className="mt-1 text-sm text-slate-500">{brief.nextAction.reason}</p>
        </Card>

        <Card title="Bloom solution match" action={<ButtonLink href={`/mapper?account=${accountId}`} className="no-print">Run mapper</ButtonLink>}>
          {brief.solutions.length === 0 ? (
            <p className="text-sm text-slate-500">No programme in the catalogue covers these gaps yet.</p>
          ) : (
            <ul className="space-y-3">
              {brief.solutions.map((m) => (
                <li key={m.programme.id}>
                  <div className="flex items-center justify-between gap-2">
                    <Link href="/programmes" className="text-sm font-medium text-slate-900 hover:text-brand-700">{m.programme.name}</Link>
                    <span className="text-xs tabular-nums text-slate-500">{m.fit}% coverage</span>
                  </div>
                  <p className="text-xs text-slate-500">Covers: {m.covered.map((c) => CAPABILITIES[c]).join(", ")}</p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-slate-400">DEMO programmes are placeholders until Bloom&apos;s real catalogue is added.</p>
        </Card>
      </div>
    </div>
  );
}
