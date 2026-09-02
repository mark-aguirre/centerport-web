"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { FormField } from "@/components/common/form-field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PanamaSectionProps, PanamaCertificate, LabTestResult, OtherLabTestResult } from "./types";

/** Lab test categories with their items */
const LAB_CATEGORIES = [
  {
    category: "HEMATOLOGY",
    items: [{ key: "hemogram", label: "Hemogram" }],
  },
  {
    category: "BLOOD CHEMISTRY",
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
    category: "STOOL ANALYSIS",
    items: [{ key: "stool_transit", label: "*Stool (food handlers)", mandatory: true }],
  },
  {
    category: "TOXICOLOGIC TEST (urine)",
    items: [
      { key: "drug_test", label: "*Drug test (cocaine and Cannabis)", mandatory: true },
      { key: "alcohol", label: "*Alcohol", mandatory: true },
    ],
  },
];

/** Other tests with checkboxes */
const OTHER_TESTS_GROUP_1 = [
  { key: "breast_examination", label: "Breast examination female" },
  { key: "pap_test", label: "PAP Test" },
];

const OTHER_TESTS_GROUP_2 = [
  { key: "psa_men", label: "PSA men (over 40 years)" },
  { key: "chest_xray", label: "Chest X-ray", hasDate: true },
  { key: "ekg", label: "EKG (over 50 years)", hasDate: true },
];

const EMPTY_LAB_RESULT: LabTestResult = { checked: false, normal: "", abnormal: "", observations: "" };
const EMPTY_OTHER_RESULT: OtherLabTestResult = { checked: false, normal: "", abnormal: "", observations: "", performed_date: "" };

/**
 * Panama Medical Certificate — Diagnostic Test and Results section (Section V)
 * and Other Diagnostic Tests and Results (Section VI).
 *
 * Renders laboratory test tables organized by category (Hematology, Blood,
 * Serology, Urinalysis, Stool, Toxicologic) with Normal/Abnormal/Observations
 * columns, plus an "Other test" section with checkboxes and a section for
 * additional diagnostic tests with practitioner comments.
 */
