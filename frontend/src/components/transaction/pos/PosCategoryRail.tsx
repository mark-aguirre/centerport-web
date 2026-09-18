"use client";

import { FlaskConical, LayoutGrid, Radiation, Stethoscope, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  PRODUCT_CATEGORY_FILTERS,
  type ProductCategoryFilter,
} from "@/components/transaction/types";

/** Icon shown for each category button in the rail. */
const CATEGORY_ICONS: Record<ProductCategoryFilter, LucideIcon> = {
  ALL: LayoutGrid,
  MEDICAL: Stethoscope,
  LABS: FlaskConical,
  "X-RAY": Radiation,
  OTHER: Tag,
};

interface PosCategoryRailProps {
  /** Currently selected category. */
  active: ProductCategoryFilter;
  /** Called when the user picks a category. */
  onChange: (category: ProductCategoryFilter) => void;
  /** Count of products per category (for the "ALL" and per-category buckets). */
  counts: Record<ProductCategoryFilter, number>;
}

/**
 * Vertical category rail for the POS product grid.
 *
 * Mirrors the left-hand icon rail in the counter POS design: a stacked column
 * of category buttons (All, Medical, Labs, X-Ray, Other) that filter the
 * product card grid. Categories with no products are hidden to keep the rail
 * tidy (except "ALL", which is always shown).
 */
export function PosCategoryRail({ active, onChange, counts }: PosCategoryRailProps) {
  const visible = PRODUCT_CATEGORY_FILTERS.filter(
    (c) => c === "ALL" || counts[c] > 0
  );

  return (
    <div
      className="flex flex-row gap-2 overflow-x-auto sm:flex-col sm:overflow-visible"
      role="tablist"
      aria-label="Product categories"
    >
      {visible.map((category) => {
        const Icon = CATEGORY_ICONS[category];
        const isActive = active === category;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={cn(
              "flex min-w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-2 py-3 transition-colors",
              "border",
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-primary/15 bg-card text-foreground/70 hover:border-primary/40 hover:bg-primary/5"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {category}
            </span>
          </button>
        );
      })}
    </div>
  );
}
