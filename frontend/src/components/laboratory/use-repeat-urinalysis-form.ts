"use client";

/**
 * Hook managing Urinalysis Repeat Test CRUD operations and form state.
 *
 * @see RepeatUrinalysisDialog — the consumer component
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { httpClient } from "@/lib/http-client";
import { toast } from "sonner";
import type { UrinalysisRepeatTest, UrinalysisRepeatTestSummary } from "./repeat-urinalysis-types";
import { EMPTY_URINALYSIS_REPEAT } from "./repeat-urinalysis-types";

export interface UseRepeatUrinalysisFormOptions {
  open: boolean;
  laboratoryReportId: string | undefined;
}

export interface UseRepeatUrinalysisFormResult {
  data: UrinalysisRepeatTest;
  editing: boolean;
  saving: boolean;
  selectedId: string | null;
  disabled: boolean;
  previousExams: UrinalysisRepeatTestSummary[];
  loadingExams: boolean;
  updateField: (field: keyof UrinalysisRepeatTest, value: string) => void;
  loadRepeatTest: (id: string) => Promise<void>;
  handleNew: () => void;
  handleEdit: () => void;
  handleSave: () => Promise<void>;
  handleRefresh: () => void;
  personnel: {
    dialogOpen: boolean;
    target: "med_tech" | "pathologist" | null;
    openDialog: (target: "med_tech" | "pathologist") => void;
    setDialogOpen: (open: boolean) => void;
    handleSelect: (personnel: { name: string; license_no: string }) => void;
  };
}

function sanitizeRecord(record: UrinalysisRepeatTest): UrinalysisRepeatTest {
  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k, v ?? ""])
  ) as UrinalysisRepeatTest;
}

export function useRepeatUrinalysisForm({
  open,
  laboratoryReportId,
}: UseRepeatUrinalysisFormOptions): UseRepeatUrinalysisFormResult {
  const [data, setData] = useState<UrinalysisRepeatTest>({ ...EMPTY_URINALYSIS_REPEAT });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previousExams, setPreviousExams] = useState<UrinalysisRepeatTestSummary[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const [personnelDialogOpen, setPersonnelDialogOpen] = useState(false);
  const [personnelTarget, setPersonnelTarget] = useState<"med_tech" | "pathologist" | null>(null);

  const basePath = `/api/laboratory-reports/${laboratoryReportId}/urinalysis-repeat-tests`;

  const fetchPreviousExams = useCallback(async () => {
    if (!laboratoryReportId) return;
    setLoadingExams(true);
    try {
      const results = await httpClient.get<UrinalysisRepeatTest[]>(basePath);
      const summaries: UrinalysisRepeatTestSummary[] = results.map((r) => ({
        id: r.id!,
        result_id: r.result_id ?? "",
        result_date: r.result_date ?? "",
      }));
      setPreviousExams(summaries);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to fetch urinalysis repeat tests:", message);
    } finally {
      setLoadingExams(false);
    }
  }, [laboratoryReportId, basePath]);

  const loadRepeatTest = useCallback(async (id: string) => {
    try {
      const record = await httpClient.get<UrinalysisRepeatTest>(`${basePath}/${id}`);
      setData(sanitizeRecord(record));
      setSelectedId(id);
      setEditing(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to load urinalysis repeat test:", message);
      toast.error("Failed to load repeat test");
    }
  }, [basePath]);

  const prevOpenRef = useRef(false);
  useEffect(() => {
    const justOpened = open && !prevOpenRef.current;
    prevOpenRef.current = open;
    if (justOpened && laboratoryReportId) {
      setData({ ...EMPTY_URINALYSIS_REPEAT });
      setSelectedId(null);
      setEditing(false);
      fetchPreviousExams();
    }
  }, [open, laboratoryReportId, fetchPreviousExams]);

  const handleNew = () => {
    setData({ ...EMPTY_URINALYSIS_REPEAT });
    setSelectedId(null);
    setEditing(true);
  };

  const handleEdit = () => {
    if (selectedId) setEditing(true);
  };

  const handleSave = async () => {
    if (!laboratoryReportId) return;
    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, result_id, created_date, updated_date, ...payload } = data;
      const body = { ...payload, laboratory_report_id: laboratoryReportId };

      if (selectedId) {
        const updated = await httpClient.put<UrinalysisRepeatTest>(`${basePath}/${selectedId}`, body);
        setData(sanitizeRecord(updated));
        toast.success("Urinalysis repeat test updated successfully");
      } else {
        const created = await httpClient.post<UrinalysisRepeatTest>(basePath, body);
        setData(sanitizeRecord(created));
        setSelectedId(created.id!);
        toast.success("Urinalysis repeat test created successfully");
      }
      setEditing(false);
      fetchPreviousExams();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to save urinalysis repeat test:", message);
      toast.error("Failed to save repeat test");
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    fetchPreviousExams();
    if (selectedId) loadRepeatTest(selectedId);
  };

  const updateField = (field: keyof UrinalysisRepeatTest, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const openPersonnelDialog = (target: "med_tech" | "pathologist") => {
    setPersonnelTarget(target);
    setPersonnelDialogOpen(true);
  };

  const handlePersonnelSelect = (personnel: { name: string; license_no: string }) => {
    if (personnelTarget === "med_tech") {
      setData((prev) => ({ ...prev, med_tech: personnel.name, med_tech_license_no: personnel.license_no }));
    } else if (personnelTarget === "pathologist") {
      setData((prev) => ({ ...prev, pathologist: personnel.name, pathologist_license_no: personnel.license_no }));
    }
  };

  return {
    data, editing, saving, selectedId, disabled: !editing,
    previousExams, loadingExams,
    updateField, loadRepeatTest, handleNew, handleEdit, handleSave, handleRefresh,
    personnel: {
      dialogOpen: personnelDialogOpen,
      target: personnelTarget,
      openDialog: openPersonnelDialog,
      setDialogOpen: setPersonnelDialogOpen,
      handleSelect: handlePersonnelSelect,
    },
  };
}
