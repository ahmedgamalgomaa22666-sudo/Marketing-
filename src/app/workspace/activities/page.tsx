"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ActivityList } from "@/components/ActivityList";
import { ActivityForm } from "@/components/forms";
import { Button, Card, PageHeader, Select, Tabs } from "@/components/ui";
import { ACTIVITY_TYPES } from "@/lib/config";
import { overdue, upcoming, dueToday } from "@/lib/analytics";
import { todayISO } from "@/lib/dates";
import { useData } from "@/lib/store/DataProvider";

type View = "overdue" | "today" | "upcoming" | "completed";

export default function ActivitiesPage() {
  const { db } = useData();
  const today = todayISO();
  const [type, setType] = useState("");
  const [modal, setModal] = useState<"log" | "plan" | null>(null);
  const acts = db.activities.filter((a) => !type || a.type === type);
  const lists = {
    overdue: overdue(acts, today),
    today: dueToday(acts, today),
    upcoming: upcoming(acts, today),
    completed: acts.filter((a) => a.status === "done").sort((a, b) => b.date.localeCompare(a.date)),
  };
  const [view, setView] = useState<View>(lists.overdue.length ? "overdue" : "today");

  const tabs: { key: View; label: string }[] = [
    { key: "overdue", label: `Overdue (${lists.overdue.length})` },
    { key: "today", label: `Today (${lists.today.length})` },
    { key: "upcoming", label: `Upcoming (${lists.upcoming.length})` },
    { key: "completed", label: `Completed (${lists.completed.length})` },
  ];
  const empty: Record<View, string> = {
    overdue: "No overdue follow-ups.",
    today: "Nothing due today.",
    upcoming: "No upcoming actions planned.",
    completed: "No completed activities yet.",
  };

  return (
    <>
      <PageHeader
        title="Follow-ups & activity"
        subtitle="Follow-up discipline: every open account should have a dated next action."
        actions={
          <>
            <Button onClick={() => setModal("log")} disabled={!db.accounts.length}>
              <Plus size={15} /> Log activity
            </Button>
            <Button variant="primary" onClick={() => setModal("plan")} disabled={!db.accounts.length}>
              <Plus size={15} /> Plan next action
            </Button>
          </>
        }
      />
      <Card>
        <div className="mb-2 flex justify-end">
          <Select aria-label="Filter by type" className="w-40" value={type} onChange={(e) => setType(e.target.value)} options={[{ value: "", label: "All types" }, ...ACTIVITY_TYPES]} />
        </div>
        <Tabs tabs={tabs} active={view} onChange={setView} />
        <ActivityList activities={lists[view]} editable empty={empty[view]} />
      </Card>
      {modal && <ActivityForm defaultStatus={modal === "plan" ? "planned" : "done"} onClose={() => setModal(null)} />}
    </>
  );
}
