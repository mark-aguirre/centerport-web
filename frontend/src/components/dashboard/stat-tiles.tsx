"use client";

import Link from "next/link";
import {
  CalendarCheck,
  ChevronRight,
  FileClock,
  FlaskConical,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useDashboardData } from "@/components/dashboard/dashboard-data";
import { accentForHref } from "@/config/module-theme";
import { cn } from "@/lib/utils";

/** One headline count linking to the module it comes from. */
interface Tile {
  label: string;
  /** Resolved count, or `null` while loading or when unavailable. */
  value: number | null;
  loading: boolean;
  icon: LucideIcon;
  href: string;
}

/**
 * Headline operational counts.
 *
 * Four live numbers across the top of the dashboard, each a link into the
 * module that owns it. Tiles the signed-in user's roles cannot reach are
 * dropped rather than shown empty, matching how the navigation is filtered.
 *
 * Counts come from the shared {@link useDashboardData} fetch, so this adds no
 * requests of its own.
 */
export function StatTiles() {
  const { canRoute } = useAuth();
  const { stats, visits } = useDashboardData();

  const tiles: Tile[] = [
    {
      label: "Today's visits",
      value: visits.data?.length ?? null,
      loading: visits.loading,
      icon: CalendarCheck,
      href: "/visit",
    },
    {
      label: "Active patients",
      value: stats.data?.total_patients ?? null,
      loading: stats.loading,
      icon: Users,
      href: "/profile",
    },
    {
      label: "Lab tests",
      value: stats.data?.total_lab_tests ?? null,
      loading: stats.loading,
      icon: FlaskConical,
      href: "/laboratory",
    },
    {
      label: "Pending lab tests",
      value: stats.data?.pending_lab_tests ?? null,
      loading: stats.loading,
      icon: FileClock,
      href: "/laboratory",
    },
  ];

  const visible = tiles.filter((tile) => canRoute(tile.href));
  if (visible.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {visible.map((tile) => {
        const accent = accentForHref(tile.href);
        return (
          <Link
            key={tile.label}
            href={tile.href}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-colors hover:border-primary/40"
          >
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                accent.bg
              )}
            >
              <tile.icon className={cn("h-5 w-5", accent.fg)} />
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block text-2xl leading-none font-semibold tabular-nums",
                  tile.loading && "animate-pulse text-muted-foreground"
                )}
              >
                {tile.value ?? "—"}
              </span>
              <span className="mt-1 block truncate text-xs text-muted-foreground">
                {tile.label}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        );
      })}
    </div>
  );
}
