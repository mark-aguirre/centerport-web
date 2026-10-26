"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  /** Extra classes for the input (e.g. to render a larger field). */
  inputClassName?: string;
  /** Focus the input on mount. */
  autoFocus?: boolean;
}

/** Result list height cap, matching `max-h-64`. */
const DROPDOWN_MAX_HEIGHT = 256;
/** Gap between the field and the list, in px. */
const GAP = 4;

/**
 * Reusable searchable async selector for the transaction workspace.
 *
 * Debounces keystrokes, queries the provided `onSearch`, and renders a dropdown
 * of results. Used for both the customer selector (single pick) and the product
 * selector (repeated picks with `clearOnSelect`). Loads data through the `api`
 * client via the caller-supplied `onSearch`.
 *
 * The result list is rendered in a portal, positioned to the field with fixed
 * coordinates. An absolutely-positioned child would be clipped by any ancestor
 * with `overflow-hidden` — which is exactly what happens on the New Sale hero,
 * whose photo backdrop is clipped to its rounded corners. The list re-measures
 * on scroll and resize, and flips above the field when there is not enough room
 * below it.
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
  inputClassName,
  autoFocus = false,
}: SearchSelectProps<T>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputWrapRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // Fixed-position coordinates for the portaled list.
  const [dropdownPos, setDropdownPos] = useState<{
    left: number;
    top: number;
    width: number;
    placement: "bottom" | "top";
  } | null>(null);

  // Keep the latest onSearch in a ref so the debounced effect doesn't restart
  // (and cancel its in-flight request) every time the parent re-renders with a
  // new inline onSearch function. Without this, rapid parent re-renders can
  // leave the search stuck in a perpetual loading state with no results.
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  /** The search input element (queried from the container). */
  const getInput = () =>
    containerRef.current?.querySelector<HTMLInputElement>('input[data-slot="input"]');

  /** All focusable option buttons currently rendered in the list. */
  const getOptionButtons = () =>
    Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-option]") ?? []
    );

  /** Move focus to the option at `index`, clamped to the list bounds. */
  const focusOption = (index: number) => {
    const buttons = getOptionButtons();
    if (buttons.length === 0) return;
    const clamped = Math.max(0, Math.min(index, buttons.length - 1));
    buttons[clamped]?.focus();
  };

  // ArrowDown from the input opens the list (if needed) and focuses the first
  // result, following the standard combobox keyboard pattern.
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (results.length === 0) return;
      e.preventDefault();
      setOpen(true);
      // Defer so the list is mounted before we move focus into it.
      requestAnimationFrame(() => focusOption(0));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const focusInput = () => getInput()?.focus();

  // ArrowUp/ArrowDown move between options; ArrowUp from the top (or Escape)
  // returns focus to the input.
  const handleOptionKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusOption(index + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) {
        focusInput();
      } else {
        focusOption(index - 1);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      focusInput();
    }
  };

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
      // Open immediately so the loading / "No results" state is visible while
      // the request is in flight.
      setOpen(true);
      try {
        const found = await onSearchRef.current(keyword);
        if (!cancelled) setResults(found);
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
  }, [query]);

  // Close the dropdown when clicking outside. The list lives in a portal, so it
  // is not inside `containerRef` — it has to be excluded separately or the
  // mousedown would close the list before a click on an option could land.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Measure the field and place the list against it, flipping above when the
  // space below is too tight (e.g. a field near the bottom of the viewport).
  const updatePosition = useCallback(() => {
    const el = inputWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const placeAbove =
      spaceBelow < DROPDOWN_MAX_HEIGHT + GAP && spaceAbove > spaceBelow;

    setDropdownPos({
      left: rect.left,
      width: rect.width,
      top: placeAbove ? rect.top - GAP : rect.bottom + GAP,
      placement: placeAbove ? "top" : "bottom",
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    // Measure on the next frame so the field has laid out, then keep the list
    // anchored while the user scrolls or resizes. `capture` catches scrolls on
    // any ancestor (the hero's scroll container, the page), not just window.
    const raf = requestAnimationFrame(updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, results.length, loading, updatePosition]);

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
      <div ref={inputWrapRef} className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-label={ariaLabel ?? placeholder}
          className={cn("w-full pl-9 h-8 text-xs", inputClassName)}
        />
        {loading && (
          <Loader2 className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {open &&
        dropdownPos &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            style={{
              position: "fixed",
              left: dropdownPos.left,
              width: dropdownPos.width,
              top: dropdownPos.top,
              ...(dropdownPos.placement === "top"
                ? { transform: "translateY(-100%)" }
                : null),
            }}
            className="z-50 overflow-hidden rounded-md border border-primary/20 bg-popover shadow-lg"
          >
            {results.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                {loading ? "Searching..." : "No results"}
              </p>
            ) : (
              <ul
                ref={listRef}
                className="overflow-auto py-1"
                style={{ maxHeight: DROPDOWN_MAX_HEIGHT }}
              >
                {results.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      data-option
                      role="option"
                      aria-selected={false}
                      className={cn(
                        "flex w-full flex-col items-start gap-0.5 px-3 py-1.5 text-left cursor-pointer",
                        "hover:bg-primary/5 focus:bg-primary/5 focus:outline-none"
                      )}
                      onClick={() => handleSelect(item)}
                      onKeyDown={(e) => handleOptionKeyDown(e, index)}
                    >
                      <span className="text-sm font-medium text-foreground/90">
                        {renderPrimary(item)}
                      </span>
                      {renderSecondary && (
                        <span className="text-xs text-muted-foreground">
                          {renderSecondary(item)}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
