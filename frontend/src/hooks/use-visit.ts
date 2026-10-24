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

  // --- Add Visit dialog ---
  addVisitOpen: boolean;
  addVisitPatient: SeafarerProfile | null;
  addVisitPurpose: string;
  setAddVisitPurpose: (v: string) => void;
  addVisitSaving: boolean;
  handleAddVisit: (profile: SeafarerProfile) => void;
  closeAddVisit: () => void;
  handleCreateVisit: () => Promise<void>;

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
  /**
   * Whether the form's "Visit Details" section applies to the open record.
   *
   * False only for the directory's "View Details" flow, which is a look at the
   * patient's profile with no visit attached. Every other way into the dialog
   * either opens an existing visit or is on its way to creating one.
   */
  showVisitDetails: boolean;

  // --- Actions ---
  handleSelectPatient: (profile: SeafarerProfile) => void;
  handleViewPatient: (profile: SeafarerProfile) => void;
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

  // Compact "Add Visit" dialog, driven from the patient directory. Kept in its
  // own slice of state so opening it never disturbs the registration form.
  const [addVisitOpen, setAddVisitOpen] = useState(false);
  const [addVisitPatient, setAddVisitPatient] = useState<SeafarerProfile | null>(null);
  const [addVisitPurpose, setAddVisitPurpose] = useState("");
  const [addVisitSaving, setAddVisitSaving] = useState(false);

  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [sirb, setSirb] = useState("");
  const [savedPurposeOfVisit, setSavedPurposeOfVisit] = useState("");
  const [savedSirb, setSavedSirb] = useState("");

  // Whether the open record has a visit in play. Set by each entry point
  // rather than derived from `currentVisitId`, which is null both for a
  // profile-only look and for a session that is about to create its first
  // visit — two cases that need opposite answers.
  const [showVisitDetails, setShowVisitDetails] = useState(true);

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

  // --- Add Visit dialog ---

  /**
   * Opens the compact "Add Visit" dialog for a patient already on file.
   *
   * Separate from the registration dialog on purpose: the patient exists, so
   * the only thing missing is why they are here today. Re-using the full form
   * for this meant showing forty read-only demographic fields to capture one
   * value.
   */
  const handleAddVisit = useCallback((profile: SeafarerProfile) => {
    setAddVisitPatient(profile);
    setAddVisitPurpose("");
    setAddVisitOpen(true);
  }, []);

  const closeAddVisit = useCallback(() => {
    setAddVisitOpen(false);
  }, []);

  /**
   * Creates the visit, then closes and refreshes today's list.
   *
   * The dialog stays open on failure so the typed purpose is not lost.
   */
  const handleCreateVisit = useCallback(async () => {
    const purpose = addVisitPurpose.trim();
    if (!purpose) {
      toast.error("Purpose of Visit is required");
      return;
    }

    const profileId = addVisitPatient?.id;
    if (!profileId) {
      toast.error("Unable to add a visit because the patient record has no ID");
      return;
    }

    setAddVisitSaving(true);
    try {
      await api.entities.PatientVisit.create({
        seafarer_profile_id: profileId,
        purpose_of_visit: purpose,
      });
      toast.success("Visit added");
      setAddVisitOpen(false);
      await refreshList();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to add the visit");
      }
    } finally {
      setAddVisitSaving(false);
    }
  }, [addVisitPurpose, addVisitPatient, refreshList]);

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
    setShowVisitDetails(true);
    setPurposeOfVisit("");
    setSirb("");
    setSavedPurposeOfVisit("");
    setSavedSirb("");
    setFormDialogOpen(true);
  }, []);

  /**
   * User wants to read an existing patient's record without starting a visit.
   *
   * Same record as {@link handleSelectPatient} loads, but opened read-only and
   * with no visit session attached, so nothing is written unless the user
   * explicitly hits Edit and Save. That is the whole difference between the
   * directory's two row actions: "Add Visit" lands in edit mode ready to
   * capture purpose and SIRB, "View Details" just shows what is on file.
   */
  const handleViewPatient = useCallback((profile: SeafarerProfile) => {
    const completeProfile = { ...EMPTY_PROFILE, ...profile };
    setData(completeProfile);
    setSelectedProfile(completeProfile);
    setIsExistingRecord(true);
    setEditing(false);
    setCurrentVisitId(null);
    // Profile-only view: there is no visit to show details for.
    setShowVisitDetails(false);
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
    setShowVisitDetails(true);
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
      setShowVisitDetails(true);
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
    addVisitOpen,
    addVisitPatient,
    addVisitPurpose,
    setAddVisitPurpose,
    addVisitSaving,
    handleAddVisit,
    closeAddVisit,
    handleCreateVisit,
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
    showVisitDetails,
    handleSelectPatient,
    handleViewPatient,
    handleRegisterNew,
    handleEdit,
    handleCancel,
    handleSave,
    handleSelectVisit,
    firstFieldRef,
  };
}
