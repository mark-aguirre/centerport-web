import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FormSelectSize = "sm" | "md";

interface FormSelectProps {
  /** Optional label displayed above the select */
  label?: string;
  /** Currently selected value */
  value: string | undefined;
  /** Callback fired when a new option is selected */
  onChange: (value: string) => void;
  /** Available options rendered as select items */
  options: string[];
  /** Shows a red asterisk next to the label */
  required?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Disables the select */
  disabled?: boolean;
  /**
   * Visual size variant:
   * - `"sm"` — compact (h-7), used in profile forms
   * - `"md"` — standard (h-8), used in landbase PEME forms
   */
  size?: FormSelectSize;
}

const triggerStyles: Record<FormSelectSize, string> = {
  sm: "h-7 text-xs bg-white border-primary/20 focus:border-primary dark:bg-input/30",
  md: "h-8 text-xs bg-white border border-primary/30 rounded-md px-3 shadow-sm hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 dark:bg-input/30 transition-colors",
};

const contentStyles: Record<FormSelectSize, string> = {
  sm: "",
  md: "shadow-lg border border-primary/20 rounded-md",
};

const itemStyles: Record<FormSelectSize, string> = {
  sm: "text-xs",
  md: "text-xs cursor-pointer hover:bg-primary/5",
};

/**
 * Labeled dropdown select used across all form sections.
 *
 * Renders a compact uppercase label + select pair. Options are
 * provided as a string array and rendered as select items.
 * Supports two size variants for different form densities.
 *
 * @example
 * ```tsx
 * <FormSelect
 *   label="Gender"
 *   value={data.gender}
 *   onChange={(v) => update("gender", v)}
 *   options={["Male", "Female"]}
 *   size="md"
 * />
 * ```
 */
export function FormSelect({
  label,
  value,
  onChange,
  options,
  required,
  className,
  disabled,
  size = "md",
}: FormSelectProps) {
  return (
    <div className={cn("space-y-0.5", className)}>
      {label && (
        <Label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      <Select value={value ?? ""} onValueChange={(val) => onChange(val as string)} disabled={disabled}>
        <SelectTrigger className={cn(triggerStyles[size], disabled && "pointer-events-none")}>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent className={contentStyles[size]}>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className={itemStyles[size]}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
