"use client";

import { useEffect, useMemo, useRef } from "react";
import { api, type SeafarerProfile } from "@/lib/api";
import { useEntityForm, type EntityFormConfig, type UseEntityFormResult } from "./use-entity-form";
import { EMPTY_PSYCHOLOGY_RECORD, type PsychologyRecord } from "@/components/psychology/types";
import {
  flattenProfileIntoRecord,
  stripSystemFields,
  sanitizePayload,
  type RawPsychologyResponse,
} from "@/components/psychology/utils";

// ---------------------------------------------------------------------------
// Psychology-specific configuration
// ---------------------------------------------------------------------------

type PsychologyPersonnelDefaults = Pick<
  PsychologyRecord,
  | "psychometrician"
  | "psychometrician_license_no"
  | "psychologist"
  | "psychologist_license_no"
>;

/** Selects only the examiner details that should carry into the next evaluation. */
function getPersonnelDefaults(record: PsychologyRecord): PsychologyPersonnelDefaults {
  return {
    psychometrician: record.psychometrician,
    psychometrician_license_no: record.psychometrician_license_no,
    psychologist: record.psychologist,
    psychologist_license_no: record.psychologist_license_no,
  };
}

const psychologyConfig: EntityFormConfig<PsychologyRecord> = {
  entityApi: api.entities.PsychologyEvaluation,
  emptyRecord: EMPTY_PSYCHOLOGY_RECORD,
  draftKey: "psychology",

  flattenResponse: (raw) => flattenProfileIntoRecord(raw as RawPsychologyResponse),
  stripSystemFields,
  sanitizePayload,

  validate: (data) => {
    if (!data.seafarer_profile_id) {
      return "Please select a patient before saving.";
    }
    return null;
  },

  buildPersonalData: (profile: SeafarerProfile): Partial<PsychologyRecord> => ({
    seafarer_profile_id: profile.id,
    last_name: profile.last_name ?? "",
    first_name: profile.first_name ?? "",
    middle_name: profile.middle_name ?? "",
    date_of_birth: profile.birthdate ?? "",
    age: profile.age ?? "",
    gender: (profile.gender as PsychologyRecord["gender"]) ?? "",
    employer: profile.employer ?? "",
    position: profile.position ?? "",
  }),

  matchRecordToProfile: (record, profile) => {
    const raw = record as RawPsychologyResponse;
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
  getBusinessId: (record) => record.psych_id,
  getCreatedDate: (record) => record.created_date,

  successMessages: {
    create: "Psychology evaluation created successfully",
    update: "Psychology evaluation updated successfully",
  },
};

// ---------------------------------------------------------------------------
// Public hook
// ---------------------------------------------------------------------------

/**
 * Manages Psychology evaluation form state with full CRUD button behavior.
 *
 * Delegates to the generic `useEntityForm` with psychology-specific config.
 * Connected to the backend `/api/psychology-evaluations` endpoint.
 */
export function usePsychologyForm(): UseEntityFormResult<PsychologyRecord> {
  const personnelDefaultsRef = useRef<PsychologyPersonnelDefaults>(
    getPersonnelDefaults(EMPTY_PSYCHOLOGY_RECORD)
  );

  const config = useMemo<EntityFormConfig<PsychologyRecord>>(
    () => ({
      ...psychologyConfig,
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
