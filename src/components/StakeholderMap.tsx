"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageSquareText, Pencil, Plus, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/dates";
import { useData } from "@/lib/store/DataProvider";
import type { Contact, StakeholderRole } from "@/lib/types";
import { ContactForm } from "./forms";
import { Button, Card, EmptyState, cx } from "./ui";

const ROLE_STYLE: Record<StakeholderRole, string> = {
  "Decision Maker": "border-brand-600 bg-brand-50",
  Champion: "border-sky-500 bg-sky-50",
  Influencer: "border-violet-400 bg-violet-50",
  Procurement: "border-amber-400 bg-amber-50",
  Gatekeeper: "border-slate-400 bg-slate-50",
  User: "border-slate-300 bg-white",
  Unknown: "border-dashed border-slate-300 bg-white",
};

const MAP_ORDER: StakeholderRole[][] = [["Decision Maker", "Procurement"], ["Champion", "Influencer", "Gatekeeper"], ["User", "Unknown"]];
const TIER_LABEL = ["Decide & approve", "Shape the decision", "Use & unassigned"];

export function StakeholderMap({ accountId }: { accountId: string }) {
  const { db, remove } = useData();
  const contacts = db.contacts.filter((c) => c.accountId === accountId);
  const [editing, setEditing] = useState<Contact | "new" | null>(null);
  const missing = (["Decision Maker", "Champion", "Procurement"] as StakeholderRole[]).filter((r) => !contacts.some((c) => c.role === r));

  return (
    <div className="space-y-4">
      <Card
        title="Buying group map"
        action={
          <Button variant="primary" onClick={() => setEditing("new")}>
            <Plus size={15} /> Add stakeholder
          </Button>
        }
      >
        {contacts.length === 0 ? (
          <EmptyState title="No stakeholders mapped" description="Start with the HR / L&D lead and the budget holder. Record only legitimately obtained contact information." />
        ) : (
          <div className="space-y-4">
            {MAP_ORDER.map((roles, tier) => {
              const people = contacts.filter((c) => roles.includes(c.role));
              return (
                <div key={tier}>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{TIER_LABEL[tier]}</div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {people.length === 0 && <div className="rounded-md border border-dashed border-slate-200 px-3 py-3 text-xs text-slate-400">No {roles.join(" / ").toLowerCase()} identified</div>}
                    {people.map((c) => (
                      <div key={c.id} className={cx("rounded-md border-l-4 border px-3 py-2", ROLE_STYLE[c.role])}>
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{c.role}</div>
                        <div className="text-sm font-medium text-slate-900">{c.name}</div>
                        <div className="text-xs text-slate-600">{c.title}</div>
                        <div className="mt-1 text-[11px] text-slate-500">Last interaction: {formatDate(c.lastInteractionAt)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {missing.length > 0 && (
              <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">Coverage gaps: {missing.join(", ")} not yet identified. Multi-threading reduces deal risk.</p>
            )}
          </div>
        )}
      </Card>

      {contacts.length > 0 && (
        <Card title={`Stakeholders (${contacts.length})`}>
          <div className="-mx-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-xs text-slate-500">
                <tr>
                  <th className="px-4 pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Role</th>
                  <th className="pb-2 font-medium">Seniority</th>
                  <th className="pb-2 font-medium">Next action</th>
                  <th className="px-4 pb-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-2">
                      <div className="font-medium text-slate-900">{c.name}</div>
                      <div className="text-xs text-slate-500">
                        {c.title}
                        {c.department && ` · ${c.department}`}
                      </div>
                      <div className="text-xs text-slate-400">
                        {c.email}
                        {c.linkedinUrl && (
                          <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-brand-700 hover:underline">
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-2 text-slate-700">{c.role}</td>
                    <td className="py-2 text-slate-600">{c.seniority}</td>
                    <td className="py-2 text-slate-600">{c.nextAction || "—"}</td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end gap-1">
                        <Link href={`/workspace/outreach?account=${accountId}&contact=${c.id}`} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-brand-700" title="Prepare outreach" aria-label={`Prepare outreach to ${c.name}`}>
                          <MessageSquareText size={15} />
                        </Link>
                        <button type="button" onClick={() => setEditing(c)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Edit ${c.name}`}>
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirm(`Delete ${c.name}? Their personal data will be removed from this workspace.`) && remove("contacts", c.id)}
                          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${c.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {editing && <ContactForm accountId={accountId} contact={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

