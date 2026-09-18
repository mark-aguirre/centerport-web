"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckCircle2,
  PackagePlus,
  Pencil,
  Receipt,
  Trash2,
  User,
  X,
} from "lucide-react";

import { PageContainer } from "@/components/common/page-container";
import { PageTitle } from "@/components/common/page-title";
import { SectionHeader } from "@/components/common/section-header";
import { FormSelect } from "@/components/common/form-select";
import { FormField } from "@/components/common/form-field";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyStateCard } from "@/components/common/empty-state-card";
import { SearchSelect } from "@/components/transaction/SearchSelect";
import { TransactionItemDialog } from "@/components/transaction/TransactionItemDialog";
import { SettleDialog } from "@/components/transaction/SettleDialog";
import { useTransactionForm } from "@/hooks/use-transaction-form";
import { api } from "@/lib/api";
import { formatPeso, parsePeso } from "@/lib/format";
import {
  BILLING_TYPES,
  itemDisplayDescription,
  type BillingType,
  type Customer,
  type Product,
  type TransactionItem,
} from "@/components/transaction/types";

const headerClass =
  "text-[11px] font-bold text-primary/70 uppercase tracking-wider";

/**
 * New Transaction page — the POS-style transaction workspace.
 *
 * Select a customer, add products as item snapshots, tune per-item details,
 * review totals, and settle. Cancel discards the in-progress draft. The page is
 * a Client Component; it does not read `useSearchParams`, so no Suspense
 * boundary is required.
 */
