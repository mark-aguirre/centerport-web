"use client";

/**
 * Hook managing Chemistry Repeat Test CRUD operations and form state.
 *
 * Encapsulates data fetching, record selection, create/update logic,
 * and medical personnel dialog coordination for the RepeatChemistryDialog.
 *
 * @see RepeatChemistryDialog — the consumer component
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { httpClient } from "@/lib/http-client";
import { toast } from "sonner";
import type { ChemistryRepeatTest, ChemistryRepeatTestSummary } from "./repeat-chemistry-types";
import { EMPTY_CHEMISTRY_REPEAT } from "./repeat-chemistry-types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseRepeatChemistryFormOptions {
  /** Whether the dialog is currently open. Triggers data fetch on open. */
  open: boolean;
  /** The parent laboratory report UUID. */
  laboratoryReportId: string | undefined;
}

export interface UseRepeatChemistryFormResult {
  /** Current form data. */
  data: ChemistryRepeatTest;
  /** Whether the form is in editing mode. */
  editing: boolean;
  /** Whether a save operation is in progress. */
  saving: boolean;
  /** Currently selected record ID (null when creating new). */
  selectedId: string | null;
  /** Whether the form fields should be disabled (inverse of editing). */
  disabled: boolean;

  /** List of previously saved repeat tests for the record picker. */
  previousExams: ChemistryRepeatTestSummary[];
  /** Whether the previous exams list is loading. */
  loadingExams: boolean;

  /** Update a single form field. */
  updateField: (field: keyof ChemistryRepeatTest, value: string | boolean) => void;
  /** Load a specific repeat test by ID. */
  loadRepeatTest: (id: string) => Promise<void>;
  /** Reset form for a new record. */
  handleNew: () => void;
  /** Enter edit mode for the selected record. */
  handleEdit: () => void;
  /** Save the current form (create or update). */
  handleSave: () => Promise<void>;
  /** Refresh the previous exams list and reload current record. */
  handleRefresh: () => void;

