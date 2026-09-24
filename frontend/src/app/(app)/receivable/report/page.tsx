"use client";

import { PageContainer } from "@/components/common/page-container";
import { PageTitle } from "@/components/common/page-title";
import { ReceivableReportView } from "@/components/receivable/ReceivableReportView";

/**
 * Receivable Report page — generate and review amounts owed.
 *
 * Filters by account, payment type, package classification, and date range,
 * then renders a currency-formatted results table with a total row. The
 * filters, actions, and results live in {@link ReceivableReportView}, which is
 * shared with the POS workspace's embedded view. This page adds the title and
 * hoists the Reset / Generate actions into the header.
 */
export default function ReceivableReportPage() {
  return (
    <PageContainer className="max-w-7xl">
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
    </PageContainer>
  );
}
