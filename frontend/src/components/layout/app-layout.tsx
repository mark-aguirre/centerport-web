"use client";

import { useState, useCallback, useEffect } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

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
  const [collapsed, setCollapsed] = useState(false);

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
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <AppSidebar collapsed={collapsed} onToggle={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={collapsed}
        />
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
