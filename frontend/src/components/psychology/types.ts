/**
 * Data model for the Psychological Evaluation form.
 *
 * Matches the standard psychological evaluation form with:
 * - Patient Information
 * - Examination details (psychometrician, psychologist)
 * - Tests used (intelligence test, personal test, others)
 * - I. Intellectual Level (radio selection)
 * - II. Personality Traits and Characteristics (1-7 rating scale)
 * - III. Conclusion/Remarks
 *
 * Rating scale legend: 7=Very High, 6=High, 5=High Average,
 * 4=Average, 3=Low Average, 2=Low, 1=Very Low
 */

/** Gender options */
export type Gender = "Male" | "Female" | "";

/** Intellectual level classification */
export type IntellectualLevel =
  | "Very Superior"
  | "Superior"
  | "Above Average"
  | "Average"
  | "Below Average"
  | "Borderline"
  | "Mentally Deficient"
  | "";

/** Conclusion/recommendation options */
export type PsychologyConclusion =
  | "Recommended"
  | "For Further Evaluation"
  | "Not Recommended"
  | "";

/** Rating value (1-7 scale) or empty */
export type TraitRating = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "";

/**
 * Full psychological evaluation record.
 *
 * Personal info fields are populated from the linked SeafarerProfile.
 * Assessment fields are entered by the psychologist/psychometrician.
 */
export interface PsychologyRecord {
  // System fields
  id?: string;
  eval_id?: string;
  created_date?: string;
  updated_date?: string;

  // Patient Information (from SeafarerProfile)
  seafarer_profile_id: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  date_of_birth: string;
  age: string;
  gender: Gender;
  employer: string;
  position: string;

  // Examination Details
  date_of_examination: string;
  psychometrician: string;
  psychometrician_license_no: string;
  psychologist: string;
  psychologist_license_no: string;

  // Tests Used
  intelligence_test_used: boolean;
  intelligence_test_name: string;
  personal_test_used: boolean;
  personal_test_name: string;
  others_test_used: boolean;
  others_test_name: string;

  // I. Intellectual Level
  intellectual_level: IntellectualLevel;

  // II. Personality Traits and Characteristics
  // Sense of Responsibility
  trait_perseverance: TraitRating;
  trait_obedience: TraitRating;
  trait_self_discipline: TraitRating;
  trait_enthusiasm: TraitRating;
  trait_initiative: TraitRating;

  // Emotional Stability
  trait_withstand_boredom: TraitRating;
  trait_stress_tolerance: TraitRating;
  trait_faces_reality: TraitRating;
  trait_confidence: TraitRating;
  trait_relaxed: TraitRating;
  // Objectivity
  trait_tough_mindedness: TraitRating;
  trait_adaptability: TraitRating;
  trait_practicality: TraitRating;

  // Motivation
  trait_assertiveness: TraitRating;
  trait_independence: TraitRating;
  trait_resourcefulness: TraitRating;

  // Interpersonal and Personal Adjustment
  trait_teamwork: TraitRating;
  trait_deference: TraitRating;
  trait_self_esteem: TraitRating;
  trait_aggressive_tendencies: TraitRating;

  // Goal Orientation
  trait_goal_orientation: TraitRating;

  // III. Conclusion/Remarks
  conclusion: PsychologyConclusion;
  remarks: string;
}

/** Props shared by all psychology section components */
export interface PsychologySectionProps {
  data: PsychologyRecord;
  onChange: (data: PsychologyRecord) => void;
  disabled?: boolean;
}

/** Default empty record for new evaluations */
export const EMPTY_PSYCHOLOGY_RECORD: PsychologyRecord = {
  id: undefined,
  eval_id: undefined,
  created_date: undefined,
  updated_date: undefined,

  seafarer_profile_id: "",
  last_name: "",
  first_name: "",
  middle_name: "",
  date_of_birth: "",
  age: "",
  gender: "",
  employer: "",
  position: "",

  date_of_examination: "",
  psychometrician: "",
  psychometrician_license_no: "",
  psychologist: "",
  psychologist_license_no: "",

  intelligence_test_used: false,
  intelligence_test_name: "",
  personal_test_used: false,
  personal_test_name: "",
  others_test_used: false,
  others_test_name: "",

  intellectual_level: "",

  trait_perseverance: "",
  trait_obedience: "",
  trait_self_discipline: "",
  trait_enthusiasm: "",
  trait_initiative: "",

  trait_withstand_boredom: "",
  trait_stress_tolerance: "",
  trait_faces_reality: "",
  trait_confidence: "",
  trait_relaxed: "",

  trait_tough_mindedness: "",
  trait_adaptability: "",
  trait_practicality: "",

  trait_assertiveness: "",
  trait_independence: "",
  trait_resourcefulness: "",

  trait_teamwork: "",
  trait_deference: "",
  trait_self_esteem: "",
  trait_aggressive_tendencies: "",

  trait_goal_orientation: "",

  conclusion: "",
  remarks: "",
};
