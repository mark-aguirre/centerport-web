/**
 * PrintIO payload builder for the Panama Maritime Authority medical certificate.
 *
 * Flattens a `PanamaCertificate` — including its nested `conditions`,
 * `physical_exploration`, `lab_tests`, and `lab_other_tests` maps — into the
 * flat template variable names expected by the PrintIO Panama template. This is
 * a pure data transformation with no React dependency, so it lives outside the
 * `PrintDialog` component.
 *
 * @see PrintDialog — the client component that consumes this builder
 * @see handlePrintRequest (`@/lib/printio`) — server-side PrintIO proxy
 */

import type { PanamaCertificate } from "@/components/panama/types";

/** Storage keys for the declaration conditions, aligned with PersonalDeclarationSection. */
const CONDITION_KEYS = [
  "high_blood_pressure",
  "eye_vision_problem",
  "ear_problem",
  "heart_surgery",
  "varicose_veins",
  "hemorrhoids",
  "nose_problem",
  "throat_problem",
  "asthma_bronchitis",
  "blood_disorders",
  "diabetes",
  "thyroid_problems",
  "digestive_disorders",
  "kidney_problems",
  "skin_problems",
  "allergies",
  "epilepsy_seizures",
  "sleep_problem",
  "sickle_cell_disease",
  "hernias",
  "genital_disorders",
  "smoking",
  "surgeries",
  "infectious_diseases",
  "dizziness_fainting",
  "loss_of_consciousness",
  "alcohol",
  "drugs",
  "psychiatric_problems",
  "depression",
  "loss_of_memory",
  "balance_problems",
  "severe_headaches",
  "heart_vascular_disease",
  "restricted_mobility",
  "back_problem",
  "joint_problem",
  "amputation",
  "fractures_dislocation",
  "covid_19",
  "pregnancy",
] as const;

/**
 * Physical exploration mapping: form storage key → PrintIO template key.
 *
 * All keys map 1:1 to the PrintIO template field names.
 */
const PHYSICAL_EXPLORATION_KEY_MAP: Record<string, string> = {
  head: "head",
  mouth: "mouth",
  nose: "nose",
  throat: "throat",
  dental_exam: "dental_exam",
  ears_general: "ears_general",
  tympanic_membrane: "tympanic_membrane",
  eyes: "eyes",
  pupils: "pupils",
  ophthalmoscopy: "ophthalmoscopy",
  eye_movement: "eye_movement",
  lungs: "lungs",
  chest: "chest",
  breast_examination: "breast_examination",
  heart: "heart",
  skin: "skin",
  varicose_veins: "varicose_veins",
  vascular_incl_pedal: "vascular_incl_pedal",
  abdomen_and_viscera: "abdomen_and_viscera",
  hernias: "hernias",
  anus_not_rectal_exam: "anus_not_rectal_exam",
  gu_system: "gu_system",
  upper_and_lower: "upper_and_lower",
  spine_cervical_thoracic_lumbar: "spine_cervical_thoracic_lumbar",
  neurologic_full_brief: "neurologic_full_brief",
  psychiatric: "psychiatric",
  general_appearance: "general_appearance",
};

/**
 * Per-test override for the "abnormal" field suffix. The PrintIO template
 * misspells the abnormal field as `abdnormal` for `creatinine` and
 * `cholesterol`, so those must be emitted with the template's exact key.
 */
const LAB_ABNORMAL_KEY: Record<string, string> = {
  creatinine: "abdnormal",
  cholesterol: "abdnormal",
};

/** Laboratory test keys, aligned with DiagnosticTestsSection. */
const LAB_TEST_KEYS = [
  "hemogram",
  "lipid_profile",
  "creatinine",
  "cholesterol",
  "triglycerides",
  "glucose_fasting",
  "urea_nitrogen",
  "rh_typing",
  "hiv",
  "vdrl",
  "gch_pregnant",
  "general_urin",
  "stool_transit",
  "drug_test",
  "alcohol",
] as const;

/**
 * Other diagnostic tests that report checkbox + normal/abnormal/observations.
 */
const OTHER_TEST_KEYS = [
  "breast_examination",
  "pap_test",
  "psa_men",
] as const;

/**
 * Other diagnostic tests that report a performed date instead of
 * normal/abnormal, using `<key>_performed_date_*` template fields.
 */
const OTHER_TEST_DATE_KEYS = [
  "chest_xray",
  "ekg",
] as const;

/** Convert a boolean to the "X"/"" convention used by the PrintIO template. */
const mark = (checked: boolean | undefined): string => (checked ? "X" : "");

/**
 * Convert a checkbox state to the "true"/"false" string the PrintIO template
 * expects for `*_checked` fields.
 */
const boolStr = (checked: boolean | undefined): string => (checked ? "true" : "false");

/** Split an ISO date (yyyy-mm-dd) into day/month/year parts. */
function splitDate(iso: string | undefined): { day: string; month: string; year: string } {
  if (!iso) return { day: "", month: "", year: "" };
  const [year = "", month = "", day = ""] = iso.split("-");
  return { day, month, year };
}

