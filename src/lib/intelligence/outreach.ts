export const MESSAGE_TYPES = [
  { key: "linkedin", label: "LinkedIn opening" },
  { key: "email", label: "Email opening" },
  { key: "follow-up", label: "Follow-up" },
  { key: "meeting-follow-up", label: "Meeting follow-up" },
  { key: "re-engagement", label: "Re-engagement" },
] as const;

export type MessageType = (typeof MESSAGE_TYPES)[number]["key"];

export interface OutreachInput {
  type: MessageType;
  companyName: string;
  country: string;
  contactName: string;
  contactTitle: string;
  /** Short observation, e.g. "expanding into new GCC markets". Must be verified by the user. */
  observation: string;
  capability: string;
  stage: string;
  cta: string;
  senderName: string;
}

export interface OutreachDraft {
  subject: string | null;
  body: string;
  source: "template" | "claude";
  checks: string[];
}

export const CTA_OPTIONS = [
  "a 20-minute conversation",
  "a short call to compare notes",
  "sharing a one-page overview",
  "a meeting with your leadership team",
];

/** Phrases the drafts must never contain. Used by the template and to check AI output. */
export const BANNED_PHRASES = ["hope this message finds you well", "hope you are well", "i came across your profile", "i was impressed", "synergy", "revolutionary", "game-changer", "act now", "limited time"];

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

/** Deterministic drafts: short, specific, consultative — for human review, never auto-sent. */
export function templateDraft(i: OutreachInput): OutreachDraft {
  const hi = `Hi ${firstName(i.contactName)},`;
  const cap = i.capability.toLowerCase();
  const obs = i.observation.trim();
  const sign = i.senderName || "[Your name]";
  let subject: string | null = null;
  let body: string;

  switch (i.type) {
    case "linkedin":
      body = `${hi} I work with HR and L&D leaders in ${i.country} on ${cap}. ${obs ? `I understand ${i.companyName} is ${obs} — ` : ""}I'm curious how you're approaching ${cap} as that happens. Open to ${i.cta}?`;
      break;
    case "email":
      subject = `${capitalise(cap)} at ${i.companyName}`;
      body = [
        hi,
        obs
          ? `I understand ${i.companyName} is ${obs}. In organisations going through that, we often see ${cap} become a pressure point for managers.`
          : `I'm reaching out because ${cap} is a recurring priority for ${i.contactTitle ? `${i.contactTitle}s` : "HR and L&D leaders"} we speak with in ${i.country}.`,
        "I don't know yet whether that's true for you — which is why I'd value your perspective.",
        `Would you be open to ${i.cta}?`,
        `Best regards,\n${sign}\nBloom Business School`,
      ].join("\n\n");
      break;
    case "follow-up":
      subject = `Re: ${capitalise(cap)} at ${i.companyName}`;
      body = [
        hi,
        `A quick follow-up on my earlier note about ${cap}. One question that might be useful either way: how are managers currently supported when their teams change quickly?`,
        `If it's not a priority right now, just let me know and I'll not take more of your time. Otherwise, ${i.cta} could be a good start.`,
        `Best,\n${sign}`,
      ].join("\n\n");
      break;
    case "meeting-follow-up":
      subject = `Summary of our conversation — ${i.companyName}`;
      body = [
        hi,
        "Thank you for your time today. To make sure I captured it correctly:",
        `• What we heard: [confirm the challenge in their words]\n• Capability focus: ${cap}\n• Who it affects: [target group]\n• What success would look like: [measure agreed]`,
        `Please correct anything I've missed. As a next step, I suggested ${i.cta} — does [date] work?`,
        `Best regards,\n${sign}`,
      ].join("\n\n");
      break;
    case "re-engagement":
      subject = `${i.companyName} — checking in on ${cap}`;
      body = [
        hi,
        `We last spoke a while ago about ${cap}. ${obs ? `With ${i.companyName} ${obs}, ` : ""}I wondered whether priorities have shifted since then.`,
        `If the timing is better now, I'd be glad to arrange ${i.cta}. If not, no problem at all.`,
        `Best,\n${sign}`,
      ].join("\n\n");
      break;
  }
  return { subject, body, source: "template", checks: reviewChecks(i, body) };
}

export function reviewChecks(i: OutreachInput, body: string): string[] {
  const checks = ["Review and edit before sending — this is a draft, not a sent message."];
  if (i.observation) checks.push(`Verify that "${i.observation}" is accurate and from a legitimate source.`);
  const lower = body.toLowerCase();
  const found = BANNED_PHRASES.filter((p) => lower.includes(p));
  if (found.length) checks.push(`Remove generic phrasing: ${found.join(", ")}.`);
  if (i.type === "linkedin" && body.length > 300) checks.push(`LinkedIn connection notes are limited to ~300 characters (currently ${body.length}).`);
  if (body.includes("[")) checks.push("Fill in the [bracketed] placeholders.");
  return checks;
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
