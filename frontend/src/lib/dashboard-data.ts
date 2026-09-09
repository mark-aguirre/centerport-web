import { api, type DashboardStats, type PatientVisitRecord } from "@/lib/api";

/**
 * Server-side dashboard data fetchers.
 *
 * These run on the Next.js server during rendering. In Next 16, `fetch` is
 * not cached by default, so each request returns fresh data — appropriate for
 * a live operational dashboard. Callers should initiate these in parallel and
 * stream each result behind its own `<Suspense>` boundary so a slow request
 * never blocks the rest of the page.
 *
 * These functions are only imported by Server Components (the dashboard page),
 * so the fetch runs on the server rather than in the browser.
 */

/** Fetch aggregated dashboard statistics on the server. */
export function getDashboardStats(): Promise<DashboardStats> {
  return api.dashboard.getStats();
}

/** Fetch today's patient visits on the server (most recent first). */
export function getTodaysVisits(): Promise<PatientVisitRecord[]> {
  return api.entities.PatientVisit.listToday();
}
