"use client";

import { useEffect, useMemo, useRef } from "react";
import { api, type SeafarerProfile } from "@/lib/api";
import {
  useEntityForm,
  type EntityFormConfig,
  type UseEntityFormResult,
} from "./use-entity-form";
import { useModuleDefaults, mapEntriesToFields } from "./use-module-defaults";
import {
  EMPTY_IMMUNOLOGY_REPORT,
  type ImmunologyReport,
} from "@/components/immunology/types";
import {
  flattenProfileIntoRecord,
  stripSystemFields,
  sanitizePayload,
  type RawImmunologyReportResponse,
} from "@/components/immunology/utils";

// ---------------------------------------------------------------------------
// Immunology-specific configuration
// ---------------------------------------------------------------------------

const immunologyConfig: EntityFormConfig<ImmunologyReport> = {
  entityApi: api.entities.ImmunologyReport,
  emptyRecord: EMPTY_IMMUNOLOGY_REPORT,
  draftKey: "immunology",

  flattenResponse: (raw) =>
    flattenProfileIntoRecord(raw as RawImmunologyReportResponse),
  stripSystemFields,
  sanitizePayload,

  validate: (data) => {
    if (!data.seafarer_profile_id) {
      return "Please select a patient before saving.";
    }
    return null;
  },

  buildPersonalData: (profile: SeafarerProfile): Partial<ImmunologyReport> => ({
    seafarer_profile_id: profile.id,
    last_name: profile.last_name ?? "",
    first_name: profile.first_name ?? "",
    middle_name: profile.middle_name ?? "",
    birthdate: profile.birthdate ?? "",
    age: profile.age ?? "",
    gender: profile.gender ?? "",
    employer: profile.employer ?? "",
    position: profile.position ?? "",
    address: profile.address ?? "",
  }),

  matchRecordToProfile: (record, profile) => {
    const raw = record as RawImmunologyReportResponse;
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
    create: "Immunology report created successfully",
    update: "Immunology report updated successfully",
  },

  recordLabel: "immunology report",
};

// ---------------------------------------------------------------------------
// Carry-forward personnel defaults
// ---------------------------------------------------------------------------

type ImmunologyPersonnelDefaults = Pick<
  ImmunologyReport,
  "med_tech" | "med_tech_license_no" | "pathologist" | "pathologist_license_no"
>;

/** Extracts only the personnel fields that carry into the next report. */
function getPersonnelDefaults(
  record: ImmunologyReport
): ImmunologyPersonnelDefaults {
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
 * Manages Immunology Report form state with full CRUD button behavior.
 *
 * Delegates to the generic `useEntityForm` with immunology-specific config.
 * Pre-fills Med Tech + Pathologist from the LABORATORY module's assigned
 * default signatories (immunology is handled by the same laboratory staff),
 * falling back to carry-forward from the previous report.
 */
export function useImmunologyForm(): UseEntityFormResult<ImmunologyReport> {
  const personnelDefaultsRef = useRef<ImmunologyPersonnelDefaults>(
    getPersonnelDefaults(EMPTY_IMMUNOLOGY_REPORT)
  );

  const { entriesRef } = useModuleDefaults("LABORATORY");

  const config = useMemo<EntityFormConfig<ImmunologyReport>>(
    () => ({
      ...immunologyConfig,
      getNewRecordDefaults: () => {
        const assigned = mapEntriesToFields<ImmunologyReport>(
          entriesRef.current,
          {
            MED_TECH: { name: "med_tech", licenseNo: "med_tech_license_no" },
            PATHOLOGIST: {
              name: "pathologist",
              licenseNo: "pathologist_license_no",
            },
          }
        );
        return { ...personnelDefaultsRef.current, ...assigned };
      },
    }),
    [entriesRef]
  );

  const form = useEntityForm(config);

  useEffect(() => {
    if (form.existingRecord) {
      personnelDefaultsRef.current = getPersonnelDefaults(form.existingRecord);
    }
  }, [form.existingRecord]);

  return form;
}
