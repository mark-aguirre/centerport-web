"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

interface LayoutContextValue {
  fullWidth: boolean;
  setFullWidth: (value: boolean) => void;
  toggleFullWidth: () => void;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

const STORAGE_KEY = "centerport-full-width";

/**
 * Subscribes to cross-tab `storage` events so the layout preference stays in
 * sync when changed in another tab.
 *
 * @param onChange - Callback invoked when the stored value may have changed
 * @returns Cleanup function that removes the listener
 */
function subscribeToFullWidth(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/**
 * Reads the persisted full-width preference from `localStorage`.
 *
 * @returns `true` when full-width mode is enabled, otherwise `false`
 */
function getFullWidthSnapshot(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

/**
 * Server snapshot for `useSyncExternalStore`.
 *
 * Always `false` to match the SSR output. The blocking `<script>` in
 * `layout.tsx` sets `data-full-width` on `<html>` to prevent layout flash
 * before hydration completes.
 */
function getFullWidthServerSnapshot(): boolean {
  return false;
}

interface LayoutProviderProps {
  children: React.ReactNode;
}

/**
 * Provides layout preferences (full-width toggle) to the component tree.
 *
 * Persists the user's preference in `localStorage` so it survives page reloads
 * and stays in sync across tabs via the `storage` event. Reads the value with
 * `useSyncExternalStore`, which is SSR-safe and avoids hydration mismatch
 * without needing a `mounted` flag.
 *
 * @see useLayout — consumer hook for reading and updating the preference
 */
export function LayoutProvider({ children }: LayoutProviderProps) {
  const fullWidth = useSyncExternalStore(
    subscribeToFullWidth,
    getFullWidthSnapshot,
    getFullWidthServerSnapshot,
  );

  // Keep the data-full-width attribute on <html> in sync with the preference.
  useEffect(() => {
    if (fullWidth) {
      document.documentElement.setAttribute("data-full-width", "true");
    } else {
      document.documentElement.removeAttribute("data-full-width");
    }
  }, [fullWidth]);

  const setFullWidth = useCallback((value: boolean) => {
    localStorage.setItem(STORAGE_KEY, String(value));
    // Notify same-tab subscribers (storage event only fires in other tabs).
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  }, []);

  const toggleFullWidth = useCallback(() => {
    const next = localStorage.getItem(STORAGE_KEY) !== "true";
    localStorage.setItem(STORAGE_KEY, String(next));
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
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
