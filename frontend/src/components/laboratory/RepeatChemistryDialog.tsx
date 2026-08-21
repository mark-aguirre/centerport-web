"use client";

/**
 * Repeat Chemistry dialog using the exact parent Chemistry form body.
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MedicalPersonnelDialog } from "@/components/common/medical-personnel-dialog";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ChemistryFormFields } from "./ChemistryFormFields";
import { useRepeatChemistryForm } from "./use-repeat-chemistry-form";

interface RepeatChemistryDialogProps {
  /** Controls dialog visibility. */
  open: boolean;
  /** Called when dialog visibility changes. */
  onOpenChange: (open: boolean) => void;
  /** Parent laboratory report UUID. */
  laboratoryReportId: string | undefined;
}

interface SerologySelectProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

function SerologySelect({
  id,
  label,
  value,
  options,
  disabled,
  onChange,
}: SerologySelectProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <label
        htmlFor={id}
        className="w-32 shrink-0 text-right text-[11px] font-semibold uppercase tracking-wide text-primary/70"
      >
        {label}:
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="h-7 min-w-0 flex-1 cursor-pointer rounded border border-primary/20 bg-white px-2 text-xs transition-colors focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted/30 dark:bg-input/30"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Displays and manages repeat Chemistry records while reusing the parent table.
 */
export function RepeatChemistryDialog({
  open,
  onOpenChange,
  laboratoryReportId,
}: RepeatChemistryDialogProps) {
  const {
    data,
    editing,
    saving,
    selectedId,
    disabled,
    previousExams,
    loadingExams,
    updateField,
    loadRepeatTest,
    handleNew,
    handleEdit,
    handleSave,
    handleRefresh,
    personnel,
  } = useRepeatChemistryForm({ open, laboratoryReportId });

  const inputClassName = cn(
    "h-7 rounded border border-primary/20 bg-white px-2 text-xs transition-colors focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30",
    disabled && "pointer-events-none bg-muted/30"
  );
  const metadataLabelClassName =
    "shrink-0 text-[11px] font-semibold uppercase tracking-wide text-primary/70";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-[960px] flex-col overflow-hidden p-0 [&>[data-slot=dialog-close-button]]:top-2.5 [&>[data-slot=dialog-close-button]]:text-white [&>[data-slot=dialog-close-button]]:opacity-90 [&>[data-slot=dialog-close-button]]:hover:opacity-100">
          <div className="shrink-0 rounded-t-lg bg-gradient-to-r from-primary/90 to-primary/70 px-5 py-2">
            <DialogHeader>
              <DialogTitle className="text-base font-bold tracking-wide text-white">
                Repeat Test - CLINICAL CHEMISTRY AND SEROLOGY/IMMUNOLOGY
              </DialogTitle>
              <DialogDescription className="sr-only">
                Manage chemistry repeat test results for this laboratory report.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-primary/10 bg-muted/30 px-5 py-2">
            <div className="flex items-center gap-2">
              <label
                htmlFor="repeat-chemistry-record"
                className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-primary/70"
              >
                Previous Exams:
              </label>
              <select
                id="repeat-chemistry-record"
                value={selectedId ?? ""}
                onChange={(event) => {
                  if (event.target.value) loadRepeatTest(event.target.value);
                }}
                disabled={loadingExams}
                className={cn(
                  "h-8 min-w-[240px] cursor-pointer rounded-md border border-primary/20 bg-white px-2 text-xs shadow-sm focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40 dark:bg-input/30 disabled:cursor-not-allowed",
                  loadingExams && "opacity-50"
                )}
              >
                <option value="">
                  {loadingExams
                    ? "Loading..."
                    : previousExams.length === 0
                      ? "No previous exams"
                      : "-- Select a record --"}
                </option>
                {previousExams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.result_id} — {exam.result_date}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNew}
                disabled={saving}
                className="cursor-pointer"
              >
                New
              </Button>
              {editing ? (
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="cursor-pointer"
                >
                  {saving && <Loader2 className="animate-spin" />}
                  Save
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={!selectedId}
                  className="cursor-pointer"
                >
                  Edit
                </Button>
              )}
              <Button variant="outline" size="sm" disabled>
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={saving}
                className="cursor-pointer"
              >
                Refresh
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-primary/80">
                Clinical Chemistry and Serology/Immunology
              </h3>

              <ChemistryFormFields
                data={data}
                resultDate={data.result_date}
                onResultDateChange={(value) => updateField("result_date", value)}
                onFieldChange={(field, value) => updateField(field, value)}
                disabled={disabled}
              />

              <fieldset className="rounded-md border border-primary/15 bg-muted/5 px-3 pb-3">
                <legend className="px-1 text-xs font-bold uppercase tracking-widest text-primary">
                  Serology/Immunology
                </legend>
                <div className="mt-1 grid gap-x-6 gap-y-2 md:grid-cols-2">
                  <SerologySelect
                    id="repeat-chemistry-rpr"
                    label="RPR"
                    value={data.rpr}
                    options={["Non-Reactive", "Reactive"]}
                    onChange={(value) => updateField("rpr", value)}
                    disabled={disabled}
                  />
                  <SerologySelect
                    id="repeat-chemistry-widal"
                    label="Widal Test"
                    value={data.widal_test}
                    options={["Negative", "Positive"]}
                    onChange={(value) => updateField("widal_test", value)}
                    disabled={disabled}
                  />
                  <SerologySelect
                    id="repeat-chemistry-hbsag"
                    label="HBsAg"
                    value={data.hbsag}
                    options={["Non-Reactive", "Reactive"]}
                    onChange={(value) => updateField("hbsag", value)}
                    disabled={disabled}
                  />
                  <SerologySelect
                    id="repeat-chemistry-malarial-smear"
                    label="Malarial Smear"
                    value={data.malarial_smear}
                    options={["Negative", "Positive"]}
                    onChange={(value) => updateField("malarial_smear", value)}
                    disabled={disabled}
                  />
                </div>
              </fieldset>

              <div className="space-y-2 border-t border-primary/10 pt-3">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="repeat-chemistry-laboratory-number"
                    className={cn(metadataLabelClassName, "w-28 text-right")}
                  >
                    Laboratory No.:
                  </label>
                  <input
                    id="repeat-chemistry-laboratory-number"
                    type="text"
                    value={data.laboratory_no}
                    onChange={(event) =>
                      updateField("laboratory_no", event.target.value)
                    }
                    readOnly={disabled}
                    className={cn(inputClassName, "w-32")}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className={cn(metadataLabelClassName, "w-28 text-right")}>
                    Med. Tech.:
                  </label>
                  <input
                    type="text"
                    value={data.med_tech}
                    readOnly
                    aria-label="Medical technologist"
                    className={cn(
                      inputClassName,
                      "min-w-0 flex-1 pointer-events-none bg-muted/30"
                    )}
                  />
                  <label className={metadataLabelClassName}>License No.:</label>
                  <input
                    type="text"
                    value={data.med_tech_license_no}
                    readOnly
                    aria-label="Medical technologist license number"
                    className={cn(
                      inputClassName,
                      "w-28 pointer-events-none bg-muted/30"
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={disabled}
                    onClick={() => personnel.openDialog("med_tech")}
                    aria-label="Search medical technologist"
                    className="cursor-pointer"
                  >
                    ...
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <label className={cn(metadataLabelClassName, "w-28 text-right")}>
                    Pathologist:
                  </label>
                  <input
                    type="text"
                    value={data.pathologist}
                    readOnly
                    aria-label="Pathologist"
                    className={cn(
                      inputClassName,
                      "min-w-0 flex-1 pointer-events-none bg-muted/30"
                    )}
                  />
                  <label className={metadataLabelClassName}>License No.:</label>
                  <input
                    type="text"
                    value={data.pathologist_license_no}
                    readOnly
                    aria-label="Pathologist license number"
                    className={cn(
                      inputClassName,
                      "w-28 pointer-events-none bg-muted/30"
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    disabled={disabled}
                    onClick={() => personnel.openDialog("pathologist")}
                    aria-label="Search pathologist"
                    className="cursor-pointer"
                  >
                    ...
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="repeat-chemistry-requested-by"
                    className={cn(metadataLabelClassName, "w-28 text-right")}
                  >
                    Requested By:
                  </label>
                  <input
                    id="repeat-chemistry-requested-by"
                    type="text"
                    value={data.requested_by}
                    onChange={(event) =>
                      updateField("requested_by", event.target.value)
                    }
                    readOnly={disabled}
                    className={cn(inputClassName, "min-w-0 flex-1")}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="repeat-chemistry-remarks"
                    className={cn(metadataLabelClassName, "w-28 text-right")}
                  >
                    Remarks:
                  </label>
                  <input
                    id="repeat-chemistry-remarks"
                    type="text"
                    value={data.remarks}
                    onChange={(event) => updateField("remarks", event.target.value)}
                    readOnly={disabled}
                    className={cn(inputClassName, "min-w-0 flex-1")}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MedicalPersonnelDialog
        open={personnel.dialogOpen}
        onOpenChange={personnel.setDialogOpen}
        onSelect={personnel.handleSelect}
        title={
          personnel.target === "med_tech"
            ? "Select Medical Technologist"
            : "Select Pathologist"
        }
      />
    </>
  );
}
