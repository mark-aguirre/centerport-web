"use client";

/**
 * Clinical Chemistry and Serology/Immunology section for a laboratory report.
 *
 * The field body is shared with Repeat Chemistry so both forms retain the same
 * result date, columns, units, rows, and HIGH controls.
 */

import { useState } from "react";
import { FlaskConical, Printer, RotateCcw } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { ChemistryFormFields } from "./ChemistryFormFields";
import { RepeatChemistryDialog } from "./RepeatChemistryDialog";
import type { LaboratorySectionProps } from "./types";
import { createFieldUpdater } from "./utils";

/**
 * Displays and edits the clinical chemistry portion of a laboratory report.
 */
export default function ClinicalChemistrySection({
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
        title="Clinical Chemistry and Serology/Immunology"
        icon={FlaskConical}
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
              Repeat Chemistry
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

      <RepeatChemistryDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        laboratoryReportId={data.id}
      />

      <ChemistryFormFields
        data={data}
        resultDate={data.chemistry_result_date}
        hba1cReference={data.hba1c_normal}
        onResultDateChange={(value) =>
          updateField("chemistry_result_date", value)
        }
        onFieldChange={(field, value) => updateField(field, value)}
        disabled={disabled}
      />
    </div>
  );
}
