# Roadmap — AHMED GAMAL · Personal Commercial & Business Development Platform

## Product hierarchy

**AHMED GAMAL — Personal Commercial & Business Development Platform** is the product.
The private **BD Intelligence Workspace** is a feature inside it.

Priorities, in order:
1. Increase professional market value.
2. Strengthen positioning for UAE / GCC business development opportunities.
3. Show verified commercial evidence.
4. Build proof of work.
5. Use the private workspace to become a stronger BD professional over time.

## Public / private rule

```
PRIVATE BD INTELLIGENCE ──(manual · anonymised · approved)──▶ PUBLIC PLATFORM
 contexts · accounts · learning           Evidence Log              site · CV · case studies
```

- The public site is built only from `src/content/site.ts`. It never reads workspace data.
- Only verified, anonymised, manually approved Evidence Log entries may become public evidence.
- Archived employer contexts are kept for career analytics but never exposed publicly.
- Employer CRMs (Bitrix, Salesforce, HubSpot…) remain the system of record. No CRM import, no
  bulk export, no copying of confidential customer data; contact email/phone off by default.

## Roadmap (career value first)

| # | Step | Side | Status |
|---|---|---|---|
| 1 | Public platform with verified content — positioning, track record, experience, BD approach, case studies, Commercial Lab, skills, certifications, CV, contact | Public | **Built** — awaiting remaining details (see `docs/PUBLICATION_CHECKLIST.md`) |
| 2 | Deploy on a personal domain; align LinkedIn with the site | Public | Next, after step 1 details |
| 3 | Company Context — editable current company, industry, markets, products/services, ICP, buyer personas, segments, methodology, qualification criteria; industry templates (Training, SaaS, Healthcare, Pharma, Medical Devices, Consulting); archive contexts on employer change; privacy defaults | Private | Planned |
| 4 | Evidence Log + career analytics (private detail + public-safe version + approval flag) | Bridge | Planned |
| 5 | Learning layer — win/loss learning, objection library, commercial notes, market research | Private | Planned |
| 6 | Light methodology — Consultative Selling (default), SPIN, BANT, MEDDICC, Challenger, Custom as discovery/qualification prompts only | Private | Planned |
| 7 | Case studies completed from approved evidence | Public | Planned |

## Explicitly not planned
CRM clone, company sales-management, employee management, billing, mass email, LinkedIn
scraping, bulk CRM import, complex multi-tenancy, invented achievements or testimonials.
