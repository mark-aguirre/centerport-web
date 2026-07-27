"use client";

import { SectionHeader } from "@/components/common/section-header";
import { MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { LandbaseSectionProps } from "./types";

/**
 * Remarks / Restriction section for the Landbase PEME form.
 *
 * Provides a free-text area for the physician to enter medical
 * remarks, restrictions, or notes about the applicant's fitness.
 *
 * @see RecommendationSection — related section for formal recommendation
 */
export default function RemarksSection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Remarks / Restriction" icon={MessageSquare} />
      <Textarea
        value={data.remarks ?? ""}
        onChange={(e) => updateField("remarks", e.target.value)}
        className={cn(
          "min-h-[80px] text-sm bg-white border border-primary/20 rounded-md px-3 py-2",
          "focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none",
          disabled && "pointer-events-none"
        )}
        placeholder="Enter remarks or restrictions..."
        readOnly={disabled}
      />
    </div>
  );
}
