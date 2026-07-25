"use client";

import { SectionHeader } from "@/components/common/section-header";
import { TestTube2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MedicalExam, MedicalSectionProps } from "./types";

/** Lab test row definitions for DRY rendering */
const LAB_TESTS: { field: keyof MedicalExam; remarksField: keyof MedicalExam; label: string }[] = [
  { field: "cbc_result", remarksField: "cbc_remarks", label: "Complete Blood Count (CBC)" },
  { field: "urinalysis_result", remarksField: "urinalysis_remarks", label: "Urinalysis" },
  { field: "blood_chemistry_result", remarksField: "blood_chemistry_remarks", label: "Blood Chemistry" },
  { field: "chest_xray_result", remarksField: "chest_xray_remarks", label: "Chest X-ray" },
  { field: "ecg_result", remarksField: "ecg_remarks", label: "ECG / EKG" },
  { field: "drug_test_result", remarksField: "drug_test_remarks", label: "Drug Test" },
  { field: "hepatitis_b_result", remarksField: "hepatitis_b_remarks", label: "Hepatitis B (HBsAg)" },
  { field: "hiv_result", remarksField: "hiv_remarks", label: "HIV Screening" },
];

const STATUS_OPTIONS = [
  { label: "Normal", value: "normal" },
  { label: "With Findings", value: "with_findings" },
  { label: "Pending", value: "pending" },
];

/**
 * Laboratory Results section for the Medical Examination form.
 *
 * Displays a table-style layout of lab tests with Normal/With Findings/Pending
 * radio options and a remarks field for each test, plus an additional labs textarea.
 */
export default function LaboratoryResultsSection({
  data,
  onChange,
}: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader
        title="Laboratory Results"
        icon={TestTube2}
        subtitle="Indicate result status for each test"
      />

      {/* Column headers */}
      <div className="flex items-center py-1 mb-1 border-b border-primary/20">
        <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider w-44 shrink-0">
          Test
        </span>
        <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider w-52 shrink-0 text-center">
          Result
        </span>
        <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider flex-1">
          Remarks / Findings
        </span>
      </div>

      {/* Lab test rows */}
      <div className="space-y-0">
        {LAB_TESTS.map((test) => (
          <div
            key={test.field}
            className="flex items-center py-1.5 border-b border-muted/30 last:border-0"
          >
            <span className="text-xs font-semibold text-foreground/80 w-44 shrink-0">
              {test.label}
            </span>
            <div
              className="w-52 shrink-0 flex items-center justify-center gap-3"
              role="radiogroup"
              aria-label={`${test.label} result`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name={test.field}
                    checked={(data[test.field] as string) === opt.value}
                    onChange={() => update(test.field, opt.value)}
                    className="w-4 h-4 accent-primary"
                    aria-label={`${test.label} - ${opt.label}`}
                  />
                  <span className="text-xs text-foreground/70">{opt.label}</span>
                </label>
              ))}
            </div>
            <Input
              value={(data[test.remarksField] as string) || ""}
              onChange={(e) => update(test.remarksField, e.target.value)}
              className="h-7 text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30 flex-1"
              placeholder="Specify findings..."
            />
          </div>
        ))}
      </div>

      {/* Additional Labs */}
      <div className="mt-3 pt-2 border-t border-primary/10 space-y-0.5">
        <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
          Additional Laboratory Tests (Specify)
        </Label>
        <Textarea
          value={data.additional_labs}
          onChange={(e) => update("additional_labs", e.target.value)}
          className="h-16 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
          placeholder="e.g. Lipid Profile, Liver Function Test, Fasting Blood Sugar..."
        />
      </div>
    </div>
  );
}
