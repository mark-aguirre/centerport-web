"use client";

import {
  FileText,
  Leaf,
  Loader2,
  Package,
  PhilippinePeso,
  Save,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  PosFormField,
  PosFormTextarea,
  POS_FIELD_LABEL_UPPER,
} from "@/components/transaction/pos/PosFormControls";
import { PosDialogMark } from "@/components/transaction/pos/PosDialogMark";
import { posArt } from "@/components/transaction/pos/pos-theme";
import { parsePeso } from "@/lib/format";
import type { Item } from "@/components/listing/types";

interface ItemEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item;
  isEditing: boolean;
  saving: boolean;
  onUpdate: <K extends keyof Item>(field: K, value: Item[K]) => void;
  onSave: () => void;
}

/** Switch + label pair, styled for the POS zone. */
function PosToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      {/* The thumb is sized through a descendant selector so the larger
          counter-scale track keeps a proportional knob. */}
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        aria-label={`${label} item`}
        className="h-6 w-11 data-checked:bg-[#118a57] data-unchecked:bg-[#0f4435]/15 [&_span]:h-5 [&_span]:w-5 [&_span]:data-checked:translate-x-5"
      />
      <span className="text-sm font-semibold text-[#0f4435]">{label}</span>
    </label>
  );
}

/**
 * Add / edit dialog for a billable item.
 *
 * Presentational: the parent (`useItemListing`) owns the item state and save
 * logic. Numeric fields are parsed through {@link parsePeso} so the stored
 * values stay numeric while the user types currency-like input.
 *
 * Laid out as the three POS dialog bands — mint header with the clipboard mark,
 * white field body at counter scale, mint action footer closing with the clinic
 * line — so it reads as a sibling of the Add Out-Patient dialog.
 */
export function ItemEditDialog({
  open,
  onOpenChange,
  item,
  isEditing,
  saving,
  onUpdate,
  onSave,
}: ItemEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-xl border-[#0f4435]/12 p-0">
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

          <div className="relative min-w-0">
            <DialogTitle className="text-2xl text-[#0f4435]">
              {isEditing ? "Edit Item" : "Add Item"}
            </DialogTitle>
            <DialogDescription className="mt-1 max-w-sm text-sm leading-relaxed text-[#0f4435]/70">
              {isEditing
                ? "Update the item's details and price."
                : "Create a new billable service, examination, or package."}
            </DialogDescription>
          </div>

          <PosDialogMark className="right-14" />
        </DialogHeader>

        <div className="space-y-5 bg-white px-7 py-6">
          <PosFormField
            label="Item Name"
            icon={Package}
            value={item.name}
            onChange={(v) => onUpdate("name", v)}
            placeholder="Enter item name"
            labelClassName={POS_FIELD_LABEL_UPPER}
            required
          />

          <PosFormTextarea
            label="Description"
            icon={FileText}
            value={item.description}
            onChange={(v) => onUpdate("description", v)}
            placeholder="Enter description (optional)"
            labelClassName={POS_FIELD_LABEL_UPPER}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <PosFormField
              label="Price (₱)"
              icon={PhilippinePeso}
              type="number"
              value={item.price}
              onChange={(v) => onUpdate("price", parsePeso(v))}
              placeholder="0.00"
              labelClassName={POS_FIELD_LABEL_UPPER}
              required
            />
            <PosFormField
              label="Professional Fee (₱)"
              icon={PhilippinePeso}
              type="number"
              value={item.professional_fee}
              onChange={(v) => onUpdate("professional_fee", parsePeso(v))}
              placeholder="0.00"
              labelClassName={POS_FIELD_LABEL_UPPER}
            />
          </div>

          <div className="flex items-center gap-8 pt-1">
            <PosToggle
              label="Package"
              checked={item.is_package}
              onChange={(checked) => onUpdate("is_package", checked)}
            />
            <PosToggle
              label="Active"
              checked={item.active}
              onChange={(checked) => onUpdate("active", checked)}
            />
          </div>
        </div>

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
              className="h-14 min-w-32 cursor-pointer border-[#0f4435]/10 bg-[#eef0f4] text-base font-bold text-[#0f4435] hover:bg-[#e4e8ee]"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="h-14 min-w-36 cursor-pointer bg-gradient-to-r from-[#118a57] to-[#0d7349] text-base font-bold text-white shadow-sm hover:from-[#0f7a4d] hover:to-[#0b6440]"
              onClick={onSave}
              disabled={saving}
            >
              {/* `size-5` rather than `h-5 w-5`: the button's variant forces
                  `size-4` on any svg whose class does not already set a size. */}
              {saving ? (
                <Loader2 className="mr-2 size-5 animate-spin" />
              ) : (
                <Save className="mr-2 size-5" />
              )}
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
