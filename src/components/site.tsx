import Link from "next/link";
import type { ReactNode } from "react";
import { isPlaceholder, nav, person } from "@/content/site";

/** Renders text; [bracketed] placeholders are shown as clearly unfinished, never as fact. */
export function T({ children, className = "" }: { children: string; className?: string }) {
  if (isPlaceholder(children)) {
    return (
      <span className={`italic text-stone-400 underline decoration-dotted decoration-stone-300 underline-offset-4 ${className}`} title="Placeholder — replace with verified information">
        {children}
      </span>
    );
  }
  return <span className={className}>{children}</span>;
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fbfaf7]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0 whitespace-nowrap leading-tight">
          <span className="block font-serif text-lg uppercase tracking-[0.12em] text-ink-900">{person.brand}</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-gold-700 sm:tracking-[0.2em]">{person.brandLine}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-[13px] text-stone-600 xl:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-ink-900">
              {n.label}
            </Link>
          ))}
        </nav>
        <details className="relative xl:hidden">
          <summary className="cursor-pointer list-none rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700">Menu</summary>
          <nav className="absolute right-0 mt-2 flex w-48 flex-col rounded-md border border-stone-200 bg-white py-2 text-sm shadow-lg">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="px-4 py-2 text-stone-700 hover:bg-stone-50">
                {n.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-[#f3f1ec]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>© {new Date().getFullYear()} {person.name}</span>
        <span className="flex gap-5">
          <Link href="/cv" className="hover:text-ink-900">CV</Link>
          <Link href="/projects/bd-operating-system" className="hover:text-ink-900">Commercial Lab</Link>
          <Link href="/workspace" className="hover:text-ink-900">Workspace</Link>
        </span>
      </div>
    </footer>
  );
}

export function Section({ id, eyebrow, title, children, tone = "light" }: { id: string; eyebrow: string; title: string; children: ReactNode; tone?: "light" | "muted" }) {
  return (
    <section id={id} className={`scroll-mt-20 ${tone === "muted" ? "bg-[#f3f1ec]" : ""}`}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-700">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl tracking-tight text-ink-900 sm:text-4xl">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function ActionLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" }) {
  const cls =
    variant === "primary"
      ? "bg-ink-900 text-white hover:bg-ink-800"
      : "border border-stone-300 bg-white text-ink-900 hover:border-stone-400";
  return (
    <Link href={href} className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${cls}`}>
      {children}
    </Link>
  );
}
