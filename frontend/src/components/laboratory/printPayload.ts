/**
 * PrintIO payload builder for the Laboratory Report (Lab-06).
 *
 * Flattens a `LaboratoryReport` into the flat template variable names expected
 * by the PrintIO Lab-06 template (hematology, urinalysis, and fecalysis
 * results plus the report header). This is a pure data transformation with no
 * React dependency, so it lives outside the `ReportMenu` component.
 *
 * @see ReportMenu — the client component that consumes this builder
 * @see handlePrintRequest (`@/lib/printio`) — server-side PrintIO proxy
 */

import type { LaboratoryReport } from "@/components/laboratory/types";
import type { HematologyRepeatTest } from "@/components/laboratory/repeat-hematology-types";
import type { ChemistryRepeatTest } from "@/components/laboratory/repeat-chemistry-types";
import type { UrinalysisRepeatTest } from "@/components/laboratory/repeat-urinalysis-types";
import type { FecalysisRepeatTest } from "@/components/laboratory/repeat-fecalysis-types";

/**
 * Patient-identifying header fields carried by the parent Laboratory Report.
 *
 * Repeat-test records store only their own result fields, personnel, and
 * metadata — they don't duplicate the seafarer's identity. The repeat print
 * builders therefore take this header (threaded from the parent report) and
 * merge it with the selected repeat record so the generated PDF still shows who
 * the results belong to.
 */
export interface LaboratoryPrintHeader {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  age?: string;
  gender?: string;
  address?: string;
  position?: string;
  employer?: string;
}

/**
 * Joins the header's name parts into a single display name.
 *
 * @param header - The patient header threaded from the parent report
 * @returns The trimmed "first middle last" name, or an empty string
 */
