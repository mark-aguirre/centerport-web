"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type AppTheme = "sand" | "ocean";

interface ThemeContextValue {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "centerport-theme";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: AppTheme;
}

export function ThemeProvider({ children, defaultTheme = "ocean" }: ThemeProviderProps) {
  // Resolve initial theme from localStorage synchronously to avoid FOUC.
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const saved = localStorage.getItem(STORAGE_KEY) as AppTheme | null;
    if (saved && (saved === "sand" || saved === "ocean")) return saved;
    return defaultTheme;
  });

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Accesses the current theme and the setter to switch themes.
 *
 * Must be used within a `ThemeProvider`. Throws if called outside one.
 *
 * @returns Object with current `theme` value and `setTheme` function
 *
 * @example
 * ```tsx
 * const { theme, setTheme } = useTheme();
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
