import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/site";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-stone-800">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
