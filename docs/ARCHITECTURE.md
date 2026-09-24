# Architecture

## Overview

```
Next.js App Router (client pages)
        │
        ▼
DataProvider (React context)  ── actions: upsert / remove per collection
        │
        ▼
DataStore interface ──► LocalStore (localStorage, seeded with demo data)   ← MVP
                    └─► SupabaseStore (schema in supabase/schema.sql)       ← roadmap

Pure domain logic (src/lib/*, unit-tested, no React):
  scoring.ts · analytics.ts · intelligence/{brief,mapper,dealCoach,outreach,nextAction}.ts

AI (optional):
  /api/ai/outreach (server route) → AIProvider
      ├─ TemplateProvider   (deterministic, default, free)
      └─ AnthropicProvider  (only when ANTHROPIC_API_KEY is set)
```

### Key decisions

| Decision | Why |
|---|---|
| Local-first `DataStore` | App runs with zero configuration, is Vercel-deployable, and the owner demo never depends on a database. Each browser is its own sandbox. |
| Pure functions for all business logic | Scoring, funnel and mapper logic are testable, explainable and reusable on a server later. |
| Rule-based intelligence | Industry playbooks + business signals + capability map produce credible, transparent output at zero runtime cost. AI is an optional enhancer, never a dependency. |
| Keys stay server-side | The Anthropic key is read only in the API route; the client never sees it. If the route fails, the client falls back to templates. |
| No component/chart library | A handful of Tailwind primitives and CSS bars are enough and keep the bundle and maintenance small. |
| Stages as config | `src/lib/config.ts` is the single place to rename or reorder pipeline stages, industries and weights. |

## Data model

```
User 1─* Account 1─* Contact
             │  1─1 AccountScore (ratings + evidence)
             │  1─* Opportunity *─* Programme (programmeIds)
             │  1─* Activity (optionally linked to Opportunity / Contact)
             └─ 1─* OpportunityRecommendation (mapper output, optionally → Opportunity)
```

| Entity | Purpose | Notable fields |
|---|---|---|
| User | Account owner | name, role |
| Account | Target company | country, city, industry, sizeBand, stage, highestStage, priority, trainingPotential, signals[], tags[], nextFollowUpAt |
| AccountScore | BD judgement inputs for the fit score | ratings.trainingNeed (0–5), ratings.strategicRelevance (0–5), evidence |
| Contact | Stakeholder | title, department, seniority, role (Decision Maker…Unknown), linkedinUrl, email, phone, nextAction |
| Opportunity | Commercial deal | stage, programmeIds[], primaryContactId, contactIds[], estimatedValue? (optional), probability?, businessProblem, nextStep, nextStepDate |
| Activity | Timeline + follow-ups | type (Call, LinkedIn, Email, WhatsApp, Meeting, Proposal, Follow-up, Note), status (planned/done), dueDate, outcome |
| Programme | Editable catalogue | isDemo, capabilities[], levels[], format |
| OpportunityRecommendation | Saved mapper result | inputs, gaps[], programmeIds[], businessCase, validated |

**Notes** are Activities of type `Note` — no separate table. The fit score itself is always
computed, never stored, so it can't go stale.

All entities carry `id`, `createdAt`, `updatedAt`. Deleting an account cascades to its
contacts, opportunities, activities, score and recommendations.

## Folder layout

```
src/
  app/                 routes (dashboard, accounts, opportunities, mapper, outreach,
                       activities, programmes, settings, demo, api/ai/outreach)
  components/          ui primitives + feature components
  lib/
    types.ts           domain types
    config.ts          stages, industries, weights, labels
    store/             DataStore interface, LocalStore, DataProvider
    demo/seed.ts       fictional demo dataset (relative dates)
    scoring.ts         Account Fit Score
    analytics.ts       funnel + commercial metrics
    intelligence/      brief, mapper, deal coach, outreach, next action, playbooks
    ai/                AIProvider, TemplateProvider, AnthropicProvider
supabase/schema.sql    relational schema for the future adapter
```

## Security & privacy

- No secrets in git (`.env*` ignored; `.env.example` documents variables).
- No scraping, credential handling or automated sending anywhere in the codebase.
- Local mode stores data in the user's browser only. Before storing real contact data, move
  to the Supabase adapter with authentication and row-level security.
- Outreach drafts are displayed for copy/paste; there is no send capability.
