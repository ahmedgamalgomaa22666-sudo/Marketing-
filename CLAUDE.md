# CLAUDE.md — AHMED GAMAL · Personal Commercial & Business Development Platform

## Product (two sides, owned by Ahmed Gamal El-Din Gomaa)
The public platform is the product; the private workspace is a feature. Positioning: a
credible transition from 15+ years of pharmaceutical COMMERCIAL SALES (Sigma 2010–11; Apex
Pharma 2011– : Medical Rep → Senior Rep → Acting District Supervisor) into GCC business
development (Pella Nova/Pella Group and freelance for Bloom Business School, both 2026–).
Never present 15+ years as BD. SHOW > CLAIM: every claim backed by verified evidence; no
generic adjectives. Never position him as developer, AI engineer, founder, agency or consultant.
Employers appear only as verified career facts on the public site; the workspace never depends
on any employer and complements (never replaces) the employer's CRM.
1. **Public professional website** (`src/app/(site)`) — executive profile, track record,
   experience, skills, case studies, projects, certifications, CV, contact. All content lives
   in `src/content/site.ts`. Only verified facts; unknowns stay as `[bracketed]` placeholders
   (rendered visibly by `<T>`). Never invent achievements, logos or testimonials.
2. **BD Intelligence Workspace** (`src/app/workspace`, noindex) — account strategy,
   stakeholders, discovery/meeting prep, opportunity thinking, objections, next best action,
   personal BD metrics. Company-independent.

## Core vs profile (the key rule)
- Core code (`src/lib/*`, `src/components`, `src/app/workspace`) must stay industry-neutral.
- Company/industry specifics live in a **WorkspaceProfile** (`src/lib/profile/<id>/`):
  markets, industries, ICP, buyer roles/function, needs catalogue, signals, playbooks,
  challenges, market attractiveness, qualification labels/weights, terminology, outreach
  audience/signature, mapper module labels, starter offerings, optional sample data.
- Profile: `personal` (default, starts empty). Pure functions take `profile` as a parameter;
  components read it from `useData()`. Tests use the neutral fixture in `src/lib/test`.
- Internal names `Programme`/`programmes` = generic "offerings" (kept for storage compat).

## Architecture
Next.js 16 App Router + TypeScript + Tailwind v4. `DataProvider` → `DataStore`
(LocalStore, per-profile localStorage keys; Supabase schema in `supabase/`). AI optional via
`AIProvider` (templates by default; Claude only with `ANTHROPIC_API_KEY`, server-side).

## Public/private rule
Public content comes only from `src/content/site.ts`, never from workspace data. Only
verified, anonymised, manually approved Evidence Log entries may become public. No CRM import
or bulk export; contact email/phone off by default. See `docs/ROADMAP.md`.

## Rules
- Hypotheses labelled as such; metrics with no data show "—"; no invented money.
- No scraping, auto-sending, credential handling, secrets in git, paid APIs required.
- No multi-tenancy/auth beyond the planned Supabase step. Keep it simple.

## Conventions
Small files, `@/` imports, Tailwind utilities, primitives in `src/components/ui.tsx` (workspace)
and `src/components/site.tsx` (public). Before committing: `npm run lint && npm run typecheck &&
npm test && npm run build`. Conventional commits.
