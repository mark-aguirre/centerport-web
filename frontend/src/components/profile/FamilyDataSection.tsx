"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { Users } from "lucide-react";
import type { SeafarerProfile } from "@/lib/api";
import type { ProfileSectionProps } from "./types";

/**
 * Family data form section.
 *
 * Captures parents' names and occupations, sibling count, birth order,
 * spouse information, and number of children.
 */
export default function FamilyDataSection({
  data,
  onChange,
  disabled,
}: ProfileSectionProps) {
  const update = (field: keyof SeafarerProfile, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Family Data" icon={Users} />
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2">
          <FormField
            label="Father's Name"
            value={data.father_name}
            onChange={(v) => update("father_name", v)}
            className="col-span-2"
            disabled={disabled}
            size="sm"
          />
          <FormField
            label="Father's Occupation"
            value={data.father_occupation}
            onChange={(v) => update("father_occupation", v)}
            className="col-span-2"
            disabled={disabled}
            size="sm"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <FormField
            label="Mother's Name"
            value={data.mother_name}
            onChange={(v) => update("mother_name", v)}
            className="col-span-2"
            disabled={disabled}
            size="sm"
          />
          <FormField
            label="Mother's Occupation"
            value={data.mother_occupation}
            onChange={(v) => update("mother_occupation", v)}
            className="col-span-2"
            disabled={disabled}
            size="sm"
          />
        </div>
        <div className="grid grid-cols-6 gap-2">
          <FormField
            label="Brothers"
            value={data.no_of_brothers}
            onChange={(v) => update("no_of_brothers", String(parseInt(v) || ""))}
            type="number"
            disabled={disabled}
            size="sm"
          />
          <FormField
            label="Sisters"
            value={data.no_of_sisters}
            onChange={(v) => update("no_of_sisters", String(parseInt(v) || ""))}
            type="number"
            disabled={disabled}
            size="sm"
          />
          <FormField
            label="Birth Order"
            value={data.birth_order}
            onChange={(v) => update("birth_order", String(parseInt(v) || ""))}
            type="number"
            disabled={disabled}
            size="sm"
          />
          <FormField
            label="Children"
            value={data.no_of_children}
            onChange={(v) => update("no_of_children", String(parseInt(v) || ""))}
            type="number"
            disabled={disabled}
            size="sm"
          />
          <FormField
            label="Spouse Name"
            value={data.spouse_name}
            onChange={(v) => update("spouse_name", v)}
            className="col-span-2"
            disabled={disabled}
            size="sm"
          />
        </div>
        <FormField
          label="Spouse's Occupation"
          value={data.spouse_occupation}
          onChange={(v) => update("spouse_occupation", v)}
          className="max-w-sm"
          disabled={disabled}
          size="sm"
        />
      </div>
    </div>
  );
}
