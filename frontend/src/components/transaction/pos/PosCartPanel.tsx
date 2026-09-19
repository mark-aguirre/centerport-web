"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, Loader2, Minus, Plus, Trash2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/common/form-select";
import { SearchSelect } from "@/components/transaction/SearchSelect";
import { api, type EmployerRecord } from "@/lib/api";
import { formatPeso, parsePeso } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  BILLING_TYPES,
  itemDisplayDescription,
  type BillingType,
  type Customer,
  type TransactionItem,
} from "@/components/transaction/types";

interface PosCartPanelProps {
  /** The selected customer, or null when none is chosen yet. */
  customer: Customer | null;
  /** Cart line items. */
  items: TransactionItem[];
  /** Patch a single line item (billing type / professional fee). */
  onUpdateItem: (key: string, patch: Partial<TransactionItem>) => void;
  /** Remove a line item by its client key. */
  onRemoveItem: (key: string) => void;
  /** Clear the customer selection to pick a different one. */
  onEditCustomer: () => void;
  /** Currently billed agency (defaults to the customer's, can be overridden). */
  agency: string | null;
  /** Change the billed agency for this draft. */
  onChangeAgency: (agency: string | null) => void;
  /** Computed totals. */
  totals: { itemsTotal: number; feesTotal: number; total: number };
  /** Whether the transaction can be settled. */
  canSettle: boolean;
  /** True while a settle request is in flight. */
  settling: boolean;
  /** Void / discard the current transaction. */
  onVoid: () => void;
  /** Settle the transaction. */
  onSettle: () => void;
}

const detailLabel = "text-[11px] font-bold uppercase tracking-wider text-primary/60";

/**
 * The POS cart / order summary panel.
 *
 * The fixed right column of the counter POS design: client details at the top,
 * a scrollable list of line items in the middle, and the totals plus the Void /
 * Settle actions pinned at the bottom.
 *
 * Each line item is individually editable — expand a row to change its billing
 * type and professional fee.
 */
