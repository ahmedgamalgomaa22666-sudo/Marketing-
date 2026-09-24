# Publication checklist — public platform

Everything below lives in `src/content/site.ts`. Items shown on the site as *[bracketed]*
placeholders must be replaced (or deleted) before deployment.

## Required before deployment
- [ ] Professional email — `person.email`
- [ ] LinkedIn URL — `person.linkedin`
- [ ] CV PDF — add the file to `public/` and set `person.cvFile` (e.g. `/Ahmed-Gamal-CV.pdf`)
- [ ] Location to display — `person.location` (e.g. "Cairo, Egypt · open to relocation to the UAE")
- [ ] Review wording of all five verified results — `results`

## Strongly recommended
- [ ] Apex Pharma promotion years: Senior Medical Representative, Acting District Supervisor
- [ ] Acting District Supervisor scope: team size and territory
- [ ] Pella Nova / Pella Group: scope and activities (2 lines)
- [ ] Bloom Business School (freelance): scope and activities (2 lines)
- [ ] Result context (optional, anonymise if needed): year, therapeutic area, period
- [ ] Which role each result belongs to (Apex Pharma / Sigma)
- [ ] Case studies: situation, approach and lesson for the three verified results
- [ ] Certification years; Marketing Professional Diploma issuer; graduation year

## Positioning checks
- [ ] 15+ years is described as commercial sales, not business development
- [ ] Business development roles are presented as current (2026–) work, not long tenure
- [ ] No unsupported adjectives ("results-driven", "dynamic", "passionate")
- [ ] No confidential employer or customer information

`npm test` enforces the last three automatically where possible.
