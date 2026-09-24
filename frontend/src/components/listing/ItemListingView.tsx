"use client";

import { Loader2, Package, Plus, RefreshCw } from "lucide-react";

import { SearchBar } from "@/components/common/search-bar";
import { SectionHeader } from "@/components/common/section-header";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { ItemList } from "@/components/listing/ItemList";
import { ItemEditDialog } from "@/components/listing/ItemEditDialog";
import { useItemListing } from "@/hooks/use-item-listing";

interface ItemListingViewProps {
  /**
   * Renders the Refresh / Add Item action buttons. Receives the wired button
   * elements so the caller can place them (e.g. in a page header or inline).
   * When omitted, the actions render inline above the list.
   */
  renderActions?: (actions: React.ReactNode) => React.ReactNode;
}

/**
 * Item listing view — search, list, and the add/edit and delete dialogs.
 *
 * Owns its search and grid state through {@link useItemListing}, so it can be
 * dropped into any container: the standalone Item Listing page or the POS
 * workspace's embedded view. Renders only content (no page title or outer page
 * container). The Refresh / Add Item actions can be relocated via
 * {@link ItemListingViewProps.renderActions}.
 */
export function ItemListingView({ renderActions }: ItemListingViewProps) {
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

  const actions = (
    <div className="flex items-center gap-2">
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
  );

  return (
    <div className="space-y-4">
      {renderActions ? renderActions(actions) : <div className="flex justify-end">{actions}</div>}

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
    </div>
  );
}
