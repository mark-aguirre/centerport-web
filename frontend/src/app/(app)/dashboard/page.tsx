"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/common/page-container";
import { StatusStrip } from "@/components/dashboard/stat-card";
import { AttentionItems } from "@/components/dashboard/attention-items";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Users, HeartPulse, FlaskConical, Ship, type LucideIcon } from "lucide-react";
import { api, type DashboardStats } from "@/lib/api";

/** Shape of a single stat item rendered in the status strip. */
interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  subtext: string;
}

/**
 * Formats a number with comma thousands separators.
 */
function formatNumber(n: number): string {
  return n.toLocaleString();
}

/**
 * Builds the stat items array from live dashboard data.
 */
function buildStats(data: DashboardStats): StatItem[] {
  return [
    {
      label: "patients",
      value: formatNumber(data.total_patients),
      icon: Users,
      subtext: "active",
    },
    {
      label: "records",
      value: formatNumber(data.records_this_year),
      icon: HeartPulse,
      subtext: "this year",
    },
    {
      label: "lab tests",
      value: formatNumber(data.total_lab_tests),
      icon: FlaskConical,
      subtext: `${data.pending_lab_tests} pending`,
    },
    {
      label: "vessels",
      value: formatNumber(data.total_vessels),
      icon: Ship,
      subtext: `${data.vessels_in_port} active`,
    },
  ];
}

/** Fallback stats shown while loading or on error. */
const FALLBACK_STATS: StatItem[] = [
  { label: "patients", value: "—", icon: Users, subtext: "loading" },
  { label: "records", value: "—", icon: HeartPulse, subtext: "loading" },
  { label: "lab tests", value: "—", icon: FlaskConical, subtext: "loading" },
  { label: "vessels", value: "—", icon: Ship, subtext: "loading" },
];

/** Error stats shown when the API call fails. */
const ERROR_STATS: StatItem[] = [
  { label: "patients", value: "—", icon: Users, subtext: "unavailable" },
  { label: "records", value: "—", icon: HeartPulse, subtext: "unavailable" },
  { label: "lab tests", value: "—", icon: FlaskConical, subtext: "unavailable" },
  { label: "vessels", value: "—", icon: Ship, subtext: "unavailable" },
];

/**
 * Operational dashboard — shows what matters right now.
 *
 * Status strip for at-a-glance numbers, attention items for actionable work,
 * quick actions for navigation, and recent activity for audit trail.
 */
export default function DashboardPage() {
  const [stats, setStats] = useState<StatItem[]>(FALLBACK_STATS);

  useEffect(() => {
    const controller = new AbortController();

    api.dashboard
      .getStats()
      .then((data) => {
        if (!controller.signal.aborted) setStats(buildStats(data));
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        console.error("[Dashboard] Failed to load stats:", err);
        setStats(ERROR_STATS);
      });

    return () => controller.abort();
  }, []);

  return (
    <PageContainer>
      {/* Status strip — dense, inline numbers */}
      <StatusStrip items={stats} className="mb-8 pb-4 border-b" />

      {/* Main content: attention + actions */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: what needs doing */}
        <div className="lg:col-span-3 space-y-8">
          <AttentionItems />
          <RecentActivity />
        </div>

        {/* Right: navigation shortcuts */}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
      </div>
    </PageContainer>
  );
}
