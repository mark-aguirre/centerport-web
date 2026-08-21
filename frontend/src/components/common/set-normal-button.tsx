"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SetNormalButtonProps {
  /** Callback fired when the button is clicked. */
  onClick: () => void;
  /** When true, the button uses the standard disabled appearance. */
  disabled?: boolean;
  /** When true, the button remains full-color but cannot be activated. */
  readOnly?: boolean;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * Small "Set Normal" button placed in section headers.
 *
 * Sets all fields in the parent section to their "normal" default values
 * (e.g. all conditions to "no", physical exploration to "N", lab tests
 * to "normal"). Only visible when the form is in edit mode.
 */
export function SetNormalButton({
  onClick,
  disabled,
  readOnly,
  className,
}: SetNormalButtonProps) {
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={readOnly ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled || readOnly}
      tabIndex={readOnly ? -1 : undefined}
      className={cn(
        "h-6 px-2 text-[10px] font-bold uppercase tracking-wider text-primary border-primary/30 hover:bg-primary/10",
        disabled && "opacity-50 cursor-not-allowed",
        readOnly && "pointer-events-none",
        className
      )}
    >
      <RotateCcw className="w-3 h-3 mr-1" />
      Set Normal
    </Button>
  );
}
