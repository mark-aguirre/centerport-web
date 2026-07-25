"use client";

import { PastMedicalHistoryGrid } from "./PastMedicalHistoryGrid";
import { QuestionnaireGrid } from "./QuestionnaireGrid";
import { VitalsSection } from "./VitalsSection";
import { VisionSection } from "./VisionSection";
import { AudiometrySpeechSection } from "./AudiometrySpeechSection";
import { ConditionQuestionsSection } from "./ConditionQuestionsSection";
import { FindingsGrid } from "./FindingsGrid";
import { AncillaryExamsSection } from "./AncillaryExamsSection";
import { FinalRecommendationSection } from "./FinalRecommendationSection";
import { FitnessAssessmentSection } from "./FitnessAssessmentSection";
import type { MedicalSectionProps } from "./types";

/**
 * Physical Examination section orchestrator for the Medical Examination form.
 *
 * Composes the full PEME (Pre-Employment Medical Examination) physical
 * exam layout by rendering focused sub-sections in order:
 *
 * - Past Medical History (3-column Y/N condition grid)
 * - Questionnaire (Y/N questions 1-8 with medications detail)
 * - Physical Examination vitals (height, weight, BP, pulse, etc.)
 * - Vision (uncorrected/corrected, color vision, STCW compliance)
 * - Audiometry and Speech (hearing test results)
 * - Condition Questions (sea fitness, ID docs, look-out duties)
 * - Findings (A/B/C body system checkbox columns)
 * - Ancillary Examinations (lab/imaging results)
 * - Final Recommendation (certifications and remarks)
 * - Assessment of Fitness for Service at Sea (with dates)
 *
 * Each sub-section receives the full `MedicalSectionProps` and manages
 * its own slice of the form data.
 *
 * @see PersonalInfoSection — sibling section rendered before this one
 * @see useMedicalForm — hook providing data and onChange
 */
export default function PhysicalExaminationSection({
  data,
  onChange,
}: MedicalSectionProps) {
  return (
    <div className="space-y-3">
      <PastMedicalHistoryGrid data={data} onChange={onChange} />
      <QuestionnaireGrid data={data} onChange={onChange} />
      <VitalsSection data={data} onChange={onChange} />
      <VisionSection data={data} onChange={onChange} />
      <AudiometrySpeechSection data={data} onChange={onChange} />
      <ConditionQuestionsSection data={data} onChange={onChange} />
      <FindingsGrid data={data} onChange={onChange} />
      <AncillaryExamsSection data={data} onChange={onChange} />
      <FinalRecommendationSection data={data} onChange={onChange} />
      <FitnessAssessmentSection data={data} onChange={onChange} />
    </div>
  );
}
