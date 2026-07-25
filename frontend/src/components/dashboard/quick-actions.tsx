import Link from "next/link";
import { cn } from "@/lib/utils";
import { HeartPulse, FlaskConical, User, Ship, Landmark, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuickAction {
  title: string;
  icon: LucideIcon;
  href: string;
  description: string;
}

const actions: QuickAction[] = [
  {
    title: "Medical Exam",
    description: "New pre-employment or annual checkup",
    icon: HeartPulse,
    href: "/medical",
  },
  {
    title: "Lab Test",
    description: "Order or record results",
    icon: FlaskConical,
    href: "/laboratory",
  },
  {
    title: "Crew Profile",
    description: "Register or update crew member",
    icon: User,
    href: "/profile",
  },
  {
    title: "Seabase Log",
    description: "Port call or vessel activity",
    icon: Ship,
    href: "/seabase",
  },
  {
    title: "Landbase",
    description: "Shore-based examination",
    icon: Landmark,
    href: "/landbase",
  },
  {
    title: "MLC Report",
    description: "Maritime Labour Convention",
    icon: FileText,
    href: "/mlc",
  },
];

/**
 * Navigation shortcuts to common workflows.
 * Compact rows with descriptions — not icon-only buttons.
 */
export function QuickActions() {
  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Quick Actions
      </h2>
      <div className="space-y-1">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5",
              "transition-colors hover:bg-accent"
            )}
          >
            <action.icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium leading-none">{action.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
