"use client";

import * as React from "react";
import { RefreshCw, type LucideIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props for {@link ConfirmDialog}.
 */
export interface ConfirmDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Called when the dialog's open state changes (e.g. backdrop/escape close). */
  onOpenChange?: (open: boolean) => void;
  /** Heading text. */
  title: string;
  /** Body message shown under the title. */
  message: React.ReactNode;
  /** Label for the confirming (primary) action. Defaults to "Yes". */
  confirmLabel?: string;
  /** Label for the dismissing action. Defaults to "No". */
  cancelLabel?: string;
  /** Visual style for the confirm button. Defaults to "default". */
  confirmVariant?: React.ComponentProps<typeof Button>["variant"];
  /**
   * Icon shown in the accent badge beside the title. Defaults to a sync icon.
   * Pass `null` to hide the badge entirely.
   */
  icon?: LucideIcon | null;
  /** Disables both buttons while an async action is in flight. */
  busy?: boolean;
  /** Invoked when the user confirms. */
  onConfirm: () => void;
  /** Invoked when the user dismisses (No / close). */
  onCancel: () => void;
}

/**
 * Reusable Yes/No confirmation dialog composed from the design-system
 * `Dialog` primitive.
 *
 * Sized and styled for high legibility (larger heading, relaxed body text, and
 * generous touch targets) so it stays comfortable for older users. It is
 * presentational only: the parent controls visibility via `open` and reacts to
 * `onConfirm` / `onCancel`.
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   open={confirmOpen}
 *   title="Update Seabase record?"
 *   message="This change affects data synchronized with Seabase..."
 *   confirmLabel="Yes, update both"
 *   cancelLabel="No, Panama only"
 *   onConfirm={handleYes}
 *   onCancel={handleNo}
 * />
 * ```
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = "Yes",
  cancelLabel = "No",
  confirmVariant = "default",
  icon,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Route any close that isn't an explicit confirm (backdrop click, Escape,
  // the corner X) through onCancel so callers only handle two outcomes.
  const handleOpenChange = (next: boolean) => {
    onOpenChange?.(next);
    if (!next) onCancel();
  };

  // `undefined` -> default icon; `null` -> no badge.
  const Icon = icon === null ? null : (icon ?? RefreshCw);

  // Large, senior-friendly control sizing shared by both buttons.
  const actionButtonClass =
    "h-12 min-w-32 px-8 text-base font-semibold cursor-pointer";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl gap-0 p-0 sm:rounded-2xl">
        <div className="flex flex-col gap-5 p-8 sm:flex-row sm:gap-6">
          {Icon && (
            <div
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
            >
              <Icon className="h-7 w-7" />
            </div>
          )}

          <DialogHeader className="flex-1 space-y-3 text-left sm:text-left">
            <DialogTitle className="text-2xl font-semibold leading-snug tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-muted-foreground">
              {message}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="gap-3 border-t border-border bg-muted/30 px-8 py-5 sm:rounded-b-2xl">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={busy}
            className={actionButtonClass}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={busy}
            className={cn(actionButtonClass, "gap-2")}
          >
            {busy && <RefreshCw className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
