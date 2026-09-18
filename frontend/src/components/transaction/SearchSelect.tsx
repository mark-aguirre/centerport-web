"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Minimum shape a search-select option must provide. */
interface Option {
  id: string;
}

interface SearchSelectProps<T extends Option> {
  /** Async search function invoked (debounced) as the user types. */
  onSearch: (keyword: string) => Promise<T[]>;
  /** Called when the user picks a result. */
  onSelect: (item: T) => void;
  /** Renders the primary line of a result row. */
  renderPrimary: (item: T) => React.ReactNode;
  /** Renders the optional secondary line of a result row. */
  renderSecondary?: (item: T) => React.ReactNode;
  /** Placeholder for the input. */
  placeholder?: string;
  /** Disables the control (e.g. before a prerequisite is met). */
  disabled?: boolean;
  /** Clear the input after a selection (useful for repeatedly adding products). */
  clearOnSelect?: boolean;
  /** ARIA label for the search input. */
  ariaLabel?: string;
}

/**
 * Reusable searchable async selector for the transaction workspace.
 *
 * Debounces keystrokes, queries the provided `onSearch`, and renders a dropdown
 * of results. Used for both the customer selector (single pick) and the product
 * selector (repeated picks with `clearOnSelect`). Loads data through the `api`
 * client via the caller-supplied `onSearch`.
 */
export function SearchSelect<T extends Option>({
  onSearch,
  onSelect,
  renderPrimary,
  renderSecondary,
  placeholder = "Search...",
  disabled = false,
  clearOnSelect = false,
  ariaLabel,
}: SearchSelectProps<T>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Debounced search whenever the query changes. All state updates are made
  // inside the deferred timeout callback (not synchronously in the effect body)
  // to satisfy react-hooks/set-state-in-effect.
  useEffect(() => {
    const keyword = query.trim();
    let cancelled = false;

    if (!keyword) {
      const clearHandle = window.setTimeout(() => {
        if (cancelled) return;
        setResults([]);
        setOpen(false);
        setLoading(false);
      }, 0);
      return () => {
        cancelled = true;
        window.clearTimeout(clearHandle);
      };
    }

    const handle = window.setTimeout(async () => {
      setLoading(true);
      try {
        const found = await onSearch(keyword);
        if (!cancelled) {
          setResults(found);
          setOpen(true);
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [query, onSearch]);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (item: T) => {
    onSelect(item);
    setOpen(false);
    if (clearOnSelect) {
      setQuery("");
      setResults([]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel ?? placeholder}
          className="w-full pl-9 h-8 text-xs"
        />
        {loading && (
          <Loader2 className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && (
        <div
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-primary/20 bg-popover shadow-lg"
          role="listbox"
        >
          {results.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              {loading ? "Searching..." : "No results"}
            </p>
          ) : (
            <ul className="max-h-64 overflow-auto py-1">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full flex-col items-start gap-0.5 px-3 py-1.5 text-left cursor-pointer",
                      "hover:bg-primary/5 focus:bg-primary/5 focus:outline-none"
                    )}
                    onClick={() => handleSelect(item)}
                  >
                    <span className="text-xs font-medium text-foreground/90">
                      {renderPrimary(item)}
                    </span>
                    {renderSecondary && (
                      <span className="text-[11px] text-muted-foreground">
                        {renderSecondary(item)}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
