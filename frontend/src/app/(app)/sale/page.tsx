"use client";

import { useCallback, useMemo, useRef, useState } from "react";
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
import { PosWelcomeHero } from "@/components/transaction/pos/PosWelcomeHero";
import { PosQuickActions } from "@/components/transaction/pos/PosQuickActions";
import { PosClientPrompt } from "@/components/transaction/pos/PosClientPrompt";
import { PosPageBanner } from "@/components/transaction/pos/PosPageBanner";
import { TransactionHistoryView } from "@/components/transaction/TransactionHistoryView";
import { ReceivableReportView } from "@/components/receivable/ReceivableReportView";
import { ItemListingView } from "@/components/listing/ItemListingView";
import type { PosView } from "@/components/transaction/pos/PosCategoryRail";
import { useTransactionForm } from "@/hooks/use-transaction-form";
import { useAddOutPatient } from "@/hooks/use-add-out-patient";
import { api } from "@/lib/api";
import { type Customer } from "@/components/transaction/types";
import { Button } from "@/components/ui/button";

/**
 * New Transaction — counter POS workspace.
 *
 * A point-of-sale layout built as two stages around the client selection:
 *
 * - Before a client is chosen, the workspace is a welcome screen: a photographic
 *   hero carrying the client search and the Add Out-Patient action, a row of
 *   quick-action tiles for the other POS destinations, and an empty-state panel
 *   pointing back at the search.
 * - Once a client is chosen it becomes the working counter: a searchable product
 *   card grid on the left and the persistent cart / order panel on the right.
 *
 * The whole page sits in its own clinical-green visual zone (`pos-theme.ts`)
 * with its own header and rail, separate from the shared app chrome. It is a
 * Client Component and does not read `useSearchParams`, so no Suspense boundary
 * is required.
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

  // Wraps the client search so the "New Sale" tile can put the cursor in it.
  // SearchSelect owns its own input, so the field is reached by query rather
  // than by a forwarded ref.
  const clientSearchRef = useRef<HTMLDivElement | null>(null);

  // Walk-in / out-patient registration. On success the created client is
  // selected into the sale, which advances the workspace to product entry.
  const outPatient = useAddOutPatient({ onCreated: selectCustomer });

  /** Return to the sale stage and focus the client search. */
  const handleNewSale = useCallback(() => {
    setView("pos");
    // Deferred so the search field is mounted when the view was not "pos".
    requestAnimationFrame(() => {
      clientSearchRef.current
        ?.querySelector<HTMLInputElement>('input[data-slot="input"]')
        ?.focus();
    });
  }, []);

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
    <div className="flex h-full flex-col bg-[#f1f6f3]">
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
             rail. Each opens with a `PosPageBanner` that bleeds to the edges of
             this container, runs full width for its seven-column table, and
             scrolls independently. The two views that carry page-level actions
             hand them to their banner through `renderActions`. */
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {view === "transactions" && (
              <div className="space-y-4">
                <PosPageBanner
                  title="Transactions"
                  description="Point-of-sale transactions — history and status."
                />
                <TransactionHistoryView />
              </div>
            )}
            {view === "receivable" && (
              <ReceivableReportView
                renderActions={(actions) => (
                  <PosPageBanner
                    title="Receivable Report"
                    description="Amounts owed by account, payment type, and date range."
                    actions={actions}
                  />
                )}
              />
            )}
            {view === "listing" && (
              <ItemListingView
                renderActions={(actions) => (
                  <PosPageBanner
                    title="Item Listing"
                    description="Manage available services, examinations, packages, and their prices."
                    actions={actions}
                  />
                )}
              />
            )}
          </div>
        ) : (
        /* Content: product workspace (left) + cart panel (right).
            The cart panel is full-height and flush to the right edge, so the
            padding lives on the product column rather than the outer grid.
            It takes 40% of the width rather than a fixed pixel column, so the
            order summary scales with the counter's screen; the product grid
            absorbs the rest. */
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_40%]">
          {!hasCustomer ? (
            /* Stage one — welcome screen. The whole column scrolls as one, so
               the hero and the tiles stay with the empty-state panel on short
               viewports instead of each scrolling on its own. */
            <div className="flex min-h-0 flex-col gap-3 overflow-y-auto p-4">
              <PosWelcomeHero>
                <div ref={clientSearchRef} className="flex items-center gap-2">
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
                      inputClassName="h-14 rounded-lg border-[#0f4435]/15 bg-white pl-10 text-sm shadow-sm"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="button"
                    className="h-14 shrink-0 cursor-pointer bg-gradient-to-r from-[#118a57] to-[#0d7349] px-5 text-white shadow-sm hover:from-[#0f7a4d] hover:to-[#0b6440]"
                    onClick={() => outPatient.openDialog()}
                  >
                    <UserPlus className="mr-1.5 h-4 w-4" />
                    Add Out-Patient
                  </Button>
                </div>
              </PosWelcomeHero>

              <PosQuickActions
                onNewSale={handleNewSale}
                onOutPatient={() => outPatient.openDialog()}
                onTransactions={() => setView("transactions")}
                onItems={() => setView("listing")}
              />

              <div className="flex min-h-72 flex-1 flex-col">
                <PosClientPrompt />
              </div>
            </div>
          ) : (
            /* Stage two — product entry. The search field switches from clients
               to services, and the grid scrolls under it. */
            <div className="flex min-h-0 flex-col gap-4 p-4">
              <div className="relative shrink-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search services or codes..."
                  aria-label="Search products"
                  className="h-11 w-full border-[#0f4435]/15 bg-white pl-10 text-sm shadow-sm"
                />
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                <PosProductGrid
                  products={filteredProducts}
                  loading={catalogLoading}
                  onAdd={addProduct}
                />
              </div>
            </div>
          )}

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
