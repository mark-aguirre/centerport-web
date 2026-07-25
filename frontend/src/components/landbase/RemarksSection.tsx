"use client";

import { SectionHeader } from "@/components/common/section-header";
import { MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { LandbaseSectionProps } from "./types";

/**
 * Remarks / Restriction section for the Landbase PEME form.
 *
 * Provides a free-text area for entering medical remarks or restrictions.
 */
export default function RemarksSection({
  data,
  onChange,
}: LandbaseSectionProps) {
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Remarks / Restriction" icon={MessageSquare} />
      <Textarea
        value={data.remarks}
        onChange={(e) => onChange({ ...data, remarks: e.target.value })}
        className="min-h-[80px] text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
        placeholder="Enter remarks or restrictions..."
      />
    </div>
  );
}
