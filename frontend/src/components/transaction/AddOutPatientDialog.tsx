"use client";

import { useState } from "react";
import { Building2, Leaf, List, Loader2, Phone, User, UserPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormAutocomplete } from "@/components/common/form-autocomplete";
import {
  PosFormField,
  POS_FIELD_INPUT,
  POS_FIELD_LABEL,
} from "@/components/transaction/pos/PosFormControls";
import { PosDialogMark } from "@/components/transaction/pos/PosDialogMark";
import { EmployerPickerDialog } from "@/components/transaction/EmployerPickerDialog";
import { posArt } from "@/components/transaction/pos/pos-theme";
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
 *
 * Laid out as three bands to match the POS zone: a mint header carrying the
 * action's icon and a clipboard mark, a white field body at counter scale (tall
 * inputs, each named by a leading icon), and a mint action footer that closes
 * with the clinic line. Field styling comes from `PosFormField` so the
 * free-text employer autocomplete sits flush with the plain inputs beside it.
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

  // "Browse" opens a full searchable list of employers so the cashier can pick
  // one without remembering the exact name. Typing in the field still works.
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden rounded-xl border-[#0f4435]/12 p-0">
        {/* Header band. The leaf wash backdrop and the clipboard mark sit on the
            right, clear of the title block, and are both decorative. */}
        <DialogHeader className="relative overflow-hidden border-b border-[#0f4435]/8 bg-[#f1f8f4] px-7 py-6 pr-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-cover bg-right bg-no-repeat opacity-70"
            style={{ backgroundImage: posArt("leafWash") }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f1f8f4] via-[#f1f8f4]/85 to-transparent"
          />

          <div className="relative flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#118a57]/15 text-[#0f7a4d]">
              <UserPlus className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-2xl text-[#0f4435]">
                Add Out-Patient
              </DialogTitle>
              <DialogDescription className="mt-1 max-w-md text-sm leading-relaxed text-[#0f4435]/70">
                Register a walk-in client to add to this sale. You can complete
                the full patient profile later.
              </DialogDescription>
            </div>
          </div>

          <PosDialogMark />
        </DialogHeader>

        <div className="space-y-5 bg-white px-7 py-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <PosFormField
              label="Last Name"
              icon={User}
              value={draft.last_name}
              onChange={(v) => onUpdate("last_name", v)}
              placeholder="Enter last name"
              required
            />
            <PosFormField
              label="First Name"
              icon={User}
              value={draft.first_name}
              onChange={(v) => onUpdate("first_name", v)}
              placeholder="Enter first name"
              required
            />
          </div>

          <PosFormField
            label="Middle Name"
            icon={User}
            value={draft.middle_name}
            onChange={(v) => onUpdate("middle_name", v)}
            placeholder="Enter middle name (optional)"
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <PosFormField
              label="Contact No."
              icon={Phone}
              type="tel"
              value={draft.contact_no}
              onChange={(v) => onUpdate("contact_no", v)}
              placeholder="Enter contact number"
            />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className={POS_FIELD_LABEL}>Employer / Agency</span>
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold text-[#0f7a4d] transition-colors cursor-pointer hover:bg-[#118a57]/10"
                >
                  <List className="h-3.5 w-3.5" />
                  Browse list
                </button>
              </div>
              <FormAutocomplete
                label="Employer / Agency"
                value={draft.employer}
                onChange={(v) => onUpdate("employer", v)}
                suggestions={employers}
                placeholder="Enter employer or agency (optional)"
                icon={Building2}
                className="space-y-0"
                labelClassName="sr-only"
                inputClassName={POS_FIELD_INPUT}
                optionClassName="text-sm py-2"
              />
            </div>
          </div>
        </div>

        <EmployerPickerDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          selected={draft.employer}
          onSelect={(name) => onUpdate("employer", name)}
        />

        <DialogFooter className="relative items-center gap-3 overflow-hidden border-t border-[#0f4435]/8 bg-[#f1f8f4] px-7 py-5 sm:justify-between">
          {/* Clinic line, with a leaf bleeding out of the bottom-left corner.
              Decorative, so it is hidden from assistive tech. */}
          <Leaf
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-3 -left-2 h-20 w-20 -rotate-[20deg] text-[#2f8f6a]/25"
            strokeWidth={1.25}
          />
          <p
            aria-hidden="true"
            className="relative hidden flex-col pl-14 text-xs leading-relaxed sm:flex"
          >
            <span className="font-bold text-[#0f4435]/80">Care Today.</span>
            <span className="text-[#2f8f6a]">A Healthier Tomorrow.</span>
          </p>

          <div className="relative flex gap-3">
            <Button
              variant="outline"
              className="h-14 min-w-36 cursor-pointer border-[#0f4435]/10 bg-[#eef0f4] text-base font-bold text-[#0f4435] hover:bg-[#e4e8ee]"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="h-14 min-w-48 cursor-pointer bg-gradient-to-r from-[#118a57] to-[#0d7349] text-base font-bold text-white shadow-sm hover:from-[#0f7a4d] hover:to-[#0b6440]"
              onClick={onSave}
              disabled={saving}
            >
              {/* `size-5` rather than `h-5 w-5`: the button's variant forces
                  `size-4` on any svg whose class does not already set a size. */}
              {saving ? (
                <Loader2 className="mr-2 size-5 animate-spin" />
              ) : (
                <UserPlus className="mr-2 size-5" />
              )}
              Register &amp; Add
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
