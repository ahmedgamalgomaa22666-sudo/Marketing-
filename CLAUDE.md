# CLAUDE.md — Bloom GCC Corporate Growth Engine

## Product
Internal BD operating system for Bloom Business School's corporate learning sales in the
UAE and KSA: prioritise accounts, map stakeholders, form hypotheses, match Bloom solutions,
prepare outreach, run the pipeline, measure BD performance. Not a generic CRM, chatbot,
scraper or mass-messaging tool. Full spec: `docs/PRODUCT_SPEC.md`.

## Architecture
- Next.js 16 App Router + TypeScript + Tailwind v4. Pages are client components reading
  from `DataProvider` (`src/lib/store`).
- `DataStore` interface; MVP uses `LocalStore` (localStorage, demo seed). Supabase is a
  future adapter (`supabase/schema.sql`). Never make the app depend on env vars to run.
- All business logic is pure and lives in `src/lib` (scoring, analytics, intelligence).
  Keep React out of it and unit-test it (`npm test`).
- AI is optional: `src/lib/ai` `AIProvider` → template by default; Anthropic only when
  `ANTHROPIC_API_KEY` is set, server-side only.
- Details: `docs/ARCHITECTURE.md`.

## Data model
User, Account, AccountScore, Contact, Opportunity, Activity (type `Note` = notes),
Programme, OpportunityRecommendation. Types in `src/lib/types.ts`; stages/industries/
weights in `src/lib/config.ts`.

## Rules
- Never invent real Bloom programmes, prices, customers, revenue or case studies. Demo
  content is labelled DEMO; demo values for money stay empty.
- Inferred needs are labelled "Hypothesis" and phrased to validate ("Consider exploring…").
- Metrics with no underlying records show "—", never a made-up number.
- No scraping, auto-sending, credential handling or secrets in git.

## Conventions
- Small files, named exports, `@/` imports. Tailwind utility classes; shared primitives
  in `src/components/ui.tsx`. Calm executive UI: slate neutrals + one brand accent, no
  gradients/glow/heavy animation.
- Run `npm run lint && npm run typecheck && npm test && npm run build` before committing.
- Logical conventional commits (`feat:`, `fix:`, `docs:`, `chore:`).

## Avoid
New dependencies without clear need, microservices, premature abstraction, speculative
features outside `docs/ROADMAP.md`, and test coverage for its own sake.
