"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { api, type SeafarerProfile, type PatientVisitRecord } from "@/lib/api";
import { ApiError } from "@/lib/http-client";

/** Empty profile template for new patient registration. */
const EMPTY_PROFILE: SeafarerProfile = {
  photo_url: "",
  last_name: "",
  first_name: "",
  middle_name: "",
  address: "",
  city: "",
  contact_no: "",
  birthdate: "",
  age: "",
  gender: "",
  marital_status: "",
  place_of_birth: "",
  religion: "",
  nationality: "",
  country: "",
  employer: "",
  designation: "",
  passport_no: "",
  seamans_book_no: "",
  position: "",
  country_of_destination: "",
  father_name: "",
  father_occupation: "",
  mother_name: "",
  mother_occupation: "",
  no_of_brothers: "",
  no_of_sisters: "",
  birth_order: "",
  spouse_name: "",
  spouse_occupation: "",
  no_of_children: "",
  elementary: "",
  high_school: "",
  college_university: "",
  course: "",
  highest_level_attended: "",
  prev_date_started: "",
  prev_date_end: "",
  prev_length_of_stay: "",
  prev_company: "",
  prev_position: "",
  prev_reason_of_leaving: "",
  remark: "",
};

/** System-managed fields excluded from create/update payloads. */
const SYSTEM_FIELDS = ["id", "profile_id", "created_date", "updated_date", "created_by"] as const;

/** Strips system-managed fields from a profile for API payloads. */
function stripSystemFields(profile: SeafarerProfile): Partial<SeafarerProfile> {
  const entries = Object.entries(profile).filter(
    ([key]) => !(SYSTEM_FIELDS as readonly string[]).includes(key)
  );
  return Object.fromEntries(entries) as Partial<SeafarerProfile>;
}

/** Replaces empty strings with null for cleaner backend persistence. */
function sanitize(payload: Partial<SeafarerProfile>): Partial<SeafarerProfile> {
  return Object.fromEntries(
    Object.entries(payload).map(([k, v]) => [k, v === "" ? null : v])
  ) as Partial<SeafarerProfile>;
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
  // When set, saves only update the profile — they do NOT create another visit.
  const [currentVisitId, setCurrentVisitId] = useState<string | null>(null);

  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [sirb, setSirb] = useState("");

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
    refreshList();
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
    setData({ ...EMPTY_PROFILE, ...profile });
    setSelectedProfile(profile);
    setIsExistingRecord(true);
    setEditing(true); // Enable editing so they can fill purpose/SIRB and save
    setCurrentVisitId(null); // Fresh session — first save creates one visit
    setPurposeOfVisit("");
    setSirb("");
    setFormDialogOpen(true);

    // Re-fetch full profile to ensure photo_url and all fields are loaded
    if (profile.id) {
      api.entities.SeafarerProfile.filter({ id: profile.id }).then((profiles) => {
        if (profiles.length > 0) {
          const full = profiles[0];
          setData({ ...EMPTY_PROFILE, ...full });
          setSelectedProfile(full);
        }
      }).catch(() => {});
    }
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
      setEditing(false);
    } else {
      closeFormDialog();
    }
  }, [selectedProfile, closeFormDialog]);

  /**
   * Save flow:
   * - If new patient (no profile): create profile first, then create visit record
   * - If existing patient: just create visit record linked to their profile
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
        // New patient — create profile first
        const created = await api.entities.SeafarerProfile.create(payload as SeafarerProfile);
        profileId = created.id!;
        setData({ ...EMPTY_PROFILE, ...created });
        setSelectedProfile(created);
        setIsExistingRecord(true);
      }

      // Only create ONE visit per session. If a visit was already created
      // (or we're editing an existing visit), skip creation — just save the profile.
      if (!currentVisitId) {
        const visit = await api.entities.PatientVisit.create({
          seafarer_profile_id: profileId,
          purpose_of_visit: purposeOfVisit || undefined,
          sirb: sirb || undefined,
        });
        setCurrentVisitId(visit.id ?? null);
        toast.success("Patient visit recorded successfully");
      } else {
        toast.success("Patient record updated");
      }

      setEditing(false);
      refreshList();
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

  /** Select a visit from the today list to view details. Fetches full profile. */
  const handleSelectVisit = useCallback(async (visit: PatientVisitRecord) => {
    setFormDialogOpen(true);
    setEditing(false);
    setCurrentVisitId(visit.id ?? null); // Existing visit — edits won't create a new one
    setPurposeOfVisit(visit.purpose_of_visit ?? "");
    setSirb(visit.sirb ?? "");

    // Fetch full profile to get all fields including photo_url
    try {
      const profiles = await api.entities.SeafarerProfile.filter({ id: visit.seafarer_profile_id });
      if (profiles.length > 0) {
        const profile = profiles[0];
        setData({ ...EMPTY_PROFILE, ...profile });
        setSelectedProfile(profile);
        setIsExistingRecord(true);
        return;
      }
    } catch {
      // Fallback to joined fields if fetch fails
    }

    // Fallback: use joined fields from visit record
    const profileData: SeafarerProfile = {
      ...EMPTY_PROFILE,
      id: visit.seafarer_profile_id,
      profile_id: visit.profile_id ?? "",
      photo_url: visit.photo_url ?? "",
      last_name: visit.last_name ?? "",
      first_name: visit.first_name ?? "",
      middle_name: visit.middle_name ?? "",
      gender: visit.gender ?? "",
      employer: visit.employer ?? "",
      position: visit.position ?? "",
    };
    setData(profileData);
    setSelectedProfile(profileData);
    setIsExistingRecord(true);
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
