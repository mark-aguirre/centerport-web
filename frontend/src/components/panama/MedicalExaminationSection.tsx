"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope } from "lucide-react";
import type { PanamaSectionProps, PanamaCertificate, PhysicalExplorationValue } from "./types";

/** Physical exploration items — Column 1 */
const EXPLORATION_COL_1 = [
  "Head",
  "Mouth, Nose, Throat",
  "Dental Exam",
  "Ears (general)",
  "Tympanic Membrane",
  "Eyes",
  "Pupils",
  "Ophthalmoscopy",
  "Eye movement",
  "Lungs and Chest",
  "Breast examination",
  "Heart",
];

/** Physical exploration items — Column 2 */
const EXPLORATION_COL_2 = [
  "Skin",
  "Varicose veins",
  "Vascular (inc. Pedal)",
  "Abdomen and viscera",
  "Hernias",
  "Anus (not rectal exam)",
  "G-U system",
  "Upper and lower",
  "Spine (Cervical, Thoracic and Lumbar)",
  "Neurologic (full brief)",
  "Psychiatric",
  "General appearance",
];

/** Hearing frequency columns */
const HEARING_FREQUENCIES = ["500", "1000", "2000", "3000", "4000", "6000", "8000"];

/**
 * NRA (Normal/Abnormal) radio group for physical exploration rows.
 */
