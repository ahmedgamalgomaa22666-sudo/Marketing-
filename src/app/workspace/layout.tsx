import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { DataProvider } from "@/lib/store/DataProvider";

export const metadata: Metadata = {
  title: "BD Operating System",
  description: "Private business development workspace.",
  robots: { index: false, follow: false },
};

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <DataProvider>
      <AppShell>{children}</AppShell>
    </DataProvider>
  );
}
