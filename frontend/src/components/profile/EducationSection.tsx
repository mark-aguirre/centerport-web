"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { GraduationCap } from "lucide-react";
import type { SeafarerProfile } from "@/lib/api";
import type { ProfileSectionProps } from "./types";

/**
 * Educational history form section.
 *
 * Captures elementary, high school, college/university, course,
 * and highest level of education attended.
 */
export default function EducationSection({
  data,
  onChange,
  disabled,
}: ProfileSectionProps) {
  const update = (field: keyof SeafarerProfile, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Educational History" icon={GraduationCap} />
      <div className="grid grid-cols-2 gap-2">
        <FormField
          label="Elementary"
          value={data.elementary}
          onChange={(v) => update("elementary", v)}
          disabled={disabled}
          size="sm"
        />
        <FormField
          label="High School"
          value={data.high_school}
          onChange={(v) => update("high_school", v)}
          disabled={disabled}
          size="sm"
        />
        <FormField
          label="College / University"
          value={data.college_university}
          onChange={(v) => update("college_university", v)}
          disabled={disabled}
          size="sm"
        />
        <FormField
          label="Course"
          value={data.course}
          onChange={(v) => update("course", v)}
          disabled={disabled}
          size="sm"
        />
        <FormField
          label="Highest Level Attended"
          value={data.highest_level_attended}
          onChange={(v) => update("highest_level_attended", v)}
          className="col-span-2"
          disabled={disabled}
          size="sm"
        />
      </div>
    </div>
  );
}
