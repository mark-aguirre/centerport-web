"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/common/section-header";
import {
  MedicalPersonnelDialog,
  type MedicalPersonnel,
} from "@/components/common/medical-personnel-dialog";
import { Stethoscope, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { PsychologySectionProps } from "./types";

/**
 * Examination details section for the Psychological Evaluation form.
 *
 * Captures:
 * - Date of Examination
 * - Psychometrician (with search popup) + License No.
 * - Psychologist (with search popup) + License No.
 * - Tests Used: Intelligence Test, Personal Test, Others (checkbox + text)
 *
 * The Psychometrician and Psychologist fields open the global
 * MedicalPersonnelDialog popup for searching and selecting personnel.
 * On selection, both the name and license number are auto-populated.
 */
export default function ExaminationDetailsSection({
  data,
  onChange,
  disabled,
}: PsychologySectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  // Dialog state for each personnel field
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

  const inputClasses = cn(
    "h-8 text-sm bg-white border border-primary/20 rounded-md px-2",
    "focus:outline-none focus-visible:border-primary dark:bg-input/30",
    disabled && "pointer-events-none opacity-70"
  );

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Examination Details" icon={Stethoscope} />

      {/* Row 1: Date, Psychometrician (with search button), License No */}
      <div className="grid grid-cols-[1.2fr_2.5fr_1.3fr] gap-3 mb-3 items-end">
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-foreground/70">Date of Examination</Label>
          <Input
            type="date"
            value={data.date_of_examination}
            onChange={(e) => updateField("date_of_examination", e.target.value)}
            className={inputClasses}
            disabled={disabled}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-foreground/70">Psychometrician</Label>
          <div className="flex gap-1.5">
            <Input
              value={data.psychometrician}
              onChange={(e) => updateField("psychometrician", e.target.value)}
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
              onClick={() => setPsychometricianDialogOpen(true)}
              disabled={disabled}
              aria-label="Search psychometrician"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-foreground/70">License No.</Label>
          <Input
            value={data.psychometrician_license_no}
            onChange={(e) => updateField("psychometrician_license_no", e.target.value)}
            className={inputClasses}
            disabled={disabled}
            readOnly
          />
        </div>
      </div>

      {/* Row 2: Psychologist (with search button), License No */}
      <div className="grid grid-cols-[1.2fr_2.5fr_1.3fr] gap-3 mb-4 items-end">
        <div />
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-foreground/70">Psychologist</Label>
          <div className="flex gap-1.5">
            <Input
              value={data.psychologist}
              onChange={(e) => updateField("psychologist", e.target.value)}
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
              onClick={() => setPsychologistDialogOpen(true)}
              disabled={disabled}
              aria-label="Search psychologist"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-foreground/70">License No.</Label>
          <Input
            value={data.psychologist_license_no}
            onChange={(e) => updateField("psychologist_license_no", e.target.value)}
            className={inputClasses}
            disabled={disabled}
            readOnly
          />
        </div>
      </div>

      {/* Tests Used */}
      <div className="border-t border-primary/10 pt-3">
        <Label className="text-[11px] font-bold text-primary/70 uppercase tracking-wider mb-2 block">
          Tests Used
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Intelligence Test */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.intelligence_test_used}
              onChange={(e) => updateField("intelligence_test_used", e.target.checked)}
              className="w-4 h-4 accent-primary rounded"
              disabled={disabled}
              aria-label="Intelligence Test used"
            />
            <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">Intelligence Test:</Label>
            <Input
              value={data.intelligence_test_name}
              onChange={(e) => updateField("intelligence_test_name", e.target.value)}
              className={cn(inputClasses, "flex-1")}
              disabled={disabled}
              placeholder="e.g. PNLT"
            />
          </div>

          {/* Personal Test */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.personal_test_used}
              onChange={(e) => updateField("personal_test_used", e.target.checked)}
              className="w-4 h-4 accent-primary rounded"
              disabled={disabled}
              aria-label="Personal Test used"
            />
            <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">Personal Test:</Label>
            <Input
              value={data.personal_test_name}
              onChange={(e) => updateField("personal_test_name", e.target.value)}
              className={cn(inputClasses, "flex-1")}
              disabled={disabled}
              placeholder="e.g. BPI"
            />
          </div>

          {/* Others */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.others_test_used}
              onChange={(e) => updateField("others_test_used", e.target.checked)}
              className="w-4 h-4 accent-primary rounded"
              disabled={disabled}
              aria-label="Other tests used"
            />
            <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">Others:</Label>
            <Input
              value={data.others_test_name}
              onChange={(e) => updateField("others_test_name", e.target.value)}
              className={cn(inputClasses, "flex-1")}
              disabled={disabled}
              placeholder="e.g. Autobiography & Interview"
            />
          </div>
        </div>
      </div>

      {/* Medical Personnel Search Dialogs */}
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
    </div>
  );
}
