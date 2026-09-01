"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PanamaSectionProps, PanamaCertificate, YesNo } from "./types";

interface DeclarationCondition {
  num: number;
  label: string;
  /** Semantic key persisted in the `conditions` JSONB map. */
  storageKey: string;
  /**
   * Former opaque key that held this exact condition (1:1). Any value read
   * from it — "yes" or "no" — carries over safely for records saved before
   * the semantic-key migration.
   */
  legacyExactKey?: string;
  /**
   * Former combined key that grouped several conditions together. Only a "no"
   * can be applied unambiguously; a combined "yes" needs reconfirmation
   * because the specific positive item is unknown.
   */
  legacyCombinedKey?: string;
}

/**
 * Declaration conditions from the Panama form.
 *
 * Storage keys intentionally remain independent from display numbers so
 * semantically equivalent answers from the former 1–36 list remain available.
 * Newly split conditions use semantic keys and consult a legacy combined key
 * only when a historical "no" can be applied unambiguously.
 */
const DECLARATION_CONDITIONS: DeclarationCondition[] = [
  { num: 1, label: "High blood pressure", storageKey: "high_blood_pressure", legacyExactKey: "condition_1" },
  { num: 2, label: "Eye/vision problem", storageKey: "eye_vision_problem", legacyExactKey: "condition_2" },
  { num: 3, label: "Ear (hearing/tinnitus)", storageKey: "ear_problem", legacyExactKey: "condition_ear", legacyCombinedKey: "condition_3" },
  { num: 4, label: "Heart surgery", storageKey: "heart_surgery", legacyExactKey: "condition_4" },
  { num: 5, label: "Varicose veins", storageKey: "varicose_veins", legacyExactKey: "condition_varicose_veins", legacyCombinedKey: "condition_5" },
  { num: 6, label: "Hemorroids", storageKey: "hemorrhoids", legacyExactKey: "condition_hemorrhoids", legacyCombinedKey: "condition_5" },
  { num: 7, label: "Nose problems", storageKey: "nose_problem", legacyExactKey: "condition_nose", legacyCombinedKey: "condition_3" },
  { num: 8, label: "Throat problems", storageKey: "throat_problem", legacyExactKey: "condition_throat", legacyCombinedKey: "condition_3" },
  { num: 9, label: "Asthma/bronchitis", storageKey: "asthma_bronchitis", legacyExactKey: "condition_6" },
  { num: 10, label: "Blood disorders", storageKey: "blood_disorders", legacyExactKey: "condition_7" },
  { num: 11, label: "Diabetes", storageKey: "diabetes", legacyExactKey: "condition_8" },
  { num: 12, label: "Thyroid problems", storageKey: "thyroid_problems", legacyExactKey: "condition_9" },
  { num: 13, label: "Digestive disorders", storageKey: "digestive_disorders", legacyExactKey: "condition_10" },
  { num: 14, label: "Kidney problems", storageKey: "kidney_problems", legacyExactKey: "condition_11" },
  { num: 15, label: "Skin problems", storageKey: "skin_problems", legacyExactKey: "condition_12" },
  { num: 16, label: "Allergies", storageKey: "allergies", legacyExactKey: "condition_13" },
  { num: 17, label: "Epilepsy / seizures", storageKey: "epilepsy_seizures", legacyExactKey: "condition_14" },
  { num: 18, label: "Sleep problem", storageKey: "sleep_problem", legacyExactKey: "condition_19" },
  { num: 19, label: "Sickle-cell disease (or a close family member)", storageKey: "sickle_cell_disease", legacyExactKey: "condition_15" },
  { num: 20, label: "Hernias", storageKey: "hernias", legacyExactKey: "condition_16" },
  { num: 21, label: "Genital disorders (or any sexually transmitted disease)", storageKey: "genital_disorders", legacyExactKey: "condition_17" },
  { num: 22, label: "Do you smoke?", storageKey: "smoking", legacyExactKey: "condition_smoking", legacyCombinedKey: "condition_20" },
  { num: 23, label: "Surgeries", storageKey: "surgeries", legacyExactKey: "condition_21" },
  { num: 24, label: "Infectious diseases", storageKey: "infectious_diseases", legacyExactKey: "condition_22" },
  { num: 25, label: "Dizziness/fainting", storageKey: "dizziness_fainting", legacyExactKey: "condition_23" },
  { num: 26, label: "Loss of consciousness", storageKey: "loss_of_consciousness", legacyExactKey: "condition_24" },
  { num: 27, label: "Do you use alcohol?", storageKey: "alcohol", legacyExactKey: "condition_alcohol", legacyCombinedKey: "condition_20" },
  { num: 28, label: "Do you use drugs?", storageKey: "drugs", legacyExactKey: "condition_drugs", legacyCombinedKey: "condition_20" },
  { num: 29, label: "Psychiatric problems", storageKey: "psychiatric_problems", legacyExactKey: "condition_25" },
  { num: 30, label: "Depression", storageKey: "depression", legacyExactKey: "condition_26" },
  { num: 31, label: "Loss of memory", storageKey: "loss_of_memory", legacyExactKey: "condition_28" },
  { num: 32, label: "Balance problems", storageKey: "balance_problems", legacyExactKey: "condition_29" },
  { num: 33, label: "Severe headaches", storageKey: "severe_headaches", legacyExactKey: "condition_30" },
  { num: 34, label: "Heart/vascular disease", storageKey: "heart_vascular_disease", legacyExactKey: "condition_31" },
  { num: 35, label: "Restricted mobility", storageKey: "restricted_mobility", legacyExactKey: "condition_32" },
  { num: 36, label: "Back problems", storageKey: "back_problem", legacyExactKey: "condition_back", legacyCombinedKey: "condition_33" },
  { num: 37, label: "Joint problems", storageKey: "joint_problem", legacyExactKey: "condition_joint", legacyCombinedKey: "condition_33" },
  { num: 38, label: "Amputation", storageKey: "amputation", legacyExactKey: "condition_34" },
  { num: 39, label: "Fractures/dislocation", storageKey: "fractures_dislocation", legacyExactKey: "condition_35" },
  { num: 40, label: "COVID-19", storageKey: "covid_19", legacyExactKey: "condition_36" },
  { num: 41, label: "Pregnancy", storageKey: "pregnancy", legacyExactKey: "condition_18" },
];

