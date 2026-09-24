# Roadmap

## Done
- **BD Operating System core**: dashboard, accounts, fit score, stakeholder map, brief,
  opportunity mapper, deal coach, outreach prep, opportunities, follow-ups, analytics.
- **Profile layer**: Bloom Business School (first use case, polished demo) + Generic B2B.
- **Public professional website**: home, about, track record, experience, skills, case
  studies, projects, certifications, CV (printable), contact.

## Next (highest value first)
1. **Replace site placeholders with verified facts** — employers, dates, results,
   certifications, contact details (`src/content/site.ts`). Optionally add `public/cv.pdf`.
2. **Deploy** to Vercel with a custom domain.
3. **Supabase adapter + login** — make the private workspace truly private and synced across
   devices (schema ready in `supabase/schema.sql`).
4. **Personal profile** — a profile for your own BD target market (e.g. pharma / healthcare
   B2B), built by copying `profiles/generic`.
5. **CSV import** of accounts and contacts (with source/provenance field).

## Later
- Profile-level pipeline stage labels; Arabic / RTL.
- Email/calendar logging (not sending); optional Claude-assisted briefs.
- Win/loss analysis and score calibration; forecast once real values exist.
- Bloom: real programme catalogue (paused until Bloom engagement resumes).

## Explicitly not planned
Scraping, bulk messaging, purchased contact lists, fake testimonials/logos, multi-tenant SaaS.
