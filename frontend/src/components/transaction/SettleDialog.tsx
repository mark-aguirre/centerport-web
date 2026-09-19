"use client";

import { useMemo } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPeso } from "@/lib/format";
import {
  computeTransactionTotals,
  itemDisplayDescription,
  type BillingType,
  type TransactionItem,
} from "@/components/transaction/types";

interface SettleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  items: TransactionItem[];
  settling: boolean;
  onConfirm: () => void;
}

/**
 * Settlement confirmation dialog.
 *
 * Summarizes the transaction — customer, item count, totals, and a per-billing-
 * type breakdown — before the user commits to settling. The backend remains the
 * source of truth for the persisted total; this is a review surface.
 */
export function SettleDialog({
  open,
  onOpenChange,
  customerName,
  items,
  settling,
  onConfirm,
}: SettleDialogProps) {
  const totals = useMemo(() => computeTransactionTotals(items), [items]);

  // Sum item price + fee grouped by billing type for the breakdown.
  const byBillingType = useMemo(() => {
    const map = new Map<BillingType, number>();
    for (const item of items) {
      const amount =
        ((item.price_snapshot || 0) + (item.professional_fee || 0)) *
        (item.quantity || 1);
      map.set(item.billing_type, (map.get(item.billing_type) ?? 0) + amount);
    }
    return Array.from(map.entries());
  }, [items]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0 overflow-hidden">
        <DialogHeader className="border-b border-border px-5 py-4 pr-14">
          <DialogTitle className="text-lg">Confirm Settlement</DialogTitle>
          <DialogDescription className="text-xs">
            Review the transaction before settling.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 py-4 text-xs">
          <div className="flex justify-between">
            <span className="text-primary/60 font-semibold uppercase tracking-wider text-[11px]">
              Customer
            </span>
            <span className="text-foreground/90">{customerName || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary/60 font-semibold uppercase tracking-wider text-[11px]">
              Items
            </span>
            <span className="text-foreground/90">{items.length}</span>
          </div>

          <div className="border-t border-primary/10 pt-2 space-y-1.5">
            {items.map((item) => {
              const lineTotal =
                ((item.price_snapshot || 0) + (item.professional_fee || 0)) *
                (item.quantity || 1);
              return (
                <div key={item.key} className="flex justify-between gap-3">
                  <span className="text-foreground/70 min-w-0 flex-1 truncate">
                    {itemDisplayDescription(
                      item.description_snapshot,
                      item.personal_account
                    )}
                    {(item.quantity || 1) > 1 && (
                      <span className="text-foreground/50">
                        {" "}
                        × {item.quantity}
                      </span>
                    )}
                  </span>
                  <span className="tabular-nums text-foreground/90 shrink-0">
                    {formatPeso(lineTotal)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-primary/10 pt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-foreground/70">Items</span>
              <span className="tabular-nums text-foreground/90">
                {formatPeso(totals.itemsTotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Professional Fees</span>
              <span className="tabular-nums text-foreground/90">
                {formatPeso(totals.feesTotal)}
              </span>
            </div>
            <div className="flex justify-between border-t border-primary/10 pt-1 font-semibold">
              <span className="text-primary">TOTAL</span>
              <span className="tabular-nums text-primary">
                {formatPeso(totals.total)}
              </span>
            </div>
          </div>

          {byBillingType.length > 0 && (
            <div className="border-t border-primary/10 pt-2 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/60">
                Billing Types
              </p>
              {byBillingType.map(([type, amount]) => (
                <div key={type} className="flex justify-between">
                  <span className="text-foreground/70">{type}</span>
                  <span className="tabular-nums text-foreground/90">
                    {formatPeso(amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t border-border bg-muted/30 px-5 py-4">
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer px-6 text-sm"
            onClick={() => onOpenChange(false)}
            disabled={settling}
          >
            Back
          </Button>
          <Button
            size="lg"
            className="cursor-pointer px-6 text-sm"
            onClick={onConfirm}
            disabled={settling}
          >
            {settling ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
            )}
            Confirm Settle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
