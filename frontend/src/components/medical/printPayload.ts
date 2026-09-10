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

/** A date split into its day, month, and year string parts. */
interface DateParts {
  day: string;
  month: string;
  year: string;
}

/**
 * Splits an ISO-ish date string (`YYYY-MM-DD`) into day/month/year parts.
 *
 * The MER template renders dates across three separate fields rather than one
 * combined value, so each source date is decomposed here. A missing or
 * unparseable value yields empty strings for all three parts (never throws).
 *
 * @param value - A date string, ideally `YYYY-MM-DD`
 * @returns The day, month, and year as strings (empty when unavailable)
 */
function splitDate(value: string | undefined): DateParts {
  if (!value) return { day: "", month: "", year: "" };
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return { day: "", month: "", year: "" };
  const [, year, month, day] = match;
  return { day, month, year };
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
 * Read a past-medical-history answer from the `medical_history` map and map it
 * to a `"yes"`/`"no"` token, as the MER template expects.
 *
 * A stored `"yes"` becomes `"yes"`; any other value (`"no"` or unanswered)
 * becomes `"no"`.
 */
function historyYesNo(data: MedicalExam, key: string): string {
  return lower(data.medical_history?.[key]) === "yes" ? "yes" : "no";
}

/**
 * Read a questionnaire answer from the `questionnaire` map and map it to a
 * `"yes"`/`"no"` token, as the MER template expects.
 *
 * A stored `"yes"` becomes `"yes"`; any other value (`"no"` or unanswered)
 * becomes `"no"`.
 */
function questionnaireYesNo(data: MedicalExam, key: string): string {
  return lower(data.questionnaire?.[key]) === "yes" ? "yes" : "no";
}

/** Read a questionnaire free-text detail/comment by its stored key. */
function questionnaireDetail(data: MedicalExam, key: string): string {
  return data.questionnaire?.[key] ?? "";
}

/**
 * Map a physical-examination findings checkbox to a `"yes"`/`"no"` token, as the
 * MER template expects.
 *
 * On the Seabase form a checked box marks a *normal* finding, so a checked box
 * yields `"yes"` and an unchecked/absent one yields `"no"`.
 */
function findingYesNo(map: Record<string, boolean> | undefined, key: string): string {
  return map?.[key] ? "yes" : "no";
}

/**
 * Builds the PrintIO payload for the Seabase MER (Medical Examination Report).
 *
 * Flattens the full `MedicalExam` record into the flat template variable names
 * expected by the PrintIO Seabase MER template. The MER is the most complete of
 * the seabase reports and covers: personal information (with dates split into
 * day/month/year parts), past medical history, the seafarer declaration
 * (questionnaire), physical-examination vitals/vision/hearing, physical
 * examination findings, ancillary/laboratory examinations, the fitness
 * assessment, and the final certification.
 *
 * Mapping notes:
 * - Dates the template renders across three fields (`*_day`, `*_month`,
 *   `*_year`) are decomposed via {@link splitDate}. The record stores
 *   `valid_until` for the certificate expiration.
 * - Past-medical-history questions are read from the `medical_history` JSONB map
 *   by their stored keys and sent as `"true"`/`"false"`.
 * - Declaration questions are read from the `questionnaire` JSONB map and sent
 *   as `"true"`/`"false"`; their adjacent `*_comment` fields carry the stored
 *   "… Details" free text.
 * - Physical-examination findings send `"true"` for a checked box (normal) and
 *   `"false"` otherwise; adjacent `*_remarks` fields carry the free text.
 * - The patient photo is embedded as base64 (never lowercased).
 *
 * Fields sent empty because the seabase model has no source for them:
 * `seamans_book_no`, `blood_type` remarks placeholders, and the template's
 * generic placeholder fields (`field114`, `field118`, `field119`).
 *
 * @param data - The current Seabase medical exam record
 * @returns The flat PrintIO template payload
 */
export async function buildSeabaseMerPayload(
  data: MedicalExam,
): Promise<Record<string, string>> {
  const photoBase64 = await fetchPhotoAsBase64(data.photo_url);
  const birth = splitDate(data.date_of_birth);
  const examDate = splitDate(data.date_of_fitness);
  const expiry = splitDate(data.valid_until);

  return {
    // Identity / personal information
    last_name: data.last_name ?? "",
    first_name: data.first_name ?? "",
    middle_name: data.middle_name ?? "",
    age: data.age ?? "",
    date_of_birth_day: birth.day,
    date_of_birth_month: birth.month,
    date_of_birth_year: birth.year,
    place_of_birth: data.place_of_birth ?? "",
    nationality: data.nationality ?? "",
    gender: data.gender ?? "",
    marital_status: data.civil_status ?? "",
    religion: data.religion ?? "",
    address: data.address ?? "",
    passport_no: data.passport_no ?? "",
    seamans_book_no: "",
    position: data.position ?? "",
    employer: data.employer ?? "",

    // Past medical history (yes/no answers from the medical_history map)
    head_or_neck_injury: historyYesNo(data, "Head or Neck Injury"),
    frequent_headaches: historyYesNo(data, "Frequent Headaches"),
    frequent_dizziness: historyYesNo(data, "Frequent Dizziness"),
    fainting_spells_fits_seizures: historyYesNo(
      data,
      "Fainting Spells, Fits, Seizures or other Neurological Disorders",
    ),
    insomnia_or_sleep_disorders: historyYesNo(
      data,
      "Insomnia or sleep disorders, Manias, Phobias",
    ),
    depression_or_mental_disorders: historyYesNo(
      data,
      "Depression, other Mental Disorders",
    ),
    eye_problems_or_error_of_refraction: historyYesNo(
      data,
      "Trachoma, other eye Disorders",
    ),
    deafness_or_ear_disorders: historyYesNo(data, "Deafness, other Ear Disorders"),
    nose_or_throat_disorders: historyYesNo(data, "Nose or Throat Disorders"),
    tuberculosis: historyYesNo(data, "Tuberculosis"),
    other_lung_disorders: historyYesNo(data, "Other Lung Disorders"),
    high_blood_pressure: historyYesNo(data, "High Blood Pressure"),
    heart_disease: historyYesNo(data, "Heart Disease/Heart Pain"),
    rheumatic_fever: historyYesNo(data, "Rheumatic Fever"),
    diabetes_mellitus: historyYesNo(data, "Diabetes Mellitus"),
    other_endocrine_disorders: historyYesNo(
      data,
      "Other Endocrine Disorders (e.g. Goiter)",
    ),
    cancer_or_tumor: historyYesNo(data, "Cancer or Tumor"),
    blood_disorders: historyYesNo(data, "Blood Disorders"),
    stomach_pain_gastritis_or_ulcer: historyYesNo(
      data,
      "Stomach Pain, Gastritis or Ulcer",
    ),
    other_abdominal_disorders: historyYesNo(data, "Other Abdominal Disorders"),
    gynecological_disorders: historyYesNo(
      data,
      "Gynecological Disorder (For female)",
    ),
    last_menstrual_period: historyYesNo(data, "Last Menstrual Period"),
    kidney_or_bladder_disorder: historyYesNo(data, "Kidney or Bladder Disorder"),
    back_injury_joint_pain_arthritis_rheumatism: historyYesNo(
      data,
      "Back Injury: Joint Pain/Arthritis/Rheumatism",
    ),
    genetic_hereditary_or_familial_disorders: historyYesNo(
      data,
      "Genetic, Hereditary or Familial Disorders",
    ),
    sexually_transmitted_diseases: historyYesNo(
      data,
      "Sexually Transmitted Diseases",
    ),
    tropical_diseases: historyYesNo(data, "Tropical Diseases"),
    schistosomiasis: historyYesNo(data, "Schistosomiasis"),
    asthma: historyYesNo(data, "Asthma"),
    allergies: historyYesNo(data, "Allergies (Specify):"),
    allergies_details: historyDetail(data, "Allergies (Specify) Details"),
    operations: historyYesNo(data, "Operations (Specify)"),
    operations_details: historyDetail(data, "Operations (Specify) Details"),

    // Seafarer declaration (yes/no answers + comments from the questionnaire map)
    signed_off_as_sick_or_repatriated: questionnaireYesNo(
      data,
      "Have you ever been signed off as sick or repatriated from a ship?",
    ),
    signed_off_as_sick_or_repatriated_comment: questionnaireDetail(
      data,
      "Have you ever been signed off as sick or repatriated from a ship? Details",
    ),
    hospitalized: questionnaireYesNo(data, "Have you ever been hospitalized?"),
    hospitalized_comment: questionnaireDetail(
      data,
      "Have you ever been hospitalized? Details",
    ),
    declared_unfit_for_sea_duty: questionnaireYesNo(
      data,
      "Have you ever been declared unfit for sea duty?",
    ),
    declared_unfit_for_sea_duty_comment: questionnaireDetail(
      data,
      "Have you ever been declared unfit for sea duty? Details",
    ),
    medical_certificate_restricted_or_revoked: questionnaireYesNo(
      data,
      "Has your medical certificate ever been restricted or revoked?",
    ),
    medical_certificate_restricted_or_revoked_comment: questionnaireDetail(
      data,
      "Has your medical certificate ever been restricted or revoked? Details",
    ),
    aware_of_medical_problem: questionnaireYesNo(
      data,
      "Are you aware that you have any medical problem, disease or illness?",
    ),
    aware_of_medical_problem_comment: questionnaireDetail(
      data,
      "Are you aware that you have any medical problem, disease or illness? Details",
    ),
    healthy_and_fit_for_duties: questionnaireYesNo(
      data,
      "Do you feel healthy and fit to perform the duties of your designated position/occupation?",
    ),
    healthy_and_fit_for_duties_comment: questionnaireDetail(
      data,
      "Do you feel healthy and fit to perform the duties of your designated position/occupation? Details",
    ),
    allergic_to_medication: questionnaireYesNo(
      data,
      "Are you allergic to any medication?",
    ),
    allergic_to_medication_comment: "",
    taking_prescription_medication: questionnaireYesNo(
      data,
      "Non-prescription or prescription medication",
    ),
    taking_prescription_medication_comment:
      data.questionnaire_medications_detail ?? "",

    // Physical examination — vital signs
    height_cm: data.pe_height ?? "",
    weight_kg: data.pe_weight ?? "",
    bp_systolic: data.pe_bp_systolic ?? "",
    bp_diastolic: data.pe_bp_diastolic ?? "",
    field114: "",
    pulse_rate: data.pe_pulse_rate ?? "",
    rhythm: data.pe_rhythm ?? "",
    respiration_rate: data.pe_respiration ?? "",
    field118: "",
    field119: "",
    bmi: data.pe_bmi ?? "",

    // Vision
    vision_uncorrected_far_od: data.vision_uncorrected_far_od ?? "",
    vision_corrected_far_od: data.vision_corrected_far_od ?? "",
    vision_uncorrected_far_os: data.vision_uncorrected_far_os ?? "",
    vision_corrected_far_os: data.vision_corrected_far_os ?? "",
    vision_uncorrected_near_od: data.vision_uncorrected_near_od ?? "",
    vision_corrected_near_od: data.vision_corrected_near_od ?? "",
    vision_uncorrected_near_os: data.vision_uncorrected_near_os ?? "",
    vision_corrected_near_os: data.vision_corrected_near_os ?? "",
    ishihara_color_vision: data.vision_color ?? "",

    // Hearing / audiometry
    audiometry_ad_1: data.audio_ad_right_1 ?? "",
    audiometry_as_1: data.audio_as_left_1 ?? "",
    audiometry_ad_2: data.audio_ad_right_2 ?? "",
    audiometry_as_2: data.audio_as_left_2 ?? "",
    clarity_of_speech: data.speech_impaired_hearing ?? "",

    photo_url: photoBase64,

    // Physical examination findings — column A
    finding_skin: findingYesNo(data.findings_a, "Skin"),
    finding_head_neck_scalp: findingYesNo(data.findings_a, "Head, Scalp"),
    finding_eyes_external: findingYesNo(data.findings_a, "Eyes External"),
    finding_pupils_ophthalmoscopic: findingYesNo(data.findings_a, "Pupils"),
    finding_ears: findingYesNo(data.findings_a, "Ears"),
    finding_nose_sinuses: findingYesNo(data.findings_a, "Nose, Sinuses"),
    finding_mouth_throat: findingYesNo(data.findings_a, "Mouth, Throat"),
    finding_skin_remarks: findingRemark(data.findings_a_remarks, "Skin"),
    finding_head_neck_scalp_remarks: findingRemark(
      data.findings_a_remarks,
      "Head, Scalp",
    ),
    finding_eyes_external_remarks: findingRemark(
      data.findings_a_remarks,
      "Eyes External",
    ),
    finding_pupils_ophthalmoscopic_remarks: findingRemark(
      data.findings_a_remarks,
      "Pupils",
    ),
    finding_ears_remarks: findingRemark(data.findings_a_remarks, "Ears"),
    finding_nose_sinuses_remarks: findingRemark(
      data.findings_a_remarks,
      "Nose, Sinuses",
    ),
    finding_mouth_throat_remarks: findingRemark(
      data.findings_a_remarks,
      "Mouth, Throat",
    ),

    // Physical examination findings — column B
    finding_neck_lymph_nodes_thyroid: findingYesNo(
      data.findings_b,
      "Neck, Lymph Nodes",
    ),
    finding_chest_breast_axilla: findingYesNo(data.findings_b, "Breast, Axilla"),
    finding_lungs: findingYesNo(data.findings_b, "Chest and Lungs"),
    finding_heart: findingYesNo(data.findings_b, "Heart"),
    finding_abdomen: findingYesNo(data.findings_b, "Abdomen"),
    finding_back: findingYesNo(data.findings_b, "Back"),
    finding_neck_lymph_nodes_thyroid_remarks: findingRemark(
      data.findings_b_remarks,
      "Neck, Lymph Nodes",
    ),
    finding_chest_breast_axilla_remarks: findingRemark(
      data.findings_b_remarks,
      "Breast, Axilla",
    ),
    finding_lungs_remarks: findingRemark(
      data.findings_b_remarks,
      "Chest and Lungs",
    ),
    finding_heart_remarks: findingRemark(data.findings_b_remarks, "Heart"),
    finding_abdomen_remarks: findingRemark(data.findings_b_remarks, "Abdomen"),
    finding_back_remarks: findingRemark(data.findings_b_remarks, "Back"),

    // Physical examination findings — column C
    finding_anus_rectum: findingYesNo(data.findings_c, "Anus, Rectum"),
    finding_genito_urinary_system: findingYesNo(
      data.findings_c,
      "Genito-Urinary System",
    ),
    finding_inguinals_genitals: findingYesNo(
      data.findings_c,
      "Inguinals, genitalia",
    ),
      finding_extremities: findingYesNo(
      data.findings_c,
      "Extremities",
    ),
    finding_reflexes: findingYesNo(data.findings_c, "Reflexes"),
    finding_dental_teeth_gums: findingYesNo(data.findings_c, "Dental (Teeth/gums)"),
    finding_anus_rectum_remarks: findingRemark(
      data.findings_c_remarks,
      "Anus, Rectum",
    ),
    finding_genito_urinary_system_remarks: findingRemark(
      data.findings_c_remarks,
      "Genito-Urinary System",
    ),
    finding_inguinals_genitals_remarks: findingRemark(
      data.findings_c_remarks,
      "Inguinals, genitalia",
    ),
    finding_extremities_remarks: findingRemark(
      data.findings_c_remarks,
      "Extremities",
    ),
    finding_reflexes_remarks: findingRemark(
      data.findings_c_remarks,
      "Reflexes",
    ),
    finding_dental_teeth_gums_remarks: findingRemark(
      data.findings_c_remarks,
      "Dental (Teeth/gums)",
    ),

    // Ancillary / laboratory examinations
    ancillary_chest_xray: data.ancillary_chest_xray ?? "",
    ecg_result: data.ancillary_ecg ?? "",
    cbc_result: data.ancillary_cbc ?? "",
    urinalysis_result: data.ancillary_urinalysis ?? "",
    stool_exam_result: data.ancillary_stool_exam ?? "",
    hepatitis_b_result: data.ancillary_hbsag ?? "",
    hiv_aids_result: data.ancillary_hiv_aids ?? "",
    rpr_tpha_result: data.ancillary_rpr ?? "",
    psychological_test_result: data.ancillary_psychological_test ?? "",
    additional_tests: data.ancillary_additional_tests ?? "",
    xray_no: data.xray_no ?? "",
    blood_type: data.ancillary_blood_type ?? "",

    // Certification requirements
    basic_doh_mandatory_exam: data.cert_basic_ooh ?? "",
    additional_laboratory_tests: data.cert_additional_labs ?? "",
    flag_host_requirements: data.cert_flagpost ?? "",
    basic_doh_mandatory_exam_findings: data.cert_basic_ooh_findings ?? "",
    additional_laboratory_tests_findings:
      data.cert_additional_labs_findings ?? "",
    flag_host_requirements_findings: data.cert_flagpost_findings ?? "",
    remarks_special_needs: data.recommendation_remarks ?? "",

    // Fitness assessment
    fit_for_lookout_duty: data.fit_for_lookout ?? "",
    fitness_deck_service: data.fitness_deck_services ?? "",
    fitness_engine_service: data.fitness_engine_services ?? "",
    fitness_catering_service: data.fitness_catering_services ?? "",
    fitness_other_service: data.fitness_other_services ?? "",
    final_recommendation: data.final_recommendation ?? "",
    visual_aid_required: data.visual_aids_required ?? "",
    restriction_details: data.restriction_details ?? "",

    // Examination / certification dates
    date_of_medical_examination_day: examDate.day,
    date_of_medical_examination_month: examDate.month,
    date_of_medical_examination_year: examDate.year,
    medical_exam_expiration_date_day: expiry.day,
    medical_exam_expiration_date_month: expiry.month,
    medical_exam_expiration_date_year: expiry.year,
    medical_exam_report_number: data.medical_certification_no ?? "",
    authorized_physician: data.authorized_physician ?? "",
    authorized_physician_license_number: data.license_no ?? "",
  };
}

/**
 * Slugs of the seabase reports whose payloads are built client-side and sent to
 * PrintIO (the MLC certificate, Summary Report, Detailed Report, and MER). All
 * four seabase reports are now rendered via PrintIO.
 */
export type ReportSlug =
  | "seabase-mlc"
  | "seabase-summary"
  | "seabase-detailed"
  | "seabase-mer";

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
    case "seabase-mer":
      return buildSeabaseMerPayload(data);
  }
}
