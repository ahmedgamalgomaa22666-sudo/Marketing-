"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input, PageHeader } from "@/components/ui";
import { DEFAULT_WEIGHTS, SCORE_DIMENSIONS, type ScoreDimension } from "@/lib/config";
import { formatDate } from "@/lib/dates";
import { useData } from "@/lib/store/DataProvider";

export default function SettingsPage() {
  const { db, mode, setWeights, resetDemo, clearWorkspace } = useData();
  const [weights, setLocal] = useState<Record<ScoreDimension, number>>(db.settings.weights);
  const [provider, setProvider] = useState("checking…");
  const [saved, setSaved] = useState(false);
  const total = Object.values(weights).reduce((s, w) => s + w, 0);

  useEffect(() => {
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then((d) => setProvider(d.provider === "anthropic" ? "Claude (ANTHROPIC_API_KEY set)" : "Built-in templates (no API key — free)"))
      .catch(() => setProvider("Built-in templates"));
  }, []);

  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Account Fit Score weights">
          <p className="mb-3 text-sm text-slate-600">Weights are normalised to 100. Calibrate them once real win/loss data exists.</p>
          <div className="space-y-2">
            {SCORE_DIMENSIONS.map((d) => (
              <label key={d.key} className="grid grid-cols-[1fr_5rem] items-center gap-3">
                <span>
                  <span className="block text-sm font-medium text-slate-800">{d.label}</span>
                  <span className="block text-xs text-slate-500">{d.help}</span>
                </span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={weights[d.key]}
                  onChange={(e) => {
                    setSaved(false);
                    setLocal({ ...weights, [d.key]: Math.max(0, Math.min(100, Number(e.target.value) || 0)) });
                  }}
                />
              </label>
            ))}
          </div>
          <p className={`mt-3 text-xs ${total === 100 ? "text-slate-500" : "text-amber-700"}`}>Total: {total}{total !== 100 && " — will be normalised to 100"}</p>
          <div className="mt-3 flex gap-2">
            <Button variant="primary" disabled={total === 0} onClick={() => { setWeights(weights); setSaved(true); }}>
              {saved ? "Saved" : "Save weights"}
            </Button>
            <Button onClick={() => { setLocal(DEFAULT_WEIGHTS); setWeights(DEFAULT_WEIGHTS); setSaved(true); }}>Restore defaults</Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="Workspace">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Data mode</dt><dd className="text-right text-slate-800">{mode === "local-demo" ? "Local demo — stored in this browser only" : "Supabase"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Demo data seeded</dt><dd className="text-slate-800">{formatDate(db.seededAt)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Intelligence provider</dt><dd className="text-right text-slate-800">{provider}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Records</dt><dd className="text-slate-800">{db.accounts.length} accounts · {db.contacts.length} contacts · {db.opportunities.length} opportunities · {db.activities.length} activities</dd></div>
            </dl>
          </Card>
          <Card title="Demo data">
            <p className="text-sm text-slate-600">Reset before a demo so dates (today, overdue) are fresh. This replaces all data in this browser.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="primary" onClick={() => confirm("Reset to the demo dataset? All changes in this browser will be lost.") && resetDemo()}>Reset demo data</Button>
              <Button variant="danger" onClick={() => confirm("Remove all accounts, contacts, opportunities and activities? Programmes are kept.") && clearWorkspace()}>Start empty workspace</Button>
            </div>
          </Card>
          <Card title="Privacy">
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
              <li>Store only legitimately obtained business contact information.</li>
              <li>Contacts can be edited or deleted at any time; deleting an account removes its contacts.</li>
              <li>No scraping, automated messaging or credential collection is built into this product.</li>
              <li>In local mode, data never leaves this browser. Move to an authenticated database before storing real client data.</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
