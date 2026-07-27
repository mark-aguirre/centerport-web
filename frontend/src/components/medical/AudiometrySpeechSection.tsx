"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { MedicalExam, MedicalSectionProps } from "./types";

/**
 * Audiometry and Speech sub-section of the Physical Examination form.
 *
 * Captures hearing test results (AS/AD for right/left ears) with
 * adequate/inadequate radio options, satisfactory hearing assessment,
 * and impaired hearing speech evaluation.
 *
 * @see PhysicalExaminationSection — parent orchestrator
 */
export function AudiometrySpeechSection({ data, onChange, disabled }: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  /** Set all audiometry and speech fields to normal/adequate defaults. */
  const handleSetNormal = () => {
    onChange({
      ...data,
      audio_as_right_1: "adequate",
      audio_as_left_1: "adequate",
      audio_ad_right_1: "adequate",
      audio_ad_left_1: "adequate",
      audio_satisfactory: "yes",
      speech_impaired_hearing: "adequate",
    });
  };

  return (
    <div className={cn("bg-card rounded-lg p-3 shadow-sm border border-primary/10", disabled && "pointer-events-none")}>
      <div className="grid grid-cols-2 gap-4">
        {/* Audiometry */}
        <div>
          <SectionHeader
            title="Audiometry"
            action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-[11px] font-semibold text-foreground/70">Hearing by Audio Meter</Label>
            </div>
            {/* AS Right */}
            <div className="grid grid-cols-5 gap-1 items-center">
              <span className="text-[11px] font-bold text-primary/70">AS</span>
              <span className="text-[11px] text-muted-foreground text-center">RIGHT:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="as_r1" checked={data.audio_as_right_1 === "adequate"} onChange={() => update("audio_as_right_1", "adequate")} className="w-4 h-4 accent-primary" />
                <span className="text-xs text-foreground/80">Adequate</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="as_r1" checked={data.audio_as_right_1 === "inadequate"} onChange={() => update("audio_as_right_1", "inadequate")} className="w-4 h-4 accent-primary" />
                <span className="text-xs text-foreground/80">Inadequate</span>
              </label>
              <div />
            </div>
            {/* AS Left */}
            <div className="grid grid-cols-5 gap-1 items-center">
              <div />
              <span className="text-[11px] text-muted-foreground text-center">LEFT:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="as_l1" checked={data.audio_as_left_1 === "adequate"} onChange={() => update("audio_as_left_1", "adequate")} className="w-4 h-4 accent-primary" />
                <span className="text-xs text-foreground/80">Adequate</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="as_l1" checked={data.audio_as_left_1 === "inadequate"} onChange={() => update("audio_as_left_1", "inadequate")} className="w-4 h-4 accent-primary" />
                <span className="text-xs text-foreground/80">Inadequate</span>
              </label>
              <div />
            </div>
            {/* AD Right */}
            <div className="grid grid-cols-5 gap-1 items-center">
              <span className="text-[11px] font-bold text-primary/70">AD</span>
              <span className="text-[11px] text-muted-foreground text-center">RIGHT:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="ad_r1" checked={data.audio_ad_right_1 === "adequate"} onChange={() => update("audio_ad_right_1", "adequate")} className="w-4 h-4 accent-primary" />
                <span className="text-xs text-foreground/80">Adequate</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="ad_r1" checked={data.audio_ad_right_1 === "inadequate"} onChange={() => update("audio_ad_right_1", "inadequate")} className="w-4 h-4 accent-primary" />
                <span className="text-xs text-foreground/80">Inadequate</span>
              </label>
              <div />
            </div>
            {/* AD Left */}
            <div className="grid grid-cols-5 gap-1 items-center">
              <div />
              <span className="text-[11px] text-muted-foreground text-center">LEFT:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="ad_l1" checked={data.audio_ad_left_1 === "adequate"} onChange={() => update("audio_ad_left_1", "adequate")} className="w-4 h-4 accent-primary" />
                <span className="text-xs text-foreground/80">Adequate</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="ad_l1" checked={data.audio_ad_left_1 === "inadequate"} onChange={() => update("audio_ad_left_1", "inadequate")} className="w-4 h-4 accent-primary" />
                <span className="text-xs text-foreground/80">Inadequate</span>
              </label>
              <div />
            </div>
            {/* Satisfactory Hearing */}
            <div className="flex items-center gap-3 pt-1">
              <Label className="text-[11px] font-semibold text-foreground/70">Satisfactory Hearing:</Label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="audio_sat" checked={data.audio_satisfactory === "yes"} onChange={() => update("audio_satisfactory", "yes")} className="w-4 h-4 accent-primary" />
                <span className="text-xs text-foreground/80">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="audio_sat" checked={data.audio_satisfactory === "no"} onChange={() => update("audio_satisfactory", "no")} className="w-4 h-4 accent-primary" />
                <span className="text-xs text-foreground/80">No</span>
              </label>
            </div>
          </div>
        </div>

        {/* Speech */}
        <div>
          <SectionHeader
            title="Speech"
            action={<SetNormalButton onClick={() => update("speech_impaired_hearing", "adequate")} disabled={disabled} />}
          />
          <div className="flex items-center gap-3">
            <Label className="text-[11px] font-semibold text-foreground/70">Impaired Hearing Satisfactory:</Label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="speech" checked={data.speech_impaired_hearing === "adequate"} onChange={() => update("speech_impaired_hearing", "adequate")} className="w-4 h-4 accent-primary" />
              <span className="text-xs text-foreground/80">Adequate</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="speech" checked={data.speech_impaired_hearing === "inadequate"} onChange={() => update("speech_impaired_hearing", "inadequate")} className="w-4 h-4 accent-primary" />
              <span className="text-xs text-foreground/80">Inadequate</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
