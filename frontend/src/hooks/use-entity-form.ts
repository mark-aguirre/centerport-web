"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { SeafarerProfile } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import { humanizeField } from "@/lib/form-utils";
import { saveDraft, loadDraft, clearDraft } from "@/lib/form-draft";
import { saveLastRecordId, loadLastRecordId, clearLastRecordId } from "@/lib/last-state";
import { useProfileSearch } from "./use-profile-search";
import type { RecordSummary } from "@/components/common/record-selector";

// ---------------------------------------------------------------------------
// Configuration types
// ---------------------------------------------------------------------------

/**
 * API methods required for a single entity.
 *
 * Each entity module (LandbasePeme, MedicalExam, etc.) exposes these
 * methods on `api.entities.{Entity}`. The generic hook calls them
 * without knowing which entity it's working with.
 */
export interface EntityApi<T> {
  filter(filters: { id?: string }): Promise<T[]>;
  list(orderBy: string, limit: number): Promise<T[]>;
  create(data: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  search(keyword: string, limit?: number): Promise<T[]>;
  listByProfile(profileId: string): Promise<T[]>;
}

/**
 * Configuration object that defines how `useEntityForm` behaves
 * for a specific entity type.
 *
 * Each form module provides one of these to get full CRUD behavior
 * without re-implementing the state machine.
 */
export interface EntityFormConfig<T> {
  /** API methods for this entity (e.g. `api.entities.LandbasePeme`) */
  entityApi: EntityApi<T>;

  /** Empty default state for a new record (all fields initialized) */
  emptyRecord: T;

  /**
   * Transform raw API response to flat form model.
   * Handles nested `seafarer_profile` flattening and null coercion.
   */
  flattenResponse: (raw: T) => T;

  /**
   * Strip system-managed fields before sending to backend.
   * Returns the payload without id, created_date, etc.
   */
  stripSystemFields: (record: T) => Partial<T>;

  /**
   * Sanitize payload (empty strings → null, etc.) before API call.
   */
  sanitizePayload: (record: Partial<T>) => Partial<T>;

  /**
   * Validate form data before save.
   * Return an error message string to block save, or null to proceed.
   * If null is returned, the standard name validation still applies.
   */
  validate?: (data: T) => string | null;

  /**
   * Build partial personal data from a selected SeafarerProfile.
   * Maps profile fields to the entity's personal info fields.
   */
  buildPersonalData: (profile: SeafarerProfile) => Partial<T>;

  /**
   * Check whether an existing record matches a given seafarer profile.
   * Used when selecting a profile to find their existing record.
   */
  matchRecordToProfile: (record: T, profile: SeafarerProfile) => boolean;

  /**
   * Extract the record's UUID from the entity.
   * Typically `record.id`.
   */
  getRecordId: (record: T) => string | undefined;

  /**
   * Extract the linked seafarer profile UUID from the entity.
   * Typically `record.seafarer_profile_id`.
   */
  getProfileId: (record: T) => string | undefined;

  /**
   * Extract the business ID for the record summary (e.g. peme_id, exam_id).
   * Used to populate the RecordSelector dropdown.
   */
  getBusinessId: (record: T) => string | undefined;

  /**
   * Extract created_date from a record for the RecordSelector.
   */
  getCreatedDate: (record: T) => string | undefined;

  /** Toast messages for success states. */
  successMessages: {
    create: string;
    update: string;
  };

  /**
   * Human-readable name for this record type (e.g. "Seabase PEME",
   * "MLC certificate", "Panama certificate"). Used to prompt the user when a
   * selected seafarer has no record of this type yet. Defaults to "record".
   */
  recordLabel?: string;

  /**
   * Name of the field used to guard the Edit button.
   * Edit is only enabled when this field is truthy.
   * Defaults to checking `last_name` via getEditGuardValue.
   */
  getEditGuardValue?: (data: T) => boolean;

  /**
   * Optional callback that returns computed default values for a new record.
   * Merged on top of emptyRecord when the user clicks New.
   * Useful for date fields that depend on the current date.
   */
  getNewRecordDefaults?: () => Partial<T>;

