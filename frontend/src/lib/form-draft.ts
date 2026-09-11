"use client";

/**
 * Form draft persistence.
 *
 * Keeps unsaved form work alive across a page reload. When a user is in
 * New or Edit mode and refreshes the browser, the entered data, selections,
 * and current mode are restored so they can continue where they left off.
 *
 * Drafts are stored in `sessionStorage` so they are:
 * - scoped to the current browser tab (no cross-tab bleed)
 * - automatically dropped when the tab is closed (drafts are transient by design)
 * - survive a reload / navigation refresh within the same tab
 *
 * A draft is only written while the form is in edit mode, and is cleared on
 * Save and Cancel. It is never written for read-only (view) state.
 */

/** Prefix shared with other CenterPort browser-storage keys. */
const DRAFT_PREFIX = "centerport-draft:";

/**
 * A persisted snapshot of an in-progress form.
 *
 * @typeParam T - The form record type.
 */
export interface FormDraft<T> {
  /** Serialized form data. */
  data: T;
  /** Whether the form was in edit mode when saved. */
  editing: boolean;
  /** Whether the draft represents an edit of a persisted record. */
  isExistingRecord: boolean;
  /**
   * The record id from the URL (`?id=`) at the time the draft was written,
   * or null when creating a new record. Used to make sure a draft is only
   * restored into the same URL context it was created in.
   */
  editId: string | null;
  /** Timestamp (ms) the draft was last written, for optional expiry. */
  savedAt: number;
}

/** Build the full sessionStorage key for a given draft key. */
function draftStorageKey(draftKey: string): string {
  return `${DRAFT_PREFIX}${draftKey}`;
}

/**
 * Persist a form draft to sessionStorage.
 *
 * No-ops on the server or if storage is unavailable (e.g. quota exceeded,
 * private-mode restrictions). Persistence is best-effort and must never
 * throw into the render/effect path.
 */
export function saveDraft<T>(draftKey: string, draft: Omit<FormDraft<T>, "savedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const payload: FormDraft<T> = { ...draft, savedAt: Date.now() };
    sessionStorage.setItem(draftStorageKey(draftKey), JSON.stringify(payload));
  } catch (error) {
    console.warn(
      `Failed to save form draft for "${draftKey}":`,
      error instanceof Error ? error.message : error
    );
  }
}

/**
 * Load a form draft from sessionStorage.
 *
 * Returns null when no draft exists, when it cannot be parsed, or when it
 * does not belong to the given URL context (`editId`). A corrupted entry is
 * removed so it cannot poison future loads.
 *
 * @param draftKey - Stable per-entity key.
 * @param editId - The current URL record id (null for a new record). The draft
 *   is only returned when its stored `editId` matches this value, so a draft
 *   started for one record is never applied to a different one.
 */
export function loadDraft<T>(draftKey: string, editId: string | null): FormDraft<T> | null {
  if (typeof window === "undefined") return null;
  const key = draftStorageKey(draftKey);
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as FormDraft<T>;
    // Only restore into the same URL context the draft was created in.
    if ((parsed.editId ?? null) !== (editId ?? null)) return null;
    // Only restore in-progress (edit-mode) drafts; view state is not a draft.
    if (!parsed.editing) return null;
    return parsed;
  } catch {
    console.warn(`Failed to parse form draft for "${draftKey}", clearing it.`);
    sessionStorage.removeItem(key);
    return null;
  }
}

/** Remove a persisted draft (called on Save and Cancel). */
export function clearDraft(draftKey: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(draftStorageKey(draftKey));
  } catch {
    // Best-effort cleanup; ignore storage errors.
  }
}
