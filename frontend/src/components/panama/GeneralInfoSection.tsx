"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import RadioGroup from "@/components/common/radio-group";
import { Info } from "lucide-react";
import type { PanamaSectionProps, PanamaCertificate } from "./types";

const MONTH_OPTIONS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

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
 * Renders the first section of the Panama form with fields for full name,
 * date of birth, sex, RH typing, passport/seaman number, home address,
 * department, crew position, lookout duties, routine & emergency duties,
 * type of ship, and trade area.
 */
export default function GeneralInfoSection({ data, onChange }: PanamaSectionProps) {
  const update = (field: keyof PanamaCertificate, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="General Information" icon={Info} subtitle="Seafarer identity and assignment details" />

      <div className="space-y-2">
        {/* Row 1: Full Name */}
        <div className="grid grid-cols-1 gap-2">
          <FormField
            label="Full Name"
            value={data.full_name}
            onChange={(v) => update("full_name", v)}
            required
          />
        </div>

        {/* Row 2: Day, Month, Year, Sex */}
        <div className="grid grid-cols-[1fr_1fr_1fr_2fr] gap-2">
          <FormField
            label="Day"
            value={data.day}
            onChange={(v) => update("day", v)}
            type="number"
          />
          <FormSelect
            label="Month"
            value={data.month}
            onChange={(v) => update("month", v)}
            options={MONTH_OPTIONS}
          />
          <FormField
            label="Year"
            value={data.year}
            onChange={(v) => update("year", v)}
            type="number"
          />
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
              Sex
            </span>
            <div className="flex items-center gap-4 h-8" role="radiogroup" aria-label="Sex">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="panama_sex"
                  checked={data.sex === "Male"}
                  onChange={() => update("sex", "Male")}
                  className="w-4 h-4 accent-primary"
                  aria-label="Sex - Male"
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
                  aria-label="Sex - Female"
                />
                <span className="text-xs text-foreground/80">Female</span>
              </label>
            </div>
          </div>
        </div>

        {/* Row 3: RH Typing, Passport / Seaman No. */}
        <div className="grid grid-cols-[1fr_3fr] gap-2">
          <FormField
            label="RH Typing"
            value={data.rh_typing}
            onChange={(v) => update("rh_typing", v)}
          />
          <FormField
            label="Passport / Seaman No."
            value={data.passport_seaman_no}
            onChange={(v) => update("passport_seaman_no", v)}
          />
        </div>

        {/* Row 4: Home Address */}
        <div className="grid grid-cols-1 gap-2">
          <FormField
            label="Home Address"
            value={data.home_address}
            onChange={(v) => update("home_address", v)}
          />
        </div>

        {/* Row 5: Department, Crew Position */}
        <div className="grid grid-cols-2 gap-2">
          <FormField
            label="Department"
            value={data.department}
            onChange={(v) => update("department", v)}
          />
          <FormField
            label="Crew Position"
            value={data.crew_position}
            onChange={(v) => update("crew_position", v)}
          />
        </div>

        {/* Row 6: Lookout Duties, Routine & Emergency Duties */}
        <div className="grid grid-cols-2 gap-2">
          <FormField
            label="Lookout Duties"
            value={data.lookout_duties}
            onChange={(v) => update("lookout_duties", v)}
          />
          <FormField
            label="Routine & Emergency Duties"
            value={data.routine_emergency_duties}
            onChange={(v) => update("routine_emergency_duties", v)}
          />
        </div>

        {/* Row 7: Type of Ship, Trade Area */}
        <div className="grid grid-cols-2 gap-2">
          <RadioGroup
            label="Type of Ship"
            name="panama_type_of_ship"
            value={data.type_of_ship}
            onChange={(v) => update("type_of_ship", v)}
            options={SHIP_TYPE_OPTIONS}
            ariaLabel="Type of Ship"
          />
          <RadioGroup
            label="Trade Area"
            name="panama_trade_area"
            value={data.trade_area}
            onChange={(v) => update("trade_area", v)}
            options={TRADE_AREA_OPTIONS}
            ariaLabel="Trade Area"
          />
        </div>
      </div>
    </div>
  );
}
