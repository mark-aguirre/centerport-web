"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import {
  MedicalPersonnelDialog,
  type MedicalPersonnel,
} from "@/components/common/medical-personnel-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { MONTH_OPTIONS, YEAR_OPTIONS } from "./constants";
import { createFieldUpdater } from "./utils";
import type { PanamaSectionProps } from "./types";

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
  const update = createFieldUpdater(data, onChange);

  // Dialog state for physician search
  const [physicianDialogOpen, setPhysicianDialogOpen] = useState(false);

  const handleSelectPhysician = (personnel: MedicalPersonnel) => {
    // Combine name + license as "Name and Registration"
    const nameAndReg = personnel.license_no
      ? `${personnel.name} — ${personnel.license_no}`
      : personnel.name;
    onChange({ ...data, physician_name: nameAndReg });
  };

  const inputClasses = cn(
    "h-8 text-xs bg-white border border-primary/30 rounded-md px-2 shadow-sm",
    "hover:border-primary/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20",
    "dark:bg-input/30 transition-colors",
    disabled && "pointer-events-none"
  );

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
        title="vii. Assessment of Fitness for Service at Sea"
        icon={ShieldCheck}
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
        titleStyle={{ textTransform: "none" }}
      />

      {/* Assessment declaration and fitness table */}
      <p className="mb-3 text-xs leading-relaxed text-foreground/80">
        On the basis of the examinee&apos;s personal declaration, my clinical examination and the diagnostic test
        results recorded above, I declare the examinee medically:
      </p>

      <div className="mb-6 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-xs">
          <tbody>
            <tr>
              <td colSpan={2} className="border border-primary/30 p-2">
                <label className={cn("-m-2 flex cursor-pointer items-center gap-2 rounded-sm p-2 transition-colors hover:bg-primary/10", disabled && "pointer-events-none")}>
                  <input
                    type="radio"
                    name="panama_fitness_lookout"
                    checked={data.fitness_lookout === "fit"}
                    onChange={() => update("fitness_lookout", "fit")}
                    className="h-4 w-4 accent-primary"
                    aria-label="Fit for look-out"
                    tabIndex={disabled ? -1 : undefined}
                  />
                  <span className="text-xs text-foreground/80">Fit for look-out</span>
                </label>
              </td>
              <td colSpan={3} className="border border-primary/30 p-2">
                <label className={cn("-m-2 flex cursor-pointer items-center gap-2 rounded-sm p-2 transition-colors hover:bg-primary/10", disabled && "pointer-events-none")}>
                  <input
                    type="radio"
                    name="panama_fitness_lookout"
                    checked={data.fitness_lookout === "not_fit"}
                    onChange={() => update("fitness_lookout", "not_fit")}
                    className="h-4 w-4 accent-primary"
                    aria-label="Not fit for look-out duty"
                    tabIndex={disabled ? -1 : undefined}
                  />
                  <span className="text-xs text-foreground/80">Not fit for look-out duty</span>
                </label>
              </td>
            </tr>
            <tr className="bg-primary/5">
              <th className="w-32 border border-primary/30 p-1.5" />
              <th className="border border-primary/30 p-1.5 text-center text-[11px] font-semibold text-foreground/80">Deck service</th>
              <th className="border border-primary/30 p-1.5 text-center text-[11px] font-semibold text-foreground/80">Engine service</th>
              <th className="border border-primary/30 p-1.5 text-center text-[11px] font-semibold text-foreground/80">Catering service</th>
              <th className="border border-primary/30 p-1.5 text-center text-[11px] font-semibold text-foreground/80">Other services</th>
            </tr>
            {([
              {
                label: "Fit",
                fields: ["fitness_deck_fit", "fitness_engine_fit", "fitness_catering_fit", "fitness_other_fit"],
              },
              {
                label: "Unfit",
                fields: ["fitness_deck_unfit", "fitness_engine_unfit", "fitness_catering_unfit", "fitness_other_unfit"],
              },
            ] as const).map((row) => (
              <tr key={row.label}>
                <th className="border border-primary/30 p-1.5 text-left text-xs font-semibold text-foreground/80">{row.label}</th>
                {row.fields.map((field, index) => (
                  <td key={field} className="border border-primary/30 p-1.5 text-center">
                    <label className={cn("-m-1.5 flex cursor-pointer items-center justify-center rounded-sm p-1.5 transition-colors hover:bg-primary/10", disabled && "pointer-events-none")}>
                      <input
                        type="checkbox"
                        checked={data[field]}
                        onChange={(e) => update(field, e.target.checked)}
                        className="h-4 w-4 rounded accent-primary"
                        aria-label={`${row.label} - ${["Deck", "Engine", "Catering", "Other"][index]} service`}
                        tabIndex={disabled ? -1 : undefined}
                      />
                    </label>
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="border border-primary/30 p-2">
                <label className={cn("-m-2 flex cursor-pointer items-center justify-between gap-2 rounded-sm p-2 transition-colors hover:bg-primary/10", disabled && "pointer-events-none")}>
                  <span className="text-xs text-foreground/80">Without restrictions</span>
                  <input
                    type="radio"
                    name="panama_restriction"
                    checked={data.fitness_restriction === "without"}
                    onChange={() => update("fitness_restriction", "without")}
                    className="h-4 w-4 shrink-0 accent-primary"
                    aria-label="Without restrictions"
                    tabIndex={disabled ? -1 : undefined}
                  />
                </label>
              </td>
              <td className="border border-primary/30 p-2">
                <label className={cn("-m-2 flex cursor-pointer items-center justify-between gap-2 rounded-sm p-2 transition-colors hover:bg-primary/10", disabled && "pointer-events-none")}>
                  <span className="text-xs text-foreground/80">With restrictions</span>
                  <input
                    type="radio"
                    name="panama_restriction"
                    checked={data.fitness_restriction === "with"}
                    onChange={() => update("fitness_restriction", "with")}
                    className="h-4 w-4 shrink-0 accent-primary"
                    aria-label="With restrictions"
                    tabIndex={disabled ? -1 : undefined}
                  />
                </label>
              </td>
              <th className="border border-primary/30 p-2 text-left text-xs font-normal text-foreground/80">Visual aid required</th>
              <td className="border border-primary/30 p-2">
                <label className={cn("-m-2 flex cursor-pointer items-center justify-center gap-2 rounded-sm p-2 transition-colors hover:bg-primary/10", disabled && "pointer-events-none")}>
                  <span className="text-xs text-foreground/80">Yes</span>
                  <input
                    type="radio"
                    name="panama_visual_aid"
                    checked={data.fitness_visual_aid === "yes"}
                    onChange={() => update("fitness_visual_aid", "yes")}
                    className="h-4 w-4 accent-primary"
                    aria-label="Visual aid required - Yes"
                    tabIndex={disabled ? -1 : undefined}
                  />
                </label>
              </td>
              <td className="border border-primary/30 p-2">
                <label className={cn("-m-2 flex cursor-pointer items-center justify-center gap-2 rounded-sm p-2 transition-colors hover:bg-primary/10", disabled && "pointer-events-none")}>
                  <span className="text-xs text-foreground/80">No</span>
                  <input
                    type="radio"
                    name="panama_visual_aid"
                    checked={data.fitness_visual_aid === "no"}
                    onChange={() => update("fitness_visual_aid", "no")}
                    className="h-4 w-4 accent-primary"
                    aria-label="Visual aid required - No"
                    tabIndex={disabled ? -1 : undefined}
                  />
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {data.fitness_restriction === "with" && (
        <div className="mb-6 space-y-1">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-primary/60">
            Describe restrictions (e.g. specific positions, type of ship, trade area):
          </Label>
          <Textarea
            value={data.fitness_restriction_details}
            onChange={(e) => update("fitness_restriction_details", e.target.value)}
            className={cn(
              "h-16 resize-none rounded-md border border-primary/20 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:border-primary dark:bg-input/30",
              disabled && "pointer-events-none"
            )}
            readOnly={disabled}
          />
        </div>
      )}

      {/* Certificate details table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] table-fixed border-collapse text-xs">
          <colgroup>
            <col className="w-[42%]" />
            <col className="w-[15%]" />
            <col className="w-[25%]" />
            <col className="w-[18%]" />
          </colgroup>
          <tbody>
            <tr>
              <th className="border border-primary/30 p-2 text-left text-[11px] font-bold text-foreground/80">
                Medical certificate&apos;s issue date:
              </th>
              <td className="border border-primary/30 p-1.5">
                <FormField label="Day" value={data.cert_issued_day} onChange={(v) => update("cert_issued_day", v)} type="number" disabled={disabled} />
              </td>
              <td className="border border-primary/30 p-1.5">
                <FormSelect label="Month" value={data.cert_issued_month} onChange={(v) => update("cert_issued_month", v)} options={MONTH_OPTIONS} disabled={disabled} />
              </td>
              <td className="border border-primary/30 p-1.5">
                <FormSelect label="Year" value={data.cert_issued_year} onChange={(v) => update("cert_issued_year", v)} options={YEAR_OPTIONS} disabled={disabled} />
              </td>
            </tr>
            <tr>
              <th className="border border-primary/30 p-2 text-left text-[11px] font-bold text-foreground/80">
                Medical certificate&apos;s expiration:
              </th>
              <td className="border border-primary/30 p-1.5">
                <FormField label="Day" value={data.cert_expiry_day} onChange={(v) => update("cert_expiry_day", v)} type="number" disabled={disabled} />
              </td>
              <td className="border border-primary/30 p-1.5">
                <FormSelect label="Month" value={data.cert_expiry_month} onChange={(v) => update("cert_expiry_month", v)} options={MONTH_OPTIONS} disabled={disabled} />
              </td>
              <td className="border border-primary/30 p-1.5">
                <FormSelect label="Year" value={data.cert_expiry_year} onChange={(v) => update("cert_expiry_year", v)} options={YEAR_OPTIONS} disabled={disabled} />
              </td>
            </tr>
            <tr>
              <th className="border border-primary/30 p-2 text-left text-[11px] font-bold text-foreground/80">
                Number of medical certificate issued on the platform:
              </th>
              <td colSpan={3} className="border border-primary/30 p-2">
                <Input
                  value={data.cert_number}
                  onChange={(e) => update("cert_number", e.target.value)}
                  className={inputClasses}
                  aria-label="Medical certificate number"
                  readOnly={disabled}
                />
              </td>
            </tr>
            <tr>
              <th className="border border-primary/30 p-2 text-left text-[11px] font-bold text-foreground/80">
                Physician&apos;s name and registration (typed or printed):
              </th>
              <td colSpan={3} className="border border-primary/30 p-2">
                <div className="flex gap-1.5">
                  <Input
                    value={data.physician_name ?? ""}
                    readOnly
                    placeholder="Select physician..."
                    className={cn(inputClasses, "flex-1")}
                    tabIndex={disabled ? -1 : undefined}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 cursor-pointer border-primary/20 hover:border-primary/40"
                    onClick={() => setPhysicianDialogOpen(true)}
                    disabled={disabled}
                    aria-label="Search physician"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
            <tr>
              <th className="h-24 border border-primary/30 p-2 text-left align-middle text-[11px] font-bold text-foreground/80">
                Signature and stamp of medical practitioner:
              </th>
              <td colSpan={3} className="border border-primary/30 p-2 align-top">
                <Textarea
                  value={data.physician_signature}
                  onChange={(e) => update("physician_signature", e.target.value)}
                  className={cn(
                    "h-20 resize-none rounded-md border border-primary/20 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:border-primary dark:bg-input/30",
                    disabled && "pointer-events-none"
                  )}
                  aria-label="Signature and stamp of medical practitioner"
                  readOnly={disabled}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Medical Personnel Search Dialog */}
      <MedicalPersonnelDialog
        open={physicianDialogOpen}
        onOpenChange={setPhysicianDialogOpen}
        onSelect={handleSelectPhysician}
        title="Select Physician"
        description="Search and select a physician for this certificate."
      />
    </div>
  );
}
