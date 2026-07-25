"use client";

import { Palette } from "lucide-react";
import { useTheme, type AppTheme } from "./theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const themes: { id: AppTheme; label: string; colors: [string, string] }[] = [
  { id: "sand", label: "Sand", colors: ["#f1eeea", "#f8f6f4"] },
  { id: "ocean", label: "Ocean", colors: ["#1e3a5f", "#f5f6f8"] },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center rounded-md h-8 w-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Select theme"
      >
        <Palette className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              theme === t.id && "font-semibold"
            )}
          >
            <span className="flex gap-0.5">
              <span
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: t.colors[0] }}
              />
              <span
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: t.colors[1] }}
              />
            </span>
            <span>{t.label}</span>
            {theme === t.id && (
              <span className="ml-auto text-xs text-muted-foreground">&#10003;</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
