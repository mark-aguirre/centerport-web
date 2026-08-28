"use client";

import { SectionHeader } from "@/components/common/section-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import type {
  PanamaCertificate,
  PanamaSectionProps,
  ShipType,
  TradeArea,
} from "./types";

const VESSEL_TYPE_OPTIONS = [
  { label: "Container", value: "Container" },
  { label: "Tanker", value: "Tanker" },
  { label: "Passenger", value: "Passenger" },
] as const;

const SAILING_AREA_OPTIONS = [
  { label: "Near-Coastal", value: "Near-Coastal" },
  { label: "Oceangoing", value: "Oceangoing" },
] as const;

const INPUT_CLASSES = cn(
  "h-8 rounded-md border border-primary/20 bg-white px-2 text-xs",
  "transition-colors hover:border-primary/50 focus-visible:border-primary",
  "focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30",
  "disabled:cursor-not-allowed disabled:pointer-events-none"
);
const TEXTAREA_CLASSES = cn(
  "min-h-16 resize-none rounded-md border border-primary/20 bg-white px-3 py-2 text-sm",
  "transition-colors hover:border-primary/50 focus-visible:border-primary",
  "focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30",
  "disabled:cursor-not-allowed disabled:pointer-events-none"
);
const LABEL_CLASSES =
  "text-[11px] font-semibold uppercase leading-snug tracking-wider text-primary/60";
const ROW_CLASSES =
  "grid grid-cols-1 gap-1.5 py-1.5 md:grid-cols-[260px_minmax(0,1fr)] md:items-center md:gap-3";

/**
 * Panama Medical Certificate General Information section.
 *
 * Profile-owned identity fields are displayed read-only. Certificate-owned
 * assignment fields follow the page edit state and are persisted with the
 * Panama certificate.
 */
