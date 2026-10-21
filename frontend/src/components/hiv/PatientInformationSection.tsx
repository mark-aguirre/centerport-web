"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/common/section-header";
import {
  MedicalPersonnelDialog,
  type MedicalPersonnel,
} from "@/components/common/medical-personnel-dialog";
import { User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { HivReport, HivSectionProps } from "./types";

/**
 * Patient Information and report header section for the HIV Report form.
 *
 * Displays patient demographics (from the linked SeafarerProfile) and report
 * metadata laid out to match the reference form:
 * - Row 1: MEDICAL TECHNOLOGIST [..] | HIV PROFICIENCY CERT. NO.
 * - Row 2: PATHOLOGIST [..]          | PATHOLOGIST LICENSE NO.
 * - Row 3: EXAMINING PHYSICIAN [..]  | PHYSICIAN LICENSE NO.
 * - Row 4: RESULT DATE | EXPIRE DATE
 */
export default function PatientInformationSection({
  data,
  onChange,
  disabled,
}: HivSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  // Dialog state for personnel lookup
  const [medTechDialogOpen, setMedTechDialogOpen] = useState(false);
  const [pathologistDialogOpen, setPathologistDialogOpen] = useState(false);
  const [physicianDialogOpen, setPhysicianDialogOpen] = useState(false);

  const handleSelectMedTech = (personnel: MedicalPersonnel) => {
    onChange({
      ...data,
      med_tech: personnel.name,
      hiv_proficiency_cert_no: personnel.license_no,
    });
  };

  const handleSelectPathologist = (personnel: MedicalPersonnel) => {
    onChange({
      ...data,
      pathologist: personnel.name,
      pathologist_license_no: personnel.license_no,
    });
  };

  const handleSelectPhysician = (personnel: MedicalPersonnel) => {
    onChange({
      ...data,
      examining_physician: personnel.name,
      physician_license_no: personnel.license_no,
    });
  };

  const inputClasses = cn(
    "h-8 text-sm bg-white border border-primary/20 rounded-md px-2",
    "focus:outline-none focus-visible:border-primary dark:bg-input/30",
    disabled && "pointer-events-none opacity-70"
  );

  /** A labelled personnel field with a lookup dialog trigger. */
  const personnelRow = (
    label: string,
    nameField: keyof HivReport,
    licenseLabel: string,
    licenseField: keyof HivReport,
    onOpen: () => void,
    ariaLabel: string
  ) => (
    <>
      <Label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider whitespace-nowrap">
        {label}
      </Label>
      <div className="flex gap-1.5">
        <Input
          value={data[nameField] as string}
          onChange={(e) => updateField(nameField, e.target.value)}
          className={cn(inputClasses, "flex-1")}
          disabled={disabled}
          placeholder="Select personnel..."
          readOnly
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 border-primary/20 hover:border-primary/40 cursor-pointer"
          onClick={onOpen}
          disabled={disabled}
          aria-label={ariaLabel}
        >
          <Search className="h-3.5 w-3.5" />
        </Button>
      </div>
      <Label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider whitespace-nowrap">
        {licenseLabel}
      </Label>
      <Input
        value={data[licenseField] as string}
        onChange={(e) => updateField(licenseField, e.target.value)}
        className={inputClasses}
        disabled={disabled}
        readOnly
      />
    </>
  );

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader title="Patient Information" icon={User} banner bannerInset="p-3" />

      {/* Patient Demographics — inline label + input, grid-aligned rows */}
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_auto_auto_auto] gap-x-2 gap-y-2 mb-4 items-center">
        {/* Row 1 */}
        <Label className="text-xs font-semibold text-foreground/70 whitespace-nowrap">Name:</Label>
        <Input
          value={`${data.last_name}${data.first_name ? ", " + data.first_name : ""}${data.middle_name ? " " + data.middle_name : ""}`}
          readOnly
          tabIndex={-1}
          className={cn(inputClasses, "min-w-0 pointer-events-none")}
        />
        <Label className="text-xs font-semibold text-foreground/70 whitespace-nowrap">Birth date:</Label>
        <Input
          type="date"
          value={data.birthdate}
          readOnly
          tabIndex={-1}
          className={cn(inputClasses, "pointer-events-none")}
        />
        <Label className="text-xs font-semibold text-foreground/70 whitespace-nowrap">Age:</Label>
        <Input
          value={data.age}
          readOnly
          tabIndex={-1}
          className={cn(inputClasses, "w-12 text-center pointer-events-none")}
        />
        <Label className="text-xs font-semibold text-foreground/70 whitespace-nowrap">Gender:</Label>
        <Input
          value={data.gender}
          readOnly
          tabIndex={-1}
          className={cn(inputClasses, "w-20 pointer-events-none")}
        />

        {/* Row 2 */}
        <Label className="text-xs font-semibold text-foreground/70 whitespace-nowrap">Agency:</Label>
        <Input
          value={data.employer}
          readOnly
          tabIndex={-1}
          className={cn(inputClasses, "min-w-0 pointer-events-none")}
        />
        <Label className="text-xs font-semibold text-foreground/70 whitespace-nowrap">Position:</Label>
        <Input
          value={data.position}
          readOnly
          tabIndex={-1}
          className={cn(inputClasses, "min-w-0 pointer-events-none col-span-5")}
        />
      </div>

      {/* Report Header — inline label + input, grid-aligned rows */}
      <div className="border-t border-primary/10 pt-3">
        <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-2 gap-y-2 items-center">
          {personnelRow(
            "Medical Technologist:",
            "med_tech",
            "HIV Proficiency Cert. No.:",
            "hiv_proficiency_cert_no",
            () => setMedTechDialogOpen(true),
            "Search medical technologist"
          )}
          {personnelRow(
            "Pathologist:",
            "pathologist",
            "Pathologist License No.:",
            "pathologist_license_no",
            () => setPathologistDialogOpen(true),
            "Search pathologist"
          )}
          {personnelRow(
            "Examining Physician:",
            "examining_physician",
            "Physician License No.:",
            "physician_license_no",
            () => setPhysicianDialogOpen(true),
            "Search examining physician"
          )}

          {/* Row 4: RESULT DATE | EXPIRE DATE */}
          <Label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider whitespace-nowrap">
            Result Date:
          </Label>
          <Input
            type="date"
            value={data.result_date}
            onChange={(e) => updateField("result_date", e.target.value)}
            className={inputClasses}
            disabled={disabled}
          />
          <Label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider whitespace-nowrap">
            Expire Date:
          </Label>
          <Input
            type="date"
            value={data.expire_date}
            onChange={(e) => updateField("expire_date", e.target.value)}
            className={inputClasses}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Medical Personnel Search Dialogs */}
      <MedicalPersonnelDialog
        onSelect={handleSelectMedTech}
        open={medTechDialogOpen}
        onOpenChange={setMedTechDialogOpen}
        title="Select Medical Technologist"
        description="Search and select a medical technologist for this report."
      />
      <MedicalPersonnelDialog
        onSelect={handleSelectPathologist}
        open={pathologistDialogOpen}
        onOpenChange={setPathologistDialogOpen}
        title="Select Pathologist"
        description="Search and select a pathologist for this report."
      />
      <MedicalPersonnelDialog
        onSelect={handleSelectPhysician}
        open={physicianDialogOpen}
        onOpenChange={setPhysicianDialogOpen}
        title="Select Examining Physician"
        description="Search and select an examining physician for this report."
      />
    </div>
  );
}
