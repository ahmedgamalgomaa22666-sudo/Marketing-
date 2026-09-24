import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { DataProvider } from "@/lib/store/DataProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloom GCC Corporate Growth Engine",
  description: "Business development operating system for corporate learning in the UAE and Saudi Arabia.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DataProvider>
          <AppShell>{children}</AppShell>
        </DataProvider>
      </body>
    </html>
  );
}
