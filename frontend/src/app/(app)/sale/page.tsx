"use client";

import { useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/transaction/SearchSelect";
import { SettleDialog } from "@/components/transaction/SettleDialog";
import { AddOutPatientDialog } from "@/components/transaction/AddOutPatientDialog";
import { PosHeader } from "@/components/transaction/pos/PosHeader";
import { PosCategoryRail } from "@/components/transaction/pos/PosCategoryRail";
import { PosProductGrid } from "@/components/transaction/pos/PosProductGrid";
import { PosCartPanel } from "@/components/transaction/pos/PosCartPanel";
import { TransactionHistoryView } from "@/components/transaction/TransactionHistoryView";
import { ReceivableReportView } from "@/components/receivable/ReceivableReportView";
import { ItemListingView } from "@/components/listing/ItemListingView";
import { PageTitle } from "@/components/common/page-title";
import type { PosView } from "@/components/transaction/pos/PosCategoryRail";
import { useTransactionForm } from "@/hooks/use-transaction-form";
import { useAddOutPatient } from "@/hooks/use-add-out-patient";
import { api } from "@/lib/api";
import { type Customer } from "@/components/transaction/types";
import { Button } from "@/components/ui/button";

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
  const [settleOpen, setSettleOpen] = useState(false);
  const [voidOpen, setVoidOpen] = useState(false);
  // Active content view: the POS product workspace, or one of the embedded
  // views (transaction history, receivable report, item listing).
  const [view, setView] = useState<PosView>("pos");

  const hasCustomer = !!transaction.customer_id;

  // Walk-in / out-patient registration. On success the created client is
  // selected into the sale, which advances the workspace to product entry.
  const outPatient = useAddOutPatient({ onCreated: selectCustomer });

  // Products filtered by the search box (matched on name, description, or code)
  // and sorted alphabetically by name for a predictable card order.
  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const matched = keyword
      ? catalog.filter(
          (product) =>
            product.name.toLowerCase().includes(keyword) ||
            (product.description ?? "").toLowerCase().includes(keyword) ||
            (product.product_id ?? "").toLowerCase().includes(keyword)
        )
      : catalog;
    // Copy before sorting so the source catalog array is never mutated.
    return [...matched].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
  }, [catalog, search]);

  const handleConfirmSettle = async () => {
    const settled = await settle();
    if (settled) {
      setSettleOpen(false);
      // Clear the workspace and surface the settled sale in the embedded
      // transaction history view (there is no standalone /transactions page).
      reset();
      setView("transactions");
    }
  };

  const handleVoid = () => {
    // Nothing to clear — the workspace is already an empty draft.
    if (transaction.items.length === 0 && !hasCustomer) {
      return;
    }
    setVoidOpen(true);
  };

  return (
    <div className="flex h-full flex-col">
      <PosHeader />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Full-height category rail, flush to the left edge. It stays expanded
            with labels across the Transactions, Receivable, and Item Listing
            views, and on New Sale until a client is chosen — then it collapses
            to icons to free space for product entry and the cart. */}
        <PosCategoryRail
          view={view}
          onSelectView={setView}
          collapsed={view === "pos" && hasCustomer}
        />

        {view !== "pos" ? (
          /* Embedded views (history, receivable, item listing), opened from the
             rail. Each gets a titled header and scrolls independently. */
          <div className="min-h-0 flex-1 overflow-y-auto bg-muted/20 p-4">
            <div className="mx-auto max-w-7xl">
              {view === "transactions" && (
                <>
                  <PageTitle
                    title="Transactions"
                    description="Point-of-sale transactions — history and status."
                  />
                  <TransactionHistoryView />
                </>
              )}
              {view === "receivable" && (
                <ReceivableReportView
                  renderActions={(actions) => (
                    <div className="flex items-start justify-between gap-4">
                      <PageTitle
                        title="Receivable Report"
                        description="Amounts owed by account, payment type, and date range."
                      />
                      <div className="pt-1">{actions}</div>
                    </div>
                  )}
                />
              )}
              {view === "listing" && (
                <ItemListingView
                  renderActions={(actions) => (
                    <div className="flex items-start justify-between gap-4">
                      <PageTitle
                        title="Item Listing"
                        description="Manage available services, examinations, packages, and their prices."
                      />
                      <div className="pt-1">{actions}</div>
                    </div>
                  )}
                />
              )}
            </div>
          </div>
        ) : (
        /* Content: product workspace (left) + cart panel (right).
            The cart panel is full-height and flush to the right edge, so the
            padding lives on the product column rather than the outer grid. */
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_360px]">
          {/* Left: search + product grid.
              The big top field is contextual: it searches clients until one is
              chosen, then switches to searching services / codes. */}
          <div className="flex min-h-0 flex-col gap-4 p-4">
            {!hasCustomer ? (
              <div className="flex items-center gap-2">
                <div className="flex-1">
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
                </div>
                <Button
                  type="button"
                  className="h-11 shrink-0 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => outPatient.openDialog()}
                >
                  <UserPlus className="mr-1 h-4 w-4" />
                  Add Out-Patient
                </Button>
              </div>
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
        )}
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
          reset();
        }}
        onCancel={() => setVoidOpen(false)}
      />

      <AddOutPatientDialog
        open={outPatient.open}
        onOpenChange={outPatient.setOpen}
        draft={outPatient.draft}
        saving={outPatient.saving}
        onUpdate={outPatient.updateField}
        onSave={outPatient.save}
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
          number, or agency — or add a new out-patient if they aren&apos;t
          registered yet.
        </p>
      </div>
    </div>
  );
}
