/**
 * PrintIO payload builders for Landbase PEME reports.
 *
 * Each `build*Payload` function flattens a `LandbasePeme` record into the flat
 * template variable names expected by the corresponding PrintIO template. These
 * are pure data transformations (aside from the patient-photo fetch) and carry
 * no React dependency, so they live outside the `PrintDialog` component.
 *
 * @see PrintDialog — the client component that consumes these builders
 * @see handlePrintRequest (`@/lib/printio`) — server-side PrintIO proxy
 */

import { fetchPhotoAsBase64 } from "@/lib/photo";
import type { LandbasePeme } from "./types";

/** Convert a boolean to the "Adequate"/"Defective" convention used by the MLC template. */
const colorVision = (adequate: boolean | undefined): string =>
  adequate ? "Adequate" : "Defective";

/**
 * Read a medical-history condition and convert it to the "yes"/"no" string
 * convention the templates expect. Missing/empty keys coalesce to "".
 */
const history = (data: LandbasePeme, key: string): string => {
  const value = data.medical_history?.[key];
  if (value === "yes") return "yes";
  if (value === "no") return "no";
  return "";
};

/**
 * Physical-exploration status for the detailed template. The template expects
 * the raw "N"/"A" code; empty values coalesce to "".
 */
const peStatus = (value: string | undefined): string =>
  value === "N" || value === "A" ? value : "";

/**
 * Splits an ISO-ish date string (e.g. "2026-09-08" or a full timestamp) into its
 * day/month/year parts for templates that render each part in a separate box.
 * Any unparseable/empty value yields empty strings for all three parts.
 */
const splitDate = (
  value: string | undefined,
): { day: string; month: string; year: string } => {
  if (!value) return { day: "", month: "", year: "" };
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { day: "", month: "", year: "" };
  return {
    day: String(parsed.getDate()).padStart(2, "0"),
    month: String(parsed.getMonth() + 1).padStart(2, "0"),
    year: String(parsed.getFullYear()),
  };
};

/** Build the "First Middle Last" display name, dropping empty parts. */
const fullNameOf = (data: LandbasePeme): string =>
  [data.first_name, data.middle_name, data.last_name].filter(Boolean).join(" ").trim();

/**
 * Builds the PrintIO payload for the landbase MLC medical certificate.
 *
 * Flattens the PEME record into the flat template variable names expected by
 * the PrintIO MLC template. The patient photo is fetched from the linked
 * seafarer profile and embedded inline as a base64 data URL.
 */
export async function buildMlcPayload(data: LandbasePeme): Promise<Record<string, string>> {
  const photoBase64 = await fetchPhotoAsBase64(data.photo_url);

  return {
    // Identity / personal information
    last_name: data.last_name ?? "",
    first_name: data.first_name ?? "",
    middle_name: data.middle_name ?? "",
    age: "",
    birthdate: "",
    place_of_birth: data.place_of_birth ?? "",
    nationality: data.nationality ?? "",
    gender: data.gender ?? "",
    marital_status: data.civil_status ?? "",
    religion: data.religion ?? "",
    address: data.address ?? "",
    passport_no: data.passport_no ?? "",
    country_of_destination: "",
    position: data.position ?? "",
    employer: data.employer ?? "",

    // Assessment results
    hearing_satisfactory: data.hearing_satisfactory ?? "",
    vision_satisfactory_sight: data.vision_satisfactory_sight ?? "",
    vision_color_adequate: colorVision(data.vision_color_adequate),
    psychological_satisfactory: data.psychological_satisfactory ?? "",
    recommendation: data.recommendation ?? "",

    // Certification
    nameOfPatient: fullNameOf(data),
    authorized_physician: data.authorized_physician ?? "",
    date_initial_peme: data.date_initial_peme ?? "",
    medical_director: data.medical_director ?? "",
    date_of_fitness: data.date_of_fitness ?? "",
    valid_until: data.valid_until ?? "",
    medical_certification_no: data.medical_certification_no ?? "",
    photo_url: photoBase64,
  };
}

