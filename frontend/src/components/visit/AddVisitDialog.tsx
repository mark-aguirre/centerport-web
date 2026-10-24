"use client";

import { CalendarPlus, Loader2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SeafarerProfile } from "@/lib/api";

interface AddVisitDialogProps {
  open: boolean;
  /** The patient the visit is being created for. */
  patient: SeafarerProfile | null;
  purpose: string;
  onPurposeChange: (value: string) => void;
  saving: boolean;
  /** Validates, creates the visit, closes, and refreshes today's list. */
  onSubmit: () => void;
  /** Closes without saving. */
  onCancel: () => void;
}

/** "SANTOS, JOSHUA" from the profile name fields. */
function displayName(patient: SeafarerProfile | null): string {
  if (!patient) return "—";
  return (
    [patient.last_name, patient.first_name].filter(Boolean).join(", ") || "—"
  );
}

/**
 * Compact dialog for booking a visit against a patient already on file.
 *
 * Deliberately one field. The patient's demographics are already recorded, so
 * the only thing this collects is the purpose of today's visit; everything
 * else about the record is reachable from "View Details" on the same row.
 *
 * Shares the registration dialog's header pattern — what the dialog is for on
 * the left, who it concerns in the middle, the actions on the right at
 * `h-10 px-5` — so the two read as the same family. The corner close button is
 * hidden for the same reason it is there: Cancel owns the right edge. Escape
 * and a backdrop click still close the dialog.
 *
 * The purpose is a textarea rather than a single-line input because clinic
 * entries run to a sentence or two ("Annual PE, fit-to-work clearance for
 * deployment"), and a 24px input hid everything past the first few words.
 * Enter therefore inserts a newline instead of submitting, which is the right
 * trade for a multi-line field; the header's Add & Close is the only submit.
 * The `form` wrapper stays so that button can submit from outside the field.
 */
export function AddVisitDialog({
  open,
  patient,
  purpose,
  onPurposeChange,
  saving,
  onSubmit,
  onCancel,
}: AddVisitDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 [&_[data-slot=dialog-close-button]]:hidden">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          {/* Two lines, not the registration dialog's three columns. The
              buttons and the Patient ID chip cannot shrink — `buttonVariants`
              sets `shrink-0` and the chip is a nowrap pill — so side by side
              their min-content width overran `max-w-2xl` and `overflow-hidden`
              clipped Cancel. Dropping the patient context to its own line
              gives the actions the whole right edge. */}
          <DialogHeader className="border-b border-border px-5 py-3">
            <div className="flex items-center gap-3">
              <CalendarPlus
                className="h-6 w-6 shrink-0 text-foreground/80"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <DialogTitle className="truncate text-base">
                  Add Visit
                </DialogTitle>
                <DialogDescription className="truncate text-xs">
                  Create a new visit for the selected patient.
                </DialogDescription>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="submit"
                  className="h-10 cursor-pointer px-5"
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Save aria-hidden="true" />
                  )}
                  Add &amp; Close
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 cursor-pointer px-5"
                  onClick={onCancel}
                  disabled={saving}
                >
                  <X aria-hidden="true" />
                  Cancel
                </Button>
              </div>
            </div>

            {/* Indented to line up under the title, past the icon. */}
            <div className="flex min-w-0 flex-wrap items-center gap-2 pl-9">
              <span className="truncate text-xs font-semibold text-foreground uppercase">
                {displayName(patient)}
              </span>
              {patient?.profile_id ? (
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  Patient ID: {patient.profile_id}
                </span>
              ) : null}
            </div>
          </DialogHeader>

          <div className="space-y-0.5 px-5 pt-4 pb-5">
            <Label
              htmlFor="add-visit-purpose"
              className="text-xs font-bold tracking-wider text-foreground/80 uppercase"
            >
              Purpose of Visit
              <span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Textarea
              id="add-visit-purpose"
              value={purpose}
              onChange={(event) => onPurposeChange(event.target.value)}
              placeholder="Enter purpose of visit"
              autoFocus
              className="h-24 resize-none rounded-md border border-primary/20 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:border-primary dark:bg-input/30"
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
