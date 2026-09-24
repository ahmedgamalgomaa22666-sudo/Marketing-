"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AnalyticsView, CvReadyView, LogView, StoriesView } from "@/components/evidence/views";
import { PageHeader, Tabs } from "@/components/ui";

type Tab = "log" | "analytics" | "cv" | "stories";
const TABS: { key: Tab; label: string }[] = [
  { key: "log", label: "Evidence log" },
  { key: "analytics", label: "Analytics" },
  { key: "cv", label: "CV-ready" },
  { key: "stories", label: "Interview stories" },
];

function CareerEvidence() {
  const params = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>((TABS.find((t) => t.key === params.get("tab"))?.key ?? "log") as Tab);
  const change = (t: Tab) => {
    setTab(t);
    router.replace(`/workspace?tab=${t}`, { scroll: false });
  };
  return (
    <>
      <PageHeader title="Career Evidence" subtitle="Private record of your real commercial and BD work — activity, output, outcome, achievement. Nothing here is published automatically." />
      <Tabs tabs={TABS} active={tab} onChange={change} />
      {tab === "log" && <LogView />}
      {tab === "analytics" && <AnalyticsView />}
      {tab === "cv" && <CvReadyView />}
      {tab === "stories" && <StoriesView />}
    </>
  );
}

export default function CareerEvidencePage() {
  return (
    <Suspense>
      <CareerEvidence />
    </Suspense>
  );
}
