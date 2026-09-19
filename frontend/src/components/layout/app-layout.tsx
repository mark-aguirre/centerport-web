"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { useLayout } from "@/components/layout-provider";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Main application shell with collapsible sidebar and header.
 *
 * Manages sidebar collapsed/expanded state. On screens narrower than
 * 1024px the sidebar collapses automatically. Desktop users can toggle
 * manually via the header button.
 *
 * Layout structure: sidebar (left) | header + scrollable content (right).
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { fullWidth } = useLayout();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Immersive routes (e.g. the POS "new transaction" workspace) hide the
  // sidebar and use the full content width. This is derived from the route, so
  // the sidebar reappears automatically once the user navigates away.
  const immersive = pathname === "/transactions/new";
  const expanded = immersive || fullWidth;

  // On mobile/tablet, collapse by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar — hidden on immersive routes */}
      {!immersive && (
        <div className="hidden h-full md:flex">
          <AppSidebar collapsed={collapsed} onToggle={toggleSidebar} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Immersive routes render their own header (e.g. the POS bar). */}
        {!immersive && (
          <AppHeader
            onToggleSidebar={toggleSidebar}
            sidebarCollapsed={collapsed}
          />
        )}
        <main
          className="flex-1 overflow-auto bg-background"
          style={
            immersive
              ? undefined
              : { paddingLeft: expanded ? "1rem" : "8%", paddingRight: expanded ? "1rem" : "8%" }
          }
          suppressHydrationWarning
        >
          {children}
        </main>
      </div>
    </div>
  );
}