function NRARadio({
  name,
  value,
  onChange,
  ariaLabel,
}: {
  name: string;
  value: PhysicalExplorationValue;
  onChange: (v: PhysicalExplorationValue) => void;
  ariaLabel: string;
}) {
  return (
    <div className="flex items-center gap-3 shrink-0" role="radiogroup" aria-label={ariaLabel}>
      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="radio"
          name={name}
          checked={value === "N"}
          onChange={() => onChange("N")}
          className="w-4 h-4 accent-primary"
          aria-label={`${ariaLabel} - Normal`}
        />
        <span className="text-xs text-foreground/80">N</span>
      </label>
      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="radio"
          name={name}
          checked={value === "A"}
          onChange={() => onChange("A")}
          className="w-4 h-4 accent-primary"
          aria-label={`${ariaLabel} - Abnormal`}
        />
        <span className="text-xs text-foreground/80">A</span>
      </label>
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
 */
export default function MedicalExaminationSection({ data, onChange }: PanamaSectionProps) {
  const update = (field: keyof PanamaCertificate, value: string) =>
    onChange({ ...data, [field]: value });

  const updateExploration = (item: string, value: PhysicalExplorationValue) => {
    const updated = { ...data.physical_exploration, [item]: value };
    onChange({ ...data, physical_exploration: updated });
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="Medical Examination"
        icon={Stethoscope}
      />

      {/* ===== i. Clinical Data ===== */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-primary italic uppercase tracking-wide mb-2">
          i. Clinical Data
        </h3>

        <div className="space-y-2">
          {/* Row 1: Height, Weight */}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              label="Height (cm)"
              value={data.height_cm}
              onChange={(v) => update("height_cm", v)}
            />
            <FormField
              label="Weight (Kg)"
              value={data.weight_kg}
              onChange={(v) => update("weight_kg", v)}
            />
          </div>

          {/* Row 2: BMI */}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              label="Body Mass Index (BMI)"
              value={data.bmi}
              onChange={(v) => update("bmi", v)}
            />
            <div />
          </div>

          {/* Row 3: SpO2 */}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              label="Oxygen Saturation (SpO2)"
              value={data.oxygen_saturation}
              onChange={(v) => update("oxygen_saturation", v)}
            />
            <div />
          </div>

          {/* Row 4: Heart rate, Respiratory rate */}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              label="Heart rate (minute)"
              value={data.heart_rate}
              onChange={(v) => update("heart_rate", v)}
            />
            <FormField
              label="Respiratory Rate (minute)"
              value={data.respiratory_rate}
              onChange={(v) => update("respiratory_rate", v)}
            />
          </div>

          {/* Row 5: Blood Pressure */}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              label="Blood pressure Systolic (mmHg)"
              value={data.blood_pressure_systolic}
              onChange={(v) => update("blood_pressure_systolic", v)}
            />
            <FormField
              label="Diastolic (mmHg)"
              value={data.blood_pressure_diastolic}
              onChange={(v) => update("blood_pressure_diastolic", v)}
            />
          </div>
        </div>
      </div>

      {/* ===== ii. Sight ===== */}
      <div className="mb-6 border-t border-primary/10 pt-4">
        <h3 className="text-xs font-bold text-primary italic uppercase tracking-wide mb-2">
          ii. Sight
        </h3>

        {/* Glasses/contact question */}
        <div className="mb-3">
          <FormField
            label="Use of glasses or contact lenses: Yes/No (if yes, specify which type and for what purpose)"
            value={data.sight_glasses_contact}
            onChange={(v) => update("sight_glasses_contact", v)}
          />
        </div>

        {/* Visual Acuity Table */}
        <div className="overflow-x-auto mb-3">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-primary/20 bg-primary/5 p-1.5 text-left" rowSpan={3} />
                <th className="border border-primary/20 bg-primary/5 p-1.5 text-center text-[11px] font-bold text-primary uppercase tracking-wider" colSpan={5}>
                  Visual acuity
                </th>
                <th className="border border-primary/20 bg-primary/5 p-1.5 text-center text-[11px] font-bold text-primary uppercase tracking-wider" colSpan={2}>
                  Visual fields
                </th>
              </tr>
              <tr>
                <th className="border border-primary/20 bg-primary/5 p-1.5 text-center text-[11px] font-bold text-primary/70" colSpan={3}>
                  Unaided
                </th>
                <th className="border border-primary/20 bg-primary/5 p-1.5 text-center text-[11px] font-bold text-primary/70" colSpan={2}>
                  Aided
                </th>
                <th className="border border-primary/20 bg-primary/5 p-1.5 text-center text-[11px] text-primary/70" rowSpan={2}>
                  Normal
                </th>
                <th className="border border-primary/20 bg-primary/5 p-1.5 text-center text-[11px] text-primary/70" rowSpan={2}>
                  Defective
                </th>
              </tr>
              <tr>
                <th className="border border-primary/20 bg-primary/5 p-1 text-center text-[11px] text-primary/70">Right Eye</th>
                <th className="border border-primary/20 bg-primary/5 p-1 text-center text-[11px] text-primary/70">Left Eye</th>
                <th className="border border-primary/20 bg-primary/5 p-1 text-center text-[11px] text-primary/70">Binocular</th>
                <th className="border border-primary/20 bg-primary/5 p-1 text-center text-[11px] text-primary/70">Right Eye</th>
                <th className="border border-primary/20 bg-primary/5 p-1 text-center text-[11px] text-primary/70">Left Eye</th>
              </tr>
            </thead>
            <tbody>
              {/* Distant row */}
              <tr>
                <td className="border border-primary/20 p-1.5 text-xs font-semibold text-foreground/80">Distant</td>
                <td className="border border-primary/20 p-1">
                  <Input
                    value={data.sight_unaided_distant_right}
                    onChange={(e) => update("sight_unaided_distant_right", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label="Distant - Unaided Right Eye"
                  />
                </td>
                <td className="border border-primary/20 p-1">
                  <Input
                    value={data.sight_unaided_distant_left}
                    onChange={(e) => update("sight_unaided_distant_left", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label="Distant - Unaided Left Eye"
                  />
                </td>
                <td className="border border-primary/20 p-1">
                  <Input
                    value={data.sight_unaided_distant_binocular}
                    onChange={(e) => update("sight_unaided_distant_binocular", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label="Distant - Unaided Binocular"
                  />
                </td>
                <td className="border border-primary/20 p-1">
                  <Input
                    value={data.sight_aided_distant_right}
                    onChange={(e) => update("sight_aided_distant_right", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label="Distant - Aided Right Eye"
                  />
                </td>
                <td className="border border-primary/20 p-1">
                  <Input
                    value={data.sight_aided_distant_left}
                    onChange={(e) => update("sight_aided_distant_left", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label="Distant - Aided Left Eye"
                  />
                </td>
                <td className="border border-primary/20 p-1 text-center text-xs text-foreground/70">Right Eye</td>
                <td className="border border-primary/20 p-1">
                  <Input
                    value={data.sight_fields_right}
                    onChange={(e) => update("sight_fields_right", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label="Visual Fields - Right Eye"
                  />
                </td>
              </tr>
              {/* Short distance row */}
              <tr>
                <td className="border border-primary/20 p-1.5 text-xs font-semibold text-foreground/80">Short distance</td>
                <td className="border border-primary/20 p-1">
                  <Input
                    value={data.sight_unaided_short_right}
                    onChange={(e) => update("sight_unaided_short_right", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label="Short distance - Unaided Right Eye"
                  />
                </td>
                <td className="border border-primary/20 p-1">
                  <Input
                    value={data.sight_unaided_short_left}
                    onChange={(e) => update("sight_unaided_short_left", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label="Short distance - Unaided Left Eye"
                  />
                </td>
                <td className="border border-primary/20 p-1" />
                <td className="border border-primary/20 p-1">
                  <Input
                    value={data.sight_aided_short_right}
                    onChange={(e) => update("sight_aided_short_right", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label="Short distance - Aided Right Eye"
                  />
                </td>
                <td className="border border-primary/20 p-1">
                  <Input
                    value={data.sight_aided_short_left}
                    onChange={(e) => update("sight_aided_short_left", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label="Short distance - Aided Left Eye"
                  />
                </td>
                <td className="border border-primary/20 p-1 text-center text-xs text-foreground/70">Left Eye</td>
                <td className="border border-primary/20 p-1">
                  <Input
                    value={data.sight_fields_left}
                    onChange={(e) => update("sight_fields_left", e.target.value)}
                    className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30"
                    aria-label="Visual Fields - Left Eye"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Color Vision */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-0.5">
            <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
              Color vision
            </Label>
            <div className="flex items-center gap-4 h-8" role="radiogroup" aria-label="Color vision">
              {["Not tested", "Normal", "Doubtful", "Defective"].map((opt) => (
                <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="panama_color_vision"
                    checked={data.sight_color_vision === opt}
                    onChange={() => update("sight_color_vision", opt)}
                    className="w-4 h-4 accent-primary"
                    aria-label={`Color vision - ${opt}`}
                  />
                  <span className="text-xs text-foreground/80">{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <FormField
            label="Method: (Plates) Pseudo-Isochromatic Ishihara 24 or 38 plates equivalent"
            value={data.sight_color_method}
            onChange={(v) => update("sight_color_method", v)}
          />
        </div>
      </div>

      {/* ===== iii. Hearing (Tonal Audiometric) ===== */}
      <div className="mb-6 border-t border-primary/10 pt-4">
        <h3 className="text-xs font-bold text-primary italic uppercase tracking-wide mb-2">
          iii. Hearing: (Tonal Audiometric)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-primary/20 bg-primary/5 p-1.5" />
                <th className="border border-primary/20 bg-primary/5 p-1.5 text-center text-[11px] font-bold text-primary uppercase" colSpan={7}>
                  Pure tone and audio metry (threshold values in dB)
                </th>
              </tr>
              <tr>
                <th className="border border-primary/20 bg-primary/5 p-1.5" />
                {HEARING_FREQUENCIES.map((freq) => (
                  <th key={freq} className="border border-primary/20 bg-primary/5 p-1 text-center text-[11px] text-primary/70">
                    {freq} Hz
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Right ear */}
              <tr>
                <td className="border border-primary/20 p-1.5 text-xs font-semibold text-foreground/80">Right ear</td>
                {HEARING_FREQUENCIES.map((freq) => {
                  const field = `hearing_right_${freq}` as keyof PanamaCertificate;
                  return (
                    <td key={freq} className="border border-primary/20 p-1">
                      <Input
                        value={(data[field] as string) ?? ""}
                        onChange={(e) => update(field, e.target.value)}
                        className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30 w-full"
                      />
                    </td>
                  );
                })}
              </tr>
              {/* Left ear */}
              <tr>
                <td className="border border-primary/20 p-1.5 text-xs font-semibold text-foreground/80">Left ear</td>
                {HEARING_FREQUENCIES.map((freq) => {
                  const field = `hearing_left_${freq}` as keyof PanamaCertificate;
                  return (
                    <td key={freq} className="border border-primary/20 p-1">
                      <Input
                        value={(data[field] as string) ?? ""}
                        onChange={(e) => update(field, e.target.value)}
                        className="h-7 text-xs bg-white border-primary/20 dark:bg-input/30 w-full"
                      />
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== iv. Physical Exploration ===== */}
      <div className="border-t border-primary/10 pt-4">
        <h3 className="text-xs font-bold text-primary italic uppercase tracking-wide mb-2">
          iv. Physical Exploration
        </h3>

        {/* Column headers */}
        <div className="grid grid-cols-2 gap-4 mb-1">
          <div className="grid grid-cols-[2fr_1fr] items-center">
            <span />
            <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider text-center">
              Normal/Abnormal
            </span>
          </div>
          <div className="grid grid-cols-[2fr_1fr] items-center">
            <span />
            <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider text-center">
              Normal/Abnormal
            </span>
          </div>
        </div>

        {/* Body system rows — 2 columns */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            {EXPLORATION_COL_1.map((item, index) => {
              const currentValue = (data.physical_exploration[item] || "") as PhysicalExplorationValue;
              return (
                <div key={item} className={`grid grid-cols-[2fr_1fr] items-center py-1.5 border-b border-muted/30 px-1 rounded-sm ${index % 2 === 0 ? "bg-muted/30" : ""}`}>
                  <span className="text-xs text-foreground/80">{item}</span>
                  <div className="flex justify-center">
                    <NRARadio
                      name={`panama_pe_${item.replace(/[^a-zA-Z]/g, "_")}`}
                      value={currentValue}
                      onChange={(v) => updateExploration(item, v)}
                      ariaLabel={item}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            {EXPLORATION_COL_2.map((item, index) => {
              const currentValue = (data.physical_exploration[item] || "") as PhysicalExplorationValue;
              return (
                <div key={item} className={`grid grid-cols-[2fr_1fr] items-center py-1.5 border-b border-muted/30 px-1 rounded-sm ${index % 2 === 0 ? "bg-muted/30" : ""}`}>
                  <span className="text-xs text-foreground/80">{item}</span>
                  <div className="flex justify-center">
                    <NRARadio
                      name={`panama_pe_${item.replace(/[^a-zA-Z]/g, "_")}`}
                      value={currentValue}
                      onChange={(v) => updateExploration(item, v)}
                      ariaLabel={item}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional comments */}
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Additional clinical examination comments
          </Label>
          <Textarea
            value={data.physical_exploration_comments}
            onChange={(e) => update("physical_exploration_comments", e.target.value)}
            className="h-20 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
}
