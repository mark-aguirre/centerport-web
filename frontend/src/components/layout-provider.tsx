"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface LayoutContextValue {
  fullWidth: boolean;
  setFullWidth: (value: boolean) => void;
  toggleFullWidth: () => void;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

const STORAGE_KEY = "centerport-full-width";

interface LayoutProviderProps {
  children: React.ReactNode;
}

/**
 * Provides layout preferences (full-width toggle) to the component tree.
 *
 * Persists the user's preference in localStorage so it survives page reloads.
 * Follows the same pattern as `ThemeProvider`.
 */
export function LayoutProvider({ children }: LayoutProviderProps) {
  // Always start false to match SSR output and avoid hydration mismatch.
  // The blocking <script> in layout.tsx sets data-full-width on <html> to
  // prevent layout flash before this effect runs.
  const [fullWidth, setFullWidthState] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Sync from localStorage after mount.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setFullWidthState(saved === "true");
    setMounted(true);
  }, []);

  // Keep data-full-width attribute in sync on <html> — only after initial mount
  // to avoid overriding the blocking script's attribute before localStorage is read.
  useEffect(() => {
    if (!mounted) return;
    if (fullWidth) {
      document.documentElement.setAttribute("data-full-width", "true");
    } else {
      document.documentElement.removeAttribute("data-full-width");
    }
  }, [fullWidth, mounted]);

  const setFullWidth = useCallback((value: boolean) => {
    setFullWidthState(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }, []);

  const toggleFullWidth = useCallback(() => {
    setFullWidthState((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return (
    <LayoutContext.Provider value={{ fullWidth, setFullWidth, toggleFullWidth }}>
      {children}
    </LayoutContext.Provider>
  );
}

/**
 * Access the current layout preferences and controls.
 *
 * Must be used within a `LayoutProvider`. Throws if called outside one.
 *
 * @returns Object with `fullWidth` state and `setFullWidth` / `toggleFullWidth` functions
 */
export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
