"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PanamaSectionProps, PanamaCertificate } from "./types";

const MONTH_OPTIONS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Panama Medical Certificate — Assessment of Fitness for Service at Sea (Section VII).
 *
 * Captures:
 * - Fit/Not fit for lookout duty radio
 * - Service type table (Deck/Engine/Catering/Other) with Fit/Unfit checkboxes
 * - Restriction options (radio + details)
 * - Visual aid required
 * - Certificate dates (expiry, issued)
 * - Physician details
 */
export default function FitnessAssessmentSection({ data, onChange, disabled }: PanamaSectionProps) {
  const update = (field: keyof PanamaCertificate, value: string) =>
    onChange({ ...data, [field]: value });

  const updateBool = (field: keyof PanamaCertificate, value: boolean) =>
    onChange({ ...data, [field]: value });

  /** Set fitness to fit for all services, no restrictions, fit for lookout. */
  const handleSetNormal = () => {
    onChange({
      ...data,
      fitness_lookout: "fit",
      fitness_deck_fit: true,
      fitness_deck_unfit: false,
      fitness_engine_fit: true,
      fitness_engine_unfit: false,
      fitness_catering_fit: true,
      fitness_catering_unfit: false,
      fitness_other_fit: true,
      fitness_other_unfit: false,
      fitness_restriction: "without",
      fitness_restriction_details: "",
      fitness_visual_aid: "no",
    });
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="Assessment of Fitness for Service at Sea"
        icon={ShieldCheck}
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
      />

      {/* Intro text */}
      <p className="text-xs text-foreground/80 mb-3">
        On the basis of the examinee&apos;s personal declaration, my clinical examination and the diagnostic test results recorded above, I declare the examinee medically:
      </p>

      {/* Fit for lookout / Not fit */}
      <div className={cn("flex items-center gap-6 mb-4", disabled && "pointer-events-none")} role="radiogroup" aria-label="Lookout fitness">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            name="panama_fitness_lookout"
            checked={data.fitness_lookout === "fit"}
            onChange={() => update("fitness_lookout", "fit")}
            className="w-4 h-4 accent-primary"
            aria-label="Fit for look out"
            tabIndex={disabled ? -1 : undefined}
          />
          <span className="text-xs text-foreground/80 font-semibold">Fit for look out</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            name="panama_fitness_lookout"
            checked={data.fitness_lookout === "not_fit"}
            onChange={() => update("fitness_lookout", "not_fit")}
            className="w-4 h-4 accent-primary"
            aria-label="Not fit for look out duty"
            tabIndex={disabled ? -1 : undefined}
          />
          <span className="text-xs text-foreground/80 font-semibold">Not fit for look out duty</span>
        </label>
      </div>

      {/* Service type table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-primary/20 bg-primary/5 p-2" />
              <th className="border border-primary/20 bg-primary/5 p-2 text-center text-[11px] font-bold text-primary uppercase tracking-wider">
                Deck service
              </th>
              <th className="border border-primary/20 bg-primary/5 p-2 text-center text-[11px] font-bold text-primary uppercase tracking-wider">
                Engine service
              </th>
              <th className="border border-primary/20 bg-primary/5 p-2 text-center text-[11px] font-bold text-primary uppercase tracking-wider">
                Catering service
              </th>
              <th className="border border-primary/20 bg-primary/5 p-2 text-center text-[11px] font-bold text-primary uppercase tracking-wider">
                Other service
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Fit row */}
            <tr>
              <td className="border border-primary/20 p-2 text-xs font-semibold text-foreground/80">Fit</td>
              <td className="border border-primary/20 p-2 text-center">
                <label className={cn("flex items-center justify-center cursor-pointer", disabled && "pointer-events-none")}>
                  <input type="checkbox" checked={data.fitness_deck_fit} onChange={(e) => updateBool("fitness_deck_fit", e.target.checked)} className="w-4 h-4 accent-primary rounded" aria-label="Fit - Deck service" tabIndex={disabled ? -1 : undefined} />
                </label>
              </td>
              <td className="border border-primary/20 p-2 text-center">
                <label className={cn("flex items-center justify-center cursor-pointer", disabled && "pointer-events-none")}>
                  <input type="checkbox" checked={data.fitness_engine_fit} onChange={(e) => updateBool("fitness_engine_fit", e.target.checked)} className="w-4 h-4 accent-primary rounded" aria-label="Fit - Engine service" tabIndex={disabled ? -1 : undefined} />
                </label>
              </td>
              <td className="border border-primary/20 p-2 text-center">
                <label className={cn("flex items-center justify-center cursor-pointer", disabled && "pointer-events-none")}>
                  <input type="checkbox" checked={data.fitness_catering_fit} onChange={(e) => updateBool("fitness_catering_fit", e.target.checked)} className="w-4 h-4 accent-primary rounded" aria-label="Fit - Catering service" tabIndex={disabled ? -1 : undefined} />
                </label>
              </td>
              <td className="border border-primary/20 p-2 text-center">
                <label className={cn("flex items-center justify-center cursor-pointer", disabled && "pointer-events-none")}>
                  <input type="checkbox" checked={data.fitness_other_fit} onChange={(e) => updateBool("fitness_other_fit", e.target.checked)} className="w-4 h-4 accent-primary rounded" aria-label="Fit - Other service" tabIndex={disabled ? -1 : undefined} />
                </label>
              </td>
            </tr>
            {/* Unfit row */}
            <tr>
              <td className="border border-primary/20 p-2 text-xs font-semibold text-foreground/80">Unfit</td>
              <td className="border border-primary/20 p-2 text-center">
                <label className={cn("flex items-center justify-center cursor-pointer", disabled && "pointer-events-none")}>
                  <input type="checkbox" checked={data.fitness_deck_unfit} onChange={(e) => updateBool("fitness_deck_unfit", e.target.checked)} className="w-4 h-4 accent-primary rounded" aria-label="Unfit - Deck service" tabIndex={disabled ? -1 : undefined} />
                </label>
              </td>
              <td className="border border-primary/20 p-2 text-center">
                <label className={cn("flex items-center justify-center cursor-pointer", disabled && "pointer-events-none")}>
                  <input type="checkbox" checked={data.fitness_engine_unfit} onChange={(e) => updateBool("fitness_engine_unfit", e.target.checked)} className="w-4 h-4 accent-primary rounded" aria-label="Unfit - Engine service" tabIndex={disabled ? -1 : undefined} />
                </label>
              </td>
              <td className="border border-primary/20 p-2 text-center">
                <label className={cn("flex items-center justify-center cursor-pointer", disabled && "pointer-events-none")}>
                  <input type="checkbox" checked={data.fitness_catering_unfit} onChange={(e) => updateBool("fitness_catering_unfit", e.target.checked)} className="w-4 h-4 accent-primary rounded" aria-label="Unfit - Catering service" tabIndex={disabled ? -1 : undefined} />
                </label>
              </td>
              <td className="border border-primary/20 p-2 text-center">
                <label className={cn("flex items-center justify-center cursor-pointer", disabled && "pointer-events-none")}>
                  <input type="checkbox" checked={data.fitness_other_unfit} onChange={(e) => updateBool("fitness_other_unfit", e.target.checked)} className="w-4 h-4 accent-primary rounded" aria-label="Unfit - Other service" tabIndex={disabled ? -1 : undefined} />
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Restrictions */}
      <div className="mb-4">
        <div className="flex items-center gap-6 mb-2 flex-wrap">
          {/* Restriction type */}
          <div className={cn("flex items-center gap-4", disabled && "pointer-events-none")} role="radiogroup" aria-label="Restrictions">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="panama_restriction"
                checked={data.fitness_restriction === "without"}
                onChange={() => update("fitness_restriction", "without")}
                className="w-4 h-4 accent-primary"
                aria-label="Restriction - Without restrictions"
                tabIndex={disabled ? -1 : undefined}
              />
              <span className="text-xs text-foreground/80">W/o restrictions</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="panama_restriction"
                checked={data.fitness_restriction === "with"}
                onChange={() => update("fitness_restriction", "with")}
                className="w-4 h-4 accent-primary"
                aria-label="Restriction - With restrictions"
                tabIndex={disabled ? -1 : undefined}
              />
              <span className="text-xs text-foreground/80">With restrictions</span>
            </label>
          </div>

          {/* Visual aid required */}
          <div className={cn("flex items-center gap-4", disabled && "pointer-events-none")} role="radiogroup" aria-label="Visual aid required">
            <span className="text-xs text-foreground/80 font-semibold">Visual aid required</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="panama_visual_aid"
                checked={data.fitness_visual_aid === "yes"}
                onChange={() => update("fitness_visual_aid", "yes")}
                className="w-4 h-4 accent-primary"
                aria-label="Visual aid required - Yes"
                tabIndex={disabled ? -1 : undefined}
              />
              <span className="text-xs text-foreground/80">Yes</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="panama_visual_aid"
                checked={data.fitness_visual_aid === "no"}
                onChange={() => update("fitness_visual_aid", "no")}
                className="w-4 h-4 accent-primary"
                aria-label="Visual aid required - No"
                tabIndex={disabled ? -1 : undefined}
              />
              <span className="text-xs text-foreground/80">No</span>
            </label>
          </div>
        </div>

        {/* Restriction details */}
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Describe restrictions (e.g. specific positions, type of ship, trade area):
          </Label>
          <Textarea
            value={data.fitness_restriction_details}
            onChange={(e) => update("fitness_restriction_details", e.target.value)}
            className={cn(
              "h-16 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none",
              disabled && "pointer-events-none"
            )}
            placeholder=""
            readOnly={disabled}
          />
        </div>
      </div>

      {/* Certificate details */}
      <div className="border-t border-primary/10 pt-4 space-y-3">
        {/* Expiry & Issued dates — side by side */}
        <div className="grid grid-cols-2 gap-6">
          {/* Expiry date */}
          <div className="grid grid-cols-3 gap-2">
            <FormField
              label="Expiry Day"
              value={data.cert_expiry_day}
              onChange={(v) => update("cert_expiry_day", v)}
              type="number"
              disabled={disabled}
            />
            <FormSelect
              label="Expiry Month"
              value={data.cert_expiry_month}
              onChange={(v) => update("cert_expiry_month", v)}
              options={MONTH_OPTIONS}
              disabled={disabled}
            />
            <FormField
              label="Expiry Year"
              value={data.cert_expiry_year}
              onChange={(v) => update("cert_expiry_year", v)}
              type="number"
              disabled={disabled}
            />
          </div>

          {/* Issued date */}
          <div className="grid grid-cols-3 gap-2">
            <FormField
              label="Issued Day"
              value={data.cert_issued_day}
              onChange={(v) => update("cert_issued_day", v)}
              type="number"
              disabled={disabled}
            />
            <FormSelect
              label="Issued Month"
              value={data.cert_issued_month}
              onChange={(v) => update("cert_issued_month", v)}
              options={MONTH_OPTIONS}
              disabled={disabled}
            />
            <FormField
              label="Issued Year"
              value={data.cert_issued_year}
              onChange={(v) => update("cert_issued_year", v)}
              type="number"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Certificate number — full width */}
        <div>
          <FormField
            label="Certificate Number"
            value={data.cert_number}
            onChange={(v) => update("cert_number", v)}
            disabled={disabled}
          />
        </div>

        {/* Physician details — 2 columns */}
        <div className="grid grid-cols-2 gap-6">
          <FormField
            label="Physician's Name and Registration"
            value={data.physician_name}
            onChange={(v) => update("physician_name", v)}
            disabled={disabled}
          />
          <FormField
            label="Signature and Stamp"
            value={data.physician_signature}
            onChange={(v) => update("physician_signature", v)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
