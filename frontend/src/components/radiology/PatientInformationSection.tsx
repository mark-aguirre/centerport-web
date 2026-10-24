"use client";

import { useState } from "react";
import { User, Search } from "lucide-react";

import { SectionHeader } from "@/components/common/section-header";
import {
  MedicalPersonnelDialog,
  type MedicalPersonnel,
} from "@/components/common/medical-personnel-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RadiologyRecord, RadiologySectionProps } from "./types";

/**
 * Patient Information and report header section shared by the radiology
 * result forms (Ultrasound and X-Ray).
 *
 * Displays patient demographics read-only from the linked SeafarerProfile,
 * then the report header laid out to match the reference forms:
 * - Row 1: RESULT DATE
 * - Row 2: XRAY TECH. [..]  | LICENSE NO.
 * - Row 3: RADIOLOGIST [..] | LICENSE NO.
 *
 * The technologist and radiologist fields are read-only text backed by the
 * Medical Personnel lookup dialog, so a signatory's name and license number
 * always come from a single personnel record.
 *
 * @typeParam T - the concrete record type (UltrasoundReport or XrayReport)
 */
export default function RadiologyPatientInformationSection<T extends RadiologyRecord>({
  data,
  onChange,
  disabled,
}: RadiologySectionProps<T>) {
  const [xrayTechDialogOpen, setXrayTechDialogOpen] = useState(false);
  const [radiologistDialogOpen, setRadiologistDialogOpen] = useState(false);

  const updateField = (field: keyof T, value: string) =>
    onChange({ ...data, [field]: value });

  const handleSelectXrayTech = (personnel: MedicalPersonnel) => {
    onChange({
      ...data,
      xray_tech: personnel.name,
      xray_tech_license_no: personnel.license_no,
    });
  };

  const handleSelectRadiologist = (personnel: MedicalPersonnel) => {
    onChange({
      ...data,
      radiologist: personnel.name,
      radiologist_license_no: personnel.license_no,
    });
  };

  const inputClasses = cn(
    "h-8 text-sm bg-white border border-primary/20 rounded-md px-2",
    "focus:outline-none focus-visible:border-primary dark:bg-input/30",
    disabled && "pointer-events-none opacity-70"
  );

  const headerLabelClasses =
    "text-[11px] font-semibold text-foreground/70 uppercase tracking-wider whitespace-nowrap";

  /** A labelled personnel field with a lookup dialog trigger. */
  const personnelRow = (
    label: string,
    nameField: keyof RadiologyRecord,
    licenseLabel: string,
    licenseField: keyof RadiologyRecord,
    onOpen: () => void,
    ariaLabel: string
  ) => (
    <>
      <Label className={headerLabelClasses}>{label}</Label>
      <div className="flex gap-1.5">
        <Input
          value={data[nameField]}
          onChange={(e) => updateField(nameField as keyof T, e.target.value)}
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
      <Label className={headerLabelClasses}>{licenseLabel}</Label>
      <Input
        value={data[licenseField]}
        onChange={(e) => updateField(licenseField as keyof T, e.target.value)}
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
          {/* Row 1: RESULT DATE */}
          <Label className={headerLabelClasses}>Result Date:</Label>
          <Input
            type="date"
            value={data.result_date}
            onChange={(e) => updateField("result_date" as keyof T, e.target.value)}
            className={inputClasses}
            disabled={disabled}
          />
          <span aria-hidden="true" />
          <span aria-hidden="true" />

          {personnelRow(
            "X-Ray Tech.:",
            "xray_tech",
            "License No.:",
            "xray_tech_license_no",
            () => setXrayTechDialogOpen(true),
            "Search x-ray technologist"
          )}
          {personnelRow(
            "Radiologist:",
            "radiologist",
            "License No.:",
            "radiologist_license_no",
            () => setRadiologistDialogOpen(true),
            "Search radiologist"
          )}
        </div>
      </div>

      {/* Medical Personnel Search Dialogs */}
      <MedicalPersonnelDialog
        onSelect={handleSelectXrayTech}
        open={xrayTechDialogOpen}
        onOpenChange={setXrayTechDialogOpen}
        title="Select X-Ray Technologist"
        description="Search and select an x-ray technologist for this report."
        role="XRAY_TECH"
      />
      <MedicalPersonnelDialog
        onSelect={handleSelectRadiologist}
        open={radiologistDialogOpen}
        onOpenChange={setRadiologistDialogOpen}
        title="Select Radiologist"
        description="Search and select a radiologist for this report."
        role="RADIOLOGIST"
      />
    </div>
  );
}
