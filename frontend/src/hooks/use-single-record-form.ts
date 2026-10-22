"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/http-client";

/** The minimal entity API a single-record form needs. */
export interface SingleRecordApi<T> {
  list(orderBy: string, limit: number): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
}

/** Configuration for {@link useSingleRecordForm}. */
export interface SingleRecordFormConfig<T extends { id?: string }> {
  /** The entity API (e.g. `api.entities.DefaultValues`). */
  api: SingleRecordApi<T>;
  /** Empty/default state, seeded with the standard reference values. */
  empty: T;
  /** Human-readable label used in toasts (e.g. "hematology values"). */
  label: string;
}

/** Return shape of {@link useSingleRecordForm}. */
export interface UseSingleRecordFormResult<T> {
  /** Current form data. */
  data: T;
  /** Update a single field. */
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  /** True while the initial record is being fetched. */
  loading: boolean;
  /** True while a save is in flight. */
  saving: boolean;
  /** True when the form is editable. */
  editing: boolean;
  /** True once a persisted record exists (vs a brand-new default set). */
  isExistingRecord: boolean;
  /** Enter edit mode. */
  edit: () => void;
  /** Discard changes and return to view mode. */
  cancel: () => void;
  /** Validate and persist the current form data. */
  save: () => Promise<void>;
}

/**
 * Single-record form hook for settings-style data that has exactly one row
 * (or where only the latest row matters).
 *
 * On mount it loads the most-recent record; if none exists it shows the form
 * pre-filled with `empty` defaults so the first save creates the row. There is
 * no list, search, or delete — just load → view → edit → save.
 */
export function useSingleRecordForm<T extends { id?: string }>(
  config: SingleRecordFormConfig<T>
): UseSingleRecordFormResult<T> {
  const { api, empty, label } = config;

  const [data, setData] = useState<T>(empty);
  const [original, setOriginal] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [recordId, setRecordId] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.list("-updated_date", 1);
      if (list.length > 0) {
        setData(list[0]);
        setRecordId(list[0].id);
      } else {
        setData(empty);
        setRecordId(undefined);
      }
    } catch {
      setData(empty);
      setRecordId(undefined);
    } finally {
      setLoading(false);
    }
  }, [api, empty]);

  useEffect(() => {
    // Defer to a macrotask so the state updates inside load() do not run
    // synchronously within the effect body (react-hooks/set-state-in-effect).
    const handle = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(handle);
  }, [load]);

  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const edit = useCallback(() => {
    setOriginal(data);
    setEditing(true);
  }, [data]);

  const cancel = useCallback(() => {
    if (original) setData(original);
    setOriginal(null);
    setEditing(false);
  }, [original]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      // Persist everything except system-managed fields.
      const payload = { ...data } as Partial<T> & {
        id?: string;
        created_date?: string;
        updated_date?: string;
      };
      delete payload.id;
      delete payload.created_date;
      delete payload.updated_date;

      let persisted: T;
      if (recordId) {
        persisted = await api.update(recordId, payload);
        toast.success(`Saved ${label}`);
      } else {
        persisted = await api.create(payload);
        toast.success(`Saved ${label}`);
      }
      setData(persisted);
      setRecordId(persisted.id);
      setOriginal(null);
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : `Failed to save ${label}`);
    } finally {
      setSaving(false);
    }
  }, [data, recordId, api, label]);

  return {
    data,
    updateField,
    loading,
    saving,
    editing,
    isExistingRecord: !!recordId,
    edit,
    cancel,
    save,
  };
}
