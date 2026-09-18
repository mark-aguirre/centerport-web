"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  navigation,
  groupNavigation,
  type NavigationGroup,
  type NavigationItem,
} from "@/config/navigation";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Ship,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
} from "lucide-react";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/** True when the given nav item matches the current route. */
function isItemActive(pathname: string, item: NavigationItem): boolean {
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

/**
 * Vertical navigation sidebar with collapsible mode.
 *
 * Renders the app logo, navigation links, and a toggle button at the bottom.
 * In collapsed mode, link text is hidden and tooltips appear on hover.
 * Labeled groups render as collapsible sections when the sidebar is expanded.
 * Active route is highlighted based on the current pathname.
 *
 * @see navigation — route definitions
 */
export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const { canRoute } = useAuth();

  // Only show nav entries the user's roles permit (mirrors backend rules).
  const visibleNavigation = navigation.filter((item) => canRoute(item.href));
  const navigationGroups = groupNavigation(visibleNavigation);

  const renderItem = (item: NavigationItem) => {
    const isActive = isItemActive(pathname, item);
    const Icon = item.icon;

    const linkContent = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span>{item.shortTitle ?? item.title}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger render={linkContent} />
          <TooltipContent side="right" className="font-medium">
            {item.shortTitle ?? item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.href}>{linkContent}</div>;
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div
        className={cn(
          "flex h-14 items-center border-b border-sidebar-border px-4",
          collapsed ? "justify-center" : "gap-3"
        )}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
          <Ship className="h-4 w-4" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground">CenterPort</span>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-5">
        <nav className="flex flex-col gap-4">
          {navigationGroups.map((group, groupIndex) => {
            // Labeled groups become collapsible sections (expanded sidebar only).
            if (group.label && !collapsed) {
              return (
                <NavSection
                  key={group.label}
                  group={group}
                  pathname={pathname}
                  renderItem={renderItem}
                />
              );
            }

            return (
              <div
                key={group.label ?? `group-${groupIndex}`}
                className="flex flex-col gap-1.5"
              >
                {group.label && collapsed && (
                  <div className="mx-2 my-1 h-px bg-sidebar-border" />
                )}
                {group.items.map(renderItem)}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Toggle */}
      <div className={cn("border-t border-sidebar-border p-2", collapsed ? "flex justify-center" : "flex justify-end")}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}

interface NavSectionProps {
  group: NavigationGroup;
  pathname: string;
  renderItem: (item: NavigationItem) => React.ReactNode;
}

/**
 * A labeled, collapsible navigation section. Opens by default and
 * auto-expands whenever it contains the active route.
 */
function NavSection({ group, pathname, renderItem }: NavSectionProps) {
  const hasActive = group.items.some((item) => isItemActive(pathname, item));
  const [open, setOpen] = React.useState(true);

  // Keep the group open when navigating into one of its routes.
  React.useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="flex flex-col gap-1.5">
      <CollapsibleTrigger
        className={cn(
          "group/section flex w-full items-center justify-between rounded-md px-3 py-1",
          "text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50",
          "transition-colors hover:text-sidebar-foreground/80"
        )}
      >
        <span>{group.label}</span>
        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[panel-open]/section:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-1.5">{group.items.map(renderItem)}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
