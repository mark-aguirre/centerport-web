"use client";

import { SetNormalButton } from "@/components/common/set-normal-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RADIO_OPTION_LABEL_CLASS } from "@/lib/form-styles";
import type { MedicalSectionProps } from "./types";

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
  {
    key: "Kidney or Bladder Disorder",
    label: "Kidney or Bladder Disorder",
  },
  {
    key: "Back Injury: Joint Pain/Arthritis/Rheumatism",
    label: "Back Injury: Joint Pain/Arthritis/Rheumatism",
  },
  {
    key: "Genetic, Hereditary or Familial Disorders",
    label: "Genetic, Hereditary or familial Disorders",
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

interface HistoryRowProps {
  condition: HistoryCondition;
  value: string;
  detailValue?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
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
      <div className="grid min-h-8 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-primary/20 px-2 py-1">
        <span className="text-[11px] leading-tight text-foreground/80">
          {condition.label}
        </span>
        <div
          className="flex shrink-0 items-center gap-2"
          role="radiogroup"
          aria-label={condition.label}
        >
          {[
            ["yes", "YES"],
            ["no", "NO"],
          ].map(([optionValue, optionLabel]) => (
            <label
              key={optionValue}
              className={cn(RADIO_OPTION_LABEL_CLASS, "gap-1")}
            >
              <input
                type="radio"
                name={`medical-history-${condition.key}`}
                checked={value === optionValue}
                onChange={() => onChange(optionValue)}
                tabIndex={disabled ? -1 : undefined}
                className="h-4 w-4 accent-primary"
                aria-label={`${condition.label} - ${optionLabel}`}
              />
              <span className="text-[11px] text-foreground/80">
                {optionLabel}
              </span>
            </label>
          ))}
        </div>
      </div>

      {condition.detailKey && onDetailChange && (
        <div className="border-b border-primary/20 px-2 py-1">
          <Input
            value={detailValue ?? ""}
            onChange={(event) => onDetailChange(event.target.value)}
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
            className="h-7 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30"
            aria-label={`${condition.label} details`}
          />
        </div>
      )}
    </>
  );
}

/**
 * Past Medical History section matching the Seabase examination form.
 *
 * Legacy condition keys remain unchanged for compatibility with saved records;
 * only their display labels and table layout follow the paper form.
 */
export function PastMedicalHistoryGrid({
  data,
  onChange,
  disabled,
}: MedicalSectionProps) {
  const history = data.medical_history ?? {};

  const updateHistory = (key: string, value: string) => {
    onChange({
      ...data,
      medical_history: { ...history, [key]: value },
    });
  };

  const handleSetNormal = () => {
    const normalHistory = { ...history };

    [...COLUMN_1, ...COLUMN_2, ...COLUMN_3].forEach((condition) => {
      normalHistory[condition.key] = "no";
      if (condition.detailKey) {
        normalHistory[condition.detailKey] = "";
      }
    });

    onChange({
      ...data,
      medical_history: normalHistory,
      medical_history_others: "",
      consulted_doctor_past: "no",
      maintenance_medications: "",
    });
  };

  const renderRow = (condition: HistoryCondition) => (
    <HistoryRow
      key={condition.key}
      condition={condition}
      value={history[condition.key] ?? ""}
      detailValue={
        condition.detailKey ? history[condition.detailKey] ?? "" : undefined
      }
      onChange={(value) => updateHistory(condition.key, value)}
      onDetailChange={
        condition.detailKey
          ? (value) => updateHistory(condition.detailKey!, value)
          : undefined
      }
      disabled={disabled}
    />
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm",
        disabled && "pointer-events-none",
      )}
    >
      <div className="flex flex-col gap-2 border-b border-primary/20 px-2 py-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline">
          <h2 className="shrink-0 text-sm font-bold uppercase tracking-wide text-primary">
            I. Past Medical History.
          </h2>
          <p className="text-xs text-foreground/80">
            Has applicant suffered from or been told he has any of the following?
            Check the appropriate box.
          </p>
        </div>
        <SetNormalButton onClick={handleSetNormal} disabled={disabled} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:divide-x md:divide-primary/20">
        <section aria-label="Past medical history column one">
          {COLUMN_1.map(renderRow)}
        </section>
        <section aria-label="Past medical history column two">
          {COLUMN_2.map(renderRow)}
        </section>
        <section aria-label="Past medical history column three">
          {COLUMN_3.map(renderRow)}
          <div className="grid min-h-9 grid-cols-[minmax(0,auto)_1fr] items-center gap-2 border-b border-primary/20 px-2 py-1">
            <label
              htmlFor="medical-history-others"
              className="text-[11px] text-foreground/80"
            >
              Others
            </label>
            <Input
              id="medical-history-others"
              value={data.medical_history_others ?? ""}
              onChange={(event) =>
                onChange({
                  ...data,
                  medical_history_others: event.target.value,
                })
              }
              readOnly={disabled}
              tabIndex={disabled ? -1 : undefined}
              className="h-7 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
