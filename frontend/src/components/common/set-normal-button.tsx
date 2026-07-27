"use client";

import { RotateCcw } from "lucide-react";

interface SetNormalButtonProps {
  /** Callback fired when the button is clicked */
  onClick: () => void;
  /** When true, the button is hidden (view mode) */
  disabled?: boolean;
}

/**
 * Compact "Set Normal" button shown in section headers during edit mode.
 *
 * Fills the section's fields with their normal/default values (e.g. "Normal",
 * "No", "Passed", "Non Reactive") with a single click. Hidden when the form
 * is in view mode (disabled).
 */
export function SetNormalButton({ onClick, disabled }: SetNormalButtonProps) {
  if (disabled) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-primary/80 bg-primary/5 border border-primary/20 rounded hover:bg-primary/10 hover:text-primary transition-colors uppercase tracking-wide"
      title="Set all fields in this section to normal values"
    >
      <RotateCcw className="w-3 h-3" />
      Set Normal
    </button>
  );
}
