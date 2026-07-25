"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormSelect } from "@/components/common/form-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
export function FitnessAssessmentSection({ data, onChange }: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <>
      {/* Assessment of Fitness for Service at Sea */}
      <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
        <SectionHeader
          title="Assessment of Fitness for Service at Sea"
          subtitle="On the basis of the examinee&apos;s personal declaration, my clinical examination and the diagnostic test result recorded above, I declare the examinee medically:"
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
      <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-0.5">
              <Label className="text-[11px] font-bold text-foreground/70 uppercase">Date of Initial PEME (MM/DD/YYYY)</Label>
              <Input type="date" value={data.date_initial_peme} onChange={(e) => update("date_initial_peme", e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[11px] font-bold text-foreground/70 uppercase">Date of Fitness (MM/DD/YYYY)</Label>
              <Input type="date" value={data.date_of_fitness} onChange={(e) => update("date_of_fitness", e.target.value)} className="h-7 text-xs" />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[11px] font-bold text-foreground/70 uppercase">Valid Until (MM/DD/YYYY)</Label>
              <Input type="date" value={data.valid_until} onChange={(e) => update("valid_until", e.target.value)} className="h-7 text-xs" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <Label className="text-[11px] font-bold text-foreground/70 uppercase">Authorized Physician</Label>
              <FormSelect label="" value={data.authorized_physician} onChange={(v) => update("authorized_physician", v)} options={["Dr. Juan Dela Cruz", "Dr. Maria Santos", "Dr. Pedro Reyes"]} />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[11px] font-bold text-foreground/70 uppercase">Medical Certification No.</Label>
              <Input value={data.medical_certification_no} onChange={(e) => update("medical_certification_no", e.target.value)} className="h-7 text-xs" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <Label className="text-[11px] font-bold text-foreground/70 uppercase">Medical Director</Label>
              <FormSelect label="" value={data.medical_director} onChange={(v) => update("medical_director", v)} options={["Dr. Juan Dela Cruz", "Dr. Maria Santos", "Dr. Pedro Reyes"]} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
