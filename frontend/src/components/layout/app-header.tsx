"use client";

import { usePathname } from "next/navigation";
import { Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeSelector } from "@/components/theme-selector";
import { navigation } from "@/config/navigation";

interface AppHeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

/**
 * Top navigation bar with page title, search, theme toggle, and user avatar.
 *
 * Derives the current page title from the navigation config based on
 * the active pathname. Shows a sidebar toggle on mobile/tablet.
 */
export function AppHeader({ onToggleSidebar, sidebarCollapsed }: AppHeaderProps) {
  const pathname = usePathname();

  const currentNav = navigation.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );
  const pageTitle = currentNav?.title ?? "CenterPort";

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
      {/* Mobile/Tablet: Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="lg:hidden"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Ship className="h-5 w-5" />
      </Button>

      {/* Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold tracking-tight">{pageTitle}</h1>
        {currentNav?.subtitle && (
          <span className="text-sm text-muted-foreground font-normal">{currentNav.subtitle}</span>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <ThemeSelector />

        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
            CP
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
