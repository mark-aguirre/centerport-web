"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CalendarCheck, FlaskConical, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-provider";
import { getDashboardStats, getTodaysVisits } from "@/lib/dashboard-data";
import { ApiError } from "@/lib/http-client";
import { accentForHref, type ModuleAccent } from "@/config/module-theme";
import { cn } from "@/lib/utils";

/** A single actionable notification derived from live operational counts. */
interface Notice {
  id: string;
  title: string;
  detail: string;
  href: string;
  icon: LucideIcon;
  accent: ModuleAccent;
}

/**
 * Header notification bell.
 *
 * Notices are derived from real operational counts rather than a message
 * store: today's registered visits and lab results still awaiting entry. Each
 * notice links to the module that clears it, so the bell doubles as a worklist
 * entry point.
 *
 * Both counts come from endpoints that are role-restricted, so a source is only
 * queried when the user may reach the matching module. A 403 from either call
 * is treated as "nothing to show" rather than an error.
 */
export function NotificationsMenu() {
  const router = useRouter();
  const { canRoute } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);

  const canSeeVisits = canRoute("/visit");
  const canSeeLab = canRoute("/laboratory");

  useEffect(() => {
    let active = true;

    async function load() {
      const next: Notice[] = [];

      if (canSeeVisits) {
        try {
          const visits = await getTodaysVisits();
          if (visits.length > 0) {
            next.push({
              id: "visits-today",
              title: "Visits registered today",
              detail: `${visits.length} ${visits.length === 1 ? "seafarer" : "seafarers"} checked in`,
              href: "/visit",
              icon: CalendarCheck,
              accent: accentForHref("/visit"),
            });
          }
        } catch (err) {
          if (!(err instanceof ApiError && err.status === 403)) {
            console.error("[notifications] getTodaysVisits failed:", err);
          }
        }
      }

      if (canSeeLab) {
        try {
          const stats = await getDashboardStats();
          if (stats.pending_lab_tests > 0) {
            next.push({
              id: "lab-pending",
              title: "Lab tests pending",
              detail: `${stats.pending_lab_tests} awaiting results`,
              href: "/laboratory",
              icon: FlaskConical,
              accent: accentForHref("/laboratory"),
            });
          }
        } catch (err) {
          if (!(err instanceof ApiError && err.status === 403)) {
            console.error("[notifications] getDashboardStats failed:", err);
          }
        }
      }

      if (active) setNotices(next);
    }

    load();
    return () => {
      active = false;
    };
  }, [canSeeVisits, canSeeLab]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full"
            aria-label={
              notices.length > 0
                ? `Notifications, ${notices.length} unread`
                : "Notifications"
            }
          >
            <Bell className="h-4 w-4" />
            {notices.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[11px] leading-none font-bold text-white">
                {notices.length}
              </span>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-72">
        {/* Base UI's Menu.GroupLabel throws without a Menu.Group ancestor, so
            the heading is wrapped even though it labels a single section. */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-semibold text-foreground">
            Notifications
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {notices.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            You are all caught up.
          </p>
        ) : (
          notices.map((notice) => (
            <DropdownMenuItem
              key={notice.id}
              onClick={() => router.push(notice.href)}
              className="cursor-pointer items-start gap-2.5 px-2 py-2"
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                  notice.accent.bg
                )}
              >
                <notice.icon className={cn("h-4 w-4", notice.accent.fg)} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold">
                  {notice.title}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  {notice.detail}
                </span>
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
