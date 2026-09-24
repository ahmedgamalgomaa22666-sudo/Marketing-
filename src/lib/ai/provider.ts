import { reviewChecks, templateDraft, type OutreachDraft, type OutreachInput } from "../intelligence/outreach";

/**
 * AIProvider abstraction. The base product never requires a paid API: TemplateProvider is
 * deterministic and free. Other providers (Anthropic today; OpenAI or others later) are
 * optional enhancers selected on the server from environment variables.
 */
export interface AIProvider {
  readonly name: "template" | "anthropic";
  draftOutreach(input: OutreachInput): Promise<OutreachDraft>;
}

export class TemplateProvider implements AIProvider {
  readonly name = "template" as const;
  async draftOutreach(input: OutreachInput): Promise<OutreachDraft> {
    return templateDraft(input);
  }
}

export const OUTREACH_SYSTEM_PROMPT = `You draft short B2B outreach messages for a business development professional. The sender's organisation and target audience are given in the request. A human will review and edit every draft before anything is sent.

Write like a thoughtful consultant, not a marketer:
- Lead with a clear, specific business reason for reaching out, then a genuine question.
- Keep it short: LinkedIn under 300 characters; emails under 120 words.
- Treat the business observation as something to check, not a known fact about the reader.
- Never open with "I hope this message finds you well" or similar; no generic praise, flattery, hype, urgency, or invented details (no made-up results, clients, programmes or prices).
- One soft call to action, taken from the input.
- If a subject line is useful (email types), put it on the first line as "Subject: ...", then a blank line, then the body.`;

/** Parses "Subject: …" off the first line if present. */
export function parseDraft(text: string, input: OutreachInput): OutreachDraft {
  const trimmed = text.trim();
  const match = trimmed.match(/^Subject:\s*(.+)\n+/i);
  const subject = match ? match[1].trim() : null;
  const body = match ? trimmed.slice(match[0].length).trim() : trimmed;
  return { subject, body, source: "claude", checks: reviewChecks(input, body) };
}
