"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormAutocompleteSize = "sm" | "md";

interface FormAutocompleteProps {
  /** Field label displayed above the input */
  label: string;
  /** Current field value */
  value: string | undefined;
  /** Callback fired when the value changes (typing or selection) */
  onChange: (value: string) => void;
  /** List of suggestion options to filter against */
  suggestions: string[];
  /** Placeholder text shown when empty */
  placeholder?: string;
  /** Shows a red asterisk next to the label */
  required?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Disables the input */
  disabled?: boolean;
  /**
   * Visual size variant:
   * - `"sm"` — compact (h-7), used in profile forms
   * - `"md"` — standard (h-8), used in landbase PEME forms
   */
  size?: FormAutocompleteSize;
  /** Maximum number of suggestions to display (default: 8) */
  maxSuggestions?: number;
}

const sizeStyles: Record<FormAutocompleteSize, string> = {
  sm: "h-7 text-xs bg-white border-primary/20 focus-visible:border-primary dark:bg-input/30",
  md: "h-8 text-xs bg-white border border-primary/30 rounded-md px-2 shadow-sm hover:border-primary/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30 transition-colors",
};

/**
 * Labeled text input with autocomplete suggestions.
 *
 * Works like FormField but shows a filtered dropdown of suggestions
 * as the user types. Allows free-form text entry (not restricted to
 * the suggestion list). Keyboard navigation supported (Arrow keys, Enter, Escape).
 *
 * @example
 * ```tsx
 * <FormAutocomplete
 *   label="Nationality"
 *   value={data.nationality}
 *   onChange={(v) => update("nationality", v)}
 *   suggestions={NATIONALITIES}
 *   size="sm"
 * />
 * ```
 */
export function FormAutocomplete({
  label,
  value,
  onChange,
  suggestions,
  placeholder,
  required,
  className,
  disabled,
  size = "md",
  maxSuggestions = 8,
}: FormAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const inputValue = value ?? "";

  const filtered = React.useMemo(() => {
    if (!inputValue.trim()) return suggestions.slice(0, maxSuggestions);
    const lower = inputValue.toLowerCase();
    return suggestions
      .filter((s) => s.toLowerCase().includes(lower))
      .slice(0, maxSuggestions);
  }, [inputValue, suggestions, maxSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelect = (item: string) => {
    onChange(item);
    setOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
          handleSelect(filtered[highlightedIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (!disabled) setOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Keep open if focus moves within the container (e.g. clicking an item)
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    setOpen(false);
    setHighlightedIndex(-1);
  };

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[highlightedIndex]) {
        (items[highlightedIndex] as HTMLElement).scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [highlightedIndex]);

  const showDropdown = open && filtered.length > 0 && !disabled;

  return (
    <div
      ref={containerRef}
      className={cn("space-y-0.5 relative", className)}
      onBlur={handleBlur}
    >
      <Label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={sizeStyles[size]}
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        aria-controls={showDropdown ? `${label}-listbox` : undefined}
        aria-activedescendant={
          highlightedIndex >= 0 ? `${label}-option-${highlightedIndex}` : undefined
        }
        autoComplete="off"
      />
      {showDropdown && (
        <ul
          ref={listRef}
          id={`${label}-listbox`}
          role="listbox"
          className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-md border border-primary/20 bg-popover shadow-lg"
        >
          {filtered.map((item, index) => (
            <li
              key={item}
              id={`${label}-option-${index}`}
              role="option"
              aria-selected={highlightedIndex === index}
              className={cn(
                "px-2 py-1.5 text-xs cursor-pointer select-none transition-colors",
                highlightedIndex === index
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/50"
              )}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur before select
                handleSelect(item);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
