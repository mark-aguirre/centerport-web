"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { YesNoRadio } from "@/components/common/yes-no-radio";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import type { PanamaSectionProps, PanamaCertificate, YesNo } from "./types";

/** Medical conditions grid — Column 1 (items 1–18) */
const CONDITIONS_COL_1 = [
  { num: 1, label: "High blood pressure" },
  { num: 2, label: "Eye/Vision problem" },
  { num: 3, label: "Ear (hearing/tinnitus) nose/throat problems" },
  { num: 4, label: "Heart surgery" },
  { num: 5, label: "Varicose veins/ hemorrhoids" },
  { num: 6, label: "Asthma/bronchitis" },
  { num: 7, label: "Blood disorders" },
  { num: 8, label: "Diabetes" },
  { num: 9, label: "Thyroid problems" },
  { num: 10, label: "Digestive disorders" },
  { num: 11, label: "Kidney problems" },
  { num: 12, label: "Skin problems" },
  { num: 13, label: "Allergies" },
  { num: 14, label: "Epilepsy / seizures" },
  { num: 15, label: "Sickle-cell disease (or a close family member)" },
  { num: 16, label: "Hernias" },
  { num: 17, label: "Genital disorders" },
  { num: 18, label: "Pregnancy" },
];

/** Medical conditions grid — Column 2 (items 19–36) */
const CONDITIONS_COL_2 = [
  { num: 19, label: "Sleep Problem" },
  { num: 20, label: "Do you smoke, use alcohol or drugs?" },
  { num: 21, label: "Surgeries" },
  { num: 22, label: "Infectious diseases" },
  { num: 23, label: "Dizziness/fainting" },
  { num: 24, label: "Loss of consciousness" },
  { num: 25, label: "Psychiatric problems" },
  { num: 26, label: "Depression" },
  { num: 27, label: "Attempted suicide" },
  { num: 28, label: "Loss of memory" },
  { num: 29, label: "Balance problems" },
  { num: 30, label: "Severe headaches" },
  { num: 31, label: "Heart/vascular disease" },
  { num: 32, label: "Restricted mobility" },
  { num: 33, label: "Back or joint problems" },
  { num: 34, label: "Amputation" },
  { num: 35, label: "Fractures/dislocation" },
  { num: 36, label: "COVID-19" },
];

/** Additional questions (37–44) */
const ADDITIONAL_QUESTIONS = [
  { key: "question_37" as const, num: 37, text: "Have you ever been signed off due to illness or repatriated?" },
  { key: "question_38" as const, num: 38, text: "Have you ever been hospitalized?" },
  { key: "question_39" as const, num: 39, text: "Have you ever been declared unfit for sea duty?" },
  { key: "question_40" as const, num: 40, text: "Has your medical certificate ever been restricted or revoked?" },
  { key: "question_41" as const, num: 41, text: "Do you have any disease or ailment that you have not been asked about and you consider?" },
  { key: "question_42" as const, num: 42, text: "Do you feel healthy and fit to perform the duties of your designed position/occupation?" },
  { key: "question_43" as const, num: 43, text: "Are you allergic to any medications?" },
  { key: "question_44" as const, num: 44, text: "Are you allergic to any food or supplement alternative?" },
];

/** Covid-19 questions (1–5 with yes/no) */
const COVID_QUESTIONS = [
  { key: "covid_1" as const, num: 1, text: "Have you been in contact with any Covid-19 positive person in the last 03 months?" },
  { key: "covid_2" as const, num: 2, text: "Have you had Covid-19 tests?" },
  { key: "covid_4" as const, num: 4, text: "Have you had fever, cough, diarrhea, sore throat, shortness of breath, headache or weight loss in the last 30 days?" },
  { key: "covid_5" as const, num: 5, text: "Have you received vaccination for Covid-19?" },
];

/**
 * Panama Medical Certificate — Examinee's Personal Declaration section.
 *
 * Renders:
 * - A 2-column grid of 36 medical conditions with YES/NO radios
 * - Details textarea for positive answers
 * - Additional questions (37–44) with YES/NO
 * - Comments textarea
 * - Medication question (45) with YES/NO + details
 * - Data related to Covid-19 subsection
 */
