"use client";

import { useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
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

  /** Route to navigate back to after a successful save (no longer used for navigation) */
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
 * CRUD mode tracking, and all action handlers.
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
  /** Whether the form is currently in edit mode */
  editing: boolean;
  /** True when the current record has been persisted (exists in storage) */
  isExistingRecord: boolean;
  /** The original record when editing, null for new records */
  existingRecord: T | null;
  /** Clear form and enter edit mode for a new record */
  handleNew: () => void;
  /** Enter edit mode, snapshot current data for cancel/restore */
  handleEdit: () => void;
  /** Discard changes and return to view mode */
  handleCancel: () => void;
  /** Validate, persist, and return to view mode */
  handleSave: () => Promise<void>;
  /** Print current record (no state change) */
  handlePrint: () => void;
  /** Ref for the first field — focus on New */
  firstFieldRef: React.RefObject<HTMLInputElement | null>;
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
 * Generic localStorage-backed form state hook with full CRUD button behavior.
 *
 * Encapsulates the standard CRUD state machine:
 * - View mode: fields disabled, New/Edit/Print visible
 * - Edit mode (new): fields enabled with empty form, Save/Cancel/Print visible
 * - Edit mode (existing): fields enabled with loaded data, Save/Cancel/Print visible
 *
 * Each form module provides a `LocalStorageFormConfig` to customize
 * storage keys, ID prefixes, validation, and success messages while
 * reusing identical persistence and state management logic.
 *
 * @typeParam T - The record interface (must have optional `id`,
 *   `created_date`, and `updated_date` string fields)
 * @param config - Module-specific configuration
 * @returns Object with form state, action handlers, and first-field ref
 */
export function useLocalStorageForm<
  T extends { id?: string; created_date?: string; updated_date?: string }
>(config: LocalStorageFormConfig<T>): UseLocalStorageFormResult<T> {
  const {
    storageKey,
    emptyRecord,
    idPrefix,
    idField,
    validate,
    successCreateMessage = "Record created successfully",
    successUpdateMessage = "Record updated successfully",
  } = config;

  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  // Compute initial state synchronously to avoid cascading renders.
  const initialState = (() => {
    if (!editId) return { data: emptyRecord, existingRecord: null };
    const all = getStoredRecords<T>(storageKey);
    const found = all.find((r) => (r as { id?: string }).id === editId) ?? null;
    if (found) {
      return { data: { ...emptyRecord, ...found }, existingRecord: found };
    }
    return { data: emptyRecord, existingRecord: null };
  })();

  const [data, setData] = useState<T>(initialState.data);
  const [originalData, setOriginalData] = useState<T | null>(initialState.existingRecord);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isExistingRecord, setIsExistingRecord] = useState(!!initialState.existingRecord);
  const [existingRecord, setExistingRecord] = useState<T | null>(initialState.existingRecord);

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  /** Clear form, enter edit mode for a new record. */
  const handleNew = useCallback(() => {
    setData(emptyRecord);
    setOriginalData(null);
    setEditing(true);
    setIsExistingRecord(false);
    setExistingRecord(null);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  }, [emptyRecord]);

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
      setData(emptyRecord);
    }
    setOriginalData(null);
    setEditing(false);
  }, [isExistingRecord, originalData, emptyRecord]);

  /** Validate, persist, and return to view mode. */
  const handleSave = useCallback(async () => {
    const error = validate(data);
    if (error) {
      toast.error(error);
      return;
    }

    setSaving(true);
    try {
      const all = getStoredRecords<T>(storageKey);

      if (isExistingRecord && existingRecord) {
        // Update existing record
        const recordId = (existingRecord as { id?: string }).id;
        const index = all.findIndex(
          (r) => (r as { id?: string }).id === recordId
        );
        if (index !== -1) {
          const updated = { ...data, updated_date: new Date().toISOString() };
          all[index] = updated;
          setStoredRecords(storageKey, all);
          setExistingRecord(updated);
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
        setData(record);
        setExistingRecord(record);
        setIsExistingRecord(true);
        toast.success(successCreateMessage);
      }
      setOriginalData(null);
      setEditing(false);
    } catch {
      toast.error("Failed to save record");
    } finally {
      setSaving(false);
    }
  }, [
    data,
    isExistingRecord,
    existingRecord,
    storageKey,
    idPrefix,
    idField,
    validate,
    successCreateMessage,
    successUpdateMessage,
  ]);

  /** Print the current record (no state change). */
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
    data,
    setData,
    loading: false,
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
  };
}