const CONDITIONS_COL_1 = DECLARATION_CONDITIONS.slice(0, 21);
const CONDITIONS_COL_2 = DECLARATION_CONDITIONS.slice(21);

/** Additional questions stored separately from declaration conditions. */
const ADDITIONAL_QUESTIONS = [
  { key: "question_37" as const, num: 37, text: "Have you ever been signed off due to illness or repatriated?" },
  { key: "question_38" as const, num: 38, text: "Have you ever been hospitalized?" },
  { key: "question_39" as const, num: 39, text: "Have you ever been declared unfit for sea duty?" },
  { key: "question_40" as const, num: 40, text: "Has your medical certificate ever been restricted or revoked?" },
  { key: "question_41" as const, num: 41, text: "Do you have any disease or ailment that you have not been asked about and you consider important to mention?" },
  { key: "question_42" as const, num: 42, text: "Do you feel healthy and fit to perform the duties of your designed position/occupation?" },
  { key: "question_43" as const, num: 43, text: "Are you allergic to any medications?" },
  { key: "question_44" as const, num: 44, text: "Are you allergic to any food or supplement alternative?" },
];

/** Covid-19 questions with yes/no answers. */
const COVID_YES_NO_QUESTIONS = [
  { key: "covid_1" as const, num: 1, text: "Have you been in contact with any Covid-19 positive person in the last (3) months?" },
  { key: "covid_2" as const, num: 2, text: "Have you had Covid-19 tests?" },
  { key: "covid_4" as const, num: 4, text: "Have you had fever, cough, diarrhea, sore throat, shortness of breath, headache or weight loss in the last 30 days?" },
  { key: "covid_5" as const, num: 5, text: "Have you received vaccination for Covid-19?" },
];

