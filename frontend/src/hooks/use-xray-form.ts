"use client";

import { useEffect, useMemo, useRef } from "react";
import { api, type SeafarerProfile } from "@/lib/api";
import {
  useEntityForm,
  type EntityFormConfig,
  type UseEntityFormResult,
} from "./use-entity-form";
import { useModuleDefaults, mapEntriesToFields } from "./use-module-defaults";
import { EMPTY_XRAY_REPORT, type XrayReport } from "@/components/xray/types";
import {
  flattenProfileIntoRecord,
  stripSystemFields,
  sanitizePayload,
  type RawXrayReportResponse,
} from "@/components/xray/utils";

// ---------------------------------------------------------------------------
// X-Ray-specific configuration
// ---------------------------------------------------------------------------

const xrayConfig: EntityFormConfig<XrayReport> = {
  entityApi: api.entities.XrayReport,
  emptyRecord: EMPTY_XRAY_REPORT,
  draftKey: "xray",

  flattenResponse: (raw) => flattenProfileIntoRecord(raw as RawXrayReportResponse),
  stripSystemFields,
  sanitizePayload,

  validate: (data) => {
    if (!data.seafarer_profile_id) {
      return "Please select a patient before saving.";
    }
    if (!data.radiology_findings.trim()) {
      return "Radiology Findings is required.";
    }
    if (!data.impression.trim()) {
      return "Impression is required.";
    }
    return null;
  },

  buildPersonalData: (profile: SeafarerProfile): Partial<XrayReport> => ({
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
    const raw = record as RawXrayReportResponse;
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

  /** A new report defaults to today's result date, as on the reference form. */
  getNewRecordDefaults: () => ({
    result_date: new Date().toISOString().slice(0, 10),
  }),

  successMessages: {
    create: "X-Ray result created successfully",
    update: "X-Ray result updated successfully",
  },

  recordLabel: "x-ray result",
};

// ---------------------------------------------------------------------------
// Carry-forward personnel defaults
// ---------------------------------------------------------------------------

type RadiologyPersonnelDefaults = Pick<
  XrayReport,
  "xray_tech" | "xray_tech_license_no" | "radiologist" | "radiologist_license_no"
>;

/** Extracts only the personnel fields that carry into the next report. */
function getPersonnelDefaults(record: XrayReport): RadiologyPersonnelDefaults {
  return {
    xray_tech: record.xray_tech,
    xray_tech_license_no: record.xray_tech_license_no,
    radiologist: record.radiologist,
    radiologist_license_no: record.radiologist_license_no,
  };
}

// ---------------------------------------------------------------------------
// Public hook
// ---------------------------------------------------------------------------

/**
 * Manages X-Ray Result form state with full CRUD button behavior.
 *
 * Delegates to the generic `useEntityForm` with x-ray-specific config.
 * Pre-fills the X-Ray Technologist and Radiologist from the XRAY module's
 * assigned default signatories, falling back to carry-forward from the
 * previous report.
 */
export function useXrayForm(): UseEntityFormResult<XrayReport> {
  const personnelDefaultsRef = useRef<RadiologyPersonnelDefaults>(
    getPersonnelDefaults(EMPTY_XRAY_REPORT)
  );

  const { entriesRef } = useModuleDefaults("XRAY");

  const config = useMemo<EntityFormConfig<XrayReport>>(
    () => ({
      ...xrayConfig,
      getNewRecordDefaults: () => {
        const assigned = mapEntriesToFields<XrayReport>(entriesRef.current, {
          XRAY_TECH: {
            name: "xray_tech",
            licenseNo: "xray_tech_license_no",
          },
          RADIOLOGIST: {
            name: "radiologist",
            licenseNo: "radiologist_license_no",
          },
        });
        return {
          ...xrayConfig.getNewRecordDefaults!(),
          ...personnelDefaultsRef.current,
          ...assigned,
        };
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
