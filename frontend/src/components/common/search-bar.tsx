import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Standalone search bar for pages without a FormToolbar.
 *
 * Mirrors the search field style used inside FormToolbar so the layout
 * is consistent across all pages.
 */
export function SearchBar() {
  return (
    <div className="flex items-center justify-end mb-4">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full pl-9 h-8"
        />
      </div>
    </div>
  );
}
