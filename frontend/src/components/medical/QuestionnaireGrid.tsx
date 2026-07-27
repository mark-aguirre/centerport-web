"use client";

import { SetNormalButton } from "@/components/common/set-normal-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { MedicalExam, MedicalSectionProps } from "./types";

/** Standard questionnaire items (questions 1-7) */
const QUESTIONNAIRE_ITEMS = [
  "Have you ever been signed off as sick or repatriated from a ship?",
  "Have you ever been hospitalized?",
  "Have you ever been declared unfit for sea duty?",
  "Has your medical certificate ever been restricted or revoked?",
  "Are you aware that you have any medical problem, disease or illness?",
  "Do you feel healthy and fit to perform the duties of your designated position/occupation?",
  "Are you allergic to any medication?",
] as const;

/**
 * Questionnaire sub-section of the Physical Examination form.
 *
 * Displays questions 1-8 with Yes/No radio buttons, a comments field,
 * and a medications detail textarea for question 8. Follows the PEME
 * (Pre-Employment Medical Examination) questionnaire format.
 *
 * "Set Normal" defaults:
 * - Q1-Q5, Q7, Q8: "no" (no past issues)
 * - Q6: "yes" (feels healthy and fit)
 * - Clear text fields
 *
 * @see PhysicalExaminationSection — parent orchestrator
 */
export function QuestionnaireGrid({ data, onChange, disabled }: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  const updateQuestionnaire = (question: string, value: string) => {
    const updatedQuestionnaire = { ...data.questionnaire, [question]: value };
    onChange({ ...data, questionnaire: updatedQuestionnaire });
  };

  /**
   * Set normal questionnaire answers:
   * Q1-Q5, Q7, Q8 → "no"; Q6 → "yes"; clear text fields.
   */
  const handleSetNormal = () => {
    const normalAnswers: Record<string, string> = {};
    QUESTIONNAIRE_ITEMS.forEach((item, idx) => {
      // Q6 (index 5): "yes" — feels healthy and fit
      normalAnswers[item] = idx === 5 ? "yes" : "no";
    });
    normalAnswers["Non-prescription or prescription medication"] = "no";
    onChange({
      ...data,
      questionnaire: normalAnswers,
      questionnaire_comments: "",
      questionnaire_medications_detail: "",
    });
  };

  return (
    <div className={cn("bg-card rounded-lg p-3 shadow-sm border border-primary/10", disabled && "pointer-events-none")}>
      {/* Column headers */}
      <div className="flex items-center py-1 mb-1 border-b border-primary/20">
        <span className="text-[11px] font-bold text-foreground/90 uppercase tracking-wide flex-1">
          Please select on the appropriate box.
        </span>
        <div className="flex items-center gap-3">
          <SetNormalButton onClick={handleSetNormal} disabled={disabled} />
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider w-12 text-center">
            YES
          </span>
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider w-12 text-center">
            NO
          </span>
        </div>
      </div>

      {/* Questions 1-7 */}
      <div className="space-y-0">
        {QUESTIONNAIRE_ITEMS.map((item, idx) => {
          const currentValue = data.questionnaire[item] || "";
          return (
            <div key={item} className="flex items-center py-1.5 border-b border-muted/30 last:border-0">
              <span className="text-xs text-foreground/80 flex-1">
                {idx + 1}. {item}
              </span>
              <div className="flex items-center w-24 justify-around shrink-0" role="radiogroup" aria-label={item}>
                <input
                  type="radio"
                  name={`q-${idx}`}
                  checked={currentValue === "yes"}
                  onChange={() => updateQuestionnaire(item, "yes")}
                  className="w-4 h-4 accent-primary"
                  aria-label={`${item} - Yes`}
                />
                <input
                  type="radio"
                  name={`q-${idx}`}
                  checked={currentValue === "no"}
                  onChange={() => updateQuestionnaire(item, "no")}
                  className="w-4 h-4 accent-primary"
                  aria-label={`${item} - No`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Comments */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-muted/30">
        <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">Comments:</Label>
        <Input
          value={data.questionnaire_comments}
          onChange={(e) => update("questionnaire_comments", e.target.value)}
          className="h-7 text-xs flex-1"
          readOnly={disabled}
          tabIndex={disabled ? -1 : undefined}
        />
      </div>

      {/* Question 8: Non-prescription / prescription medications */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center py-2 border-b border-muted/30">
          <span className="text-xs text-foreground/80 flex-1">
            8. Are you taking any non-prescription or prescription medication?
          </span>
          <div className="flex items-center w-24 justify-around shrink-0" role="radiogroup" aria-label="Non-prescription or prescription medication">
            <input
              type="radio"
              name="q-8"
              checked={(data.questionnaire["Non-prescription or prescription medication"] || "") === "yes"}
              onChange={() => updateQuestionnaire("Non-prescription or prescription medication", "yes")}
              className="w-4 h-4 accent-primary"
            />
            <input
              type="radio"
              name="q-8"
              checked={(data.questionnaire["Non-prescription or prescription medication"] || "") === "no"}
              onChange={() => updateQuestionnaire("Non-prescription or prescription medication", "no")}
              className="w-4 h-4 accent-primary"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-muted-foreground italic">
            If yes, please list the medication(s) taken/being taken, and the purpose(s) and dosage(s).
          </Label>
          <textarea
            value={data.questionnaire_medications_detail}
            onChange={(e) => update("questionnaire_medications_detail", e.target.value)}
            className="w-full h-20 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus:border-primary dark:bg-input/30 resize-none"
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
          />
        </div>
      </div>
    </div>
  );
}
