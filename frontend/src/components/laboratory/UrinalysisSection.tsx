"use client";

/**
 * Urinalysis section for a Laboratory Report.
 *
 * The field body is shared with Repeat Urinalysis so both forms retain the same
 * date, grouped layout, options, fields, and units.
 */

import { useState } from "react";
import { Beaker, Printer, RotateCcw } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { RepeatUrinalysisDialog } from "./RepeatUrinalysisDialog";
import type { LaboratorySectionProps } from "./types";
import { UrinalysisFormFields } from "./UrinalysisFormFields";
import { createFieldUpdater } from "./utils";

/**
 * Displays and edits the Urinalysis portion of a laboratory report.
 */
export default function UrinalysisSection({
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
        title="Urinalysis"
        icon={Beaker}
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
              Repeat Urinalysis
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

      <RepeatUrinalysisDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        laboratoryReportId={data.id}
      />

      <UrinalysisFormFields
        data={data}
        resultDate={data.urinalysis_result_date}
        onResultDateChange={(value) =>
          updateField("urinalysis_result_date", value)
        }
        onFieldChange={(field, value) => updateField(field, value)}
        disabled={disabled}
      />
    </div>
  );
}
