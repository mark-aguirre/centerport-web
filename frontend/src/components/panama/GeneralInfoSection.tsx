"use client";

import { SectionHeader } from "@/components/common/section-header";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PanamaSectionProps, PanamaCertificate } from "./types";

const SHIP_TYPE_OPTIONS = [
  { label: "Container", value: "Container" },
  { label: "Tanker", value: "Tanker" },
  { label: "Passenger", value: "Passenger" },
  { label: "Others", value: "Others" },
];

const TRADE_AREA_OPTIONS = [
  { label: "Coastal", value: "Coastal" },
  { label: "Tropical", value: "Tropical" },
  { label: "Worldwide", value: "Worldwide" },
];

/**
 * Panama Medical Certificate — General Information section.
 *
 * Clean table-style form layout: each field on its own row with a
 * fixed-width label column on the left and input on the right.
 */
export default function GeneralInfoSection({ data, onChange }: PanamaSectionProps) {
  const update = (field: keyof PanamaCertificate, value: string) =>
    onChange({ ...data, [field]: value });

  const inputClasses = cn(
    "h-8 text-sm bg-white border border-primary/20 rounded-md px-2",
    "focus:outline-none focus-visible:border-primary dark:bg-input/30",
    "pointer-events-none opacity-70"
  );

  const labelClasses = "text-xs font-semibold text-foreground/70 whitespace-nowrap";
  const rowClasses = "flex items-center gap-3 py-1.5 border-b border-primary/5";

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="General Information" icon={Info} subtitle="Seafarer identity and assignment details" />

      <div className="divide-y divide-primary/5">
        {/* Fullname */}
        <div className={rowClasses}>
          <Label className={cn(labelClasses, "w-[200px] shrink-0")}>Fullname:</Label>
          <Input
            value={data.full_name}
            readOnly
            tabIndex={-1}
            className={cn(inputClasses, "flex-1 min-w-0")}
          />
        </div>

        {/* Date of birth: Day / Month / Year */}
        <div className={rowClasses}>
          <Label className={cn(labelClasses, "w-[200px] shrink-0")}>Date of birth:</Label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Label className={labelClasses}>Day:</Label>
              <Input
                value={data.day}
                readOnly
                tabIndex={-1}
                className={cn(inputClasses, "w-16")}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Label className={labelClasses}>Month:</Label>
              <Input
                value={data.month}
                readOnly
                tabIndex={-1}
                className={cn(inputClasses, "w-20")}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Label className={labelClasses}>Year:</Label>
              <Input
                value={data.year}
                readOnly
                tabIndex={-1}
                className={cn(inputClasses, "w-20")}
              />
            </div>
          </div>
        </div>

        {/* Sex */}
        <div className={rowClasses}>
          <Label className={cn(labelClasses, "w-[200px] shrink-0")}>Sex:</Label>
          <div className="flex items-center gap-4 pointer-events-none" role="radiogroup" aria-label="Sex">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="panama_sex"
                checked={data.sex === "Male"}
                onChange={() => update("sex", "Male")}
                className="w-4 h-4 accent-primary"
                aria-label="Male"
                tabIndex={-1}
              />
              <span className="text-xs text-foreground/80">Male</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="panama_sex"
                checked={data.sex === "Female"}
                onChange={() => update("sex", "Female")}
                className="w-4 h-4 accent-primary"
                aria-label="Female"
                tabIndex={-1}
              />
              <span className="text-xs text-foreground/80">Female</span>
            </label>
          </div>
        </div>

        {/* RH Typing */}
        <div className={rowClasses}>
          <Label className={cn(labelClasses, "w-[200px] shrink-0")}>RH Typing:</Label>
          <Input
            value={data.rh_typing}
            readOnly
            tabIndex={-1}
            className={cn(inputClasses, "w-40")}
          />
        </div>

        {/* Passport / Seaman No. */}
        <div className={rowClasses}>
          <Label className={cn(labelClasses, "w-[200px] shrink-0")}>Passport / Seaman No.:</Label>
          <Input
            value={data.passport_seaman_no}
            readOnly
            tabIndex={-1}
            className={cn(inputClasses, "flex-1 min-w-0")}
          />
        </div>

        {/* Home Address */}
        <div className={rowClasses}>
          <Label className={cn(labelClasses, "w-[200px] shrink-0")}>Home address:</Label>
          <Input
            value={data.home_address}
            readOnly
            tabIndex={-1}
            className={cn(inputClasses, "flex-1 min-w-0")}
          />
        </div>

        {/* Department */}
        <div className={rowClasses}>
          <Label className={cn(labelClasses, "w-[200px] shrink-0")}>Department:</Label>
          <Input
            value={data.department}
            readOnly
            tabIndex={-1}
            className={cn(inputClasses, "w-72")}
          />
        </div>

        {/* Crew Position */}
        <div className={rowClasses}>
          <Label className={cn(labelClasses, "w-[200px] shrink-0")}>Crew position:</Label>
          <Input
            value={data.crew_position}
            readOnly
            tabIndex={-1}
            className={cn(inputClasses, "w-72")}
          />
        </div>

        {/* Does perform lookout duties */}
        <div className={rowClasses}>
          <Label className={cn(labelClasses, "w-[200px] shrink-0")}>Does perform lookout duties:</Label>
          <Input
            value={data.lookout_duties}
            readOnly
            tabIndex={-1}
            className={cn(inputClasses, "flex-1 min-w-0")}
          />
        </div>

        {/* Routine and emergency duties */}
        <div className={rowClasses}>
          <Label className={cn(labelClasses, "w-[200px] shrink-0")}>Routine and emergency duties:</Label>
          <Input
            value={data.routine_emergency_duties}
            readOnly
            tabIndex={-1}
            className={cn(inputClasses, "flex-1 min-w-0")}
          />
        </div>

        {/* Type of ship */}
        <div className={rowClasses}>
          <Label className={cn(labelClasses, "w-[200px] shrink-0")}>Type of ship:</Label>
          <div className="flex items-center gap-4 pointer-events-none" role="radiogroup" aria-label="Type of ship">
            {SHIP_TYPE_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="panama_type_of_ship"
                  checked={data.type_of_ship === opt.value}
                  onChange={() => update("type_of_ship", opt.value)}
                  className="w-4 h-4 accent-primary"
                  aria-label={opt.label}
                  tabIndex={-1}
                />
                <span className="text-xs text-foreground/80">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Trade area */}
        <div className={cn(rowClasses, "border-b-0")}>
          <Label className={cn(labelClasses, "w-[200px] shrink-0")}>Trade area:</Label>
          <div className="flex items-center gap-4 pointer-events-none" role="radiogroup" aria-label="Trade area">
            {TRADE_AREA_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="panama_trade_area"
                  checked={data.trade_area === opt.value}
                  onChange={() => update("trade_area", opt.value)}
                  className="w-4 h-4 accent-primary"
                  aria-label={opt.label}
                  tabIndex={-1}
                />
                <span className="text-xs text-foreground/80">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
