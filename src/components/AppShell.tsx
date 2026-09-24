"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArrowUpRight, BookOpen, Building2, CalendarCheck, Compass, LayoutDashboard, Menu, MessageSquareText, PlayCircle, Settings, Target, X } from "lucide-react";
import { todayISO } from "@/lib/dates";
import { useData } from "@/lib/store/DataProvider";
import { cx } from "./ui";

const NAV = [
  { href: "/workspace", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workspace/accounts", label: "Accounts", icon: Building2 },
  { href: "/workspace/opportunities", label: "Opportunities", icon: Target },
  { href: "/workspace/activities", label: "Follow-ups", icon: CalendarCheck },
  { href: "/workspace/mapper", label: "Opportunity Mapper", icon: Compass, mapper: true },
  { href: "/workspace/outreach", label: "Outreach Prep", icon: MessageSquareText },
  { href: "/workspace/offerings", label: "Offerings", icon: BookOpen, offerings: true },
  { href: "/workspace/settings", label: "Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { db, profile } = useData();
  const overdue = db.activities.filter((a) => a.status === "planned" && a.date < todayISO()).length;
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map(({ href, label: coreLabel, icon: Icon, ...flags }) => {
        const label = "mapper" in flags ? profile.modules.opportunityMapper.title : "offerings" in flags ? profile.terminology.offerings : coreLabel;
        const active = href === "/workspace" ? pathname === "/workspace" : pathname.startsWith(href);
        return (
          <Link
            key={href}
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
        );
      })}
      <Link
        href="/workspace/demo"
        onClick={onNavigate}
        className={cx("mt-4 flex items-center gap-2.5 rounded-md border border-white/15 px-2.5 py-2 text-sm", pathname === "/workspace/demo" ? "bg-white/10 text-white" : "text-brand-100/80 hover:text-white")}
      >
        <PlayCircle size={16} strokeWidth={1.75} />
        Guided demo
      </Link>
    </nav>
  );
}

function Brand() {
  const { profile } = useData();
  return (
    <div className="px-2.5">
      <div className="text-sm font-semibold tracking-tight text-white">BD Operating System</div>
      <div className="text-[11px] uppercase tracking-wider text-brand-100/70">{profile.company.name}</div>
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
