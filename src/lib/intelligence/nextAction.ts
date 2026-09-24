import { overdue } from "../analytics";
import { todayISO } from "../dates";
import type { Account, Activity, Contact } from "../types";
import type { WorkspaceProfile } from "../profile/types";
import { isBuyerFunction } from "../scoring";
import { firstName } from "./outreach";

export interface NextAction {
  action: string;
  reason: string;
}

/** Deterministic "next best action" for an account — a suggestion, never an instruction. */
export function recommendNextAction(profile: WorkspaceProfile, account: Account, contacts: Contact[], activities: Activity[], today: string = todayISO()): NextAction {
  const late = overdue(activities.filter((a) => a.accountId === account.id), today)[0];
  if (late) return { action: `Complete the overdue action: ${late.summary}`, reason: "A committed follow-up is past due — momentum and credibility are at risk." };

  // Prefer the working-level champion in the buying function over senior sponsors for day-to-day actions.
  const isBuyer = (c: Contact) => isBuyerFunction(c, profile);
  const hr = contacts.find((c) => c.role === "Champion" && isBuyer(c)) ?? contacts.find((c) => c.role === "Champion") ?? contacts.find(isBuyer);
  const dm = contacts.find((c) => c.role === "Decision Maker");
  const lead = hr ? firstName(hr.name) : `the ${profile.buyerFunction.label} lead`;

  if (contacts.length === 0 && !["Won", "Lost"].includes(account.stage)) {
    return { action: `Map the buying group: identify the ${profile.buyerFunction.label} lead and the budget holder.`, reason: "No stakeholders are recorded, so outreach would be untargeted." };
  }

  switch (account.stage) {
    case "Target":
    case "Researching":
      return { action: `Validate the top hypothesis, then send ${lead} a short, relevance-led first message.`, reason: "Research stage — the aim is a first two-way conversation, not a pitch." };
    case "Contacted":
      return { action: `Follow up with ${lead} using a different angle or channel.`, reason: "Contact made but no two-way engagement yet." };
    case "Engaged":
      return { action: `Book a 30-minute discovery call with ${lead} to validate the business problem.`, reason: "Engagement exists; qualification needs a confirmed problem, sponsor and timing." };
    case "Qualified":
      return dm
        ? { action: `Run the ${profile.modules.opportunityMapper.title} and propose a meeting with ${dm.name}.`, reason: "Qualified — align the need and success measures with the decision maker." }
        : { action: "Identify and get introduced to the decision maker.", reason: "Qualified but single-threaded without a decision maker." };
    case "Meeting":
      return { action: "Send a meeting recap confirming the problem, audience and success measures; agree proposal scope.", reason: "A written recap turns a good meeting into a shared commitment." };
    case "Proposal":
      return { action: "Follow up on the proposal and confirm the decision process, timing and procurement steps.", reason: "Proposals stall without a clear decision path." };
    case "Negotiation":
      return { action: "Resolve open commercial terms and confirm the start date and participants.", reason: "Close to decision — remove remaining blockers." };
    case "Won":
      return { action: "Plan the delivery kick-off and agree how impact will be measured.", reason: "Delivery quality creates references and expansion." };
    case "Lost":
      return { action: "Record the loss reason and set a nurture check-in in 90 days.", reason: "Loss analysis improves targeting; timing often changes." };
    case "Nurture":
      return { action: `Share a relevant insight with ${lead} and re-check timing.`, reason: "Stay useful until the timing is right." };
  }
}
