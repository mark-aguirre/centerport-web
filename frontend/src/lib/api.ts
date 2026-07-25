/**
 * Placeholder API module — mirrors the base44 client interface.
 *
 * Uses localStorage for persistence during development.
 * Replace with real API calls when the backend is ready.
 */

/**
 * Complete seafarer profile record.
 *
 * Represents all data captured across the profile form sections:
 * personal info, employment, family, education, and work experience.
 * System fields (`id`, `profile_id`, timestamps, `created_by`) are
 * managed automatically and are optional on input.
 */
export interface SeafarerProfile {
  id?: string;
  profile_id?: string;
  created_date?: string;
  updated_date?: string;
  created_by?: string;
  photo_url: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  address: string;
  city: string;
  contact_no: string;
  birthdate: string;
  age: string;
  gender: string;
  marital_status: string;
  place_of_birth: string;
  religion: string;
  nationality: string;
  country: string;
  employer: string;
  designation: string;
  passport_no: string;
  seamans_book_no: string;
  position: string;
  country_of_destination: string;
  father_name: string;
  father_occupation: string;
  mother_name: string;
  mother_occupation: string;
  no_of_brothers: string;
  no_of_sisters: string;
  birth_order: string;
  spouse_name: string;
  spouse_occupation: string;
  no_of_children: string;
  elementary: string;
  high_school: string;
  college_university: string;
  course: string;
  highest_level_attended: string;
  prev_date_started: string;
  prev_date_end: string;
  prev_length_of_stay: string;
  prev_company: string;
  prev_position: string;
  prev_reason_of_leaving: string;
  remark: string;
}

const STORAGE_KEY = "seafarer_profiles";

function getStoredProfiles(): SeafarerProfile[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SeafarerProfile[];
  } catch {
    console.error("Failed to parse stored profiles, resetting storage.");
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function setStoredProfiles(profiles: SeafarerProfile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export const base44 = {
  entities: {
    SeafarerProfile: {
      async filter(filters: { id?: string }): Promise<SeafarerProfile[]> {
        const all = getStoredProfiles();
        if (filters.id) {
          return all.filter((p) => p.id === filters.id);
        }
        return all;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async list(_orderBy: string, _limit: number): Promise<SeafarerProfile[]> {
        const all = getStoredProfiles();
        return all.sort((a, b) => {
          const dateA = a.created_date || "";
          const dateB = b.created_date || "";
          return dateB.localeCompare(dateA);
        });
      },
      async create(data: SeafarerProfile): Promise<SeafarerProfile> {
        const all = getStoredProfiles();
        const record = {
          ...data,
          id: crypto.randomUUID(),
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString(),
        };
        all.push(record);
        setStoredProfiles(all);
        return record;
      },
      async update(
        id: string,
        data: Partial<SeafarerProfile>
      ): Promise<SeafarerProfile> {
        const all = getStoredProfiles();
        const index = all.findIndex((p) => p.id === id);
        if (index === -1) throw new Error("Profile not found");
        all[index] = {
          ...all[index],
          ...data,
          updated_date: new Date().toISOString(),
        };
        setStoredProfiles(all);
        return all[index];
      },
    },
  },
  integrations: {
    Core: {
      async UploadFile({
        file,
      }: {
        file: File;
      }): Promise<{ file_url: string }> {
        // Simulate file upload — return a data URL for local use
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ file_url: reader.result as string });
          reader.readAsDataURL(file);
        });
      },
    },
  },
};