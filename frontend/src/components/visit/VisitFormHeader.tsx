"use client";

import { Loader2, Pencil, Save, UserPlus, UserRound, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface VisitFormHeaderProps {
  /** True once the dialog is showing a patient already on file. */
  isExistingRecord: boolean;
  /** Business ID of the open record, shown as a chip when there is one. */
  profileId?: string;
  editing: boolean;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onClose: () => void;
}

/** Tinted pill for the record's identity. */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
      {children}
    </span>
  );
}

/**
 * Header bar for the visit registration dialog.
 *
 * One row carries everything about the record's state: what the dialog is for
 * on the left, which record is open and whether it is editable in the middle,
 * and the actions on the right. This used to be two stacked bars — the dialog
 * title row, then a sticky strip inside the scrollable form — which spent
 * roughly 90px of a capped-height dialog on chrome and put the primary action
 * in a different place depending on how far the form was scrolled.
 *
 * The dialog's own corner close button is hidden by the caller so Cancel can
 * own the right edge, which is why view mode shows an explicit Close: without
 * it, a mouse user looking at a read-only record would have no visible way out
 * (Escape and a backdrop click still work, but neither is discoverable).
 */
export function VisitFormHeader({
  isExistingRecord,
  profileId,
  editing,
  saving,
  onSave,
  onCancel,
  onEdit,
  onClose,
}: VisitFormHeaderProps) {
  const Icon = isExistingRecord ? UserRound : UserPlus;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="h-6 w-6 shrink-0 text-foreground/80" aria-hidden="true" />
        <div className="min-w-0">
          <DialogTitle className="truncate text-base">
            {isExistingRecord ? "Patient Record" : "New Patient Registration"}
          </DialogTitle>
          <DialogDescription className="truncate text-xs">
            {isExistingRecord
              ? "View or edit the patient's registration details."
              : "Fill in the patient's information to register a new visit."}
          </DialogDescription>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:border-l lg:border-border lg:pl-4">
        <Chip>
          {isExistingRecord && profileId
            ? `Patient ID: ${profileId}`
            : "New Patient"}
        </Chip>
        <span className="text-xs text-foreground/70">
          {editing ? "Editing Details" : "Viewing Record"}
        </span>
      </div>

      <div className="flex items-center gap-2 lg:ml-auto">
        {editing ? (
          <>
            <Button
              type="button"
              className="h-10 cursor-pointer px-5"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Save aria-hidden="true" />
              )}
              {isExistingRecord ? "Update" : "Save"}
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
          </>
        ) : (
          <>
            {/* Edit only means something once a record is loaded. */}
            {isExistingRecord ? (
              <Button
                type="button"
                variant="outline"
                className="h-10 cursor-pointer px-5"
                onClick={onEdit}
              >
                <Pencil aria-hidden="true" />
                Edit
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="h-10 cursor-pointer px-5"
              onClick={onClose}
            >
              <X aria-hidden="true" />
              Close
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
