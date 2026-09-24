import { personalProfile } from "./personal";
import type { WorkspaceProfile } from "./types";

/**
 * Registered workspace profiles. The personal profile is the only one today; additional
 * profiles (e.g. one per employer or market) can be added without touching the core.
 */
export const PROFILES: Record<string, WorkspaceProfile> = {
  [personalProfile.id]: personalProfile,
};

export const DEFAULT_PROFILE_ID = personalProfile.id;

export function getProfile(id: string | null | undefined): WorkspaceProfile {
  return (id && PROFILES[id]) || PROFILES[DEFAULT_PROFILE_ID];
}

export type { WorkspaceProfile } from "./types";
