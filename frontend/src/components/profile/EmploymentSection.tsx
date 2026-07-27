"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { FormAutocomplete } from "@/components/common/form-autocomplete";
import { Anchor } from "lucide-react";
import { POSITIONS, COUNTRIES, EMPLOYERS, DESIGNATIONS } from "@/lib/suggestions";
import type { SeafarerProfile } from "@/lib/api";
import type { ProfileSectionProps } from "./types";

/**
 * Employment details form section.
 *
 * Captures employer, designation, passport/seaman's book numbers,
 * position, country, and destination information.
 */
export default function EmploymentSection({
  data,
  onChange,
  disabled,
}: ProfileSectionProps) {
  const update = (field: keyof SeafarerProfile, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Employment Details" icon={Anchor} />
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <FormAutocomplete
            label="Employer"
            value={data.employer}
            onChange={(v) => update("employer", v)}
            suggestions={EMPLOYERS}
            disabled={disabled}
            size="sm"
          />
          <FormAutocomplete
            label="Designation"
            value={data.designation}
            onChange={(v) => update("designation", v)}
            suggestions={DESIGNATIONS}
            disabled={disabled}
            size="sm"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <FormField
            label="Passport No."
            value={data.passport_no}
            onChange={(v) => update("passport_no", v)}
            disabled={disabled}
            size="sm"
          />
          <FormField
            label="Seaman's Book No."
            value={data.seamans_book_no}
            onChange={(v) => update("seamans_book_no", v)}
            disabled={disabled}
            size="sm"
          />
          <FormAutocomplete
            label="Position"
            value={data.position}
            onChange={(v) => update("position", v)}
            suggestions={POSITIONS}
            disabled={disabled}
            size="sm"
          />
          <FormAutocomplete
            label="Country"
            value={data.country}
            onChange={(v) => update("country", v)}
            suggestions={COUNTRIES}
            disabled={disabled}
            size="sm"
          />
        </div>
        <FormAutocomplete
          label="Country of Destination"
          value={data.country_of_destination}
          onChange={(v) => update("country_of_destination", v)}
          suggestions={COUNTRIES}
          className="max-w-xs"
          disabled={disabled}
          size="sm"
        />
      </div>
    </div>
  );
}
