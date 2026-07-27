import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** A single option in the radio group */
export interface RadioOption {
  /** Display text */
  label: string;
  /** Value stored on selection */
  value: string;
}

interface RadioGroupProps {
  /** Optional field label displayed above the radio buttons */
  label?: string;
  /** HTML name attribute for the radio group (ensures mutual exclusivity) */
  name: string;
  /** Currently selected value */
  value: string;
  /** Callback when a new option is selected */
  onChange: (value: string) => void;
  /** Available options */
  options: RadioOption[];
  /** Accessible description for screen readers linking radios to context */
  ariaLabel?: string;
  /** Additional class name for the container */
  className?: string;
  /** Hide visible option labels (useful when column headers provide context) */
  hideLabels?: boolean;
  /** When true, all radio inputs are disabled (read-only mode) */
  disabled?: boolean;
}

/**
 * Reusable radio button group component.
 *
 * Renders a labeled set of radio inputs in a horizontal layout.
 * Includes proper `aria-label` support for accessibility.
 *
 * Props:
 * - `label` — optional heading displayed above the group
 * - `name` — unique name to group the radios
 * - `options` — array of `{ label, value }` pairs
 * - `ariaLabel` — context string prepended to each radio's aria-label
 */
export default function RadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  ariaLabel,
  className,
  hideLabels = false,
  disabled = false,
}: RadioGroupProps) {
  return (
    <div className={cn("space-y-0.5", disabled && "pointer-events-none", className)}>
      {label && (
        <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
          {label}
        </Label>
      )}
      <div className="flex items-center gap-4 h-8" role="radiogroup" aria-label={ariaLabel || label}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="w-4 h-4 accent-primary"
              aria-label={
                ariaLabel ? `${ariaLabel} - ${opt.label}` : opt.label
              }
              tabIndex={disabled ? -1 : undefined}
            />
            {!hideLabels && (
              <span className="text-xs text-foreground/80">{opt.label}</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
