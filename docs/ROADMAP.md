# Roadmap

## Phase 1 — MVP (this release)

Dashboard, account database, fit score, stakeholder map, account brief, training
opportunity mapper, deal coach, outreach preparation, opportunities, activities &
follow-ups, programme catalogue, settings, guided executive demo. Local demo mode.

## Phase 2 — Make it real (highest value next)

1. **Real Bloom programme catalogue** — replace DEMO programmes; map capabilities.
2. **Supabase adapter + authentication** — implement `SupabaseStore` against
   `supabase/schema.sql`, email login, row-level security per team.
3. **Import** — CSV import of real target accounts and contacts (with source field for
   GDPR/PDPL-style provenance).
4. **Team features** — account ownership, manager view by owner, weekly BD review page.

## Phase 3 — Productivity

- Email/calendar integration (log meetings, not send campaigns).
- Optional Claude assistance for account briefs and meeting summaries (via `AIProvider`).
- Arabic / RTL interface.
- Proposal tracking with document links.

## Phase 4 — Intelligence

- Company intelligence APIs for firmographics (licensed sources only).
- Win/loss analysis and score calibration against actual outcomes.
- Advanced analytics: cycle time, stage ageing, cohort conversion, forecast (once real
  values exist).
- GCC expansion: Qatar, Kuwait, Bahrain, Oman market tables.

## Explicitly not planned

LinkedIn scraping or automation, bulk email tools, purchased contact lists, and any
feature that sends messages without a human.
