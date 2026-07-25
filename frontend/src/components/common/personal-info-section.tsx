"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import { User } from "lucide-react";

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

/** Default grid class based on number of columns in a row */
function defaultGridCols(count: number): string {
  switch (count) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-3";
    case 4:
      return "grid-cols-4";
    case 5:
      return "grid-cols-5";
    default:
      return "grid-cols-3";
  }
}

/**
 * Reusable Personal Information section for form pages.
 *
 * Renders a section card with configurable rows of fields. Each module
 * (landbase, medical, MLC, seabase) provides its own row configuration
 * to show/hide fields and control layout, while sharing the same
 * visual structure and behavior.
 *
 * @example
 * ```tsx
 * <PersonalInfoSection
 *   data={data}
 *   onChange={setData}
 *   subtitle="Seafarer identity and employment details"
 *   rows={MLC_PERSONAL_INFO_ROWS}
 * />
 * ```
 */
export default function PersonalInfoSection<T extends object = Record<string, string>>({
  data,
  onChange,
  subtitle,
  rows,
  gridOverrides,
  showNameLabel = true,
  disabled,
}: PersonalInfoSectionProps<T>) {
  const update = (field: PersonalInfoField, value: string) =>
    onChange({ ...data, [field]: value } as T);

  const renderField = (config: FieldConfig) => {
    if (config.options) {
      return (
        <FormSelect
          key={config.field}
          label={config.label}
          value={String((data as Record<string, unknown>)[config.field] ?? "")}
          onChange={(v) => update(config.field, v)}
          options={config.options}
          required={config.required}
          disabled={disabled}
        />
      );
    }
    return (
      <FormField
        key={config.field}
        label={config.label}
        value={String((data as Record<string, unknown>)[config.field] ?? "")}
        onChange={(v) => update(config.field, v)}
        type={config.type ?? "text"}
        required={config.required}
        disabled={disabled}
      />
    );
  };

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader title="Personal Information" icon={User} subtitle={subtitle} />
      <div className="space-y-1.5">
        {rows.map((row, rowIndex) => {
          const gridClass = gridOverrides?.[rowIndex] ?? defaultGridCols(row.length);

          // First row with "Name:" inline label
          if (rowIndex === 0 && showNameLabel) {
            return (
              <div key={rowIndex} className="flex items-end gap-2">
                <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wide pb-1 shrink-0">
                  Name:
                </span>
                <div className={`grid ${gridClass} gap-2 flex-1`}>
                  {row.map(renderField)}
                </div>
              </div>
            );
          }

          return (
            <div key={rowIndex} className={`grid ${gridClass} gap-2`}>
              {row.map(renderField)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
