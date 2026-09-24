import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PrintButton } from "@/components/PrintButton";
import { certifications, education, experience, has, lab, languages, person, results, skills } from "@/content/site";

export const metadata: Metadata = { title: "CV" };

export default function CvPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600">
        <span>Online version generated from the website content. Use “Print / Save as PDF” for a copy.</span>
        <PrintButton />
      </div>

      <article className="rounded-lg border border-stone-200 bg-white p-6 sm:p-10 print:border-0 print:p-0">
        <div className="border-b border-stone-200 pb-5">
          <h1 className="font-serif text-3xl text-ink-900 sm:text-4xl">{person.name}</h1>
          <p className="mt-1 text-sm font-medium text-gold-700">{person.headline}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-600">
            {[person.location, person.email, person.linkedin].filter(has).map((v) => (
              <span key={v}>{v}</span>
            ))}
          </p>
        </div>

        <CvSection title="Profile">
          <p className="text-stone-700">{person.intro}</p>
        </CvSection>

        <CvSection title="Selected results — Apex Pharma">
          <ul className="list-disc space-y-0.5 pl-5 text-sm text-stone-700">
            {results.map((r) => (
              <li key={r.id}>{r.statement}</li>
            ))}
          </ul>
        </CvSection>

        <CvSection title="Experience">
          <div className="space-y-4">
            {experience.map((e) => (
              <div key={e.company} className="break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <h3 className="font-semibold text-ink-900">
                    {e.company} <span className="font-normal text-stone-500">· {e.location}</span>
                  </h3>
                  <span className="text-sm text-stone-500">{e.period}</span>
                </div>
                <ul className="mt-0.5 text-sm text-stone-700">
                  {e.roles.map((r) => (
                    <li key={r.title}>
                      {r.title} — {r.period}
                    </li>
                  ))}
                </ul>
                {e.points.length > 0 && e.chapter === "Business development" && (
                  <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-stone-700">
                    {e.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </CvSection>

        <CvSection title="Skills">
          <div className="grid gap-2 sm:grid-cols-2">
            {skills.map((g) => (
              <p key={g.group} className="text-sm text-stone-700">
                <span className="font-semibold text-ink-900">{g.group}: </span>
                {g.items.join(", ")}
              </p>
            ))}
          </div>
        </CvSection>

        <CvSection title="Education & certifications">
          <ul className="space-y-1 text-sm text-stone-700">
            {[...education, ...certifications].map((c) => (
              <li key={c.name}>
                {[c.name, ...[c.issuer, c.year].filter(has)].join(" — ")}
              </li>
            ))}
          </ul>
        </CvSection>

        <CvSection title="Languages">
          <p className="text-sm text-stone-700">{languages.map((l) => `${l.name} — ${l.level}`).join(" · ")}</p>
        </CvSection>

        <CvSection title="Proof of work">
          <p className="text-sm text-stone-700">
            <span className="font-semibold text-ink-900">{lab[0].title}. </span>
            {lab[0].summary}
          </p>
        </CvSection>

      </article>
    </div>
  );
}

function CvSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">{title}</h2>
      {children}
    </section>
  );
}
