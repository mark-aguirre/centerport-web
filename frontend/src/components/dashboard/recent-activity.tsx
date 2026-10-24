"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Clock, Loader2 } from "lucide-react";
import { useDashboardData } from "@/components/dashboard/dashboard-data";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { moduleForActivityType } from "@/config/module-theme";
import { NAV_ICON_BY_HREF } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/lib/api";

/** Formats an ISO timestamp as a short calendar date (e.g. "Apr 22, 2025"). */
function activityDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "MMM d, yyyy");
}

/** One table row: when it happened, which module, and what changed. */
function ActivityRow({ item }: { item: ActivityItem }) {
  const source = moduleForActivityType(item.type);
  const Icon = NAV_ICON_BY_HREF[source.href];

  return (
    <tr className="border-b border-border/60 last:border-0 hover:bg-muted/40">
      <td className="px-4 py-2 align-top text-xs whitespace-nowrap text-muted-foreground">
        {activityDate(item.timestamp)}
      </td>
      <td className="px-4 py-2 align-top">
        <Link
          href={source.href}
          className="flex items-center gap-1.5 text-xs font-medium hover:underline"
        >
          {Icon && (
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded",
                source.accent.bg
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", source.accent.fg)} />
            </span>
          )}
          <span className="truncate">{source.label}</span>
        </Link>
      </td>
      <td className="px-4 py-2 align-top">
        <p className="text-xs font-medium text-foreground/90">{item.title}</p>
        <p className="text-[11px] text-muted-foreground">
          {[item.description, item.business_id].filter(Boolean).join(" · ") ||
            "—"}
        </p>
      </td>
    </tr>
  );
}

/**
 * Recent activity across every module.
 *
 * Renders the aggregated backend feed (visits, medical exams, PEMEs,
 * certificates, MLC records, new profiles) as a dated table so a user can scan
 * what the clinic has been doing and jump to the owning module.
 */
export function RecentActivity() {
  const { activity } = useDashboardData();

  return (
    <DashboardCard
      title="Recent activity"
      subtitle="Latest updates across all modules"
      icon={Clock}
      bodyClassName="pb-1"
    >
      {activity.loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : !activity.data || activity.data.length === 0 ? (
        <p className="py-12 text-center text-xs text-muted-foreground">
          No activity recorded yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <caption className="sr-only">
              Recent record changes across all CenterPort modules
            </caption>
            <thead>
              <tr className="border-y border-border bg-muted/40">
                {["Date", "Module", "Details"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-4 py-2 text-left text-[11px] font-bold tracking-wider text-primary/70 uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activity.data.map((item, index) => (
                <ActivityRow
                  key={`${item.type}-${item.business_id ?? index}`}
                  item={item}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardCard>
  );
}
