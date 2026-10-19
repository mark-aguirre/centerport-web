"use client";

import { useMemo } from "react";
import { api, type SeafarerProfile } from "@/lib/api";
import { useEntityForm, type EntityFormConfig, type UseEntityFormResult } from "./use-entity-form";
import { useModuleDefaults, mapEntriesToFields } from "./use-module-defaults";
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

/**
 * Blank signatory defaults for a brand-new evaluation.
 *
 * Psychometrician / Psychologist are NEVER carried forward from the previous
 * record: a prior evaluation may have been signed by someone who is now
 * inactive in Medical Personnel, and carrying that name forward would resurrect
 * an inactive signatory on a new form. Instead these fields start blank and are
 * filled solely from the active Super Admin defaults resolved server-side.
 */
const BLANK_PERSONNEL_DEFAULTS: PsychologyPersonnelDefaults = {
  psychometrician: "",
  psychometrician_license_no: "",
  psychologist: "",
  psychologist_license_no: "",
};

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
  getBusinessId: (record) => record.eval_id,
  getCreatedDate: (record) => record.created_date,

  successMessages: {
    create: "Psychology evaluation created successfully",
    update: "Psychology evaluation updated successfully",
  },

  recordLabel: "psychology evaluation",
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
  // Active Super Admin defaults for the Psychology module (Psychometrician +
  // Psychologist). The server resolves these to ACTIVE personnel only, so an
  // inactive person is never pre-filled.
  const { entriesRef } = useModuleDefaults("PSYCHOLOGY");

  const config = useMemo<EntityFormConfig<PsychologyRecord>>(
    () => ({
      ...psychologyConfig,
      getNewRecordDefaults: () => {
        const assigned = mapEntriesToFields<PsychologyRecord>(
          entriesRef.current,
          {
            PSYCHOMETRICIAN: {
              name: "psychometrician",
              licenseNo: "psychometrician_license_no",
            },
            PSYCHOLOGIST: {
              name: "psychologist",
              licenseNo: "psychologist_license_no",
            },
          }
        );
        // Start from blank signatory fields (never carried forward), then
        // overlay only the active defaults. A role with no active default
        // stays blank instead of resurrecting a previous inactive signatory.
        return { ...BLANK_PERSONNEL_DEFAULTS, ...assigned };
      },
    }),
    [entriesRef]
  );

  return useEntityForm(config);
}
