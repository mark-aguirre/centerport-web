"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";

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
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import { parsePeso } from "@/lib/format";
import {
  BILLING_TYPES,
  type BillingType,
  type TransactionItem,
} from "@/components/transaction/types";

interface TransactionItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The item being edited (null when the dialog is closed). */
  item: TransactionItem | null;
  onSave: (key: string, patch: Partial<TransactionItem>) => void;
  onRemove: (key: string) => void;
}

/**
 * Edit dialog for a single transaction item.
 *
 * Lets the user adjust the description, price, professional fee, billing type,
 * and personal-account flag before the transaction is settled. Edits a local
 * copy and commits on Save so Cancel discards cleanly.
 */
export function TransactionItemDialog({
  open,
  onOpenChange,
  item,
  onSave,
  onRemove,
}: TransactionItemDialogProps) {
  const [draft, setDraft] = useState<TransactionItem | null>(item);
  // Track which item the draft was seeded from so we can re-seed when a
  // different item is opened — adjusting state during render (React's
  // recommended alternative to a sync-in-effect reset).
  const [seededKey, setSeededKey] = useState<string | null>(item?.key ?? null);

  const currentKey = item?.key ?? null;
  if (currentKey !== seededKey) {
    setDraft(item);
    setSeededKey(currentKey);
  }

  if (!draft) return null;

  const update = <K extends keyof TransactionItem>(field: K, value: TransactionItem[K]) =>
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));

  const handleSave = () => {
    onSave(draft.key, {
      description_snapshot: draft.description_snapshot,
      price_snapshot: draft.price_snapshot,
      professional_fee: draft.professional_fee,
      billing_type: draft.billing_type,
      personal_account: draft.personal_account,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0 overflow-hidden">
        <DialogHeader className="border-b border-border px-5 py-4 pr-14">
          <DialogTitle className="text-lg">Edit Transaction Item</DialogTitle>
          <DialogDescription className="text-xs">
            Adjust this item before settling the transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 py-4">
          <FormField
            label="Description"
            value={draft.description_snapshot}
            onChange={(v) => update("description_snapshot", v)}
            size="md"
          />

          <div className="grid grid-cols-2 gap-2">
            <FormField
              label="Price (₱)"
              type="number"
              value={draft.price_snapshot}
              onChange={(v) => update("price_snapshot", parsePeso(v))}
              size="md"
            />
            <FormField
              label="Professional Fee (₱)"
              type="number"
              value={draft.professional_fee}
              onChange={(v) => update("professional_fee", parsePeso(v))}
              size="md"
            />
          </div>

          <FormSelect
            label="Billing Type"
            value={draft.billing_type}
            onChange={(v) => update("billing_type", v as BillingType)}
            options={BILLING_TYPES}
            size="md"
          />

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <Switch
              checked={draft.personal_account}
              onCheckedChange={(checked) => update("personal_account", checked)}
              aria-label="Personal account"
            />
            <span className="text-xs text-foreground/80">Personal Account</span>
          </label>
        </div>

        <DialogFooter className="justify-between gap-2 border-t border-border bg-muted/30 px-5 py-4 sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer text-destructive hover:text-destructive"
            onClick={() => {
              onRemove(draft.key);
              onOpenChange(false);
            }}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
          <Button size="sm" className="cursor-pointer" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
