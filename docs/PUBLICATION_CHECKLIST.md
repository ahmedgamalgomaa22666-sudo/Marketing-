# Publication checklist — public platform

All public content lives in `src/content/site.ts`. Unverified fields are `null` and are
**hidden** on the site (no placeholder text is ever shown). Fill a field in and it appears.
`npm test` blocks placeholder text, generic adjectives, "15+ years of BD", BD revenue claims,
changed result wording and a UAE-based location.

## Verified and published
- [x] Name, positioning, intro, location ("Egypt · Open to UAE & GCC Opportunities")
- [x] Apex Pharma 2011–present: Medical Representative 2011–2016, Senior Medical Representative 2016–2024, Acting District Supervisor 2024–present
- [x] Sigma Pharmaceutical Company 2010–2011: Medical Sales Representative
- [x] Pella Nova / Pella Group 2026–present: Remote Sales Specialist (conservative scope, no revenue claims)
- [x] Bloom Business School 2026–present: Freelance Business Developer (conservative scope, no revenue claims)
- [x] Five verified results, attributed to Apex Pharma, in the exact wording supplied
- [x] B.Sc. Pharmaceutical Sciences, Minia University
- [x] Four certifications (names; issuers only where verified)
- [x] Three case studies — verified foundation and result only

## Required before deployment
- [x] `person.email` — professional email
- [x] `person.linkedin` — LinkedIn URL
- [x] `person.cvFile` — final approved CV at `public/Ahmed-Gamal-CV.pdf` (phone number appears only inside the PDF, never on the site)

## Optional — hidden until provided
- [ ] Acting District Supervisor: team size, territory (add to Apex Pharma `points`)
- [ ] Case study 1 (launch, 400%): situation · actions · lessons
- [ ] Case study 2 (Eraloner, #1 Minya & Fayoum): situation · actions · lessons
- [ ] Case study 3 (Decancit, +240%): situation · actions · lessons
- [ ] Certification years (all four); Marketing Professional Diploma issuer
- [ ] Graduation year (Minia University)
- [ ] Sigma Pharmaceutical Company: territory / portfolio point

## Before going live
- [ ] Read the site end to end on desktop and mobile
- [ ] Decide on a domain; deploy (Vercel)
- [ ] Align LinkedIn headline and About with the site