function headerFullName(header: LaboratoryPrintHeader): string {
  return [header.first_name, header.middle_name, header.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
}

/**
 * Builds the PrintIO payload from the current Laboratory Report form data.
 *
 * Every value is coerced to a string, with `undefined`/`null` collapsed to an
 * empty string. Payload keys mirror the PrintIO Lab-06 template field names
 * exactly.
 *
 * @param data - The current Laboratory Report record
 * @returns The flat PrintIO template payload
 */
export function buildLaboratoryPayload(data: LaboratoryReport): Record<string, string> {
  const fullName = [data.first_name, data.middle_name, data.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    // Patient header
    patient_full_name: fullName,
    age: data.age ?? "",
    gender: data.gender ?? "",
    hematology_result_date: data.hematology_result_date ?? "",
    employer: data.employer ?? "",
    position: data.position ?? "",

    // Hematology
    hemoglobin: data.hemoglobin ?? "",
    hematocrit: data.hematocrit ?? "",
    rbc_count: data.rbc_count ?? "",
    wbc_count: data.wbc_count ?? "",
    platelet: data.platelet ?? "",
    blood_type: data.blood_type ?? "",
    lymphocytes: data.lymphocytes ?? "",
    segmenters: data.segmenters ?? "",
    eosinophils: data.eosinophils ?? "",
    monocytes: data.monocytes ?? "",
    esr: data.esr ?? "",
    stab_cells: data.stab_cells ?? "",
    basophils: data.basophils ?? "",
    myelocytes: data.myelocytes ?? "",
    juveniles: data.juveniles ?? "",

    // Urinalysis — macroscopic / chemical
    urine_color: data.urine_color ?? "",
    urine_transparency: data.urine_transparency ?? "",
    urine_leucocytes: data.urine_leucocytes ?? "",
    urine_nitrite: data.urine_nitrite ?? "",
    urine_urobilinogen: data.urine_urobilinogen ?? "",
    urine_protein: data.urine_protein ?? "",
    urine_ph: data.urine_ph ?? "",
    urine_blood: data.urine_blood ?? "",
    urine_specific_gravity: data.urine_specific_gravity ?? "",
    urine_ketone: data.urine_ketone ?? "",
    urine_bilirubin: data.urine_bilirubin ?? "",
    urine_glucose: data.urine_glucose ?? "",

    // Urinalysis — microscopic
    urine_rbc: data.urine_rbc ?? "",
    urine_wbc: data.urine_wbc ?? "",
    urine_amorphous_urates: data.urine_amorphous_urates ?? "",
    urine_amorphous_phosphate: data.urine_amorphous_phosphate ?? "",
    urine_epithelial_cells: data.urine_epithelial_cells ?? "",
    urine_mucus_threads: data.urine_mucus_threads ?? "",
    urine_microscopic_others: data.urine_microscopic_others ?? "",

    // Urinalysis — crystals
    urine_uric_acid: data.urine_uric_acid ?? "",
    urine_calcium_oxalate: data.urine_calcium_oxalate ?? "",
    urine_crystals_others: data.urine_crystals_others ?? "",

    // Urinalysis — cast
    urine_fine_granular: data.urine_fine_granular ?? "",
    urine_coarse_granular: data.urine_coarse_granular ?? "",
    urine_cast_others: data.urine_cast_others ?? "",

    // Fecalysis
    fecal_color: data.fecal_color ?? "",
    fecal_consistency: data.fecal_consistency ?? "",
    fecal_rbc: data.fecal_rbc ?? "",
    fecal_wbc: data.fecal_wbc ?? "",
    fecal_others: data.fecal_others ?? "",
    fecal_ova_parasite: data.fecal_ova_parasite ?? "",
    fecal_amoeba: data.fecal_amoeba ?? "",
    fecal_occult_blood: data.fecal_occult_blood ?? "",

    // Signatories
    med_tech: data.med_tech ?? "",
    pathologist: data.pathologist ?? "",
    laboratory_no: data.laboratory_no ?? "",
    med_tech_license_no: data.med_tech_license_no ?? "",
    pathologist_license_no: data.pathologist_license_no ?? "",
  };
}

/**
 * Builds the PrintIO payload for the Laboratory Report Lab-08 template.
 *
 * Lab-08 is a full-panel report: it carries the hematology fields of Lab-06
 * plus clinical chemistry (SI normal ranges, conventional values, and the
 * computed SI/conventional results for FBS, BUN, creatinine, cholesterol,
 * triglycerides, uric acid, SGOT, SGPT, ALK. PHOS, and HbA1c) alongside the
 * urinalysis and fecalysis panels.
 *
 * Every value is coerced to a string, with `undefined`/`null` collapsed to an
 * empty string. Payload keys mirror the PrintIO Lab-08 template field names
 * exactly — note the template uses `patient_fullname` (no underscore between
 * "full" and "name"), unlike the Lab-06 `patient_full_name`.
 *
 * @param data - The current Laboratory Report record
 * @returns The flat PrintIO Lab-08 template payload
 */
export function buildLab08Payload(data: LaboratoryReport): Record<string, string> {
  const fullName = [data.first_name, data.middle_name, data.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    // Patient header
    patient_fullname: fullName,
    employer: data.employer ?? "",
    age: data.age ?? "",
    position: data.position ?? "",
    gender: data.gender ?? "",
    hematology_result_date: data.hematology_result_date ?? "",
    laboratory_no: data.laboratory_no ?? "",

    // Hematology
    hemoglobin: data.hemoglobin ?? "",
    hematocrit: data.hematocrit ?? "",
    rbc_count: data.rbc_count ?? "",
    wbc_count: data.wbc_count ?? "",
    platelet: data.platelet ?? "",
    blood_type: data.blood_type ?? "",
    lymphocytes: data.lymphocytes ?? "",
    segmenters: data.segmenters ?? "",
    eosinophils: data.eosinophils ?? "",
    monocytes: data.monocytes ?? "",
    esr: data.esr ?? "",
    stab_cells: data.stab_cells ?? "",
    basophils: data.basophils ?? "",
    myelocytes: data.myelocytes ?? "",
    juveniles: data.juveniles ?? "",

    // Clinical chemistry — SI normal ranges
    fbs_si_normal: data.fbs_si_normal ?? "",
    bun_si_normal: data.bun_si_normal ?? "",
    creatinine_si_normal: data.creatinine_si_normal ?? "",
    cholesterol_si_normal: data.cholesterol_si_normal ?? "",
    triglycerides_si_normal: data.triglycerides_si_normal ?? "",
    uric_acid_si_normal: data.uric_acid_si_normal ?? "",
    sgot_si: data.sgot_si ?? "",
    sgpt_si: data.sgpt_si ?? "",
    alk_phos_si: data.alk_phos_si ?? "",
    hba1c_normal: data.hba1c_normal ?? "",

    // Clinical chemistry — conventional values
    fbs_conv: data.fbs_conv ?? "",
    bun_conv: data.bun_conv ?? "",
    creatinine_conv: data.creatinine_conv ?? "",
    cholesterol_conv: data.cholesterol_conv ?? "",
    triglycerides_conv: data.triglycerides_conv ?? "",
    uric_acid_conv: data.uric_acid_conv ?? "",

    // Clinical chemistry — SI results
    fbs_result_si: data.fbs_result_si ?? "",
    bun_result_si: data.bun_result_si ?? "",
    creatinine_result_si: data.creatinine_result_si ?? "",
    cholesterol_result_si: data.cholesterol_result_si ?? "",
    triglycerides_result_si: data.triglycerides_result_si ?? "",
    uric_acid_result_si: data.uric_acid_result_si ?? "",
    sgot_result_si: data.sgot_result_si ?? "",
    sgpt_result_si: data.sgpt_result_si ?? "",
    alk_phos_result_si: data.alk_phos_result_si ?? "",
    hba1c_result: data.hba1c_result ?? "",

    // Clinical chemistry — conventional results
    fbs_result_conv: data.fbs_result_conv ?? "",
    bun_result_conv: data.bun_result_conv ?? "",
    creatinine_result_conv: data.creatinine_result_conv ?? "",
    cholesterol_result_conv: data.cholesterol_result_conv ?? "",
    triglycerides_result_conv: data.triglycerides_result_conv ?? "",
    uric_acid_result_conv: data.uric_acid_result_conv ?? "",

    // Urinalysis — macroscopic / chemical
    urine_color: data.urine_color ?? "",
    urine_transparency: data.urine_transparency ?? "",
    urine_leucocytes: data.urine_leucocytes ?? "",
    urine_nitrite: data.urine_nitrite ?? "",
    urine_urobilinogen: data.urine_urobilinogen ?? "",
    urine_protein: data.urine_protein ?? "",
    urine_ph: data.urine_ph ?? "",
    urine_blood: data.urine_blood ?? "",
    urine_specific_gravity: data.urine_specific_gravity ?? "",
    urine_ketone: data.urine_ketone ?? "",
    urine_bilirubin: data.urine_bilirubin ?? "",
    urine_glucose: data.urine_glucose ?? "",
    urine_others: data.urine_others ?? "",

    // Urinalysis — microscopic
    urine_rbc: data.urine_rbc ?? "",
    urine_wbc: data.urine_wbc ?? "",
    urine_amorphous_urates: data.urine_amorphous_urates ?? "",
    urine_amorphous_phosphate: data.urine_amorphous_phosphate ?? "",
    urine_epithelial_cells: data.urine_epithelial_cells ?? "",
    urine_mucus_threads: data.urine_mucus_threads ?? "",
    urine_microscopic_others: data.urine_microscopic_others ?? "",

    // Urinalysis — crystals
    urine_uric_acid: data.urine_uric_acid ?? "",
    urine_calcium_oxalate: data.urine_calcium_oxalate ?? "",
    urine_crystals_others: data.urine_crystals_others ?? "",

    // Urinalysis — cast
    urine_fine_granular: data.urine_fine_granular ?? "",
    urine_coarse_granular: data.urine_coarse_granular ?? "",
    urine_cast_others: data.urine_cast_others ?? "",

    // Fecalysis
    fecal_color: data.fecal_color ?? "",
    fecal_consistency: data.fecal_consistency ?? "",
    fecal_rbc: data.fecal_rbc ?? "",
    fecal_wbc: data.fecal_wbc ?? "",
    fecal_others: data.fecal_others ?? "",
    fecal_ova_parasite: data.fecal_ova_parasite ?? "",
    fecal_amoeba: data.fecal_amoeba ?? "",
    fecal_occult_blood: data.fecal_occult_blood ?? "",

    // Signatories
    med_tech: data.med_tech ?? "",
    pathologist: data.pathologist ?? "",
    med_tech_license_no: data.med_tech_license_no ?? "",
    pathologist_license_no: data.pathologist_license_no ?? "",
  };
}

/**
 * Builds the PrintIO payload for the Laboratory Hematology report template.
 *
 * This is a hematology-only report: the CBC/differential-count panel plus the
 * patient header and signatories. Clinical chemistry, urinalysis, and
 * fecalysis are intentionally omitted.
 *
 * Every value is coerced to a string, with `undefined`/`null` collapsed to an
 * empty string. Payload keys mirror the PrintIO Hematology template field
 * names exactly.
 *
 * The `address` is sourced from the linked seafarer profile, which the form
 * hook flattens onto the record's `address` field.
 *
 * @param data - The current Laboratory Report record
 * @returns The flat PrintIO Hematology template payload
 */
export function buildHematologyPayload(data: LaboratoryReport): Record<string, string> {
  const fullName = [data.first_name, data.middle_name, data.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    // Patient header
    patient_fullname: fullName,
    address: data.address ?? "",
    position: data.position ?? "",
    age: data.age ?? "",
    gender: data.gender ?? "",
    hematology_result_date: data.hematology_result_date ?? "",
    employer: data.employer ?? "",

    // Hematology
    hemoglobin: data.hemoglobin ?? "",
    hematocrit: data.hematocrit ?? "",
    rbc_count: data.rbc_count ?? "",
    wbc_count: data.wbc_count ?? "",
    platelet: data.platelet ?? "",
    blood_type: data.blood_type ?? "",

    // Differential count
    lymphocytes: data.lymphocytes ?? "",
    segmenters: data.segmenters ?? "",
    eosinophils: data.eosinophils ?? "",
    monocytes: data.monocytes ?? "",
    myelocytes: data.myelocytes ?? "",
    juveniles: data.juveniles ?? "",
    stab_cells: data.stab_cells ?? "",
    basophils: data.basophils ?? "",
    others_diff: data.others_diff ?? "",

    // Signatories
    med_tech: data.med_tech ?? "",
    pathologist: data.pathologist ?? "",
    med_tech_license_no: data.med_tech_license_no ?? "",
    pathologist_license_no: data.pathologist_license_no ?? "",
    laboratory_no: data.laboratory_no ?? "",
  };
}

/**
 * Builds the PrintIO payload for the Laboratory Chemistry report template.
 *
 * This is a clinical-chemistry-only report: the FBS/BUN/creatinine/cholesterol/
 * triglycerides/uric-acid/SGOT/SGPT/ALK.PHOS/HbA1c panel plus the patient header
 * and signatories. Hematology, urinalysis, and fecalysis are intentionally
 * omitted.
 *
 * Every value is coerced to a string, with `undefined`/`null` collapsed to an
 * empty string. Payload keys mirror the PrintIO Chemistry template field names
 * exactly — note the template uses `patient_fullname` (no underscore between
 * "full" and "name"), and the SGOT SI result maps to the template's `field16`
 * placeholder (it sits between `sgpt_result_si` and `alk_phos_result_si`).
 *
 * The `address` is sourced from the linked seafarer profile, which the form
 * hook flattens onto the record's `address` field.
 *
 * NOTE: the template's `remark` field has no corresponding field on
 * `LaboratoryReport`, so it is sent as an empty string.
 *
 * @param data - The current Laboratory Report record
 * @returns The flat PrintIO Chemistry template payload
 */
export function buildChemistryPayload(data: LaboratoryReport): Record<string, string> {
  const fullName = [data.first_name, data.middle_name, data.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    // Patient header
    patient_fullname: fullName,
    address: data.address ?? "",
    position: data.position ?? "",
    age: data.age ?? "",
    gender: data.gender ?? "",
    chemistry_result_date: data.chemistry_result_date ?? "",
    laboratory_no: data.laboratory_no ?? "",
    employer: data.employer ?? "",

    // Clinical chemistry — SI results
    fbs_result_si: data.fbs_result_si ?? "",
    bun_result_si: data.bun_result_si ?? "",
    creatinine_result_si: data.creatinine_result_si ?? "",
    cholesterol_result_si: data.cholesterol_result_si ?? "",
    triglycerides_result_si: data.triglycerides_result_si ?? "",
    uric_acid_result_si: data.uric_acid_result_si ?? "",
    sgpt_result_si: data.sgpt_result_si ?? "",
    // Template placeholder `field16` carries the SGOT SI result.
    field16: data.sgot_result_si ?? "",
    alk_phos_result_si: data.alk_phos_result_si ?? "",

    // Clinical chemistry — conventional results
    fbs_result_conv: data.fbs_result_conv ?? "",
    bun_result_conv: data.bun_result_conv ?? "",
    creatinine_result_conv: data.creatinine_result_conv ?? "",
    cholesterol_result_conv: data.cholesterol_result_conv ?? "",
    triglycerides_result_conv: data.triglycerides_result_conv ?? "",
    uric_acid_result_conv: data.uric_acid_result_conv ?? "",

    // HbA1c
    hba1c_result: data.hba1c_result ?? "",

    // Signatories
    med_tech: data.med_tech ?? "",
    pathologist: data.pathologist ?? "",
    med_tech_license_no: data.med_tech_license_no ?? "",
    pathologist_license_no: data.pathologist_license_no ?? "",

    // Not captured by the form model — sent empty.
    remark: "",
  };
}

/**
 * Builds the PrintIO payload for the Laboratory Urinalysis report template.
 *
 * This is a urinalysis-only report: the macroscopic/chemical, microscopic,
 * crystals, and cast panels plus the patient header and signatories.
 * Hematology, clinical chemistry, and fecalysis are intentionally omitted.
 *
 * Every value is coerced to a string, with `undefined`/`null` collapsed to an
 * empty string. Payload keys mirror the PrintIO Urinalysis template field
 * names exactly — note the template uses `patient_fullname` (no underscore
 * between "full" and "name").
 *
 * The `address` is sourced from the linked seafarer profile, which the form
 * hook flattens onto the record's `address` field.
 *
 * @param data - The current Laboratory Report record
 * @returns The flat PrintIO Urinalysis template payload
 */
export function buildUrinalysisPayload(data: LaboratoryReport): Record<string, string> {
  const fullName = [data.first_name, data.middle_name, data.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    // Patient header
    patient_fullname: fullName,
    address: data.address ?? "",
    age: data.age ?? "",
    gender: data.gender ?? "",
    position: data.position ?? "",
    employer: data.employer ?? "",
    urinalysis_result_date: data.urinalysis_result_date ?? "",

    // Macroscopic / chemical
    urine_color: data.urine_color ?? "",
    urine_transparency: data.urine_transparency ?? "",
    urine_leucocytes: data.urine_leucocytes ?? "",
    urine_nitrite: data.urine_nitrite ?? "",
    urine_urobilinogen: data.urine_urobilinogen ?? "",
    urine_protein: data.urine_protein ?? "",
    urine_ph: data.urine_ph ?? "",
    urine_blood: data.urine_blood ?? "",
    urine_specific_gravity: data.urine_specific_gravity ?? "",
    urine_ketone: data.urine_ketone ?? "",
    urine_bilirubin: data.urine_bilirubin ?? "",
    urine_glucose: data.urine_glucose ?? "",
    urine_others: data.urine_others ?? "",

    // Microscopic
    urine_rbc: data.urine_rbc ?? "",
    urine_wbc: data.urine_wbc ?? "",
    urine_amorphous_urates: data.urine_amorphous_urates ?? "",
    urine_amorphous_phosphate: data.urine_amorphous_phosphate ?? "",
    urine_epithelial_cells: data.urine_epithelial_cells ?? "",
    urine_mucus_threads: data.urine_mucus_threads ?? "",
    urine_microscopic_others: data.urine_microscopic_others ?? "",

    // Crystals
    urine_uric_acid: data.urine_uric_acid ?? "",
    urine_calcium_oxalate: data.urine_calcium_oxalate ?? "",
    urine_crystals_others: data.urine_crystals_others ?? "",

    // Cast
    urine_fine_granular: data.urine_fine_granular ?? "",
    urine_coarse_granular: data.urine_coarse_granular ?? "",
    urine_cast_others: data.urine_cast_others ?? "",

    // Signatories
    med_tech: data.med_tech ?? "",
    pathologist: data.pathologist ?? "",
    med_tech_license_no: data.med_tech_license_no ?? "",
    pathologist_license_no: data.pathologist_license_no ?? "",
  };
}

/**
 * Builds the PrintIO payload for the Laboratory Fecalysis report template.
 *
 * This is a fecalysis-only report: the stool macroscopic/microscopic panel
 * (color, consistency, RBC, WBC, mucus, ova/parasite, amoeba, occult blood,
 * others) plus the patient header and signatories. Hematology, clinical
 * chemistry, and urinalysis are intentionally omitted.
 *
 * Every value is coerced to a string, with `undefined`/`null` collapsed to an
 * empty string. Payload keys mirror the PrintIO Fecalysis template field names
 * exactly — note the template uses `patient_fullname` (no underscore between
 * "full" and "name") and `lab_no` (not `laboratory_no`, as the other lab
 * templates use).
 *
 * The `address` is sourced from the linked seafarer profile, which the form
 * hook flattens onto the record's `address` field.
 *
 * NOTE: the template's `fecal_mucus` field has no corresponding field on
 * `LaboratoryReport`, so it is sent as an empty string.
 *
 * @param data - The current Laboratory Report record
 * @returns The flat PrintIO Fecalysis template payload
 */
export function buildFecalysisPayload(data: LaboratoryReport): Record<string, string> {
  const fullName = [data.first_name, data.middle_name, data.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    // Patient header
    patient_fullname: fullName,
    address: data.address ?? "",
    age: data.age ?? "",
    gender: data.gender ?? "",
    position: data.position ?? "",
    employer: data.employer ?? "",
    fecalysis_result_date: data.fecalysis_result_date ?? "",

    // Fecalysis panel
    fecal_color: data.fecal_color ?? "",
    fecal_consistency: data.fecal_consistency ?? "",
    fecal_rbc: data.fecal_rbc ?? "",
    fecal_wbc: data.fecal_wbc ?? "",
    // Not captured by the form model — sent empty.
    fecal_mucus: "",
    fecal_ova_parasite: data.fecal_ova_parasite ?? "",
    fecal_amoeba: data.fecal_amoeba ?? "",
    fecal_occult_blood: data.fecal_occult_blood ?? "",
    fecal_others: data.fecal_others ?? "",

    // Signatories
    med_tech: data.med_tech ?? "",
    pathologist: data.pathologist ?? "",
    med_tech_license_no: data.med_tech_license_no ?? "",
    pathologist_license_no: data.pathologist_license_no ?? "",
    lab_no: data.laboratory_no ?? "",
  };
}

/**
 * Builds the PrintIO payload for a Hematology **repeat** test.
 *
 * Uses the same PrintIO Hematology template as {@link buildHematologyPayload},
 * so the payload keys match exactly. Result and differential-count fields come
 * from the selected repeat record; the patient header (name, address, age,
 * gender, position, employer) is threaded in from the parent report via
 * `header`, since repeat records don't store patient identity.
 *
 * The repeat model has no `esr` differential entry, so `others_diff` is the
 * only free-text differential carried through.
 *
 * @param record - The selected Hematology repeat-test record
 * @param header - Patient header from the parent Laboratory Report
 * @returns The flat PrintIO Hematology template payload
 */
export function buildHematologyRepeatPayload(
  record: HematologyRepeatTest,
  header: LaboratoryPrintHeader,
): Record<string, string> {
  return {
    // Patient header (from parent report)
    patient_fullname: headerFullName(header),
    address: header.address ?? "",
    position: header.position ?? "",
    age: header.age ?? "",
    gender: header.gender ?? "",
    employer: header.employer ?? "",
    hematology_result_date: record.result_date ?? "",

    // Hematology
    hemoglobin: record.hemoglobin ?? "",
    hematocrit: record.hematocrit ?? "",
    rbc_count: record.rbc_count ?? "",
    wbc_count: record.wbc_count ?? "",
    platelet: record.platelet ?? "",
    blood_type: record.blood_type ?? "",

    // Differential count
    lymphocytes: record.lymphocytes ?? "",
    segmenters: record.segmenters ?? "",
    eosinophils: record.eosinophils ?? "",
    monocytes: record.monocytes ?? "",
    myelocytes: record.myelocytes ?? "",
    juveniles: record.juveniles ?? "",
    stab_cells: record.stab_cells ?? "",
    basophils: record.basophils ?? "",
    others_diff: record.others_diff ?? "",

    // Signatories
    med_tech: record.med_tech ?? "",
    pathologist: record.pathologist ?? "",
    med_tech_license_no: record.med_tech_license_no ?? "",
    pathologist_license_no: record.pathologist_license_no ?? "",
    laboratory_no: record.laboratory_no ?? "",
  };
}

/**
 * Builds the PrintIO payload for a Clinical Chemistry **repeat** test.
 *
 * Uses the same PrintIO Chemistry template as {@link buildChemistryPayload},
 * including the `field16` placeholder that carries the SGOT SI result and the
 * `remark` field the form model doesn't capture (sent empty). Result fields
 * come from the selected repeat record; the patient header is threaded in from
 * the parent report.
 *
 * @param record - The selected Chemistry repeat-test record
 * @param header - Patient header from the parent Laboratory Report
 * @returns The flat PrintIO Chemistry template payload
 */
export function buildChemistryRepeatPayload(
  record: ChemistryRepeatTest,
  header: LaboratoryPrintHeader,
): Record<string, string> {
  return {
    // Patient header (from parent report)
    patient_fullname: headerFullName(header),
    address: header.address ?? "",
    position: header.position ?? "",
    age: header.age ?? "",
    gender: header.gender ?? "",
    employer: header.employer ?? "",
    chemistry_result_date: record.result_date ?? "",
    laboratory_no: record.laboratory_no ?? "",

    // Clinical chemistry — SI results
    fbs_result_si: record.fbs_result_si ?? "",
    bun_result_si: record.bun_result_si ?? "",
    creatinine_result_si: record.creatinine_result_si ?? "",
    cholesterol_result_si: record.cholesterol_result_si ?? "",
    triglycerides_result_si: record.triglycerides_result_si ?? "",
    uric_acid_result_si: record.uric_acid_result_si ?? "",
    sgpt_result_si: record.sgpt_result_si ?? "",
    // Template placeholder `field16` carries the SGOT SI result.
    field16: record.sgot_result_si ?? "",
    alk_phos_result_si: record.alk_phos_result_si ?? "",

    // Clinical chemistry — conventional results
    fbs_result_conv: record.fbs_result_conv ?? "",
    bun_result_conv: record.bun_result_conv ?? "",
    creatinine_result_conv: record.creatinine_result_conv ?? "",
    cholesterol_result_conv: record.cholesterol_result_conv ?? "",
    triglycerides_result_conv: record.triglycerides_result_conv ?? "",
    uric_acid_result_conv: record.uric_acid_result_conv ?? "",

    // HbA1c
    hba1c_result: record.hba1c_result ?? "",

    // Signatories
    med_tech: record.med_tech ?? "",
    pathologist: record.pathologist ?? "",
    med_tech_license_no: record.med_tech_license_no ?? "",
    pathologist_license_no: record.pathologist_license_no ?? "",

    // Not captured by the repeat model — sent empty.
    remark: record.remarks ?? "",
  };
}

/**
 * Builds the PrintIO payload for a Urinalysis **repeat** test.
 *
 * Uses the same PrintIO Urinalysis template as {@link buildUrinalysisPayload},
 * so the payload keys match exactly. Result fields come from the selected
 * repeat record; the patient header is threaded in from the parent report.
 *
 * @param record - The selected Urinalysis repeat-test record
 * @param header - Patient header from the parent Laboratory Report
 * @returns The flat PrintIO Urinalysis template payload
 */
export function buildUrinalysisRepeatPayload(
  record: UrinalysisRepeatTest,
  header: LaboratoryPrintHeader,
): Record<string, string> {
  return {
    // Patient header (from parent report)
    patient_fullname: headerFullName(header),
    address: header.address ?? "",
    age: header.age ?? "",
    gender: header.gender ?? "",
    position: header.position ?? "",
    employer: header.employer ?? "",
    urinalysis_result_date: record.result_date ?? "",

    // Macroscopic / chemical
    urine_color: record.urine_color ?? "",
    urine_transparency: record.urine_transparency ?? "",
    urine_leucocytes: record.urine_leucocytes ?? "",
    urine_nitrite: record.urine_nitrite ?? "",
    urine_urobilinogen: record.urine_urobilinogen ?? "",
    urine_protein: record.urine_protein ?? "",
    urine_ph: record.urine_ph ?? "",
    urine_blood: record.urine_blood ?? "",
    urine_specific_gravity: record.urine_specific_gravity ?? "",
    urine_ketone: record.urine_ketone ?? "",
    urine_bilirubin: record.urine_bilirubin ?? "",
    urine_glucose: record.urine_glucose ?? "",
    urine_others: record.urine_others ?? "",

    // Microscopic
    urine_rbc: record.urine_rbc ?? "",
    urine_wbc: record.urine_wbc ?? "",
    urine_amorphous_urates: record.urine_amorphous_urates ?? "",
    urine_amorphous_phosphate: record.urine_amorphous_phosphate ?? "",
    urine_epithelial_cells: record.urine_epithelial_cells ?? "",
    urine_mucus_threads: record.urine_mucus_threads ?? "",
    urine_microscopic_others: record.urine_microscopic_others ?? "",

    // Crystals
    urine_uric_acid: record.urine_uric_acid ?? "",
    urine_calcium_oxalate: record.urine_calcium_oxalate ?? "",
    urine_crystals_others: record.urine_crystals_others ?? "",

    // Cast
    urine_fine_granular: record.urine_fine_granular ?? "",
    urine_coarse_granular: record.urine_coarse_granular ?? "",
    urine_cast_others: record.urine_cast_others ?? "",

    // Signatories
    med_tech: record.med_tech ?? "",
    pathologist: record.pathologist ?? "",
    med_tech_license_no: record.med_tech_license_no ?? "",
    pathologist_license_no: record.pathologist_license_no ?? "",
  };
}

/**
 * Builds the PrintIO payload for a Fecalysis **repeat** test.
 *
 * Uses the same PrintIO Fecalysis template as {@link buildFecalysisPayload},
 * including the `lab_no` key (not `laboratory_no`) and the `fecal_mucus` field
 * the form model doesn't capture (sent empty). Result fields come from the
 * selected repeat record; the patient header is threaded in from the parent
 * report.
 *
 * @param record - The selected Fecalysis repeat-test record
 * @param header - Patient header from the parent Laboratory Report
 * @returns The flat PrintIO Fecalysis template payload
 */
export function buildFecalysisRepeatPayload(
  record: FecalysisRepeatTest,
  header: LaboratoryPrintHeader,
): Record<string, string> {
  return {
    // Patient header (from parent report)
    patient_fullname: headerFullName(header),
    address: header.address ?? "",
    age: header.age ?? "",
    gender: header.gender ?? "",
    position: header.position ?? "",
    employer: header.employer ?? "",
    fecalysis_result_date: record.result_date ?? "",

    // Fecalysis panel
    fecal_color: record.fecal_color ?? "",
    fecal_consistency: record.fecal_consistency ?? "",
    fecal_rbc: record.fecal_rbc ?? "",
    fecal_wbc: record.fecal_wbc ?? "",
    // Not captured by the repeat model — sent empty.
    fecal_mucus: "",
    fecal_ova_parasite: record.fecal_ova_parasite ?? "",
    fecal_amoeba: record.fecal_amoeba ?? "",
    fecal_occult_blood: record.fecal_occult_blood ?? "",
    fecal_others: record.fecal_others ?? "",

    // Signatories
    med_tech: record.med_tech ?? "",
    pathologist: record.pathologist ?? "",
    med_tech_license_no: record.med_tech_license_no ?? "",
    pathologist_license_no: record.pathologist_license_no ?? "",
    lab_no: record.laboratory_no ?? "",
  };
}
