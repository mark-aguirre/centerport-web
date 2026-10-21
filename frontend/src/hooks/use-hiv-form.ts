"use client";

import { useEffect, useMemo, useRef } from "react";
import { api, type SeafarerProfile } from "@/lib/api";
import {
  useEntityForm,
  type EntityFormConfig,
  type UseEntityFormResult,
} from "./use-entity-form";
import { useModuleDefaults, mapEntriesToFields } from "./use-module-defaults";
import { EMPTY_HIV_REPORT, type HivReport } from "@/components/hiv/types";
import {
  flattenProfileIntoRecord,
  stripSystemFields,
  sanitizePayload,
  type RawHivReportResponse,
} from "@/components/hiv/utils";

// ---------------------------------------------------------------------------
// HIV-specific configuration
// ---------------------------------------------------------------------------

const hivConfig: EntityFormConfig<HivReport> = {
  entityApi: api.entities.HivReport,
  emptyRecord: EMPTY_HIV_REPORT,
  draftKey: "hiv",

  flattenResponse: (raw) => flattenProfileIntoRecord(raw as RawHivReportResponse),
  stripSystemFields,
  sanitizePayload,

  validate: (data) => {
    if (!data.seafarer_profile_id) {
      return "Please select a patient before saving.";
    }
    return null;
  },

  buildPersonalData: (profile: SeafarerProfile): Partial<HivReport> => ({
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
    civil_status: profile.marital_status ?? "",
    photo_url: profile.photo_url ?? "",
  }),

  matchRecordToProfile: (record, profile) => {
    const raw = record as RawHivReportResponse;
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
    create: "HIV report created successfully",
    update: "HIV report updated successfully",
  },

  recordLabel: "HIV report",
};

// ---------------------------------------------------------------------------
// Carry-forward personnel defaults
// ---------------------------------------------------------------------------

type HivPersonnelDefaults = Pick<
  HivReport,
  | "med_tech"
  | "hiv_proficiency_cert_no"
  | "pathologist"
  | "pathologist_license_no"
  | "examining_physician"
  | "physician_license_no"
>;

/** Extracts only the personnel fields that carry into the next report. */
function getPersonnelDefaults(record: HivReport): HivPersonnelDefaults {
  return {
    med_tech: record.med_tech,
    hiv_proficiency_cert_no: record.hiv_proficiency_cert_no,
    pathologist: record.pathologist,
    pathologist_license_no: record.pathologist_license_no,
    examining_physician: record.examining_physician,
    physician_license_no: record.physician_license_no,
  };
}

// ---------------------------------------------------------------------------
// Public hook
// ---------------------------------------------------------------------------

/**
 * Manages HIV Report form state with full CRUD button behavior.
 *
 * Delegates to the generic `useEntityForm` with HIV-specific config.
 * Pre-fills Med Tech + Pathologist from the LABORATORY module's assigned
 * default signatories (HIV screening is handled by the same laboratory
 * staff), falling back to carry-forward from the previous report.
 */
export function useHivForm(): UseEntityFormResult<HivReport> {
  const personnelDefaultsRef = useRef<HivPersonnelDefaults>(
    getPersonnelDefaults(EMPTY_HIV_REPORT)
  );

  const { entriesRef } = useModuleDefaults("LABORATORY");

  const config = useMemo<EntityFormConfig<HivReport>>(
    () => ({
      ...hivConfig,
      getNewRecordDefaults: () => {
        const assigned = mapEntriesToFields<HivReport>(entriesRef.current, {
          MED_TECH: { name: "med_tech", licenseNo: "hiv_proficiency_cert_no" },
          PATHOLOGIST: {
            name: "pathologist",
            licenseNo: "pathologist_license_no",
          },
        });
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
