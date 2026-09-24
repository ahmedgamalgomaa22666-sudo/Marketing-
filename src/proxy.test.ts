import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { config, isBlocked, isPrivatePath, proxy } from "./proxy";

const PRIVATE = ["/workspace", "/workspace/pipeline", "/workspace/accounts", "/workspace/opportunities", "/workspace/settings", "/api/ai/status", "/api/ai/outreach"];
const PUBLIC = ["/", "/cv", "/projects/bd-operating-system", "/workspaces", "/api/aid", "/_next/static/chunk.js"];

const run = (path: string) => proxy(new NextRequest(new URL(path, "https://example.com")));

afterEach(() => vi.unstubAllEnvs());

describe("production route guard", () => {
  it("blocks every private workspace and AI route in production with a 404", () => {
    vi.stubEnv("NODE_ENV", "production");
    for (const path of PRIVATE) {
      const res = run(path);
      expect(res.status, path).toBe(404);
      expect(res.headers.get("x-middleware-rewrite"), path).toContain("/__not-found");
    }
  });

  it("also blocks trailing-slash, nested, mixed-case and encoded variants", () => {
    for (const path of ["/workspace/", "/workspace/accounts/acc-1", "/WORKSPACE", "/%77orkspace", "/workspace/%E0%A4%A", "/api/ai", "/api/ai/"]) {
      expect(isBlocked(path, "production"), path).toBe(true);
    }
  });

  it("leaves public routes untouched in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    for (const path of PUBLIC) {
      expect(isPrivatePath(path), path).toBe(false);
      const res = run(path);
      expect(res.status, path).toBe(200);
      expect(res.headers.get("x-middleware-rewrite"), path).toBeNull();
    }
  });

  it("keeps the workspace fully usable locally (npm run dev)", () => {
    vi.stubEnv("NODE_ENV", "development");
    for (const path of PRIVATE) {
      expect(isBlocked(path), path).toBe(false);
      expect(run(path).headers.get("x-middleware-rewrite"), path).toBeNull();
    }
  });

  it("only runs on the private paths", () => {
    expect(config.matcher).toEqual(["/workspace", "/workspace/:path*", "/api/ai", "/api/ai/:path*"]);
  });
});
