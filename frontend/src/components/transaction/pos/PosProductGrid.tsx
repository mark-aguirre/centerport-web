"use client";

import {
  Box,
  FlaskConical,
  Loader2,
  Plus,
  ScrollText,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

import { formatPeso } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  classifyProduct,
  type Product,
  type ProductCategory,
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
 * Icon shown in each card's badge, keyed by the product's derived category.
 * A module-level map rather than a render-time lookup so the grid satisfies the
 * `react-hooks/static-components` rule.
 */
const CATEGORY_ICON: Record<ProductCategory, LucideIcon> = {
  LABS: FlaskConical,
  MEDICAL: ScrollText,
  "X-RAY": Stethoscope,
  OTHER: Box,
};

/**
 * Product card grid for the POS workspace.
 *
 * Each card is a vertical tile: a soft circular icon badge keyed to the
 * product's category, the product name, its price, and a full-width green
 * "+ Add" button. The button is the only add target (the card body does
 * nothing), sized for a fingertip at the counter. When no customer is selected
 * the cards are dimmed and the button is disabled.
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const category = classifyProduct(product);
        const Icon = CATEGORY_ICON[category];
        return (
          <div
            key={product.id}
            className={cn(
              "group flex flex-col rounded-xl border border-[#0f4435]/12 bg-card p-4 text-center shadow-sm transition-all",
              disabled
                ? "opacity-50"
                : "hover:border-[#118a57]/40 hover:shadow-md"
            )}
          >
            {/* Soft circular badge holding the category icon. */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf4ee] text-[#0f7a4d]">
              <Icon className="h-7 w-7" strokeWidth={1.75} />
            </div>

            {/* The product name is the card's main read. `min-h-10` reserves
                room for a second line so prices stay on one baseline across a
                row of cards. */}
            <span className="mt-3 min-h-10 text-sm font-bold leading-snug text-[#0f4435]">
              {product.name}
            </span>

            <span className="mt-1 text-lg font-bold tabular-nums text-[#0f4435]">
              {formatPeso(product.price)}
            </span>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onAdd(product)}
              aria-label={`Add ${product.name}`}
              className={cn(
                "mt-4 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-colors",
                disabled
                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                  : "cursor-pointer bg-[#118a57] text-white hover:bg-[#0f7a4d]"
              )}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add
            </button>
          </div>
        );
      })}
    </div>
  );
}
