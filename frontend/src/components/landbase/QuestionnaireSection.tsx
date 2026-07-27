"use client";

import RadioGroup from "@/components/common/radio-group";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { ClipboardList } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { LandbasePeme, LandbaseSectionProps } from "./types";

/**
 * Question definition for the PEME questionnaire.
 *
 * Each question maps to a `questionnaire_N` field on the PEME record.
 */
interface QuestionDef {
  key: keyof LandbasePeme;
  text: string;
}

/** Questions displayed in the PEME questionnaire (Q1-Q7). */
const QUESTIONS: QuestionDef[] = [
  {
    key: "questionnaire_1",
    text: "1. Have you ever been signed-off as sick or repatriated from a jobsite overseas?",
  },
  {
    key: "questionnaire_2",
    text: "2. Have you ever been hospitalized?",
  },
  {
    key: "questionnaire_3",
    text: "3. Have you ever been declared unfit for work overseas?",
  },
  {
    key: "questionnaire_4",
    text: "4. Has your medical certificate ever been restricted or revoked?",
  },
  {
    key: "questionnaire_5",
    text: "5. Are you aware that you have any medical problems, disease or illness?",
  },
  {
    key: "questionnaire_6",
    text: "6. Do you feel healthy and fit to perform the duties of your designated position/occupation?",
  },
  {
    key: "questionnaire_7",
    text: "7. Are you allergic to any medication?",
  },
];

const YES_NO_OPTIONS = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

/**
 * Questionnaire section for the Landbase PEME form.
 *
 * Displays a list of yes/no health declaration questions (Q1-Q7),
 * a general comments field, and a medication question (Q8) with
 * a details textarea for specifying prescriptions.
 *
 * "Set Normal" defaults:
 * - Q1-Q5, Q7, Q8: "no" (no past issues)
 * - Q6: "yes" (feels healthy and fit)
 * - Clears comments and medication details
 *
 * @see PastMedicalHistorySection — complementary section for specific conditions
 */
export default function QuestionnaireSection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  /**
   * Set normal questionnaire answers:
   * Q1-Q5, Q7, Q8 → "no"; Q6 → "yes"; clear text fields.
   */
  const handleSetNormal = () => {
    onChange({
      ...data,
      questionnaire_1: "no",
      questionnaire_2: "no",
      questionnaire_3: "no",
      questionnaire_4: "no",
      questionnaire_5: "no",
      questionnaire_6: "yes",
      questionnaire_7: "no",
      questionnaire_comments: "",
      questionnaire_8: "no",
      questionnaire_8_details: "",
    });
  };

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
            Please Select the Appropriate Box.
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <SetNormalButton onClick={handleSetNormal} disabled={disabled} />
          <div className="flex items-center gap-4 pr-14">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Yes</span>
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">No</span>
          </div>
        </div>
      </div>

      {/* Questions Q1-Q7 with Yes/No radio */}
      <div className="mb-3">
        {QUESTIONS.map((q, index) => (
          <div
            key={q.key}
            className={`flex items-center justify-between py-1 border-b border-muted/20 last:border-b-0 px-1 rounded-sm pr-14 ${index % 2 === 0 ? "bg-muted/30" : ""}`}
          >
            <span className="text-xs text-foreground/80 flex-1 pr-4">
              {q.text}
            </span>
            <RadioGroup
              name={q.key}
              value={data[q.key] as string}
              onChange={(v) => updateField(q.key, v)}
              options={YES_NO_OPTIONS}
              ariaLabel={q.text}
              className="!space-y-0"
              hideLabels
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      {/* Comments */}
      <div className="space-y-0.5 mb-2">
        <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
          Comments:
        </Label>
        <Textarea
          value={data.questionnaire_comments ?? ""}
          onChange={(e) => updateField("questionnaire_comments", e.target.value)}
          className={cn(
            "h-12 text-sm bg-white border border-primary/20 rounded-md px-3 py-2",
            "focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none",
            disabled && "pointer-events-none"
          )}
          placeholder="Add comments..."
          readOnly={disabled}
        />
      </div>

      {/* Question 8 - Medication */}
      <div className="border-t border-primary/10 pt-2 space-y-1.5">
        <div className="flex items-center justify-between py-1 px-1 rounded-sm bg-muted/30 pr-14">
          <span className="text-xs text-foreground/80 flex-1 pr-4">
            8. Are you taking any non-prescription or prescription medication?
          </span>
          <RadioGroup
            name="questionnaire_8"
            value={data.questionnaire_8}
            onChange={(v) => updateField("questionnaire_8", v)}
            options={YES_NO_OPTIONS}
            ariaLabel="Are you taking any non-prescription or prescription medication?"
            hideLabels
            disabled={disabled}
          />
        </div>

        <div className="space-y-0.5">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            If yes, please list the medication(s) taken/being taken, and the purpose(s) and dosage(s).
          </Label>
          <Textarea
            value={data.questionnaire_8_details ?? ""}
            onChange={(e) => updateField("questionnaire_8_details", e.target.value)}
            className={cn(
              "h-14 text-sm bg-white border border-primary/20 rounded-md px-3 py-2",
              "focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none",
              disabled && "pointer-events-none"
            )}
            placeholder="List medications, purpose, and dosages..."
            readOnly={disabled}
          />
        </div>
      </div>
    </div>
  );
}
