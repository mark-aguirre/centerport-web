"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { api, type SeafarerProfile, type PatientVisitRecord, EMPTY_PROFILE, PROFILE_SYSTEM_FIELDS } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import { stripSystemFields as genericStrip, sanitizePayload as genericSanitize } from "@/lib/form-utils";

/** Strips system-managed fields from a profile for API payloads. */
function stripSystemFields(profile: SeafarerProfile): Partial<SeafarerProfile> {
  return genericStrip(profile, PROFILE_SYSTEM_FIELDS);
}

/** Replaces empty strings with null for cleaner backend persistence. */
function sanitize(payload: Partial<SeafarerProfile>): Partial<SeafarerProfile> {
  return genericSanitize(payload);
}

/** Case-insensitive equality that treats null/undefined as empty. */
function sameText(a: string | undefined | null, b: string | undefined | null): boolean {
  return (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
}

/**
 * Looks up an existing profile that matches the given person, using the same
 * natural key the backend enforces: last name + first name + birthdate
 * (case-insensitive). Prevents registering a duplicate profile for someone who
 * is already on file.
 *
 * @param profile - the profile being saved
 * @returns the matching profile, or `null` when none is found
 */
async function findExistingProfile(
  profile: SeafarerProfile
): Promise<SeafarerProfile | null> {
  const keyword = `${profile.last_name} ${profile.first_name}`.trim();
  if (!keyword) return null;

  try {
    const candidates = await api.entities.SeafarerProfile.search(keyword, 25);
    const match = candidates.find(
      (candidate) =>
        sameText(candidate.last_name, profile.last_name) &&
        sameText(candidate.first_name, profile.first_name) &&
        sameText(candidate.birthdate, profile.birthdate)
    );
    return match ?? null;
  } catch {
    // A failed lookup must not block saving; fall back to normal create.
    return null;
  }
}

export interface UseVisitResult {
  // --- Search dialog ---
  searchDialogOpen: boolean;
  openSearchDialog: () => void;
  closeSearchDialog: () => void;

  // --- Form dialog ---
  formDialogOpen: boolean;
  closeFormDialog: () => void;

  // --- List ---
  todayVisits: PatientVisitRecord[];
  listLoading: boolean;
  refreshList: () => void;

  // --- Form ---
  data: SeafarerProfile;
  setData: React.Dispatch<React.SetStateAction<SeafarerProfile>>;
  editing: boolean;
  saving: boolean;
  isExistingRecord: boolean;
  purposeOfVisit: string;
  setPurposeOfVisit: (v: string) => void;
  sirb: string;
  setSirb: (v: string) => void;

  // --- Actions ---
  handleSelectPatient: (profile: SeafarerProfile) => void;
  handleRegisterNew: () => void;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => Promise<void>;
  handleSelectVisit: (visit: PatientVisitRecord) => void;

  firstFieldRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * Hook managing the Visit page state.
 *
 * Process flow:
 * 1. User clicks "New Patient" → search dialog opens
 * 2. User searches by name:
 *    - If found → select patient → form dialog opens in view mode
 *    - If not found → "Register New" → form dialog opens in edit mode
 * 3. On save:
 *    - If new patient → create profile in seafarer_profiles, then create visit in patient_visits
 *    - If existing patient → just create visit in patient_visits
 * 4. Today's list fetches from /api/visits (actual visit records)
 */
export function useVisit(): UseVisitResult {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [todayVisits, setTodayVisits] = useState<PatientVisitRecord[]>([]);
  const [listLoading, setListLoading] = useState(true);

  const [data, setData] = useState<SeafarerProfile>(EMPTY_PROFILE);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isExistingRecord, setIsExistingRecord] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<SeafarerProfile | null>(null);

  // Tracks the visit created/opened in the current form session.
  // When set, saves update that visit instead of creating a duplicate.
  const [currentVisitId, setCurrentVisitId] = useState<string | null>(null);

  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [sirb, setSirb] = useState("");
  const [savedPurposeOfVisit, setSavedPurposeOfVisit] = useState("");
  const [savedSirb, setSavedSirb] = useState("");

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // --- Load today's visits from /api/visits ---
  const refreshList = useCallback(async () => {
    setListLoading(true);
    try {
      const visits = await api.entities.PatientVisit.listToday();
      setTodayVisits(visits);
    } catch {
      setTodayVisits([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshList();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshList]);

  // --- Dialog controls ---
  const openSearchDialog = useCallback(() => {
    setSearchDialogOpen(true);
  }, []);

  const closeSearchDialog = useCallback(() => {
    setSearchDialogOpen(false);
  }, []);

  const closeFormDialog = useCallback(() => {
    setFormDialogOpen(false);
    setEditing(false);
  }, []);

  // --- Flow actions ---

  /** User selected an existing patient from search results. */
  const handleSelectPatient = useCallback((profile: SeafarerProfile) => {
    const completeProfile = { ...EMPTY_PROFILE, ...profile };
    setData(completeProfile);
    setSelectedProfile(completeProfile);
    setIsExistingRecord(true);
    setEditing(true); // Enable editing so they can fill purpose/SIRB and save
    setCurrentVisitId(null); // Fresh session — first save creates one visit
    setPurposeOfVisit("");
    setSirb("");
    setSavedPurposeOfVisit("");
    setSavedSirb("");
    setFormDialogOpen(true);
  }, []);

  /** User wants to register a brand new patient. */
  const handleRegisterNew = useCallback(() => {
    setData(EMPTY_PROFILE);
    setEditing(true);
    setIsExistingRecord(false);
    setSelectedProfile(null);
    setCurrentVisitId(null); // Fresh session — first save creates one visit
    setPurposeOfVisit("");
    setSirb("");
    setSavedPurposeOfVisit("");
    setSavedSirb("");
    setFormDialogOpen(true);
    setTimeout(() => firstFieldRef.current?.focus(), 150);
  }, []);

  /** Enter edit mode for current record. */
  const handleEdit = useCallback(() => {
    setEditing(true);
    setTimeout(() => firstFieldRef.current?.focus(), 100);
  }, []);

  /** Cancel editing. */
  const handleCancel = useCallback(() => {
    if (selectedProfile) {
      setData({ ...EMPTY_PROFILE, ...selectedProfile });
      setPurposeOfVisit(savedPurposeOfVisit);
      setSirb(savedSirb);
      setEditing(false);
    } else {
      closeFormDialog();
    }
  }, [selectedProfile, savedPurposeOfVisit, savedSirb, closeFormDialog]);

  /**
   * Saves all profile fields, then creates or updates the visit-specific fields.
   */
  const handleSave = useCallback(async () => {
    if (!data.last_name.trim()) {
      toast.error("Last Name is required");
      return;
    }
    if (!data.first_name.trim()) {
      toast.error("First Name is required");
      return;
    }

    setSaving(true);
    try {
      let profileId: string;
      const payload = sanitize(stripSystemFields(data));

      if (isExistingRecord && selectedProfile?.id) {
        // Existing patient — persist any profile edits (e.g. photo) then reuse ID
        profileId = selectedProfile.id;
        const updated = await api.entities.SeafarerProfile.update(profileId, payload);
        setData({ ...EMPTY_PROFILE, ...updated });
        setSelectedProfile(updated);
      } else {
        // New patient — but guard against creating a duplicate of someone who
        // already exists (e.g. re-registering the same person to add a photo).
        // The natural key is last name + first name + birthdate.
        const existing = await findExistingProfile(data);

        if (existing?.id) {
          // Same person already on file — update instead of duplicating.
          profileId = existing.id;
          const updated = await api.entities.SeafarerProfile.update(profileId, payload);
          setData({ ...EMPTY_PROFILE, ...updated });
          setSelectedProfile(updated);
          setIsExistingRecord(true);
        } else {
          const created = await api.entities.SeafarerProfile.create(payload as SeafarerProfile);
          if (!created.id) {
            throw new ApiError(500, "Profile was created without an ID");
          }
          profileId = created.id;
          setData({ ...EMPTY_PROFILE, ...created });
          setSelectedProfile(created);
          setIsExistingRecord(true);
        }
      }

      if (!currentVisitId) {
        const visit = await api.entities.PatientVisit.create({
          seafarer_profile_id: profileId,
          purpose_of_visit: purposeOfVisit || undefined,
          sirb: sirb || undefined,
        });
        setCurrentVisitId(visit.id ?? null);
        setPurposeOfVisit(visit.purpose_of_visit ?? "");
        setSirb(visit.sirb ?? "");
        setSavedPurposeOfVisit(visit.purpose_of_visit ?? "");
        setSavedSirb(visit.sirb ?? "");
        toast.success("Patient visit recorded successfully");
      } else {
        const visit = await api.entities.PatientVisit.update(currentVisitId, {
          purpose_of_visit: purposeOfVisit || null,
          sirb: sirb || null,
        });
        setPurposeOfVisit(visit.purpose_of_visit ?? "");
        setSirb(visit.sirb ?? "");
        setSavedPurposeOfVisit(visit.purpose_of_visit ?? "");
        setSavedSirb(visit.sirb ?? "");
        toast.success("Patient record updated");
      }

      setEditing(false);
      await refreshList();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to save patient visit");
      }
    } finally {
      setSaving(false);
    }
  }, [data, isExistingRecord, selectedProfile, purposeOfVisit, sirb, currentVisitId, refreshList]);

  /** Select a visit from today's list and load its complete patient profile. */
  const handleSelectVisit = useCallback(async (visit: PatientVisitRecord) => {
    if (!visit.id) {
      toast.error("Unable to open this visit because its record ID is missing");
      return;
    }

    setEditing(false);

    try {
      const profiles = await api.entities.SeafarerProfile.filter({
        id: visit.seafarer_profile_id,
      });
      const profile = profiles[0];
      if (!profile) {
        throw new Error("Linked patient profile was not found");
      }

      setData({ ...EMPTY_PROFILE, ...profile });
      setSelectedProfile(profile);
      setIsExistingRecord(true);
      setCurrentVisitId(visit.id);
      setPurposeOfVisit(visit.purpose_of_visit ?? "");
      setSirb(visit.sirb ?? "");
      setSavedPurposeOfVisit(visit.purpose_of_visit ?? "");
      setSavedSirb(visit.sirb ?? "");
      setFormDialogOpen(true);
    } catch {
      toast.error("Unable to load the complete patient record. Please try again.");
    }
  }, []);

  return {
    searchDialogOpen,
    openSearchDialog,
    closeSearchDialog,
    formDialogOpen,
    closeFormDialog,
    todayVisits,
    listLoading,
    refreshList,
    data,
    setData,
    editing,
    saving,
    isExistingRecord,
    purposeOfVisit,
    setPurposeOfVisit,
    sirb,
    setSirb,
    handleSelectPatient,
    handleRegisterNew,
    handleEdit,
    handleCancel,
    handleSave,
    handleSelectVisit,
    firstFieldRef,
  };
}
