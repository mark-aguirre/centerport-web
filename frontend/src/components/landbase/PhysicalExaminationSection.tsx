"use client";

import { FormSelect } from "@/components/common/form-select";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  LandbasePeme,
  LandbaseSectionProps,
  PhysicalExplorationValue,
  YesNo,
} from "./types";

interface ChoiceOption {
  label: string;
  value: string;
}

interface ChoiceGroupProps {
  name: string;
  value: string;
  options: readonly ChoiceOption[];
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const YES_NO_OPTIONS: readonly ChoiceOption[] = [
  { label: "YES", value: "yes" },
  { label: "NO", value: "no" },
];

const ADEQUACY_OPTIONS: readonly ChoiceOption[] = [
  { label: "Adequate", value: "adequate" },
  { label: "Inadequate", value: "inadequate" },
];

const VISUAL_AID_OPTIONS: readonly ChoiceOption[] = [
  { label: "Glasses", value: "glasses" },
  { label: "Contact Lens", value: "contact_lens" },
];

function ChoiceGroup({
  name,
  value,
  options,
  ariaLabel,
  className,
  disabled,
  onChange,
}: ChoiceGroupProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-3", className)}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex items-center gap-1.5",
            disabled ? "pointer-events-none" : "cursor-pointer",
          )}
        >
          <input
            type="radio"
            name={name}
            checked={value === option.value}
            onChange={() => {
              if (!disabled) {
                onChange(option.value);
              }
            }}
            tabIndex={disabled ? -1 : undefined}
            className="h-4 w-4 accent-primary"
            aria-label={`${ariaLabel} - ${option.label}`}
            aria-disabled={disabled}
          />
          <span className="text-xs text-foreground/80">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

interface CompactInputProps {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function CompactInput({
  label,
  value,
  disabled,
  onChange,
}: CompactInputProps) {
  return (
    <label className="grid grid-cols-[auto_minmax(52px,1fr)] items-center gap-1.5">
      <span className="text-[11px] font-semibold text-foreground/80">{label}</span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={cn(
          "h-7 min-w-0 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30",
          disabled && "pointer-events-none",
        )}
        aria-label={label}
      />
    </label>
  );
}

interface AcuityPairProps {
  firstLabel: string;
  firstValue: string;
  secondLabel: string;
  secondValue: string;
  disabled?: boolean;
  onFirstChange: (value: string) => void;
  onSecondChange: (value: string) => void;
}

function AcuityPair({
  firstLabel,
  firstValue,
  secondLabel,
  secondValue,
  disabled,
  onFirstChange,
  onSecondChange,
}: AcuityPairProps) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1">
      <span className="whitespace-nowrap text-[11px] font-semibold text-foreground/80">
        {firstLabel}
      </span>
      <Input
        value={firstValue}
        onChange={(event) => onFirstChange(event.target.value)}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={cn(
          "h-7 min-w-0 border border-primary/20 bg-white px-1.5 text-xs dark:bg-input/30",
          disabled && "pointer-events-none",
        )}
        aria-label={firstLabel}
      />
      <span className="whitespace-nowrap text-[11px] font-semibold text-foreground/80">
        {secondLabel}
      </span>
      <Input
        value={secondValue}
        onChange={(event) => onSecondChange(event.target.value)}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={cn(
          "h-7 min-w-0 border border-primary/20 bg-white px-1.5 text-xs dark:bg-input/30",
          disabled && "pointer-events-none",
        )}
        aria-label={secondLabel}
      />
    </div>
  );
}

type ExplorationStatusKey = {
  [K in keyof LandbasePeme]-?: LandbasePeme[K] extends PhysicalExplorationValue
    ? K
    : never;
}[keyof LandbasePeme];

type ExplorationFindingsKey = {
  [K in keyof LandbasePeme]-?: K extends `${string}_findings` ? K : never;
}[keyof LandbasePeme];

interface FindingDefinition {
  label: string;
  statusKey: ExplorationStatusKey;
  findingsKey: ExplorationFindingsKey;
}

interface FindingColumn {
  heading: "A" | "B" | "C";
  items: readonly FindingDefinition[];
}

