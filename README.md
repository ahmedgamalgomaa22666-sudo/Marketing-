# AHMED GAMAL — Personal Business Development Platform

The personal professional platform of **Ahmed Gamal El-Din Gomaa** —
Commercial Growth · B2B Business Development · Consultative Selling · GCC Markets.

It belongs to its owner, not to any employer, and is designed to stay useful across
companies and industries (training, SaaS, healthcare, pharma, medical devices, consulting…).

| Side | Route | Purpose |
|---|---|---|
| **Public professional website** | `/` | Positioning for UAE / Saudi / GCC and international or remote B2B opportunities: about, commercial track record, experience, business development approach, case studies, commercial projects, skills, certifications, CV, contact. |
| **Personal BD Workspace** (private) | `/workspace` | A personal intelligence layer for BD: account strategy and prioritisation, stakeholder mapping, discovery and meeting preparation, opportunity thinking, objection analysis, next-best-action planning, personal BD metrics. |

### Not a CRM replacement

| Company CRM (Bitrix, HubSpot, Salesforce, Zoho, Dynamics…) | Personal BD Workspace |
|---|---|
| Official customer and company records | My account strategy and preparation |
| Team pipeline, forecasting, reporting | My thinking, frameworks and learning |
| Owned by the employer | Owned by me, portable across employers |

Official records stay in the employer's CRM.

## Quick start

```bash
npm install
npm run dev                  # http://localhost:3000 (site) · /workspace (private)
npm run lint && npm run typecheck && npm test && npm run build
```

No environment variables, database or API key required.

## Editing the public profile

All public content lives in `src/content/site.ts`: identity, about, track record, experience,
business development approach, case studies, projects, skills, certifications and contact.
Anything in **[square brackets]** is a placeholder and is displayed as one — replace it with
verified information. Never add unverified achievements, logos or testimonials. The CV at
`/cv` is generated from the same content (Print / Save as PDF).

## Workspace configuration

The workspace core is industry-neutral. The `personal` profile (`src/lib/profile/personal`)
configures markets, target industries, buyer roles, needs, signals, business problems,
terminology and qualification weights. It starts empty.

## Configuration

`.env.example` (all optional): `ANTHROPIC_API_KEY` enables "Draft with Claude" for outreach
drafts (server-side; templates otherwise); `ANTHROPIC_MODEL` overrides the model;
`NEXT_PUBLIC_SUPABASE_*` are reserved for a future synced, login-protected workspace.

## Privacy

`/workspace` is `noindex` and, in local mode, stores data only in the browser. It is private
per device but not password-protected — add login (Supabase) before storing sensitive data.
Do not copy an employer's confidential CRM data into it. No scraping, bulk messaging or
credential handling.

## Docs

`docs/ARCHITECTURE.md` · `docs/ROADMAP.md` · `CLAUDE.md`.
