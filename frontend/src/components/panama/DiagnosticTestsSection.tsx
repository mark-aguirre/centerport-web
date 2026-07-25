"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FlaskConical } from "lucide-react";
import type { PanamaSectionProps, PanamaCertificate, LabTestResult, OtherLabTestResult } from "./types";

/** Lab test categories with their items */
const LAB_CATEGORIES = [
  {
    category: "HEMATOLOGY",
    items: [{ key: "hemogram", label: "Hemogram" }],
  },
  {
    category: "BLOOD",
    items: [
      { key: "lipid_profile", label: "Lipid Profile" },
      { key: "creatinine", label: "Creatinine" },
      { key: "cholesterol", label: "Cholesterol" },
      { key: "triglycerides", label: "Triglycerides" },
      { key: "glucose_fasting", label: "*Glucose (Fasting)", mandatory: true },
      { key: "urea_nitrogen", label: "Urea Nitrogen" },
      { key: "rh_typing", label: "RH Typing" },
    ],
  },
  {
    category: "SEROLOGY",
    items: [
      { key: "hiv", label: "HIV" },
      { key: "vdrl", label: "VDRL" },
      { key: "gch_pregnant", label: "GCH (Pregnant)" },
    ],
  },
  {
    category: "URINALYSIS",
    items: [{ key: "general_urin", label: "*General urin", mandatory: true }],
  },
  {
    category: "STOOL",
    items: [{ key: "stool_transit", label: "*Stool (transit parasitosis)", mandatory: true }],
  },
  {
    category: "TOXICOLOGIC",
    items: [
      { key: "drug_test", label: "*Drug test", mandatory: true },
      { key: "alcohol", label: "*Alcohol", mandatory: true },
    ],
  },
];

/** Other tests with checkboxes */
const OTHER_TESTS = [
  { key: "breast_examination", label: "Breast examination / female" },
  { key: "pap_test", label: "PAP Test" },
  { key: "psa_men", label: "PSA men (over 50)" },
  { key: "chest_xray", label: "Chest X ray" },
  { key: "ekg", label: "EKG (over 50)" },
];

const EMPTY_LAB_RESULT: LabTestResult = { normal: "", abnormal: "", observations: "" };
const EMPTY_OTHER_RESULT: OtherLabTestResult = { checked: false, normal: "", abnormal: "", observations: "" };

/**
 * Panama Medical Certificate — Diagnostic Test and Results section (Section V)
 * and Other Diagnostic Tests and Results (Section VI).
 *
 * Renders laboratory test tables organized by category (Hematology, Blood,
 * Serology, Urinalysis, Stool, Toxicologic) with Normal/Abnormal/Observations
 * columns, plus an "Other test" section with checkboxes and a section for
 * additional diagnostic tests with practitioner comments.
 */
