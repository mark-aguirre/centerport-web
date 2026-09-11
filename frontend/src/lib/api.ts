/**
 * API module — real HTTP client for the CenterPort backend.
 *
 * Provides a structured `api` client used by all hooks and components
 * to interact with the CenterPort backend.
 */

import { httpClient } from "./http-client";
import type { LandbasePeme } from "@/components/landbase/types";
import type { LaboratoryReport } from "@/components/laboratory/types";
import type { MedicalExam } from "@/components/medical/types";
import type { MlcRecord } from "@/components/mlc/types";
import type { PanamaCertificate } from "@/components/panama/types";
import type { PsychologyRecord } from "@/components/psychology/types";

/** System-managed fields excluded from profile create/update payloads. */
export const PROFILE_SYSTEM_FIELDS = [
  "id",
  "profile_id",
  "created_date",
  "updated_date",
  "created_by",
] as const;

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

/**
 * Empty/default SeafarerProfile instance for form initialization and reset.
 *
 * All fields are initialized to empty strings. Used by profile, visit, and
 * any module that needs a blank profile template. Centralizes the definition
 * to prevent duplication across hooks.
 */
export const EMPTY_PROFILE: SeafarerProfile = {
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
  purpose_of_visit?: string | null;
  sirb?: string | null;
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

/** Dashboard statistics response shape from the backend. */
export interface DashboardStats {
  total_patients: number;
  records_this_year: number;
  total_lab_tests: number;
  pending_lab_tests: number;
  total_vessels: number;
  vessels_in_port: number;
}

// ===================================================================
// Shared Helpers — eliminates repeated sort-parsing and filter logic
// ===================================================================

/** Common frontend-to-backend field name mappings shared across entities. */
const COMMON_FIELD_MAP: Record<string, string> = {
  created_date: "createdDate",
  updated_date: "updatedDate",
  last_name: "lastName",
  first_name: "firstName",
};

/**
 * Parses a frontend sort string into backend sort params.
 *
 * Handles the `-` prefix convention for descending order and maps
 * snake_case frontend field names to camelCase backend field names.
 *
 * @param orderBy   sort field prefixed with `-` for DESC (e.g. "-created_date")
 * @param fieldMap  entity-specific field name overrides merged with common mappings
 * @returns formatted backend sort string (e.g. "createdDate,desc")
 */
function buildSortParam(
  orderBy: string,
  fieldMap: Record<string, string> = {}
): string {
  let sortField = orderBy;
  let direction = "asc";
  if (orderBy.startsWith("-")) {
    sortField = orderBy.slice(1);
    direction = "desc";
  }
  const merged = { ...COMMON_FIELD_MAP, ...fieldMap };
  const backendField = merged[sortField] ?? sortField;
  return `${backendField},${direction}`;
}

/**
 * Generic paged list fetch — reusable across all entity endpoints.
 *
 * @param endpoint  the API base URL for the entity
 * @param orderBy   sort field with optional `-` prefix for DESC
 * @param limit     max results to return
 * @param fieldMap  entity-specific field name overrides
 * @returns the content array from the paged response
 */
async function fetchPagedList<T>(
  endpoint: string,
  orderBy: string,
  limit: number,
  fieldMap: Record<string, string> = {}
): Promise<T[]> {
  const paged = await httpClient.get<PagedResponse<T>>(endpoint, {
    size: limit,
    page: 0,
    sort: buildSortParam(orderBy, fieldMap),
  });
  return paged.content;
}

/**
 * Generic filter fetch — single record by ID or first page of all.
 *
 * @param endpoint  the API base URL for the entity
 * @param filters   optional filter object with `id` for single-record fetch
 * @returns array containing the single record or first page of results
 */
async function fetchFiltered<T>(
  endpoint: string,
  filters: { id?: string }
): Promise<T[]> {
  if (filters.id) {
    const record = await httpClient.get<T>(`${endpoint}/${filters.id}`);
    return [record];
  }
  const paged = await httpClient.get<PagedResponse<T>>(endpoint, { size: 100 });
  return paged.content;
}

/**
 * Generic keyword search — fetches paged results sorted by most recent update.
 *
 * @param endpoint  the API base URL for the entity
 * @param keyword   search term (case-insensitive partial match)
 * @param limit     max results to return
 * @returns matching records sorted by updatedDate descending
 */
async function fetchSearchResults<T>(
  endpoint: string,
  keyword: string,
  limit: number
): Promise<T[]> {
  const paged = await httpClient.get<PagedResponse<T>>(endpoint, {
    search: keyword,
    size: limit,
    page: 0,
    sort: "updatedDate,desc",
  });
  return paged.content;
}

/**
 * Medical personnel record from the database.
 * Represents a licensed medical professional (doctor, psychologist, psychometrician, etc.).
 */
export interface MedicalPersonnelRecord {
  id: string;
  personnel_id?: string;
  name: string;
  license_no: string;
  specialization?: string;
  title?: string;
  active?: boolean;
  created_date?: string;
  updated_date?: string;
}

/**
 * Employer / manning-agency reference record.
 *
 * Master list used to populate the employer selection field on profile and
 * visit registration forms.
 */
export interface EmployerRecord {
  id: string;
  employer_id?: string;
  name: string;
  active?: boolean;
  created_date?: string;
  updated_date?: string;
}

export const api = {
  dashboard: {
    /** Fetch aggregated dashboard statistics. */
    async getStats(): Promise<DashboardStats> {
      return httpClient.get<DashboardStats>("/api/dashboard/stats");
    },
  },
  entities: {
    SeafarerProfile: {
      /**
       * Filter profiles. When `id` is provided, fetches a single profile by UUID.
       * Otherwise returns all profiles (first page, up to 100).
       */
      async filter(filters: { id?: string }): Promise<SeafarerProfile[]> {
        return fetchFiltered<SeafarerProfile>("/api/profiles", filters);
      },

      /**
       * List profiles with ordering and limit.
       *
       * @param orderBy  sort field prefixed with `-` for DESC (e.g. "-created_date")
       * @param limit    max number of results
       */
      async list(orderBy: string, limit: number): Promise<SeafarerProfile[]> {
        return fetchPagedList<SeafarerProfile>("/api/profiles", orderBy, limit, {
          profile_id: "profileId",
        });
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
        return fetchSearchResults<SeafarerProfile>("/api/profiles", keyword, limit);
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
        return fetchFiltered<LandbasePeme>("/api/landbase-pemes", filters);
      },

      /**
       * List landbase PEMEs with ordering and limit.
       *
       * @param orderBy  sort field prefixed with `-` for DESC (e.g. "-created_date")
       * @param limit    max number of results
       */
      async list(orderBy: string, limit: number): Promise<LandbasePeme[]> {
        return fetchPagedList<LandbasePeme>("/api/landbase-pemes", orderBy, limit, {
          peme_id: "pemeId",
        });
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
        return fetchSearchResults<LandbasePeme>("/api/landbase-pemes", keyword, limit);
      },

      /**
       * Fetch all PEME records linked to a specific seafarer profile.
       * Returns records sorted by creation date descending (most recent first).
       *
       * @param profileId  the seafarer profile UUID
       * @returns list of PEME records for that profile
       */
      async listByProfile(profileId: string): Promise<LandbasePeme[]> {
        return httpClient.get<LandbasePeme[]>(
          `/api/landbase-pemes/by-profile/${profileId}`
        );
      },

      /**
       * Generate and open a PDF report for a landbase PEME record.
       *
       * @param id         the PEME record UUID
       * @param reportType the report template slug (e.g. "landbase-detailed")
       */
      async generateReport(id: string, reportType: string): Promise<void> {
        const filename = `${reportType}_${id}.pdf`;
        await httpClient.downloadPdf(
          `/api/landbase-pemes/${id}/reports/${reportType}`,
          filename
        );
      },
    },

    LaboratoryReport: {
      /**
       * Filter laboratory reports. When `id` is provided, fetches a single record by UUID.
       * Otherwise returns all records (first page, up to 100).
       */
      async filter(filters: { id?: string }): Promise<LaboratoryReport[]> {
        return fetchFiltered<LaboratoryReport>("/api/laboratory-reports", filters);
      },

      /**
       * List laboratory reports with ordering and limit.
       *
       * @param orderBy  sort field prefixed with `-` for DESC (e.g. "-created_date")
       * @param limit    max number of results
       */
      async list(orderBy: string, limit: number): Promise<LaboratoryReport[]> {
        return fetchPagedList<LaboratoryReport>("/api/laboratory-reports", orderBy, limit, {
          report_id: "reportId",
        });
      },

      /** Create a new laboratory report. Returns the persisted record with server-generated fields. */
      async create(data: LaboratoryReport): Promise<LaboratoryReport> {
        return httpClient.post<LaboratoryReport>("/api/laboratory-reports", data);
      },

      /** Update an existing laboratory report by UUID. Returns the updated record. */
      async update(
        id: string,
        data: Partial<LaboratoryReport>
      ): Promise<LaboratoryReport> {
        return httpClient.put<LaboratoryReport>(`/api/laboratory-reports/${id}`, data);
      },

      /**
       * Search laboratory reports by keyword (matches patient name or report ID).
       *
       * @param keyword  the search term (case-insensitive partial match)
       * @param limit    max results to return (default: 10)
       * @returns matching records sorted by most recently updated first
       */
      async search(keyword: string, limit: number = 10): Promise<LaboratoryReport[]> {
        return fetchSearchResults<LaboratoryReport>("/api/laboratory-reports", keyword, limit);
      },

      /**
       * Fetch all laboratory reports linked to a specific seafarer profile.
       * Returns records sorted by creation date descending (most recent first).
       *
       * @param profileId  the seafarer profile UUID
       * @returns list of laboratory reports for that profile
       */
      async listByProfile(profileId: string): Promise<LaboratoryReport[]> {
        return httpClient.get<LaboratoryReport[]>(
          `/api/laboratory-reports/by-profile/${profileId}`
        );
      },
    },

    MedicalExam: {
      /**
       * Filter medical exams. When `id` is provided, fetches a single record by UUID.
       * Otherwise returns all records (first page, up to 100).
       */
      async filter(filters: { id?: string }): Promise<MedicalExam[]> {
        return fetchFiltered<MedicalExam>("/api/medical-exams", filters);
      },

      /**
       * List medical exams with ordering and limit.
       *
       * @param orderBy  sort field prefixed with `-` for DESC (e.g. "-created_date")
       * @param limit    max number of results
       */
      async list(orderBy: string, limit: number): Promise<MedicalExam[]> {
        return fetchPagedList<MedicalExam>("/api/medical-exams", orderBy, limit, {
          exam_id: "examId",
        });
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
        return fetchSearchResults<MedicalExam>("/api/medical-exams", keyword, limit);
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

      /**
       * Generate a PDF report for a medical exam and open it in a new browser tab.
       *
       * @param id         the medical exam record UUID
       * @param reportType the report template slug (e.g. "seabase-detailed")
       */
      async generateReport(id: string, reportType: string): Promise<void> {
        const filename = `${reportType}_${id}.pdf`;
        await httpClient.downloadPdf(
          `/api/medical-exams/${id}/reports/${reportType}`,
          filename
        );
      },
    },

    MlcRecord: {
      /**
       * Filter MLC records. When `id` is provided, fetches a single record by UUID.
       * Otherwise returns all records (first page, up to 100).
       */
      async filter(filters: { id?: string }): Promise<MlcRecord[]> {
        return fetchFiltered<MlcRecord>("/api/mlc-records", filters);
      },

      /**
       * List MLC records with ordering and limit.
       *
       * @param orderBy  sort field prefixed with `-` for DESC (e.g. "-created_date")
       * @param limit    max number of results
       */
      async list(orderBy: string, limit: number): Promise<MlcRecord[]> {
        return fetchPagedList<MlcRecord>("/api/mlc-records", orderBy, limit, {
          mlc_id: "mlcId",
        });
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
        return fetchSearchResults<MlcRecord>("/api/mlc-records", keyword, limit);
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
        return fetchFiltered<PanamaCertificate>("/api/panama-certificates", filters);
      },

      /**
       * List Panama certificates with ordering and limit.
       *
       * @param orderBy  sort field prefixed with `-` for DESC (e.g. "-created_date")
       * @param limit    max number of results
       */
      async list(orderBy: string, limit: number): Promise<PanamaCertificate[]> {
        return fetchPagedList<PanamaCertificate>("/api/panama-certificates", orderBy, limit, {
          panama_id: "panamaId",
        });
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
        return fetchSearchResults<PanamaCertificate>("/api/panama-certificates", keyword, limit);
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

    PsychologyEvaluation: {
      /**
       * Filter psychology evaluations. When `id` is provided, fetches a single record by UUID.
       * Otherwise returns all records (first page, up to 100).
       */
      async filter(filters: { id?: string }): Promise<PsychologyRecord[]> {
        return fetchFiltered<PsychologyRecord>("/api/psychology-evaluations", filters);
      },

      /**
       * List psychology evaluations with ordering and limit.
       *
       * @param orderBy  sort field prefixed with `-` for DESC (e.g. "-created_date")
       * @param limit    max number of results
       */
      async list(orderBy: string, limit: number): Promise<PsychologyRecord[]> {
        return fetchPagedList<PsychologyRecord>("/api/psychology-evaluations", orderBy, limit, {
          eval_id: "evalId",
        });
      },

      /** Create a new psychology evaluation. Returns the persisted record with server-generated fields. */
      async create(data: PsychologyRecord): Promise<PsychologyRecord> {
        return httpClient.post<PsychologyRecord>("/api/psychology-evaluations", data);
      },

      /** Update an existing psychology evaluation by UUID. Returns the updated record. */
      async update(id: string, data: Partial<PsychologyRecord>): Promise<PsychologyRecord> {
        return httpClient.put<PsychologyRecord>(`/api/psychology-evaluations/${id}`, data);
      },

      /**
       * Search psychology evaluations by keyword (matches patient name or eval ID).
       *
       * @param keyword  the search term (case-insensitive partial match)
       * @param limit    max results to return (default: 10)
       * @returns matching records sorted by most recently updated first
       */
      async search(keyword: string, limit: number = 10): Promise<PsychologyRecord[]> {
        return fetchSearchResults<PsychologyRecord>("/api/psychology-evaluations", keyword, limit);
      },

      /**
       * Fetch all psychology evaluations linked to a specific seafarer profile.
       * Returns records sorted by creation date descending (most recent first).
       *
       * @param profileId  the seafarer profile UUID
       * @returns list of evaluation records for that profile
       */
      async listByProfile(profileId: string): Promise<PsychologyRecord[]> {
        return httpClient.get<PsychologyRecord[]>(
          `/api/psychology-evaluations/by-profile/${profileId}`
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
       * Update the mutable details of an existing patient visit.
       */
      async update(
        id: string,
        data: {
          purpose_of_visit: string | null;
          sirb: string | null;
        }
      ): Promise<PatientVisitRecord> {
        return httpClient.put<PatientVisitRecord>(`/api/visits/${id}`, data);
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

  /**
   * Medical Personnel resource — master list of licensed professionals.
   * Used by the medical personnel selection dialog.
   */
  MedicalPersonnel: {
    /** Search active personnel by keyword (name, license, specialization). */
    async search(keyword?: string): Promise<MedicalPersonnelRecord[]> {
      const params: Record<string, string | number | undefined> = {};
      if (keyword) params.keyword = keyword;
      return httpClient.get<MedicalPersonnelRecord[]>(
        "/api/medical-personnel/search",
        params
      );
    },
  },

  /**
   * Employer resource — master list of employers / manning-agencies.
   * Used to populate the employer selection field on profile and visit forms.
   */
  Employer: {
    /** Search active employers by keyword (name). Returns full records. */
    async search(keyword?: string): Promise<EmployerRecord[]> {
      const params: Record<string, string | number | undefined> = {};
      if (keyword) params.keyword = keyword;
      return httpClient.get<EmployerRecord[]>("/api/employers/search", params);
    },

    /**
     * Returns the names of all active employers, sorted alphabetically.
     * Convenience helper for autocomplete suggestion lists.
     */
    async listNames(): Promise<string[]> {
      const records = await httpClient.get<EmployerRecord[]>(
        "/api/employers/search"
      );
      return records
        .map((r) => r.name)
        .sort((a, b) => a.localeCompare(b));
    },
  },
};
