"use client";

import RadioGroup from "@/components/common/radio-group";
import { ClipboardList } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LandbasePeme, LandbaseSectionProps } from "./types";

/** Questions displayed in the PEME questionnaire */
const QUESTIONS = [
  {
    key: "questionnaire_1" as const,
    text: "1. Have you ever been signed-off as sick or repatriated from a jobsite overseas?",
  },
  {
    key: "questionnaire_2" as const,
    text: "2. Have you ever been hospitalized?",
  },
  {
    key: "questionnaire_3" as const,
    text: "3. Have you ever been declared unfit for work overseas?",
  },
  {
    key: "questionnaire_4" as const,
    text: "4. Has your medical certificate ever been restricted or revoked?",
  },
  {
    key: "questionnaire_5" as const,
    text: "5. Are you aware that you have any medical problems, disease or illness?",
  },
  {
    key: "questionnaire_6" as const,
    text: "6. Do you feel healthy and fit to perform the duties of your designated position/occupation?",
  },
  {
    key: "questionnaire_7" as const,
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
 * Displays a list of yes/no questions, a comments field,
 * and a medication question with details textarea.
 */
export default function QuestionnaireSection({
  data,
  onChange,
}: LandbaseSectionProps) {
  const updateField = (field: keyof LandbasePeme, value: string) =>
    onChange({ ...data, [field]: value } as LandbasePeme);

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
            Please Select the Appropriate Box.
          </h2>
        </div>
        <div className="flex items-center gap-4 pr-1">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Yes</span>
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">No</span>
        </div>
      </div>

      {/* Questions with Yes/No radio */}
      <div className="mb-3">
        {QUESTIONS.map((q) => (
          <div
            key={q.key}
            className="flex items-center justify-between py-1 border-b border-muted/20 last:border-b-0"
          >
            <span className="text-xs text-foreground/80 flex-1 pr-4">
              {q.text}
            </span>
            <RadioGroup
              name={q.key}
              value={data[q.key]}
              onChange={(v) => updateField(q.key, v)}
              options={YES_NO_OPTIONS}
              ariaLabel={q.text}
              className="!space-y-0"
              hideLabels
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
          value={data.questionnaire_comments}
          onChange={(e) => updateField("questionnaire_comments", e.target.value)}
          className="h-12 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
          placeholder="Add comments..."
        />
      </div>

      {/* Question 8 - Medication */}
      <div className="border-t border-primary/10 pt-2 space-y-1.5">
        <div className="flex items-center justify-between py-1">
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
          />
        </div>

        <div className="space-y-0.5">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            If yes, please list the medication(s) taken/being taken, and the purpose(s) and dosage(s).
          </Label>
          <Textarea
            value={data.questionnaire_8_details}
            onChange={(e) => updateField("questionnaire_8_details", e.target.value)}
            className="h-14 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
            placeholder="List medications, purpose, and dosages..."
          />
        </div>
      </div>
    </div>
  );
}
