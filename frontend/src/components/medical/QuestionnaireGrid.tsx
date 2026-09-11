"use client";

import { SetNormalButton } from "@/components/common/set-normal-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { RADIO_OPTION_LABEL_CLASS } from "@/lib/form-styles";
import type { MedicalSectionProps } from "./types";

interface QuestionnaireItem {
  key: string;
  label: string;
  detailKey?: string;
}

const QUESTIONNAIRE_ITEMS: readonly QuestionnaireItem[] = [
  {
    key: "Have you ever been signed off as sick or repatriated from a ship?",
    label: "Have you ever been signed off as sick or repatriated from a ship?",
    detailKey:
      "Have you ever been signed off as sick or repatriated from a ship? Details",
  },
  {
    key: "Have you ever been hospitalized?",
    label: "Have you ever been hospitalized?",
    detailKey: "Have you ever been hospitalized? Details",
  },
  {
    key: "Have you ever been declared unfit for sea duty?",
    label: "Have you ever been declared unfit for sea duty?",
    detailKey: "Have you ever been declared unfit for sea duty? Details",
  },
  {
    key: "Has your medical certificate ever been restricted or revoked?",
    label: "Has your medical certificate ever been restricted or revoked?",
    detailKey:
      "Has your medical certificate ever been restricted or revoked? Details",
  },
  {
    key: "Are you aware that you have any medical problem, disease or illness?",
    label:
      "Are you aware that you have any medical problem, disease or illness?",
    detailKey:
      "Are you aware that you have any medical problem, disease or illness? Details",
  },
  {
    key: "Do you feel healthy and fit to perform the duties of your designated position/occupation?",
    label:
      "Do you feel healthy and fit to perform the duties of your designated position/occupation?",
    detailKey:
      "Do you feel healthy and fit to perform the duties of your designated position/occupation? Details",
  },
  {
    key: "Are you allergic to any medication?",
    label: "Are you allergic to any medication?",
  },
];

const MEDICATION_QUESTION_KEY =
  "Non-prescription or prescription medication";

interface QuestionnaireRowProps {
  number: number;
  item: QuestionnaireItem;
  value: string;
  detailValue?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onDetailChange?: (value: string) => void;
}

function QuestionnaireRow({
  number,
  item,
  value,
  detailValue,
  disabled,
  onChange,
  onDetailChange,
}: QuestionnaireRowProps) {
  return (
    <div className="grid min-h-9 grid-cols-[minmax(0,1fr)_56px_56px_minmax(280px,0.78fr)] items-center gap-1 border-b border-primary/20 px-1.5 py-1">
      <span className="text-xs leading-tight text-foreground/80">
        <span className="mr-4 font-semibold">{number}.</span>
        {item.label}
      </span>
      {[
        ["yes", "Yes"],
        ["no", "No"],
      ].map(([optionValue, optionLabel]) => (
        <label
          key={optionValue}
          className={cn(RADIO_OPTION_LABEL_CLASS, "justify-center")}
        >
          <input
            type="radio"
            name={`questionnaire-${number}`}
            checked={value === optionValue}
            onChange={() => onChange(optionValue)}
            tabIndex={disabled ? -1 : undefined}
            className="h-4 w-4 accent-primary"
            aria-label={`${item.label} - ${optionLabel}`}
          />
        </label>
      ))}
      {item.detailKey && onDetailChange ? (
        <Input
          value={detailValue ?? ""}
          onChange={(event) => onDetailChange(event.target.value)}
          readOnly={disabled}
          tabIndex={disabled ? -1 : undefined}
          className="h-7 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30"
          aria-label={`Question ${number} details`}
        />
      ) : (
        <div />
      )}
    </div>
  );
}

/**
 * Medical questionnaire matching the Seabase examination form.
 *
 * Existing answer keys remain unchanged. Q1-Q6 detail values are stored under
 * adjacent reserved keys in the questionnaire JSONB map.
 */
