import { DEFAULT_WEIGHTS } from "../config";
import { nowStamp, todayISO } from "../dates";
import { starterContexts, starterEvidence } from "../evidence/seed";
import type { WorkspaceProfile } from "../profile/types";
import type { Database, User } from "../types";

/** Bump when the stored shape changes; older local data is replaced with a fresh workspace. */
export const SCHEMA_VERSION = 3;

export const DEFAULT_USERS = (): User[] => [{ id: "u-me", name: "Ahmed Gamal", role: "International Business Development", createdAt: nowStamp(), updatedAt: nowStamp() }];

/** A fresh, empty workspace for a profile: its starter offerings and default weights only. */
export function emptyDatabase(profile: WorkspaceProfile, users: User[] = DEFAULT_USERS()): Database {
  const stamp = nowStamp();
  return {
    version: SCHEMA_VERSION,
    profileId: profile.id,
    seededAt: todayISO(),
    users,
    accounts: [],
    accountScores: [],
    contacts: [],
    opportunities: [],
    activities: [],
    programmes: profile.starterOfferings().map((o) => ({ ...o, createdAt: stamp, updatedAt: stamp })),
    recommendations: [],
    careerContexts: starterContexts(),
    evidence: starterEvidence(),
    settings: { weights: { ...(profile.qualification.weights ?? DEFAULT_WEIGHTS) } },
  };
}
