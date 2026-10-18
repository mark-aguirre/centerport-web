"use client";

import { SectionHeader } from "@/components/common/section-header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { PanamaSectionProps, PanamaCertificate, PhysicalExplorationValue } from "./types";

/**
 * Physical exploration item.
 *
 * `key` is the stable snake_case identifier persisted as the JSON map key.
 * `label` is the human-readable text shown in the UI. Data is keyed by `key`
 * so the stored JSON stays free of spaces, punctuation, and parentheses.
 */
type ExplorationItem = { key: string; label: string };

/**
 * Physical exploration items — Column 1 (left group).
 *
 * `key` values are kept stable (they are the persisted JSON map keys and are
 * referenced by the Seabase sync); only display labels/ordering follow the
 * official certificate layout.
 */
const EXPLORATION_COL_1: ExplorationItem[] = [
  { key: "head", label: "Head" },
  { key: "mouth", label: "Mouth" },
  { key: "nose", label: "Nose" },
  { key: "throat", label: "Throat" },
  { key: "dental_exam", label: "Dental Exam" },
  { key: "ears_general", label: "Ears (general)" },
  { key: "tympanic_membrane", label: "Tympanic Membrane" },
  { key: "eyes", label: "Eyes" },
  { key: "pupils", label: "Pupils" },
  { key: "ophthalmoscopy", label: "Ofthalmoscopy" },
  { key: "eye_movement", label: "Eye movement" },
  { key: "lungs", label: "Lungs" },
  { key: "chest", label: "Chest cavity" },
  { key: "heart", label: "Heart" },
];

/** Physical exploration items — Column 2 (right group) */
const EXPLORATION_COL_2: ExplorationItem[] = [
  { key: "skin", label: "Skin" },
  { key: "varicose_veins", label: "Varicose veins" },
  { key: "vascular_incl_pedal", label: "Vascular (inc. Pedal pulses)" },
  { key: "abdomen_and_viscera", label: "Abdomen and viscera" },
  { key: "hernias", label: "Hernias" },
  { key: "anus_not_rectal_exam", label: "Anus (not rectal exam)" },
  { key: "gu_system", label: "G-U system" },
  { key: "upper_and_lower", label: "Upper and lower extremities" },
  { key: "spine_cervical_thoracic_lumbar", label: "Spine (Cervical,Thoracic and Lumbar)" },
  { key: "neurologic_full_brief", label: "Neurologic (full brief)" },
  { key: "psychiatric", label: "Psychiatric" },
  { key: "general_appearance", label: "General appearance" },
  { key: "breast_examination", label: "Breast examination" },
];

/** Hearing frequency columns */
const HEARING_FREQUENCIES = ["500", "1000", "2000", "3000", "4000", "6000"];

/**
 * Format a hearing frequency column header, e.g. "1000" -> "1,000 Hz".
 * Adds a thousands separator to match the official certificate labels.
 */
function formatFrequencyLabel(freq: string): string {
  const n = Number(freq);
  const withSeparator = Number.isFinite(n) ? n.toLocaleString("en-US") : freq;
  return `${withSeparator} Hz`;
}

/**
 * Build the "normal" default values for the Medical Examination section
 * (Section IV). Single source of truth shared by the Set Normal button and the
 * auto-apply-on-new-record flow.
 *
 * - Sight: color vision → "Normal" and both visual-field entries → "Normal".
 * - Physical exploration: every body-system row → "N" (Normal).
 *
 * Freeform clinical measurements (height, weight, vitals) and visual-acuity
 * readings have no objective default, so they are left blank. The
 * physical-exploration comment field is cleared.
 *
 * @param baseExploration Existing physical-exploration map to merge onto.
 */
