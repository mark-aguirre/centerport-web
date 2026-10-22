"use client";

import { useEffect, useRef, useState } from "react";

import { api } from "@/lib/api";
import type { ClinicalChemistry } from "@/components/clinical-chemistry/types";
import type { DefaultValues } from "@/components/default-values/types";
import type { ChemistryReferenceValues } from "@/components/laboratory/ChemistryFormFields";
import type { LaboratoryReport } from "@/components/laboratory/types";

/**
 * The hematology reference fields shared by the Laboratory Report and the
 * Hematology Repeat Test (identical field names on both models).
 */
export type HematologyReferenceDefaults = Pick<
  LaboratoryReport,
  | "hemoglobin_normal_min"
  | "hemoglobin_normal_max"
  | "hematocrit_normal_min"
  | "hematocrit_normal_max"
  | "rbc_count_normal_min"
  | "rbc_count_normal_max"
  | "wbc_count_normal_min"
  | "wbc_count_normal_max"
  | "platelet_normal_min"
  | "platelet_normal_max"
  | "esr_normal_male"
  | "esr_normal_female"
  | "lymphocytes_normal_min"
  | "lymphocytes_normal_max"
  | "stab_cells_normal_min"
  | "stab_cells_normal_max"
>;

/**
 * Resolved laboratory reference ("Normal Values" / "Reference Range") defaults,
 * split by section so each consumer applies the part its model needs:
 *   - `hematology` — flat `_normal_min`/`_normal_max` + ESR fields, merged into
 *     the report's / repeat's `data`.
 *   - `chemistry` — per-row range strings used as the `reference` prop of
 *     {@link ChemistryFormFields} (the chemistry repeat model has no reference
 *     fields of its own).
 *   - `report` — both sets combined, for seeding a Laboratory Report record.
 */
export interface LaboratoryReferenceDefaults {
  hematology: Partial<HematologyReferenceDefaults>;
  chemistry: Partial<ChemistryReferenceValues>;
  report: Partial<LaboratoryReport>;
}

const EMPTY_DEFAULTS: LaboratoryReferenceDefaults = {
  hematology: {},
  chemistry: {},
  report: {},
};

/**
 * Loads the configured laboratory reference default sets and exposes them for
 * the Laboratory Report form and the Repeat Hematology / Repeat Chemistry
 * dialogs to display at all times.
 *
 * Two sources back the reference values:
 *   - Hematology  → `hematology_default_values`  (`api.entities.DefaultValues`)
 *   - Clinical chemistry → `clinical_chemistry_default_values`
 *     (`api.entities.ClinicalChemistry`)
 *
 * Only the latest record of each set is used (the pages are single-record
 * settings forms). The resolved values are stored in a ref — so the synchronous
 * `getNewRecordDefaults()` callback in `useEntityForm` can read the freshest
 * value at click time — and in state, so consumers can re-apply them once the
 * async fetch resolves.
 *
 * The hook is resilient: a failed fetch (nothing configured yet) simply yields
 * empty defaults so the forms still work with blank reference fields.
 */