export default function DiagnosticTestsSection({ data, onChange, disabled }: PanamaSectionProps) {
  const update = (field: keyof PanamaCertificate, value: string) =>
    onChange({ ...data, [field]: value });

  const updateLabTest = (key: string, field: keyof LabTestResult, value: string | boolean) => {
    const current = data.lab_tests[key] || { ...EMPTY_LAB_RESULT };
    const updated = { ...data.lab_tests, [key]: { ...current, [field]: value } };
    onChange({ ...data, lab_tests: updated });
  };

  const updateOtherTest = (key: string, field: keyof OtherLabTestResult, value: string | boolean) => {
    const current = data.lab_other_tests[key] || { ...EMPTY_OTHER_RESULT };
    const updated = { ...data.lab_other_tests, [key]: { ...current, [field]: value } };
    onChange({ ...data, lab_other_tests: updated });
  };

  /** Set all lab tests to "normal" and other tests to normal with checked. */
  const handleSetNormal = () => {
    const normalLabTests: Record<string, LabTestResult> = {};
    LAB_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        normalLabTests[item.key] = { checked: true, normal: "X", abnormal: "", observations: "" };
      });
    });

    const normalOtherTests: Record<string, OtherLabTestResult> = {};
    [...OTHER_TESTS_GROUP_1, ...OTHER_TESTS_GROUP_2].forEach((item) => {
      normalOtherTests[item.key] = { checked: true, normal: "X", abnormal: "", observations: "", performed_date: "" };
    });

    onChange({
      ...data,
      lab_tests: normalLabTests,
      lab_other_tests: normalOtherTests,
      other_diag_test: "",
      other_diag_result: "",
      other_diag_comments: "",
    });
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="v. Diagnostic Test and Results"
        icon={FlaskConical}
        subtitle="at medical discretion"
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
        titleStyle={{ textTransform: "none" }}
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
                  <label className={cn("flex items-center gap-2 cursor-pointer pl-10", disabled && "pointer-events-none")}>
                    <input
                      type="checkbox"
                      checked={result.checked ?? (!!result.normal || !!result.abnormal)}
                      onChange={(e) => updateLabTest(item.key, "checked", e.target.checked)}
                      className={cn("w-4 h-4 accent-primary rounded", disabled && "pointer-events-none")}
                      aria-label={item.label}
                      tabIndex={disabled ? -1 : undefined}
                      disabled={disabled}
                    />
                    <span className="text-xs text-foreground/80">{item.label}</span>
                  </label>
                  <Input
                    value={result.normal}
                    onChange={(e) => updateLabTest(item.key, "normal", e.target.value)}
                    className={cn("h-7 text-xs bg-white border-primary/20 dark:bg-input/30", disabled && "pointer-events-none")}
                    aria-label={`${item.label} - Normal`}
                    readOnly={disabled}
                  />
                  <Input
                    value={result.abnormal}
                    onChange={(e) => updateLabTest(item.key, "abnormal", e.target.value)}
                    className={cn("h-7 text-xs bg-white border-primary/20 dark:bg-input/30", disabled && "pointer-events-none")}
                    aria-label={`${item.label} - Abnormal`}
                    readOnly={disabled}
                  />
                  <Input
                    value={result.observations}
                    onChange={(e) => updateLabTest(item.key, "observations", e.target.value)}
                    className={cn("h-7 text-xs bg-white border-primary/20 dark:bg-input/30", disabled && "pointer-events-none")}
                    aria-label={`${item.label} - Observations`}
                    readOnly={disabled}
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
        <h4 className="text-xs font-bold text-foreground/80 mb-2">Other test:</h4>

        {/* Table header */}
        <div className="grid grid-cols-[2fr_0.5fr_1fr_1fr_3fr] gap-1 mb-1 px-1">
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider" />
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider" />
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider text-center">Normal</span>
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider text-center">Anormal</span>
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">Observations</span>
        </div>

        {/* Group 1: Breast examination & PAP Test */}
        {OTHER_TESTS_GROUP_1.map((item) => {
          const result = data.lab_other_tests[item.key] || EMPTY_OTHER_RESULT;
          return (
            <div key={item.key} className="grid grid-cols-[2fr_0.5fr_1fr_1fr_3fr] gap-1 items-center py-1 px-1 border-b border-muted/20">
              <span className="text-xs text-foreground/80 pl-2">{item.label}</span>
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  checked={result.checked}
                  onChange={(e) => updateOtherTest(item.key, "checked", e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                  aria-label={item.label}
                  tabIndex={disabled ? -1 : undefined}
                  disabled={disabled}
                />
              </div>
              <Input
                value={result.normal}
                onChange={(e) => updateOtherTest(item.key, "normal", e.target.value)}
                className={cn("h-7 text-xs bg-white border-primary/20 dark:bg-input/30", disabled && "pointer-events-none")}
                aria-label={`${item.label} - Normal`}
                readOnly={disabled}
              />
              <Input
                value={result.abnormal}
                onChange={(e) => updateOtherTest(item.key, "abnormal", e.target.value)}
                className={cn("h-7 text-xs bg-white border-primary/20 dark:bg-input/30", disabled && "pointer-events-none")}
                aria-label={`${item.label} - Abnormal`}
                readOnly={disabled}
              />
              <Input
                value={result.observations}
                onChange={(e) => updateOtherTest(item.key, "observations", e.target.value)}
                className={cn("h-7 text-xs bg-white border-primary/20 dark:bg-input/30", disabled && "pointer-events-none")}
                aria-label={`${item.label} - Observations`}
                readOnly={disabled}
              />
            </div>
          );
        })}

        {/* Separator between groups */}
        <div className="my-2 border-t border-muted/30" />

        {/* Group 2: PSA, Chest X-ray, EKG — with optional date fields */}
        {OTHER_TESTS_GROUP_2.map((item) => {
          const result = data.lab_other_tests[item.key] || EMPTY_OTHER_RESULT;
          return (
            <div key={item.key} className="grid grid-cols-[2fr_0.5fr_1fr_1fr_3fr] gap-1 items-center py-1 px-1 border-b border-muted/20">
              <span className="text-xs text-foreground/80 pl-2">{item.label}</span>
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  checked={result.checked}
                  onChange={(e) => updateOtherTest(item.key, "checked", e.target.checked)}
                  className={cn("w-4 h-4 accent-primary rounded", disabled && "pointer-events-none")}
                  aria-label={item.label}
                  tabIndex={disabled ? -1 : undefined}
                  disabled={disabled}
                />
              </div>
              {item.hasDate ? (
                <>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-foreground/60 whitespace-nowrap">Performed (dd/mm/yyyy):</span>
                      <Input
                        type="date"
                        value={result.performed_date || ""}
                        onChange={(e) => updateOtherTest(item.key, "performed_date", e.target.value)}
                        className={cn("h-7 text-xs bg-white border-primary/20 dark:bg-input/30 flex-1", disabled && "pointer-events-none")}
                        aria-label={`${item.label} - Performed date`}
                        readOnly={disabled}
                      />
                    </div>
                  </div>
                  <Input
                    value={result.observations}
                    onChange={(e) => updateOtherTest(item.key, "observations", e.target.value)}
                    className={cn("h-7 text-xs bg-white border-primary/20 dark:bg-input/30", disabled && "pointer-events-none")}
                    aria-label={`${item.label} - Observations`}
                    readOnly={disabled}
                  />
                </>
              ) : (
                <>
                  <Input
                    value={result.normal}
                    onChange={(e) => updateOtherTest(item.key, "normal", e.target.value)}
                    className={cn("h-7 text-xs bg-white border-primary/20 dark:bg-input/30", disabled && "pointer-events-none")}
                    aria-label={`${item.label} - Normal`}
                    readOnly={disabled}
                  />
                  <Input
                    value={result.abnormal}
                    onChange={(e) => updateOtherTest(item.key, "abnormal", e.target.value)}
                    className={cn("h-7 text-xs bg-white border-primary/20 dark:bg-input/30", disabled && "pointer-events-none")}
                    aria-label={`${item.label} - Abnormal`}
                    readOnly={disabled}
                  />
                  <Input
                    value={result.observations}
                    onChange={(e) => updateOtherTest(item.key, "observations", e.target.value)}
                    className={cn("h-7 text-xs bg-white border-primary/20 dark:bg-input/30", disabled && "pointer-events-none")}
                    aria-label={`${item.label} - Observations`}
                    readOnly={disabled}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* VI. Other Diagnostic Tests and Results */}
      <div className="border-t border-primary/10 pt-4">
        <h3 className="text-xs font-bold text-primary italic tracking-wide mb-3">
          <span className="lowercase">vi.</span> OTHER DIAGNOSTIC TESTS AND RESULTS:
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <FormField
            label="Test"
            value={data.other_diag_test}
            onChange={(v) => update("other_diag_test", v)}
            disabled={disabled}
          />
          <FormField
            label="Result"
            value={data.other_diag_result}
            onChange={(v) => update("other_diag_result", v)}
            disabled={disabled}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Medical practitioner&apos;s comments and assessment of fitness, with reasons for any limitations:
          </Label>
          <Textarea
            value={data.other_diag_comments}
            onChange={(e) => update("other_diag_comments", e.target.value)}
            className={cn(
              "h-24 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none",
              disabled && "pointer-events-none"
            )}
            placeholder=""
            readOnly={disabled}
          />
        </div>
      </div>
    </div>
  );
}