export default function NewTransactionPage() {
  const router = useRouter();
  const form = useTransactionForm();
  const {
    transaction,
    customer,
    selectCustomer,
    defaultBillingType,
    setDefaultBillingType,
    defaultProfessionalFee,
    setDefaultProfessionalFee,
    addProduct,
    updateItem,
    removeItem,
    totals,
    canSettle,
    settling,
    settle,
  } = form;

  const [editingItem, setEditingItem] = useState<TransactionItem | null>(null);
  const [settleOpen, setSettleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const hasCustomer = !!transaction.customer_id;

  const handleConfirmSettle = async () => {
    const settled = await settle();
    if (settled) {
      setSettleOpen(false);
      router.push("/transactions");
    }
  };

  return (
    <PageContainer className="max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <PageTitle
          title="New Transaction"
          description="Build a point-of-sale transaction, then settle it."
        />
      </div>

      <div className="space-y-3">
        {/* Customer */}
        <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10 space-y-3">
          <SectionHeader title="Customer" icon={User} />
          {!customer ? (
            <SearchSelect<Customer>
              onSearch={(kw) => api.entities.Customer.search(kw)}
              onSelect={selectCustomer}
              renderPrimary={(c) => c.name}
              renderSecondary={(c) =>
                [c.application_no, c.agency].filter(Boolean).join(" · ")
              }
              placeholder="Search customer by name, application no, or agency..."
              ariaLabel="Search customer"
            />
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <DetailField label="Customer" value={customer.name} />
              <DetailField label="Application No" value={customer.application_no ?? "—"} />
              <DetailField label="Agency" value={customer.agency ?? "—"} />
            </div>
          )}
        </div>

        {/* Add product */}
        <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10 space-y-3">
          <SectionHeader title="Add Product / Service" icon={PackagePlus} />
          <SearchSelect<Product>
            onSearch={(kw) => api.entities.Product.search(kw)}
            onSelect={addProduct}
            renderPrimary={(p) => p.name}
            renderSecondary={(p) => `${p.description} · ${formatPeso(p.price)}`}
            placeholder={
              hasCustomer
                ? "Search product or service to add..."
                : "Select a customer first"
            }
            disabled={!hasCustomer}
            clearOnSelect
            ariaLabel="Search product"
          />
        </div>

        {/* Transaction items */}
        <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10 space-y-3">
          <SectionHeader title="Transaction Items" icon={Receipt} />
          {transaction.items.length === 0 ? (
            <EmptyStateCard message="No items yet. Add a product to begin." />
          ) : (
            <div className="rounded-lg border border-primary/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className={`${headerClass} w-10`}>#</TableHead>
                    <TableHead className={headerClass}>Description</TableHead>
                    <TableHead className={`${headerClass} text-right`}>Price</TableHead>
                    <TableHead className={`${headerClass} text-right`}>Prof. Fee</TableHead>
                    <TableHead className={headerClass}>Billing Type</TableHead>
                    <TableHead className={headerClass}>Personal</TableHead>
                    <TableHead className={`${headerClass} text-right`}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaction.items.map((item, idx) => (
                    <TableRow key={item.key}>
                      <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="text-xs text-foreground/90">
                        {itemDisplayDescription(
                          item.description_snapshot,
                          item.personal_account
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/80 text-right tabular-nums">
                        {formatPeso(item.price_snapshot)}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/80 text-right tabular-nums">
                        {formatPeso(item.professional_fee)}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/80">
                        {item.billing_type}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/80">
                        {item.personal_account ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="cursor-pointer"
                            aria-label={`Edit ${item.description_snapshot}`}
                            onClick={() => setEditingItem(item)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="cursor-pointer text-destructive hover:text-destructive"
                            aria-label={`Remove ${item.description_snapshot}`}
                            onClick={() => removeItem(item.key)}
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
          )}
        </div>

        {/* Defaults */}
        <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10 space-y-3">
          <SectionHeader title="Transaction Defaults" icon={Receipt} subtitle="New items inherit these" />
          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Billing Type"
              value={defaultBillingType}
              onChange={(v) => setDefaultBillingType(v as BillingType)}
              options={BILLING_TYPES}
              size="md"
            />
            <FormField
              label="Professional Fee (₱)"
              type="number"
              value={defaultProfessionalFee}
              onChange={(v) => setDefaultProfessionalFee(parsePeso(v))}
              size="md"
            />
          </div>
        </div>

        {/* Totals + actions */}
        <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1 text-xs sm:min-w-[220px]">
              <div className="flex justify-between">
                <span className="text-foreground/70">Items</span>
                <span className="tabular-nums text-foreground/90">
                  {formatPeso(totals.itemsTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Professional Fees</span>
                <span className="tabular-nums text-foreground/90">
                  {formatPeso(totals.feesTotal)}
                </span>
              </div>
              <div className="flex justify-between border-t border-primary/10 pt-1 font-semibold">
                <span className="text-primary">TOTAL</span>
                <span className="tabular-nums text-primary">
                  {formatPeso(totals.total)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => setCancelOpen(true)}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                className="cursor-pointer"
                disabled={!canSettle}
                onClick={() => setSettleOpen(true)}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Settle
              </Button>
            </div>
          </div>
        </div>
      </div>

      <TransactionItemDialog
        open={!!editingItem}
        onOpenChange={(open) => {
          if (!open) setEditingItem(null);
        }}
        item={editingItem}
        onSave={updateItem}
        onRemove={removeItem}
      />

      <SettleDialog
        open={settleOpen}
        onOpenChange={setSettleOpen}
        customerName={transaction.customer_name ?? ""}
        items={transaction.items}
        settling={settling}
        onConfirm={handleConfirmSettle}
      />

      <ConfirmDialog
        open={cancelOpen}
        title="Cancel transaction?"
        message="All currently selected items will be removed."
        confirmLabel="Cancel Transaction"
        cancelLabel="Continue Editing"
        confirmVariant="destructive"
        icon={null}
        onConfirm={() => {
          setCancelOpen(false);
          router.push("/transactions");
        }}
        onCancel={() => setCancelOpen(false)}
      />
    </PageContainer>
  );
}

/** Read-only labeled detail used in the customer summary. */
function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xs text-foreground/90">{value}</p>
    </div>
  );
}
