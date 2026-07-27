"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api, type SeafarerProfile } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import { useProfileSearch } from "./use-profile-search";
import { EMPTY_PEME, type LandbasePeme } from "@/components/landbase/types";
import {
  flattenProfileIntoRecord,
  humanizeField,
  sanitizePayload,
  stripSystemFields,
  type RawPemeResponse,
} from "@/components/landbase/utils";

export interface UseLandbaseFormResult {
  /** Current PEME form data. */
  data: LandbasePeme;
  /** Replace form data directly (used by section onChange callbacks). */
  setData: (data: LandbasePeme) => void;
  /** True while the initial record is being fetched. */
  loading: boolean;
  /** True while a save operation is in-flight. */
  saving: boolean;
  /** True when the form is in edit mode (fields enabled). */
  editing: boolean;
  /** True when viewing/editing a persisted record (vs a new unsaved one). */
  isExistingRecord: boolean;
  /** The persisted record currently loaded (null when creating new). */
  existingRecord: LandbasePeme | null;
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
}

/**
 * Manages Landbase PEME form state with full CRUD button behavior.
 *
 * Handles both create and edit flows by reading the `id` search param.
 * When an ID is present, fetches that specific record and starts in view mode.
 * When no ID is present, loads the most recently updated PEME from the
 * database and starts in view mode. If the database is empty, shows an
 * empty form ready for new entry.
 *
 * State machine:
 * - View mode: fields disabled, New/Edit/Print visible
 * - Edit mode (new): fields enabled with empty form, Save/Cancel/Print visible
 * - Edit mode (existing): fields enabled with loaded data, Save/Cancel/Print visible
 *
 * @returns Object with form state, action handlers, and ref for first-field focus
 *
 * @see useProfileSearch — provides debounced seafarer profile search
 * @see flattenProfileIntoRecord — transforms nested API response to flat form model
 */
