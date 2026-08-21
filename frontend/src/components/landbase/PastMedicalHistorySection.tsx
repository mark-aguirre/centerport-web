"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Stethoscope } from "lucide-react";
import type { LandbaseSectionProps, MedicalConditionValue } from "./types";
import { createFieldUpdater } from "./utils";

interface HistoryCondition {
  key: string;
  label: string;
  detailKey?: string;
}

const COLUMN_1: readonly HistoryCondition[] = [
  { key: "Head or Neck Injury", label: "Head or Neck Injury" },
  { key: "Frequent Headaches", label: "Frequent Headaches" },
  { key: "Frequent Dizziness", label: "Frequent Dizziness" },
  {
    key: "Fainting Spells, Fits, Seizures or other Neurological Disorders",
    label: "Fainting Spells, Fits, Seizures or other Neurological Disorders",
  },
  {
    key: "Insomnia or sleep disorders, Manias, Phobias",
    label: "Insomnia or sleep disorders, Manias, Phobias",
  },
  {
    key: "Depression, other Mental Disorders",
    label: "Depression, other Mental Disorders",
  },
  {
    key: "Trachoma, other eye Disorders",
    label: "Trachoma, other eye Disorders",
  },
  {
    key: "Deafness, other Ear Disorders",
    label: "Deafness, other Ear Disorders",
  },
  { key: "Nose or Throat Disorders", label: "Nose or Throat Disorders" },
  { key: "Tuberculosis", label: "Tuberculosis" },
];

const COLUMN_2: readonly HistoryCondition[] = [
  { key: "Other Lung Disorders", label: "Other lung Disorders" },
  { key: "High Blood Pressure", label: "High Blood Pressure" },
  { key: "Heart Disease/Heart Pain", label: "Heart Disease/Heart Pain" },
  { key: "Rheumatic Fever", label: "Rheumatic Fever" },
  { key: "Diabetes Mellitus", label: "Diabetes Mellitus" },
  {
    key: "Other Endocrine Disorders (e.g. Goiter)",
    label: "Other Endocrine Disorders (e.g. Goiter)",
  },
  { key: "Cancer or Tumor", label: "Cancer or Tumor" },
  { key: "Blood Disorders", label: "Blood Disorders" },
  {
    key: "Stomach Pain, Gastritis or Ulcer",
    label: "Stomach Pain, Gastritis or Ulcer",
  },
  {
    key: "Other Abdominal Disorders",
    label: "Other Abdominal Disorders",
    detailKey: "Other Abdominal Disorders Details",
  },
];

const COLUMN_3: readonly HistoryCondition[] = [
  { key: "Kidney or Bladder Disorder", label: "Kidney or Bladder Disorder" },
  {
    key: "Back Injury: Joint Pain/Arthritis/Rheumatism",
    label: "Back Injury: Joint Pain/Arthritis/Rheumatism",
  },
  {
    key: "Genetic, Hereditary or Familial Disorders",
    label: "Genetic, Hereditary or Familial Disorders",
  },
  {
    key: "Sexually Transmitted Diseases",
    label: "Sexually Transmitted Diseases",
  },
  { key: "Last Menstrual Period", label: "Last Menstrual Period" },
  { key: "Tropical Diseases", label: "Tropical Diseases" },
  { key: "Schistosomiasis", label: "Schistosomiasis" },
  { key: "Asthma", label: "Asthma" },
  {
    key: "Allergies (Specify):",
    label: "Allergies (Specify):",
    detailKey: "Allergies (Specify) Details",
  },
  {
    key: "Gynecological Disorder (For female)",
    label: "Gynecological Disorder (For female)",
  },
  {
    key: "Operations (Specify)",
    label: "Operations (Specify)",
    detailKey: "Operations (Specify) Details",
  },
];

const ALL_CONDITIONS = [...COLUMN_1, ...COLUMN_2, ...COLUMN_3];

interface HistoryRowProps {
  condition: HistoryCondition;
  value: string;
  detailValue?: string;
  disabled?: boolean;
  onChange: (value: MedicalConditionValue) => void;
  onDetailChange?: (value: string) => void;
}

function HistoryRow({
  condition,
  value,
  detailValue,
  disabled,
  onChange,
  onDetailChange,
}: HistoryRowProps) {
  return (
    <>
      <div className="grid min-h-9 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-primary/20 px-2 py-1.5">
        <span className="text-xs leading-tight text-foreground/80">
          {condition.label}
        </span>
        <div
          className="flex shrink-0 items-center gap-3"
          role="radiogroup"
          aria-label={condition.label}
          aria-disabled={disabled}
        >
          {[
            ["yes", "YES"],
            ["no", "NO"],
          ].map(([optionValue, optionLabel]) => (
            <label
              key={optionValue}
              className={cn(
                "flex items-center gap-1.5",
                disabled ? "pointer-events-none" : "cursor-pointer",
              )}
            >
              <input
                type="radio"
                name={`landbase-medical-history-${condition.key}`}
                checked={value === optionValue}
                onChange={() => {
                  if (!disabled) {
                    onChange(optionValue as MedicalConditionValue);
                  }
                }}
                tabIndex={disabled ? -1 : undefined}
                className="h-4 w-4 accent-primary"
                aria-label={`${condition.label} - ${optionLabel}`}
                aria-disabled={disabled}
              />
              <span className="text-xs text-foreground/80">{optionLabel}</span>
            </label>
          ))}
        </div>
      </div>

      {condition.detailKey && onDetailChange && (
        <div className="border-b border-primary/20 px-2 py-1.5">
          <Input
            value={detailValue ?? ""}
            onChange={(event) => onDetailChange(event.target.value)}
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
            className={cn(
              "h-7 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30",
              disabled && "pointer-events-none",
            )}
            aria-label={`${condition.label} details`}
          />
        </div>
      )}
    </>
  );
}

