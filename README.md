# AHMED GAMAL — International Business Development

The personal professional platform of **Ahmed Gamal El-Din Gomaa**:
Commercial Growth · B2B Business Development · Consultative Selling · GCC Markets.

Two sides of one product:

1. **Public professional platform** (`/`) — for UAE/GCC recruiters, founders, CEOs and
   commercial leaders: about, track record, experience, skills, case studies, proof of work,
   certifications, printable CV and contact.
2. **Private BD Operating System** (`/workspace`) — the owner's personal BD workspace,
   portable across employers and markets: accounts → contacts → qualification → stakeholder
   mapping → discovery → opportunities → pipeline → activities → follow-ups → next best
   action → analytics. It produces measurable BD performance data for CVs and interviews.

The platform does not depend on any employer or client. Companies (e.g. a past or future
employer) exist only as workspace profiles or accounts inside the private workspace.

> Public site content lives in `src/content/site.ts`. Anything in **[square brackets]** is a
> placeholder, shown visibly as one — replace it with verified information before sharing.
> No achievements, logos or testimonials are invented.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000  (site)  ·  /workspace  (BD system)
```

No environment variables, database or API key required.

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Editing your public profile

| What | Where |
|---|---|
| Name, headline, summary, contact | `person` in `src/content/site.ts` |
| Track record, experience, skills, case studies, certifications | same file |
| Projects (incl. the BD Operating System) | `projects` in the same file |
| CV | generated at `/cv` from the same content — Print / Save as PDF |

## BD Operating System: core + workspace profiles

The core is industry-neutral. A **workspace profile** (`src/lib/profile/<id>`) configures it
for one company: markets, industries, ideal customer profile, buyer roles, qualification
labels and weights, needs catalogue, signals, playbooks, terminology, outreach audience and
optional module labels (e.g. Bloom's *Training Opportunity Mapper*).

| Profile | Purpose |
|---|---|
| `generic` — Personal BD Workspace (**default**) | Your own BD work in any B2B market. Starts empty. |
| `bloom` — Sample: Bloom Business School | Optional sample use case with fictional data (corporate training, UAE & KSA). Not linked from the public site. |

Switch profiles in **Workspace → Settings**. Each profile keeps its own data (browser
localStorage). Add a company by copying `profiles/generic` and registering it in
`src/lib/profile/index.ts`. See `docs/ARCHITECTURE.md`.

## Guided demo (optional sample workspace)

Open `/workspace/demo` (sidebar → **Guided demo**), switch to the sample workspace, and click **Reset demo data first**.

1. **Dashboard** — pipeline KPIs and *Today's priorities* (overdue follow-ups highlighted).
2. **Pipeline** — funnel conversion, pipeline by stage and by market ("—" = no data, never faked).
3. **Open Meridian Gulf Healthcare** from *Highest-priority target accounts*.
4. **Why it scores highly** — six dimensions with reasons and risks.
5. **Stakeholder map** — decision maker, champion, influencer; procurement gap flagged.
6. **Intelligence brief** — needs labelled *Hypothesis*; questions, objections, next action.
7. **Training Opportunity Mapper** — Step 1 pre-filled from the account's signals.
8. **Match to a Bloom programme** — fit %, then the business case; tick *I have reviewed…*.
9. **Outreach preparation** — short human drafts; nothing is ever sent.
10. **Create opportunity → Save** — lands on the Deal Coach; account moves to *Qualified*.
11. **Dashboard / Follow-ups** — the dated next step is now tracked.

## Configuration

`.env.example` (all optional): `ANTHROPIC_API_KEY` enables "Draft with Claude" on the
outreach page (server-side only; falls back to templates); `ANTHROPIC_MODEL` overrides the
model; `NEXT_PUBLIC_SUPABASE_*` are reserved for the Supabase adapter.

## Deployment (Vercel)

Import the GitHub repo in Vercel (Next.js preset, default settings) → Deploy. Optionally add
`ANTHROPIC_API_KEY`. Any Node 20+ host works: `npm run build && npm start`.

## Privacy

`/workspace` is `noindex` and, in local mode, stores data only in your browser — it is private
per device, not password-protected. Move to the Supabase adapter (auth + RLS) before storing
real client data. No scraping, bulk messaging or credential handling anywhere.

## Docs

`docs/PRODUCT_SPEC.md` (Bloom use-case spec) · `docs/ARCHITECTURE.md` · `docs/ROADMAP.md` ·
`CLAUDE.md` · earlier static pages archived (not served) in `docs/archive-marketing-site/`.
