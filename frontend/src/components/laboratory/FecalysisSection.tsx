"use client";

/**
 * Fecalysis section for a Laboratory Report.
 *
 * The field body is shared with Repeat Fecalysis so both forms retain the same
 * date, layout, options, fields, and units.
 */

import { useState } from "react";
import { Microscope, Printer, RotateCcw } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { FecalysisFormFields } from "./FecalysisFormFields";
import { RepeatFecalysisDialog } from "./RepeatFecalysisDialog";
import type { LaboratorySectionProps } from "./types";
import { createFieldUpdater } from "./utils";

/**
 * Displays and edits the Fecalysis portion of a laboratory report.
 */
export default function FecalysisSection({
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
        title="Fecalysis"
        icon={Microscope}
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
              Repeat Fecalysis
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

      <RepeatFecalysisDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        laboratoryReportId={data.id}
      />

      <FecalysisFormFields
        data={data}
        resultDate={data.fecalysis_result_date}
        onResultDateChange={(value) =>
          updateField("fecalysis_result_date", value)
        }
        onFieldChange={(field, value) => updateField(field, value)}
        disabled={disabled}
      />
    </div>
  );
}
