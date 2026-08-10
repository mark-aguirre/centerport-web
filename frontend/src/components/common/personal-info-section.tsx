"use client";

import { Fragment } from "react";
import { SectionHeader } from "@/components/common/section-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Field keys supported by the common PersonalInfoSection.
 *
 * Each module enables the subset it needs via the `fields` prop.
 */
export type PersonalInfoField =
  | "last_name"
  | "first_name"
  | "middle_name"
  | "date_of_birth"
  | "age"
  | "place_of_birth"
  | "passport_no"
  | "religion"
  | "nationality"
  | "gender"
  | "civil_status"
  | "address"
  | "contact_no"
  | "employer"
  | "position"
  | "sirb_no"
  | "rank"
  | "vessel_name"
  | "vessel_type"
  | "shipping_company"
  | "manning_agency";

/** Row layout definition — each row is an array of field configs */
interface FieldConfig {
  field: PersonalInfoField;
  label: string;
  type?: "text" | "date" | "number";
  required?: boolean;
  options?: string[];
}

export type RowConfig = FieldConfig[];

/**
 * Props for the common PersonalInfoSection.
 *
 * Uses a generic type parameter constrained to record types so any
 * module's form interface can be passed without explicit casting.
 * The component only reads fields specified in the `rows` config.
 */
export interface PersonalInfoSectionProps<T extends object = Record<string, string>> {
  /** Current form data object */
  data: T;
  /** Callback to update the form state with the modified data */
  onChange: (data: T) => void;
  /** Optional subtitle shown beneath the section header */
  subtitle?: string;
  /** Row layout configuration — controls which fields appear and how they're arranged */
  rows: RowConfig[];
  /** Grid class override per row (e.g. "grid-cols-[3fr_2fr]"). Defaults to equal columns based on row length. */
  gridOverrides?: Record<number, string>;
  /** Whether to show the "Name:" inline label on the first row (default: true) */
  showNameLabel?: boolean;
  /** When true, all fields in this section are read-only (view mode) */
  disabled?: boolean;
}

/**
 * Reusable Personal Information section for form pages.
 *
 * Clean table-style layout: uses a 6-column grid so labels and inputs
 * align consistently across all rows.
 */
export default function PersonalInfoSection<T extends object = Record<string, string>>({
  data,
  onChange,
  subtitle,
  rows,
  gridOverrides: _gridOverrides,
  showNameLabel = true,
  disabled,
}: PersonalInfoSectionProps<T>) {
  const update = (field: PersonalInfoField, value: string) =>
    onChange({ ...data, [field]: value } as T);

  const inputClasses = cn(
    "h-8 text-sm bg-white border border-primary/20 rounded-md px-2",
    "focus:outline-none focus-visible:border-primary dark:bg-input/30",
    disabled && "pointer-events-none opacity-70"
  );

  const labelClasses = "text-xs font-semibold text-foreground/70 whitespace-nowrap";

  const getValue = (field: PersonalInfoField): string =>
    String((data as Record<string, unknown>)[field] ?? "");

  const renderInput = (config: FieldConfig) => {
    if (config.options) {
      return (
        <select
          value={getValue(config.field)}
          onChange={(e) => update(config.field, e.target.value)}
          className={cn(inputClasses, "w-full cursor-pointer")}
          disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          aria-label={config.label}
        >
          <option value="">Select...</option>
          {config.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }
    return (
      <Input
        type={config.type ?? "text"}
        value={getValue(config.field)}
        onChange={(e) => update(config.field, e.target.value)}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={cn(inputClasses, "w-full")}
      />
    );
  };

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader title="Personal Information" icon={User} subtitle={subtitle} />

      <div>
        {/* First row with "Name:" label + sub-labels below inputs */}
        {rows.length > 0 && showNameLabel && (
          <div className="flex items-center gap-3 py-1.5">
            <Label className={cn(labelClasses, "w-[100px] shrink-0")}>Name:</Label>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {rows[0].map((config) => (
                  <div key={config.field} className="flex-1 min-w-0">
                    <Input
                      value={getValue(config.field)}
                      onChange={(e) => update(config.field, e.target.value)}
                      readOnly={disabled}
                      tabIndex={disabled ? -1 : undefined}
                      className={cn(inputClasses, "w-full")}
                    />
                    <span className="text-[10px] text-muted-foreground text-center block mt-0.5">
                      {config.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Remaining rows in a single 6-column grid for vertical alignment */}
        <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr] gap-x-2 items-center">
          {rows.slice(showNameLabel ? 1 : 0).map((row, rowIndex) => {
            const actualIndex = showNameLabel ? rowIndex + 1 : rowIndex;

            if (row.length === 3) {
              return (
                <Fragment key={actualIndex}>
                  {row.map((config) => (
                    <Fragment key={config.field}>
                      <Label className={cn(labelClasses, "py-2")}>
                        {config.label}:
                        {config.required && <span className="text-destructive ml-0.5">*</span>}
                      </Label>
                      <div className="py-2">
                        {renderInput(config)}
                      </div>
                    </Fragment>
                  ))}
                </Fragment>
              );
            }

            if (row.length === 2) {
              return (
                <Fragment key={actualIndex}>
                  <Label className={cn(labelClasses, "py-2")}>
                    {row[0].label}:
                    {row[0].required && <span className="text-destructive ml-0.5">*</span>}
                  </Label>
                  <div className="py-2 col-span-3">
                    {renderInput(row[0])}
                  </div>
                  <Label className={cn(labelClasses, "py-2")}>
                    {row[1].label}:
                    {row[1].required && <span className="text-destructive ml-0.5">*</span>}
                  </Label>
                  <div className="py-2">
                    {renderInput(row[1])}
                  </div>
                </Fragment>
              );
            }

            // 1 field: label + input spanning remaining 5 columns
            return (
              <Fragment key={actualIndex}>
                <Label className={cn(labelClasses, "py-2")}>
                  {row[0].label}:
                  {row[0].required && <span className="text-destructive ml-0.5">*</span>}
                </Label>
                <div className="py-2 col-span-5">
                  {renderInput(row[0])}
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
