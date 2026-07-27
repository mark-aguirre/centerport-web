"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api, type SeafarerProfile } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import { useProfileSearch } from "./use-profile-search";
import type { MedicalExam } from "@/components/medical/types";

/** Empty default state for a new Medical Examination record */
export const EMPTY_EXAM: MedicalExam = {
  // Personal Information
  last_name: "",
  first_name: "",
  middle_name: "",
  place_of_birth: "",
  passport_no: "",
  religion: "",
  nationality: "",
  gender: "",
  civil_status: "",
  address: "",
  contact_no: "",
  employer: "",
  position: "",
  date_of_birth: "",
  age: "",

  // Physical Examination - Vital Signs
  pe_height: "",
  pe_bp_systolic: "",
  pe_bp_diastolic: "",
  pe_pulse_rate: "",
  pe_respiration: "",
  pe_body_temperature: "",
  pe_weight: "",
  pe_mm_ym: "",
  pe_bmi: "",
  blood_pressure: "",
  bp_classification: "",
  heart_rate: "",
  respiratory_rate: "",
  temperature: "",
  weight: "",
  height: "",
  bmi: "",
  oxygen_saturation: "",

  // Vision
  vision_far_od: "",
  vision_far_os: "",
  vision_near_od: "",
  vision_near_os: "",
  vision_uncorrected_far_od: "",
  vision_uncorrected_far_os: "",
  vision_uncorrected_near_od: "",
  vision_uncorrected_near_os: "",
  vision_corrected_far_od: "",
  vision_corrected_far_os: "",
  vision_corrected_near_od: "",
  vision_corrected_near_os: "",
  vision_color: "",
  vision_visual_acuity: "",
  vision_meets_stcw: "",
  vision_contact_lenses: "",
  vision_date_taken: "",

  // Audiometry
  audio_hearing_by: "",
  audio_as_right_1: "",
  audio_as_right_2: "",
  audio_as_left_1: "",
  audio_as_left_2: "",
  audio_ad_right_1: "",
  audio_ad_right_2: "",
  audio_ad_left_1: "",
  audio_ad_left_2: "",
  audio_satisfactory: "",

  // Speech
  speech_impaired_hearing: "",

  // Medical condition questions
  condition_aggravated_sea: "",
  identification_docs_checked: "",
  fit_for_lookout: "",

  // Physical Examination - Systems
  skin: "",
  skin_remarks: "",
  heent: "",
  heent_remarks: "",
  neck: "",
  neck_remarks: "",
  chest_lungs: "",
  chest_lungs_remarks: "",
  cardiovascular: "",
  cardiovascular_remarks: "",
  abdomen: "",
  abdomen_remarks: "",
  extremities: "",
  extremities_remarks: "",
  neurological: "",
  neurological_remarks: "",

  // Visual Acuity
  visual_acuity_right: "",
  visual_acuity_left: "",
  visual_acuity_corrected: "",
  color_vision: "",

  // Findings
  findings_a: {},
  findings_b: {},
  findings_c: {},

  // Questionnaire
  questionnaire: {},
  questionnaire_comments: "",
  questionnaire_medications_detail: "",

  // Past Medical History (used by Physical Examination sub-section)
  medical_history: {},
  medical_history_others: "",
  consulted_doctor_past: "",
  maintenance_medications: "",

  // Result of Ancillary Examinations
  xray_no: "",
  ancillary_chest_xray: "",
  ancillary_chest_xray_findings: "",
  ancillary_ecg: "",
  ancillary_ecg_findings: "",
  ancillary_cbc: "",
  ancillary_cbc_findings: "",
  ancillary_urinalysis: "",
  ancillary_urinalysis_findings: "",
  ancillary_stool_exam: "",
  ancillary_stool_exam_findings: "",
  ancillary_hbsag: "",
  ancillary_hiv_aids: "",
  ancillary_pregnancy_test: "",
  ancillary_rpr: "",
  ancillary_rpr_findings: "",
  ancillary_blood_type: "",
  ancillary_psychological_test: "",
  ancillary_additional_tests: "",

  // Final Recommendation
  recommendation_remarks: "",
  cert_basic_ooh: "",
  cert_basic_ooh_findings: "",
  cert_additional_labs: "",
  cert_additional_labs_findings: "",
  cert_flagpost: "",
  cert_flagpost_findings: "",

  // Assessment of Fitness for Service at Sea
  fitness_deck_services: "",
  fitness_engine_services: "",
  fitness_catering_services: "",
  fitness_other_services: "",
  visual_aids_required: "",

  // Dates and Certification
  date_initial_peme: "",
  date_of_fitness: "",
  valid_until: "",
  authorized_physician: "",
  medical_certification_no: "",
  medical_director: "",



  // Physician
  examining_physician: "",
  license_no: "",
};

