"use client";

/**
 * Hook managing Fecalysis Repeat Test CRUD operations and form state.
 *
 * Encapsulates data fetching, record selection, create/update logic,
 * and medical personnel dialog coordination for the RepeatFecalysisDialog.
 *
 * @see RepeatFecalysisDialog — the consumer component
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { httpClient } from "@/lib/http-client";
import { toast } from "sonner";
import type { FecalysisRepeatTest, FecalysisRepeatTestSummary } from "./repeat-fecalysis-types";
import { EMPTY_FECALYSIS_REPEAT } from "./repeat-fecalysis-types";

export interface UseRepeatFecalysisFormOptions {
  /** Whether the dialog is currently open. Triggers data fetch on open. */
  open: boolean;
  /** The parent laboratory report UUID. */
  laboratoryReportId: string | undefined;
}

export interface UseRepeatFecalysisFormResult {
  /** Current form data. */
  data: FecalysisRepeatTest;
  /** Whether the form is in editing mode. */
  editing: boolean;
  /** Whether a save operation is in progress. */
  saving: boolean;
  /** Currently selected record ID (null when creating new). */
  selectedId: string | null;
  /** Whether the form fields should be disabled (inverse of editing). */
  disabled: boolean;
  /** List of previously saved repeat tests for the record picker. */
  previousExams: FecalysisRepeatTestSummary[];
  /** Whether the previous exams list is loading. */
  loadingExams: boolean;
  /** Update a single form field. */
  updateField: (field: keyof FecalysisRepeatTest, value: string) => void;
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

/** Coerce null/undefined values to empty strings for controlled inputs. */
function sanitizeRecord(record: FecalysisRepeatTest): FecalysisRepeatTest {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k, v ?? ""])
  ) as FecalysisRepeatTest;
}

/**
 * Manages Fecalysis Repeat Test form state with full CRUD behavior.
 *
 * State:
 * - `data` — the current form record
 * - `editing` — whether the form is editable
 * - `selectedId` — which existing record is loaded (null = new)
 * - `previousExams` — summary list for the record picker dropdown
 *
 * Side Effects:
 * - Fetches previous exams when dialog opens
 * - Resets form state on dialog open
 * - Communicates create/update results via toast notifications
 *
 * @param options - Dialog open state and parent report ID
 * @returns Form state, field updater, and CRUD action handlers
 */
export function useRepeatFecalysisForm({
  open,
  laboratoryReportId,
}: UseRepeatFecalysisFormOptions): UseRepeatFecalysisFormResult {
  const [data, setData] = useState<FecalysisRepeatTest>({ ...EMPTY_FECALYSIS_REPEAT });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previousExams, setPreviousExams] = useState<FecalysisRepeatTestSummary[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const [personnelDialogOpen, setPersonnelDialogOpen] = useState(false);
  const [personnelTarget, setPersonnelTarget] = useState<"med_tech" | "pathologist" | null>(null);

  const basePath = `/api/laboratory-reports/${laboratoryReportId}/fecalysis-repeat-tests`;

  const fetchPreviousExams = useCallback(async () => {
    if (!laboratoryReportId) return;
    setLoadingExams(true);
    try {
      const results = await httpClient.get<FecalysisRepeatTest[]>(basePath);
      setPreviousExams(results.map((r) => ({ id: r.id!, result_id: r.result_id ?? "", result_date: r.result_date ?? "" })));
    } catch (error: unknown) {
      console.error("Failed to fetch fecalysis repeat tests:", error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoadingExams(false);
    }
  }, [laboratoryReportId, basePath]);

  const loadRepeatTest = useCallback(async (id: string) => {
    try {
      const record = await httpClient.get<FecalysisRepeatTest>(`${basePath}/${id}`);
      setData(sanitizeRecord(record));
      setSelectedId(id);
      setEditing(false);
    } catch (error: unknown) {
      console.error("Failed to load fecalysis repeat test:", error instanceof Error ? error.message : "Unknown error");
      toast.error("Failed to load repeat test");
    }
  }, [basePath]);

  const prevOpenRef = useRef(false);
  useEffect(() => {
    const justOpened = open && !prevOpenRef.current;
    prevOpenRef.current = open;
    if (justOpened && laboratoryReportId) {
      setData({ ...EMPTY_FECALYSIS_REPEAT });
      setSelectedId(null);
      setEditing(false);
      fetchPreviousExams();
    }
  }, [open, laboratoryReportId, fetchPreviousExams]);

  const handleNew = () => { setData({ ...EMPTY_FECALYSIS_REPEAT }); setSelectedId(null); setEditing(true); };
  const handleEdit = () => { if (selectedId) setEditing(true); };

  const handleSave = async () => {
    if (!laboratoryReportId) return;
    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, result_id, created_date, updated_date, ...payload } = data;
      const body = { ...payload, laboratory_report_id: laboratoryReportId };
      if (selectedId) {
        const updated = await httpClient.put<FecalysisRepeatTest>(`${basePath}/${selectedId}`, body);
        setData(sanitizeRecord(updated));
        toast.success("Fecalysis repeat test updated successfully");
      } else {
        const created = await httpClient.post<FecalysisRepeatTest>(basePath, body);
        setData(sanitizeRecord(created));
        setSelectedId(created.id!);
        toast.success("Fecalysis repeat test created successfully");
      }
      setEditing(false);
      fetchPreviousExams();
    } catch (error: unknown) {
      console.error("Failed to save fecalysis repeat test:", error instanceof Error ? error.message : "Unknown error");
      toast.error("Failed to save repeat test");
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => { fetchPreviousExams(); if (selectedId) loadRepeatTest(selectedId); };
  const updateField = (field: keyof FecalysisRepeatTest, value: string) => { setData((prev) => ({ ...prev, [field]: value })); };

  const openPersonnelDialog = (target: "med_tech" | "pathologist") => { setPersonnelTarget(target); setPersonnelDialogOpen(true); };
  const handlePersonnelSelect = (personnel: { name: string; license_no: string }) => {
    if (personnelTarget === "med_tech") setData((prev) => ({ ...prev, med_tech: personnel.name, med_tech_license_no: personnel.license_no }));
    else if (personnelTarget === "pathologist") setData((prev) => ({ ...prev, pathologist: personnel.name, pathologist_license_no: personnel.license_no }));
  };

  return {
    data, editing, saving, selectedId, disabled: !editing,
    previousExams, loadingExams,
    updateField, loadRepeatTest, handleNew, handleEdit, handleSave, handleRefresh,
    personnel: { dialogOpen: personnelDialogOpen, target: personnelTarget, openDialog: openPersonnelDialog, setDialogOpen: setPersonnelDialogOpen, handleSelect: handlePersonnelSelect },
  };
}
