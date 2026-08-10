"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import {
  MedicalPersonnelDialog,
  type MedicalPersonnel,
} from "@/components/common/medical-personnel-dialog";
import { FileCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { MlcSectionProps } from "./types";

/** Certificate type options per MLC/STCW standards. */
const CERTIFICATE_TYPE_OPTIONS = ["ILO/MLC", "STCW", "Flag State"];

/**
 * Certificate Details section for the MLC form.
 *
 * Captures the medical certificate metadata: certificate type,
 * date of examination, date issued, valid until, issuing authority,
 * examining physician, medical director, and any limitations/remarks.
 *
 * Personnel fields use the global MedicalPersonnelDialog for searching and
 * selecting from the database rather than a hardcoded dropdown.
 *
 * This is distinct from the Final Recommendation section which handles
 * the fitness determination and certification dates.
 */
export default function CertificateDetailsSection({
  data,
  onChange,
  disabled,
}: MlcSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  const [physicianDialogOpen, setPhysicianDialogOpen] = useState(false);
  const [directorDialogOpen, setDirectorDialogOpen] = useState(false);

  const handleSelectPhysician = (personnel: MedicalPersonnel) => {
    onChange({ ...data, examining_physician: personnel.name });
  };

  const handleSelectDirector = (personnel: MedicalPersonnel) => {
    onChange({ ...data, medical_director: personnel.name });
  };

  const inputClasses = cn(
    "h-8 text-xs bg-white border border-primary/30 rounded-md px-2 shadow-sm",
    "hover:border-primary/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20",
    "dark:bg-input/30 transition-colors",
    disabled && "pointer-events-none opacity-70"
  );

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader title="Certificate Details" icon={FileCheck} />
      <div className="space-y-2">
        {/* Row 1: Certificate Type, Date of Examination, Date Issued */}
        <div className="grid grid-cols-3 gap-2">
          <FormSelect
            label="Certificate Type"
            value={data.certificate_type}
            onChange={(v) => updateField("certificate_type", v)}
            options={CERTIFICATE_TYPE_OPTIONS}
            disabled={disabled}
          />
          <FormField
            label="Date of Examination"
            value={data.date_of_examination}
            onChange={(v) => updateField("date_of_examination", v)}
            type="date"
            disabled={disabled}
          />
          <FormField
            label="Date Issued"
            value={data.date_issued}
            onChange={(v) => updateField("date_issued", v)}
            type="date"
            disabled={disabled}
          />
        </div>

        {/* Row 2: Valid Until, Issuing Authority */}
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <FormField
            label="Valid Until"
            value={data.valid_until}
            onChange={(v) => updateField("valid_until", v)}
            type="date"
            disabled={disabled}
          />
          <FormField
            label="Issuing Authority"
            value={data.issuing_authority}
            onChange={(v) => updateField("issuing_authority", v)}
            disabled={disabled}
          />
        </div>

        {/* Row 3: Examining Physician, Medical Director (search dialogs) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-0.5">
            <Label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
              Examining Physician
            </Label>
            <div className="flex gap-1.5">
              <Input
                value={data.examining_physician ?? ""}
                readOnly
                placeholder="Select physician..."
                className={cn(inputClasses, "flex-1")}
                tabIndex={disabled ? -1 : undefined}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 border-primary/20 hover:border-primary/40"
                onClick={() => setPhysicianDialogOpen(true)}
                disabled={disabled}
                aria-label="Search examining physician"
              >
                <Search className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="space-y-0.5">
            <Label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
              Medical Director
            </Label>
            <div className="flex gap-1.5">
              <Input
                value={data.medical_director ?? ""}
                readOnly
                placeholder="Select medical director..."
                className={cn(inputClasses, "flex-1")}
                tabIndex={disabled ? -1 : undefined}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 border-primary/20 hover:border-primary/40"
                onClick={() => setDirectorDialogOpen(true)}
                disabled={disabled}
                aria-label="Search medical director"
              >
                <Search className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Limitations / Remarks */}
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Limitations / Remarks
          </Label>
          <Textarea
            value={data.limitations_remarks ?? ""}
            onChange={(e) => updateField("limitations_remarks", e.target.value)}
            className={cn(
              "min-h-[60px] text-sm bg-white border border-primary/20 rounded-md px-3 py-2",
              "focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none",
              disabled && "pointer-events-none"
            )}
            placeholder="Enter limitations or remarks..."
            readOnly={disabled}
          />
        </div>
      </div>

      {/* Medical Personnel Search Dialogs */}
      <MedicalPersonnelDialog
        open={physicianDialogOpen}
        onOpenChange={setPhysicianDialogOpen}
        onSelect={handleSelectPhysician}
        title="Select Examining Physician"
        description="Search and select an examining physician for this certificate."
      />
      <MedicalPersonnelDialog
        open={directorDialogOpen}
        onOpenChange={setDirectorDialogOpen}
        onSelect={handleSelectDirector}
        title="Select Medical Director"
        description="Search and select a medical director for this certificate."
      />
    </div>
  );
}