/**
 * Panama Medical Certificate — Examinee's Personal Declaration section.
 *
 * Clean grid layout: conditions in 2-column grid, additional questions and
 * covid section use consistent row-based table style.
 */
export default function PersonalDeclarationSection({ data, onChange, disabled }: PanamaSectionProps) {
  const update = (field: keyof PanamaCertificate, value: string) =>
    onChange({ ...data, [field]: value });

  const updateCondition = (conditionKey: string, value: YesNo) => {
    const updatedConditions = { ...data.conditions, [conditionKey]: value };
    onChange({ ...data, conditions: updatedConditions });
  };

  /** Set all active declaration conditions to "no" without clearing unrelated answers. */
  const handleSetNormal = () => {
    const normalConditions = { ...data.conditions };
    DECLARATION_CONDITIONS.forEach((item) => {
      normalConditions[item.storageKey] = "no";
    });

    onChange({
      ...data,
      conditions: normalConditions,
      conditions_details: "",
    });
  };

  const inputClasses = cn(
    "h-8 text-sm bg-white border border-primary/20 rounded-md px-2",
    "focus:outline-none focus-visible:border-primary dark:bg-input/30",
    disabled && "pointer-events-none"
  );

  const getConditionValue = (item: DeclarationCondition): YesNo => {
    const currentValue = data.conditions[item.storageKey] as YesNo | undefined;
    if (currentValue) return currentValue;

    // Backward compatibility for records saved before the semantic-key rename.
    // A former 1:1 key carries any value directly.
    if (item.legacyExactKey) {
      const exactValue = data.conditions[item.legacyExactKey] as YesNo | undefined;
      if (exactValue) return exactValue;
    }

    if (item.legacyCombinedKey) {
      const legacyValue = data.conditions[item.legacyCombinedKey];
      // A combined historical "no" safely means each split condition was no.
      // A combined "yes" needs reconfirmation because the positive item is unknown.
      return legacyValue === "no" ? "no" : "";
    }

    return "";
  };

  const renderConditionRow = (item: DeclarationCondition, index: number) => {
    const currentValue = getConditionValue(item);
    const rowBg = index % 2 === 0 ? "bg-muted/30" : "";
    return (
      <div
        key={item.storageKey}
        className={`grid grid-cols-[1fr_auto] items-center gap-2 rounded-sm border-b border-muted/30 px-1 py-1.5 ${rowBg}`}
      >
        <span className="text-xs leading-tight text-foreground/80">
          <span className="mr-1 font-semibold text-primary/70">{item.num}.</span>
          {item.label}
        </span>
        <div
          className={cn("grid w-[72px] shrink-0 grid-cols-2 place-items-center gap-2", disabled && "pointer-events-none")}
          role="radiogroup"
          aria-label={item.label}
        >
          {(["yes", "no"] as const).map((answer) => (
            <label
              key={answer}
              className="cursor-pointer"
            >
              <input
                type="radio"
                name={`panama_declaration_${item.num}`}
                checked={currentValue === answer}
                onChange={() => updateCondition(item.storageKey, answer)}
                className="h-4 w-4 accent-primary"
                aria-label={`${item.label} - ${answer === "yes" ? "Yes" : "No"}`}
                tabIndex={disabled ? -1 : undefined}
              />
              <span className="sr-only">{answer === "yes" ? "Yes" : "No"}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderCovidYesNoQuestion = (
    question: (typeof COVID_YES_NO_QUESTIONS)[number]
  ) => (
    <div
      key={question.key}
      className="grid grid-cols-[44px_minmax(0,1fr)_144px] items-stretch border-b border-primary/20"
    >
      <span className="px-2 py-3 text-xs font-semibold text-primary/70">
        {question.num}.
      </span>
      <span className="border-l border-primary/20 px-3 py-3 text-xs leading-snug text-foreground/80">
        {question.text}
      </span>
      <div className="grid grid-rows-2 border-l border-primary/20">
        <div className="grid grid-cols-2 place-items-center border-b border-primary/20 bg-muted/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            YES
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            NO
          </span>
        </div>
        <div
          className={cn("grid grid-cols-2 place-items-center", disabled && "pointer-events-none")}
          role="radiogroup"
          aria-label={question.text}
        >
          {(["yes", "no"] as const).map((answer) => (
            <label
              key={answer}
              className="cursor-pointer"
            >
              <input
                type="radio"
                name={`panama_${question.key}`}
                checked={data[question.key] === answer}
                onChange={() => update(question.key, answer)}
                className="h-4 w-4 accent-primary"
                aria-label={`${question.text} - ${answer === "yes" ? "Yes" : "No"}`}
                tabIndex={disabled ? -1 : undefined}
              />
              <span className="sr-only">{answer === "yes" ? "Yes" : "No"}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="II. Examinee's Personal Declaration (Assistance should be offered by medical staff)"
        icon={FileText}
        subtitle="Have you ever had any of the following conditions?"
        className="mb-6"
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
      />

      {/* Declaration conditions — 1–21 left, 22–41 right */}
      <div className="mb-4 mt-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[CONDITIONS_COL_1, CONDITIONS_COL_2].map((column, columnIndex) => (
            <div key={columnIndex}>
              <div className="sticky top-14 z-10 mb-1 grid grid-cols-[1fr_auto] items-center gap-2 border-b border-primary/20 bg-card px-1 pb-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary/70">
                  No. Condition
                </span>
                <div className="grid w-[72px] shrink-0 grid-cols-2 place-items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    YES
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    NO
                  </span>
                </div>
              </div>
              <div>{column.map(renderConditionRow)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Details for YES answers — directly below the declaration table */}
      <div className="mt-4 space-y-2 border-t border-primary/10 pt-4">
        <Label
          htmlFor="panama-declaration-condition-details"
          className="text-sm font-bold text-foreground/80"
        >
          If any of the above questions were answered &ldquo;yes&rdquo;, please give details:
        </Label>
        <Textarea
          id="panama-declaration-condition-details"
          value={data.conditions_details}
          onChange={(event) => update("conditions_details", event.target.value)}
          className={cn(
            "min-h-32 w-full resize-none rounded-md border border-primary/20 bg-white px-3 py-2 text-sm",
            "focus:outline-none focus-visible:border-primary dark:bg-input/30",
            disabled && "pointer-events-none"
          )}
          readOnly={disabled}
        />
      </div>

      {/* Additional questions 37–44 */}
      <div className="my-4 overflow-hidden rounded-md border border-primary/20">
        <div className="grid grid-cols-[44px_minmax(0,1fr)_72px] items-center border-b border-primary/20 bg-muted/30">
          <span aria-hidden="true" />
          <span className="border-l border-primary/20 px-2 py-2 text-sm font-bold text-foreground/80">
            Additional questions
          </span>
          <div className="grid h-full grid-cols-2 place-items-center border-l border-primary/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              YES
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              NO
            </span>
          </div>
        </div>

        {ADDITIONAL_QUESTIONS.map((question) => (
          <div
            key={question.key}
            className="grid grid-cols-[44px_minmax(0,1fr)_72px] items-stretch border-b border-primary/10 last:border-b-0"
          >
            <span className="px-2 py-2 text-xs font-semibold text-primary/70">
              {question.num}.
            </span>
            <span className="border-l border-primary/20 px-2 py-2 text-xs leading-tight text-foreground/80">
              {question.text}
            </span>
            <div
              className={cn("grid grid-cols-2 place-items-center border-l border-primary/20", disabled && "pointer-events-none")}
              role="radiogroup"
              aria-label={question.text}
            >
              {(["yes", "no"] as const).map((answer) => (
                <label
                  key={answer}
                  className="cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`panama_${question.key}`}
                    checked={data[question.key] === answer}
                    onChange={() => update(question.key, answer)}
                    className="h-4 w-4 accent-primary"
                    aria-label={`${question.text} - ${answer === "yes" ? "Yes" : "No"}`}
                    tabIndex={disabled ? -1 : undefined}
                  />
                  <span className="sr-only">{answer === "yes" ? "Yes" : "No"}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Comments — directly below additional questions */}
      <div className="mt-6 space-y-2">
        <Label
          htmlFor="panama-declaration-comments"
          className="text-sm font-bold text-foreground/80"
        >
          Comments:
        </Label>
        <Textarea
          id="panama-declaration-comments"
          value={data.declaration_comments}
          onChange={(event) => update("declaration_comments", event.target.value)}
          className={cn(
            "min-h-32 w-full resize-none rounded-md border border-primary/20 bg-white px-3 py-2 text-sm",
            "focus:outline-none focus-visible:border-primary dark:bg-input/30",
            disabled && "pointer-events-none"
          )}
          readOnly={disabled}
        />
      </div>

      {/* Question 45 — Medication */}
      <div className="mt-6 overflow-hidden rounded-md border border-primary/20">
        <div className="grid grid-cols-[44px_minmax(0,1fr)_72px] items-center border-b border-primary/20 bg-muted/30">
          <span aria-hidden="true" />
          <span className="border-l border-primary/20" aria-hidden="true" />
          <div className="grid h-9 grid-cols-2 place-items-center border-l border-primary/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              YES
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              NO
            </span>
          </div>
        </div>
        <div className="grid grid-cols-[44px_minmax(0,1fr)_72px] items-stretch">
          <span className="px-2 py-2 text-xs font-semibold text-primary/70">45.</span>
          <span className="border-l border-primary/20 px-2 py-2 text-xs leading-tight text-foreground/80">
            Are you taking any non-prescription or prescription medications?
          </span>
          <div
            className={cn("grid grid-cols-2 place-items-center border-l border-primary/20", disabled && "pointer-events-none")}
            role="radiogroup"
            aria-label="Are you taking any non-prescription or prescription medications?"
          >
            {(["yes", "no"] as const).map((answer) => (
              <label
                key={answer}
                className="cursor-pointer"
              >
                <input
                  type="radio"
                  name="panama_question_45"
                  checked={data.question_45 === answer}
                  onChange={() => update("question_45", answer)}
                  className="h-4 w-4 accent-primary"
                  aria-label={`Medication question - ${answer === "yes" ? "Yes" : "No"}`}
                  tabIndex={disabled ? -1 : undefined}
                />
                <span className="sr-only">{answer === "yes" ? "Yes" : "No"}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label
          htmlFor="panama-medication-details"
          className="text-sm font-bold text-foreground/80"
        >
          If yes, please list the medications taken and the purpose(s) and dosage(s):
        </Label>
        <Textarea
          id="panama-medication-details"
          value={data.question_45_details}
          onChange={(event) => update("question_45_details", event.target.value)}
          className={cn(
            "min-h-32 w-full resize-none rounded-md border border-primary/20 bg-white px-3 py-2 text-sm",
            "focus:outline-none focus-visible:border-primary dark:bg-input/30",
            disabled && "pointer-events-none"
          )}
          readOnly={disabled}
        />
      </div>

      {/* Data related to Covid-19 */}
      <div className="mt-6 border-t border-primary/10 pt-4">
        <h3 className="mb-3 text-sm font-bold text-foreground/80">
          Data related to Covid-19
        </h3>

        <div className="overflow-hidden rounded-md border border-primary/20">
          {COVID_YES_NO_QUESTIONS.slice(0, 2).map(renderCovidYesNoQuestion)}

          {/* Covid Q3 — date field */}
          <div className="grid grid-cols-[44px_minmax(0,1fr)] items-stretch border-b border-primary/20 md:grid-cols-[44px_minmax(0,1fr)_260px]">
            <span className="px-2 py-3 text-xs font-semibold text-primary/70">3.</span>
            <span className="border-l border-primary/20 px-3 py-3 text-xs leading-snug text-foreground/80">
              When was the last time the Covid-19 test was performed?
            </span>
            <div className="col-span-2 flex items-center gap-2 border-t border-primary/20 px-3 py-2 md:col-span-1 md:border-l md:border-t-0">
              <Label
                htmlFor="panama-covid-last-test-date"
                className="whitespace-nowrap text-xs font-semibold text-foreground/70"
              >
                Day/month/year:
              </Label>
              <Input
                id="panama-covid-last-test-date"
                type="date"
                value={data.covid_3_date}
                onChange={(event) => update("covid_3_date", event.target.value)}
                className={cn(inputClasses, "min-w-0 flex-1")}
                readOnly={disabled}
                tabIndex={disabled ? -1 : undefined}
              />
            </div>
          </div>

          {renderCovidYesNoQuestion(COVID_YES_NO_QUESTIONS[2])}

          <div className="flex flex-col gap-2 border-b border-primary/20 px-3 py-2 sm:flex-row sm:items-center">
            <Label
              htmlFor="panama-covid-symptom-details"
              className="shrink-0 text-xs font-semibold text-foreground/70"
            >
              If the answer to the above question was &quot;Yes&quot;, please specify:
            </Label>
            <Input
              id="panama-covid-symptom-details"
              value={data.covid_4_details}
              onChange={(event) => update("covid_4_details", event.target.value)}
              className={cn(inputClasses, "min-w-0 flex-1")}
              readOnly={disabled}
              tabIndex={disabled ? -1 : undefined}
            />
          </div>

          {renderCovidYesNoQuestion(COVID_YES_NO_QUESTIONS[3])}

          {/* Covid Q6 — vaccine details */}
          <div className="grid grid-cols-[44px_minmax(0,1fr)] items-stretch md:grid-cols-[44px_minmax(0,1fr)_260px]">
            <span className="px-2 py-3 text-xs font-semibold text-primary/70">6.</span>
            <span className="border-l border-primary/20 px-3 py-3 text-xs leading-snug text-foreground/80">
              If the answer to the above question was &quot;Yes&quot;, please indicate the name of the vaccine, how many doses and boosters have you received?
            </span>
            <div className="col-span-2 space-y-3 border-t border-primary/20 px-3 py-3 md:col-span-1 md:border-l md:border-t-0">
              <div className="space-y-1">
                <Label
                  htmlFor="panama-covid-vaccine-type"
                  className="text-xs font-semibold text-foreground/70"
                >
                  Vaccine type:
                </Label>
                <Input
                  id="panama-covid-vaccine-type"
                  value={data.covid_6_vaccine_type}
                  onChange={(event) => update("covid_6_vaccine_type", event.target.value)}
                  className={cn(inputClasses, "w-full")}
                  readOnly={disabled}
                  tabIndex={disabled ? -1 : undefined}
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="panama-covid-dose-count"
                  className="text-xs font-semibold text-foreground/70"
                >
                  Number of doses:
                </Label>
                <Input
                  id="panama-covid-dose-count"
                  value={data.covid_6_num_doses}
                  onChange={(event) => update("covid_6_num_doses", event.target.value)}
                  className={cn(inputClasses, "w-full")}
                  readOnly={disabled}
                  tabIndex={disabled ? -1 : undefined}
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="panama-covid-boosters"
                  className="text-xs font-semibold text-foreground/70"
                >
                  Boosters:
                </Label>
                <Input
                  id="panama-covid-boosters"
                  value={data.covid_6_boosters}
                  onChange={(event) => update("covid_6_boosters", event.target.value)}
                  className={cn(inputClasses, "w-full")}
                  readOnly={disabled}
                  tabIndex={disabled ? -1 : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
