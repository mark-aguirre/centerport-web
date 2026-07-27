import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api, type SeafarerProfile } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import { useProfileSearch } from "./use-profile-search";

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

/** System-managed fields excluded from profile update payloads. */
const SYSTEM_FIELDS = ["id", "created_date", "updated_date", "created_by"] as const;

/** Strips system-managed fields from a profile for update operations. */
function stripSystemFields(profile: SeafarerProfile): Partial<SeafarerProfile> {
  const entries = Object.entries(profile).filter(
    ([key]) => !(SYSTEM_FIELDS as readonly string[]).includes(key)
  );
  return Object.fromEntries(entries) as Partial<SeafarerProfile>;
}

export interface UseProfileFormResult {
  data: SeafarerProfile;
  setData: (data: SeafarerProfile) => void;
  loading: boolean;
  saving: boolean;
  editing: boolean;
  isExistingRecord: boolean;
  existingRecord: SeafarerProfile | null;
  handleNew: () => void;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => Promise<void>;
  handlePrint: () => void;
  firstFieldRef: React.RefObject<HTMLInputElement | null>;
  /** Search results returned from the backend. */
  searchResults: SeafarerProfile[];
  /** Whether a search request is in-flight. */
  searchLoading: boolean;
  /** Trigger a search by keyword (debounced internally). */
  handleSearch: (keyword: string) => void;
  /** Load a selected search result into the form (view mode). */
  handleSelectResult: (profile: SeafarerProfile) => void;
}

/**
 * Manages seafarer profile form state with full CRUD button behavior.
 *
 * Handles both create and edit flows by reading the `id` search param.
 * When an ID is present, fetches that specific record and starts in view mode.
 * When no ID is present, automatically loads the most recently updated profile
 * from the database and starts in view mode. If the database is empty, shows
 * an empty form ready for new entry.
 *
 * Implements the standard CRUD state machine:
 * - View mode: fields disabled, New/Edit/Print visible
 * - Edit mode (new): fields enabled with empty form, Save/Cancel/Print visible
 * - Edit mode (existing): fields enabled with loaded data, Save/Cancel/Print visible
 *
 * @returns Object with form state, action handlers, and ref for first-field focus
 */
export function useProfileForm(): UseProfileFormResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [data, setData] = useState<SeafarerProfile>(EMPTY_PROFILE);
  const [originalData, setOriginalData] = useState<SeafarerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isExistingRecord, setIsExistingRecord] = useState(!!editId);
  const [existingRecord, setExistingRecord] = useState<SeafarerProfile | null>(null);

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // --- Search (reusable hook) ---
  const { searchResults, searchLoading, handleSearch, clearSearch } = useProfileSearch();

  // Load existing record by id, or fetch latest profile when no id is specified
  useEffect(() => {
    if (editId) {
      // Fetch specific profile by UUID
      api.entities.SeafarerProfile.filter({ id: editId }).then((results) => {
        if (results.length > 0) {
          setExistingRecord(results[0]);
          setData({ ...EMPTY_PROFILE, ...results[0] });
          setIsExistingRecord(true);
        }
        setLoading(false);
      });
    } else {
      // No id param — load the most recently updated profile
      api.entities.SeafarerProfile.list("-updated_date", 1)
        .then((results) => {
          if (results.length > 0) {
            setExistingRecord(results[0]);
            setData({ ...EMPTY_PROFILE, ...results[0] });
            setIsExistingRecord(true);
          }
          setLoading(false);
        })
        .catch(() => {
          // If fetch fails (e.g. empty DB), just show empty form
          setLoading(false);
        });
    }
  }, [editId]);

  /** Clear form, enter edit mode for a new record. */
  const handleNew = useCallback(() => {
    setData(EMPTY_PROFILE);
    setOriginalData(null);
    setEditing(true);
    setIsExistingRecord(false);
    setExistingRecord(null);
    // Focus first field after render
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
    } else {
      setData(EMPTY_PROFILE);
    }
    setOriginalData(null);
    setEditing(false);
  }, [isExistingRecord, originalData]);

  /** Validate, persist, and return to view mode. */
  const handleSave = useCallback(async () => {
    if (!data.last_name || !data.first_name) {
      toast.error("Please fill in the required fields (Last Name, First Name)");
      return;
    }

    setSaving(true);
    try {
      if (isExistingRecord && editId && existingRecord) {
        const updateData = stripSystemFields(data);
        await api.entities.SeafarerProfile.update(editId, updateData);
        setExistingRecord({ ...data });
        toast.success("Profile updated successfully");
      } else {
        const profileId = await generateProfileId();
        const created = { ...data, profile_id: profileId };
        await api.entities.SeafarerProfile.create(created);
        setExistingRecord(created);
        setIsExistingRecord(true);
        toast.success("Profile created successfully");
      }
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
        toast.error("Failed to save profile");
      }
    } finally {
      setSaving(false);
    }
  }, [data, isExistingRecord, editId, existingRecord]);

  /** Print the current record (no state change). */
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  /** Debounced search — triggers API call after 300ms of inactivity. */
  // handleSearch is provided by useProfileSearch

  /** Load a selected profile from search results into the form. */
  const handleSelectResult = useCallback((profile: SeafarerProfile) => {
    setExistingRecord(profile);
    setData({ ...EMPTY_PROFILE, ...profile });
    setIsExistingRecord(true);
    if (!editing) {
      setEditing(false);
    }
    setOriginalData(null);
    clearSearch();
  }, [editing, clearSearch]);

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
    searchResults,
    searchLoading,
    handleSearch,
    handleSelectResult,
  };
}

/** Generate the next sequential profile ID. */
async function generateProfileId(): Promise<string> {
  const all = await api.entities.SeafarerProfile.list("-created_date", 1);
  if (all.length === 0) return "CMSI00000001";
  const lastId = all[0].profile_id || "CMSI00000000";
  const num = parseInt(lastId.replace("CMSI", "")) + 1;
  return `CMSI${String(num).padStart(8, "0")}`;
}