export default function PersonalDeclarationSection({ data, onChange }: PanamaSectionProps) {
  const update = (field: keyof PanamaCertificate, value: string) =>
    onChange({ ...data, [field]: value });

  const updateCondition = (conditionKey: string, value: YesNo) => {
    const updatedConditions = { ...data.conditions, [conditionKey]: value };
    onChange({ ...data, conditions: updatedConditions });
  };

  const renderConditionRow = (item: { num: number; label: string }, index: number) => {
    const key = `condition_${item.num}`;
    const currentValue = (data.conditions[key] || "") as YesNo;
    const rowBg = index % 2 === 0 ? "bg-muted/30" : "";
    return (
      <div
        key={key}
        className={`grid grid-cols-[1fr_auto] items-center py-1.5 border-b border-muted/30 gap-2 px-1 rounded-sm ${rowBg}`}
      >
        <span className="text-xs text-foreground/80 leading-tight">
          <span className="font-semibold text-primary/70 mr-1">{item.num}</span>
          {item.label}
        </span>
        <YesNoRadio
          name={`panama_cond_${item.num}`}
          value={currentValue}
          onChange={(v) => updateCondition(key, v)}
          ariaLabel={item.label}
          uppercase
        />
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="Examinee's Personal Declaration"
        icon={FileText}
        subtitle="Have you ever had any of the following conditions?"
        className="mb-6"
      />

      {/* Conditions Grid — 2 columns */}
      <div className="mb-4 mt-6">
        {/* Column headers */}
        <div className="grid grid-cols-2 gap-4 mb-1">
          <div className="grid grid-cols-[1fr_auto] items-center gap-3 pr-14">
            <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">
              No. Condition
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">YES</span>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">NO</span>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-3 pr-14">
            <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">
              No. Condition
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">YES</span>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">NO</span>
            </div>
          </div>
        </div>

        {/* Condition rows */}
        <div className="grid grid-cols-2 gap-4">
          <div className="pr-14">{CONDITIONS_COL_1.map(renderConditionRow)}</div>
          <div className="pr-14">{CONDITIONS_COL_2.map(renderConditionRow)}</div>
        </div>
      </div>

      {/* Details for YES answers */}
      <div className="space-y-1 mb-4 border-t border-primary/10 pt-3">
        <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
          If any of the above questions were answered &quot;YES&quot;, please give details:
        </Label>
        <Textarea
          value={data.conditions_details}
          onChange={(e) => update("conditions_details", e.target.value)}
          className="h-20 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
          placeholder=""
        />
      </div>

      {/* Additional Questions (37–44) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-primary/20 pr-14">
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">
            No. Additional question
          </span>
          <div className="flex items-center gap-4 pr-0.5">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">YES</span>
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">NO</span>
          </div>
        </div>

        {ADDITIONAL_QUESTIONS.map((q, index) => (
          <div
            key={q.key}
            className={`flex items-center justify-between py-2 border-b border-muted/20 pr-14 px-1 rounded-sm ${index % 2 === 0 ? "bg-muted/30" : ""}`}
          >
            <span className="text-xs text-foreground/80 flex-1 pr-4">
              <span className="font-semibold text-primary/70 mr-1">{q.num}</span>
              {q.text}
            </span>
            <YesNoRadio
              name={`panama_${q.key}`}
              value={data[q.key]}
              onChange={(v) => update(q.key, v)}
              ariaLabel={q.text}
              uppercase
            />
          </div>
        ))}
      </div>

      {/* Comments */}
      <div className="space-y-1 mb-4">
        <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
          Comments:
        </Label>
        <Textarea
          value={data.declaration_comments}
          onChange={(e) => update("declaration_comments", e.target.value)}
          className="h-24 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
          placeholder=""
        />
      </div>

      {/* Question 45 — Medication */}
      <div className="border-t border-primary/10 pt-3 mb-4">
        <div className="flex items-center justify-between py-2 pr-14 px-1 rounded-sm bg-muted/30">
          <span className="text-xs text-foreground/80 flex-1 pr-4">
            <span className="font-semibold text-primary/70 mr-1">45</span>
            Are you taking any non-prescription or prescription medications
          </span>
          <YesNoRadio
            name="panama_question_45"
            value={data.question_45}
            onChange={(v) => update("question_45", v)}
            ariaLabel="Are you taking any non-prescription or prescription medications"
            uppercase
          />
        </div>

        <div className="space-y-1 mt-2">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            If yes, please list the medications taken and the purpose(s) and dosage(s):
          </Label>
          <Textarea
            value={data.question_45_details}
            onChange={(e) => update("question_45_details", e.target.value)}
            className="h-20 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
            placeholder=""
          />
        </div>
      </div>

      {/* Data related to Covid-19 */}
      <div className="border-t border-primary/10 pt-3">
        <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
          Data related to Covid-19
        </h3>

        {/* Covid questions with YES/NO */}
        {COVID_QUESTIONS.map((q, index) => (
          <div
            key={q.key}
            className={`flex items-center justify-between py-2 border-b border-muted/20 pr-14 px-1 rounded-sm ${index % 2 === 0 ? "bg-muted/30" : ""}`}
          >
            <span className="text-xs text-foreground/80 flex-1 pr-4">
              <span className="font-semibold text-primary/70 mr-1">{q.num}</span>
              {q.text}
            </span>
            <YesNoRadio
              name={`panama_${q.key}`}
              value={data[q.key]}
              onChange={(v) => update(q.key, v)}
              ariaLabel={q.text}
              uppercase
            />
          </div>
        ))}

        {/* Covid Q3 — date field */}
        <div className="flex items-center justify-between py-2 border-b border-muted/20">
          <span className="text-xs text-foreground/80 flex-1 pr-4">
            <span className="font-semibold text-primary/70 mr-1">3</span>
            When was the last time the Covid-19 test was performed?
          </span>
          <div className="shrink-0">
            <FormField
              label="Day/month/year"
              value={data.covid_3_date}
              onChange={(v) => update("covid_3_date", v)}
              type="date"
            />
          </div>
        </div>

        {/* Covid Q6 — vaccine details */}
        <div className="py-3 border-b border-muted/20">
          <span className="text-xs text-foreground/80">
            <span className="font-semibold text-primary/70 mr-1">6</span>
            If the answer to the above question was &quot;Yes&quot;, please indicate the name of the vaccine, how many doses and boosters have you received?
          </span>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <FormField
              label="Vaccine type"
              value={data.covid_6_vaccine_type}
              onChange={(v) => update("covid_6_vaccine_type", v)}
            />
            <FormField
              label="Number of doses"
              value={data.covid_6_num_doses}
              onChange={(v) => update("covid_6_num_doses", v)}
            />
            <FormField
              label="Boosters"
              value={data.covid_6_boosters}
              onChange={(v) => update("covid_6_boosters", v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
