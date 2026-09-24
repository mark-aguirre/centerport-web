"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

/** Navigation chrome style: vertical sidebar or classic horizontal top menu bar. */
export type NavMode = "sidebar" | "topbar";

interface LayoutContextValue {
  fullWidth: boolean;
  setFullWidth: (value: boolean) => void;
  toggleFullWidth: () => void;
  navMode: NavMode;
  setNavMode: (value: NavMode) => void;
  toggleNavMode: () => void;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

const STORAGE_KEY = "centerport-full-width";
const NAV_MODE_KEY = "centerport-nav-mode";

/**
 * Subscribes to cross-tab `storage` events so the layout preference stays in
 * sync when changed in another tab.
 *
 * @param onChange - Callback invoked when the stored value may have changed
 * @returns Cleanup function that removes the listener
 */
function subscribeToStorage(onChange: () => void): () => void {
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

/**
 * Reads the persisted navigation mode from `localStorage`.
 *
 * Defaults to the classic top menu bar (`"topbar"`). Only returns `"sidebar"`
 * when the user has explicitly opted into it.
 *
 * @returns `"sidebar"` when the vertical sidebar is enabled, otherwise `"topbar"`
 */
function getNavModeSnapshot(): NavMode {
  return localStorage.getItem(NAV_MODE_KEY) === "sidebar" ? "sidebar" : "topbar";
}

/**
 * Server snapshot for the navigation mode. Always `"topbar"` to match SSR
 * and the default preference.
 */
function getNavModeServerSnapshot(): NavMode {
  return "topbar";
}

interface LayoutProviderProps {
  children: React.ReactNode;
}

/**
 * Provides layout preferences (full-width toggle, navigation mode) to the tree.
 *
 * Persists preferences in `localStorage` so they survive reloads and stay in
 * sync across tabs via the `storage` event. Reads values with
 * `useSyncExternalStore`, which is SSR-safe and avoids hydration mismatch
 * without needing a `mounted` flag.
 *
 * @see useLayout — consumer hook for reading and updating the preferences
 */
export function LayoutProvider({ children }: LayoutProviderProps) {
  const fullWidth = useSyncExternalStore(
    subscribeToStorage,
    getFullWidthSnapshot,
    getFullWidthServerSnapshot,
  );

  const navMode = useSyncExternalStore(
    subscribeToStorage,
    getNavModeSnapshot,
    getNavModeServerSnapshot,
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

  const setNavMode = useCallback((value: NavMode) => {
    localStorage.setItem(NAV_MODE_KEY, value);
    window.dispatchEvent(new StorageEvent("storage", { key: NAV_MODE_KEY }));
  }, []);

  const toggleNavMode = useCallback(() => {
    const next = localStorage.getItem(NAV_MODE_KEY) === "topbar" ? "sidebar" : "topbar";
    localStorage.setItem(NAV_MODE_KEY, next);
    window.dispatchEvent(new StorageEvent("storage", { key: NAV_MODE_KEY }));
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        fullWidth,
        setFullWidth,
        toggleFullWidth,
        navMode,
        setNavMode,
        toggleNavMode,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

/**
 * Access the current layout preferences and controls.
 *
 * Must be used within a `LayoutProvider`. Throws if called outside one.
 *
 * @returns Object with `fullWidth` / `navMode` state and their setters/togglers
 */
export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
