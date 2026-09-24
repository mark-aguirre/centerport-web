"use client";

import { useSyncExternalStore } from "react";
import {
  loadSelectedPatientId,
  subscribeSelectedPatient,
} from "@/lib/selected-patient";

/**
 * Read the currently selected seafarer (patient) id, re-rendering when it
 * changes — including changes made in another browser tab.
 *
 * Backed by {@link subscribeSelectedPatient}; used by navigation to carry the
 * selected patient into per-seafarer medical modules.
 *
 * @returns The selected seafarer profile id, or null when none is selected.
 */
export function useSelectedPatient(): string | null {
  return useSyncExternalStore(
    subscribeSelectedPatient,
    // Client snapshot: read from localStorage.
    () => loadSelectedPatientId(),
    // Server snapshot: nothing is selected during SSR.
    () => null
  );
}