export function useLaboratoryReferenceDefaults() {
  const defaultsRef = useRef<LaboratoryReferenceDefaults>(EMPTY_DEFAULTS);
  const [defaults, setDefaults] =
    useState<LaboratoryReferenceDefaults>(EMPTY_DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [hematology, chemistry] = await Promise.all([
        api.entities.DefaultValues.list("-updated_date", 1).catch(
          () => [] as DefaultValues[]
        ),
        api.entities.ClinicalChemistry.list("-updated_date", 1).catch(
          () => [] as ClinicalChemistry[]
        ),
      ]);
      if (cancelled) return;

      const hema = mapHematologyDefaults(hematology[0]);
      const chem = mapChemistryDefaults(chemistry[0]);
      const resolved: LaboratoryReferenceDefaults = {
        hematology: hema,
        chemistry: chem,
        report: { ...hema, ...chemistryToReportFields(chem) },
      };
      defaultsRef.current = resolved;
      setDefaults(resolved);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { defaultsRef, defaults };
}

/**
 * Splits a range string such as `"11-17"` or `"4,000-12,000"` into its minimum
 * and maximum halves on the separating hyphen.
 *
 * Numbers may contain grouping commas, so the split targets the hyphen that
 * sits between the two values rather than a hyphen inside a number. The first
 * hyphen after the leading character is treated as the separator.
 *
 * Returns `[whole, ""]` when there is no separating hyphen, so a single value
 * still lands in the `min` field.
 */
function splitRange(raw: string | undefined | null): [string, string] {
  const value = (raw ?? "").trim();
  if (!value) return ["", ""];

  const separator = value.indexOf("-", 1);
  if (separator === -1) return [value, ""];

  const min = value.slice(0, separator).trim();
  const max = value.slice(separator + 1).trim();
  return [min, max];
}

/** Maps a hematology default-values record onto the shared reference fields. */
function mapHematologyDefaults(
  source: DefaultValues | undefined
): Partial<HematologyReferenceDefaults> {
  if (!source) return {};

  const [hemoglobinMin, hemoglobinMax] = splitRange(source.hemoglobin);
  const [hematocritMin, hematocritMax] = splitRange(source.hematocrit);
  const [rbcMin, rbcMax] = splitRange(source.rbc_count);
  const [wbcMin, wbcMax] = splitRange(source.wbc_count);
  const [plateletMin, plateletMax] = splitRange(source.platelet);
  const [lymphocytesMin, lymphocytesMax] = splitRange(source.lymphocytes);
  const [stabMin, stabMax] = splitRange(source.stab_cells);

  return {
    hemoglobin_normal_min: hemoglobinMin,
    hemoglobin_normal_max: hemoglobinMax,
    hematocrit_normal_min: hematocritMin,
    hematocrit_normal_max: hematocritMax,
    rbc_count_normal_min: rbcMin,
    rbc_count_normal_max: rbcMax,
    wbc_count_normal_min: wbcMin,
    wbc_count_normal_max: wbcMax,
    platelet_normal_min: plateletMin,
    platelet_normal_max: plateletMax,
    esr_normal_male: (source.esr_male ?? "").trim(),
    esr_normal_female: (source.esr_female ?? "").trim(),
    lymphocytes_normal_min: lymphocytesMin,
    lymphocytes_normal_max: lymphocytesMax,
    stab_cells_normal_min: stabMin,
    stab_cells_normal_max: stabMax,
  };
}

/**
 * Maps a clinical-chemistry default-values record onto the per-row reference
 * range strings used by the "Reference Range" columns.
 */
function mapChemistryDefaults(
  source: ClinicalChemistry | undefined
): Partial<ChemistryReferenceValues> {
  if (!source) return {};

  const clean = (value: string | undefined | null) => (value ?? "").trim();

  return {
    fbs_si: clean(source.fbs_si),
    fbs_conv: clean(source.fbs_conv),
    bun_si: clean(source.bun_si),
    bun_conv: clean(source.bun_conv),
    creatinine_si: clean(source.creatinine_si),
    creatinine_conv: clean(source.creatinine_conv),
    cholesterol_si: clean(source.cholesterol_si),
    cholesterol_conv: clean(source.cholesterol_conv),
    triglycerides_si: clean(source.triglycerides_si),
    triglycerides_conv: clean(source.triglycerides_conv),
    uric_acid_si: clean(source.uric_acid_si),
    uric_acid_conv: clean(source.uric_acid_conv),
    sgot_si: clean(source.sgot_si),
    sgpt_si: clean(source.sgpt_si),
    alk_phos_si: clean(source.alk_phos_si),
  };
}

/**
 * The chemistry reference field names are identical on the Laboratory Report
 * model, so the chemistry map doubles as a report field patch.
 */
function chemistryToReportFields(
  chemistry: Partial<ChemistryReferenceValues>
): Partial<LaboratoryReport> {
  return chemistry as Partial<LaboratoryReport>;
}
