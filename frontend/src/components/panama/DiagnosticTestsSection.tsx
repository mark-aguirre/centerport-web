"use client";

import { Fragment } from "react";
import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import { defaultLabResult, defaultOtherResult } from "./constants";
import type { PanamaCertificate, PanamaSectionProps, LabTestResult, OtherLabTestResult } from "./types";

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

/**
 * Visibly boxed input used inside the bordered "Other test" results table, so
 * each value reads as a distinct input field (a bordered, rounded box inset in
 * the cell), consistent with the Sight and Hearing tables.
 */
const BOXED_CELL_INPUT_CLASS = cn(
  "h-7 w-full min-w-0 bg-white text-xs border border-primary/20 rounded-md px-2",
  "focus:outline-none focus-visible:border-primary dark:bg-input/30"
);

/**
 * Build the "normal" default values for the Diagnostic Tests section
 * (Sections V & VI). Single source of truth shared by the Set Normal button
 * and the auto-apply-on-new-record flow.
 *
 * Every lab test and other test is checked and marked "X" in the Normal
 * column; the free-text "other diagnostic tests" fields are cleared.
 */
export function buildDiagnosticNormalDefaults(): Partial<PanamaCertificate> {
  const normalLabTests: Record<string, LabTestResult> = {};
  LAB_CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      // RH Typing defaults to unchecked + "N/A"; every other test to the
      // usual checked + "X" in the Normal column.
      normalLabTests[item.key] = { ...defaultLabResult(item.key) };
    });
  });

  const normalOtherTests: Record<string, OtherLabTestResult> = {};
  [...OTHER_TESTS_GROUP_1, ...OTHER_TESTS_GROUP_2].forEach((item) => {
    // Per-key defaults: Breast/PAP/PSA -> unchecked + "N/A"; Chest X-ray/EKG ->
    // Observations "NORMAL"; everything else -> checked + "X".
    normalOtherTests[item.key] = { ...defaultOtherResult(item.key) };
  });

  return {
    lab_tests: normalLabTests,
    lab_other_tests: normalOtherTests,
    other_diag_test: "",
    other_diag_result: "",
    other_diag_comments: "",
  };
}

/**
 * Compact text input for a single lab-result cell (Normal, Abnormal, or
 * Observations) inside the diagnostic test tables.
 *
 * Props:
 * - `label` — human-readable test name used to build the cell `aria-label`
 * - `field` — which column this cell represents; appended to the `aria-label`
 * - `onValueChange` — fires with the raw input value on every change
 */
function ResultInput({
  label,
  field,
  value,
  onValueChange,
  disabled,
}: {
  label: string;
  field: "Normal" | "Abnormal" | "Observations" | "Performed date";
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(BOXED_CELL_INPUT_CLASS, disabled && "pointer-events-none")}
      aria-label={`${label} - ${field}`}
      readOnly={disabled}
    />
  );
}

/**
 * Panama Medical Certificate — Diagnostic Test and Results section (Section V)
 * and Other Diagnostic Tests and Results (Section VI).
 *
 * Renders laboratory test tables organized by category (Hematology, Blood,
 * Serology, Urinalysis, Stool, Toxicologic) with Normal/Abnormal/Observations
 * columns, plus an "Other test" section with checkboxes and a section for
 * additional diagnostic tests with practitioner comments.
 *
 * `upToAlcohol` — when true, renders only the lab categories table through
 * (and including) the *Alcohol row. The "Other test" and "VI. Other Diagnostic
 * Tests" blocks are hidden. Used for Tab 6; the rest goes to Tab 7.
 *
 * `otherTestsOnly` — when true, skips the lab categories table entirely and
 * renders only the "Other test" and "VI. Other Diagnostic Tests" blocks.
 * Used for Tab 7 after the lab table has already been shown on Tab 6.
 */
