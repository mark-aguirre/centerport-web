"use client";

import { FormField } from "@/components/common/form-field";
import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { cn } from "@/lib/utils";
import { RADIO_OPTION_LABEL_CLASS } from "@/lib/form-styles";
import { ClipboardCheck } from "lucide-react";

import type { MlcRecord, MlcSectionProps, VisualAid, YesNo } from "./types";
import { createFieldUpdater } from "./utils";

/** Questions included in the authorized physician declaration. */
const DECLARATION_CONDITIONS: { field: keyof MlcRecord; label: string }[] = [
  {
    field: "id_documents_checked",
    label: "Confirmation that identification documents were checked at the point of examination",
  },
  {
    field: "hearing_meets_standards",
    label: "Hearing meets the standards in STCW Code, Section A-I/9?",
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

interface YesNoOptionsProps {
  name: string;
  value: YesNo;
  onChange: (value: Exclude<YesNo, "">) => void;
  disabled?: boolean;
  ariaLabel: string;
}

/** Accessible, consistently styled Yes/No radio controls. */
function YesNoOptions({
  name,
  value,
  onChange,
  disabled,
  ariaLabel,
}: YesNoOptionsProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-4",
        disabled && "pointer-events-none"
      )}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {(["yes", "no"] as const).map((option) => (
        <label key={option} className={RADIO_OPTION_LABEL_CLASS}>
          <input
            type="radio"
            name={name}
            checked={value === option}
            onChange={() => onChange(option)}
            tabIndex={disabled ? -1 : undefined}
            className="h-4 w-4 accent-primary"
            aria-label={`${ariaLabel} - ${option}`}
          />
          <span className="text-xs text-foreground/80 uppercase">{option}</span>
        </label>
      ))}
    </div>
  );
}

/**
 * Declaration completed by the authorized physician for an MLC certificate.
 *
 * The control order and wording follow the supplied declaration form while
 * retaining CenterPort's responsive card and semantic-token styling.
 */
export default function DeclarationSection({
  data,
  onChange,
  disabled,
}: MlcSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  const updateYesNo = (field: keyof MlcRecord, value: Exclude<YesNo, "">) => {
    if (field === "no_limitations" && value === "yes") {
      onChange({ ...data, no_limitations: value, limitations_details: "" });
      return;
    }
    onChange({ ...data, [field]: value });
  };

  const handleSetNormal = () => {
    onChange({
      ...data,
      id_documents_checked: "yes",
      hearing_meets_standards: "yes",
      unaided_hearing_satisfactory: "yes",
      visual_acuity_meets_standards: "yes",
      colour_vision_meets_standards: "yes",
      visual_aids: [],
      fit_for_lookout: "yes",
      no_limitations: "yes",
      limitations_details: "",
      applicant_condition_risk: "no",
    });
  };

  const toggleVisualAid = (aid: Exclude<VisualAid, "none">) => {
    if (disabled) return;

    const selected = (data.visual_aids ?? []).filter((item) => item !== "none");
    const visualAids = selected.includes(aid)
      ? selected.filter((item) => item !== aid)
      : [...selected, aid];

    onChange({ ...data, visual_aids: visualAids });
  };

  return (
    <div className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
      <SectionHeader
        title="Declaration of the Authorized Physician"
        icon={ClipboardCheck}
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
      />

      <div className="space-y-3">
        <div className="overflow-hidden rounded-md border border-primary/10">
          {DECLARATION_CONDITIONS.map((condition) => (
            <div
              key={condition.field}
              className="grid gap-2 border-b border-muted/30 px-3 py-2.5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
            >
              <span className="text-xs font-semibold uppercase leading-relaxed text-foreground/80">
                {condition.label}
              </span>
              <YesNoOptions
                name={condition.field}
                value={data[condition.field] as YesNo}
                onChange={(value) => updateYesNo(condition.field, value)}
                disabled={disabled}
                ariaLabel={condition.label}
              />
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 md:items-end">
          <div className="space-y-1.5">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary/60">
              Visual Aids (tick if worn)
            </span>
            <div
              className={cn(
                "flex flex-wrap items-center gap-5",
                disabled && "pointer-events-none"
              )}
            >
              {(["spectacles", "contact_lenses"] as const).map((aid) => (
                <label key={aid} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.visual_aids?.includes(aid) ?? false}
                    onChange={() => toggleVisualAid(aid)}
                    tabIndex={disabled ? -1 : undefined}
                    className="h-4 w-4 rounded accent-primary"
                    aria-label={`Visual aids - ${aid.replace("_", " ")}`}
                  />
                  <span className="text-xs capitalize text-foreground/80">
                    {aid.replace("_", " ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <FormField
            label="Date of Last Colour Vision Test (DD/MM/YYYY)"
            value={data.date_colour_vision_test}
            onChange={(value) => updateField("date_colour_vision_test", value)}
            type="date"
            disabled={disabled}
          />
        </div>

        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <span className="text-xs font-semibold uppercase text-foreground/80">
            Fit for Look-Out Duties
          </span>
          <YesNoOptions
            name="fit_for_lookout"
            value={data.fit_for_lookout}
            onChange={(value) => updateYesNo("fit_for_lookout", value)}
            disabled={disabled}
            ariaLabel="Fit for Look-Out Duties"
          />
        </div>

        <div className="space-y-2">
          <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <span className="text-xs font-semibold uppercase leading-relaxed text-foreground/80">
              No limitations or restrictions on fitness? If &apos;No&apos;, specify limitations or restrictions
            </span>
            <YesNoOptions
              name="no_limitations"
              value={data.no_limitations}
              onChange={(value) => updateYesNo("no_limitations", value)}
              disabled={disabled}
              ariaLabel="No limitations or restrictions on fitness"
            />
          </div>
          <textarea
            value={data.limitations_details}
            onChange={(event) => updateField("limitations_details", event.target.value)}
            placeholder="Specify limitations or restrictions when the answer is No"
            readOnly={disabled}
            aria-label="Limitations or restrictions details"
            className={cn(
              "h-20 w-full resize-none rounded-md border border-primary/20 bg-white px-3 py-2 text-sm",
              "focus:outline-none focus-visible:border-primary dark:bg-input/30",
              disabled && "pointer-events-none opacity-70"
            )}
          />
        </div>

        <div className="grid gap-2 border-t border-primary/10 pt-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <span className="text-xs font-semibold uppercase leading-relaxed text-foreground/80">
            Is the applicant suffering from any medical condition likely to be aggravated by service at sea, to render the seafarer unfit for such service, or to endanger the health of other persons on board?
          </span>
          <YesNoOptions
            name="applicant_condition_risk"
            value={data.applicant_condition_risk}
            onChange={(value) => updateYesNo("applicant_condition_risk", value)}
            disabled={disabled}
            ariaLabel="Applicant condition risk"
          />
        </div>
      </div>
    </div>
  );
}
