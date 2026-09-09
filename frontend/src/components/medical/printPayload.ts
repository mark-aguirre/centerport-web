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
 * Read a past-medical-history answer from the `medical_history` map and map it
 * to a boolean token.
 *
 * Answers are stored as `"yes"`/`"no"`, so a `"yes"` becomes `"true"` and any
 * other value (`"no"` or unanswered) becomes `"false"`.
 */
function history(data: MedicalExam, key: string): string {
  return lower(data.medical_history?.[key]) === "yes" ? "true" : "false";
}

/** Read a detail string from the `medical_history` map by its stored key. */
function historyDetail(data: MedicalExam, key: string): string {
  return data.medical_history?.[key] ?? "";
}

/**
 * Map a findings checkbox to a physical-examination boolean token.
 *
 * On the Seabase form a checked box marks a *normal* finding, so the template
 * receives `"true"` for a checked box and `"false"` for an unchecked/absent one.
 */
function finding(map: Record<string, boolean> | undefined, key: string): string {
  return map?.[key] ? "true" : "false";
}

/** Read a per-finding remarks string from a findings-remarks map. */
function findingRemark(
  map: Record<string, string> | undefined,
  key: string,
): string {
  return map?.[key] ?? "";
}

/**
 * Builds the PrintIO payload for the Seabase Detailed Report.
 *
 * Flattens the full `MedicalExam` record into the flat template variable names
 * expected by the PrintIO Seabase Detailed template. The template covers the
 * complete examination: personal information, past medical history, physical
 * examination vitals/vision/hearing, physical-examination findings, ancillary
 * examinations, and the final recommendation.
 *
 * Mapping notes:
 * - Past-medical-history questions are read from the `medical_history` JSONB map
 *   by their stored keys (e.g. `"Head or Neck Injury"`) and sent as `"true"`
 *   (answered yes) or `"false"`; the adjacent `*_details` fields keep their
 *   free-text values.
 * - Physical-examination findings send `"true"` for a checked box (normal) and
 *   `"false"` for an unchecked/absent box; the adjacent `*_remarks` fields keep
 *   their free-text values.
 * - The Ishihara color-vision result is sourced from `vision_color`, and the
 *   AD/AS hearing results from `audio_ad_right_2` / `audio_as_left_2`.
 * - Every mapped value is lowercased to match the template's expected tokens.
 *   The base64 photo is added after that pass so its data is left untouched.
 *
 * Fields sent empty because the seabase model has no source for them:
 * `seamans_book_no` and `contact_number`.
 *
 * @param data - The current Seabase medical exam record
 * @returns The flat PrintIO template payload
 */
