import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldSize = "sm" | "md";

interface FormFieldProps {
  /** Field label displayed above the input */
  label: string;
  /** Current field value */
  value: string | number | undefined;
  /** Callback fired on every input change */
  onChange: (value: string) => void;
  /** HTML input type (default: "text") */
  type?: string;
  /** Placeholder text shown when empty */
  placeholder?: string;
  /** Shows a red asterisk next to the label */
  required?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Disables the input */
  disabled?: boolean;
  /**
   * Visual size variant:
   * - `"sm"` — compact (h-7), used in profile forms
   * - `"md"` — standard (h-8), used in landbase PEME forms
   */
  size?: FormFieldSize;
}

const sizeStyles: Record<FormFieldSize, string> = {
  sm: "h-7 text-xs bg-white border-primary/20 focus-visible:border-primary dark:bg-input/30",
  md: "h-8 text-xs bg-white border border-primary/30 rounded-md px-2 shadow-sm hover:border-primary/50 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30 transition-colors",
};

/**
 * Labeled text input used across all form sections.
 *
 * Renders a compact uppercase label + input pair with consistent styling.
 * Supports two size variants to accommodate different form densities.
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Last Name"
 *   value={data.last_name}
 *   onChange={(v) => update("last_name", v)}
 *   required
 *   size="md"
 * />
 * ```
 */
export function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  className,
  disabled,
  size = "md",
}: FormFieldProps) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <Label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={cn(sizeStyles[size], disabled && "pointer-events-none")}
      />
    </div>
  );
}