export interface UseMedicalFormResult {
  /** Current form data. */
  data: MedicalExam;
  /** Replace form data directly (used by section onChange callbacks). */
  setData: (data: MedicalExam) => void;
  /** True while the initial record is being fetched. */
  loading: boolean;
  /** True while a save operation is in-flight. */
  saving: boolean;
  /** True when the form is in edit mode (fields enabled). */
  editing: boolean;
  /** True when viewing/editing a persisted record (vs a new unsaved one). */
  isExistingRecord: boolean;
  /** The persisted record currently loaded (null when creating new). */
  existingRecord: MedicalExam | null;
  /** Reset form to empty and enter new-record edit mode. */
  handleNew: () => void;
  /** Enter edit mode for the currently loaded record. */
  handleEdit: () => void;
  /** Discard changes and return to view mode. */
  handleCancel: () => void;
  /** Validate and persist the current form data. */
  handleSave: () => Promise<void>;
  /** Trigger browser print dialog. */
  handlePrint: () => void;
  /** Ref for the first focusable field (auto-focused on New). */
  firstFieldRef: React.RefObject<HTMLInputElement | null>;
  /** Search results from seafarer profiles. */
  searchResults: SeafarerProfile[];
  /** Whether a search request is in-flight. */
  searchLoading: boolean;
  /** Trigger a profile search by keyword (debounced). */
  handleSearch: (keyword: string) => void;
  /** Load a selected profile result into the form's personal info. */
  handleSelectResult: (profile: SeafarerProfile) => void;
  /** Transient error message shown when save is blocked (auto-clears). */
  saveAlert: string | null;
}

/** Fields that are server-managed and should not be sent on create/update. */
const SYSTEM_FIELDS = ["id", "exam_id", "created_date", "updated_date", "seafarer_profile"] as const;

/**
 * Strip system fields from the payload before sending to the backend.
 */
function stripSystemFields(record: MedicalExam): Partial<MedicalExam> {
  const payload = { ...record };
  for (const field of SYSTEM_FIELDS) {
    delete (payload as Record<string, unknown>)[field];
  }
  return payload;
}

/**
 * Flatten the nested seafarer_profile response into top-level personal info fields.
 * The backend returns `seafarer_profile: { last_name, first_name, ... }` alongside
 * the exam record. We merge those into the flat form shape.
 */
function flattenResponse(record: MedicalExam): MedicalExam {
  const raw = record as MedicalExam & {
    seafarer_profile?: {
      id?: string;
      last_name?: string;
      first_name?: string;
      middle_name?: string;
      place_of_birth?: string;
      passport_no?: string;
      religion?: string;
      nationality?: string;
      gender?: string;
      marital_status?: string;
      address?: string;
      contact_no?: string;
      employer?: string;
      position?: string;
      birthdate?: string;
      age?: string;
    };
  };

  const profile = raw.seafarer_profile;
  if (!profile) return { ...EMPTY_EXAM, ...record };

  return {
    ...EMPTY_EXAM,
    ...record,
    last_name: record.last_name || profile.last_name || "",
    first_name: record.first_name || profile.first_name || "",
    middle_name: record.middle_name || profile.middle_name || "",
    place_of_birth: record.place_of_birth || profile.place_of_birth || "",
    passport_no: record.passport_no || profile.passport_no || "",
    religion: record.religion || profile.religion || "",
    nationality: record.nationality || profile.nationality || "",
    gender: (record.gender || profile.gender || "") as MedicalExam["gender"],
    civil_status: (record.civil_status || profile.marital_status || "") as MedicalExam["civil_status"],
    address: record.address || profile.address || "",
    contact_no: record.contact_no || profile.contact_no || "",
    employer: record.employer || profile.employer || "",
    position: record.position || profile.position || "",
    date_of_birth: record.date_of_birth || profile.birthdate || "",
    age: record.age || profile.age || "",
  };
}

/**
 * Manages Medical Examination form state with full CRUD button behavior.
 *
 * Handles both create and edit flows by reading the `id` search param.
 * When an ID is present, fetches that specific record from the backend.
 * When no ID is present, loads the most recently updated exam from the
 * database. If the database is empty, shows an empty form ready for new entry.
 *
 * @returns Object with form state, action handlers, and ref for first-field focus
 */
