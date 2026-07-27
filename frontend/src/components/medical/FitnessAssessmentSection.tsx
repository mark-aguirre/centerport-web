"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { FormSelect } from "@/components/common/form-select";
import {
  CertificationDetailsFields,
  type CertificationDetailsValues,
} from "@/components/common/certification-details-fields";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { MedicalExam, MedicalSectionProps } from "./types";

/**
 * Assessment of Fitness for Service at Sea and Dates/Certification sub-section.
 *
 * Captures fitness assessment for Deck, Catering, Engine, and Other services
 * (Fit/Unfit), visual aids requirement, PEME dates, authorized physician,
 * medical certification number, and medical director.
 *
 * @see PhysicalExaminationSection — parent orchestrator
 */
export function FitnessAssessmentSection({ data, onChange, disabled }: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  /** Set all fitness assessments to "fit" and visual aids to "no". */
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

  return (
    <>
      {/* Assessment of Fitness for Service at Sea */}
      <div className={cn("bg-card rounded-lg p-3 shadow-sm border border-primary/10", disabled && "pointer-events-none")}>
        <SectionHeader
          title="Assessment of Fitness for Service at Sea"
          subtitle="On the basis of the examinee&apos;s personal declaration, my clinical examination and the diagnostic test result recorded above, I declare the examinee medically:"
          action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
        />
        <div className="space-y-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-foreground/70 uppercase">Deck Services:</Label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="fit_deck" checked={data.fitness_deck_services === "fit"} onChange={() => update("fitness_deck_services", "fit")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">FIT</span></label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="fit_deck" checked={data.fitness_deck_services === "unfit"} onChange={() => update("fitness_deck_services", "unfit")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">UNFIT</span></label>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-foreground/70 uppercase">Catering Services:</Label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="fit_catering" checked={data.fitness_catering_services === "fit"} onChange={() => update("fitness_catering_services", "fit")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">FIT</span></label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="fit_catering" checked={data.fitness_catering_services === "unfit"} onChange={() => update("fitness_catering_services", "unfit")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">UNFIT</span></label>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-foreground/70 uppercase">Engine Services:</Label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="fit_engine" checked={data.fitness_engine_services === "fit"} onChange={() => update("fitness_engine_services", "fit")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">FIT</span></label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="fit_engine" checked={data.fitness_engine_services === "unfit"} onChange={() => update("fitness_engine_services", "unfit")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">UNFIT</span></label>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-foreground/70 uppercase">Other Services:</Label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="fit_other" checked={data.fitness_other_services === "fit"} onChange={() => update("fitness_other_services", "fit")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">FIT</span></label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="fit_other" checked={data.fitness_other_services === "unfit"} onChange={() => update("fitness_other_services", "unfit")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">UNFIT</span></label>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-muted/30">
            <Label className="text-[11px] font-semibold text-foreground/70">Visual Aids Required:</Label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="visual_aids" checked={data.visual_aids_required === "yes"} onChange={() => update("visual_aids_required", "yes")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">YES</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="visual_aids" checked={data.visual_aids_required === "no"} onChange={() => update("visual_aids_required", "no")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">NO</span></label>
          </div>
        </div>
      </div>

      {/* Dates & Certification */}
      <div className={cn("bg-card rounded-lg p-3 shadow-sm border border-primary/10", disabled && "pointer-events-none")}>
        <CertificationDetailsFields
          values={{
            dateInitialPeme: data.date_initial_peme,
            dateOfFitness: data.date_of_fitness,
            validUntil: data.valid_until,
            authorizedPhysician: data.authorized_physician,
            medicalCertificationNo: data.medical_certification_no,
            medicalDirector: data.medical_director,
          }}
          onChange={(field, value) => {
            const FIELD_MAP: Record<keyof CertificationDetailsValues, keyof MedicalExam> = {
              dateInitialPeme: "date_initial_peme",
              dateOfFitness: "date_of_fitness",
              validUntil: "valid_until",
              authorizedPhysician: "authorized_physician",
              medicalCertificationNo: "medical_certification_no",
              medicalDirector: "medical_director",
            };
            update(FIELD_MAP[field], value);
          }}
          disabled={disabled}
        />
      </div>
    </>
  );
}