export function QuestionnaireGrid({
  data,
  onChange,
  disabled,
}: MedicalSectionProps) {
  const questionnaire = data.questionnaire ?? {};

  const updateQuestionnaire = (key: string, value: string) => {
    onChange({
      ...data,
      questionnaire: { ...questionnaire, [key]: value },
    });
  };

  const handleSetNormal = () => {
    const normalAnswers = { ...questionnaire };

    QUESTIONNAIRE_ITEMS.forEach((item, index) => {
      normalAnswers[item.key] = index === 5 ? "yes" : "no";
      if (item.detailKey) {
        normalAnswers[item.detailKey] = "";
      }
    });
    normalAnswers[MEDICATION_QUESTION_KEY] = "no";

    onChange({
      ...data,
      questionnaire: normalAnswers,
      questionnaire_comments: "",
      questionnaire_medications_detail: "",
    });
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm",
        disabled && "pointer-events-none",
      )}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[minmax(0,1fr)_56px_56px_minmax(280px,0.78fr)] items-center gap-1 border-b border-primary/20 px-1.5 py-1.5">
            <span className="text-xs font-bold text-foreground/90">
              Please select on the appropriate box.
            </span>
            <span className="text-center text-[11px] font-bold uppercase tracking-wider text-primary/70">
              Yes
            </span>
            <span className="text-center text-[11px] font-bold uppercase tracking-wider text-primary/70">
              No
            </span>
            <div className="flex justify-end">
              <SetNormalButton
                onClick={handleSetNormal}
                disabled={disabled}
              />
            </div>
          </div>

          {QUESTIONNAIRE_ITEMS.slice(0, 6).map((item, index) => (
            <QuestionnaireRow
              key={item.key}
              number={index + 1}
              item={item}
              value={questionnaire[item.key] ?? ""}
              detailValue={
                item.detailKey ? questionnaire[item.detailKey] ?? "" : undefined
              }
              onChange={(value) => updateQuestionnaire(item.key, value)}
              onDetailChange={
                item.detailKey
                  ? (value) => updateQuestionnaire(item.detailKey!, value)
                  : undefined
              }
              disabled={disabled}
            />
          ))}

          <QuestionnaireRow
            number={7}
            item={QUESTIONNAIRE_ITEMS[6]}
            value={questionnaire[QUESTIONNAIRE_ITEMS[6].key] ?? ""}
            onChange={(value) =>
              updateQuestionnaire(QUESTIONNAIRE_ITEMS[6].key, value)
            }
            disabled={disabled}
          />

          <div className="grid grid-cols-[95px_minmax(0,1fr)_112px_minmax(280px,0.78fr)] items-start gap-2 border-b border-primary/20 px-2 py-1">
            <label
              htmlFor="questionnaire-comments"
              className="pt-1 text-xs font-semibold text-foreground/80"
            >
              Comments
            </label>
            <Textarea
              id="questionnaire-comments"
              value={data.questionnaire_comments}
              onChange={(event) =>
                onChange({
                  ...data,
                  questionnaire_comments: event.target.value,
                })
              }
              readOnly={disabled}
              tabIndex={disabled ? -1 : undefined}
              className="col-span-2 h-12 resize-none border border-primary/20 bg-white px-3 py-2 text-sm dark:bg-input/30"
            />
            <div />
          </div>

          <div className="grid min-h-9 grid-cols-[minmax(0,1fr)_56px_56px_minmax(280px,0.78fr)] items-center gap-1 px-1.5 py-1">
            <span className="text-xs leading-tight text-foreground/80">
              <span className="mr-4 font-semibold">8.</span>
              Are you taking any non-prescription or prescription medication?
            </span>
            {[
              ["yes", "Yes"],
              ["no", "No"],
            ].map(([optionValue, optionLabel]) => (
              <label
                key={optionValue}
                className={cn(RADIO_OPTION_LABEL_CLASS, "justify-center")}
              >
                <input
                  type="radio"
                  name="questionnaire-8"
                  checked={questionnaire[MEDICATION_QUESTION_KEY] === optionValue}
                  onChange={() =>
                    updateQuestionnaire(MEDICATION_QUESTION_KEY, optionValue)
                  }
                  tabIndex={disabled ? -1 : undefined}
                  className="h-4 w-4 accent-primary"
                  aria-label={`Medication question - ${optionLabel}`}
                />
              </label>
            ))}
            <div />
          </div>

          <div className="space-y-1 px-12 pb-2">
            <label
              htmlFor="questionnaire-medications"
              className="text-[11px] font-semibold text-foreground/80"
            >
              If yes, please list the medication(s) taken/being taken, and the
              purpose(s) and dosage(s).
            </label>
            <Textarea
              id="questionnaire-medications"
              value={data.questionnaire_medications_detail}
              onChange={(event) =>
                onChange({
                  ...data,
                  questionnaire_medications_detail: event.target.value,
                })
              }
              readOnly={disabled}
              tabIndex={disabled ? -1 : undefined}
              className="h-16 max-w-[560px] resize-none border border-primary/20 bg-white px-3 py-2 text-sm dark:bg-input/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
