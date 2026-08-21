"use client";

/**
 * Hematology section for the Laboratory Report form.
 *
 * The field body is shared with Repeat Hematology so both forms always retain
 * the same result date, field order, ranges, units, and equal-column layout.
 */

import { useState } from "react";
import { Droplets, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/common/section-header";
import { HematologyFormFields } from "./HematologyFormFields";
import { RepeatHematologyDialog } from "./RepeatHematologyDialog";
import type { LaboratorySectionProps } from "./types";
import { createFieldUpdater } from "./utils";

/**
 * Displays and edits the hematology portion of a laboratory report.
 */
export default function HematologySection({
  data,
  onChange,
  disabled,
}: LaboratorySectionProps) {
  const updateField = createFieldUpdater(data, onChange);
  const [repeatDialogOpen, setRepeatDialogOpen] = useState(false);
  const hasPersistedReport = Boolean(data.id);

  return (
    <div className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
      <SectionHeader
        title="Laboratory Report (Hematology)"
        icon={Droplets}
        action={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPersistedReport}
              onClick={() => setRepeatDialogOpen(true)}
              className="cursor-pointer"
            >
              <RotateCcw aria-hidden="true" />
              Repeat Hematology
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPersistedReport}
              onClick={() => window.print()}
              className="cursor-pointer"
            >
              <Printer aria-hidden="true" />
              Print
            </Button>
          </div>
        }
      />

      <RepeatHematologyDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        laboratoryReportId={data.id}
      />

      <HematologyFormFields
        data={data}
        resultDate={data.hematology_result_date}
        onResultDateChange={(value) =>
          updateField("hematology_result_date", value)
        }
        onFieldChange={(field, value) => updateField(field, value)}
        disabled={disabled}
      />
    </div>
  );
}
