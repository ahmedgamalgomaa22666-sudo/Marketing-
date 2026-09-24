import Anthropic from "@anthropic-ai/sdk";
import type { OutreachDraft, OutreachInput } from "../intelligence/outreach";
import { OUTREACH_SYSTEM_PROMPT, parseDraft, TemplateProvider, type AIProvider } from "./provider";

const DEFAULT_MODEL = "claude-opus-5";

/** Optional Claude provider. Server-only: imported solely by API routes, constructed only when ANTHROPIC_API_KEY is set. */
export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic" as const;
  private client = new Anthropic();
  private model = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;

  async draftOutreach(input: OutreachInput): Promise<OutreachDraft> {
    const response = await this.client.beta.messages.create({
      model: this.model,
      max_tokens: 2000,
      output_config: { effort: "low" },
      // Server-side refusal fallback — only on the default model, where it is supported.
      ...(this.model === DEFAULT_MODEL ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
      system: OUTREACH_SYSTEM_PROMPT,
      messages: [{ role: "user", content: describe(input) }],
    });
    if (response.stop_reason === "refusal") throw new Error("Model declined the request");
    const text = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("\n");
    if (!text.trim()) throw new Error("Empty response");
    return parseDraft(text, input);
  }
}

function describe(i: OutreachInput): string {
  return [
    `Message type: ${i.type}`,
    `Company: ${i.companyName} (${i.country})`,
    `Recipient: ${i.contactName}, ${i.contactTitle}`,
    `Business observation to verify: ${i.observation || "none"}`,
    `Relevant capability: ${i.capability}`,
    `Sales stage: ${i.stage}`,
    `Call to action: ${i.cta}`,
    `Sender name: ${i.senderName || "[Your name]"}`,
  ].join("\n");
}

export function getServerProvider(): AIProvider {
  return process.env.ANTHROPIC_API_KEY ? new AnthropicProvider() : new TemplateProvider();
}
