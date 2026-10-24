"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { TopNav } from "./top-nav";
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
  const { fullWidth, navMode } = useLayout();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Immersive routes (e.g. the POS "new transaction" workspace) hide the
  // sidebar and use the full content width. This is derived from the route, so
  // the sidebar reappears automatically once the user navigates away.
  const immersive = pathname === "/sale";
  // Routes that open with a full-bleed PageBanner band. They are data-heavy
  // overviews rather than forms, so they always use the full content width —
  // the 8% gutters would squeeze the dashboard's three-column grid and the
  // visit list's wide table into unreadable columns.
  const wideRoute = pathname === "/dashboard" || pathname === "/visit";
  const expanded = immersive || wideRoute || fullWidth;

  // Side gutter for the content area. The banner routes take none at all: a
  // full-bleed band has to meet the left and right edges of the window, and a
  // gutter here cannot be cancelled from inside the page. Their content gets
  // breathing room from the page's own `px-[24px]` on PageContainer instead,
  // which the banner cancels with a matching negative margin.
  const gutter = wideRoute ? "0px" : expanded ? "1rem" : "8%";

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

  // Classic top menu bar layout — navigation lives in a horizontal bar above
  // the content instead of a sidebar. Immersive routes still opt out entirely.
  if (navMode === "topbar" && !immersive) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <TopNav />
        <main
          className="flex-1 overflow-auto bg-background"
          style={{ paddingLeft: gutter, paddingRight: gutter }}
          suppressHydrationWarning
        >
          {children}
        </main>
      </div>
    );
  }

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
              : { paddingLeft: gutter, paddingRight: gutter }
          }
          suppressHydrationWarning
        >
          {children}
        </main>
      </div>
    </div>
  );
}