export function buildExaminationNormalDefaults(
  baseExploration: Record<string, PhysicalExplorationValue> = {}
): Partial<PanamaCertificate> {
  const normalExploration: Record<string, PhysicalExplorationValue> = {
    ...baseExploration,
  };
  [...EXPLORATION_COL_1, ...EXPLORATION_COL_2].forEach((item) => {
    normalExploration[item.key] = "N";
  });

  return {
    physical_exploration: normalExploration,
    physical_exploration_comments: "",
    sight_color_vision: "Normal",
    sight_fields_right_normal: "Normal",
    sight_fields_right_defective: "",
    sight_fields_left_normal: "Normal",
    sight_fields_left_defective: "",
  };
}

/**
 * Visibly boxed input used inside the Sight (acuity + visual fields) and
 * Hearing table cells, so each value reads as a distinct input field (a
 * bordered, rounded box inset in the cell).
 */
const BOXED_CELL_INPUT_CLASS = cn(
  "h-7 w-full min-w-0 bg-white text-xs border border-primary/20 rounded-md px-2",
  "focus:outline-none focus-visible:border-primary dark:bg-input/30"
);

/**
 * A single labelled cell in the Clinical Data bordered table.
 *
 * Renders the field label inline on the left and a borderless input on the
 * right so the surrounding table borders define the grid (matching the
 * official certificate layout). Border classes between cells are supplied by
 * the caller via `className`.
 */
