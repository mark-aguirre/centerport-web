"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/form-field";
import {
  MedicalPersonnelDialog,
  type MedicalPersonnel,
} from "@/components/common/medical-personnel-dialog";
import { cn } from "@/lib/utils";

/** Values for the certification details fields. */
export interface CertificationDetailsValues {
  dateInitialPeme: string;
  dateOfFitness: string;
  validUntil: string;
  authorizedPhysician: string;
  medicalCertificationNo: string;
  medicalDirector: string;
}

export interface CertificationDetailsFieldsProps {
  /** Current field values. */
  values: CertificationDetailsValues;
  /** Called when any field value changes. */
  onChange: (field: keyof CertificationDetailsValues, value: string) => void;
  /** Called when multiple fields change at once (e.g. physician selection populates name + cert no). */
  onBatchChange?: (updates: Partial<CertificationDetailsValues>) => void;
  /** Disables all fields when true. */
  disabled?: boolean;
}

/**
 * Reusable certification details fields group.
 *
 * Renders the standard layout used across Medical, MLC, and Landbase forms:
 * - Row 1: Date of Initial PEME, Date of Fitness, Valid Until
 * - Row 2: Authorized Physician (search dialog), Medical Certification No.
 * - Row 3: Medical Director (search dialog)
 *
 * Personnel fields use the global MedicalPersonnelDialog for searching and
 * selecting from the database rather than a hardcoded dropdown.
 *
 * @example
 * ```tsx
 * <CertificationDetailsFields
 *   values={{
 *     dateInitialPeme: data.date_initial_peme,
 *     dateOfFitness: data.date_of_fitness,
 *     validUntil: data.valid_until,
 *     authorizedPhysician: data.authorized_physician,
 *     medicalCertificationNo: data.medical_certification_no,
 *     medicalDirector: data.medical_director,
 *   }}
 *   onChange={(field, value) => { ... }}
 *   disabled={disabled}
 * />
 * ```
 */
export function CertificationDetailsFields({
  values,
  onChange,
  onBatchChange,
  disabled,
}: CertificationDetailsFieldsProps) {
  const [physicianDialogOpen, setPhysicianDialogOpen] = useState(false);
  const [directorDialogOpen, setDirectorDialogOpen] = useState(false);

  const handleSelectPhysician = (personnel: MedicalPersonnel) => {
    if (onBatchChange) {
      onBatchChange({
        authorizedPhysician: personnel.name,
        medicalCertificationNo: personnel.license_no,
      });
    } else {
      onChange("authorizedPhysician", personnel.name);
      onChange("medicalCertificationNo", personnel.license_no);
    }
  };

  const handleSelectDirector = (personnel: MedicalPersonnel) => {
    onChange("medicalDirector", personnel.name);
  };

  /**
   * Add two years to an ISO date string (`yyyy-mm-dd`).
   *
   * Returns an empty string when the input is empty or unparseable so the
   * derived "Valid Until" clears alongside an empty "Date of Fitness".
   */
  const addTwoYears = (isoDate: string): string => {
    if (!isoDate) return "";
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return "";
    parsed.setFullYear(parsed.getFullYear() + 2);
    return parsed.toISOString().slice(0, 10);
  };

  /**
   * Set Date of Fitness and derive Valid Until as exactly two years later.
   *
   * Both fields update together (via `onBatchChange` when available) so the
   * certificate validity stays in sync; Valid Until remains editable for
   * manual overrides.
   */
  const handleDateOfFitnessChange = (value: string) => {
    const validUntil = addTwoYears(value);
    if (onBatchChange) {
      onBatchChange({ dateOfFitness: value, validUntil });
    } else {
      onChange("dateOfFitness", value);
      onChange("validUntil", validUntil);
    }
  };

  const inputClasses = cn(
    "h-8 text-xs bg-white border border-primary/30 rounded-md px-2 shadow-sm",
    "hover:border-primary/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20",
    "dark:bg-input/30 transition-colors",
    disabled && "pointer-events-none opacity-70"
  );

  return (
    <div className="space-y-2">
      {/* Row 1: Date of Initial PEME, Date of Fitness, Valid Until */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <FormField
          label="Date of Initial PEME (MM/DD/YYYY)"
          value={values.dateInitialPeme}
          onChange={(v) => onChange("dateInitialPeme", v)}
          type="date"
          disabled={disabled}
        />
        <FormField
          label="Date of Fitness (MM/DD/YYYY)"
          value={values.dateOfFitness}
          onChange={handleDateOfFitnessChange}
          type="date"
          disabled={disabled}
        />
        <FormField
          label="Valid Until (MM/DD/YYYY)"
          value={values.validUntil}
          onChange={(v) => onChange("validUntil", v)}
          type="date"
          disabled={disabled}
        />
      </div>

      {/* Row 2: Authorized Physician (search dialog), Medical Certification No. */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[3fr_1fr]">
        <div className="space-y-0.5">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Authorized Physician
          </Label>
          <div className="flex gap-1.5">
            <Input
              value={values.authorizedPhysician ?? ""}
              readOnly
              placeholder="Select physician..."
              className={cn(inputClasses, "flex-1")}
              tabIndex={disabled ? -1 : undefined}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 cursor-pointer border-primary/20 hover:border-primary/40"
              onClick={() => setPhysicianDialogOpen(true)}
              disabled={disabled}
              aria-label="Search authorized physician"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <FormField
          label="Medical Certification No."
          value={values.medicalCertificationNo}
          onChange={(v) => onChange("medicalCertificationNo", v)}
          disabled
        />
      </div>

      {/* Row 3: Medical Director (search dialog) */}
      <div>
        <div className="space-y-0.5">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Medical Director
          </Label>
          <div className="flex gap-1.5">
            <Input
              value={values.medicalDirector ?? ""}
              readOnly
              placeholder="Select medical director..."
              className={cn(inputClasses, "flex-1")}
              tabIndex={disabled ? -1 : undefined}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 cursor-pointer border-primary/20 hover:border-primary/40"
              onClick={() => setDirectorDialogOpen(true)}
              disabled={disabled}
              aria-label="Search medical director"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Medical Personnel Search Dialogs */}
      <MedicalPersonnelDialog
        open={physicianDialogOpen}
        onOpenChange={setPhysicianDialogOpen}
        onSelect={handleSelectPhysician}
        title="Select Authorized Physician"
        description="Search and select an authorized physician."
      />
      <MedicalPersonnelDialog
        open={directorDialogOpen}
        onOpenChange={setDirectorDialogOpen}
        onSelect={handleSelectDirector}
        title="Select Medical Director"
        description="Search and select a medical director."
      />
    </div>
  );
}
