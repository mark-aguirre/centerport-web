"use client";

import { Loader2, Save } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/common/form-field";
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

/**
 * Add / edit dialog for a billable item.
 *
 * Presentational: the parent (`useItemListing`) owns the item state and save
 * logic. Numeric fields are parsed through {@link parsePeso} so the stored
 * values stay numeric while the user types currency-like input.
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
      <DialogContent className="max-w-lg gap-0 p-0 overflow-hidden">
        <DialogHeader className="border-b border-border px-5 py-4 pr-14">
          <DialogTitle className="text-lg">
            {isEditing ? "Edit Item" : "Add Item"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEditing
              ? "Update the item's details and price."
              : "Create a new billable service, examination, or package."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 py-4">
          <FormField
            label="Item Name"
            value={item.name}
            onChange={(v) => onUpdate("name", v)}
            required
            size="md"
          />

          <div className="space-y-0.5">
            <label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
              Description
            </label>
            <Textarea
              value={item.description}
              onChange={(e) => onUpdate("description", e.target.value)}
              className="h-20 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <FormField
              label="Price (₱)"
              type="number"
              value={item.price}
              onChange={(v) => onUpdate("price", parsePeso(v))}
              size="md"
            />
            <FormField
              label="Professional Fee (₱)"
              type="number"
              value={item.professional_fee}
              onChange={(v) => onUpdate("professional_fee", parsePeso(v))}
              size="md"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch
                checked={item.is_package}
                onCheckedChange={(checked) => onUpdate("is_package", checked)}
                aria-label="Package item"
              />
              <span className="text-xs text-foreground/80">Package</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch
                checked={item.active}
                onCheckedChange={(checked) => onUpdate("active", checked)}
                aria-label="Active item"
              />
              <span className="text-xs text-foreground/80">Active</span>
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2 border-t border-border bg-muted/30 px-5 py-4">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button size="sm" className="cursor-pointer" onClick={onSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
