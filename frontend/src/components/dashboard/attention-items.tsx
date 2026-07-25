import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, FileWarning, Anchor } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Priority = "urgent" | "warning" | "info";

interface AttentionItem {
  id: string;
  title: string;
  detail: string;
  priority: Priority;
  icon: LucideIcon;
  timestamp?: string;
}

const items: AttentionItem[] = [
  {
    id: "1",
    title: "23 lab results pending review",
    detail: "Oldest: 3 days overdue",
    priority: "urgent",
    icon: FileWarning,
    timestamp: "Updated 1h ago",
  },
  {
    id: "2",
    title: "5 crew certificates expiring within 30 days",
    detail: "M/V Pacific Star (2), M/V Horizon (3)",
    priority: "warning",
    icon: Clock,
  },
  {
    id: "3",
    title: "M/V Atlantic Dawn arriving tomorrow",
    detail: "12 crew members due for medical clearance",
    priority: "info",
    icon: Anchor,
  },
  {
    id: "4",
    title: "2 incomplete pre-employment screenings",
    detail: "Awaiting radiologist sign-off",
    priority: "warning",
    icon: AlertTriangle,
    timestamp: "Since Jul 22",
  },
];

const priorityStyles: Record<Priority, string> = {
  urgent: "border-l-border",
  warning: "border-l-border",
  info: "border-l-border",
};

const priorityDot: Record<Priority, string> = {
  urgent: "bg-foreground/60",
  warning: "bg-foreground/60",
  info: "bg-foreground/60",
};

/**
 * Actionable items that need attention — the reason someone opens the dashboard.
 * Replaces vanity metrics with operational awareness.
 */
export function AttentionItems() {
  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Needs Attention
      </h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 rounded-md border border-l-[3px] bg-card p-3",
              priorityStyles[item.priority]
            )}
          >
            <div className="pt-0.5">
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    priorityDot[item.priority]
                  )}
                />
                <p className="text-sm font-medium truncate">{item.title}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 ml-3.5">
                {item.detail}
              </p>
            </div>
            {item.timestamp && (
              <span className="text-[11px] text-muted-foreground/60 shrink-0 pt-0.5">
                {item.timestamp}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
