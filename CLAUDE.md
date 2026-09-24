# CLAUDE.md — AHMED GAMAL · International Business Development (personal platform)

## Product (two sides, owned by Ahmed Gamal El-Din Gomaa)
Purpose: a long-term personal career asset — authentic commercial/BD identity (15+ years
commercial sales, pharma sales leadership, launches, territory & market development, team
leadership, B2B BD, consultative selling, C-level outreach, GCC markets, analytics). Never
position him as a developer, AI engineer, founder, agency or consultant. Never depend on any
employer/client (Bloom is only an optional sample profile).
1. **Public professional website** (`src/app/(site)`) — executive profile, track record,
   experience, skills, case studies, projects, certifications, CV, contact. All content lives
   in `src/content/site.ts`. Only verified facts; unknowns stay as `[bracketed]` placeholders
   (rendered visibly by `<T>`). Never invent achievements, logos or testimonials.
2. **Private BD Operating System** (`src/app/workspace`, noindex) — reusable B2B workflow:
   accounts → contacts → qualification → stakeholders → discovery → opportunities →
   pipeline → activities → follow-ups → next best action → analytics.

## Core vs profile (the key rule)
- Core code (`src/lib/*`, `src/components`, `src/app/workspace`) must stay industry-neutral.
- Company/industry specifics live in a **WorkspaceProfile** (`src/lib/profile/<id>/`):
  markets, industries, ICP, buyer roles/function, needs catalogue, signals, playbooks,
  challenges, market attractiveness, qualification labels/weights, terminology, outreach
  audience/signature, mapper module labels, starter offerings, optional demo data + guide.
- Profiles: `generic` = Personal BD Workspace (default) and `bloom` = optional sample with
  fictional data (no new Bloom features; never linked from the public site). Pure functions take `profile` as a parameter;
  components read it from `useData()`.
- Internal names `Programme`/`programmes` = generic "offerings" (kept for storage compat).

## Architecture
Next.js 16 App Router + TypeScript + Tailwind v4. `DataProvider` → `DataStore`
(LocalStore, per-profile localStorage keys; Supabase schema in `supabase/`). AI optional via
`AIProvider` (templates by default; Claude only with `ANTHROPIC_API_KEY`, server-side).

## Rules
- Hypotheses labelled as such; metrics with no data show "—"; no invented money.
- No scraping, auto-sending, credential handling, secrets in git, paid APIs required.
- No multi-tenancy/auth beyond the planned Supabase step. Keep it simple.

## Conventions
Small files, `@/` imports, Tailwind utilities, primitives in `src/components/ui.tsx` (workspace)
and `src/components/site.tsx` (public). Before committing: `npm run lint && npm run typecheck &&
npm test && npm run build`. Conventional commits.
