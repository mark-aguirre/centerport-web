"use client";

import { Loader2, UserPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/form-field";
import { FormAutocomplete } from "@/components/common/form-autocomplete";
import { useEmployers } from "@/hooks/use-employers";
import type { OutPatientDraft } from "@/hooks/use-add-out-patient";

interface AddOutPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: OutPatientDraft;
  saving: boolean;
  onUpdate: <K extends keyof OutPatientDraft>(
    field: K,
    value: OutPatientDraft[K]
  ) => void;
  onSave: () => void;
}

/**
 * Register a walk-in / out-patient client without leaving the POS workspace.
 *
 * Presentational: the parent (`useAddOutPatient`) owns the draft state and the
 * create logic. Collects the minimal fields needed to identify and bill a
 * walk-in; the full patient profile can be completed later on the Profile page.
 */
export function AddOutPatientDialog({
  open,
  onOpenChange,
  draft,
  saving,
  onUpdate,
  onSave,
}: AddOutPatientDialogProps) {
  // Employer / agency choices come from the master list in the database. The
  // field stays optional: FormAutocomplete is a free-text input with
  // suggestions, so the cashier can pick an existing employer or leave it blank.
  const employers = useEmployers();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="border-b border-border px-7 py-5 pr-16">
          <DialogTitle className="text-xl">Add Out-Patient</DialogTitle>
          <DialogDescription className="text-sm">
            Register a walk-in client to add to this sale. You can complete the
            full patient profile later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-7 py-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Last Name"
              value={draft.last_name}
              onChange={(v) => onUpdate("last_name", v)}
              required
              size="md"
            />
            <FormField
              label="First Name"
              value={draft.first_name}
              onChange={(v) => onUpdate("first_name", v)}
              required
              size="md"
            />
          </div>

          <FormField
            label="Middle Name"
            value={draft.middle_name}
            onChange={(v) => onUpdate("middle_name", v)}
            size="md"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Contact No."
              value={draft.contact_no}
              onChange={(v) => onUpdate("contact_no", v)}
              size="md"
            />
            <FormAutocomplete
              label="Employer / Agency"
              value={draft.employer}
              onChange={(v) => onUpdate("employer", v)}
              suggestions={employers}
              size="md"
              optionClassName="text-base py-2"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 border-t border-border bg-muted/30 px-7 py-5">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            Register &amp; Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
