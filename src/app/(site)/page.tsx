import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Download, Linkedin, Mail, MapPin } from "@/components/siteIcons";
import { ActionLink, Section, T } from "@/components/site";
import {
  about,
  businessDevelopment,
  caseStudies,
  certifications,
  education,
  experience,
  isPlaceholder,
  lab,
  person,
  problems,
  results,
  skills,
} from "@/content/site";

export default function HomePage() {
  const chapters = [...new Set(experience.map((e) => e.chapter))];
  return (
    <>
      {/* Home — who is Ahmed, and the evidence up front */}
      <section className="border-b border-stone-200">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-700">{person.headline}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.08] tracking-tight text-ink-900 sm:text-6xl">{person.name}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-600">{person.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink href="/#track-record">
              See the evidence <ArrowRight />
            </ActionLink>
            <ActionLink href="/#contact" variant="secondary">
              Contact
            </ActionLink>
            <ActionLink href="/cv" variant="secondary">
              CV
            </ActionLink>
          </div>

          <div className="mt-14">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Selected commercial results</p>
            <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 lg:grid-cols-5">
              {results.map((r) => (
                <div key={r.id} className="bg-[#fbfaf7] px-5 py-5">
                  <dt className="font-serif text-3xl text-ink-900">{r.value}</dt>
                  <dd className="mt-1 text-sm leading-snug text-stone-600">{r.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Section id="about" eyebrow="About" title={about.title}>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-5 text-[17px] leading-relaxed text-stone-700 lg:col-span-2">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <dl className="space-y-4 border-l border-stone-200 pl-6">
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs uppercase tracking-wide text-stone-500">{f.label}</dt>
                <dd className="mt-0.5 text-ink-900">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section id="track-record" eyebrow="Commercial track record" title="Commercial problems I have solved — and the evidence" tone="muted">
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          {problems.map((p, i) => (
            <div key={p.problem} className={`grid gap-1 px-5 py-4 sm:grid-cols-[1fr_1fr] sm:gap-6 ${i > 0 ? "border-t border-stone-100" : ""}`}>
              <p className="font-serif text-lg text-ink-900">{p.problem}</p>
              <p className="flex items-start gap-2 text-stone-700">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-600" />
                {p.evidence}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <article key={r.id} className="rounded-lg border border-stone-200 bg-white p-5">
              <p className="font-serif text-3xl text-ink-900">{r.value}</p>
              <p className="mt-1 text-stone-700">{r.label}</p>
              <p className="mt-3 border-t border-stone-100 pt-2 text-sm">
                <T>{r.context}</T>
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="experience" eyebrow="Experience" title="From commercial sales leadership to business development">
        <div className="space-y-12">
          {chapters.map((chapter) => (
            <div key={chapter}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">{chapter}</h3>
              <ol className="mt-5 space-y-8 border-l border-stone-300 pl-6">
                {experience
                  .filter((e) => e.chapter === chapter)
                  .map((e) => (
                    <li key={e.company} className="relative">
                      <span className="absolute -left-[31px] top-2 size-2.5 rounded-full bg-gold-600 ring-4 ring-[#fbfaf7]" />
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                        <h4 className="font-serif text-2xl text-ink-900">{e.company}</h4>
                        <span className="text-sm text-stone-500">{e.period}</span>
                      </div>
                      <p className="text-sm text-stone-500">{e.location}</p>
                      <ul className="mt-3 space-y-1">
                        {e.roles.map((r) => (
                          <li key={r.title} className="flex flex-col text-stone-800 sm:flex-row sm:justify-between">
                            <span className="font-medium">{r.title}</span>
                            <span className="text-sm text-stone-500">
                              <T>{r.period}</T>
                            </span>
                          </li>
                        ))}
                      </ul>
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-stone-700">
                        {e.points.map((p) => (
                          <li key={p}>
                            <T>{p}</T>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
              </ol>
            </div>
          ))}
        </div>
      </Section>

      <Section id="business-development" eyebrow="Business development" title="How I think about business development" tone="muted">
        <p className="max-w-3xl text-[17px] leading-relaxed text-stone-700">{businessDevelopment.intro}</p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
          {businessDevelopment.pillars.map((p) => (
            <div key={p.title} className="bg-white p-5">
              <h3 className="font-serif text-lg text-ink-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{p.body}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-14 font-serif text-2xl text-ink-900">Why I could create value in a GCC commercial role</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {businessDevelopment.gccValue.map((v) => (
            <div key={v.title} className="border-t-2 border-gold-600 pt-3">
              <h4 className="font-semibold text-ink-900">{v.title}</h4>
              <p className="mt-1 text-stone-600">{v.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-stone-600">
          <span className="font-semibold uppercase tracking-wide text-ink-900">Focus markets: </span>
          {businessDevelopment.markets.join(" · ")}
        </p>
      </Section>

      <Section id="case-studies" eyebrow="Case studies" title="How the results were achieved">
        <div className="grid gap-4 lg:grid-cols-3">
          {caseStudies.map((c) => (
            <article key={c.id} className="flex flex-col rounded-lg border border-stone-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">{c.tag}</p>
              <h3 className="mt-1 font-serif text-xl text-ink-900">{c.title}</h3>
              <p className="mt-3 rounded bg-[#f3f1ec] px-3 py-2 text-sm font-medium text-ink-900">Result: {c.result}</p>
              <dl className="mt-4 space-y-3 text-sm">
                {(["situation", "approach", "lesson"] as const).map((k) => (
                  <div key={k}>
                    <dt className="font-medium capitalize text-stone-500">{k}</dt>
                    <dd className="text-stone-700">
                      <T>{c[k]}</T>
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </Section>

      <Section id="lab" eyebrow="Commercial Lab" title="Proof of work" tone="muted">
        {lab.map((p) => (
          <article key={p.slug} className="grid gap-6 rounded-lg border border-stone-200 bg-white p-6 sm:p-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">{p.kicker}</p>
              <h3 className="mt-1 font-serif text-2xl text-ink-900">{p.title}</h3>
              <p className="mt-3 text-stone-600">{p.summary}</p>
              <div className="mt-6">
                <ActionLink href={p.href}>
                  Read how it works <ArrowRight />
                </ActionLink>
              </div>
            </div>
            <ul className="space-y-3 self-center text-sm text-stone-700 lg:col-span-2">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-2 border-b border-stone-100 pb-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-600" />
                  {pt}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </Section>

      <Section id="skills" eyebrow="Skills" title="Capabilities">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((g) => (
            <div key={g.group}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-900">{g.group}</h3>
              <ul className="mt-3 space-y-2 text-stone-700">
                {g.items.map((s) => (
                  <li key={s} className="border-b border-stone-200 pb-2">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="certifications" eyebrow="Certifications" title="Education & certifications" tone="muted">
        <ul className="divide-y divide-stone-200 border-y border-stone-200">
          {[...education, ...certifications].map((c) => (
            <li key={c.name} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="font-serif text-lg text-ink-900">{c.name}</span>
              <span className="text-sm text-stone-500">
                <T>{c.issuer}</T> · <T>{c.year}</T>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="cv" eyebrow="CV" title="Curriculum vitae">
        <div className="flex flex-col gap-4 rounded-lg border border-stone-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-stone-700">A one-page CV generated from the same verified content as this site.</p>
          <div className="flex flex-wrap gap-3">
            <ActionLink href="/cv">View CV</ActionLink>
            {isPlaceholder(person.cvFile) ? (
              <span className="inline-flex items-center gap-2 rounded-md border border-dashed border-stone-300 px-4 py-2.5 text-sm">
                <Download /> <T>{person.cvFile}</T>
              </span>
            ) : (
              <a href={person.cvFile} className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 hover:border-stone-400" download>
                <Download /> Download PDF
              </a>
            )}
          </div>
        </div>
      </Section>

      <Section id="contact" eyebrow="Contact" title="Let’s talk" tone="muted">
        <div className="grid gap-8 lg:grid-cols-2">
          <p className="text-[17px] leading-relaxed text-stone-700">{person.availability}</p>
          <ul className="space-y-4">
            <ContactRow icon={<Mail />} label="Email">
              {isPlaceholder(person.email) ? <T>{person.email}</T> : <a href={`mailto:${person.email}`} className="hover:underline">{person.email}</a>}
            </ContactRow>
            <ContactRow icon={<Linkedin />} label="LinkedIn">
              {isPlaceholder(person.linkedin) ? (
                <T>{person.linkedin}</T>
              ) : (
                <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {person.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              )}
            </ContactRow>
            <ContactRow icon={<MapPin />} label="Location">
              <T>{person.location}</T>
            </ContactRow>
          </ul>
        </div>
        <p className="mt-10 text-xs text-stone-400">
          <Link href="/workspace" className="underline underline-offset-2 hover:text-stone-600">
            Private workspace
          </Link>
        </p>
      </Section>
    </>
  );
}

function ContactRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 text-gold-700">{icon}</span>
      <span>
        <span className="block text-xs uppercase tracking-wide text-stone-500">{label}</span>
        <span className="text-ink-900">{children}</span>
      </span>
    </li>
  );
}
