import { NextResponse } from "next/server";
import { getServerProvider } from "@/lib/ai/anthropic";
import { TemplateProvider } from "@/lib/ai/provider";
import { MESSAGE_TYPES, type OutreachInput } from "@/lib/intelligence/outreach";

const FIELDS = ["companyName", "country", "contactName", "contactTitle", "observation", "capability", "stage", "cta", "senderName"] as const;

function parse(body: unknown): OutreachInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (!MESSAGE_TYPES.some((t) => t.key === b.type)) return null;
  const out: Record<string, string> = { type: b.type as string };
  for (const f of FIELDS) {
    const v = b[f];
    if (v !== undefined && typeof v !== "string") return null;
    out[f] = ((v as string | undefined) ?? "").slice(0, 400);
  }
  return out as unknown as OutreachInput;
}

export async function POST(request: Request) {
  const input = parse(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const provider = getServerProvider();
  try {
    return NextResponse.json(await provider.draftOutreach(input));
  } catch (error) {
    // Never let an AI failure block the workflow: fall back to the deterministic template.
    console.error("AI provider failed, using template:", error instanceof Error ? error.message : error);
    const draft = await new TemplateProvider().draftOutreach(input);
    return NextResponse.json({ ...draft, checks: ["AI drafting was unavailable — showing the template draft.", ...draft.checks] });
  }
}
