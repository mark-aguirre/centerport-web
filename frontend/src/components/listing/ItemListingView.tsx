"use client";

import { Loader2, Plus, RefreshCw, Search } from "lucide-react";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PosFilterGroup,
  POS_SEARCH_CONTROL,
  POS_SEARCH_ICON,
} from "@/components/transaction/pos/PosFilterGroup";
import { ItemList } from "@/components/listing/ItemList";
import { ItemEditDialog } from "@/components/listing/ItemEditDialog";
import { useItemListing } from "@/hooks/use-item-listing";

interface ItemListingViewProps {
  /**
   * Renders the Refresh / Add Item action buttons. Receives the wired button
   * elements so the caller can place them (e.g. in a page banner or inline).
   * When omitted, the actions render inline above the list.
   */
  renderActions?: (actions: React.ReactNode) => React.ReactNode;
}

/**
 * Item listing view — search, list, and the add/edit and delete dialogs.
 *
 * Owns its search and grid state through {@link useItemListing}, so it can be
 * dropped into any container; it renders only content (no page title or outer
 * page container). Currently that container is the POS workspace's embedded
 * view, so the styling follows the POS zone's clinical greens and the same
 * two-band shape as the transactions and receivable views: a filter bar over a
 * results table. The Refresh / Add Item actions can be relocated via
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
        className="h-11 cursor-pointer border-[#0f4435]/15 bg-white px-4 text-sm font-semibold text-[#0f4435] hover:bg-[#eef8f2]"
        onClick={refresh}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-1.5 h-4 w-4" />
        )}
        Refresh
      </Button>
      <Button
        className="h-11 cursor-pointer bg-gradient-to-r from-[#118a57] to-[#0d7349] px-5 text-sm font-semibold text-white shadow-sm hover:from-[#0f7a4d] hover:to-[#0b6440]"
        onClick={openAdd}
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add Item
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderActions ? (
        renderActions(actions)
      ) : (
        <div className="flex justify-end">{actions}</div>
      )}

      {/* Filters. Only one filter here, so Clear sits beside the field rather
          than in a column of its own. */}
      <div className="rounded-xl border border-[#0f4435]/10 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <PosFilterGroup label="Search">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search aria-hidden="true" className={POS_SEARCH_ICON} />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, description, or price..."
                  aria-label="Search items"
                  className={POS_SEARCH_CONTROL}
                />
              </div>
              <Button
                variant="outline"
                className="h-11 shrink-0 cursor-pointer border-[#0f4435]/15 bg-white px-4 text-sm font-semibold text-[#0f4435] hover:bg-[#eef8f2]"
                onClick={clearSearch}
                disabled={!query}
              >
                Clear
              </Button>
            </div>
          </PosFilterGroup>
        </div>
      </div>

      <ItemList
        items={items}
        loading={loading}
        onEdit={openEdit}
        onDelete={requestDelete}
      />

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
