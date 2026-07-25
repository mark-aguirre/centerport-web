import { PageContainer } from "@/components/common/page-container";
import { StatusStrip } from "@/components/dashboard/stat-card";
import { AttentionItems } from "@/components/dashboard/attention-items";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Users, HeartPulse, FlaskConical, Ship } from "lucide-react";

const stats = [
  { label: "patients", value: "1,248", icon: Users, subtext: "active" },
  { label: "records", value: "3,562", icon: HeartPulse, subtext: "this year" },
  { label: "lab tests", value: "892", icon: FlaskConical, subtext: "23 pending" },
  { label: "vessels", value: "47", icon: Ship, subtext: "12 in port" },
];

/**
 * Operational dashboard — shows what matters right now.
 *
 * Status strip for at-a-glance numbers, attention items for actionable work,
 * quick actions for navigation, and recent activity for audit trail.
 */
export default function DashboardPage() {
  return (
    <PageContainer fullWidth>
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
