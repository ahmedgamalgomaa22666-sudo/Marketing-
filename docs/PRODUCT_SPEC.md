# Product Spec — Bloom GCC Corporate Growth Engine

## 1. Problem

Bloom sells corporate learning, executive education and leadership development to
organisations in the UAE and Saudi Arabia. Corporate B2B sales are slow, multi-stakeholder
and consultative. Without a system, BD work drifts into ad-hoc outreach: no shared view of
which accounts matter most, who the buyers are, what problem Bloom would solve, or what the
next action is.

## 2. Product goal

An internal **Business Development operating system** that helps a Bloom BD team:

1. Prioritise corporate accounts with a transparent fit score.
2. Map the stakeholders in each buying group.
3. Form (and label) hypotheses about business problems and capability gaps.
4. Translate problems into Bloom solutions and a business case.
5. Prepare discovery calls, objection handling and human-reviewed outreach.
6. Run a disciplined pipeline with next actions and follow-ups.
7. Measure BD performance with honest funnel metrics.

It is **not** a generic CRM, a chatbot, a scraping tool or a mass-messaging tool.

## 3. Users

| User | Needs |
|---|---|
| BD Executive / Account Manager | Daily priorities, account prep, outreach drafts, logging activity |
| BD Manager / Head of Corporate Sales | Pipeline health, conversion, follow-up discipline, account coverage |
| Bloom owner / leadership | A 5-minute view of GCC corporate opportunity and BD rigour |

## 4. Modules (MVP)

| # | Module | Key outcome |
|---|---|---|
| 1 | Executive Dashboard | KPIs, funnel conversion, pipeline by stage/country, today's priorities, overdue follow-ups, high-priority accounts with no next action, recent activity |
| 2 | Target Account Database | Search, filter (country, industry, stage, priority), sort; create/edit/delete |
| 3 | Account Fit Score | 0–100, six weighted dimensions, reasons + risks per account, configurable weights |
| 4 | Stakeholder Mapping | Contacts per account with buying role; map grouped by role; edit/delete |
| 5 | Account Intelligence Brief | Overview, context, priorities, capability gaps (as hypotheses), stakeholders, angle, questions, objections, next action, solution match |
| 6 | Training Opportunity Mapper | 4-step guided flow: situation → capability gaps → programme match → business case; user must validate |
| 7 | Deal Coach | Known vs unknown, risks, 5 discovery + 3 follow-up questions, 3 objections with response approaches, next action |
| 8 | Outreach Preparation | 5 message types, drafts for human review, never auto-sent |
| 9 | Opportunity Management | Opportunity record with optional value, stakeholders, next step, activity history |
| 10 | Activity & Follow-up | Log activities, plan next actions, overdue/today/completed views |

Also: editable **Programme catalogue** (seeded with DEMO placeholders), **Settings** (score
weights, reset demo data), and a **guided Executive Demo** page.

## 5. Business rules

- **No invented Bloom data.** Programmes are seeded as `DEMO — …` placeholders; accounts,
  contacts and activities are fictional and labelled *"Demo data — not actual Bloom customer
  information"* throughout the UI.
- **No fake money.** Opportunity value is optional and empty in the demo dataset.
- **Hypotheses are labelled.** Anything inferred (needs, priorities, gaps) is prefixed
  *Hypothesis* and phrased as something to validate.
- **Human in the loop.** Recommendations must be validated by the user; outreach is drafted,
  never sent.
- **No fabricated metrics.** A rate with a zero denominator shows "—", not 0% or a guess.
- **Privacy.** Contacts are legitimately obtained; they can be edited and deleted. No
  scraping, no credential collection, no bulk messaging.

## 6. Account Fit Score

| Dimension | Default weight | Source |
|---|---|---|
| Market Fit | 20 | Country + industry attractiveness table (derived) |
| Company Potential | 20 | Workforce size band (derived) |
| Training Need | 20 | BD rating 0–5 (evidence-based judgement) |
| Stakeholder Access | 15 | Contacts: L&D/HR buyer, decision maker, champion (derived) |
| Strategic Relevance | 15 | BD rating 0–5 (flagship potential, GCC expansion, reference value) |
| Engagement | 10 | Pipeline stage reached + recent completed activity (derived) |

Each dimension returns points and plain-language reasons (strengths) and risks. Weights
are editable in Settings and are normalised to 100.

## 7. Pipeline

Account stages: Target → Researching → Contacted → Engaged → Qualified → Meeting →
Proposal → Negotiation → Won, plus Lost and Nurture. Each account keeps a `highestStage`, so
funnel conversion stays correct after an account is Lost or moved to Nurture.

Opportunity stages are the commercial subset (Qualified → Won/Lost). Advancing an
opportunity advances its account's stage if the opportunity is further along.

## 8. Metrics (defined only when the data exists)

| Metric | Definition |
|---|---|
| Response rate | Completed outbound touches with a response ÷ completed outbound touches with an outcome recorded |
| Engagement rate | Accounts reaching Engaged ÷ reaching Contacted |
| Qualification rate | Qualified ÷ Engaged |
| Meeting conversion | Meeting ÷ Qualified |
| Proposal conversion | Proposal ÷ Meeting |
| Win rate | Won ÷ (Won + Lost among accounts that reached Proposal) |

## 9. Assumptions

- Single BD team, small number of users; authentication arrives with the Supabase adapter.
- English UI first; Arabic/RTL is a roadmap item.
- Bloom's real programme catalogue, pricing and customer data are not available; the
  system is configurable once they are.
- Account sizes are expressed in employee bands, not revenue.

## 10. Out of scope (MVP)

Email/calendar sync, LinkedIn automation, enrichment APIs, quoting/invoicing, multi-tenant
admin, mobile apps.
