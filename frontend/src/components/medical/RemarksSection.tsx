"use client";

import { SectionHeader } from "@/components/common/section-header";
import { MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { MedicalSectionProps } from "./types";

/**
 * Remarks section for the Medical Examination form.
 *
 * Provides a free-text area for entering general medical remarks,
 * additional observations, or notes by the examining physician.
 */
export default function RemarksSection({
  data,
  onChange,
}: MedicalSectionProps) {
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Remarks / Additional Notes" icon={MessageSquare} />
      <Textarea
        value={data.remarks}
        onChange={(e) => onChange({ ...data, remarks: e.target.value })}
        className="min-h-[80px] text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
        placeholder="Enter additional remarks, observations, or notes..."
      />
    </div>
  );
}
