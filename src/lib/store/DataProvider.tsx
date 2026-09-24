"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { furthestStage } from "../analytics";
import type { ScoreDimension } from "../config";
import { nowStamp, todayISO } from "../dates";
import { emptyDatabase } from "../demo/seed";
import { computeFitScore, type FitScore } from "../scoring";
import type { Account, AccountStage, CollectionName, Database } from "../types";
import { createStore, type DataStore } from "./dataStore";

type Item<C extends CollectionName> = Database[C][number];
type Draft<C extends CollectionName> = Omit<Item<C>, "id" | "createdAt" | "updatedAt"> & { id?: string };

interface DataContextValue {
  db: Database;
  mode: DataStore["mode"];
  upsert: <C extends CollectionName>(collection: C, item: Draft<C>) => Item<C>;
  remove: (collection: CollectionName, id: string) => void;
  setAccountStage: (accountId: string, stage: AccountStage) => void;
  setWeights: (weights: Record<ScoreDimension, number>) => void;
  resetDemo: () => Promise<void>;
  clearWorkspace: () => void;
  scoreFor: (accountId: string) => FitScore | null;
}

const DataContext = createContext<DataContextValue | null>(null);

export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

const PREFIX: Record<CollectionName, string> = {
  users: "u",
  accounts: "acc",
  accountScores: "score",
  contacts: "con",
  opportunities: "opp",
  activities: "act",
  programmes: "prog",
  recommendations: "rec",
};

/** Opportunity stages map onto account stages; winning or advancing a deal moves the account. */
function advanceAccount(db: Database, accountId: string, stage: AccountStage): Database {
  return {
    ...db,
    accounts: db.accounts.map((a) =>
      a.id === accountId ? { ...a, stage, highestStage: furthestStage(a.highestStage, stage), updatedAt: nowStamp() } : a,
    ),
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<DataStore | null>(null);
  const [db, setDb] = useState<Database | null>(null);
  const [mode, setMode] = useState<DataStore["mode"]>("local-demo");

  useEffect(() => {
    const store = createStore();
    storeRef.current = store;
    setMode(store.mode);
    store.load().then(setDb);
  }, []);

  const commit = useCallback((updater: (prev: Database) => Database) => {
    setDb((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      void storeRef.current?.save(next);
      return next;
    });
  }, []);

  const upsert = useCallback(
    <C extends CollectionName>(collection: C, item: Draft<C>): Item<C> => {
      const stamp = nowStamp();
      const saved = { ...item, id: item.id ?? newId(PREFIX[collection]), updatedAt: stamp } as Item<C>;
      commit((prev) => {
        const list = prev[collection] as Item<C>[];
        const existing = list.find((x) => x.id === saved.id);
        const record = { ...saved, createdAt: existing?.createdAt ?? stamp } as Item<C>;
        let next = {
          ...prev,
          [collection]: existing ? list.map((x) => (x.id === saved.id ? record : x)) : [...list, record],
        } as Database;

        if (collection === "opportunities") {
          const opp = record as Database["opportunities"][number];
          const account = next.accounts.find((a) => a.id === opp.accountId);
          if (account && opp.stage !== "Lost" && account.stage !== opp.stage && furthestStage(account.stage, opp.stage) === opp.stage) {
            next = advanceAccount(next, opp.accountId, opp.stage);
          }
        }
        if (collection === "activities") {
          const act = record as Database["activities"][number];
          if (act.status === "done" && act.type !== "Note") {
            next = {
              ...next,
              accounts: next.accounts.map((a) =>
                a.id === act.accountId && (!a.lastContactedAt || a.lastContactedAt < act.date) && act.date <= todayISO()
                  ? { ...a, lastContactedAt: act.date }
                  : a,
              ),
              contacts: act.contactId
                ? next.contacts.map((c) => (c.id === act.contactId && (!c.lastInteractionAt || c.lastInteractionAt < act.date) ? { ...c, lastInteractionAt: act.date } : c))
                : next.contacts,
            };
          }
        }
        return next;
      });
      return saved;
    },
    [commit],
  );

  const remove = useCallback(
    (collection: CollectionName, id: string) => {
      commit((prev) => {
        if (collection === "accounts") {
          // Cascade: an account owns its contacts, deals, activities, score and recommendations.
          const keep = <T extends { accountId: string }>(xs: T[]) => xs.filter((x) => x.accountId !== id);
          return {
            ...prev,
            accounts: prev.accounts.filter((a) => a.id !== id),
            contacts: keep(prev.contacts),
            opportunities: keep(prev.opportunities),
            activities: keep(prev.activities),
            accountScores: keep(prev.accountScores),
            recommendations: keep(prev.recommendations),
          };
        }
        const next = { ...prev, [collection]: (prev[collection] as { id: string }[]).filter((x) => x.id !== id) } as Database;
        if (collection === "contacts") {
          next.opportunities = next.opportunities.map((o) => ({
            ...o,
            primaryContactId: o.primaryContactId === id ? null : o.primaryContactId,
            contactIds: o.contactIds.filter((c) => c !== id),
          }));
          next.activities = next.activities.map((a) => (a.contactId === id ? { ...a, contactId: null } : a));
        }
        if (collection === "opportunities") {
          next.activities = next.activities.map((a) => (a.opportunityId === id ? { ...a, opportunityId: null } : a));
        }
        return next;
      });
    },
    [commit],
  );

  const setAccountStage = useCallback(
    (accountId: string, stage: AccountStage) => commit((prev) => advanceAccount(prev, accountId, stage)),
    [commit],
  );

  const setWeights = useCallback(
    (weights: Record<ScoreDimension, number>) => commit((prev) => ({ ...prev, settings: { ...prev.settings, weights } })),
    [commit],
  );

  const resetDemo = useCallback(async () => {
    if (storeRef.current) setDb(await storeRef.current.reset());
  }, []);

  const clearWorkspace = useCallback(() => commit((prev) => emptyDatabase(prev.programmes, prev.users)), [commit]);

  const scoreFor = useCallback(
    (accountId: string) => {
      if (!db) return null;
      const account = db.accounts.find((a: Account) => a.id === accountId);
      if (!account) return null;
      return computeFitScore({
        account,
        score: db.accountScores.find((s) => s.accountId === accountId),
        contacts: db.contacts.filter((c) => c.accountId === accountId),
        activities: db.activities.filter((a) => a.accountId === accountId),
        weights: db.settings.weights,
      });
    },
    [db],
  );

  const value = useMemo(
    () => (db ? { db, mode, upsert, remove, setAccountStage, setWeights, resetDemo, clearWorkspace, scoreFor } : null),
    [db, mode, upsert, remove, setAccountStage, setWeights, resetDemo, clearWorkspace, scoreFor],
  );

  if (!value) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500" role="status">
        Loading workspace…
      </div>
    );
  }
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}
