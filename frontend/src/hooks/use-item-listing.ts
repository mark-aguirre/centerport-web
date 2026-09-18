"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import { EMPTY_ITEM, type Item } from "@/components/listing/types";

/** Return shape of {@link useItemListing}. */
export interface UseItemListingResult {
  /** Items matching the current search (or the full list when search is empty). */
  items: Item[];
  /** True while the list is being fetched. */
  loading: boolean;
  /** Current search query (controlled). */
  query: string;
  /** Update the search query. */
  setQuery: (value: string) => void;
  /** Clear the search and reload the full list. */
  clearSearch: () => void;
  /** Re-fetch the list. */
  refresh: () => void;

  // --- Edit dialog ---
  /** Whether the add/edit dialog is open. */
  dialogOpen: boolean;
  /** The item currently being edited (or a blank item for "Add"). */
  editingItem: Item;
  /** True when the dialog is editing an existing (persisted) item. */
  isEditing: boolean;
  /** True while a save is in flight. */
  saving: boolean;
  /** Open the dialog to add a new item. */
  openAdd: () => void;
  /** Open the dialog to edit an existing item. */
  openEdit: (item: Item) => void;
  /** Close the dialog without saving. */
  closeDialog: () => void;
  /** Update a field on the item being edited. */
  updateField: <K extends keyof Item>(field: K, value: Item[K]) => void;
  /** Validate and persist the item being edited. */
  save: () => Promise<void>;

  // --- Delete ---
  /** The item pending delete confirmation, if any. */
  pendingDelete: Item | null;
  /** Request deletion of an item (opens the confirm dialog). */
  requestDelete: (item: Item) => void;
  /** Dismiss the delete confirmation. */
  cancelDelete: () => void;
  /** Confirm and perform the pending deletion. */
  confirmDelete: () => Promise<void>;
  /** True while a delete is in flight. */
  deleting: boolean;
}

/**
 * State and actions for the Item Listing page.
 *
 * Manages the searchable item grid plus the add/edit dialog and delete
 * confirmation. Follows the bespoke-hook pattern (see `use-visit.ts`) rather
 * than the patient-centric `useEntityForm`, since items are a standalone master
 * list with no seafarer profile.
 */
export function useItemListing(): UseItemListingResult {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQueryState] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item>(EMPTY_ITEM);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);

  /** Fetch the full item list (most-recently updated first). */
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.entities.Item.list("-updated_date", 200);
      setItems(list);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Defer to a macrotask so the state updates inside refresh() do not run
    // synchronously within the effect body (react-hooks/set-state-in-effect).
    const handle = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(handle);
  }, [refresh]);

  // Client-side filtering: search across name, description, and price. Trimmed
  // and case-insensitive per the Listing.md spec. The list is bounded (<=200),
  // so filtering in the browser keeps the UI responsive without an extra fetch.
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const price = String(item.price ?? "");
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        price.includes(q)
      );
    });
  }, [items, query]);

  const setQuery = useCallback((value: string) => setQueryState(value), []);
  const clearSearch = useCallback(() => setQueryState(""), []);

  const openAdd = useCallback(() => {
    setEditingItem(EMPTY_ITEM);
    setIsEditing(false);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((item: Item) => {
    setEditingItem({ ...EMPTY_ITEM, ...item });
    setIsEditing(true);
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const updateField = useCallback(
    <K extends keyof Item>(field: K, value: Item[K]) => {
      setEditingItem((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const save = useCallback(async () => {
    const name = editingItem.name.trim();
    if (!name) {
      toast.error("Item name is required");
      return;
    }
    if (editingItem.price < 0 || editingItem.professional_fee < 0) {
      toast.error("Price and professional fee cannot be negative");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<Item> = {
        name,
        description: editingItem.description.trim(),
        price: editingItem.price,
        professional_fee: editingItem.professional_fee,
        is_package: editingItem.is_package,
        active: editingItem.active,
      };

      if (isEditing && editingItem.id) {
        await api.entities.Item.update(editingItem.id, payload);
        toast.success("Item updated");
      } else {
        await api.entities.Item.create(payload);
        toast.success("Item created");
      }
      setDialogOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save item");
    } finally {
      setSaving(false);
    }
  }, [editingItem, isEditing, refresh]);

  const requestDelete = useCallback((item: Item) => setPendingDelete(item), []);
  const cancelDelete = useCallback(() => setPendingDelete(null), []);

  const confirmDelete = useCallback(async () => {
    if (!pendingDelete?.id) {
      setPendingDelete(null);
      return;
    }
    setDeleting(true);
    try {
      await api.entities.Item.remove(pendingDelete.id);
      toast.success("Item deleted");
      setPendingDelete(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete item");
    } finally {
      setDeleting(false);
    }
  }, [pendingDelete, refresh]);

  return {
    items: filteredItems,
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
  };
}