const FINDING_COLUMNS: readonly FindingColumn[] = [
  {
    heading: "A",
    items: [
      { label: "Skin", statusKey: "pe_skin", findingsKey: "pe_skin_findings" },
      { label: "Head, Scalp", statusKey: "pe_head_scalp", findingsKey: "pe_head_scalp_findings" },
      { label: "Eyes External", statusKey: "pe_eyes_external", findingsKey: "pe_eyes_external_findings" },
      { label: "Pupils", statusKey: "pe_pupils", findingsKey: "pe_pupils_findings" },
      { label: "Ears", statusKey: "pe_ears", findingsKey: "pe_ears_findings" },
      { label: "Nose, Sinuses", statusKey: "pe_nose_sinuses", findingsKey: "pe_nose_sinuses_findings" },
      { label: "Mouth, Throat", statusKey: "pe_mouth_throat", findingsKey: "pe_mouth_throat_findings" },
    ],
  },
  {
    heading: "B",
    items: [
      { label: "Neck, Lymph Node, Thyroid", statusKey: "pe_neck_lymph_nodes", findingsKey: "pe_neck_lymph_nodes_findings" },
      { label: "Breast, Axilla", statusKey: "pe_breast_axilla", findingsKey: "pe_breast_axilla_findings" },
      { label: "Chest and Lungs", statusKey: "pe_chest_lungs", findingsKey: "pe_chest_lungs_findings" },
      { label: "Heart", statusKey: "pe_heart", findingsKey: "pe_heart_findings" },
      { label: "Abdomen", statusKey: "pe_abdomen", findingsKey: "pe_abdomen_findings" },
      { label: "Back", statusKey: "pe_back", findingsKey: "pe_back_findings" },
    ],
  },
  {
    heading: "C",
    items: [
      { label: "Anus-Rectum", statusKey: "pe_anus_rectum", findingsKey: "pe_anus_rectum_findings" },
      { label: "Genito-Urinary System", statusKey: "pe_genito_urinary", findingsKey: "pe_genito_urinary_findings" },
      { label: "Inguinals, genitals", statusKey: "pe_inguinals_genitals", findingsKey: "pe_inguinals_genitals_findings" },
      { label: "Extremities", statusKey: "pe_extremities", findingsKey: "pe_extremities_findings" },
      { label: "Reflexes", statusKey: "pe_reflexes", findingsKey: "pe_reflexes_findings" },
      { label: "Dental (Teeth/gums)", statusKey: "pe_dental", findingsKey: "pe_dental_findings" },
    ],
  },
];

interface FindingRowProps {
  item: FindingDefinition;
  data: LandbasePeme;
  disabled?: boolean;
  onChange: <K extends keyof LandbasePeme>(field: K, value: LandbasePeme[K]) => void;
}

function FindingRow({ item, data, disabled, onChange }: FindingRowProps) {
  const isNormal = data[item.statusKey] === "N";

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-1">
      <label
        className={cn(
          "flex min-w-0 items-center justify-between gap-1 px-1",
          disabled ? "pointer-events-none" : "cursor-pointer",
        )}
      >
        <span className="text-[11px] leading-tight text-foreground/80">
          {item.label}
        </span>
        <input
          type="checkbox"
          checked={isNormal}
          onChange={(event) => {
            if (!disabled) {
              onChange(item.statusKey, event.target.checked ? "N" : "A");
            }
          }}
          tabIndex={disabled ? -1 : undefined}
          className="h-4 w-4 shrink-0 rounded accent-primary"
          aria-label={`${item.label} normal`}
          aria-disabled={disabled}
        />
      </label>
      <Input
        value={(data[item.findingsKey] as string) ?? ""}
        onChange={(event) => onChange(item.findingsKey, event.target.value)}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={cn(
          "h-7 min-w-0 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30",
          disabled && "pointer-events-none",
        )}
        aria-label={`${item.label} findings`}
      />
    </div>
  );
}

function toSelectYesNo(value: YesNo): string {
  if (value === "yes") return "Yes";
  if (value === "no") return "No";
  return "";
}

/**
 * Landbase physical examination matching the detailed medical report layout.
 * Existing V7 fields and the expanded assessment fields are saved directly on
 * the Landbase PEME record.
 */
