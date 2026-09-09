import { Suspense } from "react";
import { Loader2, Users, HeartPulse, FlaskConical, Ship, type LucideIcon } from "lucide-react";
import { PageContainer } from "@/components/common/page-container";
import { StatusStrip } from "@/components/dashboard/stat-card";
import { AttentionItems } from "@/components/dashboard/attention-items";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { getDashboardStats } from "@/lib/dashboard-data";
import type { DashboardStats } from "@/lib/api";

/**
 * Render per request so live stats and visits are always fresh.
 *
 * The dashboard reflects real-time operational data (patient counts, today's
 * visits), so it must not be served from a build-time static snapshot. This
 * opts the route into dynamic rendering; the static shell still streams first
 * and the data-dependent sections stream in behind their Suspense fallbacks.
 */
export const dynamic = "force-dynamic";

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

/** Placeholder stats shown in the Suspense fallback and on fetch error. */
function placeholderStats(subtext: string): StatItem[] {
  return [
    { label: "patients", value: "—", icon: Users, subtext },
    { label: "records", value: "—", icon: HeartPulse, subtext },
    { label: "lab tests", value: "—", icon: FlaskConical, subtext },
    { label: "vessels", value: "—", icon: Ship, subtext },
  ];
}

/**
 * Server-rendered status strip.
 *
 * Fetches aggregated stats on the server. Streamed behind its own Suspense
 * boundary so it never blocks the rest of the dashboard. Falls back to
 * "unavailable" placeholders if the backend request fails.
 */
async function StatsStrip() {
  let items: StatItem[];
  try {
    items = buildStats(await getDashboardStats());
  } catch {
    items = placeholderStats("unavailable");
  }
  return <StatusStrip items={items} className="mb-8 pb-4 border-b" />;
}

/** Centered spinner used for a streaming section fallback. */
function SectionSpinner() {
  return (
    <div className="flex items-center justify-center py-10 rounded-md border bg-card">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </div>
  );
}

/**
 * Operational dashboard — shows what matters right now.
 *
 * Server Component. The static shell (quick actions, recent activity, section
 * headings) is sent immediately. Stats and recent visits are each fetched on
 * the server and streamed in behind their own Suspense boundaries, so a slow
 * backend call for one never blocks the other or the shell. This replaces the
 * previous client-side `useEffect` fetch waterfall.
 */
export default function DashboardPage() {
  return (
    <PageContainer>
      {/* Status strip — streamed in; loading placeholders show first */}
      <Suspense
        fallback={
          <StatusStrip items={placeholderStats("loading")} className="mb-8 pb-4 border-b" />
        }
      >
        <StatsStrip />
      </Suspense>

      {/* Main content: attention + actions */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: what needs doing */}
        <div className="lg:col-span-3 space-y-8">
          <Suspense fallback={<SectionSpinner />}>
            <AttentionItems />
          </Suspense>
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
