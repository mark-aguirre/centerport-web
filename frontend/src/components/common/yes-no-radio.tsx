/**
 * Inline Yes/No radio button pair used across medical form sections.
 *
 * Provides a compact horizontal layout with proper accessibility labels.
 * Used in Panama Personal Declaration, MLC Declaration, Medical questionnaire,
 * and Landbase questionnaire sections wherever a binary yes/no answer is needed.
 *
 * Props:
 * - `name` — HTML radio name for mutual exclusivity
 * - `value` — current selection ("yes", "no", or "")
 * - `onChange` — fires with "yes" or "no" on selection
 * - `ariaLabel` — context string for screen readers
 * - `labelYes` / `labelNo` — custom display text (defaults: "Yes"/"No")
 * - `uppercase` — renders labels in uppercase (default: false)
 *
 * @example
 * ```tsx
 * <YesNoRadio
 *   name="fit_for_lookout"
 *   value={data.fit_for_lookout}
 *   onChange={(v) => update("fit_for_lookout", v)}
 *   ariaLabel="Fit for lookout duties"
 * />
 * ```
 */

export type YesNoValue = "yes" | "no" | "";

interface YesNoRadioProps {
  /** HTML name attribute for mutual exclusivity within the form */
  name: string;
  /** Current value: "yes", "no", or "" (unselected) */
  value: YesNoValue;
  /** Callback fired when a radio option is selected */
  onChange: (value: YesNoValue) => void;
  /** Accessible label prepended to each radio for screen readers */
  ariaLabel: string;
  /** Custom "Yes" label text (default: "Yes") */
  labelYes?: string;
  /** Custom "No" label text (default: "No") */
  labelNo?: string;
  /** Render labels in uppercase (default: false) */
  uppercase?: boolean;
}

export function YesNoRadio({
  name,
  value,
  onChange,
  ariaLabel,
  labelYes = "Yes",
  labelNo = "No",
  uppercase = false,
}: YesNoRadioProps) {
  const yesText = uppercase ? labelYes.toUpperCase() : labelYes;
  const noText = uppercase ? labelNo.toUpperCase() : labelNo;

  return (
    <div
      className="flex items-center gap-2 shrink-0"
      role="radiogroup"
      aria-label={ariaLabel}
    >
      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="radio"
          name={name}
          checked={value === "yes"}
          onChange={() => onChange("yes")}
          className="w-4 h-4 accent-primary"
          aria-label={`${ariaLabel} - ${labelYes}`}
        />
        <span className="text-xs text-foreground/80">{yesText}</span>
      </label>
      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="radio"
          name={name}
          checked={value === "no"}
          onChange={() => onChange("no")}
          className="w-4 h-4 accent-primary"
          aria-label={`${ariaLabel} - ${labelNo}`}
        />
        <span className="text-xs text-foreground/80">{noText}</span>
      </label>
    </div>
  );
}
