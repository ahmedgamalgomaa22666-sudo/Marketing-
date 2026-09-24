import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Reports which provider is active — never the key itself. */
export function GET() {
  return NextResponse.json({ provider: process.env.ANTHROPIC_API_KEY ? "anthropic" : "template" });
}