export function PosCartPanel({
  customer,
  items,
  onUpdateItem,
  onRemoveItem,
  onEditCustomer,
  agency,
  onChangeAgency,
  totals,
  canSettle,
  settling,
  onVoid,
  onSettle,
}: PosCartPanelProps) {
  // Which line item is currently expanded for editing (client key).
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  // Toggles the inline agency search/select in the client details block.
  const [editingAgency, setEditingAgency] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden border-l border-primary/15 bg-card">
      {/* Client details */}
      <div className="border-b border-primary/10 bg-primary/[0.04] px-4 py-3">
        <div className="flex items-start justify-between">
          <span className={detailLabel}>Client Details</span>
          {customer && (
            <button
              type="button"
              onClick={onEditCustomer}
              className="cursor-pointer text-[11px] font-semibold text-primary hover:underline"
            >
              Edit
            </button>
          )}
        </div>
        {customer ? (
          <div className="mt-1">
            <p className="text-base font-semibold leading-tight text-foreground">
              {customer.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {customer.application_no || "—"}
            </p>
            <div className="mt-2 rounded-md border border-primary/15 bg-card px-3 py-2">
              <div className="flex items-center justify-between">
                <p className={detailLabel}>Agency</p>
                <button
                  type="button"
                  onClick={() => setEditingAgency((prev) => !prev)}
                  className="cursor-pointer text-[11px] font-semibold text-primary hover:underline"
                >
                  {editingAgency ? "Cancel" : "Change"}
                </button>
              </div>
              {editingAgency ? (
                <div className="mt-1">
                  <SearchSelect<EmployerRecord>
                    onSearch={(kw) => api.Employer.search(kw)}
                    onSelect={(employer) => {
                      onChangeAgency(employer.name);
                      setEditingAgency(false);
                    }}
                    renderPrimary={(e) => e.name}
                    placeholder="Search agency..."
                    ariaLabel="Search agency"
                  />
                </div>
              ) : (
                <p className="text-xs text-foreground/90">{agency || "—"}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-4 w-4" />
            No client selected yet.
          </div>
        )}
      </div>

      {/* Line items */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {items.length === 0 ? (
          <div className="flex h-full min-h-32 items-center justify-center text-center text-xs text-muted-foreground">
            Tap a product to add it to the order.
          </div>
        ) : (
          <ul className="divide-y divide-primary/10">
            {items.map((item) => {
              const expanded = expandedKey === item.key;
              return (
                <li key={item.key} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedKey((prev) => (prev === item.key ? null : item.key))
                      }
                      aria-expanded={expanded}
                      aria-label={`Edit ${item.description_snapshot}`}
                      className="min-w-0 flex-1 cursor-pointer text-left"
                    >
                      <p className="truncate text-sm font-medium text-foreground">
                        {itemDisplayDescription(
                          item.description_snapshot,
                          item.personal_account
                        )}
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        {formatPeso(item.price_snapshot)} · {item.billing_type}
                        {item.professional_fee > 0 &&
                          ` · PF ${formatPeso(item.professional_fee)}`}
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 transition-transform",
                            expanded && "rotate-180"
                          )}
                        />
                      </p>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {formatPeso(item.price_snapshot * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.key)}
                        aria-label={`Remove ${item.description_snapshot}`}
                        className="cursor-pointer text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quantity stepper */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        item.quantity <= 1
                          ? onRemoveItem(item.key)
                          : onUpdateItem(item.key, { quantity: item.quantity - 1 })
                      }
                      aria-label={`Decrease quantity of ${item.description_snapshot}`}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-primary/20 text-foreground/70 transition-colors hover:bg-primary/10 hover:text-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold tabular-nums text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateItem(item.key, { quantity: item.quantity + 1 })
                      }
                      aria-label={`Increase quantity of ${item.description_snapshot}`}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-primary/20 text-foreground/70 transition-colors hover:bg-primary/10 hover:text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Per-item editor */}
                  {expanded && (
                    <div className="mt-2 grid grid-cols-2 gap-2 rounded-md border border-primary/15 bg-muted/30 p-2">
                      <FormSelect
                        label="Billing Type"
                        value={item.billing_type}
                        onChange={(v) =>
                          onUpdateItem(item.key, { billing_type: v as BillingType })
                        }
                        options={BILLING_TYPES}
                        size="md"
                      />
                      <div className="space-y-0.5">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-primary/60">
                          Prof. Fee (₱)
                        </label>
                        <input
                          type="number"
                          value={item.professional_fee}
                          onChange={(e) =>
                            onUpdateItem(item.key, {
                              professional_fee: parsePeso(e.target.value),
                            })
                          }
                          aria-label={`Professional fee for ${item.description_snapshot}`}
                          className="h-8 w-full rounded-md border border-primary/30 bg-white px-2 text-xs shadow-sm transition-colors hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:bg-input/30"
                        />
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-1 border-t border-primary/10 px-4 py-3 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/70">Subtotal</span>
          <span className="tabular-nums text-foreground/90">
            {formatPeso(totals.itemsTotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">Professional Fee</span>
          <span className="tabular-nums text-foreground/90">
            {formatPeso(totals.feesTotal)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-primary/10 pt-2">
          <span className="text-lg font-bold text-foreground">Total</span>
          <span className="text-lg font-bold tabular-nums text-primary">
            {formatPeso(totals.total)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 border-t border-primary/10 px-4 py-3">
        <Button
          variant="outline"
          className="h-12 cursor-pointer"
          onClick={onVoid}
          disabled={settling}
        >
          Void
        </Button>
        <Button
          className="h-12 cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600"
          onClick={onSettle}
          disabled={!canSettle || settling}
        >
          {settling ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : null}
          Settle Payment
          {!settling && <ArrowRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
