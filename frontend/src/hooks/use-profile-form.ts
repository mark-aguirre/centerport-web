import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { base44, type SeafarerProfile } from "@/lib/api";

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
}

/**
 * Manages seafarer profile form state with full CRUD button behavior.
 *
 * Handles both create and edit flows by reading the `id` search param.
 * When an ID is present, fetches the existing record and starts in view mode.
 * When no ID is present, starts in view mode with an empty form.
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
  const [loading, setLoading] = useState(!!editId);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isExistingRecord, setIsExistingRecord] = useState(!!editId);
  const [existingRecord, setExistingRecord] = useState<SeafarerProfile | null>(null);

  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // Load existing record when id param is present
  useEffect(() => {
    if (editId) {
      base44.entities.SeafarerProfile.filter({ id: editId }).then((results) => {
        if (results.length > 0) {
          setExistingRecord(results[0]);
          setData({ ...EMPTY_PROFILE, ...results[0] });
          setIsExistingRecord(true);
        }
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
        await base44.entities.SeafarerProfile.update(editId, updateData);
        setExistingRecord({ ...data });
        toast.success("Profile updated successfully");
      } else {
        const profileId = await generateProfileId();
        const created = { ...data, profile_id: profileId };
        await base44.entities.SeafarerProfile.create(created);
        setExistingRecord(created);
        setIsExistingRecord(true);
        toast.success("Profile created successfully");
      }
      setOriginalData(null);
      setEditing(false);
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }, [data, isExistingRecord, editId, existingRecord]);

  /** Print the current record (no state change). */
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

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
  };
}

/** Generate the next sequential profile ID. */
async function generateProfileId(): Promise<string> {
  const all = await base44.entities.SeafarerProfile.list("-created_date", 1);
  if (all.length === 0) return "CMSI00000001";
  const lastId = all[0].profile_id || "CMSI00000000";
  const num = parseInt(lastId.replace("CMSI", "")) + 1;
  return `CMSI${String(num).padStart(8, "0")}`;
}