export function useLandbaseForm(): UseLandbaseFormResult {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [data, setData] = useState<LandbasePeme>(EMPTY_PEME);
  const [originalData, setOriginalData] = useState<LandbasePeme | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isExistingRecord, setIsExistingRecord] = useState(!!editId);
  const [existingRecord, setExistingRecord] = useState<LandbasePeme | null>(null);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const {
    searchResults: profileSearchResults,
    searchLoading: profileSearchLoading,
    handleSearch,
    clearSearch,
  } = useProfileSearch();

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // --- Initial data load ---
  useEffect(() => {
    const loadRecord = async () => {
      try {
        let results: LandbasePeme[];
        if (editId) {
          results = await api.entities.LandbasePeme.filter({ id: editId });
        } else {
          results = await api.entities.LandbasePeme.list("-updated_date", 1);
        }

        if (results.length > 0) {
          const flattened = flattenProfileIntoRecord(results[0] as RawPemeResponse);
          setExistingRecord(flattened);
          setData(flattened);
          setIsExistingRecord(true);
        }
      } catch {
        // Silently handle — form stays empty for new entry
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [editId]);

  /** Clear form, enter edit mode for a new record. */
  const handleNew = useCallback(() => {
    setData(EMPTY_PEME);
    setOriginalData(null);
    setEditing(true);
    setIsExistingRecord(false);
    setExistingRecord(null);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  }, []);

  /** Enter edit mode, snapshot current data for cancel/restore. */
  const handleEdit = useCallback(() => {
    setOriginalData({ ...data });
    setEditing(true);
  }, [data]);

  /** Discard changes and return to view mode. */
  const handleCancel = useCallback(() => {
    if (isExistingRecord && originalData) {
      setData(originalData);
    } else {
      setData(EMPTY_PEME);
    }
    setOriginalData(null);
    setEditing(false);
  }, [isExistingRecord, originalData]);

  /** Validate, persist via API, and return to view mode. */
  const handleSave = useCallback(async () => {
    // Validation: require a linked seafarer profile
    if (!data.seafarer_profile_id) {
      setSaveAlert("Please select a patient before saving.");
      setTimeout(() => setSaveAlert(null), 2000);
      return;
    }
    // Validation: require name fields
    if (!data.last_name || !data.first_name) {
      toast.error("Please fill in the required fields (Last Name, First Name)");
      return;
    }

    setSaving(true);
    try {
      const payload = sanitizePayload(stripSystemFields(data));
      let persisted: LandbasePeme;

      if (isExistingRecord && existingRecord?.id) {
        persisted = await api.entities.LandbasePeme.update(
          existingRecord.id,
          payload
        );
        toast.success("PEME record updated successfully");
      } else {
        persisted = await api.entities.LandbasePeme.create(
          payload as LandbasePeme
        );
        setIsExistingRecord(true);
        toast.success("PEME record created successfully");
      }

      const flattened = flattenProfileIntoRecord(persisted as RawPemeResponse);
      setData(flattened);
      setExistingRecord(flattened);
      setOriginalData(null);
      setEditing(false);
    } catch (error) {
      handleSaveError(error);
    } finally {
      setSaving(false);
    }
  }, [data, isExistingRecord, existingRecord]);

  /** Trigger browser print dialog. */
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  /**
   * Load a selected seafarer profile into the form.
   *
   * Searches for an existing PEME linked to that seafarer. If found,
   * loads the full record. Otherwise populates only personal info fields
   * so the user can create a new PEME for this seafarer.
   */
  const handleSelectResult = useCallback(
    (profile: SeafarerProfile) => {
      const personalData = buildPersonalDataFromProfile(profile);

      const applyPersonalOnly = () => {
        if (editing) {
          setData((prev) => ({ ...prev, ...personalData }));
        } else {
          setData({ ...EMPTY_PEME, ...personalData });
          setIsExistingRecord(false);
          setExistingRecord(null);
        }
      };

      const searchName = (profile.last_name ?? "").trim();
      if (searchName) {
        api.entities.LandbasePeme.search(searchName, 10)
          .then((results) => {
            const match = results.find((r) => matchesPemeToProfile(r, profile));

            if (match) {
              const flattened = flattenProfileIntoRecord(match as RawPemeResponse);
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
    [editing, clearSearch]
  );

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
  };
}

// --- Module-level helpers ---

/**
 * Check whether a PEME record matches a given seafarer profile.
 *
 * Tries matching by `seafarer_profile_id` first, then falls back
 * to name comparison on nested or top-level fields.
 */
function matchesPemeToProfile(
  record: LandbasePeme,
  profile: SeafarerProfile
): boolean {
  const raw = record as RawPemeResponse;

  // Direct match by profile ID
  if (raw.seafarer_profile_id === profile.id) return true;

  // Fallback: compare nested profile names
  const nested = raw.seafarer_profile;
  if (nested) {
    return (
      nested.last_name?.toLowerCase() === profile.last_name?.toLowerCase() &&
      nested.first_name?.toLowerCase() === profile.first_name?.toLowerCase()
    );
  }

  // Fallback: compare top-level names (already flattened data)
  return (
    record.last_name?.toLowerCase() === profile.last_name?.toLowerCase() &&
    record.first_name?.toLowerCase() === profile.first_name?.toLowerCase()
  );
}

/**
 * Build partial personal data from a selected SeafarerProfile.
 *
 * Maps profile fields to the corresponding LandbasePeme personal
 * info fields for form population.
 */
function buildPersonalDataFromProfile(
  profile: SeafarerProfile
): Partial<LandbasePeme> {
  return {
    seafarer_profile_id: profile.id,
    last_name: profile.last_name ?? "",
    first_name: profile.first_name ?? "",
    middle_name: profile.middle_name ?? "",
    place_of_birth: profile.place_of_birth ?? "",
    passport_no: profile.passport_no ?? "",
    religion: profile.religion ?? "",
    nationality: profile.nationality ?? "",
    gender: (profile.gender as LandbasePeme["gender"]) ?? "",
    civil_status: (profile.marital_status as LandbasePeme["civil_status"]) ?? "",
    address: profile.address ?? "",
    contact_no: profile.contact_no ?? "",
    employer: profile.employer ?? "",
    position: profile.position ?? "",
  };
}

/**
 * Handle errors from the save operation.
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
    toast.error("Failed to save PEME record");
  }
}
