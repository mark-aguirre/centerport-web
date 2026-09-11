"use client";

import { SetNormalButton } from "@/components/common/set-normal-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { RADIO_OPTION_LABEL_CLASS } from "@/lib/form-styles";
import type { LandbasePeme, LandbaseSectionProps, YesNo } from "./types";
import { createFieldUpdater } from "./utils";

type QuestionnaireAnswerKey =
  | "questionnaire_1"
  | "questionnaire_2"
  | "questionnaire_3"
  | "questionnaire_4"
  | "questionnaire_5"
  | "questionnaire_6";

type QuestionnaireDetailsKey =
  | "questionnaire_1_details"
  | "questionnaire_2_details"
  | "questionnaire_3_details"
  | "questionnaire_4_details"
  | "questionnaire_5_details"
  | "questionnaire_6_details";

interface QuestionDefinition {
  number: number;
  answerKey: QuestionnaireAnswerKey;
  detailsKey: QuestionnaireDetailsKey;
  text: string;
}

const QUESTIONS: readonly QuestionDefinition[] = [
  {
    number: 1,
    answerKey: "questionnaire_1",
    detailsKey: "questionnaire_1_details",
    text: "Have you ever been signed off as sick or repatriated from a jobsite overseas?",
  },
  {
    number: 2,
    answerKey: "questionnaire_2",
    detailsKey: "questionnaire_2_details",
    text: "Have you ever been hospitalized?",
  },
  {
    number: 3,
    answerKey: "questionnaire_3",
    detailsKey: "questionnaire_3_details",
    text: "Have you ever been declared unfit for work overseas?",
  },
  {
    number: 4,
    answerKey: "questionnaire_4",
    detailsKey: "questionnaire_4_details",
    text: "Has your medical certificate ever been restricted or revoked?",
  },
  {
    number: 5,
    answerKey: "questionnaire_5",
    detailsKey: "questionnaire_5_details",
    text: "Are you aware that you have any medical problem, disease or illness?",
  },
  {
    number: 6,
    answerKey: "questionnaire_6",
    detailsKey: "questionnaire_6_details",
    text: "Do you feel healthy and fit to perform the duties of your designated position/occupation?",
  },
];

interface YesNoControlProps {
  name: string;
  value: YesNo;
  ariaLabel: string;
  disabled?: boolean;
  onChange: (value: YesNo) => void;
}

function YesNoControl({
  name,
  value,
  ariaLabel,
  disabled,
  onChange,
}: YesNoControlProps) {
  return (
    <div
      className="grid w-[72px] grid-cols-2 place-items-center gap-3"
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {(["yes", "no"] as const).map((option) => (
        <label
          key={option}
          className={cn(
            RADIO_OPTION_LABEL_CLASS,
            "justify-center",
            disabled ? "pointer-events-none" : "cursor-pointer",
          )}
        >
          <input
            type="radio"
            name={name}
            checked={value === option}
            onChange={() => {
              if (!disabled) {
                onChange(option);
              }
            }}
            tabIndex={disabled ? -1 : undefined}
            className="h-4 w-4 accent-primary"
            aria-label={`${ariaLabel} - ${option}`}
            aria-disabled={disabled}
          />
        </label>
      ))}
    </div>
  );
}

interface DetailInputProps {
  field: keyof LandbasePeme;
  value: string;
  ariaLabel: string;
  disabled?: boolean;
  onChange: (field: keyof LandbasePeme, value: string) => void;
}

function DetailInput({
  field,
  value,
  ariaLabel,
  disabled,
  onChange,
}: DetailInputProps) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(field, event.target.value)}
      readOnly={disabled}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        "h-7 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30",
        disabled && "pointer-events-none",
      )}
      aria-label={ariaLabel}
    />
  );
}

/**
 * Displays the numbered Landbase health questionnaire with persisted detail
 * fields, matching the layout of the source medical examination form.
 */
