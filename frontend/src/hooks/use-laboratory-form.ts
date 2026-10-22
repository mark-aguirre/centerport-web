"use client";

import { useEffect, useMemo, useRef } from "react";
import { api, type SeafarerProfile } from "@/lib/api";
import { useEntityForm, type EntityFormConfig, type UseEntityFormResult } from "./use-entity-form";
import { useModuleDefaults, mapEntriesToFields } from "./use-module-defaults";
import { useLaboratoryReferenceDefaults } from "./use-laboratory-reference-defaults";
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
    address: profile.address ?? "",
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

  recordLabel: "laboratory report",
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

  // Assigned Super Admin defaults for the Laboratory module (Med Tech +
  // Pathologist). These take precedence over carry-forward so a new report
  // always reflects the current assignments.
  const { entriesRef } = useModuleDefaults("LABORATORY");

  // Configured hematology + clinical-chemistry reference ("Normal Values" /
  // "Reference Range") defaults, seeded onto new reports only.
  const { defaultsRef: referenceDefaultsRef, defaults: referenceDefaults } =
    useLaboratoryReferenceDefaults();

  const config = useMemo<EntityFormConfig<LaboratoryReport>>(
    () => ({
      ...laboratoryConfig,
      getNewRecordDefaults: () => {
        const assigned = mapEntriesToFields<LaboratoryReport>(
          entriesRef.current,
          {
            MED_TECH: { name: "med_tech", licenseNo: "med_tech_license_no" },
            PATHOLOGIST: {
              name: "pathologist",
              licenseNo: "pathologist_license_no",
            },
          }
        );
        return {
          ...referenceDefaultsRef.current.report,
          ...personnelDefaultsRef.current,
          ...assigned,
        };
      },
    }),
    [entriesRef, referenceDefaultsRef]
  );

  const form = useEntityForm(config);

  useEffect(() => {
    if (form.existingRecord) {
      personnelDefaultsRef.current = getPersonnelDefaults(form.existingRecord);
    }
  }, [form.existingRecord]);

  // Fill the configured reference ("Normal Values" / "Reference Range") fields
  // on whatever report is in view — new or existing — whenever a reference
  // field is still blank. This makes the configured defaults display at all
  // times, including on older reports saved before these values were
  // configured. Only blank reference fields are filled, so values a report was
  // actually saved with (or that the user has typed) are never overwritten.
  //
  // The reference values are configuration, not patient results, so surfacing
  // the current defaults on an existing report is intended. Saving the report
  // then persists the shown ranges onto that record.
  // Re-run whenever the configured defaults arrive or a different record is
  // loaded/switched (existingRecord changes on load, record-switch, and save).
  const { setData } = form;
  const existingRecord = form.existingRecord;
  const reportDefaults = referenceDefaults.report;
  useEffect(() => {
    const keys = Object.keys(reportDefaults) as (keyof LaboratoryReport)[];
    if (keys.length === 0) return;

    // Defer to a macrotask so the setState does not run synchronously within
    // the effect body (react-hooks/set-state-in-effect).
    const handle = window.setTimeout(() => {
      setData((prev) => {
        // Only touch blank reference fields; bail out if nothing needs filling
        // so we don't trigger a needless re-render / state churn.
        let changed = false;
        const next = { ...prev };
        for (const key of keys) {
          if (!next[key] && reportDefaults[key]) {
            (next[key] as LaboratoryReport[typeof key]) = reportDefaults[
              key
            ] as LaboratoryReport[typeof key];
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 0);
    return () => window.clearTimeout(handle);
  }, [reportDefaults, existingRecord, setData]);

  return form;
}