/**
 * Builds the PrintIO payload for the landbase MER (Medical Examination Report).
 *
 * Flattens the full PEME record into the flat template variable names expected
 * by the PrintIO MER template: personal info, past-medical-history questionnaire
 * (read from the `medical_history` map), pre-employment questionnaire, vital
 * signs (including split systolic/diastolic BP), vision/hearing/speech,
 * per-body-system physical examination status + findings, ancillary lab results,
 * results/remarks/recommendation, and certification with day/month/year split
 * dates.
 *
 * Fields with no corresponding data on the PEME model are sent as empty strings:
 * `field51` (no source), `last_menstrual_period` (not captured on the form).
 */
export async function buildMerPayload(data: LandbasePeme): Promise<Record<string, string>>{
  const initialPeme = splitDate(data.date_initial_peme);
  const validUntil = splitDate(data.valid_until);

  const photoBase64 = await fetchPhotoAsBase64(data.photo_url);
  return {
    // Identity / personal information
    last_name: data.last_name ?? "",
    given_name: data.first_name ?? "",
    middle_name: data.middle_name ?? "",
    age: data.age ?? "",
    date_of_birth: data.birthdate ?? "",
    place_of_birth: data.place_of_birth ?? "",
    nationality: data.nationality ?? "",
    gender: data.gender ?? "",
    civil_status: data.civil_status ?? "",
    religion: data.religion ?? "",
    address: data.address ?? "",
    passport_no: data.passport_no ?? "",
    position_applied_for: data.position ?? "",
    country_of_destination: data.country_of_destination ?? "",
    employer_name: data.employer ?? "",

    photo_url:photoBase64,
    // Past Medical History (read from the medical_history map by exact key)
    head_or_neck_injury: history(data, "Head or Neck Injury"),
    frequent_headaches: history(data, "Frequent Headaches"),
    frequent_dizziness: history(data, "Frequent Dizziness"),
    fainting_spells_fits_seizures_or_other_neurological_disorders: history(
      data,
      "Fainting Spells, Fits, Seizures or other Neurological Disorders",
    ),
    insomnia_or_sleep_disorders: history(data, "Insomnia or sleep disorders, Manias, Phobias"),
    depression_other_mental_disorders: history(data, "Depression, other Mental Disorders"),
    eye_problems_or_error_of_refraction: history(data, "Trachoma, other eye Disorders"),
    deafness_other_ear_disorders: history(data, "Deafness, other Ear Disorders"),
    nose_or_throat_disorders: history(data, "Nose or Throat Disorders"),
    tuberculosis: history(data, "Tuberculosis"),
    other_lung_disorders: history(data, "Other Lung Disorders"),
    high_blood_pressure: history(data, "High Blood Pressure"),
    heart_disease_vascular_chest_pain: history(data, "Heart Disease/Heart Pain"),
    rheumatic_fever: history(data, "Rheumatic Fever"),
    diabetes_mellitus: history(data, "Diabetes Mellitus"),
    other_endocrine_disorders: history(data, "Other Endocrine Disorders (e.g. Goiter)"),
    cancer_or_tumor: history(data, "Cancer or Tumor"),
    blood_disorders: history(data, "Blood Disorders"),
    stomach_pain_gastritis_or_ulcer: history(data, "Stomach Pain, Gastritis or Ulcer"),
    other_abdominal_disorders: history(data, "Other Abdominal Disorders"),
    // No corresponding model field
    field51: "",
    gynaecological_disorders: history(data, "Gynecological Disorder (For female)"),
    // Not captured on the PEME form
    last_menstrual_period: "",
    kidney_or_bladder_disorder: history(data, "Kidney or Bladder Disorder"),
    back_injury_joint_pain_arthritis: history(
      data,
      "Back Injury: Joint Pain/Arthritis/Rheumatism",
    ),
    genetic_hereditary_or_familial_disorders: history(
      data,
      "Genetic, Hereditary or Familial Disorders",
    ),
    sexually_transmitted_diseases: history(data, "Sexually Transmitted Diseases"),
    tropical_diseases: history(data, "Tropical Diseases"),
    schistosomiasis: history(data, "Schistosomiasis"),
    asthma: history(data, "Asthma"),
    allergies_specify: history(data, "Allergies (Specify):"),
    operations_specify: history(data, "Operations (Specify)"),

    // Pre-employment questionnaire (Yes/No answers)
    questionnaire_1_have_you_ever_been_signed_off_as_sick_or_repatriated:
      data.questionnaire_1 ?? "",
    questionnaire_2_have_you_ever_been_hospitalized: data.questionnaire_2 ?? "",
    questionnaire_3_have_you_ever_been_declared_unfit_for_work_overseas:
      data.questionnaire_3 ?? "",
    questionnaire_4_has_your_medical_certificate_ever_been_restricted_or_revoked:
      data.questionnaire_4 ?? "",
    questionnaire_5_are_you_aware_that_you_have_any_medical_problem: data.questionnaire_5 ?? "",
    questionnaire_6_do_you_feel_healthy_and_fit_to_perform_your_duties:
      data.questionnaire_6 ?? "",
    questionnaire_7_are_you_allergic_to_any_medication: data.questionnaire_7 ?? "",
    questionnaire_8_are_you_taking_any_non_prescription_or_prescription_medication:
      data.questionnaire_8 ?? "",

    // Questionnaire comments
    questionnaire_1_have_you_ever_been_signed_off_as_sick_or_repatriated_comment:
      data.questionnaire_1_details ?? "",
    questionnaire_2_have_you_ever_been_hospitalized_comment: data.questionnaire_2_details ?? "",
    questionnaire_3_have_you_ever_been_declared_unfit_for_work_overseas_comment:
      data.questionnaire_3_details ?? "",
    questionnaire_4_has_your_medical_certificate_ever_been_restricted_or_revoked_comment:
      data.questionnaire_4_details ?? "",
    questionnaire_5_are_you_aware_that_you_have_any_medical_problem_comment:
      data.questionnaire_5_details ?? "",
    questionnaire_6_do_you_feel_healthy_and_fit_to_perform_your_duties_comment:
      data.questionnaire_6_details ?? "",
    questionnaire_7_are_you_allergic_to_any_medication_comment:
      data.questionnaire_comments ?? "",
    questionnaire_8_are_you_taking_any_non_prescription_or_prescription_medication_comment:
      data.questionnaire_8_details ?? "",

    // Physical Examination - vital signs
    pe_height: data.pe_height ?? "",
    pe_weight: data.pe_weight ?? "",
    pe_bp_systolic: data.pe_bp_systolic ?? "",
    pe_bp_diastolic: data.pe_bp_diastolic ?? "",
    pe_pulse_rate: data.pe_pulse_rate ?? "",
    pe_respiration: data.pe_respiration ?? "",
    pe_bmi: data.pe_bmi ?? "",
    pe_blood_pressure: data.pe_blood_pressure ?? "",
    pe_rhythm: data.pe_rhythm ?? "",

    // Physical Examination - vision
    vision_far_od_uncorrected: data.vision_far_od_uncorrected ?? "",
    vision_far_od_corrected: data.vision_far_od_corrected ?? "",
    vision_far_os_uncorrected: data.vision_far_os_uncorrected ?? "",
    vision_far_os_corrected: data.vision_far_os_corrected ?? "",
    vision_near_od_uncorrected: data.vision_near_od_uncorrected ?? "",
    vision_near_od_corrected: data.vision_near_od_corrected ?? "",
    vision_near_os_uncorrected: data.vision_near_os_uncorrected ?? "",
    vision_near_os_corrected: data.vision_near_os_corrected ?? "",
    vision_color_adequate: colorVision(data.vision_color_adequate),

    // Physical Examination - hearing / speech
    hearing_right_adequacy: data.hearing_right_adequacy ?? "",
    hearing_left_adequacy: data.hearing_left_adequacy ?? "",
    speech_clarity: data.speech_clarity ?? "",

    // Physical Examination - body-system status
    pe_skin: peStatus(data.pe_skin),
    pe_head_scalp: peStatus(data.pe_head_scalp),
    pe_eyes_external: peStatus(data.pe_eyes_external),
    pe_pupils: peStatus(data.pe_pupils),
    pe_ears: peStatus(data.pe_ears),
    pe_nose_sinuses: peStatus(data.pe_nose_sinuses),
    pe_mouth_throat: peStatus(data.pe_mouth_throat),
    pe_neck_lymph_nodes: peStatus(data.pe_neck_lymph_nodes),
    pe_breast_axilla: peStatus(data.pe_breast_axilla),
    pe_chest_lungs: peStatus(data.pe_chest_lungs),
    pe_heart: peStatus(data.pe_heart),
    pe_abdomen: peStatus(data.pe_abdomen),
    pe_back: peStatus(data.pe_back),
    pe_anus_rectum: peStatus(data.pe_anus_rectum),
    pe_genito_urinary: peStatus(data.pe_genito_urinary),
    pe_inguinals_genitals: peStatus(data.pe_inguinals_genitals),
    pe_extremities: peStatus(data.pe_extremities),
    pe_reflexes: peStatus(data.pe_reflexes),
    pe_dental: peStatus(data.pe_dental),

    // Physical Examination - body-system findings
    pe_skin_findings: data.pe_skin_findings ?? "",
    pe_head_scalp_findings: data.pe_head_scalp_findings ?? "",
    pe_eyes_external_findings: data.pe_eyes_external_findings ?? "",
    pe_pupils_findings: data.pe_pupils_findings ?? "",
    pe_ears_findings: data.pe_ears_findings ?? "",
    pe_nose_sinuses_findings: data.pe_nose_sinuses_findings ?? "",
    pe_mouth_throat_findings: data.pe_mouth_throat_findings ?? "",
    pe_neck_lymph_nodes_findings: data.pe_neck_lymph_nodes_findings ?? "",
    pe_breast_axilla_findings: data.pe_breast_axilla_findings ?? "",
    pe_chest_lungs_findings: data.pe_chest_lungs_findings ?? "",
    pe_heart_findings: data.pe_heart_findings ?? "",
    pe_abdomen_findings: data.pe_abdomen_findings ?? "",
    pe_back_findings: data.pe_back_findings ?? "",
    pe_anus_rectum_findings: data.pe_anus_rectum_findings ?? "",
    pe_genito_urinary_findings: data.pe_genito_urinary_findings ?? "",
    pe_inguinals_genitals_findings: data.pe_inguinals_genitals_findings ?? "",
    pe_extremities_findings: data.pe_extremities_findings ?? "",
    pe_reflexes_findings: data.pe_reflexes_findings ?? "",
    pe_dental_findings: data.pe_dental_findings ?? "",

    // Ancillary examinations / lab results
    chest_xray: data.chest_xray ?? "",
    cec: data.cec ?? "",
    cbc: data.cbc ?? "",
    urinalysis: data.urinalysis ?? "",
    stool_exam: data.stool_exam ?? "",
    hbsag: data.hbsag ?? "",
    hiv_aids_test: data.hiv_aids_test ?? "",
    apb: data.apb ?? "",
    psychological_test: data.psychological_test ?? "",
    additional_tests: data.additional_tests ?? "",
    blood_type: data.blood_type ?? "",

    // Results / remarks / recommendation
    basic_peme_result: data.basic_peme_result ?? "",
    additional_lab_result: data.additional_lab_result ?? "",
    flag_medical_lab_result: data.flag_medical_lab_result ?? "",
    remarks: data.remarks ?? "",
    recommendation: data.recommendation ?? "",

    // Certification - split dates
    date_initial_peme_day: initialPeme.day,
    date_initial_peme_month: initialPeme.month,
    date_initial_peme_year: initialPeme.year,
    valid_until_day: validUntil.day,
    valid_until_month: validUntil.month,
    valid_until_year: validUntil.year,
    date_of_fitness: data.date_of_fitness ?? "",
    authorized_physician: data.authorized_physician ?? "",
    medical_certification_no: data.medical_certification_no ?? "",
    nameAndSignatureOfApplication: fullNameOf(data),
    peme_id: data.peme_id ?? "",
  };
}