  /** Personnel dialog state and helpers. */
  personnel: {
    dialogOpen: boolean;
    target: "med_tech" | "pathologist" | null;
    openDialog: (target: "med_tech" | "pathologist") => void;
    setDialogOpen: (open: boolean) => void;
    handleSelect: (personnel: { name: string; license_no: string }) => void;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Coerce null/undefined values to empty strings/false for controlled inputs.
 */
function sanitizeRecord(record: ChemistryRepeatTest): ChemistryRepeatTest {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => {
      if (v === null || v === undefined) {
        // Boolean fields get false, others get empty string
        if (k.endsWith("_high")) return [k, false];
        return [k, ""];
      }
      return [k, v];
    })
  ) as ChemistryRepeatTest;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Manages Chemistry Repeat Test form state with full CRUD behavior.
 *
 * @param options - Dialog open state and parent report ID
 * @returns Form state, field updater, and CRUD action handlers
 */
export function useRepeatChemistryForm({
  open,
  laboratoryReportId,
}: UseRepeatChemistryFormOptions): UseRepeatChemistryFormResult {
  // Form state
  const [data, setData] = useState<ChemistryRepeatTest>({ ...EMPTY_CHEMISTRY_REPEAT });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Previous exams list
  const [previousExams, setPreviousExams] = useState<ChemistryRepeatTestSummary[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);

  // Medical personnel dialog
  const [personnelDialogOpen, setPersonnelDialogOpen] = useState(false);
  const [personnelTarget, setPersonnelTarget] = useState<"med_tech" | "pathologist" | null>(null);

  const basePath = `/api/laboratory-reports/${laboratoryReportId}/chemistry-repeat-tests`;

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------

  const fetchPreviousExams = useCallback(async () => {
    if (!laboratoryReportId) return;
    setLoadingExams(true);
    try {
      const results = await httpClient.get<ChemistryRepeatTest[]>(basePath);
      const summaries: ChemistryRepeatTestSummary[] = results.map((r) => ({
        id: r.id!,
        result_id: r.result_id ?? "",
        result_date: r.result_date ?? "",
      }));
      setPreviousExams(summaries);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to fetch chemistry repeat tests:", message);
    } finally {
      setLoadingExams(false);
    }
  }, [laboratoryReportId, basePath]);

  const loadRepeatTest = useCallback(async (id: string) => {
    try {
      const record = await httpClient.get<ChemistryRepeatTest>(`${basePath}/${id}`);
      setData(sanitizeRecord(record));
      setSelectedId(id);
      setEditing(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to load chemistry repeat test:", message);
      toast.error("Failed to load repeat test");
    }
  }, [basePath]);

  // Reset form state and fetch previous exams when dialog opens.
  const prevOpenRef = useRef(false);
  useEffect(() => {
    const justOpened = open && !prevOpenRef.current;
    prevOpenRef.current = open;

    if (justOpened && laboratoryReportId) {
      const reset = () => {
        setData({ ...EMPTY_CHEMISTRY_REPEAT });
        setSelectedId(null);
        setEditing(false);
      };
      reset();
      fetchPreviousExams();
    }
  }, [open, laboratoryReportId, fetchPreviousExams]);

  // -------------------------------------------------------------------------
  // CRUD handlers
  // -------------------------------------------------------------------------

  const handleNew = () => {
    setData({ ...EMPTY_CHEMISTRY_REPEAT });
    setSelectedId(null);
    setEditing(true);
  };

  const handleEdit = () => {
    if (selectedId) {
      setEditing(true);
    }
  };

  const handleSave = async () => {
    if (!laboratoryReportId) return;
    setSaving(true);
    try {
      // Strip system fields before sending
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, result_id, created_date, updated_date, ...payload } = data;
      const body = { ...payload, laboratory_report_id: laboratoryReportId };

      if (selectedId) {
        const updated = await httpClient.put<ChemistryRepeatTest>(
          `${basePath}/${selectedId}`,
          body
        );
        setData(sanitizeRecord(updated));
        toast.success("Chemistry repeat test updated successfully");
      } else {
        const created = await httpClient.post<ChemistryRepeatTest>(basePath, body);
        setData(sanitizeRecord(created));
        setSelectedId(created.id!);
        toast.success("Chemistry repeat test created successfully");
      }
      setEditing(false);
      fetchPreviousExams();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to save chemistry repeat test:", message);
      toast.error("Failed to save repeat test");
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    fetchPreviousExams();
    if (selectedId) {
      loadRepeatTest(selectedId);
    }
  };

  // -------------------------------------------------------------------------
  // Field updater
  // -------------------------------------------------------------------------

  const updateField = (field: keyof ChemistryRepeatTest, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // -------------------------------------------------------------------------
  // Personnel dialog coordination
  // -------------------------------------------------------------------------

  const openPersonnelDialog = (target: "med_tech" | "pathologist") => {
    setPersonnelTarget(target);
    setPersonnelDialogOpen(true);
  };

  const handlePersonnelSelect = (personnel: { name: string; license_no: string }) => {
    if (personnelTarget === "med_tech") {
      setData((prev) => ({
        ...prev,
        med_tech: personnel.name,
        med_tech_license_no: personnel.license_no,
      }));
    } else if (personnelTarget === "pathologist") {
      setData((prev) => ({
        ...prev,
        pathologist: personnel.name,
        pathologist_license_no: personnel.license_no,
      }));
    }
  };

  return {
    data,
    editing,
    saving,
    selectedId,
    disabled: !editing,

    previousExams,
    loadingExams,

    updateField,
    loadRepeatTest,
    handleNew,
    handleEdit,
    handleSave,
    handleRefresh,

    personnel: {
      dialogOpen: personnelDialogOpen,
      target: personnelTarget,
      openDialog: openPersonnelDialog,
      setDialogOpen: setPersonnelDialogOpen,
      handleSelect: handlePersonnelSelect,
    },
  };
}
