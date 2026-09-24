"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { PageContainer } from "@/components/common/page-container";
import { PageTitle } from "@/components/common/page-title";
import { Button } from "@/components/ui/button";
import { TransactionHistoryView } from "@/components/transaction/TransactionHistoryView";

/**
 * Transaction History page — list and search settled/voided transactions.
 *
 * Provides search, status, and date-range filters, and a Void action on settled
 * transactions. The filters, table, and void dialog live in
 * {@link TransactionHistoryView}, which is shared with the POS workspace's
 * embedded "Transactions" view. This page adds the title and "New Transaction"
 * action around it. A Client Component that does not read `useSearchParams`, so
 * no Suspense boundary is required.
 */
export default function TransactionHistoryPage() {
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
            render={<Link href="/sale" />}
          >
            <Plus className="w-4 h-4 mr-1" />
            New Transaction
          </Button>
        </div>
      </div>

      <TransactionHistoryView />
    </PageContainer>
  );
}