/**
 * Builds the PrintIO payload for the landbase summary report.
 *
 * Flattens the PEME record into the flat template variable names expected by
 * the PrintIO summary template. The patient photo is fetched from the linked
 * seafarer profile and embedded inline as a base64 data URL.
 *
 * NOTE: `age`, `birthdate`, `country_of_destination`, and `suffering` have no
 * corresponding field on the PEME model and are sent as empty strings until a
 * data source is available.
 */
export async function buildSummaryPayload(data: LandbasePeme): Promise<Record<string, string>> {
  const photoBase64 = await fetchPhotoAsBase64(data.photo_url);

  return {
    // Identity / personal information
    last_name: data.last_name ?? "",
    first_name: data.first_name ?? "",
    middle_name: data.middle_name ?? "",
    age: "",
    birthdate: "",
    place_of_birth: data.place_of_birth ?? "",
    nationality: data.nationality ?? "",
    gender: data.gender ?? "",
    marital_status: data.civil_status ?? "",
    religion: data.religion ?? "",
    address: data.address ?? "",
    passport_no: data.passport_no ?? "",
    position: data.position ?? "",
    country_of_destination: "",
    employer: data.employer ?? "",

    // Assessment results
    hearing_satisfactory: data.hearing_satisfactory ?? "",
    vision_satisfactory_sight: data.vision_satisfactory_sight ?? "",
    vision_color_adequate: colorVision(data.vision_color_adequate),
    vision_visual_aid: data.vision_visual_aid ?? "",

    // Certification
    nameOfPatient: fullNameOf(data),
    recommendation: data.recommendation ?? "",
    authorized_physician: data.authorized_physician ?? "",
    date_initial_peme: data.date_initial_peme ?? "",
    medical_director: data.medical_director ?? "",
    date_of_fitness: data.date_of_fitness ?? "",
    valid_until: data.valid_until ?? "",
    photo_url: photoBase64,
  };
}

