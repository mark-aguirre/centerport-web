import { PageContainer } from "@/components/common/page-container";
import { StatsStripClient } from "@/components/dashboard/stats-strip-client";
import { AttentionItems } from "@/components/dashboard/attention-items";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";

/**
 * Operational dashboard — shows what matters right now.
 *
 * The data-driven widgets (stats strip, recent visits) are Client Components
 * that fetch from the browser through the same-origin `/api/backend` proxy, so
 * the backend session cookie rides along automatically — the same request path
 * the rest of the authenticated app uses. Fetching these on the server does not
 * work here: the backend session cookie is scoped to `/api/backend`, so it is
 * not sent with a plain `/dashboard` page request and the backend would 401.
 */
export default function DashboardPage() {
  return (
    <PageContainer>
      {/* Status strip — fetches its own data client-side */}
      <StatsStripClient className="mb-8 pb-4 border-b" />

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