export default function QuestionnaireSection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  const handleSetNormal = () => {
    onChange({
      ...data,
      questionnaire_1: "no",
      questionnaire_1_details: "",
      questionnaire_2: "no",
      questionnaire_2_details: "",
      questionnaire_3: "no",
      questionnaire_3_details: "",
      questionnaire_4: "no",
      questionnaire_4_details: "",
      questionnaire_5: "no",
      questionnaire_5_details: "",
      questionnaire_6: "yes",
      questionnaire_6_details: "",
      questionnaire_7: "no",
      questionnaire_comments: "",
      questionnaire_8: "no",
      questionnaire_8_details: "",
    });
  };

  return (
    <section className="overflow-x-auto rounded-lg border border-primary/20 bg-card shadow-sm">
      <div className="min-w-[960px]">
        <div className="grid grid-cols-[24px_minmax(0,1fr)_72px_minmax(260px,0.9fr)] items-center gap-2 border-b border-primary/20 px-2 py-1.5">
          <h2 className="col-span-2 text-sm font-bold text-primary">
            Please select on the appropriate box.
          </h2>
          <div className="grid grid-cols-2 place-items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-primary/70">
            <span>Yes</span>
            <span>No</span>
          </div>
          <div className="flex justify-end">
            {!disabled && <SetNormalButton onClick={handleSetNormal} />}
          </div>
        </div>

        {QUESTIONS.map((question) => (
          <div
            key={question.answerKey}
            className="grid min-h-10 grid-cols-[24px_minmax(0,1fr)_72px_minmax(260px,0.9fr)] items-center gap-2 border-b border-primary/10 px-2 py-1.5"
          >
            <span className="text-xs text-foreground/80">{question.number}.</span>
            <span className="text-xs text-foreground/80">{question.text}</span>
            <YesNoControl
              name={question.answerKey}
              value={data[question.answerKey]}
              ariaLabel={question.text}
              disabled={disabled}
              onChange={(value) => updateField(question.answerKey, value)}
            />
            <DetailInput
              field={question.detailsKey}
              value={data[question.detailsKey]}
              ariaLabel={`Question ${question.number} details`}
              disabled={disabled}
              onChange={updateField}
            />
          </div>
        ))}

        <div className="grid min-h-10 grid-cols-[24px_minmax(0,1fr)_72px_minmax(260px,0.9fr)] items-center gap-2 px-2 py-1.5">
          <span className="text-xs text-foreground/80">7.</span>
          <span className="text-xs text-foreground/80">
            Are you allergic to any medication?
          </span>
          <YesNoControl
            name="questionnaire_7"
            value={data.questionnaire_7}
            ariaLabel="Are you allergic to any medication?"
            disabled={disabled}
            onChange={(value) => updateField("questionnaire_7", value)}
          />
          <span aria-hidden="true" />
        </div>

        <div className="grid grid-cols-[24px_minmax(0,1fr)_72px_minmax(260px,0.9fr)] gap-2 border-b border-primary/20 px-2 pb-2">
          <span aria-hidden="true" />
          <div className="space-y-1">
            <Label
              htmlFor="questionnaire-comments"
              className="text-xs text-foreground/80"
            >
              Comments
            </Label>
            <Textarea
              id="questionnaire-comments"
              value={data.questionnaire_comments ?? ""}
              onChange={(event) =>
                updateField("questionnaire_comments", event.target.value)
              }
              readOnly={disabled}
              tabIndex={disabled ? -1 : undefined}
              className={cn(
                "h-14 resize-none rounded-md border border-primary/20 bg-white px-3 py-2 text-sm dark:bg-input/30",
                disabled && "pointer-events-none",
              )}
            />
          </div>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </div>

        <div className="grid min-h-10 grid-cols-[24px_minmax(0,1fr)_72px_minmax(260px,0.9fr)] items-center gap-2 px-2 py-1.5">
          <span className="text-xs text-foreground/80">8.</span>
          <span className="text-xs text-foreground/80">
            Are you taking any non-prescription or prescription medication?
          </span>
          <YesNoControl
            name="questionnaire_8"
            value={data.questionnaire_8}
            ariaLabel="Are you taking any non-prescription or prescription medication?"
            disabled={disabled}
            onChange={(value) => updateField("questionnaire_8", value)}
          />
          <span aria-hidden="true" />
        </div>

        <div className="grid grid-cols-[24px_minmax(0,1fr)_72px_minmax(260px,0.9fr)] gap-2 px-2 pb-2">
          <span aria-hidden="true" />
          <div className="space-y-1">
            <Label
              htmlFor="questionnaire-8-details"
              className="text-xs text-foreground/80"
            >
              If yes, please list the medication(s) taken/being taken, and the purpose(s) and dosage(s).
            </Label>
            <Textarea
              id="questionnaire-8-details"
              value={data.questionnaire_8_details ?? ""}
              onChange={(event) =>
                updateField("questionnaire_8_details", event.target.value)
              }
              readOnly={disabled}
              tabIndex={disabled ? -1 : undefined}
              className={cn(
                "h-16 resize-none rounded-md border border-primary/20 bg-white px-3 py-2 text-sm dark:bg-input/30",
                disabled && "pointer-events-none",
              )}
            />
          </div>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
