"use client";

import { useEffect, useMemo, useRef } from "react";
import { api, type SeafarerProfile } from "@/lib/api";
import { useEntityForm, type EntityFormConfig, type UseEntityFormResult } from "./use-entity-form";
import { EMPTY_MLC, type MlcRecord } from "@/components/mlc/types";
import type { RecordSummary } from "@/components/common/record-selector";
import {
  flattenProfileIntoRecord,
  stripSystemFields,
  sanitizePayload,
  type RawMlcResponse,
} from "@/components/mlc/utils";

// ---------------------------------------------------------------------------
// MLC-specific configuration
// ---------------------------------------------------------------------------

const mlcConfig: EntityFormConfig<MlcRecord> = {
  entityApi: api.entities.MlcRecord,
  emptyRecord: EMPTY_MLC,

  flattenResponse: (raw) => flattenProfileIntoRecord(raw as RawMlcResponse),
  stripSystemFields,
  sanitizePayload,

  validate: (data) => {
    if (!data.seafarer_profile_id) {
      return "Please select a patient before saving.";
    }
    if (!data.last_name || !data.first_name) {
      return null; // Let toast-based validation in generic hook handle this
    }
    return null;
  },

  buildPersonalData: (profile: SeafarerProfile): Partial<MlcRecord> => ({
    seafarer_profile_id: profile.id,
    last_name: profile.last_name ?? "",
    first_name: profile.first_name ?? "",
    middle_name: profile.middle_name ?? "",
    place_of_birth: profile.place_of_birth ?? "",
    passport_no: profile.passport_no ?? "",
    religion: profile.religion ?? "",
    nationality: profile.nationality ?? "",
    gender: (profile.gender ?? "") as MlcRecord["gender"],
    civil_status: (profile.marital_status ?? "") as MlcRecord["civil_status"],
    address: profile.address ?? "",
    contact_no: profile.contact_no ?? "",
    employer: profile.employer ?? "",
    position: profile.position ?? "",
    date_of_birth: profile.birthdate ?? "",
    age: profile.age ?? "",
  }),

  matchRecordToProfile: (record, profile) => {
    const raw = record as RawMlcResponse;
    if (raw.seafarer_profile_id === profile.id) return true;
    if (raw.seafarer_profile?.id === profile.id) return true;
    return false;
  },

  getRecordId: (record) => record.id,
  getProfileId: (record) => record.seafarer_profile_id,
  getBusinessId: (record) => record.mlc_id,
  getCreatedDate: (record) => record.created_date,

  successMessages: {
    create: "MLC record created successfully",
    update: "MLC record updated successfully",
  },
};

// ---------------------------------------------------------------------------
// Carry-forward personnel defaults
// ---------------------------------------------------------------------------

type MlcPersonnelDefaults = Pick<
  MlcRecord,
  "examining_physician" | "medical_certification_no" | "medical_director"
>;

/** Extracts only the certification personnel fields that carry into the next record. */
function getPersonnelDefaults(record: MlcRecord): MlcPersonnelDefaults {
  return {
    examining_physician: record.examining_physician,
    medical_certification_no: record.medical_certification_no,
    medical_director: record.medical_director,
  };
}

// ---------------------------------------------------------------------------
// Public hook & types
// ---------------------------------------------------------------------------

export interface UseMlcFormResult extends UseEntityFormResult<MlcRecord> {
  /** List of record summaries for the current patient (for the dropdown). */
  profileRecords: RecordSummary[];
  /** Switch to a different record by its UUID. */
  handleSelectRecord: (id: string) => void;
}

/**
 * Manages MLC Health Certificate form state with full CRUD button behavior.
 *
 * Delegates to the generic `useEntityForm` with MLC-specific config.
 *
 * @returns Object with form state, action handlers, and ref for first-field focus
 */
export function useMlcForm(): UseMlcFormResult {
  const personnelDefaultsRef = useRef<MlcPersonnelDefaults>(
    getPersonnelDefaults(EMPTY_MLC)
  );

  const config = useMemo<EntityFormConfig<MlcRecord>>(
    () => ({
      ...mlcConfig,
      getNewRecordDefaults: () => personnelDefaultsRef.current,
    }),
    []
  );

  const form = useEntityForm(config);

  useEffect(() => {
    if (form.existingRecord) {
      personnelDefaultsRef.current = getPersonnelDefaults(form.existingRecord);
    }
  }, [form.existingRecord]);

  return form;
}
