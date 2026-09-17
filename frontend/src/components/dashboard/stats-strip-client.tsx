"use client";

import { useEffect, useState } from "react";
import { Users, HeartPulse, FlaskConical, Ship, type LucideIcon } from "lucide-react";
import { StatusStrip } from "@/components/dashboard/stat-card";
import { getDashboardStats } from "@/lib/dashboard-data";
import type { DashboardStats } from "@/lib/api";

/** Shape of a single stat item rendered in the status strip. */
interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  subtext: string;
}

/** Formats a number with comma thousands separators. */
function formatNumber(n: number): string {
  return n.toLocaleString();
}

/** Builds the stat items array from live dashboard data. */
function buildStats(data: DashboardStats): StatItem[] {
  return [
    { label: "patients", value: formatNumber(data.total_patients), icon: Users, subtext: "active" },
    { label: "records", value: formatNumber(data.records_this_year), icon: HeartPulse, subtext: "this year" },
    { label: "lab tests", value: formatNumber(data.total_lab_tests), icon: FlaskConical, subtext: `${data.pending_lab_tests} pending` },
    { label: "vessels", value: formatNumber(data.total_vessels), icon: Ship, subtext: `${data.vessels_in_port} active` },
  ];
}

/** Placeholder stats shown while loading and on fetch error. */
function placeholderStats(subtext: string): StatItem[] {
  return [
    { label: "patients", value: "—", icon: Users, subtext },
    { label: "records", value: "—", icon: HeartPulse, subtext },
    { label: "lab tests", value: "—", icon: FlaskConical, subtext },
    { label: "vessels", value: "—", icon: Ship, subtext },
  ];
}

/**
 * Client-rendered status strip.
 *
 * Fetches aggregated stats from the browser through the same-origin proxy
 * (`/api/backend/...`), so the backend session cookie is attached automatically
 * — the same path the rest of the app uses. This deliberately avoids fetching
 * during server render, where the backend session cookie (scoped to
 * `/api/backend`) is not sent with the page request and the call would 401.
 */
export function StatsStripClient({ className }: { className?: string }) {
  const [items, setItems] = useState<StatItem[]>(() => placeholderStats("loading"));

  useEffect(() => {
    let active = true;
    getDashboardStats()
      .then((data) => {
        if (active) setItems(buildStats(data));
      })
      .catch((err) => {
        console.error("[dashboard] getDashboardStats failed:", err);
        if (active) setItems(placeholderStats("unavailable"));
      });
    return () => {
      active = false;
    };
  }, []);

  return <StatusStrip items={items} className={className} />;
}
