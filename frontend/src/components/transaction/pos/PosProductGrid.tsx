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
 * Each card is split in two: the product's category, name, and price on the
 * left, and a full-height green add panel on the right. The panel is the whole
 * add target rather than a small icon button — it is sized for a fingertip at
 * the counter, and it is the only thing that adds the item (clicking the card
 * body does nothing). When no customer is selected the cards are dimmed and the
 * panel is disabled.
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
        <Loader2 className="h-8 w-8 animate-spin text-[#118a57]" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-[#118a57]/25 bg-white/70 py-24 text-xs text-[#0f4435]/60">
        No products match your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const category = classifyProduct(product);
        return (
          // `overflow-hidden` so the add panel is clipped by the card's rounded
          // corners rather than squaring off its right edge.
          <div
            key={product.id}
            className={cn(
              "group flex overflow-hidden rounded-xl border border-[#0f4435]/12 bg-card text-left shadow-sm transition-all",
              disabled
                ? "opacity-50"
                : "hover:border-[#118a57]/40 hover:bg-[#f4faf7] hover:shadow-md"
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2f8f6a]">
                {category}
              </span>
              {/* The product name is the card's main read, so it carries the
                  largest type here. `min-h-10` reserves room for a second line
                  so prices stay on one baseline across a row of cards. */}
              <span className="mt-1 min-h-10 text-sm font-bold leading-snug text-[#0f4435]">
                {product.name}
              </span>
              <span className="mt-3 text-sm font-bold tabular-nums text-[#0f4435]">
                {formatPeso(product.price)}
              </span>
            </div>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onAdd(product)}
              aria-label={`Add ${product.name}`}
              className={cn(
                "flex w-20 shrink-0 items-center justify-center self-stretch transition-colors",
                disabled
                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                  : "cursor-pointer bg-[#118a57] text-white hover:bg-[#0f7a4d]"
              )}
            >
              <Plus className="h-8 w-8" strokeWidth={2.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
