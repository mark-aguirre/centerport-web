"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { Briefcase } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { SeafarerProfile } from "@/lib/api";
import type { ProfileSectionProps } from "./types";

/**
 * Previous work experience form section.
 *
 * Captures details about the seafarer's last vessel assignment:
 * date range, company, position, reason for leaving, and general remarks.
 */
export default function WorkExperienceSection({
  data,
  onChange,
  disabled,
}: ProfileSectionProps) {
  const update = (field: keyof SeafarerProfile, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="Previous Work Experience (Last Vessel Only)"
        icon={Briefcase}
      />
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-2">
          <FormField
            label="Date Started"
            value={data.prev_date_started}
            onChange={(v) => update("prev_date_started", v)}
            type="date"
            className="col-span-2"
            disabled={disabled}
            size="sm"
          />
          <FormField
            label="Date End"
            value={data.prev_date_end}
            onChange={(v) => update("prev_date_end", v)}
            type="date"
            className="col-span-2"
            disabled={disabled}
            size="sm"
          />
          <FormField
            label="Length of Stay"
            value={data.prev_length_of_stay}
            onChange={(v) => update("prev_length_of_stay", v)}
            disabled={disabled}
            size="sm"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <FormField
            label="Company"
            value={data.prev_company}
            onChange={(v) => update("prev_company", v)}
            disabled={disabled}
            size="sm"
          />
          <FormField
            label="Position"
            value={data.prev_position}
            onChange={(v) => update("prev_position", v)}
            disabled={disabled}
            size="sm"
          />
          <FormField
            label="Reason of Leaving"
            value={data.prev_reason_of_leaving}
            onChange={(v) => update("prev_reason_of_leaving", v)}
            disabled={disabled}
            size="sm"
          />
        </div>
        <div className="space-y-0.5">
          <Label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
            Remarks
          </Label>
          <Textarea
            value={data.remark ?? ""}
            onChange={(e) => update("remark", e.target.value)}
            disabled={disabled}
            className={cn(
              "bg-white border-primary/20 focus-visible:border-primary dark:bg-input/30 text-xs min-h-[52px] px-2 py-1",
              disabled && "opacity-60 cursor-not-allowed bg-muted/20"
            )}
          />
        </div>
      </div>
    </div>
  );
}
