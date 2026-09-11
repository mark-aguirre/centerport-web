"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { FormField } from "@/components/common/form-field";
import {
  MedicalPersonnelDialog,
  type MedicalPersonnel,
} from "@/components/common/medical-personnel-dialog";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RADIO_OPTION_LABEL_CLASS } from "@/lib/form-styles";
import { createFieldUpdater } from "./utils";
import type { MedicalSectionProps } from "./types";

interface FitnessChoiceProps {
  label: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function FitnessChoice({
  label,
  name,
  value,
  disabled,
  onChange,
}: FitnessChoiceProps) {
  return (
    <div
      className="grid grid-cols-[145px_1fr] items-center gap-3"
      role="radiogroup"
      aria-label={label}
    >
      <span className="text-xs font-bold uppercase text-foreground/80">
        {label}:
      </span>
      <div className="flex items-center gap-8">
        {[
          ["fit", "FIT"],
          ["unfit", "UNFIT"],
        ].map(([optionValue, optionLabel]) => (
          <label key={optionValue} className={RADIO_OPTION_LABEL_CLASS}>
            <input
              type="radio"
              name={name}
              checked={value === optionValue}
              onChange={() => onChange(optionValue)}
              tabIndex={disabled ? -1 : undefined}
              className="h-4 w-4 accent-primary"
              aria-label={`${label} - ${optionLabel}`}
            />
            <span className="text-xs text-foreground/80">{optionLabel}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * Fitness assessment, visual aids, dates, and certification details section.
 *
 * Personnel fields retain searchable database selection while following the
 * compact layout of the Seabase medical examination form.
 */
export function FitnessAssessmentSection({
  data,
  onChange,
  disabled,
}: MedicalSectionProps) {
  const [physicianDialogOpen, setPhysicianDialogOpen] = useState(false);
  const [directorDialogOpen, setDirectorDialogOpen] = useState(false);

  const update = createFieldUpdater(data, onChange);

  /**
   * Add two years to an ISO date string (`yyyy-mm-dd`).
   *
   * Returns an empty string when the input is empty or unparseable so the
   * derived "Valid until" clears alongside an empty "Date of Fitness".
   */
  const addTwoYears = (isoDate: string): string => {
    if (!isoDate) return "";
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return "";
    parsed.setFullYear(parsed.getFullYear() + 2);
    return parsed.toISOString().slice(0, 10);
  };

  /**
   * Set Date of Fitness and derive Valid until as exactly two years later.
   * Both fields update together so the certificate validity stays in sync.
   */
  const handleDateOfFitnessChange = (value: string) => {
    onChange({
      ...data,
      date_of_fitness: value,
      valid_until: addTwoYears(value),
    });
  };

  const selectPhysician = (personnel: MedicalPersonnel) => {
    onChange({
      ...data,
      authorized_physician: personnel.name,
      medical_certification_no: personnel.license_no,
    });
  };

  const selectDirector = (personnel: MedicalPersonnel) => {
    update("medical_director", personnel.name);
  };

  const handleSetNormal = () => {
    onChange({
      ...data,
      fitness_deck_services: "fit",
      fitness_engine_services: "fit",
      fitness_catering_services: "fit",
      fitness_other_services: "fit",
      visual_aids_required: "no",
    });
  };

  const personnelInputClasses =
    "h-8 min-w-0 flex-1 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm",
        disabled && "pointer-events-none",
      )}
    >
      <div className="border-b border-primary/20 px-3 py-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-bold text-primary">
            Assessments of Fitness for service at Sea.
          </h2>
          <SetNormalButton onClick={handleSetNormal} disabled={disabled} />
        </div>
        <p className="mt-1 text-xs text-foreground/80">
          On the basis of the examinee&apos;s personal declaration, my clinical
          examination and the diagnostic test result recorded above, I declare
          the examinee medically:
        </p>

        <div className="mt-3 grid grid-cols-1 gap-x-12 gap-y-3 px-3 md:grid-cols-2">
          <FitnessChoice
            label="Deck Services"
            name="fitness-deck-services"
            value={data.fitness_deck_services}
            onChange={(value) => update("fitness_deck_services", value)}
            disabled={disabled}
          />
          <FitnessChoice
            label="Catering Services"
            name="fitness-catering-services"
            value={data.fitness_catering_services}
            onChange={(value) => update("fitness_catering_services", value)}
            disabled={disabled}
          />
          <FitnessChoice
            label="Engine Services"
            name="fitness-engine-services"
            value={data.fitness_engine_services}
            onChange={(value) => update("fitness_engine_services", value)}
            disabled={disabled}
          />
          <FitnessChoice
            label="Other Services"
            name="fitness-other-services"
            value={data.fitness_other_services}
            onChange={(value) => update("fitness_other_services", value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-6 border-b border-primary/20 px-3 py-2"
        role="radiogroup"
        aria-label="Visual aids required"
      >
        <span className="text-xs font-semibold text-foreground/80">
          Visual Aids Required:
        </span>
        {[
          ["yes", "YES"],
          ["no", "NO"],
        ].map(([value, label]) => (
          <label key={value} className={RADIO_OPTION_LABEL_CLASS}>
            <input
              type="radio"
              name="visual-aids-required"
              checked={data.visual_aids_required === value}
              onChange={() => update("visual_aids_required", value)}
              tabIndex={disabled ? -1 : undefined}
              className="h-4 w-4 accent-primary"
              aria-label={`Visual aids required - ${label}`}
            />
            <span className="text-xs text-foreground/80">{label}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2 p-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <FormField
            label="Date of Initial PEME (mm/dd/yyyy)"
            value={data.date_initial_peme}
            onChange={(value) => update("date_initial_peme", value)}
            type="date"
            disabled={disabled}
          />
          <FormField
            label="Date of Fitness (mm/dd/yyyy)"
            value={data.date_of_fitness}
            onChange={handleDateOfFitnessChange}
            type="date"
            disabled={disabled}
          />
          <FormField
            label="Valid until (mm/dd/yyyy)"
            value={data.valid_until}
            onChange={(value) => update("valid_until", value)}
            type="date"
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-[2fr_1fr]">
          <div className="space-y-0.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-primary/70">
              Authorized Physician
            </label>
            <div className="flex gap-1.5">
              <Input
                value={data.authorized_physician}
                readOnly
                tabIndex={-1}
                placeholder="Select physician..."
                className={personnelInputClasses}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setPhysicianDialogOpen(true)}
                disabled={disabled}
                className="h-8 w-8 shrink-0 cursor-pointer border-primary/20"
                aria-label="Search authorized physician"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <FormField
            label="Medical Certification No."
            value={data.medical_certification_no}
            onChange={(value) => update("medical_certification_no", value)}
            disabled={disabled}
          />
        </div>

        <div className="max-w-[66.666%] space-y-0.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-primary/70">
            Medical Director
          </label>
          <div className="flex gap-1.5">
            <Input
              value={data.medical_director}
              readOnly
              tabIndex={-1}
              placeholder="Select medical director..."
              className={personnelInputClasses}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setDirectorDialogOpen(true)}
              disabled={disabled}
              className="h-8 w-8 shrink-0 cursor-pointer border-primary/20"
              aria-label="Search medical director"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <MedicalPersonnelDialog
        open={physicianDialogOpen}
        onOpenChange={setPhysicianDialogOpen}
        onSelect={selectPhysician}
        title="Select Authorized Physician"
        description="Search and select an authorized physician."
      />
      <MedicalPersonnelDialog
        open={directorDialogOpen}
        onOpenChange={setDirectorDialogOpen}
        onSelect={selectDirector}
        title="Select Medical Director"
        description="Search and select a medical director."
      />
    </div>
  );
}