export default function PhysicalExaminationSection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const update = <K extends keyof LandbasePeme>(field: K, value: LandbasePeme[K]) => {
    onChange({ ...data, [field]: value });
  };

  const legacyPressure = (data.pe_blood_pressure ?? "").split("/");
  const systolic = data.pe_bp_systolic || legacyPressure[0] || "";
  const diastolic = data.pe_bp_diastolic || legacyPressure[1] || "";

  const updateBloodPressure = (
    field: "pe_bp_systolic" | "pe_bp_diastolic",
    value: string,
  ) => {
    const nextSystolic = field === "pe_bp_systolic" ? value : systolic;
    const nextDiastolic = field === "pe_bp_diastolic" ? value : diastolic;
    const combined = nextSystolic || nextDiastolic
      ? `${nextSystolic}/${nextDiastolic}`
      : "";

    onChange({
      ...data,
      [field]: value,
      pe_blood_pressure: combined,
    });
  };

  const handleSetNormal = () => {
    const normalFindings = Object.fromEntries(
      FINDING_COLUMNS.flatMap((column) =>
        column.items.flatMap((item) => [
          [item.statusKey, "N"],
          [item.findingsKey, ""],
        ]),
      ),
    );

    onChange({
      ...data,
      ...normalFindings,
      pe_rhythm: "Regular",
      vision_satisfactory_sight: "yes",
      vision_color_adequate: true,
      hearing_ad: "Adequate",
      hearing_as: "Adequate",
      hearing_satisfactory: "yes",
      hearing_right_adequacy: "adequate",
      hearing_left_adequacy: "adequate",
      speech_clarity: "adequate",
      psychological_satisfactory: "yes",
    } as LandbasePeme);
  };

  return (
    <section className="overflow-x-auto rounded-lg border border-primary/20 bg-card shadow-sm">
      <div className="min-w-[1000px]">
        <div className="flex items-center gap-2 border-b border-primary/20 px-2 py-1.5">
          <h2 className="shrink-0 text-sm font-bold uppercase tracking-wide text-primary">
            II. Physical Examination -
          </h2>
          <p className="flex-1 text-xs text-foreground/80">
            Enter the data called for. Check the appropriate box. Under columns A, B, C check YES if normal; uncheck if not normal and specify findings.
          </p>
          <SetNormalButton
            onClick={handleSetNormal}
            readOnly={disabled}
          />
        </div>

        <div className="grid grid-cols-[0.85fr_0.9fr_1.9fr_1.5fr] bg-muted/20">
          <div className="space-y-1.5 border-r border-primary/20 p-2">
            <CompactInput label="Weight (kg):" value={data.pe_weight} onChange={(value) => update("pe_weight", value)} disabled={disabled} />
            <CompactInput label="Height (cm):" value={data.pe_height} onChange={(value) => update("pe_height", value)} disabled={disabled} />
          </div>
          <div className="space-y-1.5 border-r border-primary/20 p-2">
            <CompactInput label="BMI:" value={data.pe_bmi} onChange={(value) => update("pe_bmi", value)} disabled={disabled} />
            <CompactInput label="Pulse Rate (bpm):" value={data.pe_pulse_rate} onChange={(value) => update("pe_pulse_rate", value)} disabled={disabled} />
          </div>
          <div className="space-y-1.5 border-r border-primary/20 p-2">
            <p className="text-center text-[11px] font-bold uppercase text-foreground/80">Blood Pressure:</p>
            <div className="grid grid-cols-2 gap-2">
              <CompactInput label="Systolic (mm Hg):" value={systolic} onChange={(value) => updateBloodPressure("pe_bp_systolic", value)} disabled={disabled} />
              <CompactInput label="Diastolic (mm Hg):" value={diastolic} onChange={(value) => updateBloodPressure("pe_bp_diastolic", value)} disabled={disabled} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 p-2">
            <CompactInput label="Respiration:" value={data.pe_respiration} onChange={(value) => update("pe_respiration", value)} disabled={disabled} />
            <div className="grid grid-cols-[auto_1fr] items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase text-foreground/80">Rhythm:</span>
              <FormSelect label="" value={data.pe_rhythm} onChange={(value) => update("pe_rhythm", value as LandbasePeme["pe_rhythm"])} options={["Regular", "Irregular"]} size="sm" disabled={disabled} />
            </div>
            <div className="col-span-2">
              <CompactInput label="Body Temperature:" value={data.pe_body_temperature} onChange={(value) => update("pe_body_temperature", value)} disabled={disabled} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[2.35fr_1fr] border-t border-primary/20">
          <div className="border-r border-primary/20">
            <div className="grid grid-cols-[76px_145px_145px_92px_105px_minmax(105px,1fr)]">
              <div className="border-r border-b border-primary/20 px-2 py-1.5 text-sm font-bold uppercase text-foreground">Vision</div>
              <div className="border-r border-b border-primary/20 px-2 py-1.5 text-center text-[11px] font-bold uppercase text-primary/70">Far Vision</div>
              <div className="border-r border-b border-primary/20 px-2 py-1.5 text-center text-[11px] font-bold uppercase text-primary/70">Near Vision</div>
              <div className="border-r border-b border-primary/20 px-2 py-1.5 text-center text-[11px] font-bold uppercase text-primary/70">Satisfactory Sight</div>
              <div className="border-r border-b border-primary/20 px-2 py-1.5 text-center text-[11px] font-bold uppercase text-primary/70">Visual Aids</div>
              <div className="border-b border-primary/20 px-2 py-1.5 text-center text-[11px] font-bold uppercase text-primary/70">Color Vision</div>

              <div className="flex items-center border-r border-b border-primary/20 px-2 py-1.5 text-xs text-foreground/80">Uncorrected</div>
              <div className="border-r border-b border-primary/20 p-1.5">
                <AcuityPair firstLabel="OD" firstValue={data.vision_far_od_uncorrected} secondLabel="OS" secondValue={data.vision_far_os_uncorrected} onFirstChange={(value) => update("vision_far_od_uncorrected", value)} onSecondChange={(value) => update("vision_far_os_uncorrected", value)} disabled={disabled} />
              </div>
              <div className="border-r border-b border-primary/20 p-1.5">
                <AcuityPair firstLabel="OD J/" firstValue={data.vision_near_od_uncorrected} secondLabel="OS J/" secondValue={data.vision_near_os_uncorrected} onFirstChange={(value) => update("vision_near_od_uncorrected", value)} onSecondChange={(value) => update("vision_near_os_uncorrected", value)} disabled={disabled} />
              </div>
              <div className="row-span-2 flex items-center border-r border-primary/20 p-2">
                <ChoiceGroup name="satisfactory-sight" value={data.vision_satisfactory_sight} options={YES_NO_OPTIONS} ariaLabel="Satisfactory sight" onChange={(value) => update("vision_satisfactory_sight", value as YesNo)} disabled={disabled} />
              </div>
              <div className="row-span-2 flex items-center border-r border-primary/20 p-2">
                <ChoiceGroup name="visual-aid" value={data.vision_visual_aid} options={VISUAL_AID_OPTIONS} ariaLabel="Visual aids" onChange={(value) => update("vision_visual_aid", value as LandbasePeme["vision_visual_aid"])} disabled={disabled} />
              </div>
              <div className="row-span-2 flex items-center p-2">
                <div className="space-y-2">
                  {[
                    ["Adequate", true],
                    ["Defective", false],
                  ].map(([label, colorValue]) => (
                    <label key={String(label)} className={cn("flex items-center gap-1.5", disabled ? "pointer-events-none" : "cursor-pointer")}>
                      <input type="checkbox" checked={data.vision_color_adequate === colorValue} onChange={() => { if (!disabled) update("vision_color_adequate", colorValue as boolean); }} tabIndex={disabled ? -1 : undefined} className="h-4 w-4 rounded accent-primary" aria-label={`Color vision - ${label}`} aria-disabled={disabled} />
                      <span className="text-xs text-foreground/80">{String(label)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center border-r border-primary/20 px-2 py-1.5 text-xs text-foreground/80">Corrected</div>
              <div className="border-r border-primary/20 p-1.5">
                <AcuityPair firstLabel="OD" firstValue={data.vision_far_od_corrected} secondLabel="OS" secondValue={data.vision_far_os_corrected} onFirstChange={(value) => update("vision_far_od_corrected", value)} onSecondChange={(value) => update("vision_far_os_corrected", value)} disabled={disabled} />
              </div>
              <div className="border-r border-primary/20 p-1.5">
                <AcuityPair firstLabel="OD J/" firstValue={data.vision_near_od_corrected} secondLabel="OS J/" secondValue={data.vision_near_os_corrected} onFirstChange={(value) => update("vision_near_od_corrected", value)} onSecondChange={(value) => update("vision_near_os_corrected", value)} disabled={disabled} />
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-primary/20">
              <div className="flex items-center gap-3 border-r border-primary/20 px-2 py-1.5">
                <span className="text-[11px] font-bold uppercase text-foreground/80">Clarity of Speech:</span>
                <ChoiceGroup name="speech-clarity" value={data.speech_clarity} options={ADEQUACY_OPTIONS} ariaLabel="Clarity of speech" onChange={(value) => update("speech_clarity", value as LandbasePeme["speech_clarity"])} disabled={disabled} />
              </div>
              <div className="flex items-center gap-3 px-2 py-1.5">
                <span className="text-[11px] font-bold text-primary/70">Satisfactory Psychological Test</span>
                <ChoiceGroup name="psychological-satisfactory" value={data.psychological_satisfactory} options={YES_NO_OPTIONS} ariaLabel="Satisfactory psychological test" onChange={(value) => update("psychological_satisfactory", value as YesNo)} disabled={disabled} />
              </div>
            </div>
          </div>

          <div>
            <div className="border-b border-primary/20 px-2 py-1.5 text-center text-sm font-bold uppercase text-foreground">Hearing by Audiometry</div>
            <div className="grid grid-cols-[1fr_0.85fr] gap-x-3 gap-y-2 p-2">
              <div className="space-y-2">
                <div className="grid grid-cols-[24px_1fr] items-center gap-1.5">
                  <span className="text-[11px] font-bold text-primary/70">AD:</span>
                  <FormSelect label="" value={data.hearing_ad} onChange={(value) => update("hearing_ad", value)} options={["Adequate", "Inadequate"]} size="sm" disabled={disabled} />
                </div>
                <div className="grid grid-cols-[24px_1fr] items-center gap-1.5">
                  <span className="text-[11px] font-bold text-primary/70">AS:</span>
                  <FormSelect label="" value={data.hearing_as} onChange={(value) => update("hearing_as", value)} options={["Adequate", "Inadequate"]} size="sm" disabled={disabled} />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-primary/70">Satisfactory Hearing:</span>
                <FormSelect label="" value={toSelectYesNo(data.hearing_satisfactory)} onChange={(value) => update("hearing_satisfactory", value.toLowerCase() as YesNo)} options={["Yes", "No"]} size="sm" disabled={disabled} />
              </div>
              <div className="col-span-2 space-y-2 border-t border-primary/10 pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-10 shrink-0 text-[11px] font-bold uppercase text-primary/70">Right:</span>
                  <ChoiceGroup name="hearing-right" value={data.hearing_right_adequacy} options={ADEQUACY_OPTIONS} ariaLabel="Right hearing" className="flex-1 flex-nowrap" onChange={(value) => update("hearing_right_adequacy", value as LandbasePeme["hearing_right_adequacy"])} disabled={disabled} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-10 shrink-0 text-[11px] font-bold uppercase text-primary/70">Left:</span>
                  <ChoiceGroup name="hearing-left" value={data.hearing_left_adequacy} options={ADEQUACY_OPTIONS} ariaLabel="Left hearing" className="flex-1 flex-nowrap" onChange={(value) => update("hearing_left_adequacy", value as LandbasePeme["hearing_left_adequacy"])} disabled={disabled} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-primary/20">
          {FINDING_COLUMNS.map((column, columnIndex) => (
            <div key={column.heading} className={cn(columnIndex < 2 && "border-r border-primary/20")}>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] border-b border-primary/20 bg-muted/20">
                <h3 className="border-r border-primary/20 px-2 py-1 text-center text-[11px] font-bold uppercase text-foreground">{column.heading}</h3>
                <span className="px-2 py-1 text-center text-[11px] font-bold uppercase text-foreground">Findings</span>
              </div>
              <div className="space-y-1 p-1.5">
                {column.items.map((item) => (
                  <FindingRow key={item.statusKey} item={item} data={data} disabled={disabled} onChange={update} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
