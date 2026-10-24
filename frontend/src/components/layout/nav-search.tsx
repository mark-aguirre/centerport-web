"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/components/auth-provider";
import { useSelectedPatient } from "@/hooks/use-selected-patient";
import { buildNavHref, navigation } from "@/config/navigation";
import { accentForHref } from "@/config/module-theme";
import { cn } from "@/lib/utils";

/**
 * Header module search.
 *
 * Type-to-filter jump list over every navigation route the signed-in user may
 * access. Matches on the full title, the short label, and the subtitle, so
 * "ILO", "POEA" or "serology" all find the right screen without the user
 * having to remember which menu it lives under.
 *
 * Selecting a result navigates and closes the popover. The selected seafarer is
 * carried along where the route supports it (see `buildNavHref`).
 */
export function NavSearch() {
  const router = useRouter();
  const { canRoute } = useAuth();
  const selectedPatientId = useSelectedPatient();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const permitted = useMemo(
    () => navigation.filter((item) => canRoute(item.href)),
    [canRoute]
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return permitted;
    return permitted.filter((item) =>
      [item.title, item.shortTitle, item.subtitle, item.group]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term))
    );
  }, [permitted, query]);

  /** Navigate to a module and reset the popover for the next use. */
  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(buildNavHref(href, selectedPatientId));
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            title="Search modules"
            aria-label="Search modules"
          >
            <Search className="h-4 w-4" />
          </Button>
        }
      />

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            // The popover is opened explicitly to type a query, so focusing
            // the field is expected and does not steal focus unprompted.
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search modules"
            aria-label="Search modules"
            className="h-7 w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-1" role="listbox">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              No module matches that search.
            </p>
          ) : (
            results.map((item) => {
              const Icon = item.icon;
              const accent = accentForHref(item.href);
              return (
                <button
                  key={item.href}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => go(item.href)}
                  className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent"
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                      accent.bg
                    )}
                  >
                    <Icon className={cn("h-4 w-4", accent.fg)} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold">
                      {item.shortTitle ?? item.title}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {item.subtitle ?? item.group ?? item.title}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
