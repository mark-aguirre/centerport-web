"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getDashboardStats,
  getRecentActivity,
  getTodaysVisits,
} from "@/lib/dashboard-data";
import { ApiError } from "@/lib/http-client";
import type {
  ActivityItem,
  DashboardStats,
  PatientVisitRecord,
} from "@/lib/api";

/** A value that is fetched on mount: loading, then either data or `null`. */
export interface AsyncValue<T> {
  data: T | null;
  loading: boolean;
}

interface DashboardDataValue {
  stats: AsyncValue<DashboardStats>;
  visits: AsyncValue<PatientVisitRecord[]>;
  activity: AsyncValue<ActivityItem[]>;
}

const DashboardDataContext = createContext<DashboardDataValue | undefined>(
  undefined
);

const PENDING = { data: null, loading: true } as const;

/**
 * Logs a failed dashboard fetch, staying quiet for 403s.
 *
 * A 403 means the signed-in user's role does not include that module (e.g.
 * ACCOUNTING has no visits access). That is an expected access outcome, not a
 * failure, so the widget renders its empty state without noise in the console.
 */
function reportFailure(source: string, err: unknown): void {
  if (err instanceof ApiError && err.status === 403) return;
  console.error(`[dashboard] ${source} failed:`, err);
}

/**
 * Fetches every dashboard dataset once and shares it with the widgets.
 *
 * The stats tiles, activity table, visit list, and notification counts all
 * derive from the same three endpoints. Fetching them here means one request
 * each per page view instead of one per widget.
 *
 * All three run in the browser, through the same-origin `/api/backend` proxy,
 * so the backend session cookie is attached automatically. Fetching on the
 * server does not work for the dashboard: that cookie is scoped to
 * `/api/backend`, so it is not sent with a plain `/dashboard` page request and
 * the backend would answer 401.
 */
export function DashboardDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stats, setStats] = useState<AsyncValue<DashboardStats>>(PENDING);
  const [visits, setVisits] =
    useState<AsyncValue<PatientVisitRecord[]>>(PENDING);
  const [activity, setActivity] = useState<AsyncValue<ActivityItem[]>>(PENDING);

  useEffect(() => {
    let active = true;

    /** Resolves one dataset into its `AsyncValue` slot. */
    function run<T>(
      source: string,
      fetcher: () => Promise<T>,
      apply: (value: AsyncValue<T>) => void
    ) {
      fetcher()
        .then((data) => {
          if (active) apply({ data, loading: false });
        })
        .catch((err) => {
          reportFailure(source, err);
          if (active) apply({ data: null, loading: false });
        });
    }

    run("stats", getDashboardStats, setStats);
    run("todaysVisits", getTodaysVisits, setVisits);
    run("recentActivity", getRecentActivity, setActivity);

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardDataContext.Provider value={{ stats, visits, activity }}>
      {children}
    </DashboardDataContext.Provider>
  );
}

/**
 * Access the shared dashboard datasets.
 *
 * Must be used within a {@link DashboardDataProvider}. Throws if called
 * outside one.
 */
export function useDashboardData(): DashboardDataValue {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error(
      "useDashboardData must be used within a DashboardDataProvider"
    );
  }
  return context;
}
