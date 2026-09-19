"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Ban, Loader2, Plus } from "lucide-react";

import { PageContainer } from "@/components/common/page-container";
import { PageTitle } from "@/components/common/page-title";
import { SearchBar } from "@/components/common/search-bar";
import { FormSelect } from "@/components/common/form-select";
import { FormField } from "@/components/common/form-field";
import { EmptyStateCard } from "@/components/common/empty-state-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VoidDialog } from "@/components/transaction/VoidDialog";
import { useTransactionHistory } from "@/hooks/use-transaction-history";
import { formatPeso } from "@/lib/format";
import {
  TRANSACTION_STATUS_FILTERS,
  type TransactionStatus,
} from "@/components/transaction/types";

const headerClass =
  "text-[11px] font-bold text-primary/70 uppercase tracking-wider";

/** Renders a status badge using semantic tokens (no hardcoded colors). */
function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles: Record<TransactionStatus, string> = {
    DRAFT: "bg-muted text-muted-foreground",
    SETTLED: "bg-primary/10 text-primary",
    VOIDED: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/**
 * Transaction History page — list and search settled/voided transactions.
 *
 * Provides search, status, and date-range filters, and a Void action on settled
 * transactions. A Client Component that manages its own filter and list state;
 * it does not read `useSearchParams`, so no Suspense boundary is required.
 */
export default function TransactionHistoryPage() {
  const {
    transactions,
    loading,
    filters,
    setFilter,
    pendingVoid,
    voidReason,
    setVoidReason,
    requestVoid,
    cancelVoid,
    confirmVoid,
    voiding,
  } = useTransactionHistory();

  return (
    <PageContainer className="max-w-7xl">
      <div className="flex items-start justify-between gap-4">
        <PageTitle
          title="Transaction"
          description="Point-of-sale transactions — history and status."
        />
        <div className="pt-1">
          <Button
            size="sm"
            className="cursor-pointer"
            nativeButton={false}
            render={<Link href="/transactions/new" />}
          >
            <Plus className="w-4 h-4 mr-1" />
            New Transaction
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10 space-y-3">
        {/* Filters */}
        <div className="grid grid-cols-1 items-end gap-2 sm:grid-cols-4">
          <div className="space-y-0.5 sm:col-span-2 [&_.mb-4]:mb-0">
            <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
              Search
            </Label>
            <SearchBar
              value={filters.search}
              onChange={(v) => setFilter("search", v)}
              placeholder="Search transaction # or customer..."
            />
          </div>
          <FormSelect
            label="Status"
            value={filters.status}
            onChange={(v) => setFilter("status", v)}
            options={[...TRANSACTION_STATUS_FILTERS]}
            size="md"
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              label="From"
              type="date"
              value={filters.from}
              onChange={(v) => setFilter("from", v)}
              size="md"
            />
            <FormField
              label="To"
              type="date"
              value={filters.to}
              onChange={(v) => setFilter("to", v)}
              size="md"
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <EmptyStateCard message="No transactions found. Adjust your filters or create a new transaction." />
        ) : (
          <div className="rounded-lg border border-primary/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className={headerClass}>Transaction #</TableHead>
                  <TableHead className={headerClass}>Customer</TableHead>
                  <TableHead className={headerClass}>Date</TableHead>
                  <TableHead className={`${headerClass} text-right`}>Total</TableHead>
                  <TableHead className={headerClass}>Billing Type</TableHead>
                  <TableHead className={headerClass}>Status</TableHead>
                  <TableHead className={`${headerClass} text-right`}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, idx) => (
                  <TableRow key={tx.id} className={idx % 2 === 1 ? "bg-muted/30" : undefined}>
                    <TableCell className="text-xs font-medium text-primary">
                      {tx.transaction_id || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-foreground/90">
                      {tx.customer_name || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-foreground/80">
                      {formatDate(tx.settled_at ?? tx.created_date)}
                    </TableCell>
                    <TableCell className="text-xs text-foreground/80 text-right tabular-nums">
                      {formatPeso(tx.total_amount)}
                    </TableCell>
                    <TableCell className="text-xs text-foreground/80">
                      {tx.billing_type}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tx.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.status === "SETTLED" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer text-destructive hover:text-destructive"
                          onClick={() => requestVoid(tx)}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          Void
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!loading && (
          <p className="text-[11px] text-muted-foreground">
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <VoidDialog
        open={!!pendingVoid}
        onOpenChange={(open) => {
          if (!open) cancelVoid();
        }}
        transaction={pendingVoid}
        reason={voidReason}
        onReasonChange={setVoidReason}
        voiding={voiding}
        onConfirm={confirmVoid}
      />
    </PageContainer>
  );
}

/** Formats an ISO date string as `MMM d, yyyy`, tolerating null/invalid input. */
function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : format(date, "MMM d, yyyy");
}
