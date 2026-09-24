import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { EvidenceEntry } from "../types";
import { applyFilter, buildBackup, canApprove, capabilityGaps, cvDraft, cvMissing, funnelRatios, funnelTotals, NO_FILTER, parseBackup, roleType, strength, strongest } from "./logic";
import { starterContexts, starterEvidence } from "./seed";

const contexts = starterContexts();
const seed = starterEvidence();
const make = (over: Partial<EvidenceEntry>): EvidenceEntry => ({ ...seed[0], id: Math.random().toString(36), metricKey: null, value: null, result: "", ...over });

describe("starter data", () => {
  it("is private, self-recorded and not approved — nothing is auto-verified", () => {
    expect(seed).toHaveLength(5);
    for (const e of seed) {
      expect(e.status).toBe("Self-recorded");
      expect(e.confidentiality).toBe("Private");
      expect(e.approvedForPublic).toBe(false);
      expect(e.verificationSource).toBe("");
      expect(e.publicVersion).toBe("");
      expect(Object.values(e.star).every((v) => v === "")).toBe(true);
    }
  });

  it("keeps the verified statements verbatim and adds no invented dates", () => {
    expect(seed.map((e) => e.result)).toContain("Delivered +240% growth on Decancit.");
    expect(seed.filter((e) => e.date).map((e) => e.date)).toEqual(["2024"]);
  });

  it("separates the employer context from the role", () => {
    const apex = contexts.find((c) => c.id === "ctx-apex")!;
    expect(apex.roles.map((r) => r.title)).toEqual(["Medical Representative", "Senior Medical Representative", "Acting District Supervisor"]);
    expect(roleType(seed.find((e) => e.id === "ev-award")!, contexts)).toBe("Leadership");
    expect(roleType(seed[0], contexts)).toBe("Unspecified");
  });
});

describe("evidence strength (quality, not quantity)", () => {
  it("never lets activity outrank a supported, measurable achievement", () => {
    const activities = Array.from({ length: 10 }, () => make({ tier: "Activity", value: 50, status: "Verified" }));
    const achievement = make({ tier: "Achievement", value: 2, status: "Verified" });
    expect(strongest(activities)).not.toBe("Strong");
    expect(strength(achievement)).toBe("Strong");
  });

  it("does not treat a self-recorded achievement as strong", () => {
    expect(strength(seed[0])).toBe("Moderate");
    expect(strength(make({ tier: "Activity" }))).toBe("Weak");
  });
});

describe("analytics", () => {
  it("shows funnel ratios only when numerator and denominator exist", () => {
    const entries = [
      make({ metricKey: "accounts-researched", value: 50, tier: "Activity" }),
      make({ metricKey: "decision-makers-engaged", value: 15, tier: "Output" }),
      make({ metricKey: "qualified-opportunities", value: 5, tier: "Outcome" }),
    ];
    const ratios = funnelRatios(funnelTotals(entries));
    expect(ratios[0].rate).toBeCloseTo(0.3);
    expect(ratios[1].rate).toBeNull(); // positive responses not recorded
    expect(ratios[2].rate).toBeNull();
    expect(funnelTotals([])).toEqual({});
  });

  it("filters by current contexts and flags capabilities without strong evidence", () => {
    expect(applyFilter(seed, contexts, { ...NO_FILTER, scope: "current" })).toHaveLength(5);
    expect(applyFilter(seed, contexts, { ...NO_FILTER, scope: "ctx-sigma" })).toHaveLength(0);
    const gaps = capabilityGaps(seed).map((g) => g.capability);
    expect(gaps).toContain("Decision-maker engagement");
    expect(gaps).not.toContain("Product launch");
  });
});

describe("CV-ready and public firewall", () => {
  it("lists missing measurements instead of inventing them", () => {
    const missing = cvMissing(seed[0]);
    expect(missing).toEqual(expect.arrayContaining(["timeframe / date", "your specific contribution", "supporting evidence or verification source"]));
    expect(cvDraft(seed[0], contexts)).toBe("Achieved 400% of target on a pharmaceutical product launch. (Apex Pharma, Egypt)");
  });

  it("requires a public-safe version before approval", () => {
    expect(canApprove({ publicVersion: "" })).toBe(false);
    expect(canApprove({ publicVersion: "Converted a strategic GCC account into a new business opportunity." })).toBe(true);
  });

  it("never imports workspace or evidence code into the public site", () => {
    const files = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : [join(dir, f)]));
    const publicFiles = [...files("src/app/(site)"), ...files("src/content"), "src/components/site.tsx"];
    for (const f of publicFiles) expect(readFileSync(f, "utf8")).not.toMatch(/lib\/evidence|lib\/store|useData/);
  });
});

describe("backup", () => {
  it("round-trips a valid backup and rejects foreign or malformed files", () => {
    const ok = parseBackup(JSON.stringify(buildBackup(contexts, seed)));
    expect(ok.ok).toBe(true);
    expect(parseBackup("not json").ok).toBe(false);
    expect(parseBackup(JSON.stringify({ app: "other", kind: "career-evidence", version: 1 })).ok).toBe(false);
    const broken = buildBackup(contexts, [{ ...seed[0], contextId: "missing" }]);
    expect(parseBackup(JSON.stringify(broken)).ok).toBe(false);
  });
});