export default function GeneralInfoSection({
  data,
  onChange,
  disabled = true,
}: PanamaSectionProps) {
  const update = <K extends keyof PanamaCertificate>(
    field: K,
    value: PanamaCertificate[K]
  ) => onChange({ ...data, [field]: value });

  const updateVesselType = (vesselType: Exclude<ShipType, "" | "Others">) => {
    onChange({
      ...data,
      type_of_ship: vesselType,
      type_of_ship_details: "",
    });
  };

  const updateOtherVesselType = (details: string) => {
    onChange({ ...data, type_of_ship: "Others", type_of_ship_details: details });
  };

  const updateSailingArea = (sailingArea: Exclude<TradeArea, "" | "Others">) => {
    onChange({
      ...data,
      trade_area: sailingArea,
      trade_area_details: "",
    });
  };

  const updateOtherSailingArea = (details: string) => {
    onChange({ ...data, trade_area: "Others", trade_area_details: details });
  };

  return (
    <div className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
      <SectionHeader
        title="I. General Information"
        icon={Info}
        subtitle="Seafarer identity and assignment details"
      />

      <div className="divide-y divide-primary/10">
        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-full-name" className={LABEL_CLASSES}>
            Name (last, first, middle):
          </Label>
          <Input
            id="panama-full-name"
            value={data.full_name}
            disabled
            className={cn(INPUT_CLASSES, "min-w-0")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label className={LABEL_CLASSES}>Date of birth:</Label>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="panama-birth-day" className={LABEL_CLASSES}>
                Day:
              </Label>
              <Input
                id="panama-birth-day"
                value={data.day}
                disabled
                className={cn(INPUT_CLASSES, "w-16")}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Label htmlFor="panama-birth-month" className={LABEL_CLASSES}>
                Month:
              </Label>
              <Input
                id="panama-birth-month"
                value={data.month}
                disabled
                className={cn(INPUT_CLASSES, "w-20")}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Label htmlFor="panama-birth-year" className={LABEL_CLASSES}>
                Year:
              </Label>
              <Input
                id="panama-birth-year"
                value={data.year}
                disabled
                className={cn(INPUT_CLASSES, "w-20")}
              />
            </div>
          </div>
        </div>

        <div className={ROW_CLASSES}>
          <Label className={LABEL_CLASSES}>Sex:</Label>
          <div className="flex items-center gap-4" role="radiogroup" aria-label="Sex">
            {(["Male", "Female"] as const).map((sex) => (
              <label key={sex} className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="panama_sex"
                  checked={data.sex === sex}
                  disabled
                  className="h-4 w-4 accent-primary"
                  aria-label={`Sex - ${sex}`}
                />
                <span className="text-xs text-foreground/80">{sex}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-rh-typing" className={LABEL_CLASSES}>
            RH Typing:
          </Label>
          <Input
            id="panama-rh-typing"
            value={data.rh_typing}
            onChange={(event) => update("rh_typing", event.target.value)}
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
            className={cn(INPUT_CLASSES, "w-full sm:w-52")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-home-address" className={LABEL_CLASSES}>
            Home address:
          </Label>
          <Input
            id="panama-home-address"
            value={data.home_address}
            readOnly
            tabIndex={-1}
            className={cn(INPUT_CLASSES, "min-w-0")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-passport-number" className={LABEL_CLASSES}>
            Passport No. :
          </Label>
          <Input
            id="panama-passport-number"
            value={data.passport_no}
            readOnly
            tabIndex={-1}
            className={cn(INPUT_CLASSES, "min-w-0")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-seaman-book-number" className={LABEL_CLASSES}>
            Seaman Book No:
          </Label>
          <Input
            id="panama-seaman-book-number"
            value={data.seamans_book_no}
            readOnly
            tabIndex={-1}
            className={cn(INPUT_CLASSES, "min-w-0")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-department" className={LABEL_CLASSES}>
            Department (deck/engine/radio communication/food handlers/other):
          </Label>
          <Input
            id="panama-department"
            value={data.department}
            onChange={(event) => update("department", event.target.value)}
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
            className={cn(INPUT_CLASSES, "min-w-0")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-crew-position" className={LABEL_CLASSES}>
            Crew positions:
          </Label>
          <Input
            id="panama-crew-position"
            value={data.crew_position}
            readOnly
            tabIndex={-1}
            className={cn(INPUT_CLASSES, "min-w-0")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-lookout-duties" className={LABEL_CLASSES}>
            Does perform lookout duties:
          </Label>
          <Input
            id="panama-lookout-duties"
            value={data.lookout_duties}
            onChange={(event) => update("lookout_duties", event.target.value)}
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
            className={cn(INPUT_CLASSES, "min-w-0")}
          />
        </div>

        <div className={cn(ROW_CLASSES, "md:items-start")}>
          <Label htmlFor="panama-routine-duties" className={cn(LABEL_CLASSES, "md:pt-2")}>
            Routine duties:
          </Label>
          <Textarea
            id="panama-routine-duties"
            value={data.routine_duties}
            onChange={(event) => update("routine_duties", event.target.value)}
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
            className={TEXTAREA_CLASSES}
          />
        </div>

        <div className={cn(ROW_CLASSES, "md:items-start")}>
          <Label htmlFor="panama-emergency-duties" className={cn(LABEL_CLASSES, "md:pt-2")}>
            Emergency duties:
          </Label>
          <Textarea
            id="panama-emergency-duties"
            value={data.emergency_duties}
            onChange={(event) => update("emergency_duties", event.target.value)}
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
            className={TEXTAREA_CLASSES}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label className={LABEL_CLASSES}>Type of vessel:</Label>
          <div className="flex min-w-0 flex-col gap-2 py-0.5">
            <div
              className={cn("flex flex-wrap items-center gap-4", disabled && "pointer-events-none")}
              role="radiogroup"
              aria-label="Type of vessel"
            >
              {VESSEL_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="panama_type_of_vessel"
                    checked={data.type_of_ship === option.value}
                    onChange={() => updateVesselType(option.value)}
                    className="h-4 w-4 accent-primary"
                    aria-label={`Type of vessel - ${option.label}`}
                    tabIndex={disabled ? -1 : undefined}
                  />
                  <span className="text-xs text-foreground/80">{option.label}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="panama-type-of-vessel-details" className={LABEL_CLASSES}>
                Others:
              </Label>
              <Input
                id="panama-type-of-vessel-details"
                value={data.type_of_ship_details}
                onChange={(event) => updateOtherVesselType(event.target.value)}
                readOnly={disabled}
                tabIndex={disabled ? -1 : undefined}
                aria-label="Other vessel type"
                className={cn(INPUT_CLASSES, "min-w-0 flex-1")}
              />
            </div>
          </div>
        </div>

        <div className={cn(ROW_CLASSES, "border-b-0")}>
          <Label className={LABEL_CLASSES}>Sailing area:</Label>
          <div className="flex min-w-0 flex-col gap-2 py-0.5">
            <div
              className={cn("flex flex-wrap items-center gap-4", disabled && "pointer-events-none")}
              role="radiogroup"
              aria-label="Sailing area"
            >
              {SAILING_AREA_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="panama_sailing_area"
                    checked={data.trade_area === option.value}
                    onChange={() => updateSailingArea(option.value)}
                    className="h-4 w-4 accent-primary"
                    aria-label={`Sailing area - ${option.label}`}
                    tabIndex={disabled ? -1 : undefined}
                  />
                  <span className="text-xs text-foreground/80">{option.label}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="panama-sailing-area-details" className={LABEL_CLASSES}>
                Others:
              </Label>
              <Input
                id="panama-sailing-area-details"
                value={data.trade_area_details}
                onChange={(event) => updateOtherSailingArea(event.target.value)}
                readOnly={disabled}
                tabIndex={disabled ? -1 : undefined}
                aria-label="Other sailing area"
                className={cn(INPUT_CLASSES, "min-w-0 flex-1")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
