import type { Metadata } from "next";
import type { ReactNode } from "react";
import { T } from "@/components/site";
import { PrintButton } from "@/components/PrintButton";
import { about, certifications, experience, person, projects, skills } from "@/content/site";

export const metadata: Metadata = { title: "CV" };

export default function CvPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600">
        <span>Use “Print / Save as PDF” to download. Placeholders in [brackets] must be replaced with verified details first.</span>
        <PrintButton />
      </div>

      <article className="rounded-lg border border-stone-200 bg-white p-6 sm:p-10 print:border-0 print:p-0">
        <div className="border-b border-stone-200 pb-5">
          <h1 className="font-serif text-3xl text-ink-900 sm:text-4xl">{person.name}</h1>
          <p className="mt-1 text-sm font-medium text-gold-700">{person.headline}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-600">
            <T>{person.location}</T>
            <T>{person.email}</T>
            <T>{person.linkedin}</T>
          </p>
        </div>

        <CvSection title="Profile">
          <p className="text-stone-700">{person.summary}</p>
          <p className="mt-2 text-stone-700">{about[1]}</p>
        </CvSection>

        <CvSection title="Experience">
          <div className="space-y-5">
            {experience.map((e, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <h3 className="font-semibold text-ink-900">
                    <T>{e.role}</T>
                  </h3>
                  <span className="text-sm text-stone-500">
                    <T>{e.period}</T>
                  </span>
                </div>
                <p className="text-sm text-stone-600">
                  <T>{e.company}</T> · <T>{e.location}</T>
                </p>
                <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-stone-700">
                  {e.points.map((p, j) => (
                    <li key={j}>
                      <T>{p}</T>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CvSection>

        <CvSection title="Core skills">
          <div className="grid gap-3 sm:grid-cols-2">
            {skills.map((g) => (
              <p key={g.group} className="text-sm text-stone-700">
                <span className="font-semibold text-ink-900">{g.group}: </span>
                {g.items.map((s, i) => (
                  <span key={s}>
                    <T>{s}</T>
                    {i < g.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            ))}
          </div>
        </CvSection>

        <CvSection title="Selected project">
          <p className="text-sm text-stone-700">
            <span className="font-semibold text-ink-900">{projects[0].title}. </span>
            {projects[0].summary}
          </p>
        </CvSection>

        <CvSection title="Education & certifications">
          <ul className="space-y-1 text-sm text-stone-700">
            {certifications.map((c, i) => (
              <li key={i}>
                <T>{c.name}</T> — <T>{c.issuer}</T>, <T>{c.year}</T>
              </li>
            ))}
          </ul>
        </CvSection>
      </article>
    </div>
  );
}

function CvSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 break-inside-avoid">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">{title}</h2>
      {children}
    </section>
  );
}