export function useMedicalForm(): UseMedicalFormResult {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [data, setData] = useState<MedicalExam>(EMPTY_EXAM);
  const [originalData, setOriginalData] = useState<MedicalExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isExistingRecord, setIsExistingRecord] = useState(!!editId);
  const [existingRecord, setExistingRecord] = useState<MedicalExam | null>(null);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const {
    searchResults: profileSearchResults,
    searchLoading: profileSearchLoading,
    handleSearch,
    clearSearch,
  } = useProfileSearch();

  // --- Initial data load ---
  useEffect(() => {
    const loadRecord = async () => {
      try {
        let results: MedicalExam[];
        if (editId) {
          results = await api.entities.MedicalExam.filter({ id: editId });
        } else {
          results = await api.entities.MedicalExam.list("-updated_date", 1);
        }

        if (results.length > 0) {
          const flattened = flattenResponse(results[0]);
          setExistingRecord(flattened);
          setData(flattened);
          setIsExistingRecord(true);
        }
      } catch {
        // Silently handle — form stays empty for new entry
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [editId]);

  /** Clear form, enter edit mode for a new record. */
  const handleNew = useCallback(() => {
    setData(EMPTY_EXAM);
    setOriginalData(null);
    setEditing(true);
    setIsExistingRecord(false);
    setExistingRecord(null);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  }, []);

  /** Enter edit mode, snapshot current data for cancel/restore. */
  const handleEdit = useCallback(() => {
    setOriginalData({ ...data });
    setEditing(true);
  }, [data]);

  /** Discard changes and return to view mode. */
  const handleCancel = useCallback(() => {
    if (isExistingRecord && originalData) {
      setData(originalData);
    } else if (isExistingRecord && existingRecord) {
      setData(existingRecord);
    } else {
      setData(EMPTY_EXAM);
    }
    setOriginalData(null);
    setEditing(false);
  }, [isExistingRecord, originalData, existingRecord]);

  /** Validate, persist via API, and return to view mode. */
  const handleSave = useCallback(async () => {
    // Validation: require a linked seafarer profile
    if (!data.seafarer_profile_id) {
      setSaveAlert("Please select a patient before saving.");
      setTimeout(() => setSaveAlert(null), 2000);
      return;
    }
    // Validation: require name fields
    if (!data.last_name || !data.first_name) {
      toast.error("Please fill in the required fields (Last Name, First Name)");
      return;
    }

    setSaving(true);
    try {
      const payload = stripSystemFields(data);
      let persisted: MedicalExam;

      if (isExistingRecord && existingRecord?.id) {
        persisted = await api.entities.MedicalExam.update(
          existingRecord.id,
          payload
        );
        toast.success("Medical exam updated successfully");
      } else {
        persisted = await api.entities.MedicalExam.create(
          payload as MedicalExam
        );
        setIsExistingRecord(true);
        toast.success("Medical exam created successfully");
      }

      const flattened = flattenResponse(persisted);
      setData(flattened);
      setExistingRecord(flattened);
      setOriginalData(null);
      setEditing(false);
    } catch (error) {
      if (error instanceof ApiError && error.violations.length > 0) {
        error.violations.forEach((v) => {
          toast.error(`${v.field}: ${v.message}`);
        });
      } else if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save medical exam record");
      }
    } finally {
      setSaving(false);
    }
  }, [data, isExistingRecord, existingRecord]);

  /** Trigger browser print dialog. */
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  /**
   * Load a selected seafarer profile into the form.
   *
   * Searches for an existing Medical Exam linked to that seafarer. If found,
   * loads the full record. Otherwise populates only personal info fields
   * so the user can create a new exam for this seafarer.
   */
  const handleSelectResult = useCallback(
    (profile: SeafarerProfile) => {
      const personalData: Partial<MedicalExam> = {
        seafarer_profile_id: profile.id,
        last_name: profile.last_name ?? "",
        first_name: profile.first_name ?? "",
        middle_name: profile.middle_name ?? "",
        place_of_birth: profile.place_of_birth ?? "",
        passport_no: profile.passport_no ?? "",
        religion: profile.religion ?? "",
        nationality: profile.nationality ?? "",
        gender: (profile.gender ?? "") as MedicalExam["gender"],
        civil_status: (profile.marital_status ?? "") as MedicalExam["civil_status"],
        address: profile.address ?? "",
        contact_no: profile.contact_no ?? "",
        employer: profile.employer ?? "",
        position: profile.position ?? "",
        date_of_birth: profile.birthdate ?? "",
        age: profile.age ?? "",
      };

      const applyPersonalOnly = () => {
        if (editing) {
          setData((prev) => ({ ...prev, ...personalData }));
        } else {
          setData({ ...EMPTY_EXAM, ...personalData });
          setIsExistingRecord(false);
          setExistingRecord(null);
          setEditing(true);
        }
      };

      const searchName = (profile.last_name ?? "").trim();
      if (searchName) {
        api.entities.MedicalExam.search(searchName, 10)
          .then((results) => {
            const match = results.find(
              (r) =>
                r.seafarer_profile_id === profile.id ||
                (r.last_name?.toLowerCase() === profile.last_name?.toLowerCase() &&
                  r.first_name?.toLowerCase() === profile.first_name?.toLowerCase())
            );

            if (match) {
              const flattened = flattenResponse(match);
              setData(flattened);
              setExistingRecord(flattened);
              setIsExistingRecord(true);
              setEditing(false);
              setOriginalData(null);
            } else {
              applyPersonalOnly();
            }
          })
          .catch(() => {
            applyPersonalOnly();
          });
      } else {
        applyPersonalOnly();
      }

      clearSearch();
    },
    [editing, clearSearch]
  );

  return {
    data,
    setData,
    loading,
    saving,
    editing,
    isExistingRecord,
    existingRecord,
    handleNew,
    handleEdit,
    handleCancel,
    handleSave,
    handlePrint,
    firstFieldRef,
    searchResults: profileSearchResults,
    searchLoading: profileSearchLoading,
    handleSearch,
    handleSelectResult,
    saveAlert,
  };
}
