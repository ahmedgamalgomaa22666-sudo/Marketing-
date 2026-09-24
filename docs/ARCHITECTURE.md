# Architecture

## Two layers

```
/                         PUBLIC PROFESSIONAL WEBSITE   src/app/(site)
  /cv                     printable CV (same content source)
  /projects/bd-operating-system   proof-of-work case study
  content: src/content/site.ts    (verified facts + [placeholders])

/workspace/*              PRIVATE BD OPERATING SYSTEM   src/app/workspace (noindex)
  dashboard · accounts · opportunities · follow-ups · opportunity mapper ·
  outreach · offerings · settings · guided demo
```

## BD Operating System: core + profiles

```
            ┌──────────────────── CORE (industry-neutral) ────────────────────┐
            │ config.ts   size bands, pipeline stages, stakeholder roles,     │
            │             activity types, qualification dimensions & weights  │
            │ scoring.ts  Account Fit Score (0–100, reasons + risks)          │
            │ analytics   funnel, conversion, commercial metrics              │
            │ intelligence/ brief · mapper · dealCoach · outreach · nextAction│
            │ store/      DataStore (LocalStore) · DataProvider · empty.ts    │
            └───────────────▲─────────────────────────────────────────────────┘
                            │ profile passed in (pure functions) / useData().profile (UI)
            ┌───────────────┴───────── WorkspaceProfile ──────────────────────┐
            │ company · markets · industries · ICP · buyer roles & function   │
            │ needs catalogue · signals · playbooks · challenges              │
            │ market attractiveness · qualification labels/weights            │
            │ terminology · outreach · modules.opportunityMapper labels       │
            │ starterOfferings · createDemoData? · demoGuide?                 │
            └─────────────────────────────────────────────────────────────────┘
              profiles/bloom   — Bloom Business School (first use case, demo data)
              profiles/generic — any B2B company (starts empty)
```

**Example — Opportunity Mapper.** Core flow: business problem → need → potential solution →
business outcome → discovery questions → next action. The Bloom profile relabels it as the
*Training Opportunity Mapper*: business problem → learning / capability gap → Bloom programme
→ expected business outcome.

Adding a company = adding a profile folder and registering it in `src/lib/profile/index.ts`.

## Data model

```
User 1─* Account 1─* Contact
             │  1─1 AccountScore (ratings.needStrength, ratings.strategicRelevance)
             │  1─* Opportunity *─* Offering (stored as `programmes`)
             │  1─* Activity (type Note = notes)
             └─ 1─* OpportunityRecommendation (mapper output)
Database { version, profileId, … }  — one per profile (localStorage key bdos:db:<profileId>)
```

Schema version 2 renamed `trainingNeed → needStrength` and `trainingPotential → potential`;
older local data is replaced with a fresh workspace on load.

## Key decisions

| Decision | Why |
|---|---|
| Profiles in code, not a DB table | Zero config, type-checked, versioned in git; no multi-tenancy needed yet |
| Per-profile local storage | Workspaces never mix data; switching profile is instant |
| Pure functions with `profile` param | Testable; tests cover both profiles |
| Public site is static server components | Fast, SEO-friendly, no client JS beyond the print button |
| `/workspace` noindex, local-first | Private per browser today; real auth arrives with Supabase |

## Security & privacy
No secrets in git; AI key server-side only; no scraping, credential handling or automated
sending; contacts editable/deletable. Move to the Supabase adapter with auth + RLS before
storing real client data.
