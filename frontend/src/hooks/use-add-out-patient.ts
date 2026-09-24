"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { api, EMPTY_PROFILE, type SeafarerProfile } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import type { Customer } from "@/components/transaction/types";

/**
 * Minimal set of fields collected when registering a walk-in / out-patient
 * from the POS workspace. A walk-in doesn't need the full seafarer profile —
 * just enough to identify and bill them. The rest of the profile is filled
 * with blanks and can be completed later on the Profile page.
 */
export interface OutPatientDraft {
  last_name: string;
  first_name: string;
  middle_name: string;
  contact_no: string;
  employer: string;
}

const EMPTY_DRAFT: OutPatientDraft = {
  last_name: "",
  first_name: "",
  middle_name: "",
  contact_no: "",
  employer: "",
};

/** Formats a numeric sequence into the `CMSI########` profile-id format. */
function formatProfileId(num: number): string {
  return `CMSI${String(num).padStart(8, "0")}`;
}

/**
 * Generate the next sequential profile ID.
 *
 * Orders by `profile_id` descending (not by created date) so we pick the
 * numerically highest existing ID. Ordering by newest-created is unreliable
 * because a recently-created record may carry a lower sequence number, which
 * would regenerate a colliding ID.
 */
async function generateProfileId(): Promise<string> {
  const latest = await api.entities.SeafarerProfile.list("-profile_id", 1);
  if (latest.length === 0) return formatProfileId(1);
  const lastId = latest[0].profile_id || "CMSI00000000";
  const num = parseInt(lastId.replace("CMSI", ""), 10);
  return formatProfileId((Number.isNaN(num) ? 0 : num) + 1);
}

/** True when an error is a backend duplicate-key / unique-constraint failure. */
function isDuplicateIdError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  const msg = error.message.toLowerCase();
  return (
    error.status === 409 ||
    msg.includes("duplicate") ||
    msg.includes("already exists") ||
    msg.includes("unique constraint")
  );
}

/** Maps a persisted profile into the read-only Customer projection used by POS. */
function profileToCustomer(profile: SeafarerProfile): Customer {
  const name = `${profile.first_name} ${profile.last_name}`.trim();
  return {
    id: profile.id as string,
    name,
    application_no: profile.profile_id ?? null,
    agency: profile.employer || null,
  };
}

interface UseAddOutPatientOptions {
  /** Called with the created customer so the caller can select it into the sale. */
  onCreated: (customer: Customer) => void;
}

/**
 * Controller for the "Add Out-Patient" dialog.
 *
 * Owns the draft form state and the create flow. Because a POS "Customer" is a
 * read-only projection of a {@link SeafarerProfile}, creating a walk-in means
 * creating a minimal profile via `POST /api/profiles`, then mapping the
 * persisted record into a {@link Customer} and handing it to `onCreated`.
 *
 * @param onCreated - Receives the created customer (e.g. to select it into the
 *   current transaction).
 */
export function useAddOutPatient({ onCreated }: UseAddOutPatientOptions) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<OutPatientDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);

  const openDialog = useCallback((prefillName?: string) => {
    // Prefill the last name from the search box, if the cashier typed one.
    setDraft({ ...EMPTY_DRAFT, last_name: prefillName?.trim() ?? "" });
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    if (saving) return;
    setOpen(false);
  }, [saving]);

  const updateField = useCallback(
    <K extends keyof OutPatientDraft>(field: K, value: OutPatientDraft[K]) => {
      setDraft((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const save = useCallback(async () => {
    if (!draft.last_name.trim() || !draft.first_name.trim()) {
      toast.error("Please fill in the required fields (Last Name, First Name)");
      return;
    }

    setSaving(true);
    try {
      const base: SeafarerProfile = {
        ...EMPTY_PROFILE,
        last_name: draft.last_name.trim(),
        first_name: draft.first_name.trim(),
        middle_name: draft.middle_name.trim(),
        contact_no: draft.contact_no.trim(),
        employer: draft.employer.trim(),
      };

      // Retry on a duplicate profile_id: the sequence can collide if another
      // record was created between generating the id and inserting it, or if a
      // gap in the sequence makes "max + 1" land on an existing id. Regenerate
      // and retry a few times before surfacing the error.
      let persisted: SeafarerProfile | null = null;
      let lastError: unknown = null;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          const profileId = await generateProfileId();
          persisted = await api.entities.SeafarerProfile.create({
            ...base,
            profile_id: profileId,
          });
          break;
        } catch (error) {
          lastError = error;
          if (!isDuplicateIdError(error)) throw error;
        }
      }

      if (!persisted) throw lastError ?? new Error("Failed to register out-patient");

      toast.success("Out-patient registered successfully");
      onCreated(profileToCustomer(persisted));
      setOpen(false);
      setDraft(EMPTY_DRAFT);
    } catch (error) {
      if (error instanceof ApiError && error.violations.length > 0) {
        error.violations.forEach((v) => toast.error(`${v.field}: ${v.message}`));
      } else if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to register out-patient");
      }
    } finally {
      setSaving(false);
    }
  }, [draft, onCreated]);

  return {
    open,
    setOpen,
    openDialog,
    closeDialog,
    draft,
    updateField,
    saving,
    save,
  };
}
