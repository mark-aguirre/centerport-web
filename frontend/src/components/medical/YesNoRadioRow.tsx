"use client";

/**
 * Reusable Yes/No radio row for medical condition checklists.
 *
 * Renders a condition label with Y/N radio buttons in a compact row layout.
 * Used across Past Medical History, Medical History, and Questionnaire sections.
 *
 * Props:
 * - `condition` — display label for the condition
 * - `name` — unique radio group name (must be unique across the form)
 * - `value` — current selection ("yes", "no", or empty string)
 * - `onChange` — fires when user selects a radio option
 *
 * @see PhysicalExaminationSection — Past Medical History grid
 * @see MedicalHistorySection — Medical History condition grid
 */
interface YesNoRadioRowProps {
  /** Display label for the condition */
  condition: string;
  /** Unique radio group name for the form */
  name: string;
  /** Current value: "yes" | "no" | "" */
  value: string;
  /** Called with "yes" or "no" when a radio button is selected */
  onChange: (value: string) => void;
}

const YES_NO_OPTIONS = [
  { label: "Y", value: "yes" },
  { label: "N", value: "no" },
] as const;

export function YesNoRadioRow({ condition, name, value, onChange }: YesNoRadioRowProps) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-muted/30">
      <span className="text-xs text-foreground/80 leading-tight flex-1 pr-1">
        {condition}
      </span>
      <div className="flex items-center gap-3 shrink-0" role="radiogroup" aria-label={condition}>
        {YES_NO_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name={name}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="w-4 h-4 accent-primary"
              aria-label={`${condition} - ${opt.label}`}
            />
            <span className="text-xs text-foreground/80">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
