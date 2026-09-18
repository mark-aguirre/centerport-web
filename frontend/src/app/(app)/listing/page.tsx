"use client";

import { Loader2, Package, Plus, RefreshCw } from "lucide-react";

import { PageContainer } from "@/components/common/page-container";
import { PageTitle } from "@/components/common/page-title";
import { SearchBar } from "@/components/common/search-bar";
import { SectionHeader } from "@/components/common/section-header";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { ItemList } from "@/components/listing/ItemList";
import { ItemEditDialog } from "@/components/listing/ItemEditDialog";
import { useItemListing } from "@/hooks/use-item-listing";

/**
 * Item Listing page — manage billable services, examinations, and packages.
 *
 * Search, add, edit, and delete items with currency-formatted prices. The page
 * is a Client Component that manages its own search and grid state via
 * {@link useItemListing}. It does not read `useSearchParams`, so no Suspense
 * boundary is required.
 */
export default function ItemListingPage() {
  const {
    items,
    loading,
    query,
    setQuery,
    clearSearch,
    refresh,
    dialogOpen,
    editingItem,
    isEditing,
    saving,
    openAdd,
    openEdit,
    closeDialog,
    updateField,
    save,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
    deleting,
  } = useItemListing();

  return (
    <PageContainer className="max-w-7xl">
      <div className="flex items-start justify-between gap-4">
        <PageTitle
          title="Item Listing"
          description="Manage available services, examinations, packages, and their prices."
        />
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-1" />
            )}
            Refresh
          </Button>
          <Button size="sm" className="cursor-pointer" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10 space-y-3">
        <SectionHeader title="Items" icon={Package} />

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search by name, description, or price..."
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mb-4 cursor-pointer"
            onClick={clearSearch}
            disabled={!query}
          >
            Clear
          </Button>
        </div>

        <ItemList
          items={items}
          loading={loading}
          onEdit={openEdit}
          onDelete={requestDelete}
        />

        {!loading && (
          <p className="text-[11px] text-muted-foreground">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <ItemEditDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        item={editingItem}
        isEditing={isEditing}
        saving={saving}
        onUpdate={updateField}
        onSave={save}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete item?"
        message={
          pendingDelete
            ? `"${pendingDelete.name}" will be permanently removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        icon={null}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </PageContainer>
  );
}
