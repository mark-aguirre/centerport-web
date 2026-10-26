"use client";

import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Loader2,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/common/form-select";
import { FormAutocomplete } from "@/components/common/form-autocomplete";
import { useEmployers } from "@/hooks/use-employers";
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

const detailLabel = "text-[11px] font-bold uppercase tracking-wider text-[#0f4435]/55";

/**
 * The POS cart / order summary panel.
 *
 * The fixed right column of the counter POS design: client details at the top,
 * a scrollable list of line items in the middle, and the totals plus the Void /
 * Settle actions pinned at the bottom.
 *
 * Styled in the POS zone's clinical greens (see `pos-theme.ts`) rather than the
 * app-wide primary token, so the panel sits with the rail and the hero.
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
  // Toggles the inline agency picker in the client details block.
  const [editingAgency, setEditingAgency] = useState(false);
  // The agency as it stood when the picker opened, so Cancel can put it back.
  // The picker writes through on every change, which is what lets the cashier
  // pick straight from the list — so an undo value is needed for Cancel to
  // mean what it says.
  const [agencyBeforeEdit, setAgencyBeforeEdit] = useState<string | null>(null);

  // Master agency list, shown in full the moment the picker opens.
  const employers = useEmployers();

  /** Open the agency picker, remembering the current value. */
  const startEditingAgency = () => {
    setAgencyBeforeEdit(agency);
    setEditingAgency(true);
  };

  /** Close the agency picker, restoring the value it had on open. */
  const cancelEditingAgency = () => {
    onChangeAgency(agencyBeforeEdit);
    setEditingAgency(false);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden border-l border-[#0f4435]/12 bg-card">
      {/* Client details */}
      <div className="border-b border-[#0f4435]/10 bg-[#eef8f2] px-4 py-3.5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#118a57]/15 text-[#0f7a4d]">
            <UserRound className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <span className={detailLabel}>Client Details</span>
              {customer && (
                <button
                  type="button"
                  onClick={onEditCustomer}
                  className="cursor-pointer text-[11px] font-semibold text-[#0f7a4d] hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            {customer ? (
              <>
                <p className="truncate text-base font-semibold leading-tight text-[#0f4435]">
                  {customer.name}
                </p>
                <p className="text-[11px] text-[#0f4435]/55">
                  {customer.application_no || "—"}
                </p>
              </>
            ) : (
              <p className="text-xs text-[#0f4435]/60">No client selected yet.</p>
            )}
          </div>
        </div>

        {customer && (
          <div className="mt-2.5 rounded-md border border-[#0f4435]/12 bg-white px-3 py-2">
            <div className="flex items-center justify-between">
              <p className={detailLabel}>Agency</p>
              <div className="flex items-center gap-2">
                {editingAgency && (
                  <button
                    type="button"
                    onClick={() => setEditingAgency(false)}
                    className="cursor-pointer text-[11px] font-semibold text-[#0f7a4d] hover:underline"
                  >
                    Done
                  </button>
                )}
                <button
                  type="button"
                  onClick={
                    editingAgency ? cancelEditingAgency : startEditingAgency
                  }
                  className="cursor-pointer text-[11px] font-semibold text-[#0f4435]/55 hover:underline"
                >
                  {editingAgency ? "Cancel" : "Change"}
                </button>
              </div>
            </div>
            {editingAgency ? (
              <div className="mt-1">
                {/* The whole agency list is on screen as soon as the editor
                    opens — autofocusing the field opens the suggestions, so the
                    cashier can pick one without typing, and typing narrows the
                    list. Free text is accepted too: the billed agency is a
                    display-only override on the draft. */}
                <FormAutocomplete
                  label="Agency"
                  labelClassName="sr-only"
                  value={agency ?? ""}
                  onChange={onChangeAgency}
                  suggestions={employers}
                  placeholder="Search agency..."
                  icon={Search}
                  maxSuggestions={50}
                  inputClassName="h-10 pl-11 text-xs"
                  optionClassName="text-xs py-2"
                  autoFocus
                />
              </div>
            ) : (
              <p className="text-xs text-foreground/90">{agency || "—"}</p>
            )}
          </div>
        )}
      </div>

      {/* Line items. The horizontal padding sits on each row rather than this
          container so a row's hover tint spans the full width of the panel. */}
      <div className="flex-1 overflow-y-auto py-2">
        {items.length === 0 ? (
          <div className="flex h-full min-h-32 flex-col items-center justify-center gap-4 px-4 text-center">
            <ShoppingBag
              aria-hidden="true"
              className="h-16 w-16 text-[#0f4435]/15"
              strokeWidth={1.25}
            />
            <p className="text-xs text-[#0f4435]/55">
              Tap a product to add it to the order.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#0f4435]/8">
            {items.map((item) => {
              const expanded = expandedKey === item.key;
              return (
                <li
                  key={item.key}
                  className={cn(
                    "px-4 py-3 transition-colors hover:bg-[#f4faf7]",
                    expanded && "bg-[#f4faf7]"
                  )}
                >
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
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                        <span className="text-muted-foreground">
                          {formatPeso(item.price_snapshot)} each
                        </span>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          {item.billing_type}
                        </span>
                        {item.professional_fee > 0 && (
                          <span className="text-muted-foreground">
                            PF {formatPeso(item.professional_fee)}
                          </span>
                        )}
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 text-muted-foreground transition-transform",
                            expanded && "rotate-180"
                          )}
                        />
                      </div>
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
      <div className="space-y-1 border-t border-[#0f4435]/10 bg-[#f7fbf9] px-4 py-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[#0f4435]/70">Subtotal</span>
          <span className="tabular-nums text-[#0f4435]/90">
            {formatPeso(totals.itemsTotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#0f4435]/70">Professional Fee</span>
          <span className="tabular-nums text-[#0f4435]/90">
            {formatPeso(totals.feesTotal)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-[#0f4435]/10 pt-2">
          <span className="text-lg font-bold text-[#0f4435]">Total</span>
          <span className="text-lg font-bold tabular-nums text-[#0f7a4d]">
            {formatPeso(totals.total)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 border-t border-[#0f4435]/10 bg-[#f7fbf9] px-4 pt-3">
        <Button
          variant="outline"
          className="h-12 cursor-pointer border-[#0f4435]/15 bg-white text-[#0f4435] hover:bg-[#eef8f2]"
          onClick={onVoid}
          disabled={settling}
        >
          Void
        </Button>
        <Button
          className="h-12 cursor-pointer bg-gradient-to-r from-[#118a57] to-[#0d7349] text-white shadow-sm hover:from-[#0f7a4d] hover:to-[#0b6440]"
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

      {/* Closing clinic line. Decorative, so it is hidden from assistive tech. */}
      <p
        aria-hidden="true"
        className="flex items-center justify-center gap-2 bg-[#f7fbf9] px-4 pb-3 pt-3 text-xs italic text-[#0f4435]/45"
      >
        <span className="h-px w-5 bg-[#0f4435]/15" />
        &ldquo;Good Health. Brighter Days.&rdquo;
        <span className="h-px w-5 bg-[#0f4435]/15" />
      </p>
    </div>
  );
}
