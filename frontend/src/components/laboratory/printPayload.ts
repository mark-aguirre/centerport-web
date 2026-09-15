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
