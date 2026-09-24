import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Download, Linkedin, Mail, MapPin } from "@/components/siteIcons";
import { ActionLink, Section, T } from "@/components/site";
import { about, caseStudies, certifications, experience, keyFacts, person, projects, skills, trackRecord } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* Home */}
      <section className="border-b border-stone-200">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-700">{person.headline}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.1] tracking-tight text-ink-900 sm:text-6xl">{person.name}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-600">{person.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink href="/cv">
              View CV <ArrowRight />
            </ActionLink>
            <ActionLink href="/#projects" variant="secondary">
              Proof of work
            </ActionLink>
            <ActionLink href="/#contact" variant="secondary">
              Contact
            </ActionLink>
          </div>
          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 lg:grid-cols-4">
            {keyFacts.map((f) => (
              <div key={f.label} className="bg-[#fbfaf7] px-5 py-5">
                <dt className="font-serif text-3xl text-ink-900">{f.value}</dt>
                <dd className="mt-1 text-sm text-stone-600">{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section id="about" eyebrow="About" title="Commercial discipline, applied">
        <div className="grid gap-6 text-[17px] leading-relaxed text-stone-700 lg:grid-cols-2">
          {about.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </div>
      </Section>

      <Section id="track-record" eyebrow="Track record" title="Where I create commercial value" tone="muted">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trackRecord.map((t) => (
            <article key={t.title} className="rounded-lg border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-xl text-ink-900">{t.title}</h3>
              <p className="mt-2 text-stone-600">{t.body}</p>
              <p className="mt-4 border-t border-stone-100 pt-3 text-sm">
                <T>{t.evidence}</T>
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="experience" eyebrow="Experience" title="Career history">
        <ol className="relative space-y-10 border-l border-stone-300 pl-6">
          {experience.map((e, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] top-1.5 size-2.5 rounded-full bg-gold-600 ring-4 ring-[#fbfaf7]" />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-serif text-xl text-ink-900">
                  <T>{e.role}</T>
                </h3>
                <span className="text-sm text-stone-500">
                  <T>{e.period}</T>
                </span>
              </div>
              <p className="text-stone-600">
                <T>{e.company}</T> · <T>{e.location}</T>
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-stone-700">
                {e.points.map((p, j) => (
                  <li key={j}>
                    <T>{p}</T>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="skills" eyebrow="Skills" title="Capabilities" tone="muted">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((g) => (
            <div key={g.group}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-900">{g.group}</h3>
              <ul className="mt-3 space-y-2 text-stone-700">
                {g.items.map((s) => (
                  <li key={s} className="border-b border-stone-200 pb-2">
                    <T>{s}</T>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="case-studies" eyebrow="Case studies" title="How I approach commercial problems">
        <div className="grid gap-4 lg:grid-cols-2">
          {caseStudies.map((c) => (
            <article key={c.title} className="rounded-lg border border-stone-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">{c.tag}</p>
              <h3 className="mt-1 font-serif text-xl text-ink-900">{c.title}</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {(["situation", "approach", "result"] as const).map((k) => (
                  <div key={k} className="grid gap-1 sm:grid-cols-[6rem_1fr]">
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

      <Section id="projects" eyebrow="Projects" title="Proof of work" tone="muted">
        <div className="grid gap-6 lg:grid-cols-5">
          {projects.map((p, i) => (
            <article key={p.slug} className={`flex flex-col rounded-lg border border-stone-200 bg-white p-6 ${projects.length === 1 ? "lg:col-span-5" : i === 0 ? "lg:col-span-3" : "lg:col-span-2"}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">{p.kicker}</p>
              <h3 className="mt-1 font-serif text-2xl text-ink-900">{p.title}</h3>
              <p className="mt-3 text-stone-600">{p.summary}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-stone-700">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-gold-600" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                {p.links.map((l, j) => (
                  <ActionLink key={l.href} href={l.href} variant={j === 0 ? "primary" : "secondary"}>
                    {l.label} <ArrowRight />
                  </ActionLink>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="certifications" eyebrow="Certifications" title="Education & certifications">
        <ul className="divide-y divide-stone-200 border-y border-stone-200">
          {certifications.map((c, i) => (
            <li key={i} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="font-serif text-lg text-ink-900">
                <T>{c.name}</T>
              </span>
              <span className="text-sm text-stone-500">
                <T>{c.issuer}</T> · <T>{c.year}</T>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="cv" eyebrow="CV" title="Curriculum vitae" tone="muted">
        <div className="flex flex-col gap-4 rounded-lg border border-stone-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-stone-700">A one-page CV generated from the same verified content as this site — printable or savable as PDF.</p>
          <ActionLink href="/cv">
            <Download /> Open CV
          </ActionLink>
        </div>
      </Section>

      <Section id="contact" eyebrow="Contact" title="Let’s talk">
        <div className="grid gap-8 lg:grid-cols-2">
          <p className="text-[17px] leading-relaxed text-stone-700">{person.availability}</p>
          <ul className="space-y-4">
            <ContactRow icon={<Mail />} label="Email">
              <T>{person.email}</T>
            </ContactRow>
            <ContactRow icon={<Linkedin />} label="LinkedIn">
              <T>{person.linkedin}</T>
            </ContactRow>
            <ContactRow icon={<MapPin />} label="Location">
              <T>{person.location}</T>
            </ContactRow>
          </ul>
        </div>
        <p className="mt-10 text-xs text-stone-400">
          Private workspace: <Link href="/workspace" className="underline underline-offset-2 hover:text-stone-600">BD Operating System</Link>
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
