"use client";

import Link from "next/link";
import { useState } from "react";
import { Share2, Briefcase, Calendar, Check, FileText, Mail, MessageCircle, Pencil, Phone, RotateCw, StickyNote, Trash2, type LucideIcon } from "lucide-react";
import { relativeDay, todayISO } from "@/lib/dates";
import { useData } from "@/lib/store/DataProvider";
import type { Activity, ActivityType } from "@/lib/types";
import { ActivityForm } from "./forms";
import { cx } from "./ui";

const ICONS: Record<ActivityType, LucideIcon> = {
  Call: Phone,
  LinkedIn: Share2,
  Email: Mail,
  WhatsApp: MessageCircle,
  Meeting: Calendar,
  Proposal: FileText,
  "Follow-up": RotateCw,
  Note: StickyNote,
};

export function ActivityList({ activities, showAccount = true, empty = "Nothing here.", editable = false }: { activities: Activity[]; showAccount?: boolean; empty?: string; editable?: boolean }) {
  const { db, upsert, remove } = useData();
  const [editing, setEditing] = useState<Activity | null>(null);
  const today = todayISO();
  if (activities.length === 0) return <p className="py-2 text-sm text-slate-500">{empty}</p>;

  return (
    <>
      <ul className="divide-y divide-slate-100">
        {activities.map((a) => {
          const Icon = ICONS[a.type] ?? Briefcase;
          const account = db.accounts.find((x) => x.id === a.accountId);
          const contact = db.contacts.find((c) => c.id === a.contactId);
          const late = a.status === "planned" && a.date < today;
          return (
            <li key={a.id} className="flex items-start gap-3 py-2.5">
              <span className={cx("mt-0.5 rounded-md p-1.5", late ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500")}>
                <Icon size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-800">{a.summary}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {showAccount && account && (
                    <Link href={`/workspace/accounts/${account.id}`} className="font-medium text-slate-600 hover:text-brand-700">
                      {account.name}
                    </Link>
                  )}
                  {showAccount && account && " · "}
                  {a.type}
                  {contact && ` · ${contact.name}`}
                  {" · "}
                  <span className={cx(late && "font-medium text-amber-700")}>{late ? `Overdue (${relativeDay(a.date, today).toLowerCase()})` : relativeDay(a.date, today)}</span>
                  {a.outcome && ` · ${a.outcome === "no-response" ? "no response" : `${a.outcome} response`}`}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                {a.status === "planned" && (
                  <button
                    type="button"
                    onClick={() => upsert("activities", { ...a, status: "done", date: today })}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:border-brand-200 hover:bg-brand-50"
                    title="Mark as completed"
                  >
                    <Check size={12} /> Done
                  </button>
                )}
                {editable && (
                  <>
                    <button type="button" onClick={() => setEditing(a)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Edit activity">
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => confirm("Delete this activity?") && remove("activities", a.id)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete activity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {editing && <ActivityForm activity={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
