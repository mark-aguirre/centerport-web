"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Loader2, UserCheck, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { useDashboardData } from "@/components/dashboard/dashboard-data";
import type { PatientVisitRecord } from "@/lib/api";

/** "Last, First" for a visit record, or a placeholder when both are blank. */
function visitName(visit: PatientVisitRecord): string {
  const name = [visit.last_name, visit.first_name].filter(Boolean).join(", ");
  return name || "Unnamed patient";
}

/** Check-in time (e.g. "09:40 AM"), or an empty string if unusable. */
function visitTime(visit: PatientVisitRecord): string {
  if (!visit.created_date) return "";
  const date = new Date(visit.created_date);
  if (Number.isNaN(date.getTime())) return "";
  return format(date, "hh:mm a");
}

/**
 * Today's registered visits.
 *
 * The clinic's live worklist: who has checked in today, why, and when. Hidden
 * for roles without visits access, which is also what the backend enforces.
 */
export function TodaysVisits() {
  const { canRoute } = useAuth();
  const { visits } = useDashboardData();

  if (!canRoute("/visit")) return null;

  const items = visits.data?.slice(0, 6) ?? [];

  return (
    <DashboardCard
      title="Today's visits"
      subtitle="Seafarers registered today"
      icon={UserCheck}
      viewAllHref="/visit"
    >
      {visits.loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <UserCheck className="h-7 w-7 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">
            No visits recorded today yet.
          </p>
        </div>
      ) : (
        <ul className="space-y-1">
          {items.map((visit) => (
            <li key={visit.id}>
              <Link
                href="/visit"
                className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/50"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <UserRound className="h-3.5 w-3.5 text-primary" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold">
                    {visitName(visit)}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {[visit.visit_id, visit.purpose_of_visit]
                      .filter(Boolean)
                      .join(" · ") || "No purpose noted"}
                  </span>
                </span>
                {visitTime(visit) && (
                  <span className="shrink-0 pt-0.5 text-[11px] text-muted-foreground">
                    {visitTime(visit)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
