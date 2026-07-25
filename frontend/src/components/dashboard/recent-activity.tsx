import { HeartPulse, FlaskConical, Ship, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    title: "Medical checkup completed",
    description: "Patient #4582 — Pre-employment screening",
    time: "2h ago",
    icon: HeartPulse,
  },
  {
    id: "2",
    title: "Lab results uploaded",
    description: "Blood panel — 12 parameters",
    time: "4h ago",
    icon: FlaskConical,
  },
  {
    id: "3",
    title: "Seabase log entered",
    description: "M/V Pacific Star — Port call",
    time: "yesterday",
    icon: Ship,
  },
  {
    id: "4",
    title: "Profile updated",
    description: "Crew member James Wilson",
    time: "2d ago",
    icon: User,
  },
  {
    id: "5",
    title: "Medical record created",
    description: "Injury report — Patient #4590",
    time: "3d ago",
    icon: HeartPulse,
  },
];

/**
 * Minimal activity feed — no scroll containers, no card wrappers.
 * Just a timeline of what happened.
 */
export function RecentActivity() {
  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Recent Activity
      </h2>
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {activity.description}
                </p>
              </div>
              <span className="text-[11px] text-muted-foreground/60 shrink-0 pt-0.5">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
