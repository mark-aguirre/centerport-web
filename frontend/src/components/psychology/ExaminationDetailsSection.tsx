"use client";

import { useState } from "react";
import {
  MedicalPersonnelDialog,
  type MedicalPersonnel,
} from "@/components/common/medical-personnel-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import type { PsychologySectionProps } from "./types";
import { createFieldUpdater } from "./utils";

const INPUT_CLASSES = cn(
  "h-7 min-w-0 border border-primary/20 bg-white px-2 text-xs shadow-none",
  "transition-colors hover:border-primary/50 focus-visible:border-primary",
  "focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30"
);

/**
 * Captures examination personnel, license details, and tests used.
 *
 * Personnel names remain searchable through the shared medical-personnel dialog;
 * selecting a result populates both the displayed name and license number.
 */
export default function ExaminationDetailsSection({
  data,
  onChange,
  disabled,
}: PsychologySectionProps) {
  const updateField = createFieldUpdater(data, onChange);
  const [psychometricianDialogOpen, setPsychometricianDialogOpen] = useState(false);
  const [psychologistDialogOpen, setPsychologistDialogOpen] = useState(false);

  const handleSelectPsychometrician = (personnel: MedicalPersonnel) => {
    onChange({
      ...data,
      psychometrician: personnel.name,
      psychometrician_license_no: personnel.license_no,
    });
  };

  const handleSelectPsychologist = (personnel: MedicalPersonnel) => {
    onChange({
      ...data,
      psychologist: personnel.name,
      psychologist_license_no: personnel.license_no,
    });
  };

  const personnelInput = (
    value: string,
    label: string,
    openDialog: () => void
  ) => (
    <div className="flex min-w-0 gap-1">
      <Input
        value={value}
        readOnly
        tabIndex={disabled ? -1 : undefined}
        aria-label={label}
        className={cn(INPUT_CLASSES, "w-full", disabled && "pointer-events-none")}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          "h-7 w-7 shrink-0 border-primary/20 p-0 hover:border-primary/50",
          disabled
            ? "cursor-default disabled:!opacity-100"
            : "cursor-pointer"
        )}
        onClick={openDialog}
        disabled={disabled}
        aria-label={`Search ${label.toLowerCase()}`}
      >
        <Ellipsis className="h-4 w-4" />
      </Button>
    </div>
  );

  const testField = (
    label: string,
    checked: boolean,
    onCheckedChange: (checked: boolean) => void,
    value: string,
    onValueChange: (value: string) => void,
    placeholder: string
  ) => (
    <div className="flex min-w-0 items-center gap-2">
      <label
        className={cn(
          "flex shrink-0 items-center gap-1.5",
          disabled ? "pointer-events-none" : "cursor-pointer"
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            if (!disabled) onCheckedChange(event.target.checked);
          }}
          className={cn(
            "h-4 w-4 rounded accent-primary",
            disabled ? "pointer-events-none" : "cursor-pointer"
          )}
          tabIndex={disabled ? -1 : undefined}
          aria-disabled={disabled}
          aria-label={`${label} used`}
        />
        <span className="whitespace-nowrap text-xs text-foreground/80">{label}:</span>
      </label>
      <Input
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={cn(
          INPUT_CLASSES,
          "w-full italic",
          disabled && "pointer-events-none"
        )}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
        placeholder={placeholder}
        aria-label={`${label} name`}
      />
    </div>
  );

  return (
    <section className="overflow-hidden rounded-lg border border-primary/20 bg-card p-3 shadow-sm">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 gap-y-2 xl:grid-cols-[auto_minmax(8rem,1.25fr)_auto_minmax(18rem,2.8fr)_auto_minmax(8rem,1.15fr)]">
        <Label className="whitespace-nowrap text-[11px] font-semibold text-foreground/80">
          Date of Examination:
        </Label>
        <Input
          type="date"
          value={data.date_of_examination}
          onChange={(event) => updateField("date_of_examination", event.target.value)}
          className={cn(INPUT_CLASSES, "w-full", disabled && "pointer-events-none")}
          readOnly={disabled}
          tabIndex={disabled ? -1 : undefined}
        />

        <Label className="whitespace-nowrap text-[11px] font-semibold text-foreground/80">
          Psychometrician:
        </Label>
        {personnelInput(data.psychometrician, "Psychometrician", () =>
          setPsychometricianDialogOpen(true)
        )}

        <Label className="whitespace-nowrap text-[11px] font-semibold text-foreground/80">
          License No.:
        </Label>
        <Input
          value={data.psychometrician_license_no}
          readOnly
          tabIndex={disabled ? -1 : undefined}
          aria-label="Psychometrician license number"
          className={cn(INPUT_CLASSES, "w-full", disabled && "pointer-events-none")}
        />

        <div className="hidden xl:block" aria-hidden="true" />
        <div className="hidden xl:block" aria-hidden="true" />

        <Label className="whitespace-nowrap text-[11px] font-semibold text-foreground/80 xl:text-right">
          Psychologist:
        </Label>
        {personnelInput(data.psychologist, "Psychologist", () =>
          setPsychologistDialogOpen(true)
        )}

        <Label className="whitespace-nowrap text-[11px] font-semibold text-foreground/80">
          License No.:
        </Label>
        <Input
          value={data.psychologist_license_no}
          readOnly
          tabIndex={disabled ? -1 : undefined}
          aria-label="Psychologist license number"
          className={cn(INPUT_CLASSES, "w-full", disabled && "pointer-events-none")}
        />
      </div>

      <div className="mt-3 border-t border-primary/20 pt-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {testField(
            "Intelligence Test",
            data.intelligence_test_used,
            (checked) => updateField("intelligence_test_used", checked),
            data.intelligence_test_name,
            (value) => updateField("intelligence_test_name", value),
            "e.g. PNLT"
          )}
          {testField(
            "Personal Test",
            data.personal_test_used,
            (checked) => updateField("personal_test_used", checked),
            data.personal_test_name,
            (value) => updateField("personal_test_name", value),
            "e.g. BPI"
          )}
          {testField(
            "Others",
            data.others_test_used,
            (checked) => updateField("others_test_used", checked),
            data.others_test_name,
            (value) => updateField("others_test_name", value),
            "e.g. Autobiography & Interview"
          )}
        </div>
      </div>

      <MedicalPersonnelDialog
        open={psychometricianDialogOpen}
        onOpenChange={setPsychometricianDialogOpen}
        onSelect={handleSelectPsychometrician}
        title="Select Psychometrician"
        description="Search and select a psychometrician for this evaluation."
      />
      <MedicalPersonnelDialog
        open={psychologistDialogOpen}
        onOpenChange={setPsychologistDialogOpen}
        onSelect={handleSelectPsychologist}
        title="Select Psychologist"
        description="Search and select a psychologist for this evaluation."
      />
    </section>
  );
}
