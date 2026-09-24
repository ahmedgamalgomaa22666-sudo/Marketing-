"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArrowUpRight, Award, Building2, CalendarCheck, Compass, LayoutDashboard, Menu, MessageSquareText, Settings, Target, X } from "lucide-react";
import { todayISO } from "@/lib/dates";
import { useData } from "@/lib/store/DataProvider";
import { cx } from "./ui";

// Offerings (/workspace/offerings) stays in the code but is intentionally not in the menu.
const NAV = [
  { href: "/workspace", label: "Career Evidence", icon: Award, group: "" },
  { href: "/workspace/pipeline", label: "Pipeline overview", icon: LayoutDashboard, group: "BD Toolkit" },
  { href: "/workspace/accounts", label: "Accounts", icon: Building2, group: "BD Toolkit" },
  { href: "/workspace/opportunities", label: "Opportunities", icon: Target, group: "BD Toolkit" },
  { href: "/workspace/activities", label: "Follow-ups", icon: CalendarCheck, group: "BD Toolkit" },
  { href: "/workspace/mapper", label: "Opportunity Mapper", icon: Compass, group: "BD Toolkit", mapper: true },
  { href: "/workspace/outreach", label: "Outreach Prep", icon: MessageSquareText, group: "BD Toolkit" },
  { href: "/workspace/settings", label: "Settings", icon: Settings, group: " " },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { db, profile } = useData();
  const overdue = db.activities.filter((a) => a.status === "planned" && a.date < todayISO()).length;
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map(({ href, label: coreLabel, icon: Icon, group, ...flags }, i) => {
        const label = "mapper" in flags ? profile.modules.opportunityMapper.title : coreLabel;
        const header = group !== (NAV[i - 1]?.group ?? "") ? group.trim() : null;
        const active = href === "/workspace" ? pathname === "/workspace" : pathname.startsWith(href);
        return (
          <div key={href}>
            {header !== null && <div className={cx("mt-4 px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-brand-100/50", !header && "mt-3 pb-0")}>{header}</div>}
          <Link
            href={href}
            onClick={onNavigate}
            className={cx(
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm",
              active ? "bg-white/10 font-medium text-white" : "text-brand-100/80 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon size={16} strokeWidth={1.75} />
            <span className="flex-1">{label}</span>
            {href === "/workspace/activities" && overdue > 0 && <span className="rounded bg-amber-400/90 px-1.5 text-[11px] font-semibold text-slate-900">{overdue}</span>}
          </Link>
          </div>
        );
      })}
    </nav>
  );
}

function Brand() {
  const { profile } = useData();
  return (
    <div className="px-2.5">
      <div className="text-sm font-semibold uppercase tracking-[0.12em] text-white">Ahmed Gamal</div>
      <div className="text-[11px] text-brand-100/90">BD Intelligence Workspace</div>
      {profile.company.name !== "BD Intelligence Workspace" && <div className="text-[11px] uppercase tracking-wider text-brand-100/70">{profile.company.name}</div>}
    </div>
  );
}


export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { mode, profile } = useData();
  return (
    <div className="min-h-screen lg:pl-60">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col gap-6 bg-brand-900 px-3 py-5 lg:flex">
        <Brand />
        <NavLinks />
        <p className="mt-auto px-2.5 text-[11px] leading-relaxed text-brand-100/60">{mode === "local-demo" ? "Private local workspace — data is stored in this browser only." : "Connected workspace"}
          <Link href="/" className="mt-2 flex items-center gap-1 text-brand-100/80 hover:text-white">
            Public site <ArrowUpRight size={12} />
          </Link>
        </p>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between bg-brand-900 px-4 py-3 lg:hidden">
        <Brand />
        <button type="button" onClick={() => setOpen(true)} className="rounded p-1.5 text-white hover:bg-white/10" aria-label="Open menu">
          <Menu size={20} />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={() => setOpen(false)}>
          <div className="h-full w-64 bg-brand-900 px-3 py-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <Brand />
              <button type="button" onClick={() => setOpen(false)} className="rounded p-1 text-white hover:bg-white/10" aria-label="Close menu">
                <X size={18} />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {profile.demoNotice && <div className="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-xs font-medium text-amber-900 no-print">{profile.demoNotice}</div>}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