/**
 * Displays the Landbase past-medical-history questionnaire and supplementary
 * consultation information while retaining legacy condition keys for saved records.
 */
export default function PastMedicalHistorySection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const history = data.medical_history ?? {};
  const updateField = createFieldUpdater(data, onChange);

  const updateHistory = (key: string, value: string) => {
    onChange({
      ...data,
      medical_history: { ...history, [key]: value },
    });
  };

  const handleSetNormal = () => {
    const normalHistory = { ...history };

    ALL_CONDITIONS.forEach((condition) => {
      normalHistory[condition.key] = "no";
      if (condition.detailKey) {
        normalHistory[condition.detailKey] = "";
      }
    });

    onChange({
      ...data,
      medical_history: normalHistory,
      medical_history_others: "",
      consulted_doctor: false,
      consulted_doctor_details: "",
      maintenance_medications: "",
    });
  };

  const renderColumn = (conditions: readonly HistoryCondition[]) => (
    <div>
      {conditions.map((condition) => (
        <HistoryRow
          key={condition.key}
          condition={condition}
          value={history[condition.key] ?? ""}
          detailValue={
            condition.detailKey ? history[condition.detailKey] ?? "" : undefined
          }
          disabled={disabled}
          onChange={(value) => updateHistory(condition.key, value)}
          onDetailChange={
            condition.detailKey
              ? (value) => updateHistory(condition.detailKey!, value)
              : undefined
          }
        />
      ))}
    </div>
  );

  return (
    <section>
      <div className="overflow-x-auto rounded-lg border border-primary/20 bg-card shadow-sm">
        <SectionHeader
          title="I. Past Medical History."
          icon={Stethoscope}
          subtitle="Has applicant suffered from or been told he has any of the following? Check the appropriate box."
          action={
            <SetNormalButton onClick={handleSetNormal} readOnly={disabled} />
          }
          className="mb-0 px-2 py-1.5"
        />

        <div className="grid min-w-[960px] grid-cols-3">
          <div className="border-r border-primary/20">
            {renderColumn(COLUMN_1)}
          </div>
          <div className="border-r border-primary/20">
            {renderColumn(COLUMN_2)}
          </div>
          <div>
            {renderColumn(COLUMN_3)}
            <div className="grid min-h-10 grid-cols-[auto_1fr] items-center gap-2 px-2 py-1.5">
              <Label
                htmlFor="pmh-others"
                className="text-xs text-foreground/80"
              >
                Others
              </Label>
              <Input
                id="pmh-others"
                value={data.medical_history_others ?? ""}
                onChange={(event) =>
                  updateField("medical_history_others", event.target.value)
                }
                readOnly={disabled}
                tabIndex={disabled ? -1 : undefined}
                className={cn(
                  "h-7 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30",
                  disabled && "pointer-events-none",
                )}
              />
            </div>
          </div>
        </div>

        <div className="min-w-[960px] border-t border-primary/20">
          <div className="flex items-center gap-2 border-b border-primary/20 px-2 py-1.5">
            <div
              className={cn(
                "flex shrink-0 items-center gap-2",
                disabled && "pointer-events-none",
              )}
            >
              <Checkbox
                id="consulted_doctor"
                checked={!!data.consulted_doctor}
                onCheckedChange={(checked) => {
                  if (!disabled) {
                    updateField("consulted_doctor", !!checked);
                  }
                }}
                tabIndex={disabled ? -1 : undefined}
                aria-disabled={disabled}
              />
              <Label
                htmlFor="consulted_doctor"
                className={cn(
                  "text-xs text-foreground/80",
                  !disabled && "cursor-pointer",
                )}
              >
                Have you consulted any doctor about a disease in the past? Check if Yes.
              </Label>
            </div>
            <Input
              aria-label="Consulted doctor details"
              value={data.consulted_doctor_details ?? ""}
              onChange={(event) =>
                updateField("consulted_doctor_details", event.target.value)
              }
              readOnly={disabled}
              tabIndex={disabled ? -1 : undefined}
              className={cn(
                "h-7 min-w-0 flex-1 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30",
                disabled && "pointer-events-none",
              )}
            />
          </div>

          <div className="flex items-center gap-2 px-2 py-1.5">
            <Label
              htmlFor="pmh-medications"
              className="shrink-0 text-xs text-foreground/80"
            >
              Are you taking maintenance medications? If Yes, specify.
            </Label>
            <Input
              id="pmh-medications"
              value={data.maintenance_medications ?? ""}
              onChange={(event) =>
                updateField("maintenance_medications", event.target.value)
              }
              readOnly={disabled}
              tabIndex={disabled ? -1 : undefined}
              className={cn(
                "h-7 min-w-0 flex-1 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30",
                disabled && "pointer-events-none",
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
