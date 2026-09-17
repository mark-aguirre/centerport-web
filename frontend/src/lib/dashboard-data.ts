import {
  api,
  type ActivityItem,
  type DashboardStats,
  type PatientVisitRecord,
} from "@/lib/api";

/**
 * Dashboard data fetchers.
 *
 * These are called from the dashboard's Client Components, so the fetch runs in
 * the browser and goes through the same-origin `/api/backend` proxy — which is
 * where the backend session cookie is scoped, so authentication rides along
 * automatically. (Fetching on the server does not work for the dashboard: the
 * session cookie is not sent with a plain page request, so the backend 401s.)
 *
 * In Next 16, `fetch` is not cached by default, so each call returns fresh data
 * — appropriate for a live operational dashboard.
 */

/** Fetch aggregated dashboard statistics. */
export function getDashboardStats(): Promise<DashboardStats> {
  return api.dashboard.getStats();
}

/** Fetch today's patient visits (most recent first). */
export function getTodaysVisits(): Promise<PatientVisitRecord[]> {
  return api.entities.PatientVisit.listToday();
}

/** Fetch the recent-activity feed (newest first). */
export function getRecentActivity(): Promise<ActivityItem[]> {
  return api.dashboard.getActivity();
}
