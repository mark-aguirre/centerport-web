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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyStateCard } from "@/components/common/empty-state-card";
import { formatPeso } from "@/lib/format";
import type { Item } from "@/components/listing/types";

interface ItemListProps {
  items: Item[];
  loading: boolean;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const headerClass =
  "text-[11px] font-bold text-primary/70 uppercase tracking-wider";

/**
 * Results grid for the Item Listing page.
 *
 * Renders items with a right-aligned, currency-formatted price and per-row
 * edit/delete actions. Handles loading and empty states inline following the
 * shared list conventions.
 */
export function ItemList({ items, loading, onEdit, onDelete }: ItemListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyStateCard message="No items found. Adjust your search or add a new item." />
    );
  }

  return (
    <div className="rounded-lg border border-primary/10 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className={headerClass}>Item</TableHead>
            <TableHead className={headerClass}>Description</TableHead>
            <TableHead className={`${headerClass} text-right`}>Price</TableHead>
            <TableHead className={`${headerClass} text-right`}>Prof. Fee</TableHead>
            <TableHead className={headerClass}>Type</TableHead>
            <TableHead className={headerClass}>Status</TableHead>
            <TableHead className={`${headerClass} text-right`}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow
              key={item.id ?? idx}
              className={idx % 2 === 1 ? "bg-muted/30" : undefined}
            >
              <TableCell className="text-xs font-medium text-foreground/90">
                {item.name || "—"}
              </TableCell>
              <TableCell className="text-xs text-foreground/80 max-w-[280px] truncate">
                {item.description || "—"}
              </TableCell>
              <TableCell className="text-xs text-foreground/80 text-right tabular-nums">
                {formatPeso(item.price)}
              </TableCell>
              <TableCell className="text-xs text-foreground/80 text-right tabular-nums">
                {formatPeso(item.professional_fee)}
              </TableCell>
              <TableCell className="text-xs text-foreground/80">
                {item.is_package ? (
                  <Badge variant="secondary" className="text-[11px]">Package</Badge>
                ) : (
                  <span className="text-muted-foreground">Standard</span>
                )}
              </TableCell>
              <TableCell className="text-xs">
                {item.active ? (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    Inactive
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="cursor-pointer"
                    aria-label={`Edit ${item.name}`}
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="cursor-pointer text-destructive hover:text-destructive"
                    aria-label={`Delete ${item.name}`}
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
