"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  HeartPulse,
  FlaskConical,
  Ship,
  Stethoscope,
  UserCheck,
  UserPlus,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { getRecentActivity } from "@/lib/dashboard-data";
import type { ActivityItem } from "@/lib/api";

/**
 * Maps a backend activity `type` key to its display icon. Falls back to a
 * neutral icon for any unrecognized type so a new backend source never breaks
 * rendering.
 */
const ICON_BY_TYPE: Record<string, LucideIcon> = {
  visit: UserCheck,
  medical_exam: HeartPulse,
  landbase_peme: Stethoscope,
  panama_certificate: FlaskConical,
  mlc_record: Ship,
  profile: UserPlus,
};

/** Formats an ISO timestamp as a short relative time (e.g. "2 hours ago"). */
function relativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Presentational activity timeline — receives already-fetched items.
 */
function RecentActivityView({ items }: { items: ActivityItem[] }) {
  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Recent Activity
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">No recent activity.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const Icon = ICON_BY_TYPE[item.type] ?? HeartPulse;
            return (
              <div
                key={`${item.type}-${item.business_id ?? i}`}
                className="flex items-start gap-3"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {[item.description, item.business_id]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground/60 shrink-0 pt-0.5">
                  {relativeTime(item.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/**
 * Recent activity feed.
 *
 * Client Component: fetches the aggregated feed from the browser through the
 * same-origin `/api/backend` proxy (so the backend session cookie is attached),
 * matching the rest of the dashboard. Shows a spinner while loading and an
 * empty state on error or when there is nothing to show.
 */
export function RecentActivity() {
  const [items, setItems] = useState<ActivityItem[] | null>(null);

  useEffect(() => {
    let active = true;
    getRecentActivity()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((err) => {
        console.error("[dashboard] getRecentActivity failed:", err);
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, []);

  if (items === null) {
    return (
      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Recent Activity
        </h2>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return <RecentActivityView items={items} />;
}
