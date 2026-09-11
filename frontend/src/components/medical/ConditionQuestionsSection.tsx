"use client";

import { SetNormalButton } from "@/components/common/set-normal-button";
import { cn } from "@/lib/utils";
import { RADIO_OPTION_LABEL_CLASS } from "@/lib/form-styles";
import { createFieldUpdater } from "./utils";
import type { MedicalSectionProps } from "./types";

/**
 * Identification-document confirmation for the Physical Examination form.
 *
 * The sea-service condition is rendered in AudiometrySpeechSection. Fit for
 * Look-out Duties is rendered immediately below this confirmation row.
 */
export function ConditionQuestionsSection({
  data,
  onChange,
  disabled,
}: MedicalSectionProps) {
  const update = createFieldUpdater(data, onChange);

  const handleSetNormal = () => {
    onChange({
      ...data,
      identification_docs_checked: "yes",
      fit_for_lookout: "yes",
    });
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-primary/10 bg-card p-3 shadow-sm",
        disabled && "pointer-events-none",
      )}
    >
      <div className="mb-2 flex justify-end">
        <SetNormalButton onClick={handleSetNormal} disabled={disabled} />
      </div>

      <div className="mx-auto grid w-fit grid-cols-[auto_auto] items-center gap-x-4">
        <div
          className="col-span-2 grid grid-cols-subgrid items-center border-b border-primary/20 pb-2"
          role="radiogroup"
          aria-label="Identification documents checked"
        >
          <span className="whitespace-nowrap text-right text-xs font-semibold uppercase text-foreground/80">
            Confirmation that identification documents were checked at the point
            of examination:
          </span>
          <div className="grid grid-cols-2 justify-items-start gap-4">
            {[
              ["yes", "Yes"],
              ["no", "No"],
            ].map(([value, label]) => (
              <label key={value} className={RADIO_OPTION_LABEL_CLASS}>
                <input
                  type="radio"
                  name="id-documents-checked"
                  checked={data.identification_docs_checked === value}
                  onChange={() => update("identification_docs_checked", value)}
                  tabIndex={disabled ? -1 : undefined}
                  className="h-4 w-4 accent-primary"
                  aria-label={`Identification documents checked - ${label}`}
                />
                <span className="text-xs text-foreground/80">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div
          className="col-span-2 grid grid-cols-subgrid items-center pt-2"
          role="radiogroup"
          aria-label="Fit for look-out duties"
        >
          <span className="whitespace-nowrap text-right text-xs font-bold uppercase tracking-wide text-primary">
            Fit for Look-out Duties:
          </span>
          <div className="grid grid-cols-2 justify-items-start gap-4">
            {[
              ["yes", "Yes"],
              ["no", "No"],
            ].map(([value, label]) => (
              <label key={value} className={RADIO_OPTION_LABEL_CLASS}>
                <input
                  type="radio"
                  name="fit-for-lookout"
                  checked={data.fit_for_lookout === value}
                  onChange={() => update("fit_for_lookout", value)}
                  tabIndex={disabled ? -1 : undefined}
                  className="h-4 w-4 accent-primary"
                  aria-label={`Fit for look-out duties - ${label}`}
                />
                <span className="text-xs text-foreground/80">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
