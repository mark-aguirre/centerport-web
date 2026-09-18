"use client";

import { Ban, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { TransactionSummary } from "@/components/transaction/types";

interface VoidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionSummary | null;
  reason: string;
  onReasonChange: (value: string) => void;
  voiding: boolean;
  onConfirm: () => void;
}

/**
 * Void confirmation dialog for a settled transaction.
 *
 * Requires a reason, which is recorded for the audit trail. A settled
 * transaction is never physically deleted — voiding only changes its status.
 */
export function VoidDialog({
  open,
  onOpenChange,
  transaction,
  reason,
  onReasonChange,
  voiding,
  onConfirm,
}: VoidDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0 overflow-hidden">
        <DialogHeader className="border-b border-border px-5 py-4 pr-14">
          <DialogTitle className="text-lg">Void Transaction</DialogTitle>
          <DialogDescription className="text-xs">
            This records the void reason for the audit trail. The transaction is
            not deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 py-4 text-xs">
          <div className="flex justify-between">
            <span className="text-primary/60 font-semibold uppercase tracking-wider text-[11px]">
              Transaction
            </span>
            <span className="text-foreground/90">
              {transaction?.transaction_id ?? "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary/60 font-semibold uppercase tracking-wider text-[11px]">
              Customer
            </span>
            <span className="text-foreground/90">
              {transaction?.customer_name ?? "—"}
            </span>
          </div>

          <div className="space-y-0.5">
            <label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
              Reason
              <span className="text-destructive ml-0.5">*</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="e.g. Customer requested cancellation"
              className="h-20 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 border-t border-border bg-muted/30 px-5 py-4">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={voiding}
          >
            Back
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="cursor-pointer"
            onClick={onConfirm}
            disabled={voiding}
          >
            {voiding ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Ban className="w-4 h-4 mr-1" />
            )}
            Confirm Void
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