/**
 * Builds the PrintIO payload for the landbase detailed report.
 *
 * Flattens the full PEME record into the flat template variable names expected
 * by the PrintIO detailed template: personal info, the past-medical-history
 * questionnaire (read from the `medical_history` map using the same keys the
 * form writes), vision/hearing, per-body-system physical examination status +
 * findings, ancillary lab results, vital signs, and certification. The patient
 * photo is fetched from the linked seafarer profile and embedded inline as a
 * base64 data URL.
 *
 * `age`, `birthdate`, `seamans_book_no`, and `country_of_destination` are
 * sourced from the linked seafarer profile (flattened onto the PEME record).
 * `field27` has no data source and is sent as an empty string.
 */
export async function buildDetailedPayload(data: LandbasePeme): Promise<Record<string, string>> {
  const photoBase64 = await fetchPhotoAsBase64(data.photo_url);

  return {
    // Identity / personal information
    photo_url: photoBase64,
    last_name: data.last_name ?? "",
    first_name: data.first_name ?? "",
    middle_name: data.middle_name ?? "",
    place_of_birth: data.place_of_birth ?? "",
    age: data.age ?? "",
    birthdate: data.birthdate ?? "",
    gender: data.gender ?? "",
    marital_status: data.civil_status ?? "",
    religion: data.religion ?? "",
    nationality: data.nationality ?? "",
    address: data.address ?? "",
    passport_no: data.passport_no ?? "",
    seamans_book_no: data.seamans_book_no ?? "",
    employer: data.employer ?? "",
    country_of_destination: data.country_of_destination ?? "",
    contact_no: data.contact_no ?? "",
    position: data.position ?? "",
    ref_no: data.peme_id ?? "",

    // I. Past Medical History (read from the medical_history map by exact key)
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
    depression_other_mental_disorders: history(data, "Depression, other Mental Disorders"),
    trachoma_other_eye_disorders: history(data, "Trachoma, other eye Disorders"),
    deafness_other_ear_disorders: history(data, "Deafness, other Ear Disorders"),
    nose_or_throat_disorders: history(data, "Nose or Throat Disorders"),
    tuberculosis: history(data, "Tuberculosis"),
    other_lung_disorders: history(data, "Other Lung Disorders"),
    high_blood_pressure: history(data, "High Blood Pressure"),
    heart_disease_heart_pain: history(data, "Heart Disease/Heart Pain"),
    rheumatic_fever: history(data, "Rheumatic Fever"),
    diabetes_mellitus: history(data, "Diabetes Mellitus"),
    other_endocrine_disorders: history(data, "Other Endocrine Disorders (e.g. Goiter)"),
    cancer_or_tumor: history(data, "Cancer or Tumor"),
    blood_disorders: history(data, "Blood Disorders"),
    stomach_pain_gastritis_or_ulcer: history(data, "Stomach Pain, Gastritis or Ulcer"),
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
    sexually_transmitted_diseases: history(data, "Sexually Transmitted Diseases"),
    tropical_diseases: history(data, "Tropical Diseases"),
    asthma: history(data, "Asthma"),
    allergies: history(data, "Allergies (Specify):"),
    gynecological_disorder: history(data, "Gynecological Disorder (For female)"),
    operations: history(data, "Operations (Specify)"),
    // No corresponding model field
    consulted_doctor: data.consulted_doctor ? "yes" : "no",
    consulted_doctor_details: data.consulted_doctor_details ?? "",
    maintenance_medications: data.maintenance_medications ?? "",

    // II. Physical Examination - vision
    vision_far_od_uncorrected: data.vision_far_od_uncorrected ?? "",
    vision_far_od_corrected: data.vision_far_od_corrected ?? "",
    vision_far_os_uncorrected: data.vision_far_os_uncorrected ?? "",
    vision_far_os_corrected: data.vision_far_os_corrected ?? "",
    vision_near_od_uncorrected: data.vision_near_od_uncorrected ?? "",
    vision_near_od_corrected: data.vision_near_od_corrected ?? "",
    vision_near_os_uncorrected: data.vision_near_os_uncorrected ?? "",
    vision_near_os_corrected: data.vision_near_os_corrected ?? "",
    vision_color_adequate: colorVision(data.vision_color_adequate),
    hearing_ad: data.hearing_ad ?? "",
    hearing_as: data.hearing_as ?? "",

    // II. Physical Examination - body-system status
    pe_skin: peStatus(data.pe_skin),
    pe_head_scalp: peStatus(data.pe_head_scalp),
    pe_eyes_external: peStatus(data.pe_eyes_external),
    pe_pupils: peStatus(data.pe_pupils),
    pe_ears: peStatus(data.pe_ears),
    pe_nose_sinuses: peStatus(data.pe_nose_sinuses),
    pe_mouth_throat: peStatus(data.pe_mouth_throat),
    pe_neck_lymph_nodes: peStatus(data.pe_neck_lymph_nodes),
    pe_breast_axilla: peStatus(data.pe_breast_axilla),
    pe_chest_lungs: peStatus(data.pe_chest_lungs),
    pe_heart: peStatus(data.pe_heart),
    pe_abdomen: peStatus(data.pe_abdomen),
    pe_back: peStatus(data.pe_back),
    pe_anus_rectum: peStatus(data.pe_anus_rectum),
    pe_genito_urinary: peStatus(data.pe_genito_urinary),
    pe_inguinals_genitals: peStatus(data.pe_inguinals_genitals),
    pe_extremities: peStatus(data.pe_extremities),
    pe_reflexes: peStatus(data.pe_reflexes),
    pe_dental: peStatus(data.pe_dental),

    // II. Physical Examination - body-system findings
    pe_skin_findings: data.pe_skin_findings ?? "",
    pe_head_scalp_findings: data.pe_head_scalp_findings ?? "",
    pe_eyes_external_findings: data.pe_eyes_external_findings ?? "",
    pe_pupils_findings: data.pe_pupils_findings ?? "",
    pe_ears_findings: data.pe_ears_findings ?? "",
    pe_nose_sinuses_findings: data.pe_nose_sinuses_findings ?? "",
    pe_mouth_throat_findings: data.pe_mouth_throat_findings ?? "",
    pe_neck_lymph_nodes_findings: data.pe_neck_lymph_nodes_findings ?? "",
    pe_breast_axilla_findings: data.pe_breast_axilla_findings ?? "",
    pe_chest_lungs_findings: data.pe_chest_lungs_findings ?? "",
    pe_heart_findings: data.pe_heart_findings ?? "",
    pe_abdomen_findings: data.pe_abdomen_findings ?? "",
    pe_back_findings: data.pe_back_findings ?? "",
    pe_anus_rectum_findings: data.pe_anus_rectum_findings ?? "",
    pe_genito_urinary_findings: data.pe_genito_urinary_findings ?? "",
    pe_inguinals_genitals_findings: data.pe_inguinals_genitals_findings ?? "",
    pe_extremities_findings: data.pe_extremities_findings ?? "",
    pe_reflexes_findings: data.pe_reflexes_findings ?? "",
    pe_dental_findings: data.pe_dental_findings ?? "",

    // II. Physical Examination - vital signs
    pe_weight: data.pe_weight ?? "",
    pe_height: data.pe_height ?? "",
    pe_bmi: data.pe_bmi ?? "",
    pe_pulse_rate: data.pe_pulse_rate ?? "",
    pe_blood_pressure: data.pe_blood_pressure ?? "",
    pe_respiration: data.pe_respiration ?? "",
    pe_body_temperature: data.pe_body_temperature ?? "",

    // III. Ancillary Examinations
    xray_no: data.xray_no ?? "",
    chest_xray: data.chest_xray ?? "",
    cec: data.cec ?? "",
    cbc: data.cbc ?? "",
    pregnancy_test: data.pregnancy_test ?? "",
    urinalysis: data.urinalysis ?? "",
    stool_exam: data.stool_exam ?? "",
    hbsag: data.hbsag ?? "",
    hiv_aids_test: data.hiv_aids_test ?? "",
    apb: data.apb ?? "",
    blood_type: data.blood_type ?? "",
    psychological_test: data.psychological_test ?? "",
    additional_tests: data.additional_tests ?? "",

    // Remarks / recommendation / certification
    remarks: data.remarks ?? "",
    recommendation: data.recommendation ?? "",
    date_initial_peme: data.date_initial_peme ?? "",
    date_of_fitness: data.date_of_fitness ?? "",
    valid_until: data.valid_until ?? "",
    authorized_physician: data.authorized_physician ?? "",
    medical_director: data.medical_director ?? "",
  };
}

/** Slugs of the reports whose payloads are built asynchronously (fetch a photo). */
export type ReportSlug =
  | "landbase-mlc"
  | "landbase-summary"
  | "landbase-detailed"
  | "landbase-mer";

/**
 * Builds the PrintIO payload for the given report slug.
 *
 * Dispatches to the matching `build*Payload` function. Async because the
 * MLC/summary/detailed builders fetch and embed the patient photo; the MER
 * builder is synchronous but is awaited uniformly here.
 *
 * @param slug - The report to build a payload for
 * @param data - The current PEME record
 * @returns The flat PrintIO template payload
 */
export function buildReportPayload(
  slug: ReportSlug,
  data: LandbasePeme,
): Promise<Record<string, string>> {
  switch (slug) {
    case "landbase-summary":
      return buildSummaryPayload(data);
    case "landbase-detailed":
      return buildDetailedPayload(data);
    case "landbase-mer":
      return Promise.resolve(buildMerPayload(data));
    case "landbase-mlc":
      return buildMlcPayload(data);
  }
}
