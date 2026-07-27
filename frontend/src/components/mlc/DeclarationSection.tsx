"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { MlcRecord, MlcSectionProps, YesNo, VisualAid } from "./types";

/** Y/N condition questions for the declaration */
const DECLARATION_CONDITIONS: { field: keyof MlcRecord; label: string }[] = [
  {
    field: "id_documents_checked",
    label: "Confirmation that identification documents were checked at the point of examination:",
  },
  {
    field: "hearing_meets_standards",
    label: "Hearing meets the standards in STCW Code, Section A-9?",
  },
  {
    field: "unaided_hearing_satisfactory",
    label: "Unaided hearing satisfactory?",
  },
  {
    field: "visual_acuity_meets_standards",
    label: "Visual acuity meets standards in STCW Code, Section A-I/9?",
  },
  {
    field: "colour_vision_meets_standards",
    label: "Colour vision meets standards in STCW Code, Section A-I/9?",
  },
];

/**
 * Declaration of the Authorized Physician section for the MLC form.
 *
 * Captures: Y/N conditions (hearing, vision, ID docs), visual aids,
 * date of colour vision test, fit for look-out duties, limitations/restrictions,
 * and the applicant condition risk question.
 *
 * In read mode (disabled=true), all controls use pointer-events-none
 * to keep values fully visible while preventing interaction.
 */
