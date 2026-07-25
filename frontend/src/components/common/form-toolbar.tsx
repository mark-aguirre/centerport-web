import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2, Pencil, Plus, Printer, X, Search } from "lucide-react";

interface FormToolbarMetadata {
  /** Record identifier displayed as a badge. */
  recordId?: string;
  /** Creation timestamp (ISO string). */
  createdDate?: string;
  /** Last-update timestamp (ISO string). */
  updatedDate?: string;
  /** Label for the created date (default: "Registered"). */
  createdLabel?: string;
  /** Label for the updated date (default: "Updated"). */
  updatedLabel?: string;
}

export interface FormToolbarProps {
  /** Whether the form is currently in edit mode. */
  editing: boolean;
  /** Whether a save/update operation is in progress. */
  saving?: boolean;
  /** Whether this is an existing record being edited (affects Save label). */
  isExistingRecord?: boolean;
  /** Metadata badges to display (record ID, timestamps). */
  metadata?: FormToolbarMetadata;

  // Action handlers — only rendered when provided
  onSave?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
  onNew?: () => void;
  onPrint?: () => void;

  /** Custom label for the save button (overrides default "Save"/"Update"). */
  saveLabel?: string;
}

/**
 * Shared form toolbar with CRUD action buttons and optional record metadata.
 *
 * In edit mode: shows Save and Cancel buttons.
 * In view mode: shows Edit, New, and Print buttons.
 * Only renders buttons whose handlers are provided.
 */
export function FormToolbar({
  editing,
  saving = false,
  isExistingRecord = false,
  metadata,
  onSave,
  onCancel,
  onEdit,
  onNew,
  onPrint,
  saveLabel,
}: FormToolbarProps) {
  const resolvedSaveLabel = saveLabel ?? (isExistingRecord ? "Update" : "Save");

  return (
    <div className="flex items-center gap-3 mb-4">
      {/* Metadata */}
      {metadata && (
        <div className="flex items-center gap-3">
          {metadata.recordId && (
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded tracking-widest">
              {metadata.recordId}
            </span>
          )}
          {metadata.createdDate && (
            <span className="text-[10px] text-muted-foreground">
              {metadata.createdLabel ?? "Registered"}:{" "}
              {format(new Date(metadata.createdDate), "MMM d, yyyy h:mm a")}
            </span>
          )}
          {metadata.updatedDate && (
            <span className="text-[10px] text-muted-foreground">
              {metadata.updatedLabel ?? "Updated"}:{" "}
              {format(new Date(metadata.updatedDate), "MMM d, yyyy h:mm a")}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            {onSave && (
              <Button size="sm" onClick={onSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                {saving ? "Saving..." : resolvedSaveLabel}
              </Button>
            )}
            {onCancel && (
              <Button size="sm" variant="outline" onClick={onCancel} disabled={saving}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
          </>
        ) : (
          <>
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </>
        )}
        {onNew && (
          <Button size="sm" variant="outline" onClick={onNew}>
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        )}
        {onPrint && (
          <Button size="sm" variant="outline" onClick={onPrint}>
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative w-full max-w-xs">
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
