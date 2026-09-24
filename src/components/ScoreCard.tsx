import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { SCORE_DIMENSIONS } from "@/lib/config";
import type { FitScore } from "@/lib/scoring";
import { Card } from "./ui";

export function ScoreCard({ score }: { score: FitScore }) {
  return (
    <Card title="Account Fit Score" action={<span className="text-xs text-slate-500">Transparent, rule-based</span>}>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-semibold tabular-nums text-slate-900">{score.total}</span>
        <span className="text-sm text-slate-500">/ 100</span>
        <span className="ml-2 rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-800 ring-1 ring-brand-200">{score.band}</span>
      </div>

      <ul className="mt-4 space-y-2">
        {score.dimensions.map((d) => (
          <li key={d.key} title={SCORE_DIMENSIONS.find((x) => x.key === d.key)?.help}>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">{d.label}</span>
              <span className="tabular-nums text-slate-800">
                {Math.round(d.points)} <span className="text-slate-400">/ {Math.round(d.max)}</span>
              </span>
            </div>
            <div className="mt-1 h-1.5 rounded-sm bg-slate-100">
              <div className="h-1.5 rounded-sm bg-brand-600" style={{ width: `${d.fraction * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-800">Why it scores</h3>
          <ul className="mt-2 space-y-1.5">
            {score.strengths.length === 0 && <li className="text-sm text-slate-500">No strengths recorded yet.</li>}
            {score.strengths.map((s) => (
              <li key={s} className="flex gap-2 text-sm text-slate-700">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-brand-600" /> {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700">Risks & unknowns</h3>
          <ul className="mt-2 space-y-1.5">
            {score.risks.length === 0 && <li className="text-sm text-slate-500">No material risks flagged.</li>}
            {score.risks.map((r) => (
              <li key={r} className="flex gap-2 text-sm text-slate-700">
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600" /> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
