"use client";

/**
 * Shared "currently selected patient" pointer.
 *
 * Remembers which seafarer (patient) the user last opened, independent of any
 * one module's record. This is what lets a patient followed on one medical
 * screen (e.g. Seabase) carry over to another (e.g. Panama): each medical form
 * page loads this seafarer's own record for that module.
 *
 * Why a seafarer profile id and not a record id:
 * - `lib/last-state.ts` stores a *record* id per page (e.g. a specific Panama
 *   certificate). Record ids differ between modules for the same person, so
 *   they can't be shared across pages.
 * - The seafarer_profile_id is the one identity every medical record links to,
 *   so it's the correct cross-page "selected patient" key.
 *
 * Stored in `localStorage` so the selection survives navigation, reloads, and
 * browser restarts. Only the profile id is stored (never patient data).
 */

/** Prefix shared with other CenterPort browser-storage keys. */
const SELECTED_PATIENT_KEY = "centerport-selected-patient";

/**
 * Window event dispatched when the selected patient changes, so listeners in
 * the same tab (e.g. nav links) can react. The native `storage` event only
 * fires in *other* tabs, so we emit our own for the current tab.
 */
const SELECTED_PATIENT_EVENT = "centerport:selected-patient-change";

type Listener = (profileId: string | null) => void;

/**
 * Persist the currently selected seafarer profile id.
 *
 * Passing a null/empty id clears the selection. Best-effort: never throws into
 * the render/effect path.
 *
 * @param profileId - The seafarer's profile UUID, or null to clear.
 */
export function saveSelectedPatientId(profileId: string | null | undefined): void {
  if (typeof window === "undefined") return;
  try {
    const previous = localStorage.getItem(SELECTED_PATIENT_KEY);
    if (profileId) {
      localStorage.setItem(SELECTED_PATIENT_KEY, profileId);
    } else {
      localStorage.removeItem(SELECTED_PATIENT_KEY);
    }
    // Notify same-tab listeners only when the value actually changed.
    if (previous !== (profileId ?? null)) {
      window.dispatchEvent(
        new CustomEvent<string | null>(SELECTED_PATIENT_EVENT, {
          detail: profileId ?? null,
        })
      );
    }
  } catch (error) {
    console.warn(
      "Failed to save the selected patient:",
      error instanceof Error ? error.message : error
    );
  }
}

/**
 * Load the currently selected seafarer profile id.
 *
 * @returns The stored profile UUID, or null when none is selected / unavailable.
 */
export function loadSelectedPatientId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(SELECTED_PATIENT_KEY);
  } catch {
    return null;
  }
}

/** Clear the selected patient. */
export function clearSelectedPatientId(): void {
  saveSelectedPatientId(null);
}

/**
 * Subscribe to selected-patient changes (both same-tab custom events and
 * cross-tab `storage` events).
 *
 * @param listener - Called with the new profile id (or null when cleared).
 * @returns An unsubscribe function.
 */
export function subscribeSelectedPatient(listener: Listener): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustom = (event: Event) => {
    const detail = (event as CustomEvent<string | null>).detail ?? null;
    listener(detail);
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key === SELECTED_PATIENT_KEY) {
      listener(event.newValue ?? null);
    }
  };

  window.addEventListener(SELECTED_PATIENT_EVENT, handleCustom);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(SELECTED_PATIENT_EVENT, handleCustom);
    window.removeEventListener("storage", handleStorage);
  };
}
