/**
 * PrintIO payload builder for the Seabase MLC (Maritime Labour Convention)
 * medical certificate.
 *
 * Flattens a `MedicalExam` record into the flat template variable names expected
 * by the PrintIO Seabase MLC template. This is a pure data transformation and
 * carries no React dependency, so it lives outside the `PrintDialog` component.
 *
 * The template variable names below mirror the PrintIO template exactly,
 * including its generic placeholder fields (`field19`, `field48`, `field49`).
 * Fields the seabase `MedicalExam` model does not capture are sent as empty
 * strings.
 *
 * @see PrintDialog — the client component that consumes this builder
 * @see handlePrintRequest (`@/lib/printio`) — server-side PrintIO proxy
 */

import type { MedicalExam } from "./types";
import { fetchPhotoAsBase64 } from "@/lib/photo";
/** Lowercase a value for template fields that expect a lowercased token. */
function lower(value: string | undefined): string {
  return (value ?? "").toLowerCase();
}

/** Build the "First Middle Last" display name, dropping empty parts. */
function fullNameOf(data: MedicalExam): string {
  return [data.first_name, data.middle_name, data.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
}

/**
 * Builds the PrintIO payload for the Seabase MLC medical certificate.
 *
 * Maps the seabase `MedicalExam` field names to the flat PrintIO template
 * variable names. Fields with no corresponding source on the record are sent as
 * empty strings.
 *
 * Fields sent empty because the seabase model has no source for them:
 * `seamans_book_no`, `field19`, `field48`, `field49`, `country`, and
 * `photo_url`. The `limitation` field is sourced from `restriction_details`
 * (shown on the form only when the recommendation includes a restriction), and
 * free-text remarks flow through the `recommendation_remarks` field.
 *
 * @param data - The current Seabase medical exam record
 * @returns The flat PrintIO template payload
 */
export async function buildSeabaseMlcPayload(data: MedicalExam):Promise<Record<string, string>> {

    const photoBase64 = await fetchPhotoAsBase64(data.photo_url);
  return {
    // Identity / personal information
    last_name: data.last_name ?? "",
    first_name: data.first_name ?? "",
    middle_name: data.middle_name ?? "",
    age: data.age ?? "",
    date_of_birth: data.date_of_birth ?? "",
    place_of_birth: data.place_of_birth ?? "",
    marital_status: data.civil_status ?? "",
    gender: data.gender ?? "",
    nationality: data.nationality ?? "",
    religion: data.religion ?? "",
    address: data.address ?? "",
    passport_no: data.passport_no ?? "",
    position: data.position ?? "",
    seamans_book_no: "",
    employer: data.employer ?? "",
    country: "",
    field19: "",

    // Assessment results (lowercased to match the template's expected tokens)
    identification_docs_checked: lower(data.identification_docs_checked),
    audio_satisfactory: lower(data.audio_satisfactory),
    audio_unaided_hearing: lower(data.audio_unaided_hearing),
    vision_meets_stcw: lower(data.vision_meets_stcw),
    vision_color: lower(data.vision_color),
    vision_contact_lenses: lower(data.vision_contact_lenses),
    vision_date_taken: data.vision_date_taken ?? "",
    fit_for_lookout: lower(data.fit_for_lookout),
    limitation: lower(data.restriction_details) ?? "",
    recommendation_remarks: lower(data.recommendation_remarks) ?? "",
    condition_aggravated_sea: lower(data.condition_aggravated_sea) ?? "",

    // Recommendation / certification
    patientFullname: fullNameOf(data),
    final_recommendation: data.final_recommendation ?? "",
    examining_physician: data.examining_physician ?? "",
    date_initial_peme: data.date_initial_peme ?? "",
    medical_director: data.medical_director ?? "",
    physicians_name: data.authorized_physician ?? "",
    license_no: data.license_no ?? "",
    field48: "",
    field49: "",
    date_of_fitness: data.date_of_fitness ?? "",
    valid_until: data.valid_until ?? "",
    medical_certification_no: data.medical_certification_no ?? "",
    photo_url: photoBase64,
  };
}

/**
 * Builds the PrintIO payload for the Seabase Summary Report.
 *
 * Maps the seabase `MedicalExam` field names to the flat PrintIO template
 * variable names expected by the Seabase Summary template. Fields with no
 * corresponding source on the record are sent as empty strings.
 *
 * Fields sent empty because the seabase model has no source for them:
 * `sirb` (Seaman's Identification & Record Book number) and `country`.
 *
 * Remapped keys (form key -> template key):
 * - `last_name`  -> `surname_last_name`
 * - `first_name` -> `given_name`
 * - `civil_status` -> `civil_status`
 * - `position`   -> `position_applied_for`
 * - `employer`   -> `company`
 * - `restriction_details` (falls back to `recommendation_remarks`) -> `fitness_restrictions`
 * - `authorized_physician`   -> `authorized_physician`
 *
 * @param data - The current Seabase medical exam record
 * @returns The flat PrintIO template payload
 */
export async function buildSeabaseSummaryPayload(
  data: MedicalExam,
): Promise<Record<string, string>> {
  const photoBase64 = await fetchPhotoAsBase64(data.photo_url);
  const fullName = fullNameOf(data);
  return {
    // Identity / personal information
    surname_last_name: data.last_name ?? "",
    given_name: data.first_name ?? "",
    middle_name: data.middle_name ?? "",
    seafarer_name: fullName,
    age: data.age ?? "",
    date_of_birth: data.date_of_birth ?? "",
    place_of_birth: data.place_of_birth ?? "",
    gender: data.gender ?? "",
    civil_status: data.civil_status ?? "",
    nationality: data.nationality ?? "",
    religion: data.religion ?? "",
    address: data.address ?? "",
    passport_no: data.passport_no ?? "",
    position_applied_for: data.position ?? "",
    sirb: "",
    company: data.employer ?? "",
    country: "",

    // Assessment results (lowercased to match the template's expected tokens)
    audio_satisfactory: lower(data.audio_satisfactory),
    vision_meets_stcw: lower(data.vision_meets_stcw),
    vision_color: lower(data.vision_color),
    fit_for_lookout: lower(data.fit_for_lookout),
    condition_aggravated_sea: lower(data.condition_aggravated_sea),

    // Recommendation / certification (text values lowercased to match the
    // template's expected tokens; dates and the base64 photo are left as-is)
    final_recommendation: lower(data.final_recommendation),
    fitness_restrictions: lower(data.restriction_details || data.recommendation_remarks),
    authorized_physician: lower(data.authorized_physician),
    date_initial_peme: data.date_initial_peme ?? "",
    medical_director: lower(data.medical_director),
    date_of_fitness: data.date_of_fitness ?? "",
    valid_until: data.valid_until ?? "",
    photo_url: photoBase64,
  };
}

/**
 * Slugs of the seabase reports whose payloads are built client-side and sent to
 * PrintIO (the MLC certificate and the Summary Report). The remaining seabase
 * reports (detailed/mer) are rendered by the backend and are not part of this
 * union.
 */
export type ReportSlug = "seabase-mlc" | "seabase-summary";

/**
 * Builds the PrintIO payload for the given seabase report slug.
 *
 * Dispatches to the matching `build*Payload` function. Mirrors the landbase
 * `buildReportPayload` dispatcher so the print dialog can build any PrintIO
 * report uniformly. Async because the builders fetch and embed the patient
 * photo.
 *
 * @param slug - The report to build a payload for
 * @param data - The current seabase medical exam record
 * @returns The flat PrintIO template payload
 */
export function buildReportPayload(
  slug: ReportSlug,
  data: MedicalExam,
): Promise<Record<string, string>> {
  switch (slug) {
    case "seabase-mlc":
      return buildSeabaseMlcPayload(data);
    case "seabase-summary":
      return buildSeabaseSummaryPayload(data);
  }
}
