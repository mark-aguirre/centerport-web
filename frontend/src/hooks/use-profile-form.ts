import { useState, useEffect, useCallback } from "react";
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

interface UseProfileFormResult {
  data: SeafarerProfile;
  setData: (data: SeafarerProfile) => void;
  loading: boolean;
  saving: boolean;
  isEditing: boolean;
  existingRecord: SeafarerProfile | null;
  handleSave: () => Promise<void>;
}

/**
 * Manages seafarer profile form state, loading, and persistence.
 *
 * Handles both create and edit flows by reading the `id` search param.
 * When an ID is present, fetches the existing record and populates the form.
 * On save, validates required fields, generates a profile ID for new records,
 * and navigates back to the profile list on success.
 *
 * State:
 * - `data` — current form values (starts as empty profile or loaded record)
 * - `loading` — true while fetching an existing record
 * - `saving` — true during save/update operation
 *
 * @returns Object with form state, setters, and the save handler
 */
export function useProfileForm(): UseProfileFormResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [data, setData] = useState<SeafarerProfile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(!!editId);
  const [saving, setSaving] = useState(false);
  const [existingRecord, setExistingRecord] = useState<SeafarerProfile | null>(
    null
  );

  useEffect(() => {
    if (editId) {
      base44.entities.SeafarerProfile.filter({ id: editId }).then((results) => {
        if (results.length > 0) {
          setExistingRecord(results[0]);
          setData({ ...EMPTY_PROFILE, ...results[0] });
        }
        setLoading(false);
      });
    }
  }, [editId]);

  const generateProfileId = async (): Promise<string> => {
    const all = await base44.entities.SeafarerProfile.list(
      "-created_date",
      1
    );
    if (all.length === 0) return "CMSI00000001";
    const lastId = all[0].profile_id || "CMSI00000000";
    const num = parseInt(lastId.replace("CMSI", "")) + 1;
    return `CMSI${String(num).padStart(8, "0")}`;
  };

  const handleSave = useCallback(async () => {
    if (!data.last_name || !data.first_name) {
      toast.error(
        "Please fill in the required fields (Last Name, First Name)"
      );
      return;
    }

    setSaving(true);
    try {
      if (editId && existingRecord) {
        // Strip system-managed fields before sending update
        const updateData = stripSystemFields(data);
        await base44.entities.SeafarerProfile.update(editId, updateData);
        toast.success("Profile updated successfully");
      } else {
        const profileId = await generateProfileId();
        await base44.entities.SeafarerProfile.create({
          ...data,
          profile_id: profileId,
        });
        toast.success("Profile created successfully");
      }
      router.push("/profile");
    } catch {
      toast.error("Failed to save profile");
    }
    setSaving(false);
  }, [data, editId, existingRecord, router]);

  return {
    data,
    setData,
    loading,
    saving,
    isEditing: !!editId,
    existingRecord,
    handleSave,
  };
}
