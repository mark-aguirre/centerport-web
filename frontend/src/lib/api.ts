/**
 * API module — real HTTP client for the CenterPort backend.
 *
 * Provides a structured `api` client used by all hooks and components
 * to interact with the CenterPort backend.
 */

import { httpClient } from "./http-client";
import type { LandbasePeme } from "@/components/landbase/types";
import type { MedicalExam } from "@/components/medical/types";
import type { MlcRecord } from "@/components/mlc/types";
import type { PanamaCertificate } from "@/components/panama/types";

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

/** Paged response shape from the backend. */
interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  total_elements: number;
  total_pages: number;
  first: boolean;
  last: boolean;
  has_next: boolean;
  has_previous: boolean;
}

/**
 * Patient visit record with joined profile display fields.
 */
export interface PatientVisitRecord {
  id?: string;
  visit_id?: string;
  created_date?: string;
  updated_date?: string;
  seafarer_profile_id: string;
  purpose_of_visit?: string;
  sirb?: string;
  visit_date?: string;
  // Joined profile fields for display
  profile_id?: string;
  photo_url?: string;
  last_name?: string;
  first_name?: string;
  middle_name?: string;
  gender?: string;
  employer?: string;
  position?: string;
}

export const api = {
  entities: {
    SeafarerProfile: {
      /**
       * Filter profiles. When `id` is provided, fetches a single profile by UUID.
       * Otherwise returns all profiles (first page, up to 100).
       */
      async filter(filters: { id?: string }): Promise<SeafarerProfile[]> {
        if (filters.id) {
          const profile = await httpClient.get<SeafarerProfile>(
            `/api/profiles/${filters.id}`
          );
          return [profile];
        }
        const paged = await httpClient.get<PagedResponse<SeafarerProfile>>(
          "/api/profiles",
          { size: 100 }
        );
        return paged.content;
      },

      /**
       * List profiles with ordering and limit.
       *
       * @param orderBy  sort field prefixed with `-` for DESC (e.g. "-created_date")
       * @param limit    max number of results
       */
      async list(orderBy: string, limit: number): Promise<SeafarerProfile[]> {
        // Parse sort direction from the orderBy string (e.g. "-created_date" → DESC)
        let sortField = orderBy;
        let direction = "asc";
        if (orderBy.startsWith("-")) {
          sortField = orderBy.slice(1);
          direction = "desc";
        }

        // Map frontend field names to backend field names (snake_case → camelCase)
        const fieldMap: Record<string, string> = {
          created_date: "createdDate",
          updated_date: "updatedDate",
          last_name: "lastName",
          first_name: "firstName",
          profile_id: "profileId",
        };
        const backendField = fieldMap[sortField] ?? sortField;

        const paged = await httpClient.get<PagedResponse<SeafarerProfile>>(
          "/api/profiles",
          {
            size: limit,
            page: 0,
            sort: `${backendField},${direction}`,
          }
        );
        return paged.content;
      },

      /** Create a new profile. Returns the persisted record with server-generated fields. */
      async create(data: SeafarerProfile): Promise<SeafarerProfile> {
        return httpClient.post<SeafarerProfile>("/api/profiles", data);
      },

      /** Update an existing profile by UUID. Returns the updated record. */
      async update(
        id: string,
        data: Partial<SeafarerProfile>
      ): Promise<SeafarerProfile> {
        return httpClient.put<SeafarerProfile>(`/api/profiles/${id}`, data);
      },

      /**
       * Search profiles by keyword (matches last name, first name, or profile ID).
       *
       * @param keyword  the search term (case-insensitive partial match)
       * @param limit    max results to return (default: 10)
       * @returns matching profiles sorted by relevance (latest first)
       */
      async search(keyword: string, limit: number = 10): Promise<SeafarerProfile[]> {
        const paged = await httpClient.get<PagedResponse<SeafarerProfile>>(
          "/api/profiles",
          {
            search: keyword,
            size: limit,
            page: 0,
            sort: "updatedDate,desc",
          }
        );
        return paged.content;
      },

      /**
       * Fetch profiles created today (for the Visit page "today's encoded" list).
       * Uses the createdDate filter on the backend with today's date.
       */
      async listToday(): Promise<SeafarerProfile[]> {
        const today = new Date().toISOString().split("T")[0];
        const paged = await httpClient.get<PagedResponse<SeafarerProfile>>(
          "/api/profiles",
          {
            createdDate: today,
            size: 200,
            page: 0,
            sort: "createdDate,desc",
          }
        );
        return paged.content;
      },
    },

    LandbasePeme: {
      /**
       * Filter landbase PEMEs. When `id` is provided, fetches a single record by UUID.
       * Otherwise returns all records (first page, up to 100).
       */
      async filter(filters: { id?: string }): Promise<LandbasePeme[]> {
        if (filters.id) {
          const record = await httpClient.get<LandbasePeme>(
            `/api/landbase-pemes/${filters.id}`
          );
          return [record];
        }
        const paged = await httpClient.get<PagedResponse<LandbasePeme>>(
          "/api/landbase-pemes",
          { size: 100 }
        );
        return paged.content;
      },

      /**
       * List landbase PEMEs with ordering and limit.
       *
       * @param orderBy  sort field prefixed with `-` for DESC (e.g. "-created_date")
       * @param limit    max number of results
       */
      async list(orderBy: string, limit: number): Promise<LandbasePeme[]> {
        let sortField = orderBy;
        let direction = "asc";
        if (orderBy.startsWith("-")) {
          sortField = orderBy.slice(1);
          direction = "desc";
        }

        const fieldMap: Record<string, string> = {
          created_date: "createdDate",
          updated_date: "updatedDate",
          last_name: "lastName",
          first_name: "firstName",
          peme_id: "pemeId",
        };
        const backendField = fieldMap[sortField] ?? sortField;

        const paged = await httpClient.get<PagedResponse<LandbasePeme>>(
          "/api/landbase-pemes",
          {
            size: limit,
            page: 0,
            sort: `${backendField},${direction}`,
          }
        );
        return paged.content;
      },

      /** Create a new landbase PEME. Returns the persisted record with server-generated fields. */
      async create(data: LandbasePeme): Promise<LandbasePeme> {
        return httpClient.post<LandbasePeme>("/api/landbase-pemes", data);
      },

      /** Update an existing landbase PEME by UUID. Returns the updated record. */
      async update(
        id: string,
        data: Partial<LandbasePeme>
      ): Promise<LandbasePeme> {
        return httpClient.put<LandbasePeme>(`/api/landbase-pemes/${id}`, data);
      },

      /**
       * Search landbase PEMEs by keyword (matches last name, first name, or PEME ID).
       *
       * @param keyword  the search term (case-insensitive partial match)
       * @param limit    max results to return (default: 10)
       * @returns matching records sorted by most recently updated first
       */
      async search(keyword: string, limit: number = 10): Promise<LandbasePeme[]> {
        const paged = await httpClient.get<PagedResponse<LandbasePeme>>(
          "/api/landbase-pemes",
          {
            search: keyword,
            size: limit,
            page: 0,
            sort: "updatedDate,desc",
          }
        );
        return paged.content;
      },

      /**
       * Fetch all PEME records linked to a specific seafarer profile.
       * Returns records sorted by creation date descending (most recent first).
       *
       * @param profileId  the seafarer profile UUID
       * @returns list of PEME records for that profile
       */
      async listByProfile(profileId: string): Promise<LandbasePeme[]> {
        const response = await httpClient.get<LandbasePeme[]>(
          `/api/landbase-pemes/by-profile/${profileId}`
        );
        return response;
      },
    },

    MedicalExam: {
      /**
       * Filter medical exams. When `id` is provided, fetches a single record by UUID.
       * Otherwise returns all records (first page, up to 100).
       */
      async filter(filters: { id?: string }): Promise<MedicalExam[]> {
        if (filters.id) {
          const record = await httpClient.get<MedicalExam>(
            `/api/medical-exams/${filters.id}`
          );
          return [record];
        }
        const paged = await httpClient.get<PagedResponse<MedicalExam>>(
          "/api/medical-exams",
          { size: 100 }
        );
        return paged.content;
      },

      /**
       * List medical exams with ordering and limit.
       *
       * @param orderBy  sort field prefixed with `-` for DESC (e.g. "-created_date")
       * @param limit    max number of results
       */
      async list(orderBy: string, limit: number): Promise<MedicalExam[]> {
        let sortField = orderBy;
        let direction = "asc";
        if (orderBy.startsWith("-")) {
          sortField = orderBy.slice(1);
          direction = "desc";
        }

        const fieldMap: Record<string, string> = {
          created_date: "createdDate",
          updated_date: "updatedDate",
          exam_id: "examId",
        };
        const backendField = fieldMap[sortField] ?? sortField;

        const paged = await httpClient.get<PagedResponse<MedicalExam>>(
          "/api/medical-exams",
          {
            size: limit,
            page: 0,
            sort: `${backendField},${direction}`,
          }
        );
        return paged.content;
      },

      /** Create a new medical exam. Returns the persisted record with server-generated fields. */
      async create(data: MedicalExam): Promise<MedicalExam> {
        return httpClient.post<MedicalExam>("/api/medical-exams", data);
      },

      /** Update an existing medical exam by UUID. Returns the updated record. */
      async update(id: string, data: Partial<MedicalExam>): Promise<MedicalExam> {
        return httpClient.put<MedicalExam>(`/api/medical-exams/${id}`, data);
      },

      /**
       * Search medical exams by keyword (matches patient name or exam ID).
       *
       * @param keyword  the search term (case-insensitive partial match)
       * @param limit    max results to return (default: 10)
       * @returns matching records sorted by most recently updated first
       */
      async search(keyword: string, limit: number = 10): Promise<MedicalExam[]> {
        const paged = await httpClient.get<PagedResponse<MedicalExam>>(
          "/api/medical-exams",
          {
            search: keyword,
            size: limit,
            page: 0,
            sort: "updatedDate,desc",
          }
        );
        return paged.content;
      },

      /**
       * Fetch all medical exam records linked to a specific seafarer profile.
       * Returns records sorted by creation date descending (most recent first).
       *
       * @param profileId  the seafarer profile UUID
       * @returns list of medical exam records for that profile
       */
      async listByProfile(profileId: string): Promise<MedicalExam[]> {
        return httpClient.get<MedicalExam[]>(
          `/api/medical-exams/by-profile/${profileId}`
        );
      },
    },

    MlcRecord: {
      /**
       * Filter MLC records. When `id` is provided, fetches a single record by UUID.
       * Otherwise returns all records (first page, up to 100).
       */
      async filter(filters: { id?: string }): Promise<MlcRecord[]> {
        if (filters.id) {
          const record = await httpClient.get<MlcRecord>(
            `/api/mlc-records/${filters.id}`
          );
          return [record];
        }
        const paged = await httpClient.get<PagedResponse<MlcRecord>>(
          "/api/mlc-records",
          { size: 100 }
        );
        return paged.content;
      },

      /**
       * List MLC records with ordering and limit.
       *
       * @param orderBy  sort field prefixed with `-` for DESC (e.g. "-created_date")
       * @param limit    max number of results
       */
      async list(orderBy: string, limit: number): Promise<MlcRecord[]> {
        let sortField = orderBy;
        let direction = "asc";
        if (orderBy.startsWith("-")) {
          sortField = orderBy.slice(1);
          direction = "desc";
        }

        const fieldMap: Record<string, string> = {
          created_date: "createdDate",
          updated_date: "updatedDate",
          mlc_id: "mlcId",
        };
        const backendField = fieldMap[sortField] ?? sortField;

        const paged = await httpClient.get<PagedResponse<MlcRecord>>(
          "/api/mlc-records",
          {
            size: limit,
            page: 0,
            sort: `${backendField},${direction}`,
          }
        );
        return paged.content;
      },

      /** Create a new MLC record. Returns the persisted record with server-generated fields. */
      async create(data: MlcRecord): Promise<MlcRecord> {
        return httpClient.post<MlcRecord>("/api/mlc-records", data);
      },

      /** Update an existing MLC record by UUID. Returns the updated record. */
      async update(id: string, data: Partial<MlcRecord>): Promise<MlcRecord> {
        return httpClient.put<MlcRecord>(`/api/mlc-records/${id}`, data);
      },

      /**
       * Search MLC records by keyword (matches last name, first name, or MLC ID).
       *
       * @param keyword  the search term (case-insensitive partial match)
       * @param limit    max results to return (default: 10)
       * @returns matching records sorted by most recently updated first
       */
      async search(keyword: string, limit: number = 10): Promise<MlcRecord[]> {
        const paged = await httpClient.get<PagedResponse<MlcRecord>>(
          "/api/mlc-records",
          {
            search: keyword,
            size: limit,
            page: 0,
            sort: "updatedDate,desc",
          }
        );
        return paged.content;
      },

      /**
       * Fetch all MLC records linked to a specific seafarer profile.
       * Returns records sorted by creation date descending (most recent first).
       *
       * @param profileId  the seafarer profile UUID
       * @returns list of MLC records for that profile
       */
      async listByProfile(profileId: string): Promise<MlcRecord[]> {
        return httpClient.get<MlcRecord[]>(
          `/api/mlc-records/by-profile/${profileId}`
        );
      },
    },
    PanamaCertificate: {
      /**
       * Filter Panama certificates. When `id` is provided, fetches a single record by UUID.
       * Otherwise returns all records (first page, up to 100).
       */
      async filter(filters: { id?: string }): Promise<PanamaCertificate[]> {
        if (filters.id) {
          const record = await httpClient.get<PanamaCertificate>(
            `/api/panama-certificates/${filters.id}`
          );
          return [record];
        }
        const paged = await httpClient.get<PagedResponse<PanamaCertificate>>(
          "/api/panama-certificates",
          { size: 100 }
        );
        return paged.content;
      },

      /**
       * List Panama certificates with ordering and limit.
       *
       * @param orderBy  sort field prefixed with `-` for DESC (e.g. "-created_date")
       * @param limit    max number of results
       */
      async list(orderBy: string, limit: number): Promise<PanamaCertificate[]> {
        let sortField = orderBy;
        let direction = "asc";
        if (orderBy.startsWith("-")) {
          sortField = orderBy.slice(1);
          direction = "desc";
        }

        const fieldMap: Record<string, string> = {
          created_date: "createdDate",
          updated_date: "updatedDate",
          panama_id: "panamaId",
        };
        const backendField = fieldMap[sortField] ?? sortField;

        const paged = await httpClient.get<PagedResponse<PanamaCertificate>>(
          "/api/panama-certificates",
          {
            size: limit,
            page: 0,
            sort: `${backendField},${direction}`,
          }
        );
        return paged.content;
      },

      /** Create a new Panama certificate. Returns the persisted record with server-generated fields. */
      async create(data: PanamaCertificate): Promise<PanamaCertificate> {
        return httpClient.post<PanamaCertificate>("/api/panama-certificates", data);
      },

      /** Update an existing Panama certificate by UUID. Returns the updated record. */
      async update(
        id: string,
        data: Partial<PanamaCertificate>
      ): Promise<PanamaCertificate> {
        return httpClient.put<PanamaCertificate>(`/api/panama-certificates/${id}`, data);
      },

      /**
       * Search Panama certificates by keyword (matches last name, first name, or Panama ID).
       *
       * @param keyword  the search term (case-insensitive partial match)
       * @param limit    max results to return (default: 10)
       * @returns matching records sorted by most recently updated first
       */
      async search(keyword: string, limit: number = 10): Promise<PanamaCertificate[]> {
        const paged = await httpClient.get<PagedResponse<PanamaCertificate>>(
          "/api/panama-certificates",
          {
            search: keyword,
            size: limit,
            page: 0,
            sort: "updatedDate,desc",
          }
        );
        return paged.content;
      },

      /**
       * Fetch all Panama certificates linked to a specific seafarer profile.
       * Returns records sorted by creation date descending (most recent first).
       *
       * @param profileId  the seafarer profile UUID
       * @returns list of Panama certificates for that profile
       */
      async listByProfile(profileId: string): Promise<PanamaCertificate[]> {
        return httpClient.get<PanamaCertificate[]>(
          `/api/panama-certificates/by-profile/${profileId}`
        );
      },
    },

    PatientVisit: {
      /**
       * List today's visits (or visits for a specific date).
       * Returns visit records enriched with patient profile display data.
       */
      async listToday(date?: string): Promise<PatientVisitRecord[]> {
        const queryDate = date ?? new Date().toISOString().split("T")[0];
        const paged = await httpClient.get<PagedResponse<PatientVisitRecord>>(
          "/api/visits",
          {
            date: queryDate,
            size: 200,
            page: 0,
            sort: "createdDate,desc",
          }
        );
        return paged.content;
      },

      /**
       * Create a new patient visit record.
       */
      async create(data: {
        seafarer_profile_id: string;
        purpose_of_visit?: string;
        sirb?: string;
      }): Promise<PatientVisitRecord> {
        return httpClient.post<PatientVisitRecord>("/api/visits", data);
      },

      /**
       * Get a single visit by UUID.
       */
      async getById(id: string): Promise<PatientVisitRecord> {
        return httpClient.get<PatientVisitRecord>(`/api/visits/${id}`);
      },

      /**
       * Delete a visit record.
       */
      async delete(id: string): Promise<void> {
        await httpClient.delete(`/api/visits/${id}`);
      },
    },
  },
  integrations: {
    Core: {
      /** Upload a file and return its URL. */
      async UploadFile({
        file,
      }: {
        file: File;
      }): Promise<{ file_url: string }> {
        return httpClient.uploadFile("/api/files", file);
      },
    },
  },
};
