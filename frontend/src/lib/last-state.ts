"use client";

/**
 * Last-viewed record persistence ("save last state").
 *
 * Remembers which record the user was last looking at on a given page so a
 * reload — or navigating away and coming back — returns them to that record
 * instead of the globally most-recent one.
 *
 * This is distinct from form drafts (`lib/form-draft.ts`):
 * - Drafts capture *unsaved edit-mode work* and live in `sessionStorage`
 *   (transient, dropped when the tab closes).
 * - Last-state captures the *id of the persisted record being viewed* and
 *   lives in `localStorage` so it survives a tab close and browser restart.
 *
 * Only the record id is stored (never form data), so this is safe for
 * read-only view state and carries no unsaved content.
 */

/** Prefix shared with other CenterPort browser-storage keys. */
const LAST_STATE_PREFIX = "centerport-last:";

/** Build the full localStorage key for a given page key. */
function lastStateStorageKey(pageKey: string): string {
  return `${LAST_STATE_PREFIX}${pageKey}`;
}

/**
 * Persist the id of the record currently being viewed on a page.
 *
 * Passing a null/empty id clears the stored value (e.g. when starting a new,
 * unsaved record). Best-effort: never throws into the render/effect path.
 *
 * @param pageKey - Stable per-page key (e.g. "medical", "landbase", "profile").
 * @param recordId - The persisted record's UUID, or null to clear.
 */
export function saveLastRecordId(pageKey: string, recordId: string | null | undefined): void {
  if (typeof window === "undefined") return;
  try {
    const key = lastStateStorageKey(pageKey);
    if (recordId) {
      localStorage.setItem(key, recordId);
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn(
      `Failed to save last-state for "${pageKey}":`,
      error instanceof Error ? error.message : error
    );
  }
}

/**
 * Load the last-viewed record id for a page.
 *
 * @param pageKey - Stable per-page key.
 * @returns The stored record UUID, or null when none is stored / unavailable.
 */
export function loadLastRecordId(pageKey: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(lastStateStorageKey(pageKey));
  } catch {
    return null;
  }
}

/** Remove the persisted last-state for a page. */
export function clearLastRecordId(pageKey: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(lastStateStorageKey(pageKey));
  } catch {
    // Best-effort cleanup; ignore storage errors.
  }
}