export async function buildSeabaseDetailedPayload(
  data: MedicalExam,
): Promise<Record<string, string>> {
  const photoBase64 = await fetchPhotoAsBase64(data.photo_url);
  const payload: Record<string, string> = {
    // Identity / personal information
    last_name: data.last_name ?? "",
    first_name: data.first_name ?? "",
    middle_name: data.middle_name ?? "",
    place_of_birth: data.place_of_birth ?? "",
    date_of_birth: data.date_of_birth ?? "",
    age: data.age ?? "",
    gender: data.gender ?? "",
    marital_status: data.civil_status ?? "",
    religion: data.religion ?? "",
    nationality: data.nationality ?? "",
    address: data.address ?? "",
    passport_no: data.passport_no ?? "",
    seamans_book_no: "",
    name_of_employee: data.employer ?? "",
    contact_number: data.contact_no ?? "",
    position_applied_for: data.position ?? "",

    // Past medical history (yes/no answers from the medical_history map)
    head_or_neck_injury: history(data, "Head or Neck Injury"),
    frequent_headaches: history(data, "Frequent Headaches"),
    frequent_dizziness: history(data, "Frequent Dizziness"),
    fainting_spells_fits_seizures_or_other_neurological_disorders: history(
      data,
      "Fainting Spells, Fits, Seizures or other Neurological Disorders",
    ),
    insomnia_or_sleep_disorders_manias_phobias: history(
      data,
      "Insomnia or sleep disorders, Manias, Phobias",
    ),
    depression_other_mental_disorders: history(
      data,
      "Depression, other Mental Disorders",
    ),
    trachoma_other_eye_disorders: history(data, "Trachoma, other eye Disorders"),
    deafness_other_ear_disorders: history(data, "Deafness, other Ear Disorders"),
    nose_or_throat_disorders: history(data, "Nose or Throat Disorders"),
    tuberculosis: history(data, "Tuberculosis"),
    other_lung_disorders: history(data, "Other Lung Disorders"),
    high_blood_pressure: history(data, "High Blood Pressure"),
    heart_disease_heart_pain: history(data, "Heart Disease/Heart Pain"),
    rheumatic_fever: history(data, "Rheumatic Fever"),
    diabetes_mellitus: history(data, "Diabetes Mellitus"),
    other_endocrine_disorders: history(
      data,
      "Other Endocrine Disorders (e.g. Goiter)",
    ),
    cancer_or_tumor: history(data, "Cancer or Tumor"),
    blood_disorders: history(data, "Blood Disorders"),
    stomach_pain_gastritis_or_ulcer: history(
      data,
      "Stomach Pain, Gastritis or Ulcer",
    ),
    other_abdominal_disorders: history(data, "Other Abdominal Disorders"),
    kidney_or_bladder_disorder: history(data, "Kidney or Bladder Disorder"),
    back_injury_joint_pain_arthritis_rheumatism: history(
      data,
      "Back Injury: Joint Pain/Arthritis/Rheumatism",
    ),
    genetic_hereditary_or_familial_disorders: history(
      data,
      "Genetic, Hereditary or Familial Disorders",
    ),
    sexually_transmitted_diseases: history(
      data,
      "Sexually Transmitted Diseases",
    ),
    tropical_diseases: history(data, "Tropical Diseases"),
    asthma: history(data, "Asthma"),
    allergies: history(data, "Allergies (Specify):"),
    allergies_details: historyDetail(data, "Allergies (Specify) Details"),
    gynecological_disorder: history(
      data,
      "Gynecological Disorder (For female)",
    ),
    operations: history(data, "Operations (Specify)"),
    operations_details: historyDetail(data, "Operations (Specify) Details"),
    other_abdominal_disorders_details: historyDetail(
      data,
      "Other Abdominal Disorders Details",
    ),
    consulted_doctor_in_past:
      lower(data.consulted_doctor_past) === "yes" ? "true" : "false",
    consulted_doctor_in_past_details: data.medical_history_others ?? "",
    maintenance_medications: data.maintenance_medications ?? "",

    // Physical examination — vital signs
    weight_kg: data.pe_weight ?? "",
    height_cm: data.pe_height ?? "",
    bmi: data.pe_bmi ?? "",
    blood_pressure: data.blood_pressure ?? "",
    pulse_rate: data.pe_pulse_rate ?? "",
    respiration: data.pe_respiration ?? "",
    body_temperature: data.pe_body_temperature ?? "",

    // Vision
    far_vision_uncorrected_od: data.vision_uncorrected_far_od ?? "",
    far_vision_uncorrected_os: data.vision_uncorrected_far_os ?? "",
    far_vision_corrected_od: data.vision_corrected_far_od ?? "",
    far_vision_corrected_os: data.vision_corrected_far_os ?? "",
    near_vision_uncorrected_od: data.vision_uncorrected_near_od ?? "",
    near_vision_uncorrected_os: data.vision_uncorrected_near_os ?? "",
    near_vision_corrected_od: data.vision_corrected_near_od ?? "",
    near_vision_corrected_os: data.vision_corrected_near_os ?? "",
    ishihara_color_vision: lower(data.vision_color),

    // Hearing
    hearing_ad: lower(data.audio_ad_right_2),
    hearing_as: lower(data.audio_as_left_2),

    // Physical examination findings — column A
    skin: finding(data.findings_a, "Skin"),
    head_scalp: finding(data.findings_a, "Head, Scalp"),
    eyes_external: finding(data.findings_a, "Eyes External"),
    pupils: finding(data.findings_a, "Pupils"),
    ears: finding(data.findings_a, "Ears"),
    nose_sinuses: finding(data.findings_a, "Nose, Sinuses"),
    mouth_throat: finding(data.findings_a, "Mouth, Throat"),
  
    skin_remarks: findingRemark(data.findings_a_remarks, "Skin"),
    head_scalp_remarks: findingRemark(data.findings_a_remarks, "Head, Scalp"),
    eyes_external_remarks: findingRemark(
      data.findings_a_remarks,
      "Eyes External",
    ),
    pupils_remarks: findingRemark(data.findings_a_remarks, "Pupils"),
    ears_remarks: findingRemark(data.findings_a_remarks, "Ears"),
    nose_sinuses_remarks: findingRemark(data.findings_a_remarks, "Nose, Sinuses"),
    mouth_throat_remarks: findingRemark(data.findings_a_remarks, "Mouth, Throat"),

    // Physical examination findings — column B
    neck_lymph_node_thyroid: finding(data.findings_b, "Neck, Lymph Nodes"),
    breast_axilla: finding(data.findings_b, "Breast, Axilla"),
    chest_and_lungs: finding(data.findings_b, "Chest and Lungs"),
    heart: finding(data.findings_b, "Heart"),
    abdomen: finding(data.findings_b, "Abdomen"),
    back: finding(data.findings_b, "Back"),
    neck_lymph_node_thyroid_remarks: findingRemark(
      data.findings_b_remarks,
      "Neck, Lymph Nodes",
    ),
    breast_axilla_remarks: findingRemark(data.findings_b_remarks, "Breast, Axilla"),
    chest_and_lungs_remarks: findingRemark(
      data.findings_b_remarks,
      "Chest and Lungs",
    ),
    heart_remarks: findingRemark(data.findings_b_remarks, "Heart"),
    abdomen_remarks: findingRemark(data.findings_b_remarks, "Abdomen"),
    back_remarks: findingRemark(data.findings_b_remarks, "Back"),

    // Physical examination findings — column C
    anus_rectum: finding(data.findings_c, "Anus, Rectum"),
    genito_urinary: finding(data.findings_c, "Genito-Urinary System"),
    inguinals_genitals: finding(data.findings_c, "Inguinals, genitalia"),
    extremities: finding(data.findings_c, "Extremities"),
    reflexes: finding(data.findings_c, "Reflexes"),
    dental_teeth_gums: finding(data.findings_c, "Dental (Teeth/gums)"),
    anus_rectum_remarks: findingRemark(data.findings_c_remarks, "Anus, Rectum"),
    genito_urinary_remarks: findingRemark(
      data.findings_c_remarks,
      "Genito-Urinary System",
    ),
    inguinals_genitals_remarks: findingRemark(
      data.findings_c_remarks,
      "Inguinals, genitalia",
    ),
    extremities_remarks: findingRemark(data.findings_c_remarks, "Extremities"),
    reflexes_remarks: findingRemark(data.findings_c_remarks, "Reflexes"),
    dental_teeth_gums_remarks: findingRemark(
      data.findings_c_remarks,
      "Dental (Teeth/gums)",
    ),

    // Ancillary examinations
    xray_no: data.xray_no ?? "",
    chest_xray: lower(data.ancillary_chest_xray),
    ecg: lower(data.ancillary_ecg),
    cbc: lower(data.ancillary_cbc),
    pregnancy_test: data.ancillary_pregnancy_test ?? "",
    psychological_test: lower(data.ancillary_psychological_test),
    hiv_aids: lower(data.ancillary_hiv_aids),
    hbsag: lower(data.ancillary_hbsag),
    stool_exam: lower(data.ancillary_stool_exam),
    urinalysis: lower(data.ancillary_urinalysis),
    blood_type: data.ancillary_blood_type ?? "",
    rpr: lower(data.ancillary_rpr),
    additional_tests: data.ancillary_additional_tests ?? "",

    // Recommendation / certification
    remarks: data.recommendation_remarks ?? "",
    recommendation: data.final_recommendation ?? "",
    date_of_initial_peme: data.date_initial_peme ?? "",
    date_of_fitness: data.date_of_fitness ?? "",
    valid_until: data.valid_until ?? "",
    authorized_physician: data.authorized_physician ?? "",
    medical_director: data.medical_director ?? "",
  };

  // Lowercase every mapped value for the template's expected tokens. The photo
  // is added afterwards so its base64 data is never altered.
  const lowercased: Record<string, string> = Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value.toLowerCase()]),
  );

  return { ...lowercased, photo_url: photoBase64 };
}

/**
 * Slugs of the seabase reports whose payloads are built client-side and sent to
 * PrintIO (the MLC certificate, Summary Report, and Detailed Report). The
 * remaining seabase report (mer) is rendered by the backend and is not part of
 * this union.
 */
export type ReportSlug =
  | "seabase-mlc"
  | "seabase-summary"
  | "seabase-detailed";

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
    case "seabase-detailed":
      return buildSeabaseDetailedPayload(data);
  }
}
