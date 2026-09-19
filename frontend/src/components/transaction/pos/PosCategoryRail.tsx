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
 * Full-height vertical category rail for the POS workspace.
 *
 * A dark navy column pinned to the left edge (below the POS header), holding a
 * stacked set of category buttons (All, Medical, Labs, X-Ray, Other) that
 * filter the product card grid. Categories with no products are hidden to keep
 * the rail tidy (except "ALL", which is always shown).
 */
export function PosCategoryRail({ active, onChange, counts }: PosCategoryRailProps) {
  const visible = PRODUCT_CATEGORY_FILTERS.filter(
    (c) => c === "ALL" || counts[c] > 0
  );

  return (
    <div
      className="flex h-full w-20 shrink-0 flex-col items-center gap-2 overflow-y-auto bg-[#0d2b45] p-2"
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
              "flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-1 py-3 transition-colors",
              isActive
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-white/60 hover:bg-white/10 hover:text-white"
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
