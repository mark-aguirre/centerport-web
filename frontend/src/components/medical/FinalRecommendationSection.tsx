"use client";

import { FormSelect } from "@/components/common/form-select";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RADIO_OPTION_LABEL_CLASS } from "@/lib/form-styles";
import { createFieldUpdater } from "./utils";
import type { MedicalSectionProps } from "./types";

const FINAL_RECOMMENDATION_OPTIONS = [
  "FIT",
  "UNFIT",
  "FIT TO WORK",
  "FIT w/ RESTRICTION",
  "FIT FOR EMPLOYMENT",
  "FIT FOR TRAINING",
  "FIT FOR ENROLLMENT",
  "FIT FOR SEA DUTY",
];

interface CertificationResultRowProps {
  label: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function CertificationResultRow({
  label,
  name,
  value,
  disabled,
  onChange,
}: CertificationResultRowProps) {
  const options = [
    { label: "PASSED", value: "passed" },
    {
      label: "WITH SIGNIFICANT FINDINGS",
      value: "with_significant_findings",
    },
  ];

  return (
    <div className="grid min-h-9 grid-cols-[minmax(330px,1.5fr)_minmax(150px,0.65fr)_minmax(250px,1fr)] items-center gap-3 px-2">
      <span className="text-xs text-foreground/80">{label}:</span>
      {options.map((option) => (
        <label key={option.value} className={RADIO_OPTION_LABEL_CLASS}>
          <input
            type="radio"
            name={name}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            tabIndex={disabled ? -1 : undefined}
            className="h-4 w-4 accent-primary"
            aria-label={`${label} - ${option.label}`}
          />
          <span className="whitespace-nowrap text-xs text-foreground/80">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

/**
 * Final recommendation and certification-results section for the Seabase form.
 */
export function FinalRecommendationSection({
  data,
  onChange,
  disabled,
}: MedicalSectionProps) {
  const update = createFieldUpdater(data, onChange);

  const showRestrictionDetails = (data.final_recommendation ?? "")
    .toUpperCase()
    .includes("RESTRICTION");

  const handleSetNormal = () => {
    onChange({
      ...data,
      cert_basic_ooh: "passed",
      cert_additional_labs: "passed",
      cert_flagpost: "passed",
    });
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm",
        disabled && "pointer-events-none",
      )}
    >
      <div className="flex flex-col gap-2 border-b border-primary/20 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-[165px_minmax(260px,360px)] sm:items-center">
          <h2 className="text-sm font-bold uppercase tracking-wide text-primary">
            IV. Final Recommendation:
          </h2>
          <FormSelect
            label=""
            value={data.final_recommendation}
            onChange={(value) => update("final_recommendation", value)}
            options={FINAL_RECOMMENDATION_OPTIONS}
            disabled={disabled}
          />
        </div>
        <SetNormalButton
          onClick={handleSetNormal}
          disabled={disabled}
          className="self-start sm:self-center"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 border-b border-primary/20 px-3 py-2 sm:grid-cols-[165px_1fr] sm:items-center">
        <label
          htmlFor="recommendation-remarks"
          className="text-xs font-bold text-foreground/80"
        >
          REMARK/Special Needs:
        </label>
        <Input
          id="recommendation-remarks"
          value={data.recommendation_remarks}
          onChange={(event) =>
            update("recommendation_remarks", event.target.value)
          }
          readOnly={disabled}
          tabIndex={disabled ? -1 : undefined}
          className="h-8 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30"
        />
      </div>

      {showRestrictionDetails && (
        <div className="grid grid-cols-1 gap-2 border-b border-primary/20 px-3 py-2 sm:grid-cols-[165px_1fr] sm:items-center">
          <label
            htmlFor="restriction-details"
            className="text-xs font-bold text-foreground/80"
          >
            Restriction Details:
          </label>
          <Input
            id="restriction-details"
            value={data.restriction_details}
            onChange={(event) =>
              update("restriction_details", event.target.value)
            }
            placeholder="Specify the restriction (e.g. specific positions, type of ship, trade area)"
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
            className="h-8 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30"
          />
        </div>
      )}

      <div className="overflow-x-auto bg-muted/10 py-1">
        <div className="min-w-[830px]">
          <CertificationResultRow
            label="Basic DOH Mandatory Medical Examination"
            name="certification-basic-doh"
            value={data.cert_basic_ooh}
            onChange={(value) => update("cert_basic_ooh", value)}
            disabled={disabled}
          />
          <CertificationResultRow
            label="Additional Laboratory Tests"
            name="certification-additional-labs"
            value={data.cert_additional_labs}
            onChange={(value) => update("cert_additional_labs", value)}
            disabled={disabled}
          />
          <CertificationResultRow
            label="Flag/Host Medical and Laboratory Requirements"
            name="certification-flag-host"
            value={data.cert_flagpost}
            onChange={(value) => update("cert_flagpost", value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