export default function DiagnosticTestsSection({ data, onChange }: PanamaSectionProps) {
  const update = (field: keyof PanamaCertificate, value: string) =>
    onChange({ ...data, [field]: value });

  const updateLabTest = (key: string, field: keyof LabTestResult, value: string) => {
    const current = data.lab_tests[key] || { ...EMPTY_LAB_RESULT };
    const updated = { ...data.lab_tests, [key]: { ...current, [field]: value } };
    onChange({ ...data, lab_tests: updated });
  };

  const updateOtherTest = (key: string, field: keyof OtherLabTestResult, value: string | boolean) => {
    const current = data.lab_other_tests[key] || { ...EMPTY_OTHER_RESULT };
    const updated = { ...data.lab_other_tests, [key]: { ...current, [field]: value } };
    onChange({ ...data, lab_other_tests: updated });
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="Diagnostic Test and Results"
        icon={FlaskConical}
        subtitle="at medical discretion"
      />

      {/* Laboratory Test heading */}
      <h3 className="text-xs font-bold text-primary uppercase tracking-widest text-center mb-3">
        Laboratory Test
      </h3>

      {/* Table header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_3fr] gap-1 mb-1 px-1">
        <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">Category</span>
        <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider text-center">Normal</span>
        <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider text-center">Abnormal</span>
        <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">Observations</span>
      </div>

      {/* Lab categories */}
      <div className="space-y-3 mb-4">
        {LAB_CATEGORIES.map((cat) => (
          <div key={cat.category}>
            {/* Category header */}
            <div className="bg-primary/5 px-2 py-1 rounded mb-1">
              <span className="text-xs font-bold text-primary uppercase tracking-wide">
                {cat.category}
              </span>
            </div>

            {/* Category items */}
            {cat.items.map((item) => {
              const result = data.lab_tests[item.key] || EMPTY_LAB_RESULT;
              return (
                <div key={item.key} className="grid grid-cols-[2fr_1fr_1fr_3fr] gap-1 items-center py-1 px-1 border-b border-muted/20">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!result.normal || !!result.abnormal}
                      readOnly
                      className="w-4 h-4 accent-primary rounded"
                      aria-label={item.label}
                    />
                    <span className="text-xs text-foreground/80">{item.label}</span>
                  </label>
                  <Input
                    value={result.normal}
                    onChange={(e) => updateLabTest(item.key, "normal", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label={`${item.label} - Normal`}
                  />
                  <Input
                    value={result.abnormal}
                    onChange={(e) => updateLabTest(item.key, "abnormal", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label={`${item.label} - Abnormal`}
                  />
                  <Input
                    value={result.observations}
                    onChange={(e) => updateLabTest(item.key, "observations", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label={`${item.label} - Observations`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mandatory test note */}
      <p className="text-xs text-foreground/70 italic mb-4">*Mandatory test</p>

      {/* Other Tests section */}
      <div className="border-t border-primary/10 pt-3 mb-4">
        <h4 className="text-xs font-bold text-foreground/80 mb-2">Other test</h4>

        {/* Other tests header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_3fr] gap-1 mb-1 px-1">
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider" />
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider text-center">Normal</span>
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider text-center">Abnormal</span>
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">Observations</span>
        </div>

        {OTHER_TESTS.map((item) => {
          const result = data.lab_other_tests[item.key] || EMPTY_OTHER_RESULT;
          return (
            <div key={item.key} className="grid grid-cols-[2fr_1fr_1fr_3fr] gap-1 items-center py-1 px-1 border-b border-muted/20">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={result.checked}
                  onChange={(e) => updateOtherTest(item.key, "checked", e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                  aria-label={item.label}
                />
                <span className="text-xs text-foreground/80">{item.label}</span>
              </label>
              <Input
                value={result.normal}
                onChange={(e) => updateOtherTest(item.key, "normal", e.target.value)}
                className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                aria-label={`${item.label} - Normal`}
              />
              <Input
                value={result.abnormal}
                onChange={(e) => updateOtherTest(item.key, "abnormal", e.target.value)}
                className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                aria-label={`${item.label} - Abnormal`}
              />
              <Input
                value={result.observations}
                onChange={(e) => updateOtherTest(item.key, "observations", e.target.value)}
                className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                aria-label={`${item.label} - Observations`}
              />
            </div>
          );
        })}
      </div>

      {/* VI. Other Diagnostic Tests and Results */}
      <div className="border-t border-primary/10 pt-4">
        <h3 className="text-xs font-bold text-primary italic uppercase tracking-wide mb-3">
          Other Diagnostic Tests and Results
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <FormField
            label="Test"
            value={data.other_diag_test}
            onChange={(v) => update("other_diag_test", v)}
          />
          <FormField
            label="Result"
            value={data.other_diag_result}
            onChange={(v) => update("other_diag_result", v)}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Medical practitioner&apos;s comments and assessment of fitness, with reasons for any limitations:
          </Label>
          <Textarea
            value={data.other_diag_comments}
            onChange={(e) => update("other_diag_comments", e.target.value)}
            className="h-24 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
}
