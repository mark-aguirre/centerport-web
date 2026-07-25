"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Ship, PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Vertical navigation sidebar with collapsible mode.
 *
 * Renders the app logo, navigation links, and a toggle button at the bottom.
 * In collapsed mode, link text is hidden and tooltips appear on hover.
 * Active route is highlighted based on the current pathname.
 *
 * @see navigation — route definitions
 */
export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();

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
        <nav className="flex flex-col gap-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
