import { createDemoDatabase, SCHEMA_VERSION } from "../demo/seed";
import type { Database } from "../types";

/**
 * Persistence boundary. The MVP ships LocalStore; a SupabaseStore implementing the same
 * interface (see supabase/schema.sql) can replace it without touching the UI.
 */
export interface DataStore {
  readonly mode: "local-demo" | "supabase";
  load(): Promise<Database>;
  save(db: Database): Promise<void>;
  reset(): Promise<Database>;
}

const KEY = "bloom-gcc-engine:db";

export class LocalStore implements DataStore {
  readonly mode = "local-demo" as const;

  async load(): Promise<Database> {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const db = JSON.parse(raw) as Database;
        if (db.version === SCHEMA_VERSION) return db;
      }
    } catch {
      // Storage unavailable or corrupt — fall through to a fresh demo dataset.
    }
    return this.reset();
  }

  async save(db: Database): Promise<void> {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(db));
    } catch {
      // Private mode / quota: the session keeps working in memory.
    }
  }

  async reset(): Promise<Database> {
    const db = createDemoDatabase();
    await this.save(db);
    return db;
  }
}

export function createStore(): DataStore {
  return new LocalStore();
}
