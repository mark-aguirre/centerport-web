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
import type { LaboratorySectionProps } from "./types";

/**
 * Patient Information and report header section for the Laboratory Report form.
 *
 * Displays patient demographics (from linked SeafarerProfile) and
 * report metadata laid out to match the reference form:
 * - Row 1: RESULT DATE | MED. TECH. [..] | LICENSE NO.
 * - Row 2: LABORATORY NO. | PATHOLOGIST [..] | LICENSE NO.
 */
export default function PatientInformationSection({
  data,
  onChange,
  disabled,
}: LaboratorySectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  // Dialog state for personnel lookup
  const [medTechDialogOpen, setMedTechDialogOpen] = useState(false);
  const [pathologistDialogOpen, setPathologistDialogOpen] = useState(false);

  const handleSelectMedTech = (personnel: MedicalPersonnel) => {
    onChange({
      ...data,
      med_tech: personnel.name,
      med_tech_license_no: personnel.license_no,
    });
  };

  const handleSelectPathologist = (personnel: MedicalPersonnel) => {
    onChange({
      ...data,
      pathologist: personnel.name,
      pathologist_license_no: personnel.license_no,
    });
  };

  const inputClasses = cn(
    "h-8 text-sm bg-white border border-primary/20 rounded-md px-2",
    "focus:outline-none focus-visible:border-primary dark:bg-input/30",
    disabled && "pointer-events-none opacity-70"
  );

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader title="Patient Information" icon={User} />

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
        <div className="grid grid-cols-[auto_1fr_auto_2fr_auto_1fr] gap-x-2 gap-y-2 items-center">
          {/* Row 1: RESULT DATE | MED. TECH. [search] | LICENSE NO. */}
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
            Med. Tech.:
          </Label>
          <div className="flex gap-1.5">
            <Input
              value={data.med_tech}
              onChange={(e) => updateField("med_tech", e.target.value)}
              className={cn(inputClasses, "flex-1")}
              disabled={disabled}
              placeholder="Select personnel..."
              readOnly
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 border-primary/20 hover:border-primary/40"
              onClick={() => setMedTechDialogOpen(true)}
              disabled={disabled}
              aria-label="Search medical technologist"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider whitespace-nowrap">
            License No.:
          </Label>
          <Input
            value={data.med_tech_license_no}
            onChange={(e) => updateField("med_tech_license_no", e.target.value)}
            className={inputClasses}
            disabled={disabled}
            readOnly
          />

          {/* Row 2: LABORATORY NO. | PATHOLOGIST [search] | LICENSE NO. */}
          <Label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider whitespace-nowrap">
            Laboratory No.:
          </Label>
          <Input
            value={data.laboratory_no}
            onChange={(e) => updateField("laboratory_no", e.target.value)}
            className={inputClasses}
            disabled={disabled}
          />
          <Label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider whitespace-nowrap">
            Pathologist:
          </Label>
          <div className="flex gap-1.5">
            <Input
              value={data.pathologist}
              onChange={(e) => updateField("pathologist", e.target.value)}
              className={cn(inputClasses, "flex-1")}
              disabled={disabled}
              placeholder="Select personnel..."
              readOnly
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 border-primary/20 hover:border-primary/40"
              onClick={() => setPathologistDialogOpen(true)}
              disabled={disabled}
              aria-label="Search pathologist"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Label className="text-[11px] font-semibold text-foreground/70 uppercase tracking-wider whitespace-nowrap">
            License No.:
          </Label>
          <Input
            value={data.pathologist_license_no}
            onChange={(e) => updateField("pathologist_license_no", e.target.value)}
            className={inputClasses}
            disabled={disabled}
            readOnly
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
    </div>
  );
}
