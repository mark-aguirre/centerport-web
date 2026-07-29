"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2, UserCheck } from "lucide-react";
import { api, type PatientVisitRecord } from "@/lib/api";

/**
 * Recently added patient visit records.
 *
 * Fetches today's visits from the backend and shows the most recent ones,
 * giving an at-a-glance view of who has been encoded. Each row links to the
 * Visit page.
 */
export function AttentionItems() {
  const [visits, setVisits] = useState<PatientVisitRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.entities.PatientVisit.listToday()
      .then((data) => {
        if (active) setVisits(data.slice(0, 6));
      })
      .catch(() => {
        if (active) setVisits([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Recent Visits
        </h2>
        <Link
          href="/visit"
          className="text-xs font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 rounded-md border bg-card">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : visits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 rounded-md border bg-card text-center">
          <UserCheck className="h-7 w-7 text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">No visits recorded today yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visits.map((visit) => {
            const name = [visit.last_name, visit.first_name]
              .filter(Boolean)
              .join(", ");
            return (
              <Link
                key={visit.id}
                href="/visit"
                className="flex items-start gap-3 rounded-md border border-l-[3px] border-l-border bg-card p-3 hover:bg-muted/40 transition-colors"
              >
                <div className="pt-0.5">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-foreground/60" />
                    <p className="text-sm font-medium truncate">
                      {name || "Unnamed patient"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 ml-3.5 truncate">
                    {[visit.visit_id, visit.purpose_of_visit || "No purpose noted"]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                </div>
                {visit.created_date && (
                  <span className="text-[11px] text-muted-foreground/60 shrink-0 pt-0.5">
                    {format(new Date(visit.created_date), "hh:mm a")}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
