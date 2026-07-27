"use client";

import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Minimal record summary shown in the dropdown. */
export interface RecordSummary {
  id: string;
  record_id: string;
  created_date: string;
}

interface RecordSelectorProps {
  /** List of available records for the current patient. */
  items: RecordSummary[];
  /** Currently selected record ID (UUID). */
  selectedId?: string;
  /** Fires when the user picks a different record. */
  onSelect: (id: string) => void;
  /** Disables the selector (e.g. when editing). */
  disabled?: boolean;
}

/**
 * Generic dropdown selector for switching between multiple records
 * of the same patient. Each item shows the business ID and creation date.
 *
 * Only renders when there are 2+ records available. When a single
 * record exists, the parent should continue showing the static badge.
 */
export function RecordSelector({
  items,
  selectedId,
  onSelect,
  disabled = false,
}: RecordSelectorProps) {
  if (items.length < 2) return null;

  // Use record_id as the select value so it displays nicely in the trigger
  const selectedItem = items.find((i) => i.id === selectedId);
  const selectedRecordId = selectedItem?.record_id ?? "";

  const handleChange = (recordId: string) => {
    const item = items.find((i) => i.record_id === recordId);
    if (item) onSelect(item.id);
  };

  return (
    <Select
      value={selectedRecordId}
      onValueChange={(val) => handleChange(val as string)}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "h-8 w-auto min-w-[220px] gap-2 rounded-md border border-primary/30",
          "bg-primary/5 px-3 text-xs font-bold text-primary tracking-wide",
          "shadow-sm hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20",
          "transition-colors",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <SelectValue placeholder="Select record..." />
      </SelectTrigger>
      <SelectContent className="shadow-lg border border-primary/20 rounded-md">
        {items.map((item) => (
          <SelectItem
            key={item.id}
            value={item.record_id}
            className="text-xs cursor-pointer hover:bg-primary/5 [&[data-selected]]:text-white [&:focus]:text-white"
          >
            <span className="font-bold">{item.record_id}</span>
            <span className="ml-2 opacity-75">
              {item.created_date
                ? format(new Date(item.created_date), "MMM d, yyyy")
                : "—"}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
