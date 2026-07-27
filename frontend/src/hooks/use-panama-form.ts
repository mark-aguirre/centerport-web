"use client";

import { api, type SeafarerProfile } from "@/lib/api";
import { useEntityForm, type EntityFormConfig, type UseEntityFormResult } from "./use-entity-form";
import { EMPTY_CERTIFICATE, type PanamaCertificate } from "@/components/panama/types";
import type { RecordSummary } from "@/components/common/record-selector";
import {
  flattenProfileIntoRecord,
  stripSystemFields,
  sanitizePayload,
  type RawPanamaResponse,
} from "@/components/panama/utils";

// ---------------------------------------------------------------------------
// Panama-specific configuration
// ---------------------------------------------------------------------------

const panamaConfig: EntityFormConfig<PanamaCertificate> = {
  entityApi: api.entities.PanamaCertificate,
  emptyRecord: EMPTY_CERTIFICATE,

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
      passport_seaman_no: profile.passport_no || profile.seamans_book_no || "",
      home_address: profile.address ?? "",
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

  successMessages: {
    create: "Panama certificate created successfully",
    update: "Panama certificate updated successfully",
  },
};

// ---------------------------------------------------------------------------
// Public hook & types
// ---------------------------------------------------------------------------

export interface UsePanamaFormResult extends UseEntityFormResult<PanamaCertificate> {
  /** List of record summaries for the current patient (for the dropdown). */
  profileRecords: RecordSummary[];
  /** Switch to a different record by its UUID. */
  handleSelectRecord: (id: string) => void;
}

/**
 * Manages Panama certificate form state with full CRUD button behavior.
 *
 * Delegates to the generic `useEntityForm` with Panama-specific config.
 *
 * @returns Object with form state, action handlers, and ref for first-field focus
 */
export function usePanamaForm(): UsePanamaFormResult {
  return useEntityForm(panamaConfig);
}
