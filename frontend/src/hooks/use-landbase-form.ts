"use client";

import { api, type SeafarerProfile } from "@/lib/api";
import { useEntityForm, type EntityFormConfig, type UseEntityFormResult } from "./use-entity-form";
import { EMPTY_PEME, type LandbasePeme } from "@/components/landbase/types";
import type { PemeSummary } from "@/components/landbase/PemeSelector";
import {
  flattenProfileIntoRecord,
  stripSystemFields,
  sanitizePayload,
  type RawPemeResponse,
} from "@/components/landbase/utils";

// ---------------------------------------------------------------------------
// Landbase-specific configuration
// ---------------------------------------------------------------------------

const landbaseConfig: EntityFormConfig<LandbasePeme> = {
  entityApi: api.entities.LandbasePeme,
  emptyRecord: EMPTY_PEME,

  flattenResponse: (raw) => flattenProfileIntoRecord(raw as RawPemeResponse),
  stripSystemFields,
  sanitizePayload,

  validate: (data) => {
    if (!data.seafarer_profile_id) {
      return "Please select a patient before saving.";
    }
    if (!data.last_name || !data.first_name) {
      return null; // Let the toast-based validation handle this below
    }
    return null;
  },

  buildPersonalData: (profile: SeafarerProfile): Partial<LandbasePeme> => ({
    seafarer_profile_id: profile.id,
    last_name: profile.last_name ?? "",
    first_name: profile.first_name ?? "",
    middle_name: profile.middle_name ?? "",
    place_of_birth: profile.place_of_birth ?? "",
    passport_no: profile.passport_no ?? "",
    religion: profile.religion ?? "",
    nationality: profile.nationality ?? "",
    gender: (profile.gender as LandbasePeme["gender"]) ?? "",
    civil_status: (profile.marital_status as LandbasePeme["civil_status"]) ?? "",
    address: profile.address ?? "",
    contact_no: profile.contact_no ?? "",
    employer: profile.employer ?? "",
    position: profile.position ?? "",
  }),

  matchRecordToProfile: (record, profile) => {
    const raw = record as RawPemeResponse;
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
  getBusinessId: (record) => record.peme_id,
  getCreatedDate: (record) => record.created_date,

  successMessages: {
    create: "PEME record created successfully",
    update: "PEME record updated successfully",
  },
};

// ---------------------------------------------------------------------------
// Public hook & types
// ---------------------------------------------------------------------------

/**
 * Result type for `useLandbaseForm`.
 *
 * Extends the generic entity form result with landbase-specific
 * aliases (profilePemes, handleSelectPeme) for backward compatibility
 * with the existing page component.
 */
export interface UseLandbaseFormResult extends UseEntityFormResult<LandbasePeme> {
  /** List of PEME summaries for the current patient (for the dropdown). */
  profilePemes: PemeSummary[];
  /** Switch to a different PEME record by its UUID. */
  handleSelectPeme: (id: string) => void;
}

/**
 * Manages Landbase PEME form state with full CRUD button behavior.
 *
 * Delegates to the generic `useEntityForm` with landbase-specific config.
 * Provides backward-compatible `profilePemes` and `handleSelectPeme`
 * aliases so existing page components don't need changes.
 *
 * @returns Object with form state, action handlers, and ref for first-field focus
 */
export function useLandbaseForm(): UseLandbaseFormResult {
  const form = useEntityForm(landbaseConfig);

  // Map generic profileRecords to PemeSummary shape for backward compat
  const profilePemes: PemeSummary[] = form.profileRecords.map((r) => ({
    id: r.id,
    peme_id: r.record_id,
    created_date: r.created_date,
  }));

  return {
    ...form,
    profilePemes,
    handleSelectPeme: form.handleSelectRecord,
  };
}
