"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/**
 * Configuration for the `useLocalStorageForm` hook.
 *
 * Defines how a specific form module persists and identifies its records
 * in localStorage. Each form (Medical, Landbase, MLC, Panama) provides
 * its own config to get full CRUD behavior with zero boilerplate.
 *
 * @typeParam T - The record interface (e.g. `MedicalExam`, `LandbasePeme`)
 */
export interface LocalStorageFormConfig<T> {
  /** localStorage key where the records array is stored */
  storageKey: string;

  /** Empty/default state for a new record (all fields initialized) */
  emptyRecord: T;

  /** Prefix for generated sequential IDs (e.g. "MED", "LB", "MLC", "PN") */
  idPrefix: string;

  /**
   * Field name on the record that holds the generated sequential ID.
   * Used for ID generation logic (e.g. "exam_id", "peme_id", "mlc_id").
   */
  idField: keyof T;

  /** Route to navigate back to after a successful save */
  returnRoute: string;

  /**
   * Validates form data before save. Return an error message string to
   * block the save and show a toast, or `null` to proceed.
   */
  validate: (data: T) => string | null;

  /** Toast message shown on successful record creation */
  successCreateMessage?: string;

  /** Toast message shown on successful record update */
  successUpdateMessage?: string;
}

/**
 * Return value from `useLocalStorageForm`.
 *
 * Provides everything a form page needs: current state, loading indicators,
 * edit detection, and the save handler.
 *
 * @typeParam T - The record interface
 */
export interface UseLocalStorageFormResult<T> {
  /** Current form data (controlled state) */
  data: T;
  /** Replaces entire form state — used as onChange handler */
  setData: (data: T) => void;
  /** True while loading an existing record by ID */
  loading: boolean;
  /** True while the save operation is in progress */
  saving: boolean;
  /** True when editing an existing record (ID present in URL) */
  isEditing: boolean;
  /** The original record when editing, null for new records */
  existingRecord: T | null;
  /** Validates and persists the current form data */
  handleSave: () => Promise<void>;
}

/**
 * Retrieves all records of type T from localStorage.
 *
 * Returns an empty array on server-side rendering or JSON parse failure.
 * On parse failure, removes the corrupted key and logs a warning.
 */
function getStoredRecords<T>(storageKey: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    console.error(`Failed to parse stored records for "${storageKey}", resetting.`);
    localStorage.removeItem(storageKey);
    return [];
  }
}

/** Persists the full records array to localStorage. */
function setStoredRecords<T>(storageKey: string, records: T[]): void {
  localStorage.setItem(storageKey, JSON.stringify(records));
}

/**
 * Generates the next sequential ID for a record collection.
 *
 * Scans existing records, finds the maximum numeric suffix, and
 * returns `{prefix}{next}` zero-padded to 8 digits.
 */
function generateNextId<T>(
  storageKey: string,
  prefix: string,
  idField: keyof T
): string {
  const all = getStoredRecords<T>(storageKey);
  const maxNum = all.reduce((max, record) => {
    const idValue = String(record[idField] ?? "");
    const num = parseInt(idValue.replace(prefix, "") || "0");
    return num > max ? num : max;
  }, 0);
  return `${prefix}${String(maxNum + 1).padStart(8, "0")}`;
}

/**
 * Generic localStorage-backed form state hook.
 *
 * Encapsulates the common CRUD pattern shared across all form modules:
 * - Load existing record by `id` search param (edit mode)
 * - Initialize with empty defaults (create mode)
 * - Validate, generate sequential ID, persist, and navigate on save
 *
 * Each form module provides a `LocalStorageFormConfig` to customize
 * storage keys, ID prefixes, validation, and success messages while
 * reusing identical persistence and state management logic.
 *
 * @typeParam T - The record interface (must have optional `id`,
 *   `created_date`, and `updated_date` string fields)
 * @param config - Module-specific configuration
 * @returns Object with form state, setters, and the save handler
 *
 * @example
 * ```tsx
 * const { data, setData, loading, saving, handleSave } = useLocalStorageForm({
 *   storageKey: "medical_exam_records",
 *   emptyRecord: EMPTY_EXAM,
 *   idPrefix: "MED",
 *   idField: "exam_id",
 *   returnRoute: "/medical",
 *   validate: (d) => (!d.last_name ? "Last Name is required" : null),
 * });
 * ```
 */
export function useLocalStorageForm<
  T extends { id?: string; created_date?: string; updated_date?: string }
>(config: LocalStorageFormConfig<T>): UseLocalStorageFormResult<T> {
  const {
    storageKey,
    emptyRecord,
    idPrefix,
    idField,
    returnRoute,
    validate,
    successCreateMessage = "Record created successfully",
    successUpdateMessage = "Record updated successfully",
  } = config;

  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  // Compute initial state synchronously to avoid cascading renders.
  // localStorage is synchronous so we can resolve edit-mode data upfront.
  const initialState = (() => {
    if (!editId) return { data: emptyRecord, existingRecord: null, loading: false };
    const all = getStoredRecords<T>(storageKey);
    const found = all.find((r) => (r as { id?: string }).id === editId) ?? null;
    if (found) {
      return {
        data: { ...emptyRecord, ...found },
        existingRecord: found,
        loading: false,
      };
    }
    return { data: emptyRecord, existingRecord: null, loading: false };
  })();

  const [data, setData] = useState<T>(initialState.data);
  const [saving, setSaving] = useState(false);
  const [existingRecord] = useState<T | null>(initialState.existingRecord);
  const loading = false;

  const handleSave = useCallback(async () => {
    const error = validate(data);
    if (error) {
      toast.error(error);
      return;
    }

    setSaving(true);
    try {
      const all = getStoredRecords<T>(storageKey);

      if (editId && existingRecord) {
        // Update existing record
        const index = all.findIndex(
          (r) => (r as { id?: string }).id === editId
        );
        if (index !== -1) {
          all[index] = {
            ...data,
            updated_date: new Date().toISOString(),
          };
          setStoredRecords(storageKey, all);
          toast.success(successUpdateMessage);
        }
      } else {
        // Create new record
        const generatedId = generateNextId<T>(storageKey, idPrefix, idField);
        const record: T = {
          ...data,
          id: crypto.randomUUID(),
          [idField]: generatedId,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString(),
        };
        all.push(record);
        setStoredRecords(storageKey, all);
        toast.success(successCreateMessage);
      }
      router.push(returnRoute);
    } catch {
      toast.error("Failed to save record");
    }
    setSaving(false);
  }, [
    data,
    editId,
    existingRecord,
    router,
    storageKey,
    idPrefix,
    idField,
    returnRoute,
    validate,
    successCreateMessage,
    successUpdateMessage,
  ]);

  return {
    data,
    setData,
    loading,
    saving,
    isEditing: !!editId,
    existingRecord,
    handleSave,
  };
}
