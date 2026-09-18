"use client";

import { useMemo } from "react";
import { FileText, Filter, Loader2, RotateCcw } from "lucide-react";

import { PageContainer } from "@/components/common/page-container";
import { PageTitle } from "@/components/common/page-title";
import { SectionHeader } from "@/components/common/section-header";
import { FormSelect } from "@/components/common/form-select";
import { FormField } from "@/components/common/form-field";
import { EmptyStateCard } from "@/components/common/empty-state-card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReceivableReport,
  accountName,
} from "@/hooks/use-receivable-report";
import { formatPeso } from "@/lib/format";
import {
  PACKAGE_FILTERS,
  type PackageFilter,
} from "@/components/receivable/types";

const headerClass =
  "text-[11px] font-bold text-primary/70 uppercase tracking-wider";

/**
 * Receivable Report page — generate and review amounts owed.
 *
 * Filters by account, payment type, package classification, and date range,
 * then renders a currency-formatted results table with a total row. A Client
 * Component managing filter + report state; it does not read `useSearchParams`,
 * so no Suspense boundary is required.
 */
export default function ReceivableReportPage() {
  const {
    filters,
    setFilter,
    reset,
    accounts,
    paymentTypes,
    lookupsLoading,
    report,
    generating,
    generate,
  } = useReceivableReport();

  // Account selector uses names as the option list; map back to id on change.
  const accountNames = useMemo(() => accounts.map((a) => a.name), [accounts]);
  const paymentTypeOptions = useMemo(
    () => ["All", ...paymentTypes.map((p) => p.label)],
    [paymentTypes]
  );

  const selectedAccountName = accountName(accounts, filters.account_id);

  const handleAccountChange = (name: string) => {
    const match = accounts.find((a) => a.name === name);
    setFilter("account_id", match?.id ?? "");
  };

  return (
    <PageContainer className="max-w-7xl">
      <div className="flex items-start justify-between gap-4">
        <PageTitle
          title="Receivable Report"
          description="Amounts owed by account, payment type, and date range."
        />
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={reset}
            disabled={generating}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={generate}
            disabled={generating || lookupsLoading}
          >
            {generating ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-1" />
            )}
            Generate
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10 space-y-3">
        <SectionHeader title="Filters" icon={Filter} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FormSelect
            label="Account"
            value={selectedAccountName}
            onChange={handleAccountChange}
            options={accountNames}
            required
            size="md"
          />
          <FormSelect
            label="Payment Type"
            value={filters.payment_type || "All"}
            onChange={(v) => setFilter("payment_type", v === "All" ? "" : v)}
            options={paymentTypeOptions}
            size="md"
          />

          {/* Package classification radio group */}
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
              Package
            </span>
            <div
              className="flex items-center gap-4 h-8"
              role="radiogroup"
              aria-label="Package classification"
            >
              {PACKAGE_FILTERS.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="package_filter"
                    checked={filters.package_filter === option}
                    onChange={() => setFilter("package_filter", option as PackageFilter)}
                    className="w-4 h-4 accent-primary"
                    aria-label={`Package - ${option}`}
                  />
                  <span className="text-xs text-foreground/80">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <FormField
            label="From Date"
            type="date"
            value={filters.from_date}
            onChange={(v) => setFilter("from_date", v)}
            size="md"
          />
          <FormField
            label="To Date"
            type="date"
            value={filters.to_date}
            onChange={(v) => setFilter("to_date", v)}
            size="md"
          />
        </div>
      </div>

      {/* Results */}
      <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10 space-y-3">
        <SectionHeader title="Results" icon={FileText} />

        {generating ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !report ? (
          <EmptyStateCard message="Set your filters and click Generate to view receivables." />
        ) : report.rows.length === 0 ? (
          <EmptyStateCard message="No receivables match these filters. Adjust and Generate again." />
        ) : (
          <>
            <div className="rounded-lg border border-primary/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className={headerClass}>Transaction #</TableHead>
                    <TableHead className={headerClass}>Customer</TableHead>
                    <TableHead className={headerClass}>Account</TableHead>
                    <TableHead className={headerClass}>Description</TableHead>
                    <TableHead className={headerClass}>Payment Type</TableHead>
                    <TableHead className={headerClass}>Date</TableHead>
                    <TableHead className={`${headerClass} text-right`}>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.rows.map((row, idx) => (
                    <TableRow key={row.id} className={idx % 2 === 1 ? "bg-muted/30" : undefined}>
                      <TableCell className="text-xs font-medium text-primary">
                        {row.transaction_id || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/90">
                        {row.customer_name || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/80">
                        {row.account_name || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/80 max-w-[240px] truncate">
                        {row.description || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/80">
                        {row.payment_type || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/80">
                        {row.date || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/80 text-right tabular-nums">
                        {formatPeso(row.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={6} className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Total ({report.total_count} record{report.total_count !== 1 ? "s" : ""})
                    </TableCell>
                    <TableCell className="text-xs font-bold text-primary text-right tabular-nums">
                      {formatPeso(report.total_amount)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
