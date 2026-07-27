"use client";

import { useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2, Pencil, Plus, Printer, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Action handlers — only rendered when provided
  onSave?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
  onNew?: () => void;
  onPrint?: () => void;

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
  onSave,
  onCancel,
  onEdit,
  onNew,
  onPrint,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchOpen(true);
    setHighlightedIndex(-1);
    onSearch?.(value);
  };

  const handleSelectItem = (result: SearchResultItem) => {
    onSelectResult?.(result);
    setSearchValue("");
    setSearchOpen(false);
    setHighlightedIndex(-1);
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showDropdown, searchResults, highlightedIndex]
  );

  return (
    <div className="flex items-center gap-3 mb-4">
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
              {metadata.createdLabel ?? "Registered"}:{" "}
              {format(new Date(metadata.createdDate), "MMM d, yyyy h:mm a")}
            </span>
          )}
          {metadata?.updatedDate && (
            <span className="text-[10px] text-muted-foreground">
              {metadata.updatedLabel ?? "Updated"}:{" "}
              {format(new Date(metadata.updatedDate), "MMM d, yyyy h:mm a")}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            {onSave && (
              <Button size="sm" onClick={onSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                {saving ? "Saving..." : resolvedSaveLabel}
              </Button>
            )}
            {onCancel && (
              <Button size="sm" variant="outline" onClick={onCancel} disabled={saving}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
          </>
        ) : (
          <>
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </>
        )}
        {!editing && onNew && (
          <Button size="sm" variant="outline" onClick={onNew}>
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        )}
        {onPrint && (
          <Button size="sm" variant="outline" onClick={onPrint}>
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>
        )}
      </div>

      {/* Search */}
      <div
        ref={containerRef}
        className="relative flex-1"
        onBlur={handleSearchBlur}
      >
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
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
