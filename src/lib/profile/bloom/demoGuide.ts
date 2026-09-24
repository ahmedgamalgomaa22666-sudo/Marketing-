import type { DemoGuide } from "../types";
import { HERO_ACCOUNT_ID } from "./seed";

/** 5-minute executive demo path for the Bloom use case. */
export const BLOOM_DEMO_GUIDE: DemoGuide = {
  story: "“Our corporate BD should be systematic — prioritised accounts, mapped buyers, validated needs, disciplined follow-up. This is what that looks like.”",
  steps: [
  { title: "Open the dashboard", href: "/workspace", cta: "Dashboard", say: "This is how the BD team starts every day: pipeline, conversion and what needs doing today.", show: "KPI row, Today's priorities with overdue follow-ups." },
  { title: "See the GCC opportunity pipeline", href: "/workspace", cta: "Dashboard", say: "18 target accounts across the UAE and Saudi Arabia, with honest conversion rates at every stage.", show: "Funnel conversion, Pipeline by stage, Pipeline by market." },
  { title: "Open a high-potential company", href: `/workspace/accounts/${HERO_ACCOUNT_ID}`, cta: "Meridian Gulf Healthcare", say: "Meridian Gulf Healthcare — a fictional hospital group expanding into KSA.", show: "Header: fit score, stage, priority." },
  { title: "Show why it scores highly", href: `/workspace/accounts/${HERO_ACCOUNT_ID}?tab=overview`, cta: "Fit score", say: "No black box. Six weighted dimensions, each with its reasons — and the risks we still need to close.", show: "Score breakdown, 'Why it scores', 'Risks & unknowns'. Mention weights are configurable in Settings." },
  { title: "Show the stakeholder map", href: `/workspace/accounts/${HERO_ACCOUNT_ID}?tab=stakeholders`, cta: "Stakeholders", say: "Corporate learning is a group decision. We map who decides, who champions and who is missing.", show: "Decision maker vs champion, coverage gap: procurement unknown." },
  { title: "Show the Account Intelligence Brief", href: `/workspace/accounts/${HERO_ACCOUNT_ID}?tab=brief`, cta: "Brief", say: "A one-page call-prep brief. Everything inferred is labelled as a hypothesis to validate — we never pretend a guess is a fact.", show: "Priorities and capability gaps as hypotheses, discovery questions, objections, next action." },
  { title: "Run the Training Opportunity Mapper", href: `/workspace/mapper?account=${HERO_ACCOUNT_ID}`, cta: "Mapper", say: "Now we translate the business problem into capability needs.", show: "Step 1 is pre-filled from the account's signals. Click Next to Step 2 — capability gaps." },
  { title: "Match the problem to a Bloom capability", href: `/workspace/mapper?account=${HERO_ACCOUNT_ID}`, cta: "Mapper", say: "The gaps are matched against Bloom's programme catalogue — here, clearly labelled DEMO placeholders until the real catalogue is added.", show: "Step 3 fit %, Step 4 business case. Tick the validation box." },
  { title: "Show outreach preparation", href: `/workspace/outreach?account=${HERO_ACCOUNT_ID}&contact=con-2`, cta: "Outreach", say: "A short, human draft with a clear business reason. The system never sends anything — a person reviews every word.", show: "Switch between LinkedIn / Email / Meeting follow-up; 'Before you send' checks." },
  { title: "Create the opportunity", href: `/workspace/mapper?account=${HERO_ACCOUNT_ID}`, cta: "Mapper → Create opportunity", say: "Once validated, the business case becomes a tracked opportunity with a dated next step.", show: "In Step 4 click 'Create opportunity' → Save. You land on the Deal Coach for the new deal." },
  { title: "Show the next action on the dashboard", href: "/workspace", cta: "Dashboard", say: "The next step is now in the follow-up system — nothing falls through the cracks.", show: "Account stage moved to Qualified; the new next step appears under Follow-ups (upcoming) and in Recent activity once done." },
  ],
};
