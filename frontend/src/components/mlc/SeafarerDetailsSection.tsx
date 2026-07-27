"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import { Anchor } from "lucide-react";
import { createFieldUpdater } from "./utils";
import type { MlcSectionProps } from "./types";

/** Vessel type options for the ship classification dropdown. */
const VESSEL_TYPE_OPTIONS = [
  "Bulk Carrier",
  "Container Ship",
  "Tanker",
  "General Cargo",
  "Passenger Ship",
  "Ro-Ro",
  "Offshore",
  "Fishing Vessel",
  "Tug Boat",
  "Others",
];

/**
 * Additional Seafarer Details section for the MLC form.
 *
 * Captures maritime-specific information not stored on the seafarer
 * profile: date of birth, age, SIRB number, rank, vessel name,
 * vessel type, shipping company, and manning agency.
 *
 * These fields are specific to the current MLC certificate and may
 * change between examinations (different vessel assignments, rank
 * promotions, etc.).
 */
export default function SeafarerDetailsSection({
  data,
  onChange,
  disabled,
}: MlcSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader title="Additional Seafarer Details" icon={Anchor} />
      <div className="space-y-2">
        {/* Row 1: Date of Birth, Age, SIRB No */}
        <div className="grid grid-cols-3 gap-2">
          <FormField
            label="Date of Birth"
            value={data.date_of_birth}
            onChange={(v) => updateField("date_of_birth", v)}
            type="date"
            disabled={disabled}
          />
          <FormField
            label="Age"
            value={data.age}
            onChange={(v) => updateField("age", v)}
            disabled={disabled}
          />
          <FormField
            label="SIRB No."
            value={data.sirb_no}
            onChange={(v) => updateField("sirb_no", v)}
            disabled={disabled}
          />
        </div>

        {/* Row 2: Rank, Vessel Name, Vessel Type */}
        <div className="grid grid-cols-3 gap-2">
          <FormField
            label="Rank"
            value={data.rank}
            onChange={(v) => updateField("rank", v)}
            disabled={disabled}
          />
          <FormField
            label="Vessel Name"
            value={data.vessel_name}
            onChange={(v) => updateField("vessel_name", v)}
            disabled={disabled}
          />
          <FormSelect
            label="Vessel Type"
            value={data.vessel_type}
            onChange={(v) => updateField("vessel_type", v)}
            options={VESSEL_TYPE_OPTIONS}
            disabled={disabled}
          />
        </div>

        {/* Row 3: Shipping Company, Manning Agency */}
        <div className="grid grid-cols-2 gap-2">
          <FormField
            label="Shipping Company"
            value={data.shipping_company}
            onChange={(v) => updateField("shipping_company", v)}
            disabled={disabled}
          />
          <FormField
            label="Manning Agency"
            value={data.manning_agency}
            onChange={(v) => updateField("manning_agency", v)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