function ClinicalCell({
  label,
  field,
  value,
  onUpdate,
  disabled,
  className,
}: {
  label: string;
  field: keyof PanamaCertificate;
  value: string;
  onUpdate: (field: keyof PanamaCertificate, value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 px-3 py-2", className)}>
      <span className="shrink-0 text-sm font-bold text-foreground">{label}</span>
      <Input
        aria-label={label}
        value={value}
        onChange={(event) => onUpdate(field, event.target.value)}
        className={cn(
          "h-8 min-w-0 flex-1 bg-white text-sm border border-primary/20 rounded-md px-2",
          "focus:outline-none focus-visible:border-primary dark:bg-input/30",
          disabled && "pointer-events-none"
        )}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
      />
    </div>
  );
}

/**
 * Panama Medical Certificate — Medical Examination section (Section IV).
 *
 * Contains four sub-sections:
 * - i. Clinical Data (vitals and measurements)
 * - ii. Sight (visual acuity, visual fields, color vision)
 * - iii. Hearing (tonal audiometric at multiple frequencies)
 * - iv. Physical Exploration (body systems Normal/Abnormal grid)
 *
 * `clinicalDataOnly` — when true, renders only the section header and
 * sub-section i (Clinical Data). Used when this section is embedded
 * alongside another section in the same tab.
 *
 * `skipClinicalData` — when true, skips sub-section i and renders only
 * ii (Sight), iii (Hearing), and iv (Physical Exploration). Used on the
 * following tab after Clinical Data has already been shown.
 */
export default function MedicalExaminationSection({ data, onChange, disabled, clinicalDataOnly, skipClinicalData }: PanamaSectionProps & { clinicalDataOnly?: boolean; skipClinicalData?: boolean }) {
  const update = createFieldUpdater(data, onChange);

  const updateExploration = (key: string, value: PhysicalExplorationValue) => {
    const updated = { ...data.physical_exploration, [key]: value };
    onChange({ ...data, physical_exploration: updated });
  };

  /**
   * Render the three cells (label, Normal checkbox, Abnormal checkbox) for one
   * physical-exploration item. When `item` is undefined (the right group has
   * fewer rows than the left), render empty bordered cells so the grid stays
   * aligned.
   */
  const renderExplorationCells = (item: ExplorationItem | undefined) => {
    if (!item) {
      return (
        <>
          <td className="border border-primary/30 p-1.5" />
          <td className="border border-primary/30 p-1.5" />
          <td className="border border-primary/30 p-1.5" />
        </>
      );
    }
    const currentValue = (data.physical_exploration[item.key] || "") as PhysicalExplorationValue;
    const toggle = (answer: PhysicalExplorationValue) =>
      updateExploration(item.key, currentValue === answer ? "" : answer);
    return (
      <>
        <td className="border border-primary/30 p-1.5 text-sm text-foreground">
          {item.label}
        </td>
        {(["N", "A"] as const).map((answer) => (
          <td key={answer} className="border border-primary/30 p-1.5 text-center">
            <input
              type="checkbox"
              name={`panama_pe_${item.key}`}
              checked={currentValue === answer}
              onChange={() => toggle(answer)}
              className={cn("h-4 w-4 rounded accent-primary", disabled && "pointer-events-none")}
              aria-label={`${item.label} - ${answer === "N" ? "Normal" : "Abnormal"}`}
              tabIndex={disabled ? -1 : undefined}
            />
          </td>
        ))}
      </>
    );
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="IV. MEDICAL EXAMINATION"
        icon={Stethoscope}
        titleStyle={{ textTransform: "none" }}
        banner
      />

      {/* ===== i. Clinical Data ===== */}
      {!skipClinicalData && (<div className="mb-6">
        <h3 className="text-sm font-bold text-primary italic uppercase tracking-wide mb-2">
          <span className="lowercase">i.</span> Clinical Data
        </h3>

        {/* Bordered table: labelled cells, two per row (BMI and SpO2 span
            the full width) to match the official certificate layout. */}
        <div className="overflow-hidden rounded-md border border-primary/30">
          {/* Row 1: Height | Weight */}
          <div className="grid grid-cols-1 border-b border-primary/30 sm:grid-cols-2">
            <ClinicalCell
              label="Height (m/cm):"
              field="height_cm"
              value={data.height_cm}
              onUpdate={update}
              disabled={disabled}
              className="border-b border-primary/30 sm:border-b-0 sm:border-r"
            />
            <ClinicalCell
              label="Weight (Kg):"
              field="weight_kg"
              value={data.weight_kg}
              onUpdate={update}
              disabled={disabled}
            />
          </div>

          {/* Row 2: BMI (full width) */}
          <div className="border-b border-primary/30">
            <ClinicalCell
              label="Body Mass Index (BMI):"
              field="bmi"
              value={data.bmi}
              onUpdate={update}
              disabled={disabled}
            />
          </div>

          {/* Row 3: SpO2 (full width) */}
          <div className="border-b border-primary/30">
            <ClinicalCell
              label="Oxygen Saturation (SpO2):"
              field="oxygen_saturation"
              value={data.oxygen_saturation}
              onUpdate={update}
              disabled={disabled}
            />
          </div>

          {/* Row 4: Heart Rate | Respiratory Rate */}
          <div className="grid grid-cols-1 border-b border-primary/30 sm:grid-cols-2">
            <ClinicalCell
              label="Heart Rate (minute):"
              field="heart_rate"
              value={data.heart_rate}
              onUpdate={update}
              disabled={disabled}
              className="border-b border-primary/30 sm:border-b-0 sm:border-r"
            />
            <ClinicalCell
              label="Respiratory Rate (minute):"
              field="respiratory_rate"
              value={data.respiratory_rate}
              onUpdate={update}
              disabled={disabled}
            />
          </div>

          {/* Row 5: Systolic | Diastolic */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <ClinicalCell
              label="Systolic Blood Pressure (mm Hg):"
              field="blood_pressure_systolic"
              value={data.blood_pressure_systolic}
              onUpdate={update}
              disabled={disabled}
              className="border-b border-primary/30 sm:border-b-0 sm:border-r"
            />
            <ClinicalCell
              label="Diastolic (mm/Hg):"
              field="blood_pressure_diastolic"
              value={data.blood_pressure_diastolic}
              onUpdate={update}
              disabled={disabled}
            />
          </div>
        </div>
      </div>)}

      {/* ===== ii. Sight ===== */}
      {!clinicalDataOnly && (<div className="mb-6 border-t border-primary/10 pt-4">
        <h3 className="text-sm font-bold text-primary italic uppercase tracking-wide mb-2">
          <span className="lowercase">ii.</span> Sight
        </h3>

        {/* Glasses/contact question — sentence-case label on its own line,
            matching the official certificate wording. */}
        <div className="mb-3 space-y-1">
          <label
            htmlFor="panama-sight-glasses"
            className="block text-sm text-foreground"
          >
            Use of glasses or contact lenses: Yes/No (if yes, specify which type and for what purpose)
          </label>
          <Input
            id="panama-sight-glasses"
            value={data.sight_glasses_contact}
            onChange={(event) => update("sight_glasses_contact", event.target.value)}
            className={cn(
              "h-8 w-full bg-white text-sm border border-primary/20 rounded-md px-2",
              "focus:outline-none focus-visible:border-primary dark:bg-input/30",
              disabled && "pointer-events-none"
            )}
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
          />
        </div>

        {/* Visual Acuity + Visual Fields (side by side) */}
        <div className="mb-3 flex flex-col items-start gap-4 lg:flex-row">
        {/* Visual Acuity Table */}
        <div className="min-w-0 max-w-full overflow-x-auto">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-primary/30 bg-primary/12 p-1.5 text-left" rowSpan={3} />
                <th className="border border-primary/30 bg-primary/12 p-1.5 text-center text-xs font-bold text-primary" colSpan={6}>
                  Visual acuity
                </th>
              </tr>
              <tr>
                <th className="border border-primary/30 bg-primary/12 p-1.5 text-center text-xs font-bold text-primary" colSpan={3}>
                  Unaided
                </th>
                <th className="border border-primary/30 bg-primary/12 p-1.5 text-center text-xs font-bold text-primary" colSpan={3}>
                  Aided
                </th>
              </tr>
              <tr>
                {["Right eye", "Left eye", "Binocular", "Right eye", "Left eye", "Binocular"].map(
                  (head, idx) => (
                    <th
                      key={`${head}-${idx}`}
                      className="border border-primary/30 bg-primary/5 p-1 text-center text-xs text-foreground/80"
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  {
                    label: "Distant",
                    cells: [
                      "sight_unaided_distant_right",
                      "sight_unaided_distant_left",
                      "sight_unaided_distant_binocular",
                      "sight_aided_distant_right",
                      "sight_aided_distant_left",
                      "sight_aided_distant_binocular",
                    ] as const,
                  },
                  {
                    label: "Short distance",
                    cells: [
                      "sight_unaided_short_right",
                      "sight_unaided_short_left",
                      "sight_unaided_short_binocular",
                      "sight_aided_short_right",
                      "sight_aided_short_left",
                      "sight_aided_short_binocular",
                    ] as const,
                  },
                ]
              ).map(({ label, cells }) => (
                <tr key={label}>
                  <td className="border border-primary/30 p-1.5 text-sm font-bold text-foreground/80 whitespace-nowrap">
                    {label}
                  </td>
                  {cells.map((field) => (
                    <td key={field} className="w-24 border border-primary/30 p-1">
                      <Input
                        value={data[field]}
                        onChange={(e) => update(field, e.target.value)}
                        className={cn(BOXED_CELL_INPUT_CLASS, disabled && "pointer-events-none")}
                        aria-label={`${label} - ${field}`}
                        readOnly={disabled}
                      />
                    </td>
                  ))}
                </tr>
              ))}

              {/* Color vision — final full-width row of the acuity table: the
                  "Color vision" label in the leftmost column, the four options
                  spread across the six data columns (two columns each). */}
              <tr>
                <td className="border border-primary/30 p-1.5 text-sm font-bold text-foreground/80 whitespace-nowrap">
                  Color vision
                </td>
                {["Not tested", "Normal", "Doubtful", "Defective"].map((opt) => (
                  <td
                    key={opt}
                    colSpan={opt === "Defective" ? 3 : 1}
                    className="border border-primary/30 p-1.5"
                  >
                    <label
                      className={cn(
                        "flex items-center gap-2",
                        disabled && "pointer-events-none"
                      )}
                    >
                      <input
                        type="checkbox"
                        name="panama_color_vision"
                        checked={data.sight_color_vision === opt}
                        onChange={() =>
                          update(
                            "sight_color_vision",
                            data.sight_color_vision === opt ? "" : opt
                          )
                        }
                        className="h-4 w-4 rounded accent-primary"
                        aria-label={`Color vision - ${opt}`}
                        tabIndex={disabled ? -1 : undefined}
                      />
                      <span className="text-sm text-foreground whitespace-nowrap">{opt}</span>
                    </label>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual Fields Table */}
        <div className="shrink-0 overflow-x-auto">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-primary/30 bg-primary/12 p-1.5" rowSpan={2} />
                <th className="border border-primary/30 bg-primary/12 p-1.5 text-center text-xs font-bold uppercase tracking-wider text-primary" colSpan={2}>
                  Visual fields
                </th>
              </tr>
              <tr>
                <th className="border border-primary/30 bg-primary/5 p-1 text-center text-xs text-foreground/80">Normal</th>
                <th className="border border-primary/30 bg-primary/5 p-1 text-center text-xs text-foreground/80">Defective</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  {
                    label: "Right eye",
                    normalKey: "sight_fields_right_normal" as const,
                    defectiveKey: "sight_fields_right_defective" as const,
                  },
                  {
                    label: "Left eye",
                    normalKey: "sight_fields_left_normal" as const,
                    defectiveKey: "sight_fields_left_defective" as const,
                  },
                ]
              ).map(({ label, normalKey, defectiveKey }) => (
                <tr key={label}>
                  <td className="border border-primary/30 p-1.5 text-sm font-bold text-foreground/80 whitespace-nowrap">
                    {label}
                  </td>
                  <td className="w-28 border border-primary/30 p-1">
                    <Input
                      value={data[normalKey]}
                      onChange={(e) => update(normalKey, e.target.value)}
                      className={cn(BOXED_CELL_INPUT_CLASS, disabled && "pointer-events-none")}
                      aria-label={`${label} visual field - Normal`}
                      readOnly={disabled}
                    />
                  </td>
                  <td className="w-28 border border-primary/30 p-1">
                    <Input
                      value={data[defectiveKey]}
                      onChange={(e) => update(defectiveKey, e.target.value)}
                      className={cn(BOXED_CELL_INPUT_CLASS, disabled && "pointer-events-none")}
                      aria-label={`${label} visual field - Defective`}
                      readOnly={disabled}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        {/* Color vision method — directly under the acuity table, matching the
            official certificate (the Color vision selection itself is the last
            row of the acuity table above). */}
        <div className="mt-3 space-y-1">
          <label
            htmlFor="panama-sight-color-method"
            className="block text-sm font-bold text-foreground"
          >
            Method: (Plates) Pseudo-Isochromatic (Ishihara 24 or 38 plates equivalent):
          </label>
          <Input
            id="panama-sight-color-method"
            value={data.sight_color_method}
            onChange={(event) => update("sight_color_method", event.target.value)}
            className={cn(
              "h-8 w-full bg-white text-sm border border-primary/20 rounded-md px-2",
              "focus:outline-none focus-visible:border-primary dark:bg-input/30",
              disabled && "pointer-events-none"
            )}
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
          />
        </div>
      </div>)}

      {/* ===== iii. Hearing (Tonal Audiometric) ===== */}
      {!clinicalDataOnly && (<div className="mb-6 border-t border-primary/10 pt-4">
        <h3 className="text-sm font-bold text-primary italic uppercase tracking-wide mb-2">
          <span className="lowercase">iii.</span> Hearing: (Tonal Audiometric)
        </h3>

        <div className="overflow-x-auto">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-primary/30 p-1.5" />
                <th className="border border-primary/30 bg-primary/12 p-1.5 text-center text-xs font-bold text-primary" colSpan={6}>
                  Pure tone and audio metry (threshold values in dB)
                </th>
              </tr>
              <tr>
                <th className="border border-primary/30 p-1.5" />
                {HEARING_FREQUENCIES.map((freq) => {
                  // 4000 and 6000 Hz column headers are intentionally blank.
                  const hiddenLabels = ["4000", "6000"];
                  return (
                    <th key={freq} className="w-24 border border-primary/30 bg-primary/5 p-1 text-center text-xs font-bold text-foreground/80">
                      {hiddenLabels.includes(freq) ? "" : formatFrequencyLabel(freq)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {/* Right ear */}
              <tr>
                <td className="border border-primary/30 p-1.5 text-sm font-bold text-foreground/80 whitespace-nowrap">Right ear</td>
                {HEARING_FREQUENCIES.map((freq) => {
                  const field = `hearing_right_${freq}` as keyof PanamaCertificate;
                  return (
                    <td key={freq} className="w-24 border border-primary/30 p-1">
                      <Input
                        value={(data[field] as string) ?? ""}
                        onChange={(e) => update(field, e.target.value)}
                        className={cn(BOXED_CELL_INPUT_CLASS, disabled && "pointer-events-none")}
                        aria-label={`Right ear - ${freq} Hz`}
                        readOnly={disabled}
                      />
                    </td>
                  );
                })}
              </tr>
              {/* Left ear */}
              <tr>
                <td className="border border-primary/30 p-1.5 text-sm font-bold text-foreground/80 whitespace-nowrap">Left ear</td>
                {HEARING_FREQUENCIES.map((freq) => {
                  const field = `hearing_left_${freq}` as keyof PanamaCertificate;
                  return (
                    <td key={freq} className="w-24 border border-primary/30 p-1">
                      <Input
                        value={(data[field] as string) ?? ""}
                        onChange={(e) => update(field, e.target.value)}
                        className={cn(BOXED_CELL_INPUT_CLASS, disabled && "pointer-events-none")}
                        aria-label={`Left ear - ${freq} Hz`}
                        readOnly={disabled}
                      />
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>)}

      {/* ===== iv. Physical Exploration ===== */}
      {!clinicalDataOnly && (<div className="border-t border-primary/10 pt-4">
        <h3 className="text-sm font-bold text-primary italic uppercase tracking-wide mb-2">
          <span className="lowercase">iv.</span> Physical Exploration
        </h3>

        {/* Bordered two-group table: each row pairs a left-group item and a
            right-group item, each with Normal/Abnormal checkbox columns. */}
        <div className="mb-3 overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-xs">
            <colgroup>
              {/* Two mirrored groups so both halves are exactly equal width:
                  label (fills) | Normal (fixed) | Abnormal (fixed). */}
              <col />
              <col className="w-20" />
              <col className="w-20" />
              <col />
              <col className="w-20" />
              <col className="w-20" />
            </colgroup>
            <thead>
              <tr>
                <th className="border border-primary/30 bg-primary/5 p-1.5" />
                <th className="w-20 border border-primary/30 bg-primary/5 p-1 text-center text-xs font-bold text-foreground/80">
                  Normal
                </th>
                <th className="w-20 border border-primary/30 bg-primary/5 p-1 text-center text-xs font-bold text-foreground/80">
                  Abnormal
                </th>
                <th className="border border-primary/30 bg-primary/5 p-1.5" />
                <th className="w-20 border border-primary/30 bg-primary/5 p-1 text-center text-xs font-bold text-foreground/80">
                  Normal
                </th>
                <th className="w-20 border border-primary/30 bg-primary/5 p-1 text-center text-xs font-bold text-foreground/80">
                  Abnormal
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({
                length: Math.max(EXPLORATION_COL_1.length, EXPLORATION_COL_2.length),
              }).map((_, rowIndex) => {
                const left = EXPLORATION_COL_1[rowIndex];
                const right = EXPLORATION_COL_2[rowIndex];
                return (
                  <tr key={rowIndex}>
                    {renderExplorationCells(left)}
                    {renderExplorationCells(right)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Additional comments */}
        <div className="space-y-1">
          <Label className="text-sm font-bold text-foreground/80 uppercase tracking-wider">
            Additional clinical examination comments
          </Label>
          <Textarea
            value={data.physical_exploration_comments}
            onChange={(e) => update("physical_exploration_comments", e.target.value)}
            className={cn(
              "h-20 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none",
              disabled && "pointer-events-none"
            )}
            placeholder=""
            readOnly={disabled}
          />
        </div>
      </div>)}
    </div>
  );
}
