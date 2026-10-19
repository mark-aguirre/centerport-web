"use client";

import { useCallback, useEffect, useRef } from "react";

import { api, type SeafarerProfile } from "@/lib/api";
import { useEntityForm, type EntityFormConfig, type UseEntityFormResult } from "./use-entity-form";
import { EMPTY_CERTIFICATE, type PanamaCertificate } from "@/components/panama/types";
import { buildDeclarationNormalDefaults } from "@/components/panama/PersonalDeclarationSection";
import { buildExaminationNormalDefaults } from "@/components/panama/MedicalExaminationSection";
import { buildDiagnosticNormalDefaults } from "@/components/panama/DiagnosticTestsSection";
import { buildFitnessNormalDefaults } from "@/components/panama/FitnessAssessmentSection";
import type { MedicalExam } from "@/components/medical/types";
import type { RecordSummary } from "@/components/common/record-selector";
import {
  flattenProfileIntoRecord,
  stripSystemFields,
  sanitizePayload,
  type RawPanamaResponse,
} from "@/components/panama/utils";
import { applyMedicalToPanama } from "@/lib/panama-seabase-sync";

// ---------------------------------------------------------------------------
// Panama-specific configuration
// ---------------------------------------------------------------------------

const panamaConfig: EntityFormConfig<PanamaCertificate> = {
  entityApi: api.entities.PanamaCertificate,
  emptyRecord: EMPTY_CERTIFICATE,
  draftKey: "panama",
  // When the Panama page opens with a carried-over selected patient who has no
  // Panama certificate yet, prompt (Yes/No) to create one.
  promptCreateOnLoad: true,
  // Panama shares the selected patient with Seabase (the only sharing pair), so
  // opening one after the other shows the same seafarer.
  shareSelectedPatient: true,

  flattenResponse: (raw) => flattenProfileIntoRecord(raw as RawPanamaResponse),
  stripSystemFields,
  sanitizePayload,

  validate: (data) => {
    if (!data.seafarer_profile_id) {
      return "Please select a patient before saving.";
    }
    if (!data.full_name) {
      return null; // Let toast-based validation handle this
    }
    return null;
  },

  buildPersonalData: (profile: SeafarerProfile): Partial<PanamaCertificate> => {
    const fullName = [profile.last_name, profile.first_name, profile.middle_name]
      .filter(Boolean)
      .join(", ");

    // Parse birthdate into day/month/year
    let day = "";
    let month = "";
    let year = "";
    if (profile.birthdate) {
      const d = new Date(profile.birthdate);
      if (!isNaN(d.getTime())) {
        day = String(d.getDate());
        month = String(d.getMonth() + 1);
        year = String(d.getFullYear());
      }
    }

    return {
      seafarer_profile_id: profile.id,
      full_name: fullName,
      day,
      month,
      year,
      sex: (profile.gender === "Male" ? "Male" : profile.gender === "Female" ? "Female" : "") as PanamaCertificate["sex"],
      home_address: profile.address ?? "",
      passport_no: profile.passport_no ?? "",
      seamans_book_no: profile.seamans_book_no ?? "",
      crew_position: profile.position ?? "",
    };
  },

  matchRecordToProfile: (record, profile) => {
    const raw = record as RawPanamaResponse;
    if (raw.seafarer_profile_id === profile.id) return true;
    const nested = raw.seafarer_profile;
    if (nested) {
      return (
        nested.last_name?.toLowerCase() === profile.last_name?.toLowerCase() &&
        nested.first_name?.toLowerCase() === profile.first_name?.toLowerCase()
      );
    }
    // Fallback: compare full_name
    const expectedName = [profile.last_name, profile.first_name, profile.middle_name]
      .filter(Boolean)
      .join(", ")
      .toLowerCase();
    return record.full_name?.toLowerCase() === expectedName;
  },

  getRecordId: (record) => record.id,
  getProfileId: (record) => record.seafarer_profile_id,
  getBusinessId: (record) => record.panama_id,
  getCreatedDate: (record) => record.created_date,

  getEditGuardValue: (data) => !!data.full_name,

  // When the user clicks "New", pre-fill every section with its "normal"
  // defaults (the same values the per-section "Set Normal" buttons apply), so
  // a fresh certificate starts fully marked normal and the examiner only edits
  // the exceptions. Merged on top of EMPTY_CERTIFICATE by useEntityForm.
  getNewRecordDefaults: () => ({
    ...buildDeclarationNormalDefaults(),
    ...buildExaminationNormalDefaults(),
    ...buildDiagnosticNormalDefaults(),
    ...buildFitnessNormalDefaults(),
  }),

  successMessages: {
    create: "Panama certificate created successfully",
    update: "Panama certificate updated successfully",
  },

  recordLabel: "Panama certificate",
};

/**
 * Confirmation copy shown when a Panama edit affects data that is synchronized
 * with the Seabase (medical) record.
 */
export const SEABASE_SYNC_PROMPT =
  "This change affects data synchronized with Seabase. Would you like to update the corresponding Seabase record as well?";

