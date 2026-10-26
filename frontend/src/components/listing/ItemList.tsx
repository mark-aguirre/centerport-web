"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyStateCard } from "@/components/common/empty-state-card";
import { formatPeso } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Item } from "@/components/listing/types";

interface ItemListProps {
  items: Item[];
  loading: boolean;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const headerClass =
  "h-12 px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0f4435]/55";

const cellClass = "px-5 py-3.5 text-sm";

/** Pill shared by the Type and Status columns. */
const pillClass =
  "inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide";

/** Square icon action button, tinted for the POS zone. */
const iconActionClass =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-transparent transition-colors";

/**
 * Results table for the Item Listing view.
 *
 * Renders items with right-aligned, currency-formatted price and fee columns,
 * pills for type and status, and per-row edit/delete actions. Handles its own
 * loading and empty states, and closes with the row count so the card reads the
 * same as the transactions and receivable tables in the POS zone.
 */
export function ItemList({ items, loading, onEdit, onDelete }: ItemListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-[#0f4435]/10 bg-white py-24 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-[#118a57]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyStateCard
        className="border-[#118a57]/25 bg-white/70"
        message="No items found. Adjust your search or add a new item."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#0f4435]/10 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-[#0f4435]/10 bg-[#f6faf8] hover:bg-[#f6faf8]">
            <TableHead className={headerClass}>Item</TableHead>
            <TableHead className={headerClass}>Description</TableHead>
            <TableHead className={cn(headerClass, "text-right")}>Price</TableHead>
            <TableHead className={cn(headerClass, "text-right")}>
              Prof. Fee
            </TableHead>
            <TableHead className={headerClass}>Type</TableHead>
            <TableHead className={headerClass}>Status</TableHead>
            <TableHead className={cn(headerClass, "text-right")}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow
              key={item.id ?? idx}
              className="border-[#0f4435]/8 transition-colors hover:bg-[#f4faf7]"
            >
              <TableCell className={cn(cellClass, "font-bold text-[#0f4435]")}>
                {item.name || "—"}
              </TableCell>
              <TableCell
                className={cn(
                  cellClass,
                  "max-w-[280px] truncate text-[#0f4435]/70"
                )}
              >
                {item.description || "—"}
              </TableCell>
              <TableCell
                className={cn(
                  cellClass,
                  "text-right font-semibold tabular-nums text-[#0f4435]"
                )}
              >
                {formatPeso(item.price)}
              </TableCell>
              <TableCell
                className={cn(
                  cellClass,
                  "text-right tabular-nums text-[#0f4435]/70"
                )}
              >
                {formatPeso(item.professional_fee)}
              </TableCell>
              <TableCell className={cellClass}>
                {item.is_package ? (
                  <span className={cn(pillClass, "bg-[#e8e3fb] text-[#4c3a9e]")}>
                    PACKAGE
                  </span>
                ) : (
                  <span className={cn(pillClass, "bg-[#0f4435]/8 text-[#0f4435]/65")}>
                    STANDARD
                  </span>
                )}
              </TableCell>
              <TableCell className={cellClass}>
                {item.active ? (
                  <span className={cn(pillClass, "bg-[#cdebdb] text-[#0b6440]")}>
                    ACTIVE
                  </span>
                ) : (
                  <span className={cn(pillClass, "bg-[#0f4435]/8 text-[#0f4435]/55")}>
                    INACTIVE
                  </span>
                )}
              </TableCell>
              <TableCell className={cn(cellClass, "text-right")}>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    aria-label={`Edit ${item.name}`}
                    onClick={() => onEdit(item)}
                    className={cn(
                      iconActionClass,
                      "text-[#0f4435]/60 hover:border-[#118a57]/30 hover:bg-[#eef8f2] hover:text-[#0f7a4d]"
                    )}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${item.name}`}
                    onClick={() => onDelete(item)}
                    className={cn(
                      iconActionClass,
                      "text-[#c0392b]/70 hover:border-[#e0b4b0] hover:bg-[#fdf4f3] hover:text-[#c0392b]"
                    )}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="border-t border-[#0f4435]/8 px-5 py-3 text-xs font-medium text-[#0f7a4d]">
        {items.length} item{items.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
