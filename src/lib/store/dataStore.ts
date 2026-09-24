import type { WorkspaceProfile } from "../profile/types";
import type { Database } from "../types";
import { starterContexts, starterEvidence } from "../evidence/seed";
import { emptyDatabase, SCHEMA_VERSION } from "./empty";

/**
 * Persistence boundary. The MVP ships LocalStore; a SupabaseStore implementing the same
 * interface (see supabase/schema.sql) can replace it without touching the UI.
 */
export interface DataStore {
  readonly mode: "local-demo" | "supabase";
  load(profile: WorkspaceProfile): Promise<Database>;
  save(db: Database): Promise<void>;
  /** Restores the profile's sample data, or an empty workspace when it has none. */
  reset(profile: WorkspaceProfile): Promise<Database>;
  clear(profile: WorkspaceProfile): Promise<Database>;
}

const PREFIX = "bdos:db:";
const PROFILE_KEY = "bdos:profile";

export class LocalStore implements DataStore {
  readonly mode = "local-demo" as const;

  async load(profile: WorkspaceProfile): Promise<Database> {
    try {
      const raw = window.localStorage.getItem(PREFIX + profile.id);
      if (raw) {
        const db = JSON.parse(raw) as Database;
        if (db.version === SCHEMA_VERSION && db.profileId === profile.id) return db;
        // v2 → v3: add Career Evidence without touching existing workspace data.
        if (db.version === 2 && db.profileId === profile.id) {
          const migrated: Database = { ...db, version: SCHEMA_VERSION, careerContexts: starterContexts(), evidence: starterEvidence() };
          await this.save(migrated);
          return migrated;
        }
      }
    } catch {
      // Storage unavailable or corrupt — fall through to a fresh workspace.
    }
    return this.reset(profile);
  }

  async save(db: Database): Promise<void> {
    try {
      window.localStorage.setItem(PREFIX + db.profileId, JSON.stringify(db));
    } catch {
      // Private mode / quota: the session keeps working in memory.
    }
  }

  async reset(profile: WorkspaceProfile): Promise<Database> {
    const { todayISO } = await import("../dates");
    const db = profile.createDemoData ? profile.createDemoData(todayISO()) : emptyDatabase(profile);
    await this.save(db);
    return db;
  }

  async clear(profile: WorkspaceProfile): Promise<Database> {
    const db = emptyDatabase(profile);
    await this.save(db);
    return db;
  }
}

export function createStore(): DataStore {
  return new LocalStore();
}

export function readActiveProfileId(): string | null {
  try {
    return window.localStorage.getItem(PROFILE_KEY);
  } catch {
    return null;
  }
}

export function writeActiveProfileId(id: string): void {
  try {
    window.localStorage.setItem(PROFILE_KEY, id);
  } catch {
    // Non-critical: falls back to the default profile next time.
  }
}
