"use client";

import { useState, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2, Pencil, Plus, Printer, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Subscribes a component to the mounted DOM node with the given id and returns
 * it (or null on the server / before mount).
 *
 * The CRUD actions are rendered into a portal target that lives in the app
 * layout (TopNav's action row, or the sidebar layout's AppHeader). A plain
 * render-time `getElementById` is fragile: if the layout mounts after this
 * toolbar's first client render, the lookup returns null and the buttons never
 * appear. `useSyncExternalStore` resolves this cleanly — it reads the DOM in a
 * snapshot (stable, since `getElementById` returns the same node reference once
 * mounted) and returns a server snapshot of `null`, so SSR and the first client
 * paint stay in sync while the real node is picked up on the post-hydration
 * pass. It also satisfies the "no setState in effect" lint rule.
 */
function usePortalTarget(id: string | undefined): HTMLElement | null {
  const subscribe = useCallback(() => () => undefined, []);
  const getSnapshot = useCallback(
    () => (id ? document.getElementById(id) : null),
    [id]
  );
  const getServerSnapshot = useCallback(() => null, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

interface FormToolbarMetadata {
  /** Record identifier displayed as a badge. */
  recordId?: string;
  /** Creation timestamp (ISO string). */
  createdDate?: string;
  /** Last-update timestamp (ISO string). */
  updatedDate?: string;
  /** Label for the created date (default: "Registered"). */
  createdLabel?: string;
  /** Label for the updated date (default: "Updated"). */
  updatedLabel?: string;
}

/** Shape of a search result item displayed in the dropdown. */
export interface SearchResultItem {
  id?: string;
  profile_id?: string;
  peme_id?: string;
  first_name: string;
  last_name: string;
  position?: string;
  employer?: string;
}

export interface FormToolbarProps {
  /** Whether the form is currently in edit mode. */
  editing: boolean;
  /** Whether a save/update operation is in progress. */
  saving?: boolean;
  /** Whether this is an existing record being edited (affects Save label). */
  isExistingRecord?: boolean;
  /** Metadata badges to display (record ID, timestamps). */
  metadata?: FormToolbarMetadata;

  /** Optional custom element rendered inline in the metadata area (e.g. PEME selector dropdown). */
  metadataSlot?: React.ReactNode;

  /** DOM element ID where actions are rendered on large screens. */
  actionsPortalId?: string;

  // Action handlers — only rendered when provided
  onSave?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
  onNew?: () => void;
  onPrint?: () => void;

  /**
   * Optional dropdown menu content shown when the Print button is clicked.
   *
   * When provided, the Print button becomes a dropdown trigger and renders this
   * content in a menu (e.g. a list of report types to generate). `onPrint` is
   * ignored in that case. When omitted, the Print button behaves as a plain
   * button that calls `onPrint`.
   */
  printMenu?: React.ReactNode;

  /** Custom label for the save button (overrides default "Save"/"Update"). */
  saveLabel?: string;

  // Search props
  /** Callback fired on every search input change. */
  onSearch?: (keyword: string) => void;
  /** Search results to display in the dropdown. */
  searchResults?: SearchResultItem[];
  /** Whether a search is currently loading. */
  searchLoading?: boolean;
  /** Callback fired when a search result is selected (receives the full result object). */
  onSelectResult?: (result: SearchResultItem) => void;
}

/**
 * Shared form toolbar with CRUD action buttons, record metadata, and search.
 *
 * In edit mode: shows Save and Cancel buttons.
 * In view mode: shows Edit, New, and Print buttons.
 * Only renders buttons whose handlers are provided.
 *
 * The search input triggers `onSearch` on every keystroke (the consumer
 * handles debouncing). Results appear in a dropdown below the input.
 */
export function FormToolbar({
  editing,
  saving = false,
  isExistingRecord = false,
  metadata,
  metadataSlot,
  actionsPortalId,
  onSave,
  onCancel,
  onEdit,
  onNew,
  onPrint,
  printMenu,
  saveLabel,
  onSearch,
  searchResults = [],
  searchLoading = false,
  onSelectResult,
}: FormToolbarProps) {
  const resolvedSaveLabel = saveLabel ?? (isExistingRecord ? "Update" : "Save");

  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const actionsPortalTarget = usePortalTarget(actionsPortalId);
  const containerRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /** Wraps the onNew handler to also focus the search input. */
  const handleNewClick = () => {
    onNew?.();
    setTimeout(() => internalInputRef.current?.focus(), 50);
  };

  const setInputRef = (el: HTMLInputElement | null) => {
    internalInputRef.current = el;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchOpen(true);
    setHighlightedIndex(-1);
    onSearch?.(value);
  };

  const handleSelectItem = useCallback((result: SearchResultItem) => {
    onSelectResult?.(result);
    setSearchValue("");
    setSearchOpen(false);
    setHighlightedIndex(-1);
  }, [onSelectResult]);

  const handleSearchBlur = (e: React.FocusEvent) => {
    // Keep open if focus stays within the search container
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    setSearchOpen(false);
    setHighlightedIndex(-1);
  };

  const handleSearchFocus = () => {
    if (searchValue.trim()) setSearchOpen(true);
  };

  const showDropdown = searchOpen && (searchResults.length > 0 || searchLoading || searchValue.trim().length > 0);

  /** Handle keyboard navigation in the search input and dropdown list. */
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown || searchResults.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev < searchResults.length - 1 ? prev + 1 : prev;
          // Scroll the highlighted item into view
          setTimeout(() => {
            listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
          }, 0);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : -1;
          if (next >= 0) {
            setTimeout(() => {
              listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
            }, 0);
          }
          return next;
        });
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelectItem(searchResults[highlightedIndex]);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
        setHighlightedIndex(-1);
      }
    },
    [showDropdown, searchResults, highlightedIndex, handleSelectItem]
  );

  /**
   * Renders a single icon-only action button wrapped in a tooltip.
   *
   * The visible label is dropped in favor of an accessible tooltip: `label`
   * is shown on hover/focus and also set as `aria-label` so the control keeps
   * its accessible name for screen readers. The icon-only footprint keeps the
   * CRUD strip compact, mirroring the legacy desktop toolbar.
   */
  const iconAction = (
    key: string,
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    opts?: {
      variant?: "default" | "outline";
      disabled?: boolean;
      /** Tailwind text-color class applied to the icon (e.g. "text-emerald-600"). */
      iconColor?: string;
    }
  ) => (
    <Tooltip key={key}>
      <TooltipTrigger
        render={
          <Button
            size="icon-sm"
            variant={opts?.variant ?? "outline"}
            onClick={onClick}
            disabled={opts?.disabled}
            aria-label={label}
            className={cn(
              "cursor-pointer disabled:cursor-not-allowed",
              opts?.iconColor
            )}
          />
        }
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );

  const renderActions = (className?: string) => (
    <TooltipProvider delay={300}>
      <div className={cn("flex items-center gap-1.5", className)}>
        {editing ? (
          <>
            {onSave &&
              iconAction(
                "save",
                saving ? "Saving..." : resolvedSaveLabel,
                saving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save />
                ),
                onSave,
                { disabled: saving, iconColor: "text-blue-600" }
              )}
            {onCancel &&
              iconAction("cancel", "Cancel", <X />, onCancel, {
                disabled: saving,
                iconColor: "text-rose-500",
              })}
          </>
        ) : (
          // Edit is only available when an active record is selected.
          onEdit &&
          isExistingRecord &&
          iconAction("edit", "Edit", <Pencil />, onEdit, {
            iconColor: "text-amber-500",
          })
        )}
        {!editing && onNew && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={handleNewClick}
                  aria-label="New"
                  className="cursor-pointer text-emerald-600"
                />
              }
            >
              <Plus />
            </TooltipTrigger>
            <TooltipContent>New</TooltipContent>
          </Tooltip>
        )}
        {printMenu ? (
          <Tooltip>
            <DropdownMenu>
              <TooltipTrigger
                render={
                  <DropdownMenuTrigger
                    render={
                      <Button
                        size="icon-sm"
                        variant="outline"
                        aria-label="Print Preview"
                        className="cursor-pointer text-violet-500"
                      />
                    }
                  />
                }
              >
                <Printer />
              </TooltipTrigger>
              {printMenu}
            </DropdownMenu>
            <TooltipContent>Print Preview</TooltipContent>
          </Tooltip>
        ) : (
          onPrint &&
          iconAction("print", "Print", <Printer />, onPrint, {
            iconColor: "text-violet-500",
          })
        )}
      </div>
    </TooltipProvider>
  );

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {/* Metadata */}
      {(metadata || metadataSlot) && (
        <div className="flex items-center gap-3">
          {metadata?.recordId && (
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded tracking-widest">
              {metadata.recordId}
            </span>
          )}
          {metadataSlot}
          {metadata?.createdDate && (
            <span className="text-[10px] text-muted-foreground">
              {metadata.createdLabel ?? "Registered"}: {" "}
              {format(new Date(metadata.createdDate), "MMM d, yyyy h:mm a")}
            </span>
          )}
          {metadata?.updatedDate && (
            <span className="text-[10px] text-muted-foreground">
              {metadata.updatedLabel ?? "Updated"}: {" "}
              {format(new Date(metadata.updatedDate), "MMM d, yyyy h:mm a")}
            </span>
          )}
        </div>
      )}

      {/* Actions stay near the form on narrow screens. */}
      {renderActions(actionsPortalId ? "lg:hidden" : undefined)}
      {actionsPortalTarget && createPortal(renderActions(), actionsPortalTarget)}

      {/* Search */}
      <div
        ref={containerRef}
        className="relative min-w-64 flex-1"
        onBlur={handleSearchBlur}
      >
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={setInputRef}
          type="search"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onKeyDown={handleSearchKeyDown}
          className="w-full pl-9 h-8"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-activedescendant={highlightedIndex >= 0 ? `search-result-${highlightedIndex}` : undefined}
          autoComplete="off"
        />

        {/* Search Results Dropdown */}
        {showDropdown && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-md border border-primary/20 bg-popover shadow-lg overflow-hidden">
            {searchLoading && (
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" />
                Searching...
              </div>
            )}
            {!searchLoading && searchResults.length === 0 && searchValue.trim().length > 0 && (
              <div className="px-3 py-2 text-xs text-muted-foreground">
                No results found
              </div>
            )}
            {searchResults.length > 0 && (
              <ul ref={listRef} role="listbox" className="max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <li
                    key={result.id ?? index}
                    id={`search-result-${index}`}
                    role="option"
                    aria-selected={index === highlightedIndex}
                    tabIndex={-1}
                    className={cn(
                      "px-3 py-2 cursor-pointer select-none transition-colors",
                      "hover:bg-primary/5 focus:bg-primary/5 focus:outline-none",
                      index === highlightedIndex && "bg-primary/10"
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectItem(result);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSelectItem(result);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium">
                          {result.last_name}, {result.first_name}
                        </span>
                        {result.position && (
                          <span className="text-[10px] text-muted-foreground ml-2">
                            {result.position}
                          </span>
                        )}
                      </div>
                      {(result.profile_id || result.peme_id) && (
                        <span className="text-[10px] font-mono text-primary/60">
                          {result.profile_id || result.peme_id}
                        </span>
                      )}
                    </div>
                    {result.employer && (
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {result.employer}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
