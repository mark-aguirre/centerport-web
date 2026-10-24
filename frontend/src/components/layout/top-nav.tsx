"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Cross, Settings, type LucideIcon } from "lucide-react";
import {
  navigation,
  groupNavigation,
  buildNavHref,
  type NavigationItem,
} from "@/config/navigation";
import { accentForHref } from "@/config/module-theme";
import { useAuth } from "@/components/auth-provider";
import { useLayout } from "@/components/layout-provider";
import { useSelectedPatient } from "@/hooks/use-selected-patient";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DisplaySettingsItems } from "@/components/layout/display-settings-items";
import { NavSearch } from "@/components/layout/nav-search";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { UserMenu } from "@/components/layout/user-menu";

/** True when the given nav item matches the current route. */
function isItemActive(pathname: string, item: NavigationItem): boolean {
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

/**
 * Short tile labels for the navigation strip.
 *
 * The `title` in navigation.ts is the formal certificate name (sentence-long
 * for several modules), which cannot fit in a tile. These are the operational
 * names staff use day to day. Routes without an entry fall back to
 * `shortTitle ?? title`.
 */
const NAV_LABELS: Record<string, string> = {
  "/seabase": "Sea-Base",
  "/landbase": "Land-Base",
  "/mlc": "MLC",
  "/panama": "Panama",
  "/psychology": "Psychology",
  "/default-values": "Default Values",
  "/medical-personnel": "Personnel",
};

/** Tile caption for a module. */
function navLabel(item: NavigationItem): string {
  return NAV_LABELS[item.href] ?? item.shortTitle ?? item.title;
}

/**
 * Navigation group whose items live in the Settings tile.
 *
 * Settings is pulled out of the normal group loop because its dropdown also
 * carries the display preferences, which every user needs. Rendering it from
 * the loop would make it vanish for any role that cannot reach a single
 * settings route (Releasing, for instance, has neither Default Values nor
 * Medical Personnel), taking the theme and layout controls with it.
 */
const SETTINGS_GROUP = "Setting";

/**
 * Route prefixes where the CRUD action bar is suppressed entirely.
 *
 * These pages are not FormToolbar-based CRUD forms (Dashboard and Visit use
 * their own layouts and never portal actions into the strip), so the action bar
 * would otherwise render as an empty band. A prefix match hides it for nested
 * routes too.
 */
const ACTION_BAR_HIDDEN_PREFIXES = ["/dashboard", "/visit"];

/** Shared geometry for both tile kinds (links and group dropdowns). */
const TILE_CLASSES =
  "group flex h-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-2.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Tile icon classes.
 *
 * The strip is deliberately monochrome: every inactive module uses the same
 * grey so the one tinted tile reads as "you are here" at a glance. Per-module
 * accent colours still appear where they identify a single record or menu entry
 * (dropdowns, search results, dashboard), just not across the strip, where
 * fifteen competing hues leave nothing standing out.
 *
 * The grey is `foreground/75` rather than `muted-foreground`: muted sits at
 * oklch 0.58 lightness in the clinic theme, which washes out against the white
 * bar at icon weight.
 */
function tileIconClasses(active: boolean): string {
  return cn(
    "h-[18px] w-[18px] shrink-0 transition-colors",
    active ? "text-primary" : "text-foreground/75 group-hover:text-foreground"
  );
}

/**
 * Vertical rule between tile clusters.
 *
 * Decorative, so it is hidden from assistive tech — the grouping it hints at
 * is already conveyed by the nav landmark and the group labels in the menus.
 */
function NavDivider() {
  return (
    <span
      aria-hidden="true"
      className="mx-1.5 h-6 w-px shrink-0 self-center bg-border"
    />
  );
}

/** Tile caption. Hidden by CSS when compact navigation is enabled. */
function NavTileLabel({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <span
      data-nav-label
      className={cn(
        "text-[11px] leading-none whitespace-nowrap transition-colors",
        active
          ? "font-semibold text-primary"
          : "font-medium text-foreground/75 group-hover:text-foreground"
      )}
    >
      {label}
    </span>
  );
}

/** Dropdown tile that opens a menu of related modules. */
function GroupMenuTile({
  label,
  icon: Icon,
  highlight,
  children,
}: {
  label: string;
  icon: LucideIcon;
  highlight: boolean;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={label}
        className={cn(
          TILE_CLASSES,
          highlight ? "bg-primary/10" : "hover:bg-accent"
        )}
      >
        <span className="flex items-center gap-0.5">
          <Icon className={tileIconClasses(highlight)} />
          <ChevronDown
            className={cn(
              "h-3 w-3 shrink-0 transition-colors",
              highlight ? "text-primary" : "text-foreground/60"
            )}
          />
        </span>
        <NavTileLabel label={label} active={highlight} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Dropdown entry for one module: short label above its formal name. */
function ModuleMenuItem({
  item,
  active,
  onSelect,
}: {
  item: NavigationItem;
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = item.icon;
  const accent = accentForHref(item.href);

  return (
    <DropdownMenuItem
      onClick={onSelect}
      className={cn(
        "cursor-pointer items-start gap-2 py-1.5",
        active &&
          "bg-primary font-semibold text-primary-foreground focus:bg-primary focus:text-primary-foreground focus:**:text-primary-foreground"
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 h-4 w-4",
          active ? "text-primary-foreground" : accent.fg
        )}
      />
      <span className="min-w-0">
        <span className="block text-xs font-semibold">{navLabel(item)}</span>
        <span
          className={cn(
            "block text-[11px]",
            active ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {item.subtitle ?? item.title}
        </span>
      </span>
    </DropdownMenuItem>
  );
}

/**
 * Horizontal top navigation.
 *
 * Row 1 is the navigation strip: brand, one icon-and-label tile per module, a
 * Settings tile, and the search / notifications / user controls on the right.
 * Tiles are monochrome (see {@link tileIconClasses}) so the single tinted tile
 * marks the current route. Every module is a tile of its own; only Settings
 * collapses into a dropdown, because it also carries the display preferences.
 *
 * Row 2 is the CRUD action bar. Form pages portal their FormToolbar buttons
 * into `#app-header-actions`, the same target the sidebar layout's AppHeader
 * provides, so the portal works unchanged in both layouts.
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
  const { fullWidth } = useLayout();
  // Carry the selected seafarer into per-seafarer medical modules so opening
  // one after another (e.g. Seabase -> Panama) shows the same patient.
  const selectedPatientId = useSelectedPatient();

  // Only show nav entries the user's roles permit (mirrors backend rules).
  const visibleNavigation = navigation.filter((item) => canRoute(item.href));
  const navigationGroups = groupNavigation(visibleNavigation);

  const moduleGroups = navigationGroups.filter(
    (group) => group.label !== SETTINGS_GROUP
  );
  const settingsItems =
    navigationGroups.find((group) => group.label === SETTINGS_GROUP)?.items ??
    [];

  // Suppress the CRUD action bar on non-form pages so it doesn't render as an
  // empty band (see ACTION_BAR_HIDDEN_PREFIXES).
  const showActionBar = !ACTION_BAR_HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  /** Navigates to a module, carrying the selected seafarer where supported. */
  const go = (href: string) =>
    router.push(buildNavHref(href, selectedPatientId));

  /** Renders one module as a navigation tile. */
  const renderTile = (item: NavigationItem) => {
    const Icon = item.icon;
    const active = isItemActive(pathname, item);

    return (
      <Link
        key={item.href}
        href={buildNavHref(item.href, selectedPatientId)}
        title={item.title}
        aria-current={active ? "page" : undefined}
        className={cn(
          TILE_CLASSES,
          active ? "bg-primary/10" : "hover:bg-accent"
        )}
      >
        <Icon className={tileIconClasses(active)} />
        <NavTileLabel label={navLabel(item)} active={active} />
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-border bg-card">
      {/* Row 1 — navigation strip */}
      <div className="flex h-14 items-center gap-1 px-3 md:px-4">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="mr-3 flex shrink-0 items-center gap-2"
          aria-label="CenterPort home"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Cross className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-base font-bold tracking-tight">
              CenterPort
            </span>
            <span className="text-[11px] text-muted-foreground">
              Patient Care. Connected.
            </span>
          </span>
        </Link>

        {/* Module tiles */}
        <nav
          aria-label="Main"
          className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        >
          {/* Every module gets its own tile — the strip is flat, so a route is
              always one click away rather than hidden behind a group menu.
              Dividers fall on the group boundaries declared in navigation.ts
              (Dashboard | Visit, Patient | Medical Certificate | Laboratory |
              Radiology | Psychology), so the strip reads in clusters instead
              of as fifteen equal tiles. */}
          {moduleGroups.map((group, index) => (
            <Fragment key={group.label ?? `group-${index}`}>
              {index > 0 && <NavDivider />}
              {group.items.map(renderTile)}
            </Fragment>
          ))}

          {/* Settings — always present, since it also holds the display
              preferences (theme, width, navigation density). The divider is
              conditional so it never leads the strip for a role with no
              module tiles at all. */}
          {moduleGroups.length > 0 && <NavDivider />}
          <GroupMenuTile
            label="Settings"
            icon={Settings}
            highlight={settingsItems.some((item) =>
              isItemActive(pathname, item)
            )}
          >
            {/* Page links first, under their own header so they read as
                navigation rather than as more display preferences. The header
                is conditional because a role may reach neither settings route
                (Releasing has neither), leaving a label over nothing. */}
            {settingsItems.length > 0 && (
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[11px] font-semibold tracking-wider uppercase">
                  Pages
                </DropdownMenuLabel>
                {settingsItems.map((item) => (
                  <ModuleMenuItem
                    key={item.href}
                    item={item}
                    active={isItemActive(pathname, item)}
                    onSelect={() => go(item.href)}
                  />
                ))}
              </DropdownMenuGroup>
            )}
            <DisplaySettingsItems />
          </GroupMenuTile>
        </nav>

        {/* Right-side controls — separated from the module strip, since these
            act on the session rather than navigating to a module. */}
        <div className="flex shrink-0 items-center gap-0.5">
          <NavDivider />
          <NavSearch />
          <NotificationsMenu />
          <UserMenu variant="chip" />
        </div>
      </div>

      {/* Row 2 — CRUD action bar.

          Dedicated strip beneath the navigation that mirrors the legacy desktop
          app's action row (New / Save / Edit / Cancel / Print). Form pages
          portal their FormToolbar buttons into #app-header-actions.

          The strip only appears on large screens (below `lg`, FormToolbar
          renders its buttons inline next to the form) and is suppressed on
          non-form pages via `showActionBar`. */}
      {showActionBar && (
        <div
          className="hidden min-h-9 items-center border-t border-border/60 bg-muted/30 py-1.5 lg:flex"
          style={{
            paddingLeft: fullWidth ? "1rem" : "8%",
            paddingRight: fullWidth ? "1rem" : "8%",
          }}
          suppressHydrationWarning
        >
          {/* Inner inset mirrors PageContainer's p-[10px] so the action
              buttons line up with the left/right edges of the form content. */}
          <div
            id="app-header-actions"
            role="toolbar"
            aria-label="Page actions"
            className="flex w-full items-center gap-2 px-[10px]"
          />
        </div>
      )}
    </header>
  );
}
