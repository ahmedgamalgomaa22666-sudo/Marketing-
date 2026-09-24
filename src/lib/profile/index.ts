import { bloomProfile } from "./bloom";
import { genericProfile } from "./generic";
import type { WorkspaceProfile } from "./types";

/** Registered workspace profiles. Add a company by adding a profile — the core stays untouched. */
export const PROFILES: Record<string, WorkspaceProfile> = {
  [bloomProfile.id]: bloomProfile,
  [genericProfile.id]: genericProfile,
};

export const DEFAULT_PROFILE_ID = bloomProfile.id;

export function getProfile(id: string | null | undefined): WorkspaceProfile {
  return (id && PROFILES[id]) || PROFILES[DEFAULT_PROFILE_ID];
}

/** Display label and help for a score dimension, with the profile's overrides applied. */
export function dimensionLabel(profile: WorkspaceProfile, key: import("../config").ScoreDimension, fallback: { label: string; help: string }) {
  return profile.qualification.labels[key] ?? fallback;
}

export type { WorkspaceProfile } from "./types";
