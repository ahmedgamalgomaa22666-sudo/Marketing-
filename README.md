# Bloom GCC Corporate Growth Engine

An internal **Business Development operating system** for Bloom Business School's corporate
learning and executive education sales in the **UAE and Saudi Arabia**.

It helps a BD team answer, account by account: *Which companies should we prioritise? Who
decides? What problem might exist? What should we ask? Which Bloom solution fits? What is the
next best action — and how is BD performing?*

> **Demo data — not actual Bloom customer information.** All companies, people and activities
> are fictional. Programmes are labelled `DEMO —` placeholders. No monetary values are
> invented.

It is deliberately **not** a generic CRM, a chatbot, a scraper or a mass-messaging tool.

## Features

| Module | What it does |
|---|---|
| Executive Dashboard | Pipeline KPIs, funnel conversion, pipeline by stage and market, today's priorities, overdue follow-ups, high-priority accounts with no next action, recent activity, commercial metrics |
| Target Accounts | Search, filter (market, industry, stage, priority), sort, create/edit/delete |
| Account Fit Score | Transparent 0–100 score over six weighted dimensions, with reasons and risks; weights configurable |
| Stakeholder Map | Buying group by role (decision maker, champion, influencer, procurement…) with coverage gaps |
| Account Intelligence Brief | Context, hypotheses, capability gaps, sales angle, discovery questions, objections, next action, solution match — printable |
| Training Opportunity Mapper | Business situation → capability gap → programme match → business case, with explicit human validation |
| Deal Coach | Known vs unknown, risks, 5 discovery + 3 follow-up questions, 3 objections with approaches, next step |
| Outreach Preparation | LinkedIn, email, follow-up, meeting follow-up and re-engagement drafts for human review — never sent |
| Opportunities | Stage board and detail pages; value/probability optional |
| Follow-ups | Overdue / today / upcoming / completed; log activity and schedule the next action in one step |
| Programmes & Settings | Editable catalogue, score weights, demo reset, empty workspace |

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

No environment variables, database or API key are needed. The app runs in **local demo
mode**: data is seeded into the browser's localStorage and each browser is its own sandbox.

Quality checks:

```bash
npm run lint
npm run typecheck
npm test           # unit tests for scoring, funnel, mapper, brief, deal coach, outreach
npm run build
```

## 5-Minute Executive Demo

Open **Executive demo** in the sidebar (`/demo`) for a clickable version of this script.
Click **Reset demo data first** so "today" and "overdue" are fresh.

1. **Dashboard** (`/`) — "This is how the BD team starts every day." Point to the KPI row and
   *Today's priorities* (overdue follow-ups are highlighted).
2. **GCC pipeline** — *Funnel conversion*, *Pipeline by stage* and *Pipeline by market*. Rates
   show "—" when there is no data; nothing is fabricated.
3. **Open a high-potential company** — click **Meridian Gulf Healthcare** in *Highest-priority
   target accounts*.
4. **Why it scores highly** — *Overview & score*: six dimensions, "Why it scores" and "Risks &
   unknowns" (procurement unknown, decision maker not yet engaged).
5. **Stakeholder map** — decision maker, champion, influencer; the coverage gap is flagged.
6. **Intelligence brief** — every inferred need is labelled *Hypothesis*; discovery questions,
   objections, next action and solution match.
7. **Run the Training Opportunity Mapper** — click **Map opportunity**. Step 1 is pre-filled
   from the account's signals → **Next**: capability gaps.
8. **Match to a Bloom capability** — Step 3 shows programme fit (DEMO placeholders) → Step 4
   business case. Tick *I have reviewed this recommendation*.
9. **Outreach preparation** — (optional detour) *Prepare outreach from this case* shows a short,
   human LinkedIn draft and the "Before you send" checklist. Nothing is sent.
10. **Create the opportunity** — back in Step 4 click **Create opportunity → Save**. You land on
    the **Deal Coach** for the new deal; the account moves to *Qualified*.
11. **Next action in the dashboard** — the dated next step is now in **Follow-ups → Upcoming**
    and the account no longer lacks a next action.

Closing line: *"The technology supports the commercial process — prioritise, map, validate,
follow up, measure."*

## Architecture

- **Next.js 16 (App Router) + TypeScript + Tailwind v4**, no component or chart library.
- **Pure business logic** in `src/lib` (scoring, analytics, intelligence), unit-tested.
- **`DataStore` interface** — `LocalStore` (localStorage) today; `supabase/schema.sql` is ready
  for a `SupabaseStore` adapter.
- **`AIProvider`** — deterministic templates by default (free). If `ANTHROPIC_API_KEY` is set,
  the server route `/api/ai/outreach` can draft outreach with Claude; failures fall back to
  templates. Keys never reach the browser.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md)
and [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Configuration

Copy `.env.example` to `.env.local` (never commit it). All variables are optional:

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Enables "Draft with Claude" on the outreach page |
| `ANTHROPIC_MODEL` | Optional model override (default `claude-opus-5`) |
| `NEXT_PUBLIC_SUPABASE_*` | Reserved for the Phase 2 Supabase adapter |

Pipeline stages, industries, signals, capabilities, market attractiveness and default score
weights live in `src/lib/config.ts`.

## Deployment (Vercel)

1. Push the repository to GitHub.
2. In Vercel: **Add New → Project**, import the repo. Framework preset: Next.js (defaults are
   fine).
3. Optionally add `ANTHROPIC_API_KEY` under **Settings → Environment Variables**.
4. Deploy. Each visitor's browser holds its own demo workspace.

Any Node 20+ host works: `npm run build && npm start`.

## Privacy & security

- Store only legitimately obtained business contact details; contacts can be edited or deleted.
- No LinkedIn scraping, email harvesting, credential collection or automated sending.
- Local mode keeps data in the browser. Move to the authenticated Supabase adapter before
  storing real client data.

## Other content

`public/marketing-site/` holds the earlier static marketing pages (including the Bloom
marketing plan), served unchanged at `/marketing-site/index.html`.
