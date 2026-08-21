"use client";

import { FormSelect } from "@/components/common/form-select";
import { cn } from "@/lib/utils";
import type { MedicalExam, MedicalSectionProps } from "./types";

const HEARING_OPTIONS = ["Adequate", "Inadequate"];
const YES_NO_OPTIONS = ["Yes", "No"];

interface HearingRadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

function HearingRadioGroup({
  label,
  name,
  value,
  onChange,
}: HearingRadioGroupProps) {
  return (
    <div
      className="flex items-center gap-3"
      role="radiogroup"
      aria-label={`${label} hearing`}
    >
      <span className="w-11 shrink-0 text-[11px] font-bold uppercase text-primary/70">
        {label}:
      </span>
      {HEARING_OPTIONS.map((option) => {
        const normalizedValue = option.toLowerCase();

        return (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-1.5"
          >
            <input
              type="radio"
              name={name}
              checked={value === normalizedValue}
              onChange={() => onChange(normalizedValue)}
              className="h-4 w-4 accent-primary"
              aria-label={`${label} hearing - ${option}`}
            />
            <span className="text-xs text-foreground/80">{option}</span>
          </label>
        );
      })}
    </div>
  );
}

/**
 * Audiometry and speech section matching the Seabase examination form.
 *
 * The Audiometry heading spans the hearing-meter and STCW panels, while the
 * Speech heading labels the right-hand assessment panel. The medical-condition
 * question spans the full card below those three columns.
 */
export function AudiometrySpeechSection({
  data,
  onChange,
  disabled,
}: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm",
        disabled && "pointer-events-none",
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1.05fr_0.6fr]">
        <div className="border-b border-primary/20 bg-muted px-3 py-1.5 text-center text-sm font-bold uppercase tracking-widest text-foreground lg:col-span-2 lg:border-r">
          Audiometry
        </div>
        <div className="border-b border-primary/20 bg-muted px-3 py-1.5 text-center text-sm font-bold uppercase tracking-widest text-foreground">
          Speech
        </div>

        <div className="space-y-2 border-b border-primary/20 p-3 lg:border-b-0 lg:border-r">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary/70">
            Hearing by Audio Metry
          </p>
          <div className="grid grid-cols-[minmax(110px,0.75fr)_minmax(250px,1.25fr)] gap-4">
            <div className="space-y-2">
              <FormSelect
                label="AD"
                value={data.audio_ad_right_2}
                onChange={(value) => update("audio_ad_right_2", value)}
                options={HEARING_OPTIONS}
                disabled={disabled}
              />
              <FormSelect
                label="AS"
                value={data.audio_as_left_2}
                onChange={(value) => update("audio_as_left_2", value)}
                options={HEARING_OPTIONS}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col justify-center gap-3">
              <HearingRadioGroup
                label="Right"
                name="audio-right"
                value={data.audio_ad_right_1}
                onChange={(value) => update("audio_ad_right_1", value)}
              />
              <HearingRadioGroup
                label="Left"
                name="audio-left"
                value={data.audio_as_left_1}
                onChange={(value) => update("audio_as_left_1", value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 border-b border-primary/20 p-3 lg:border-b-0 lg:border-r">
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary/70">
            Meets Standards in STCW Code, Section A-I/9:
          </p>
          <FormSelect
            label="Satisfactory Hearing"
            value={data.audio_satisfactory}
            onChange={(value) => update("audio_satisfactory", value)}
            options={YES_NO_OPTIONS}
            disabled={disabled}
          />
          <FormSelect
            label="Unaided Hearing Satisfactory"
            value={data.audio_unaided_hearing}
            onChange={(value) => update("audio_unaided_hearing", value)}
            options={YES_NO_OPTIONS}
            disabled={disabled}
          />
        </div>

        <div
          className="flex items-center justify-center gap-4 p-3 lg:flex-col"
          role="radiogroup"
          aria-label="Speech assessment"
        >
          {HEARING_OPTIONS.map((option) => {
            const normalizedValue = option.toLowerCase();

            return (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-1.5"
              >
                <input
                  type="radio"
                  name="speech-assessment"
                  checked={data.speech_impaired_hearing === normalizedValue}
                  onChange={() =>
                    update("speech_impaired_hearing", normalizedValue)
                  }
                  className="h-4 w-4 accent-primary"
                  aria-label={`Speech assessment - ${option}`}
                />
                <span className="text-xs text-foreground/80">{option}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-primary/20 px-3 py-2 sm:flex-row sm:items-center">
        <p className="flex-1 text-xs font-semibold uppercase leading-relaxed text-primary/80">
          Is applicant suffering from any medical condition likely to be
          aggravated by service at sea or to render the seafarer unfit for such
          service or to endanger the health of other persons on board?
        </p>
        <FormSelect
          label=""
          value={data.condition_aggravated_sea}
          onChange={(value) => update("condition_aggravated_sea", value)}
          options={YES_NO_OPTIONS}
          disabled={disabled}
          className="w-full shrink-0 sm:w-28"
        />
      </div>
    </div>
  );
}
