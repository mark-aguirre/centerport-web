"use client";

import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { accentForHref } from "@/config/module-theme";
import { NAV_ICON_BY_HREF } from "@/config/navigation";
import { cn } from "@/lib/utils";

/** A shortcut tile: the label staff use for the task, and where it goes. */
interface QuickAction {
  label: string;
  href: string;
}

/**
 * The tasks that start a working day, in the order they are usually done:
 * register the visit, order the labs, then fill in the certificates.
 */
const ACTIONS: QuickAction[] = [
  { label: "New Visit", href: "/visit" },
  { label: "Lab Test", href: "/laboratory" },
  { label: "Patient Profile", href: "/profile" },
  { label: "Medical Examination", href: "/seabase" },
  { label: "Land-Base", href: "/landbase" },
  { label: "MLC Report", href: "/mlc" },
  { label: "Panama Certificate", href: "/panama" },
  { label: "Default Values", href: "/default-values" },
];

/**
 * Shortcuts to the common workflows.
 *
 * Actions are filtered to the routes the signed-in user's roles permit, using
 * the same `canRoute` check that gates the navigation (which mirrors the
 * backend authorization rules). This is UX only — the backend still enforces
 * access and returns 403 for any forbidden endpoint. If no actions remain for
 * the user's role, the card is hidden entirely.
 */
export function QuickActions() {
  const { canRoute } = useAuth();
  const visible = ACTIONS.filter((action) => canRoute(action.href));

  if (visible.length === 0) return null;

  return (
    <DashboardCard
      title="Quick actions"
      subtitle="Common tasks at your fingertips"
      icon={Zap}
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {visible.map((action) => {
          const Icon = NAV_ICON_BY_HREF[action.href];
          const accent = accentForHref(action.href);
          return (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              {Icon && (
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                    accent.bg
                  )}
                >
                  <Icon className={cn("h-4 w-4", accent.fg)} />
                </span>
              )}
              <span className="min-w-0 flex-1 truncate text-xs font-semibold">
                {action.label}
              </span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </DashboardCard>
  );
}
