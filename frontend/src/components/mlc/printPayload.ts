/**
 * PrintIO payload builder for the MLC (Maritime Labour Convention) certificate.
 *
 * Flattens an `MlcRecord` into the flat template variable names expected by the
 * PrintIO MLC template. This is a pure data transformation (aside from the
 * patient-photo fetch) and carries no React dependency, so it lives outside the
 * `PrintDialog` component.
 *
 * @see PrintDialog — the client component that consumes this builder
 * @see handlePrintRequest (`@/lib/printio`) — server-side PrintIO proxy
 */

import { fetchPhotoAsBase64 } from "@/lib/photo";
import type { MlcRecord } from "@/components/mlc/types";

/**
 * Builds the PrintIO payload from the current MLC form data.
 *
 * Maps frontend field names to the PrintIO template variable names and fetches
 * the patient photo, embedding it inline as a base64 data URL. Fields with no
 * corresponding source on the record are sent as empty strings.
 *
 * @param data - The current MLC record
 * @returns The flat PrintIO template payload
 */
export async function buildMlcPayload(data: MlcRecord): Promise<Record<string, string>> {
  const lastName = data.last_name ?? "";
  const firstName = data.first_name ?? "";
  const middleName = data.middle_name ?? "";
  const fullname = [lastName, firstName, middleName].filter(Boolean).join(", ");

  const photoBase64 = await fetchPhotoAsBase64(data.photo_url);

  return {
    fullname,
    last_name: lastName,
    first_name: firstName,
    middle_name: middleName,
    age: data.age ?? "",
    birthdate: data.date_of_birth ?? "",
    place_of_birth: data.place_of_birth ?? "",
    country: "",
    nationality: data.nationality ?? "",
    gender: data.gender ?? "",
    marital_status: data.civil_status ?? "",
    religion: data.religion ?? "",
    address: data.address ?? "",
    passport_no: data.passport_no ?? "",
    position_deck: data.position ?? "",
    position_engine: "",
    position_steward: "",
    position_other: "",
    shipping_company: data.shipping_company ?? "",
    sirb_no: data.sirb_no ?? "",
    id_documents_checked: data.id_documents_checked ?? "",
    hearing_meets_standards: data.hearing_meets_standards ?? "",
    unaided_hearing_satisfactory: data.unaided_hearing_satisfactory ?? "",
    visual_acuity_meets_standards: data.visual_acuity_meets_standards ?? "",
    colour_vision_meets_standards: data.colour_vision_meets_standards ?? "",
    visual_aids: Array.isArray(data.visual_aids) ? data.visual_aids.join(", ") : "",
    fit_for_lookout: data.fit_for_lookout ?? "",
    date_colour_vision_test: data.date_colour_vision_test ?? "",
    no_limitations: data.no_limitations ?? "",
    applicant_condition_risk: data.applicant_condition_risk ?? "",
    photo_url: photoBase64,
    fitness_determination: data.fitness_determination ?? "",
    date_of_fitness: data.date_of_fitness ?? "",
    medical_director: data.medical_director ?? "",
    examining_physician: data.examining_physician ?? "",
    limitations_details: data.limitations_details ?? "",
    date_initial_peme: data.date_initial_peme ?? "",
    valid_until_date: data.valid_until_date ?? "",
    medical_certification_no: data.medical_certification_no ?? "",
  };
}
