"use client";

import { useMemo, type KeyboardEvent, type ReactNode } from "react";
import {
  CheckCircle2,
  CreditCard,
  Leaf,
  Loader2,
  Package,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PosDialogMark } from "@/components/transaction/pos/PosDialogMark";
import { posArt } from "@/components/transaction/pos/pos-theme";
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
 * One titled block in the settlement summary.
 *
 * An icon chip and an uppercase label head the block, with an optional value
 * aligned opposite it for single-fact sections such as the customer. Detail
 * rows, when there are any, sit underneath.
 */
function SettleSection({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: LucideIcon;
  label: string;
  value?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#0f4435]/8 bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#118a57]/12 text-[#0f7a4d]"
          >
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#0f4435]">
            {label}
          </span>
        </span>
        {value !== undefined && (
          <span className="truncate text-sm font-semibold text-[#0f7a4d]">
            {value}
          </span>
        )}
      </div>
      {children && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

/** A detail row: description on the left, peso amount on the right. */
function SummaryRow({
  label,
  amount,
}: {
  label: ReactNode;
  amount: number;
}) {
  return (
    <div className="flex justify-between gap-3 py-1">
      <span className="min-w-0 flex-1 truncate text-sm text-[#2f8f6a]">
        {label}
      </span>
      <span className="shrink-0 text-sm tabular-nums text-[#0f4435]">
        {formatPeso(amount)}
      </span>
    </div>
  );
}

/**
 * Settlement confirmation dialog.
 *
 * Summarizes the transaction — customer, the item lines, totals, and a
 * per-billing-type breakdown — before the user commits to settling. The backend
 * remains the source of truth for the persisted total; this is a review surface.
 *
 * Built from the POS dialog bands (mint header with the clipboard mark, light
 * review body, mint action footer with the clinic line), so it reads as a
 * sibling of the Add Out-Patient and Add Item dialogs.
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

  // Enter confirms the settlement, matching the primary action; Escape is
  // handled by the Dialog primitive, which closes on Escape by default (that
  // calls onOpenChange(false), the same path as "Back").
  //
  // This fires regardless of which element holds focus (on open, focus lands on
  // a button, so a focus-scoped handler would never see Enter). The one
  // exception is the "Back" button: if the user has tabbed onto it, let its
  // native click win so Enter there still goes Back. Ignored while settling to
  // avoid a double submit.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" || settling) {
      return;
    }
    const focusedButton = (event.target as HTMLElement).closest("button");
    if (focusedButton?.dataset.settleAction === "back") {
      return;
    }
    event.preventDefault();
    onConfirm();
  };

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
      <DialogContent
        className="max-w-xl gap-0 overflow-hidden rounded-xl border-[#0f4435]/12 p-0"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="relative overflow-hidden border-b border-[#0f4435]/8 bg-[#f1f8f4] px-6 py-5 pr-16">
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
              Confirm Settlement
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-[#0f4435]/70">
              Review the transaction before settling.
            </DialogDescription>
          </div>

          <PosDialogMark className="right-12 h-20 w-28" />
        </DialogHeader>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto bg-[#f7faf9] px-4 py-4">
          <SettleSection
            icon={UserRound}
            label="Customer"
            value={customerName || "—"}
          />

          <SettleSection icon={Package} label={`Items (${items.length})`}>
            <div className="space-y-0.5">
              {items.map((item) => {
                const lineTotal =
                  ((item.price_snapshot || 0) + (item.professional_fee || 0)) *
                  (item.quantity || 1);
                return (
                  <SummaryRow
                    key={item.key}
                    amount={lineTotal}
                    label={
                      <>
                        {itemDisplayDescription(
                          item.description_snapshot,
                          item.personal_account
                        )}
                        {(item.quantity || 1) > 1 && (
                          <span className="text-[#2f8f6a]/65">
                            {" "}
                            × {item.quantity}
                          </span>
                        )}
                      </>
                    }
                  />
                );
              })}
            </div>

            <div className="mt-2 space-y-0.5 border-t border-dashed border-[#0f4435]/12 pt-2">
              <SummaryRow label="Items" amount={totals.itemsTotal} />
              <SummaryRow label="Professional Fees" amount={totals.feesTotal} />
            </div>

            {/* Total breaks out of the block's padding so the tinted band runs
                the full width of the card, as the heaviest line in the review. */}
            <div className="-mx-4 mt-3 flex items-center justify-between gap-3 bg-[#eef4f1] px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#0f4435]">
                Total
              </span>
              <span className="text-lg font-bold tabular-nums text-[#0f7a4d]">
                {formatPeso(totals.total)}
              </span>
            </div>
          </SettleSection>

          {byBillingType.length > 0 && (
            <SettleSection icon={CreditCard} label="Billing Type">
              <div className="space-y-0.5">
                {byBillingType.map(([type, amount]) => (
                  <SummaryRow key={type} label={type} amount={amount} />
                ))}
              </div>
            </SettleSection>
          )}
        </div>

        <DialogFooter className="relative items-center gap-3 overflow-hidden border-t border-[#0f4435]/8 bg-[#f1f8f4] px-6 py-4 sm:justify-between">
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
              data-settle-action="back"
              className="h-12 min-w-28 cursor-pointer border-[#0f4435]/15 bg-white text-base font-bold text-[#0f4435] hover:bg-[#eef8f2]"
              onClick={() => onOpenChange(false)}
              disabled={settling}
            >
              Back
            </Button>
            <Button
              className="h-12 min-w-44 cursor-pointer bg-gradient-to-r from-[#118a57] to-[#0d7349] text-base font-bold text-white shadow-sm hover:from-[#0f7a4d] hover:to-[#0b6440]"
              onClick={onConfirm}
              disabled={settling}
            >
              {/* `size-5` rather than `h-5 w-5`: the button's variant forces
                  `size-4` on any svg whose class does not already set a size. */}
              {settling ? (
                <Loader2 className="mr-2 size-5 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 size-5" />
              )}
              Confirm Settle
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