/**
 * Builds the PrintIO payload from the current Panama certificate form data.
 *
 * Flattens nested maps (conditions, physical_exploration, lab_tests,
 * lab_other_tests) into the flat template variable names expected by PrintIO.
 *
 * @param data - The current Panama certificate record
 * @returns The flat PrintIO template payload
 */
export function buildPanamaPayload(data: PanamaCertificate): Record<string, string> {
  const payload: Record<string, string> = {
    // General Information
    fullName: data.full_name ?? "",
    dateOfBirthDay: data.day ?? "",
    dateOfBirthMonth: data.month ?? "",
    dateOfBirthYear: data.year ?? "",
    gender: data.sex ?? "",
    rh_typing: data.rh_typing ?? "",
    home_address: data.home_address ?? "",
    passport_no: data.passport_no ?? "",
    seamans_book_no: data.seamans_book_no ?? "",
    department: data.department ?? "",
    position: data.crew_position ?? "",
    designation: data.crew_position ?? "",
    lookout_duties: data.lookout_duties ?? "",
    routine_duties: data.routine_duties ?? "",
    emergency_duties: data.emergency_duties ?? "",
    type_of_ship: data.type_of_ship ?? "",
    type_of_ship_details: data.type_of_ship_details ?? "",
    trade_area: data.trade_area ?? "",
    trade_area_details: data.trade_area_details ?? "",

    // Personal declaration — free text
    conditions_details: data.conditions_details ?? "",

    // Additional questions 37–44
    question_37: data.question_37 ?? "",
    question_38: data.question_38 ?? "",
    question_39: data.question_39 ?? "",
    question_40: data.question_40 ?? "",
    question_41: data.question_41 ?? "",
    question_42: data.question_42 ?? "",
    question_43: data.question_43 ?? "",
    question_44: data.question_44 ?? "",
    declaration_comments: data.declaration_comments ?? "",

    // Medication (45)
    question_45: data.question_45 ?? "",
    question_45_details: data.question_45_details ?? "",

    // Covid-19
    covid_1: data.covid_1 ?? "",
    covid_2: data.covid_2 ?? "",
    covid_3_date: data.covid_3_date ?? "",
    covid_4: data.covid_4 ?? "",
    covid_4_details: data.covid_4_details ?? "",
    covid_5: data.covid_5 ?? "",
    covid_6_vaccine_type: data.covid_6_vaccine_type ?? "",
    covid_6_num_doses: data.covid_6_num_doses ?? "",
    covid_6_boosters: data.covid_6_boosters ?? "",

    // III. Statement
    statement_name: data.statement_name ?? "",
    statement_signature: data.statement_signature ?? "",
    statement_day: data.statement_day ?? "",
    statement_month: data.statement_month ?? "",
    statement_year: data.statement_year ?? "",
    statement_witness_name: data.statement_witness_name ?? "",
    statement_practitioner_name: data.statement_practitioner_name ?? "",
    statement_practitioner_signature: data.statement_practitioner_signature ?? "",
    statement_practitioner_date_day: data.statement_practitioner_date_day ?? "",
    statement_practitioner_date_month: data.statement_practitioner_date_month ?? "",
    statement_practitioner_date_year: data.statement_practitioner_date_year ?? "",
    statement_previous_exam_details: data.statement_previous_exam_details ?? "",

    // IV. Medical Examination — Clinical Data
    height_cm: data.height_cm ?? "",
    weight_kg: data.weight_kg ?? "",
    bmi: data.bmi ?? "",
    oxygen_saturation: data.oxygen_saturation ?? "",
    heart_rate: data.heart_rate ?? "",
    respiratory_rate: data.respiratory_rate ?? "",
    blood_pressure_systolic: data.blood_pressure_systolic ?? "",
    blood_pressure_diastolic: data.blood_pressure_diastolic ?? "",

    // IV. Sight
    sight_unaided_distant_right: data.sight_unaided_distant_right ?? "",
    sight_unaided_distant_left: data.sight_unaided_distant_left ?? "",
    sight_unaided_distant_binocular: data.sight_unaided_distant_binocular ?? "",
    sight_aided_distant_right: data.sight_aided_distant_right ?? "",
    sight_aided_distant_left: data.sight_aided_distant_left ?? "",
    sight_aided_distant_binocular: data.sight_aided_distant_binocular ?? "",
    sight_unaided_short_right: data.sight_unaided_short_right ?? "",
    sight_unaided_short_left: data.sight_unaided_short_left ?? "",
    sight_aided_short_right: data.sight_aided_short_right ?? "",
    sight_aided_short_left: data.sight_aided_short_left ?? "",
    sight_fields_right: data.sight_fields_right ?? "",
    sight_fields_left: data.sight_fields_left ?? "",
    sight_color_vision: data.sight_color_vision ?? "",
    sight_color_method: data.sight_color_method ?? "",

    // IV. Hearing (Tonal Audiometric)
    hearing_right_500: data.hearing_right_500 ?? "",
    hearing_right_1000: data.hearing_right_1000 ?? "",
    hearing_right_2000: data.hearing_right_2000 ?? "",
    hearing_right_3000: data.hearing_right_3000 ?? "",
    hearing_right_4000: data.hearing_right_4000 ?? "",
    hearing_right_6000: data.hearing_right_6000 ?? "",
    hearing_left_500: data.hearing_left_500 ?? "",
    hearing_left_1000: data.hearing_left_1000 ?? "",
    hearing_left_2000: data.hearing_left_2000 ?? "",
    hearing_left_3000: data.hearing_left_3000 ?? "",
    hearing_left_4000: data.hearing_left_4000 ?? "",
    hearing_left_6000: data.hearing_left_6000 ?? "",

    // IV. Physical exploration — free text
    physical_exploration_comments: data.physical_exploration_comments ?? "",

    // VI. Other diagnostic tests
    other_diag_test: data.other_diag_test ?? "",
    other_diag_result: data.other_diag_result ?? "",
    other_diag_comments: data.other_diag_comments ?? "",

    // VII. Assessment of Fitness for Service at Sea
    fitness_lookout: data.fitness_lookout ?? "",
    fitness_deck_fit: mark(data.fitness_deck_fit),
    fitness_deck_unfit: mark(data.fitness_deck_unfit),
    fitness_engine_fit: mark(data.fitness_engine_fit),
    fitness_engine_unfit: mark(data.fitness_engine_unfit),
    fitness_catering_fit: mark(data.fitness_catering_fit),
    fitness_catering_unfit: mark(data.fitness_catering_unfit),
    fitness_other_fit: mark(data.fitness_other_fit),
    fitness_other_unfit: mark(data.fitness_other_unfit),
    fitness_restriction: data.fitness_restriction ?? "",
    fitness_restriction_details: data.fitness_restriction_details ?? "",
    fitness_visual_aid: data.fitness_visual_aid ?? "",
    cert_expiry_day: data.cert_expiry_day ?? "",
    cert_expiry_month: data.cert_expiry_month ?? "",
    cert_expiry_year: data.cert_expiry_year ?? "",
    cert_issued_day: data.cert_issued_day ?? "",
    cert_issued_month: data.cert_issued_month ?? "",
    cert_issued_year: data.cert_issued_year ?? "",
    cert_number: data.cert_number ?? "",
    physician_name: data.physician_name ?? "",
    physician_signature: data.physician_signature ?? "",
  };

  // Declaration conditions — flatten into individual yes/no fields.
  const conditions = data.conditions ?? {};
  for (const key of CONDITION_KEYS) {
    payload[key] = conditions[key] ?? "";
  }

  // Physical exploration — flatten into individual N/A fields, remapping
  // form storage keys to the template's expected key names.
  const exploration = data.physical_exploration ?? {};
  for (const [formKey, templateKey] of Object.entries(PHYSICAL_EXPLORATION_KEY_MAP)) {
    payload[templateKey] = exploration[formKey] ?? "";
  }

  // Laboratory tests — "true"/"false" checkbox state + normal/abnormal/observations.
  const labTests = data.lab_tests ?? {};
  for (const key of LAB_TEST_KEYS) {
    const test = labTests[key];
    payload[`${key}_checked`] = boolStr(test?.checked ?? (!!test?.normal || !!test?.abnormal));
    payload[`${key}_normal`] = test?.normal ?? "";
    // The template misspells the abnormal field as "abdnormal" for a couple of
    // tests; emit the exact key the template expects so the value binds.
    payload[`${key}_${LAB_ABNORMAL_KEY[key] ?? "abnormal"}`] = test?.abnormal ?? "";
    payload[`${key}_observations`] = test?.observations ?? "";
  }

  // Other diagnostic tests (normal/abnormal style) — "true"/"false" checkbox
  // state plus normal/abnormal/observations.
  const otherTests = data.lab_other_tests ?? {};
  for (const key of OTHER_TEST_KEYS) {
    const test = otherTests[key];
    payload[`${key}_checked`] = boolStr(test?.checked);
    payload[`${key}_normal`] = test?.normal ?? "";
    payload[`${key}_abnormal`] = test?.abnormal ?? "";
    payload[`${key}_observations`] = test?.observations ?? "";
  }

  // Other diagnostic tests (date style) — "true"/"false" checkbox state plus a
  // split performed date and observations, matching the template's field names.
  for (const key of OTHER_TEST_DATE_KEYS) {
    const test = otherTests[key];
    const { day, month, year } = splitDate(test?.performed_date);
    payload[`${key}_checked`] = boolStr(test?.checked);
    payload[`${key}_performed_date_day`] = day;
    payload[`${key}_performed_date_month`] = month;
    payload[`${key}_performed_date_year`] = year;
    payload[`${key}_performed_date_observations`] = test?.observations ?? "";
  }

  return payload;
}