export default function DeclarationSection({
  data,
  onChange,
  disabled,
}: MlcSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  const update = (field: keyof MlcRecord, value: string) =>
    onChange({ ...data, [field]: value });

  const toggleVisualAid = (aid: VisualAid) => {
    if (disabled) return;
    const current = data.visual_aids ?? [];
    if (aid === "none") {
      onChange({ ...data, visual_aids: ["none"] });
      return;
    }
    const without = current.filter((a) => a !== "none");
    if (without.includes(aid)) {
      onChange({ ...data, visual_aids: without.filter((a) => a !== aid) });
    } else {
      onChange({ ...data, visual_aids: [...without, aid] });
    }
  };

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader title="Declaration of the Authorized Physician" icon={ClipboardCheck} />
      <div className="space-y-2">
        {/* Y/N Condition Rows */}
        <div className="border border-primary/10 rounded-md overflow-hidden">
          {DECLARATION_CONDITIONS.map((cond) => (
            <div
              key={cond.field}
              className="flex items-center justify-between py-1.5 px-2 border-b border-muted/30 last:border-b-0"
            >
              <span className="text-[10px] text-foreground/80 leading-tight flex-1 pr-2 uppercase font-semibold tracking-wide">
                {cond.label}
              </span>
              <div
                className={cn(
                  "flex items-center gap-3 shrink-0",
                  disabled && "pointer-events-none"
                )}
                role="radiogroup"
                aria-label={cond.label}
              >
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name={cond.field}
                    checked={(data[cond.field] as YesNo) === "yes"}
                    onChange={() => update(cond.field, "yes")}
                    className="w-3.5 h-3.5 accent-primary"
                    aria-label={`${cond.label} - Yes`}
                    tabIndex={disabled ? -1 : undefined}
                  />
                  <span className="text-[10px] text-foreground/70">Yes</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name={cond.field}
                    checked={(data[cond.field] as YesNo) === "no"}
                    onChange={() => update(cond.field, "no")}
                    className="w-3.5 h-3.5 accent-primary"
                    aria-label={`${cond.label} - No`}
                    tabIndex={disabled ? -1 : undefined}
                  />
                  <span className="text-[10px] text-foreground/70">No</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Aids + Date of Colour Vision Test */}
        <div className="grid grid-cols-[1fr_1fr] gap-2 items-end">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
              Visual Aids (tick if worn):
            </span>
            <div className={cn(
              "flex items-center gap-4",
              disabled && "pointer-events-none"
            )}>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="visual_aids"
                  checked={data.visual_aids?.includes("spectacles") ?? false}
                  onChange={() => toggleVisualAid("spectacles")}
                  className="w-3.5 h-3.5 accent-primary"
                  aria-label="Visual Aids - Spectacles"
                  tabIndex={disabled ? -1 : undefined}
                />
                <span className="text-[10px] text-foreground/70">Spectacles</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="visual_aids"
                  checked={data.visual_aids?.includes("contact_lenses") ?? false}
                  onChange={() => toggleVisualAid("contact_lenses")}
                  className="w-3.5 h-3.5 accent-primary"
                  aria-label="Visual Aids - Contact Lenses"
                  tabIndex={disabled ? -1 : undefined}
                />
                <span className="text-[10px] text-foreground/70">Contact Lenses</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="visual_aids"
                  checked={data.visual_aids?.includes("none") ?? false}
                  onChange={() => toggleVisualAid("none")}
                  className="w-3.5 h-3.5 accent-primary"
                  aria-label="Visual Aids - None"
                  tabIndex={disabled ? -1 : undefined}
                />
                <span className="text-[10px] text-foreground/70">None</span>
              </label>
            </div>
          </div>
          <FormField
            label="Date of Last Colour Vision Test (DD/MM/YYYY)"
            value={data.date_colour_vision_test}
            onChange={(v) => updateField("date_colour_vision_test", v)}
            type="date"
            disabled={disabled}
          />
        </div>

        {/* Fit for Look-Out Duties */}
        <div className={cn(
          "flex items-center gap-3",
          disabled && "pointer-events-none"
        )}>
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wide shrink-0">
            Fit for Look-Out Duties:
          </span>
          <div className="flex items-center gap-3" role="radiogroup" aria-label="Fit for Look-Out Duties">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="fit_for_lookout"
                checked={data.fit_for_lookout === "yes"}
                onChange={() => update("fit_for_lookout", "yes")}
                className="w-3.5 h-3.5 accent-primary"
                aria-label="Fit for Look-Out Duties - Yes"
                tabIndex={disabled ? -1 : undefined}
              />
              <span className="text-[10px] text-foreground/70">Yes</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="fit_for_lookout"
                checked={data.fit_for_lookout === "no"}
                onChange={() => update("fit_for_lookout", "no")}
                className="w-3.5 h-3.5 accent-primary"
                aria-label="Fit for Look-Out Duties - No"
                tabIndex={disabled ? -1 : undefined}
              />
              <span className="text-[10px] text-foreground/70">No</span>
            </label>
          </div>
        </div>

        {/* Limitations or Restrictions */}
        <div className="space-y-1">
          <div className={cn(
            "flex items-center justify-between",
            disabled && "pointer-events-none"
          )}>
            <span className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
              No limitations or restrictions on fitness? If &apos;No&apos; specify limitations or restrictions:
            </span>
            <div className="flex items-center gap-3 shrink-0" role="radiogroup" aria-label="No limitations or restrictions on fitness">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="no_limitations"
                  checked={data.no_limitations === "yes"}
                  onChange={() => update("no_limitations", "yes")}
                  className="w-3.5 h-3.5 accent-primary"
                  aria-label="No limitations - Yes"
                  tabIndex={disabled ? -1 : undefined}
                />
                <span className="text-[10px] text-foreground/70">Yes</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="no_limitations"
                  checked={data.no_limitations === "no"}
                  onChange={() => update("no_limitations", "no")}
                  className="w-3.5 h-3.5 accent-primary"
                  aria-label="No limitations - No"
                  tabIndex={disabled ? -1 : undefined}
                />
                <span className="text-[10px] text-foreground/70">No</span>
              </label>
            </div>
          </div>
          <textarea
            value={data.limitations_details}
            onChange={(e) => updateField("limitations_details", e.target.value)}
            placeholder="Specify limitations or restrictions if NO..."
            className={cn(
              "w-full h-16 text-xs bg-white border border-primary/20 rounded px-2 py-1.5",
              "focus:outline-none focus:border-primary dark:bg-input/30 resize-none",
              disabled && "pointer-events-none"
            )}
            aria-label="Limitations or restrictions details"
            readOnly={disabled}
          />
        </div>

        {/* Applicant Condition Risk */}
        <div className="space-y-1.5 border-t border-primary/10 pt-2">
          <span className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider leading-tight block">
            Is applicant suffering from any medical condition likely to be aggravated by service at sea or to render the seafarer unfit for such service or to endanger the health of other persons on board?
          </span>
          <div className={cn(
            "flex items-center gap-3",
            disabled && "pointer-events-none"
          )} role="radiogroup" aria-label="Applicant condition risk">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="applicant_condition_risk"
                checked={data.applicant_condition_risk === "yes"}
                onChange={() => update("applicant_condition_risk", "yes")}
                className="w-3.5 h-3.5 accent-primary"
                aria-label="Applicant condition risk - Yes"
                tabIndex={disabled ? -1 : undefined}
              />
              <span className="text-[10px] text-foreground/70">Yes</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="applicant_condition_risk"
                checked={data.applicant_condition_risk === "no"}
                onChange={() => update("applicant_condition_risk", "no")}
                className="w-3.5 h-3.5 accent-primary"
                aria-label="Applicant condition risk - No"
                tabIndex={disabled ? -1 : undefined}
              />
              <span className="text-[10px] text-foreground/70">No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
