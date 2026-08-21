"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  /** Current search input value. */
  value: string;
  /** Callback fired on every input change. */
  onChange: (value: string) => void;
  /** Placeholder text (default: "Search..."). */
  placeholder?: string;
}

/**
 * Standalone search bar for pages without a FormToolbar.
 *
 * Mirrors the search field style used inside FormToolbar so the layout
 * is consistent across all pages. Accepts controlled value and onChange
 * props for the parent to manage search state.
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState("");
 * <SearchBar value={query} onChange={setQuery} placeholder="Search patients..." />
 * ```
 */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="flex items-center justify-end mb-4">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 h-8"
        />
      </div>
    </div>
  );
}
