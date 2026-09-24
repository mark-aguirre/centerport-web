"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Ship, ChevronDown } from "lucide-react";
import {
  navigation,
  groupNavigation,
  buildNavHref,
  type NavigationItem,
} from "@/config/navigation";
import { useAuth } from "@/components/auth-provider";
import { useSelectedPatient } from "@/hooks/use-selected-patient";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSelector } from "@/components/theme-selector";
import { FullWidthToggle } from "@/components/layout/full-width-toggle";
import { NavModeToggle } from "@/components/layout/nav-mode-toggle";
import { UserMenu } from "@/components/layout/user-menu";

/** True when the given nav item matches the current route. */
function isItemActive(pathname: string, item: NavigationItem): boolean {
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

/**
 * Per-route icon color for the quick-access toolbar, echoing the colorful
 * button strip of the legacy desktop app. Keyed by route href; routes without
 * an entry fall back to the primary brand color.
 */
/**
 * Full-word toolbar labels, echoing the legacy desktop toolbar (e.g. "Sea-Base",
 * "Land-Base"). Used instead of the abbreviated `shortTitle` and the long,
 * sentence-length `title`. Routes without an entry fall back to the full title.
 */
/**
 * Routes intentionally excluded from the quick-access toolbar strip. They
 * remain reachable through the menu-bar dropdowns.
 */
const TOOLBAR_HIDDEN = new Set<string>(["/medical-personnel"]);

/**
 * Route prefixes where the Row 3 CRUD action bar is suppressed entirely.
 *
 * These pages are not FormToolbar-based CRUD forms (Dashboard, Visit, and the
 * accounting screens use their own layouts and never portal actions into the
 * strip), so the action bar would otherwise render as an empty band. A prefix
 * match hides it for nested routes too (e.g. /transactions/new). */
const ACTION_BAR_HIDDEN_PREFIXES = [
  "/dashboard",
  "/visit",
  "/transactions",
  "/receivable",
  "/listing",
];

const TOOLBAR_LABELS: Record<string, string> = {
  "/seabase": "Sea-Base",
  "/mlc": "MLC",
  "/panama": "Panama",
  "/landbase": "Land-Base",
  "/psychology": "Psychology",
  "/receivable/report": "Receivable",
  "/listing": "Item Listing",
  "/medical-personnel": "Personnel",
};

const ICON_COLORS: Record<string, string> = {
  "/dashboard": "text-sky-500",
  "/visit": "text-amber-500",
  "/profile": "text-blue-600",
  "/seabase": "text-rose-500",
  "/laboratory": "text-teal-500",
  "/mlc": "text-indigo-500",
  "/panama": "text-emerald-600",
  "/landbase": "text-orange-500",
  "/psychology": "text-fuchsia-500",
  "/transactions": "text-green-600",
  "/receivable/report": "text-cyan-600",
  "/listing": "text-violet-500",
  "/medical-personnel": "text-red-500",
};

/**
 * Classic horizontal top navigation, styled after the legacy desktop app.
 *
 * Renders two rows:
 * 1. A menu bar — brand + one dropdown per navigation group (Patient,
 *    Medical Examination, Accounting, Setting) plus standalone links, and the
 *    theme / width / layout controls on the right.
 * 2. A quick-access icon toolbar of every permitted route, mirroring the
 *    large-button toolbar of the original Windows application.
 *
 * Presented as an alternative to {@link AppSidebar}; the active choice is
 * persisted through the LayoutProvider.
 *
 * @see navigation — route definitions
 */
export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { canRoute } = useAuth();
  // Carry the selected seafarer into per-seafarer medical modules so opening
  // one after another (e.g. Seabase -> Panama) shows the same patient.
  const selectedPatientId = useSelectedPatient();

  // Only show nav entries the user's roles permit (mirrors backend rules).
  const visibleNavigation = navigation.filter((item) => canRoute(item.href));
  const navigationGroups = groupNavigation(visibleNavigation);

  // Suppress the Row 3 CRUD action bar on non-form pages so it doesn't render
  // as an empty band (see ACTION_BAR_HIDDEN_PREFIXES).
  const showActionBar = !ACTION_BAR_HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-border bg-card">
      {/* Row 1 — Menu bar */}
      <div className="flex h-9 items-center gap-0.5 px-3 md:px-4">
        {/* Brand */}
        <Link href="/dashboard" className="mr-2 flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            <Ship className="h-4 w-4" />
          </span>
          <span className="hidden text-base font-bold tracking-tight sm:inline">
            CenterPort
          </span>
        </Link>

        {/* Menu groups */}
        <nav className="flex items-center gap-0.5">
          {navigationGroups.map((group, groupIndex) => {
            // Standalone items (no group label) render as plain top-level links.
            if (!group.label) {
              return group.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(pathname, item);
                return (
                  <Link
                    key={item.href}
                    href={buildNavHref(item.href, selectedPatientId)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-accent/60 hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.shortTitle ?? item.title}</span>
                  </Link>
                );
              });
            }

            // Labeled groups become dropdown menus.
            const hasActive = group.items.some((item) =>
              isItemActive(pathname, item)
            );

            return (
              <DropdownMenu key={group.label ?? `group-${groupIndex}`}>
                <DropdownMenuTrigger
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold transition-colors focus-visible:outline-none",
                    hasActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-accent/60 hover:text-accent-foreground"
                  )}
                >
                  {group.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-56">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isItemActive(pathname, item);
                    return (
                      <DropdownMenuItem
                        key={item.href}
                        onClick={() =>
                          router.push(buildNavHref(item.href, selectedPatientId))
                        }
                        className={cn(
                          "flex cursor-pointer items-center gap-2",
                          active &&
                            "bg-primary font-semibold text-primary-foreground focus:bg-primary focus:text-primary-foreground focus:**:text-primary-foreground"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            active ? "text-primary-foreground" : "text-primary"
                          )}
                        />
                        <span>{item.shortTitle ?? item.title}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Right-side controls */}
        <div className="flex items-center gap-1">
          <NavModeToggle />
          <FullWidthToggle />
          <ThemeSelector />
          <UserMenu />
        </div>
      </div>

      {/* Row 2 — Quick-access icon toolbar (classic large buttons), grouped
          by category with a vertical separator between each group. Some routes
          (e.g. Medical Personnel) stay in the menus but are hidden here. */}
      <div className="flex items-stretch gap-1 overflow-x-auto border-t border-border/60 bg-muted/30 px-3 py-1.5 md:px-4 [&::-webkit-scrollbar]:hidden">
        {navigationGroups
          .map((group) => ({
            ...group,
            items: group.items.filter(
              (item) => !TOOLBAR_HIDDEN.has(item.href)
            ),
          }))
          .filter((group) => group.items.length > 0)
          .map((group, groupIndex) => (
          <div
            key={group.label ?? `toolbar-group-${groupIndex}`}
            className="flex items-stretch gap-1"
          >
            {/* Divider before every group except the first. */}
            {groupIndex > 0 && (
              <div
                className="mx-1 w-px shrink-0 self-stretch bg-border"
                aria-hidden="true"
              />
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(pathname, item);
              const iconColor = ICON_COLORS[item.href] ?? "text-primary";
              const label = TOOLBAR_LABELS[item.href] ?? item.title;
              return (
                <Link
                  key={item.href}
                  href={buildNavHref(item.href, selectedPatientId)}
                  title={item.title}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex w-24 shrink-0 flex-col items-center gap-1 rounded-lg px-1.5 py-1.5 transition-all",
                    active
                      ? "bg-primary/10 text-primary shadow-sm ring-2 ring-primary/70"
                      : "hover:bg-accent/60"
                  )}
                >
                  {/* Bottom accent bar reinforces the active tile for at-a-glance
                      legibility (important for senior users). */}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2 bottom-0.5 h-1 rounded-full bg-primary"
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-7 w-7 shrink-0 transition-transform group-hover:scale-110",
                      active ? "scale-110" : "",
                      iconColor
                    )}
                  />
                  <span
                    className={cn(
                      "w-full text-center text-[11px] leading-tight",
                      active
                        ? "font-bold text-primary"
                        : "font-semibold text-foreground/80"
                    )}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Row 3 — CRUD action bar (classic desktop layout).

          Dedicated strip beneath the quick-access toolbar that mirrors the
          legacy desktop app's action row (New / Save / Edit / Cancel / Print).
          Form pages portal their FormToolbar buttons into #app-header-actions
          (the same target the sidebar layout's AppHeader provides), so the
          portal works unchanged in both layouts.

          The strip only appears on large screens (below `lg`, FormToolbar
          renders its buttons inline next to the form) and is suppressed on
          non-form pages via `showActionBar` so it never renders as an empty
          band on Dashboard, Visit, or the accounting screens. */}
      {showActionBar && (
        <div className="hidden min-h-9 items-center border-t border-border/60 bg-muted/20 px-3 py-1.5 md:px-4 lg:flex">
          <div
            id="app-header-actions"
            role="toolbar"
            aria-label="Page actions"
            className="flex items-center gap-2"
          />
        </div>
      )}
    </header>
  );
}
