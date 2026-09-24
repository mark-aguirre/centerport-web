"use client";

import { PageContainer } from "@/components/common/page-container";
import { PageTitle } from "@/components/common/page-title";
import { ItemListingView } from "@/components/listing/ItemListingView";

/**
 * Item Listing page — manage billable services, examinations, and packages.
 *
 * Search, add, edit, and delete items with currency-formatted prices. The
 * search, list, and dialogs live in {@link ItemListingView}, which is shared
 * with the POS workspace's embedded view. This page adds the title and hoists
 * the Refresh / Add Item actions into the header.
 */
export default function ItemListingPage() {
  return (
    <PageContainer className="max-w-7xl">
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
    </PageContainer>
  );
}
