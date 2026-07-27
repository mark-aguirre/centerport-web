"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { SeafarerProfile } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import { humanizeField } from "@/lib/form-utils";
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
   * Name of the field used to guard the Edit button.
   * Edit is only enabled when this field is truthy.
   * Defaults to checking `last_name` via getEditGuardValue.
   */
  getEditGuardValue?: (data: T) => boolean;
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
    matchRecordToProfile,
    getRecordId,
    getProfileId,
    getBusinessId,
    getCreatedDate,
    successMessages,
  } = config;

  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [data, setData] = useState<T>(emptyRecord);
  const [originalData, setOriginalData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isExistingRecord, setIsExistingRecord] = useState(!!editId);
  const [existingRecord, setExistingRecord] = useState<T | null>(null);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);
  const [profileRecords, setProfileRecords] = useState<RecordSummary[]>([]);

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
    } catch {
      setProfileRecords([]);
    }
  }, [entityApi, getRecordId, getBusinessId, getCreatedDate]);

  // -------------------------------------------------------------------------
  // Initial data load
  // -------------------------------------------------------------------------

  useEffect(() => {
    const loadRecord = async () => {
      try {
        let results: T[];
        if (editId) {
          results = await entityApi.filter({ id: editId });
        } else {
          results = await entityApi.list("-updated_date", 1);
        }

        if (results.length > 0) {
          const flattened = flattenResponse(results[0]);
          setExistingRecord(flattened);
          setData(flattened);
          setIsExistingRecord(true);

          const profileId = getProfileId(flattened);
          if (profileId) {
            fetchProfileRecords(profileId);
          }
        }
      } catch {
        // Silently handle — form stays empty for new entry
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [editId, entityApi, flattenResponse, getProfileId, fetchProfileRecords]);

  // -------------------------------------------------------------------------
  // CRUD Handlers
  // -------------------------------------------------------------------------

  /** Clear form, enter edit mode for a new record. */
  const handleNew = useCallback(() => {
    setData(emptyRecord);
    setOriginalData(null);
    setEditing(true);
    setIsExistingRecord(false);
    setExistingRecord(null);
    setProfileRecords([]);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  }, [emptyRecord]);

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
  }, [isExistingRecord, originalData, existingRecord, emptyRecord]);

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
    sanitizePayload, successMessages, fetchProfileRecords,
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
      }
    } catch {
      toast.error("Failed to load the selected record");
    }
  }, [entityApi, flattenResponse]);

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

      const applyPersonalOnly = () => {
        if (editing) {
          setData((prev) => ({ ...prev, ...personalData }));
        } else {
          setData({ ...emptyRecord, ...personalData } as T);
          setIsExistingRecord(false);
          setExistingRecord(null);
        }
      };

      // Fetch all records for this profile (for the dropdown)
      if (profile.id) {
        fetchProfileRecords(profile.id);
      }

      const searchName = (profile.last_name ?? "").trim();
      if (searchName) {
        entityApi.search(searchName, 10)
          .then((results) => {
            const match = results.find((r) => matchRecordToProfile(r, profile));

            if (match && !editing) {
              const flattened = flattenResponse(match);
              setData(flattened);
              setExistingRecord(flattened);
              setIsExistingRecord(true);
              setEditing(false);
              setOriginalData(null);
            } else {
              applyPersonalOnly();
            }
          })
          .catch(() => {
            applyPersonalOnly();
          });
      } else {
        applyPersonalOnly();
      }

      clearSearch();
    },
    [editing, clearSearch, fetchProfileRecords, entityApi, emptyRecord,
     buildPersonalData, matchRecordToProfile, flattenResponse]
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