// ---------------------------------------------------------------------------
// Public hook & types
// ---------------------------------------------------------------------------

export interface UsePanamaFormResult extends UseEntityFormResult<PanamaCertificate> {
  /** List of record summaries for the current patient (for the dropdown). */
  profileRecords: RecordSummary[];
  /** Switch to a different record by its UUID. */
  handleSelectRecord: (id: string) => void;

  // --- Seabase synchronization ---
  /** True while the "update Seabase too?" confirmation dialog is open. */
  seabaseConfirmOpen: boolean;
  /** Message shown in the Seabase confirmation dialog. */
  seabaseConfirmMessage: string;
  /** True while the cross-system save (Panama + Seabase) is in flight. */
  seabaseSyncing: boolean;
  /** User chose to also update the Seabase record. */
  confirmSeabaseSync: () => void;
  /** User chose to update Panama only. */
  declineSeabaseSync: () => void;
}

/**
 * Manages Panama certificate form state with full CRUD button behavior plus
 * bi-directional synchronization with the Seabase (medical) record.
 *
 * Behavior:
 * - On load / patient switch, the latest medical exam for the seafarer is
 *   fetched and its overlapping fields are silently imported into the Panama
 *   form (Medical -> Panama refresh).
 * - On save, if the edit changed any field that maps to the medical record and
 *   a medical record exists, the user is prompted to also update Seabase.
 *   Choosing "Yes" writes both; "No" writes Panama only.
 *
 * @returns Object with form state, action handlers, and Seabase sync controls
 */
export function usePanamaForm(): UsePanamaFormResult {
  const form = useEntityForm(panamaConfig);
  const { data, setData, existingRecord } = form;

  // Latest medical (Seabase) record for the current seafarer, if any.
  const medicalRef = useRef<MedicalExam | null>(null);
  // Baseline Panama snapshot used to detect synced-field changes on save.
  // Set whenever we load/refresh a record so edits are compared against it.
  const baselineRef = useRef<PanamaCertificate>(data);
  // Track which profile we've already fetched the medical record for, to avoid
  // redundant fetches on every keystroke.
  const syncedProfileRef = useRef<string | undefined>(undefined);

  // -------------------------------------------------------------------------
  // Medical -> Panama silent auto-refresh
  // -------------------------------------------------------------------------

  useEffect(() => {
    const profileId = data.seafarer_profile_id;

    // No patient selected: clear any tracked medical record.
    if (!profileId) {
      medicalRef.current = null;
      syncedProfileRef.current = undefined;
      baselineRef.current = data;
      return;
    }

    // Already synced this profile — just keep the baseline current so change
    // detection compares against the most recently loaded/saved state.
    if (syncedProfileRef.current === profileId) return;
    syncedProfileRef.current = profileId;

    let cancelled = false;

    (async () => {
      try {
        const records = await api.entities.MedicalExam.listByProfile(profileId);
        if (cancelled) return;
        // listByProfile returns most-recent-first; the latest is the target.
        const latest = records.length > 0 ? records[0] : null;
        medicalRef.current = latest;

        if (latest) {
          // Silently import overlapping fields into the current form data.
          const merged = applyMedicalToPanama(data, latest);
          baselineRef.current = merged;
          setData(merged);
        } else {
          baselineRef.current = data;
        }
      } catch (error: unknown) {
        if (cancelled) return;
        // A failed import must not block the Panama form; log and carry on.
        console.warn(
          "Failed to import Seabase (medical) data:",
          error instanceof Error ? error.message : error
        );
        medicalRef.current = null;
        baselineRef.current = data;
      }
    })();

    return () => {
      cancelled = true;
    };
    // We intentionally key this effect on the profile id only; `data` is read
    // via the functional setData updater to avoid re-running on every edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.seafarer_profile_id, setData]);

  // Keep the baseline in step with the persisted record after a save or record
  // switch (existingRecord changes), so subsequent edits diff correctly.
  useEffect(() => {
    if (existingRecord) {
      baselineRef.current = existingRecord;
    }
  }, [existingRecord]);

  // -------------------------------------------------------------------------
  // Save (Panama only — Seabase sync disabled)
  // -------------------------------------------------------------------------

  const handleSave = useCallback(async () => {
    // Seabase sync disabled: save to Panama only. The Panama -> Medical
    // confirmation prompt and cross-system write are intentionally skipped so
    // a save never touches the Seabase (medical) record.
    await form.handleSave();
    baselineRef.current = data;
  }, [data, form]);

  // Seabase confirmation controls are retained as inert no-ops so the page's
  // ConfirmDialog wiring stays valid; the dialog never opens because
  // seabaseConfirmOpen is always false.
  const noop = useCallback(() => {}, []);

  return {
    ...form,
    handleSave,
    seabaseConfirmOpen: false,
    seabaseConfirmMessage: SEABASE_SYNC_PROMPT,
    seabaseSyncing: false,
    confirmSeabaseSync: noop,
    declineSeabaseSync: noop,
  };
}
