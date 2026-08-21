"use client";

import { SectionHeader } from "@/components/common/section-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import type { PanamaCertificate, PanamaSectionProps, ShipType } from "./types";

const SHIP_TYPE_OPTIONS = [
  { label: "Container", value: "Container" },
  { label: "Tanker", value: "Tanker" },
  { label: "Passenger", value: "Passenger" },
  { label: "Others", value: "Others" },
] as const;

const TRADE_AREA_OPTIONS = [
  { label: "Coastal", value: "Coastal" },
  { label: "Tropical", value: "Tropical" },
  { label: "Worldwide", value: "Worldwide" },
] as const;

const INPUT_CLASSES = cn(
  "h-8 bg-white px-2 text-xs border border-primary/20 rounded-md",
  "transition-colors hover:border-primary/50 focus-visible:border-primary",
  "focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30",
  "disabled:cursor-not-allowed disabled:bg-muted/30 disabled:opacity-70"
);
const LABEL_CLASSES =
  "text-[11px] font-semibold uppercase tracking-wider text-primary/60 whitespace-nowrap";
const ROW_CLASSES =
  "grid grid-cols-1 gap-1.5 py-1.5 md:grid-cols-[200px_minmax(0,1fr)] md:items-center md:gap-3";

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

  const updateShipType = (shipType: Exclude<ShipType, "">) => {
    onChange({
      ...data,
      type_of_ship: shipType,
      type_of_ship_details:
        shipType === "Others" ? data.type_of_ship_details : "",
    });
  };

  return (
    <div className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
      <SectionHeader
        title="General Information"
        icon={Info}
        subtitle="Seafarer identity and assignment details"
      />

      <div className="divide-y divide-primary/10">
        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-full-name" className={LABEL_CLASSES}>
            Fullname:
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
            disabled={disabled}
            className={cn(INPUT_CLASSES, "w-full sm:w-52")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-passport-seaman" className={LABEL_CLASSES}>
            Passport / Seaman No.:
          </Label>
          <Input
            id="panama-passport-seaman"
            value={data.passport_seaman_no}
            disabled
            className={cn(INPUT_CLASSES, "min-w-0")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-home-address" className={LABEL_CLASSES}>
            Home address:
          </Label>
          <Input
            id="panama-home-address"
            value={data.home_address}
            disabled
            className={cn(INPUT_CLASSES, "min-w-0")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-department" className={LABEL_CLASSES}>
            Department:
          </Label>
          <Input
            id="panama-department"
            value={data.department}
            onChange={(event) => update("department", event.target.value)}
            disabled={disabled}
            className={cn(INPUT_CLASSES, "w-full sm:w-72")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-crew-position" className={LABEL_CLASSES}>
            Crew position:
          </Label>
          <Input
            id="panama-crew-position"
            value={data.crew_position}
            disabled
            className={cn(INPUT_CLASSES, "w-full sm:w-72")}
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
            disabled={disabled}
            className={cn(INPUT_CLASSES, "min-w-0")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label htmlFor="panama-routine-duties" className={LABEL_CLASSES}>
            Routine and emergency duties:
          </Label>
          <Input
            id="panama-routine-duties"
            value={data.routine_emergency_duties}
            onChange={(event) =>
              update("routine_emergency_duties", event.target.value)
            }
            disabled={disabled}
            className={cn(INPUT_CLASSES, "min-w-0")}
          />
        </div>

        <div className={ROW_CLASSES}>
          <Label className={LABEL_CLASSES}>Type of ship:</Label>
          <div className="flex min-w-0 flex-col gap-2 py-0.5">
            <div
              className="flex flex-wrap items-center gap-4"
              role="radiogroup"
              aria-label="Type of ship"
            >
              {SHIP_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-1.5",
                    !disabled && "cursor-pointer"
                  )}
                >
                  <input
                    type="radio"
                    name="panama_type_of_ship"
                    checked={data.type_of_ship === option.value}
                    onChange={() => updateShipType(option.value)}
                    disabled={disabled}
                    className="h-4 w-4 accent-primary"
                    aria-label={`Type of ship - ${option.label}`}
                  />
                  <span className="text-xs text-foreground/80">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            <Input
              id="panama-type-of-ship-details"
              value={data.type_of_ship_details}
              onChange={(event) =>
                update("type_of_ship_details", event.target.value)
              }
              disabled={disabled || data.type_of_ship !== "Others"}
              placeholder="Specify other ship type"
              aria-label="Other ship type"
              className={cn(INPUT_CLASSES, "min-w-0")}
            />
          </div>
        </div>

        <div className={cn(ROW_CLASSES, "border-b-0")}>
          <Label className={LABEL_CLASSES}>Trade area:</Label>
          <div
            className="flex flex-wrap items-center gap-4"
            role="radiogroup"
            aria-label="Trade area"
          >
            {TRADE_AREA_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex items-center gap-1.5",
                  !disabled && "cursor-pointer"
                )}
              >
                <input
                  type="radio"
                  name="panama_trade_area"
                  checked={data.trade_area === option.value}
                  onChange={() => update("trade_area", option.value)}
                  disabled={disabled}
                  className="h-4 w-4 accent-primary"
                  aria-label={`Trade area - ${option.label}`}
                />
                <span className="text-xs text-foreground/80">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
