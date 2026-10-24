import { PageContainer } from "@/components/common/page-container";
import { CommunityCard } from "@/components/dashboard/community-card";
import { DashboardDataProvider } from "@/components/dashboard/dashboard-data";
import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatTiles } from "@/components/dashboard/stat-tiles";
import { TodaysVisits } from "@/components/dashboard/todays-visits";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";

/**
 * Operational dashboard — shows what matters right now.
 *
 * Reads top to bottom as a shift briefing: who is signed in and what day it
 * is, the four headline counts, then three columns of detail — what the clinic
 * has been doing, what the user can start next, and who has checked in today.
 *
 * All widgets are Client Components fed by a single {@link
 * DashboardDataProvider} fetch from the browser, through the same-origin
 * `/api/backend` proxy, so the backend session cookie rides along
 * automatically — the same request path the rest of the authenticated app
 * uses. Fetching these on the server does not work here: the backend session
 * cookie is scoped to `/api/backend`, so it is not sent with a plain
 * `/dashboard` page request and the backend would answer 401.
 */
export default function DashboardPage() {
  return (
    <DashboardGate>
      <DashboardDataProvider>
        {/* The dashboard is the one route AppLayout gives no side gutter to,
            so that WelcomeBanner can run edge to edge. The widgets below it
            still need breathing room, so the gutter lives here instead — in
            px, not rem, because the banner cancels it with a matching negative
            margin and `html` sits at 90% font size. Keep `px-[24px]` here and
            `-mx-[24px]` in WelcomeBanner in step. */}
        <PageContainer className="space-y-3 px-[24px]">
          <WelcomeBanner />
          <StatTiles />

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <RecentActivity />
            </div>
            <div className="lg:col-span-4">
              <QuickActions />
            </div>
            <div className="space-y-3 lg:col-span-3">
              <TodaysVisits />
              <CommunityCard />
            </div>
          </div>
        </PageContainer>
      </DashboardDataProvider>
    </DashboardGate>
  );
}
