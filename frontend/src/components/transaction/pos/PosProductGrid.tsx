"use client";

import { Loader2, Plus } from "lucide-react";

import { formatPeso } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  classifyProduct,
  type Product,
} from "@/components/transaction/types";

interface PosProductGridProps {
  /** Products to display (already filtered by category + search). */
  products: Product[];
  /** True while the catalog is loading. */
  loading: boolean;
  /** Whether the grid is interactive (a customer must be selected first). */
  disabled?: boolean;
  /** Add a product to the cart. */
  onAdd: (product: Product) => void;
}

/**
 * Product card grid for the POS workspace.
 *
 * Renders sellable products as cards — category tag, name, price, and an add
 * button — matching the counter POS design. The grid is the primary way to add
 * items to the current transaction. When no customer is selected the cards are
 * dimmed and non-interactive.
 */
export function PosProductGrid({
  products,
  loading,
  disabled = false,
  onAdd,
}: PosProductGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-primary/20 py-24 text-xs text-muted-foreground">
        No products match your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const category = classifyProduct(product);
        return (
          <button
            key={product.id}
            type="button"
            disabled={disabled}
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name}`}
            className={cn(
              "group flex flex-col rounded-lg border border-primary/15 bg-card p-4 text-left shadow-sm transition-colors",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:border-primary/40 hover:shadow-md"
            )}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary/70">
              {category}
            </span>
            <span className="mt-1 min-h-9 text-sm font-semibold leading-tight text-foreground">
              {product.name}
            </span>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-base font-bold tabular-nums text-foreground">
                {formatPeso(product.price)}
              </span>
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                  disabled
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                )}
              >
                <Plus className="h-4 w-4" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