export default function DiagnosticTestsSection({ data, onChange, disabled, upToAlcohol, otherTestsOnly }: PanamaSectionProps & { upToAlcohol?: boolean; otherTestsOnly?: boolean }) {
  const update = createFieldUpdater(data, onChange);

  // When upToAlcohol is true, include all categories but cap the last one's
  // items at (and including) the "alcohol" row.
  const categoriesToRender = upToAlcohol
    ? LAB_CATEGORIES.map((cat) => {
        const alcoholIdx = cat.items.findIndex((i) => i.key === "alcohol");
        if (alcoholIdx === -1) return cat;
        return { ...cat, items: cat.items.slice(0, alcoholIdx + 1) };
      })
    : LAB_CATEGORIES;

  const updateLabTest = (key: string, field: keyof LabTestResult, value: string | boolean) => {
    // Start from the stored result, or the per-key default when none exists
    // yet, so the edit builds on the same values shown in the (defaulted) UI.
    const current = key in data.lab_tests ? data.lab_tests[key] : { ...defaultLabResult(key) };
    const updated = { ...data.lab_tests, [key]: { ...current, [field]: value } };
    onChange({ ...data, lab_tests: updated });
  };

  const updateOtherTest = (key: string, field: keyof OtherLabTestResult, value: string | boolean) => {
    const current = key in data.lab_other_tests ? data.lab_other_tests[key] : { ...defaultOtherResult(key) };
    const updated = { ...data.lab_other_tests, [key]: { ...current, [field]: value } };
    onChange({ ...data, lab_other_tests: updated });
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="v. Diagnostic Test and Results"
        icon={FlaskConical}
        subtitle="at medical discretion"
        titleStyle={{ textTransform: "none" }}
        banner
      />

      {/* Lab table — hidden in otherTestsOnly mode */}
      {!otherTestsOnly && (<>
      {/* Mandatory test note — above the table, as on the official form */}
      <p className="mb-2 text-sm italic text-foreground/80">*Mandatory test</p>

      {/* Laboratory Test — bordered table matching the official layout:
          LABORATORY TEST band, then CATEGORY | checkbox | RESULTS
          (Normal | Abnormal) | Observations, with full-width category bands. */}
      <div className="mb-4 overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-primary/30 bg-primary/12 p-1.5 text-center text-xs font-bold uppercase tracking-wider text-primary" colSpan={5}>
                Laboratory Test
              </th>
            </tr>
            <tr>
              <th className="border border-primary/30 bg-primary/5 p-1.5 text-left text-xs font-bold uppercase tracking-wider text-foreground/80" rowSpan={2}>
                Category
              </th>
              <th className="w-10 border border-primary/30 bg-primary/5 p-1.5" rowSpan={2} />
              <th className="border border-primary/30 bg-primary/5 p-1 text-center text-xs font-bold uppercase tracking-wider text-foreground/80" colSpan={2}>
                Results
              </th>
              <th className="border border-primary/30 bg-primary/5 p-1 text-center text-xs font-bold uppercase tracking-wider text-foreground/80" rowSpan={2}>
                Observations
              </th>
            </tr>
            <tr>
              <th className="w-28 border border-primary/30 bg-primary/5 p-1 text-center text-xs font-bold uppercase text-foreground/80">
                Normal
              </th>
              <th className="w-28 border border-primary/30 bg-primary/5 p-1 text-center text-xs font-bold uppercase text-foreground/80">
                Abnormal
              </th>
            </tr>
          </thead>
          <tbody>
            {categoriesToRender.map((cat) => (
              <Fragment key={cat.category}>
                {/* Category band row — spans the full table width */}
                <tr>
                  <td
                    colSpan={5}
                    className="border border-primary/30 bg-primary/5 px-2 py-1 text-sm font-bold uppercase tracking-wide text-primary"
                  >
                    {cat.category}
                  </td>
                </tr>

                {/* Category item rows */}
                {cat.items.map((item) => {
                  // No stored entry -> default to checked + "X" in Normal
                  // (RH Typing defaults to unchecked + "N/A").
                  const result = item.key in data.lab_tests ? data.lab_tests[item.key] : defaultLabResult(item.key);
                  return (
                    <tr key={item.key}>
                      <td className="border border-primary/30 py-1.5 pl-6 pr-1.5 text-sm text-foreground">
                        {item.label}
                      </td>
                      <td className="border border-primary/30 p-1.5 text-center">
                        <input
                          type="checkbox"
                          checked={result.checked ?? (!!result.normal || !!result.abnormal)}
                          onChange={(e) => updateLabTest(item.key, "checked", e.target.checked)}
                          className={cn("h-4 w-4 rounded accent-primary", disabled && "pointer-events-none")}
                          aria-label={item.label}
                          tabIndex={disabled ? -1 : undefined}
                        />
                      </td>
                      <td className="border border-primary/30 p-1">
                        <ResultInput
                          label={item.label}
                          field="Normal"
                          value={result.normal}
                          onValueChange={(v) => updateLabTest(item.key, "normal", v)}
                          disabled={disabled}
                        />
                      </td>
                      <td className="border border-primary/30 p-1">
                        <ResultInput
                          label={item.label}
                          field="Abnormal"
                          value={result.abnormal}
                          onValueChange={(v) => updateLabTest(item.key, "abnormal", v)}
                          disabled={disabled}
                        />
                      </td>
                      <td className="border border-primary/30 p-1">
                        <ResultInput
                          label={item.label}
                          field="Observations"
                          value={result.observations}
                          onValueChange={(v) => updateLabTest(item.key, "observations", v)}
                          disabled={disabled}
                        />
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      </>)}

      {/* Other Tests section — hidden in upToAlcohol mode */}
      {!upToAlcohol && (<>
      {/* Other Tests section — bordered table matching the official layout:
          Other test | checkbox | RESULTS (Normal | Abnormal) | Observations. */}
      <div className="border-t border-primary/10 pt-3 mb-4 overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-primary/30 bg-primary/5 p-1.5 text-left text-xs font-bold text-foreground/80">
                Other test:
              </th>
              <th className="w-10 border border-primary/30 bg-primary/5 p-1.5" />
              <th className="border border-primary/30 bg-primary/5 p-1.5 text-center text-xs font-bold uppercase tracking-wider text-foreground/80" colSpan={2}>
                Results
              </th>
              <th className="border border-primary/30 bg-primary/5 p-1.5 text-center text-xs font-bold uppercase tracking-wider text-foreground/80" rowSpan={2}>
                Observations
              </th>
            </tr>
            <tr>
              <th className="border border-primary/30 bg-primary/5 p-1.5" />
              <th className="border border-primary/30 bg-primary/5 p-1.5" />
              <th className="w-28 border border-primary/30 bg-primary/5 p-1 text-center text-xs font-bold uppercase text-foreground/80">
                Normal
              </th>
              <th className="w-28 border border-primary/30 bg-primary/5 p-1 text-center text-xs font-bold uppercase text-foreground/80">
                Abnormal
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Group 1: Breast examination & PAP Test */}
            {OTHER_TESTS_GROUP_1.map((item) => {
              const result = item.key in data.lab_other_tests ? data.lab_other_tests[item.key] : defaultOtherResult(item.key);
              return (
                <tr key={item.key}>
                  <td className="border border-primary/30 py-1.5 pl-6 pr-1.5 text-sm text-foreground whitespace-nowrap">
                    {item.label}
                  </td>
                  <td className="border border-primary/30 p-1.5 text-center">
                    <input
                      type="checkbox"
                      checked={result.checked}
                      onChange={(e) => updateOtherTest(item.key, "checked", e.target.checked)}
                      className={cn("h-4 w-4 rounded accent-primary", disabled && "pointer-events-none")}
                      aria-label={item.label}
                      tabIndex={disabled ? -1 : undefined}
                    />
                  </td>
                  <td className="border border-primary/30 p-1">
                    <ResultInput
                      label={item.label}
                      field="Normal"
                      value={result.normal}
                      onValueChange={(v) => updateOtherTest(item.key, "normal", v)}
                      disabled={disabled}
                    />
                  </td>
                  <td className="border border-primary/30 p-1">
                    <ResultInput
                      label={item.label}
                      field="Abnormal"
                      value={result.abnormal}
                      onValueChange={(v) => updateOtherTest(item.key, "abnormal", v)}
                      disabled={disabled}
                    />
                  </td>
                  <td className="border border-primary/30 p-1">
                    <ResultInput
                      label={item.label}
                      field="Observations"
                      value={result.observations}
                      onValueChange={(v) => updateOtherTest(item.key, "observations", v)}
                      disabled={disabled}
                    />
                  </td>
                </tr>
              );
            })}

            {/* Spacer row between the two groups (matches the gap in the form) */}
            <tr aria-hidden="true">
              <td className="border border-primary/30 p-1.5">&nbsp;</td>
              <td className="border border-primary/30 p-1.5" />
              <td className="border border-primary/30 p-1.5" />
              <td className="border border-primary/30 p-1.5" />
              <td className="border border-primary/30 p-1.5" />
            </tr>

            {/* Group 2: PSA, Chest X-ray, EKG — date tests span the results cols */}
            {OTHER_TESTS_GROUP_2.map((item) => {
              const result = item.key in data.lab_other_tests ? data.lab_other_tests[item.key] : defaultOtherResult(item.key);
              return (
                <tr key={item.key}>
                  <td className="border border-primary/30 py-1.5 pl-6 pr-1.5 text-sm text-foreground whitespace-nowrap">
                    {item.label}
                  </td>
                  <td className="border border-primary/30 p-1.5 text-center">
                    <input
                      type="checkbox"
                      checked={result.checked}
                      onChange={(e) => updateOtherTest(item.key, "checked", e.target.checked)}
                      className={cn("h-4 w-4 rounded accent-primary", disabled && "pointer-events-none")}
                      aria-label={item.label}
                      tabIndex={disabled ? -1 : undefined}
                    />
                  </td>
                  {item.hasDate ? (
                    <td className="border border-primary/30 p-1.5" colSpan={2}>
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap text-xs text-foreground/80">
                          Performed (day /month /year):
                        </span>
                        <Input
                          type="date"
                          value={result.performed_date || ""}
                          onChange={(e) => updateOtherTest(item.key, "performed_date", e.target.value)}
                          className={cn(BOXED_CELL_INPUT_CLASS, "flex-1", disabled && "pointer-events-none")}
                          aria-label={`${item.label} - Performed date`}
                          readOnly={disabled}
                          tabIndex={disabled ? -1 : undefined}
                        />
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="border border-primary/30 p-1">
                        <ResultInput
                          label={item.label}
                          field="Normal"
                          value={result.normal}
                          onValueChange={(v) => updateOtherTest(item.key, "normal", v)}
                          disabled={disabled}
                        />
                      </td>
                      <td className="border border-primary/30 p-1">
                        <ResultInput
                          label={item.label}
                          field="Abnormal"
                          value={result.abnormal}
                          onValueChange={(v) => updateOtherTest(item.key, "abnormal", v)}
                          disabled={disabled}
                        />
                      </td>
                    </>
                  )}
                  <td className="border border-primary/30 p-1">
                    <ResultInput
                      label={item.label}
                      field="Observations"
                      value={result.observations}
                      onValueChange={(v) => updateOtherTest(item.key, "observations", v)}
                      disabled={disabled}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* VI. Other Diagnostic Tests and Results */}
      <div className="border-t border-primary/10 pt-4">
        <h3 className="text-sm font-bold text-primary italic tracking-wide mb-3">
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
          <Label className="text-sm font-bold text-foreground/80 uppercase tracking-wider">
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
    </>)}
    </div>
  );
}
