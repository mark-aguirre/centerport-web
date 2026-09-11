"use client";

import { useEffect, useMemo, useRef } from "react";
import { api, type SeafarerProfile } from "@/lib/api";
import { useEntityForm, type EntityFormConfig, type UseEntityFormResult } from "./use-entity-form";
import { EMPTY_REPORT, type LaboratoryReport } from "@/components/laboratory/types";
import {
  flattenProfileIntoRecord,
  stripSystemFields,
  sanitizePayload,
  type RawLabReportResponse,
} from "@/components/laboratory/utils";

// ---------------------------------------------------------------------------
// Laboratory-specific configuration
// ---------------------------------------------------------------------------

const laboratoryConfig: EntityFormConfig<LaboratoryReport> = {
  entityApi: api.entities.LaboratoryReport,
  emptyRecord: EMPTY_REPORT,
  draftKey: "laboratory",

  flattenResponse: (raw) => flattenProfileIntoRecord(raw as RawLabReportResponse),
  stripSystemFields,
  sanitizePayload,

  validate: (data) => {
    if (!data.seafarer_profile_id) {
      return "Please select a patient before saving.";
    }
    return null;
  },

  buildPersonalData: (profile: SeafarerProfile): Partial<LaboratoryReport> => ({
    seafarer_profile_id: profile.id,
    last_name: profile.last_name ?? "",
    first_name: profile.first_name ?? "",
    middle_name: profile.middle_name ?? "",
    birthdate: profile.birthdate ?? "",
    age: profile.age ?? "",
    gender: profile.gender ?? "",
    employer: profile.employer ?? "",
    position: profile.position ?? "",
  }),

  matchRecordToProfile: (record, profile) => {
    const raw = record as RawLabReportResponse;
    if (raw.seafarer_profile_id === profile.id) return true;
    const nested = raw.seafarer_profile;
    if (nested) {
      return (
        nested.last_name?.toLowerCase() === profile.last_name?.toLowerCase() &&
        nested.first_name?.toLowerCase() === profile.first_name?.toLowerCase()
      );
    }
    return (
      record.last_name?.toLowerCase() === profile.last_name?.toLowerCase() &&
      record.first_name?.toLowerCase() === profile.first_name?.toLowerCase()
    );
  },

  getRecordId: (record) => record.id,
  getProfileId: (record) => record.seafarer_profile_id,
  getBusinessId: (record) => record.report_id,
  getCreatedDate: (record) => record.created_date,

  successMessages: {
    create: "Laboratory report created successfully",
    update: "Laboratory report updated successfully",
  },
};

// ---------------------------------------------------------------------------
// Carry-forward personnel defaults
// ---------------------------------------------------------------------------

type LabPersonnelDefaults = Pick<
  LaboratoryReport,
  "med_tech" | "med_tech_license_no" | "pathologist" | "pathologist_license_no"
>;

/** Extracts only the personnel fields that carry into the next report. */
function getPersonnelDefaults(record: LaboratoryReport): LabPersonnelDefaults {
  return {
    med_tech: record.med_tech,
    med_tech_license_no: record.med_tech_license_no,
    pathologist: record.pathologist,
    pathologist_license_no: record.pathologist_license_no,
  };
}

// ---------------------------------------------------------------------------
// Public hook
// ---------------------------------------------------------------------------

/**
 * Manages Laboratory Report form state with full CRUD button behavior.
 *
 * Delegates to the generic `useEntityForm` with laboratory-specific config.
 */
export function useLaboratoryForm(): UseEntityFormResult<LaboratoryReport> {
  const personnelDefaultsRef = useRef<LabPersonnelDefaults>(
    getPersonnelDefaults(EMPTY_REPORT)
  );

  const config = useMemo<EntityFormConfig<LaboratoryReport>>(
    () => ({
      ...laboratoryConfig,
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