  /**
   * Stable per-entity key used to persist an in-progress draft so unsaved
   * work survives a page reload (e.g. "landbase", "medical").
   *
   * When set, the form auto-saves a draft to sessionStorage while the user
   * is in New/Edit mode and restores it after a reload. The draft is cleared
   * on Save and Cancel. Omit to disable draft persistence for the entity.
   */
  draftKey?: string;
}

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

/**
 * Return value from `useEntityForm`.
 *
 * Provides everything a form page needs: current state, loading indicators,
 * CRUD mode tracking, and all action handlers.
 */
export interface UseEntityFormResult<T> {
  /** Current form data. */
  data: T;
  /** Replace form data directly (used by section onChange callbacks). */
  setData: (data: T) => void;
  /** True while the initial record is being fetched. */
  loading: boolean;
  /** True while a save operation is in-flight. */
  saving: boolean;
  /** True when the form is in edit mode (fields enabled). */
  editing: boolean;
  /** True when viewing/editing a persisted record (vs a new unsaved one). */
  isExistingRecord: boolean;
  /** The persisted record currently loaded (null when creating new). */
  existingRecord: T | null;
  /** Reset form to empty and enter new-record edit mode. */
  handleNew: () => void;
  /** Enter edit mode for the currently loaded record. */
  handleEdit: () => void;
  /** Discard changes and return to view mode. */
  handleCancel: () => void;
  /** Validate and persist the current form data. */
  handleSave: () => Promise<void>;
  /** Trigger browser print dialog. */
  handlePrint: () => void;
  /** Ref for the first focusable field (auto-focused on New). */
  firstFieldRef: React.RefObject<HTMLInputElement | null>;
  /** Search results from seafarer profiles. */
  searchResults: SeafarerProfile[];
  /** Whether a search request is in-flight. */
  searchLoading: boolean;
  /** Trigger a profile search by keyword (debounced). */
  handleSearch: (keyword: string) => void;
  /** Load a selected profile result into the form's personal info. */
  handleSelectResult: (profile: SeafarerProfile) => void;
  /** Transient error message shown when save is blocked (auto-clears). */
  saveAlert: string | null;
  /** True when the user must search/select a patient before proceeding. */
  needsPatientSelection: boolean;
  /** List of record summaries for the current patient (for the dropdown). */
  profileRecords: RecordSummary[];
  /** Switch to a different record by its UUID. */
  handleSelectRecord: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Hook implementation
// ---------------------------------------------------------------------------

/**
 * Generic entity form hook with full CRUD button behavior.
 *
 * Implements the standard form state machine shared by all entity modules:
 * - View mode: fields disabled, New/Edit/Print visible
 * - Edit mode (new): fields enabled with empty form, Save/Cancel/Print visible
 * - Edit mode (existing): fields enabled with loaded data, Save/Cancel/Print visible
 *
 * Handles initial data load (by `id` search param or most recent record),
 * profile search integration, record switching, save with validation,
 * and error handling.
 *
 * @param config - Entity-specific configuration
 * @returns Object with form state, action handlers, and refs
 *
 * @example
 * ```ts
 * const form = useEntityForm(landbaseFormConfig);
 * // form.data, form.handleSave, form.editing, etc.
 * ```
 */
export function useEntityForm<T>(config: EntityFormConfig<T>): UseEntityFormResult<T> {
  const {
    entityApi,
    emptyRecord,
    flattenResponse,
    stripSystemFields,
    sanitizePayload,
    validate,
    buildPersonalData,
    getRecordId,
    getProfileId,
    getBusinessId,
    getCreatedDate,
    successMessages,
    recordLabel = "record",
    draftKey,
  } = config;

  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  // Restore an in-progress draft (unsaved New/Edit work) on first render so a
  // page reload continues where the user left off. Runs once via the lazy
  // initializer; returns null when persistence is disabled or no draft exists.
  const restoredDraft = useState(() =>
    draftKey ? loadDraft<T>(draftKey, editId) : null
  )[0];

  // True when initial state came from a restored draft. Used to stop the async
  // initial load from clobbering the user's unsaved work.
  const draftRestoredRef = useRef<boolean>(!!restoredDraft);

  const [data, setData] = useState<T>(restoredDraft?.data ?? emptyRecord);
  const [originalData, setOriginalData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(restoredDraft?.editing ?? false);
  const [isExistingRecord, setIsExistingRecord] = useState(
    restoredDraft?.isExistingRecord ?? !!editId
  );
  const [existingRecord, setExistingRecord] = useState<T | null>(null);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);
  const [profileRecords, setProfileRecords] = useState<RecordSummary[]>([]);
  const [needsPatientSelection, setNeedsPatientSelection] = useState(false);

  const {
    searchResults: profileSearchResults,
    searchLoading: profileSearchLoading,
    handleSearch,
    clearSearch,
  } = useProfileSearch();

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  /** Fetch all record summaries for a given profile and update state. */
  const fetchProfileRecords = useCallback(async (profileId: string) => {
    try {
      const records = await entityApi.listByProfile(profileId);
      const summaries: RecordSummary[] = records.map((r) => ({
        id: getRecordId(r) ?? "",
        record_id: getBusinessId(r) ?? "",
        created_date: getCreatedDate(r) ?? "",
      }));
      setProfileRecords(summaries);
    } catch (error: unknown) {
      console.warn("Failed to fetch profile records:", error instanceof Error ? error.message : error);
      setProfileRecords([]);
    }
  }, [entityApi, getRecordId, getBusinessId, getCreatedDate]);

  // -------------------------------------------------------------------------
  // Initial data load
  // -------------------------------------------------------------------------

  useEffect(() => {
    // Guard against races: if editId changes or the component unmounts while
    // a load is in flight, skip the stale state updates.
    let cancelled = false;

    const loadRecord = async () => {
      try {
        let results: T[];
        if (editId) {
          results = await entityApi.filter({ id: editId });
        } else {
          // No id in the URL: restore the record the user was last viewing on
          // this page ("save last state"). Fall back to the globally most
          // recent record when there is no saved last-state or it no longer
          // resolves to an existing record.
          const lastId = draftKey ? loadLastRecordId(draftKey) : null;
          results = [];
          if (lastId) {
            try {
              results = await entityApi.filter({ id: lastId });
            } catch (error: unknown) {
              // The saved id no longer resolves (record deleted, or the
              // by-id fetch failed). Drop the stale pointer and fall through
              // to the most-recent-record fallback below instead of leaving
              // the form blank.
              if (draftKey) clearLastRecordId(draftKey);
              console.warn(
                `Saved last-state record could not be loaded for "${draftKey}", falling back to most recent:`,
                error instanceof Error ? error.message : error
              );
            }
          }
          if (results.length === 0) {
            results = await entityApi.list("-updated_date", 1);
          }
        }

        if (cancelled) return;

        if (results.length > 0) {
          const flattened = flattenResponse(results[0]);

          // Always track the persisted record so Save knows whether to
          // update vs create, and so the record dropdown can populate.
          setExistingRecord(flattened);
          const profileId = getProfileId(flattened);
          if (profileId) {
            fetchProfileRecords(profileId);
          }

          // A restored draft holds the user's unsaved work and must win over
          // the freshly fetched record. Only hydrate the form from the server
          // when there is no draft to preserve.
          if (!draftRestoredRef.current) {
            setData(flattened);
            setIsExistingRecord(true);
            // Remember this record as the page's last-viewed state.
            if (draftKey) saveLastRecordId(draftKey, getRecordId(flattened));
          }
        }
      } catch (error: unknown) {
        if (cancelled) return;
        // A failed load leaves the form empty. That's the intended state for a
        // brand-new entry, but when an editId was requested it means the record
        // could not be fetched, so log it rather than swallow silently.
        if (editId) {
          console.warn(
            "Failed to load record for editing:",
            error instanceof Error ? error.message : error
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadRecord();

    return () => {
      cancelled = true;
    };
  }, [editId, entityApi, flattenResponse, getProfileId, getRecordId, fetchProfileRecords, draftKey]);

  // -------------------------------------------------------------------------
  // Draft persistence (survive page reload)
  // -------------------------------------------------------------------------

  // While the form is in edit mode, mirror the current data/mode to
  // sessionStorage on every change so a reload can restore unsaved work.
  // Leaving edit mode (Save/Cancel) clears the draft explicitly, so we only
  // write here while editing to avoid persisting read-only view state.
  useEffect(() => {
    if (!draftKey) return;
    if (editing) {
      saveDraft<T>(draftKey, { data, editing, isExistingRecord, editId });
    }
  }, [draftKey, editing, data, isExistingRecord, editId]);

  // -------------------------------------------------------------------------
  // CRUD Handlers
  // -------------------------------------------------------------------------

  /** Clear form, enter edit mode for a new record. */
  const handleNew = useCallback(() => {
    const defaults = config.getNewRecordDefaults?.() ?? {};
    // Drop any restored draft: New starts a fresh, empty record. The persist
    // effect will begin writing a new draft as the user types.
    if (draftKey) clearDraft(draftKey);
    draftRestoredRef.current = false;
    // A brand-new unsaved record has no persisted id to restore later.
    if (draftKey) clearLastRecordId(draftKey);
    setData({ ...emptyRecord, ...defaults } as T);
    setOriginalData(null);
    setEditing(true);
    setIsExistingRecord(false);
    setExistingRecord(null);
    setProfileRecords([]);
    setNeedsPatientSelection(true);
  }, [emptyRecord, config, draftKey]);

  /** Enter edit mode, snapshot current data for cancel/restore. */
  const handleEdit = useCallback(() => {
    setOriginalData({ ...data } as T);
    setEditing(true);
  }, [data]);

  /** Discard changes and return to view mode. */
  const handleCancel = useCallback(() => {
    if (isExistingRecord && originalData) {
      setData(originalData);
    } else if (isExistingRecord && existingRecord) {
      setData(existingRecord);
    } else {
      setData(emptyRecord);
    }
    setOriginalData(null);
    setEditing(false);
    setNeedsPatientSelection(false);
    // Discarding changes also discards the persisted draft.
    if (draftKey) clearDraft(draftKey);
    draftRestoredRef.current = false;
  }, [isExistingRecord, originalData, existingRecord, emptyRecord, draftKey]);

  /** Validate, persist via API, and return to view mode. */
  const handleSave = useCallback(async () => {
    // Custom validation
    if (validate) {
      const error = validate(data);
      if (error) {
        setSaveAlert(error);
        setTimeout(() => setSaveAlert(null), 2000);
        return;
      }
    }

    // Default validation: require a linked seafarer profile
    const profileId = getProfileId(data);
    if (!profileId) {
      setSaveAlert("Please select a patient before saving.");
      setTimeout(() => setSaveAlert(null), 2000);
      return;
    }

    setSaving(true);
    try {
      const payload = sanitizePayload(stripSystemFields(data));
      let persisted: T;

      const recordId = existingRecord ? getRecordId(existingRecord) : undefined;

      if (isExistingRecord && recordId) {
        persisted = await entityApi.update(recordId, payload);
        toast.success(successMessages.update);
      } else {
        persisted = await entityApi.create(payload as T);
        setIsExistingRecord(true);
        toast.success(successMessages.create);
      }

      const flattened = flattenResponse(persisted);
      setData(flattened);
      setExistingRecord(flattened);
      setOriginalData(null);
      setEditing(false);

      // Work is now persisted server-side; the draft is no longer needed.
      if (draftKey) clearDraft(draftKey);
      draftRestoredRef.current = false;
      // Remember the just-saved record as the page's last-viewed state.
      if (draftKey) saveLastRecordId(draftKey, getRecordId(flattened));

      // Refresh the records list for this profile
      const newProfileId = getProfileId(flattened);
      if (newProfileId) {
        fetchProfileRecords(newProfileId);
      }
    } catch (error) {
      handleSaveError(error);
    } finally {
      setSaving(false);
    }
  }, [
    data, isExistingRecord, existingRecord, validate, getProfileId,
    getRecordId, entityApi, flattenResponse, stripSystemFields,
    sanitizePayload, successMessages, fetchProfileRecords, draftKey,
  ]);

  /** Trigger browser print dialog. */
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  /** Switch to a different record from the dropdown selector. */
  const handleSelectRecord = useCallback(async (id: string) => {
    try {
      const results = await entityApi.filter({ id });
      if (results.length > 0) {
        const flattened = flattenResponse(results[0]);
        setData(flattened);
        setExistingRecord(flattened);
        setIsExistingRecord(true);
        setEditing(false);
        setOriginalData(null);
        // Switching to a saved record in view mode discards any pending draft.
        if (draftKey) clearDraft(draftKey);
        draftRestoredRef.current = false;
        // Remember the switched-to record as the page's last-viewed state.
        if (draftKey) saveLastRecordId(draftKey, getRecordId(flattened));
      }
    } catch {
      toast.error("Failed to load the selected record");
    }
  }, [entityApi, flattenResponse, getRecordId, draftKey]);

  // -------------------------------------------------------------------------
  // Profile search result selection
  // -------------------------------------------------------------------------

  /**
   * Load a selected seafarer profile into the form.
   *
   * Searches for an existing record linked to that seafarer. If found,
   * loads the full record. Otherwise populates only personal info fields
   * so the user can create a new record for this seafarer.
   */
  const handleSelectResult = useCallback(
    (profile: SeafarerProfile) => {
      const personalData = buildPersonalData(profile);

      // Fill only the personal/patient info fields (used while the user is
      // actively building a new record and attaching a seafarer to it).
      const applyPersonalOnly = () => {
        setNeedsPatientSelection(false);
        if (editing) {
          setData((prev) => ({ ...prev, ...personalData }));
        } else {
          setData({ ...emptyRecord, ...personalData } as T);
          setIsExistingRecord(false);
          setExistingRecord(null);
        }
      };

      // When the seafarer has no record of this type, just notify the user.
      // Don't populate the patient/personal info and don't touch the current
      // page state — leave the interface exactly as it is.
      const handleNoRecord = () => {
        const name = [profile.first_name, profile.last_name]
          .filter(Boolean)
          .join(" ")
          .trim();
        toast.info(
          name
            ? `No ${recordLabel} found for ${name}`
            : `No ${recordLabel} found for this seafarer`,
          { description: `Click New to create a ${recordLabel} for this seafarer.` }
        );
      };

      // Fetch all records for this profile and use the authoritative by-profile
      // result to decide whether a record of this type exists. Keying on the
      // profile UUID avoids the false matches a fuzzy name search can produce.
      if (!profile.id) {
        // No profile id: while editing keep the personal data the user needs;
        // otherwise treat as "no record".
        if (editing) applyPersonalOnly();
        else handleNoRecord();
        clearSearch();
        return;
      }

      entityApi.listByProfile(profile.id)
        .then((records) => {
          const summaries: RecordSummary[] = records.map((r) => ({
            id: getRecordId(r) ?? "",
            record_id: getBusinessId(r) ?? "",
            created_date: getCreatedDate(r) ?? "",
          }));

          if (records.length > 0 && !editing) {
            // Load the most recent record (backend returns newest first).
            setProfileRecords(summaries);
            const flattened = flattenResponse(records[0]);
            setData(flattened);
            setExistingRecord(flattened);
            setIsExistingRecord(true);
            setNeedsPatientSelection(false);
            setEditing(false);
            setOriginalData(null);
            if (draftKey) saveLastRecordId(draftKey, getRecordId(flattened));
          } else if (editing) {
            // Building a new record: keep the dropdown and fill personal info.
            setProfileRecords(summaries);
            applyPersonalOnly();
          } else {
            // Viewing and no record exists: prompt and keep the form empty.
            handleNoRecord();
          }
        })
        .catch(() => {
          // The record lookup failed (network/server). Fall back to a fresh
          // form but don't claim "no record exists" — that may be untrue.
          setProfileRecords([]);
          applyPersonalOnly();
        });

      clearSearch();
    },
    [editing, clearSearch, entityApi, emptyRecord, buildPersonalData,
     flattenResponse, getRecordId, getBusinessId, getCreatedDate,
     recordLabel, draftKey]
  );

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------

  return {
    data,
    setData,
    loading,
    saving,
    editing,
    isExistingRecord,
    existingRecord,
    handleNew,
    handleEdit,
    handleCancel,
    handleSave,
    handlePrint,
    firstFieldRef,
    searchResults: profileSearchResults,
    searchLoading: profileSearchLoading,
    handleSearch,
    handleSelectResult,
    saveAlert,
    needsPatientSelection,
    profileRecords,
    handleSelectRecord,
  };
}

// ---------------------------------------------------------------------------
// Shared error handler
// ---------------------------------------------------------------------------

/**
 * Handle errors from save operations.
 *
 * Shows field-level validation errors with human-friendly labels,
 * or a generic error message if no violations are present.
 */
function handleSaveError(error: unknown): void {
  if (error instanceof ApiError && error.violations.length > 0) {
    error.violations.forEach((v) => {
      const label = humanizeField(v.field);
      toast.error(`${label}: ${v.message}`);
    });
  } else if (error instanceof ApiError) {
    toast.error(error.message);
  } else {
    toast.error("Failed to save record");
  }
}
