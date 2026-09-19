"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/transaction/SearchSelect";
import { SettleDialog } from "@/components/transaction/SettleDialog";
import { PosHeader } from "@/components/transaction/pos/PosHeader";
import { PosCategoryRail } from "@/components/transaction/pos/PosCategoryRail";
import { PosProductGrid } from "@/components/transaction/pos/PosProductGrid";
import { PosCartPanel } from "@/components/transaction/pos/PosCartPanel";
import { useTransactionForm } from "@/hooks/use-transaction-form";
import { api } from "@/lib/api";
import {
  classifyProduct,
  PRODUCT_CATEGORY_FILTERS,
  type Customer,
  type ProductCategoryFilter,
} from "@/components/transaction/types";

/**
 * New Transaction — counter POS workspace.
 *
 * A point-of-sale layout: a searchable, category-filtered product card grid on
 * the left and a persistent cart/order panel on the right. Pick a client, tap
 * products to add them as line items, tune the billing type and professional
 * fee, then settle. The page is a Client Component and does not read
 * `useSearchParams`, so no Suspense boundary is required.
 */
export default function NewTransactionPage() {
  const router = useRouter();
  const form = useTransactionForm();
  const {
    transaction,
    customer,
    catalog,
    catalogLoading,
    selectCustomer,
    setAgency,
    addProduct,
    updateItem,
    removeItem,
    totals,
    canSettle,
    settling,
    settle,
    reset,
  } = form;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategoryFilter>("ALL");
  const [settleOpen, setSettleOpen] = useState(false);
  const [voidOpen, setVoidOpen] = useState(false);

  const hasCustomer = !!transaction.customer_id;

  // Per-category product counts drive which rail buttons are shown.
  const counts = useMemo(() => {
    const base = Object.fromEntries(
      PRODUCT_CATEGORY_FILTERS.map((c) => [c, 0])
    ) as Record<ProductCategoryFilter, number>;
    base.ALL = catalog.length;
    for (const product of catalog) {
      base[classifyProduct(product)] += 1;
    }
    return base;
  }, [catalog]);

  // Products filtered by the active category and the search box.
  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return catalog.filter((product) => {
      const inCategory = category === "ALL" || classifyProduct(product) === category;
      if (!inCategory) return false;
      if (!keyword) return true;
      return (
        product.name.toLowerCase().includes(keyword) ||
        (product.description ?? "").toLowerCase().includes(keyword) ||
        (product.product_id ?? "").toLowerCase().includes(keyword)
      );
    });
  }, [catalog, category, search]);

  const handleConfirmSettle = async () => {
    const settled = await settle();
    if (settled) {
      setSettleOpen(false);
      router.push("/transactions");
    }
  };

  const handleVoid = () => {
    if (transaction.items.length === 0 && !hasCustomer) {
      router.push("/transactions");
      return;
    }
    setVoidOpen(true);
  };

  return (
    <div className="flex h-full flex-col">
      <PosHeader />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Full-height category rail, flush to the left edge */}
        <PosCategoryRail active={category} onChange={setCategory} counts={counts} />

        {/* Content: product workspace (left) + cart panel (right).
            The cart panel is full-height and flush to the right edge, so the
            padding lives on the product column rather than the outer grid. */}
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_360px]">
          {/* Left: search + product grid.
              The big top field is contextual: it searches clients until one is
              chosen, then switches to searching services / codes. */}
          <div className="flex min-h-0 flex-col gap-4 p-4">
            {!hasCustomer ? (
              <SearchSelect<Customer>
                onSearch={(kw) => api.entities.Customer.search(kw)}
                onSelect={selectCustomer}
                renderPrimary={(c) => c.name}
                renderSecondary={(c) =>
                  [c.application_no, c.agency].filter(Boolean).join(" · ")
                }
                placeholder="Search client by name, application no, or agency..."
                ariaLabel="Search client"
                inputClassName="h-11 pl-10 text-sm"
                autoFocus
              />
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search services or codes..."
                  aria-label="Search products"
                  className="h-11 w-full pl-10 text-sm"
                />
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto">
              {!hasCustomer ? (
                <ClientPromptHint />
              ) : (
                <PosProductGrid
                  products={filteredProducts}
                  loading={catalogLoading}
                  disabled={!hasCustomer}
                  onAdd={addProduct}
                />
              )}
            </div>
          </div>

          {/* Right: cart / order summary */}
          <PosCartPanel
            customer={customer}
            items={transaction.items}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onEditCustomer={reset}
            agency={transaction.billed_agency ?? customer?.agency ?? null}
            onChangeAgency={setAgency}
            totals={totals}
            canSettle={canSettle}
            settling={settling}
            onVoid={handleVoid}
            onSettle={() => setSettleOpen(true)}
          />
        </div>
      </div>

      <SettleDialog
        open={settleOpen}
        onOpenChange={setSettleOpen}
        customerName={transaction.customer_name ?? ""}
        items={transaction.items}
        settling={settling}
        onConfirm={handleConfirmSettle}
      />

      <ConfirmDialog
        open={voidOpen}
        title="Void transaction?"
        message="All selected items and the current client will be cleared."
        confirmLabel="Void Transaction"
        cancelLabel="Keep Editing"
        confirmVariant="destructive"
        icon={null}
        onConfirm={() => {
          setVoidOpen(false);
          router.push("/transactions");
        }}
        onCancel={() => setVoidOpen(false)}
      />
    </div>
  );
}

/**
 * Full-height hint shown in the product area until a client is chosen.
 *
 * Selecting a client is the prerequisite for adding products. The client search
 * lives in the contextual field at the top of the workspace, so this panel just
 * points the user there rather than duplicating the search control.
 */
function ClientPromptHint() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-primary/20 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UserPlus className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">Select a client to begin</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Use the search field above to find a client by name, application
          number, or agency.
        </p>
      </div>
    </div>
  );
}
