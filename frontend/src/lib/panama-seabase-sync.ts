/**
 * Panama Certificate <-> Seabase (Medical Exam) data synchronization.
 *
 * "Seabase" in this application is the Medical module (`MedicalExam`,
 * `/api/medical-exams`). Panama certificates and medical exams are two
 * separate records linked by the same `seafarer_profile_id`. Several clinical
 * sections overlap and can be kept in step between the two records.
 *
 * This module is validated against what the actual form sections read/write
 * (not just the entity types), because the two forms use different field
 * names AND different value vocabularies for the same concept:
 *
 *   - Vitals: the Seabase "II. Physical Examination -" section writes the
 *     `pe_*` columns, so vitals map to those (not the flat `height`/`weight`).
 *   - Color vision: Seabase uses `adequate`/`defective`; Panama uses
 *     `Normal`/`Defective`/`Doubtful`/`Not tested` — needs a value transform.
 *   - Fitness / visual aid: both sides use `fit`/`unfit` and `yes`/`no`
 *     lowercase, so the medical status strings must be written back lowercase.
 *   - Fit for look-out: Seabase uses `yes`/`no`; Panama uses `fit`/`not_fit`
 *     — needs a value transform.
 *   - Certificate dates: Panama stores split day / month-abbreviation / year
 *     (`Jan`..`Dec`); the medical record stores an ISO `YYYY-MM-DD` string.
 *
 * Sections intentionally NOT synced:
 *   - Hearing (audiometry): Panama records seven frequencies per ear, the
 *     medical exam only a coarse pair — no lossless mapping.
 *   - Laboratory / ancillary results: the Panama diagnostic panel and the
 *     Seabase ancillary panel are largely different exams (only HIV overlaps),
 *     and the value models differ. Auto-syncing them risks silent data loss,
 *     so it is deliberately excluded until an explicit test-by-test mapping is
 *     defined.
 *
 * Both directions are derived from the same tables so they cannot drift:
 *   - {@link applyMedicalToPanama} — silent auto-refresh (Medical -> Panama).
 *   - {@link getChangedSyncFields} / {@link hasSyncedChanges} — detect whether
 *     an edit touches a synced field (drives the Panama-side confirmation).
 *   - {@link applyPanamaToMedical} — build the Medical update payload from a
 *     Panama record (Panama -> Medical, after the user confirms).
 *   - {@link hasMedicalVitalsChanges} / {@link applyMedicalVitalsToPanama} —
 *     the reverse vitals-only flow used by the Seabase page.
 */

import type {
  PanamaCertificate,
  PhysicalExplorationValue,
} from "@/components/panama/types";
import type { MedicalExam } from "@/components/medical/types";

/** Local alias for the Panama physical-exploration value ("N" | "A" | ""). */
type PanamaExplorationValue = PhysicalExplorationValue;

// ---------------------------------------------------------------------------
// Scalar field mappings (a Panama field <-> a Medical field, string valued)
// ---------------------------------------------------------------------------

/**
 * A single scalar field correspondence between the two records.
 *
 * When the value vocabularies differ, provide `toPanama` / `toMedical` to
 * translate. Without them the value is copied verbatim (correct for the
 * free-text fields such as vitals and visual-acuity readings).
 */
interface ScalarFieldMap {
  /** Key on the Panama certificate record. */
  panama: keyof PanamaCertificate;
  /** Key on the Medical exam record. */
  medical: keyof MedicalExam;
  /** Translate a medical value into the Panama vocabulary (import direction). */
  toPanama?: (medicalValue: string) => string;
  /** Translate a Panama value into the medical vocabulary (export direction). */
  toMedical?: (panamaValue: string) => string;
}

/**
 * Vitals / clinical data.
 *
 * Maps to the `pe_*` columns because those are the fields the Seabase
 * "II. Physical Examination -" section actually writes (see
 * `components/medical/VitalsSection.tsx`). `oxygen_saturation` has no field in
 * that section, so it is not part of this sync.
 */
const VITALS_FIELDS: ScalarFieldMap[] = [
  { panama: "height_cm", medical: "pe_height" },
  { panama: "weight_kg", medical: "pe_weight" },
  { panama: "bmi", medical: "pe_bmi" },
  { panama: "heart_rate", medical: "pe_pulse_rate" },
  { panama: "respiratory_rate", medical: "pe_respiration" },
  { panama: "blood_pressure_systolic", medical: "pe_bp_systolic" },
  { panama: "blood_pressure_diastolic", medical: "pe_bp_diastolic" },
];

/**
 * Vision / sight acuity — free-text readings on both sides.
 * unaided -> uncorrected, aided -> corrected, distant -> far, short -> near,
 * right -> od, left -> os. (Panama's "binocular" column has no medical source.)
 */
const VISION_ACUITY_FIELDS: ScalarFieldMap[] = [
  { panama: "sight_unaided_distant_right", medical: "vision_uncorrected_far_od" },
  { panama: "sight_unaided_distant_left", medical: "vision_uncorrected_far_os" },
  { panama: "sight_unaided_short_right", medical: "vision_uncorrected_near_od" },
  { panama: "sight_unaided_short_left", medical: "vision_uncorrected_near_os" },
  { panama: "sight_aided_distant_right", medical: "vision_corrected_far_od" },
  { panama: "sight_aided_distant_left", medical: "vision_corrected_far_os" },
  { panama: "sight_aided_short_right", medical: "vision_corrected_near_od" },
  { panama: "sight_aided_short_left", medical: "vision_corrected_near_os" },
];

/**
 * Color vision — different vocabularies.
 * Seabase: `adequate` / `defective`. Panama radio: `Not tested` / `Normal` /
 * `Doubtful` / `Defective`.
 */
const COLOR_VISION_FIELD: ScalarFieldMap = {
  panama: "sight_color_vision",
  medical: "vision_color",
  toPanama: (v) => {
    const s = v.trim().toLowerCase();
    if (s === "adequate") return "Normal";
    if (s === "defective") return "Defective";
    return "";
  },
  toMedical: (v) => {
    const s = v.trim().toLowerCase();
    if (s === "normal") return "adequate";
    if (s === "defective" || s === "doubtful") return "defective";
    return "";
  },
};

/**
 * Restriction details — free-text describing the restriction, shared verbatim.
 * Seabase shows `restriction_details` only when the recommendation includes a
 * restriction; Panama stores it in `fitness_restriction_details`.
 */
const RESTRICTION_DETAILS_FIELD: ScalarFieldMap = {
  panama: "fitness_restriction_details",
  medical: "restriction_details",
};

/** All scalar field mappings across the synced sections. */
const SCALAR_FIELDS: ScalarFieldMap[] = [
  ...VITALS_FIELDS,
  ...VISION_ACUITY_FIELDS,
  COLOR_VISION_FIELD,
  RESTRICTION_DETAILS_FIELD,
];

// ---------------------------------------------------------------------------
// Medical conditions mapping (Seabase Past Medical History <-> Panama
// Examinee's Personal Declaration)
// ---------------------------------------------------------------------------

/**
 * A correspondence between one Seabase "Past Medical History" condition and
 * the Panama "Examinee's Personal Declaration" condition(s) it maps to.
 *
 * The Seabase key is the human-readable label used as a key in the medical
 * record's `medical_history` map (see
 * `components/medical/PastMedicalHistoryGrid.tsx`). The Panama keys are the
 * semantic `storageKey` values written into `conditions` (see
 * `components/panama/PersonalDeclarationSection.tsx`).
 *
 * Both sides use the same lowercase `"yes"` / `"no"` vocabulary, so no value
 * transform is needed. When `panamaKeys` holds more than one entry the Seabase
 * condition is a broader grouping that Panama splits apart:
 *   - Import (Medical -> Panama): the single Seabase value fans out to every
 *     Panama split key.
 *   - Export (Panama -> Medical): the Seabase value is `"yes"` when ANY split
 *     key is `"yes"`, `"no"` when all splits are `"no"`, and "" otherwise.
 *
 * Seabase conditions with no Panama equivalent (Cancer or Tumor, Rheumatic
 * Fever, Last Menstrual Period, Gynecological Disorder) are intentionally
 * absent — mapping them would either lose meaning or write into an unrelated
 * Panama field.
 */
interface ConditionFieldMap {
  /** Key in the Seabase `medical_history` map (its display label). */
  medicalKey: string;
  /** One or more Panama `conditions` storage keys this maps to. */
  panamaKeys: string[];
}

const CONDITION_FIELDS: ConditionFieldMap[] = [
  { medicalKey: "High Blood Pressure", panamaKeys: ["high_blood_pressure"] },
  { medicalKey: "Trachoma, other eye Disorders", panamaKeys: ["eye_vision_problem"] },
  { medicalKey: "Deafness, other Ear Disorders", panamaKeys: ["ear_problem"] },
  // Seabase groups nose + throat; Panama keeps them separate.
  { medicalKey: "Nose or Throat Disorders", panamaKeys: ["nose_problem", "throat_problem"] },
  { medicalKey: "Asthma", panamaKeys: ["asthma_bronchitis"] },
  { medicalKey: "Blood Disorders", panamaKeys: ["blood_disorders"] },
  { medicalKey: "Diabetes Mellitus", panamaKeys: ["diabetes"] },
  { medicalKey: "Other Endocrine Disorders (e.g. Goiter)", panamaKeys: ["thyroid_problems"] },
  // Seabase splits stomach vs other abdominal; both map to Panama's digestive.
  { medicalKey: "Stomach Pain, Gastritis or Ulcer", panamaKeys: ["digestive_disorders"] },
  { medicalKey: "Other Abdominal Disorders", panamaKeys: ["digestive_disorders"] },
  { medicalKey: "Kidney or Bladder Disorder", panamaKeys: ["kidney_problems"] },
  { medicalKey: "Allergies (Specify):", panamaKeys: ["allergies"] },
  { medicalKey: "Fainting Spells, Fits, Seizures or other Neurological Disorders", panamaKeys: ["epilepsy_seizures"] },
  { medicalKey: "Insomnia or sleep disorders, Manias, Phobias", panamaKeys: ["sleep_problem"] },
  // Partial match: genetic/hereditary disorders <-> sickle-cell disease.
  { medicalKey: "Genetic, Hereditary or Familial Disorders", panamaKeys: ["sickle_cell_disease"] },
  { medicalKey: "Sexually Transmitted Diseases", panamaKeys: ["genital_disorders"] },
  { medicalKey: "Operations (Specify)", panamaKeys: ["surgeries"] },
  // Several Seabase infectious/tropical conditions collapse into Panama's
  // single "Infectious diseases" item.
  { medicalKey: "Tuberculosis", panamaKeys: ["infectious_diseases"] },
  { medicalKey: "Tropical Diseases", panamaKeys: ["infectious_diseases"] },
  { medicalKey: "Schistosomiasis", panamaKeys: ["infectious_diseases"] },
  { medicalKey: "Frequent Dizziness", panamaKeys: ["dizziness_fainting"] },
  // Seabase groups depression + other mental disorders; Panama splits into
  // psychiatric problems and depression.
  { medicalKey: "Depression, other Mental Disorders", panamaKeys: ["psychiatric_problems", "depression"] },
  { medicalKey: "Frequent Headaches", panamaKeys: ["severe_headaches"] },
  { medicalKey: "Heart Disease/Heart Pain", panamaKeys: ["heart_vascular_disease"] },
  // Seabase groups back + joint; Panama keeps them separate.
  { medicalKey: "Back Injury: Joint Pain/Arthritis/Rheumatism", panamaKeys: ["back_problem", "joint_problem"] },
  // Closest available match: head/neck injury -> fractures/dislocation.
  { medicalKey: "Head or Neck Injury", panamaKeys: ["fractures_dislocation"] },
];

/** Normalise a stored condition answer to `"yes"`, `"no"`, or "". */
function normalizeYesNo(value: unknown): "yes" | "no" | "" {
  const v = typeof value === "string" ? value.trim().toLowerCase() : "";
  return v === "yes" || v === "no" ? v : "";
}

/**
 * Combine several Panama split answers into a single Seabase answer.
 * `"yes"` if any split is yes; `"no"` if all present splits are no; "" when no
 * split has a recorded answer.
 */
function combinePanamaConditions(values: Array<"yes" | "no" | "">): "yes" | "no" | "" {
  if (values.some((v) => v === "yes")) return "yes";
  if (values.some((v) => v === "no")) return "no";
  return "";
}

// ---------------------------------------------------------------------------
// Additional-questions mapping (Seabase questionnaire <-> Panama question_NN)
// ---------------------------------------------------------------------------

/**
 * The Seabase (Medical) `questionnaire` map keys questions by their full
 * display text; Panama stores the same medical-history questions as discrete
 * `question_37`..`question_45` enum fields. This table pairs the two so a
 * yes/no answer recorded on either form carries over to the other.
 *
 * Wording differs slightly between the forms (e.g. Seabase "signed off as sick
 * or repatriated from a ship" vs Panama "signed off due to illness or
 * repatriated"); the pairing is by meaning, matching the equivalence the
 * business defined:
 *
 *   Seabase 1  <-> Panama 37   signed off / repatriated
 *   Seabase 2  <-> Panama 38   hospitalized
 *   Seabase 3  <-> Panama 39   declared unfit for sea duty
 *   Seabase 4  <-> Panama 40   medical certificate restricted or revoked
 *   Seabase 5  <-> Panama 41   aware of a medical problem / disease (closest)
 *   Seabase 6  <-> Panama 42   feel healthy and fit for duties
 *   Seabase 7  <-> Panama 43   allergic to medication
 *   Seabase 8  <-> Panama 45   taking prescription / non-prescription meds
 *
 * Panama 44 ("allergic to any food or supplement alternative?") has no Seabase
 * equivalent and is intentionally left out — like the unmapped Seabase
 * conditions above, it is never touched by the sync.
 */
interface QuestionFieldMap {
  /** Seabase question number (for detail labels and audit context). */
  seabaseNum: number;
  /** Key in the Seabase `questionnaire` map (its display label). */
  medicalKey: string;
  /**
   * Key in the Seabase `questionnaire` map holding the free-text detail for
   * this question (the "<question> Details" entry), when one exists.
   */
  detailKey?: string;
  /** The Panama certificate field that stores the same question. */
  panamaKey: keyof PanamaCertificate;
  /**
   * Partial mappings (per the mapping spec, Seabase Q5 -> Panama Q41): the two
   * questions are not identical, so only a Seabase `"yes"` is carried over
   * (and flagged for review via the appended detail). A Seabase `"no"` must
   * NOT set the Panama answer to `"no"` — it is left for manual confirmation.
   */
  partial?: boolean;
}

const QUESTION_FIELDS: QuestionFieldMap[] = [
  {
    seabaseNum: 1,
    medicalKey: "Have you ever been signed off as sick or repatriated from a ship?",
    detailKey: "Have you ever been signed off as sick or repatriated from a ship? Details",
    panamaKey: "question_37",
  },
  {
    seabaseNum: 2,
    medicalKey: "Have you ever been hospitalized?",
    detailKey: "Have you ever been hospitalized? Details",
    panamaKey: "question_38",
  },
  {
    seabaseNum: 3,
    medicalKey: "Have you ever been declared unfit for sea duty?",
    detailKey: "Have you ever been declared unfit for sea duty? Details",
    panamaKey: "question_39",
  },
  {
    seabaseNum: 4,
    medicalKey: "Has your medical certificate ever been restricted or revoked?",
    detailKey: "Has your medical certificate ever been restricted or revoked? Details",
    panamaKey: "question_40",
  },
  {
    // Partial: Seabase "aware of a medical problem" is broader than Panama's
    // "disease or ailment not asked about". Only a Yes carries over.
    seabaseNum: 5,
    medicalKey: "Are you aware that you have any medical problem, disease or illness?",
    detailKey: "Are you aware that you have any medical problem, disease or illness? Details",
    panamaKey: "question_41",
    partial: true,
  },
  {
    seabaseNum: 6,
    medicalKey: "Do you feel healthy and fit to perform the duties of your designated position/occupation?",
    detailKey: "Do you feel healthy and fit to perform the duties of your designated position/occupation? Details",
    panamaKey: "question_42",
  },
  {
    // Seabase Q7 has no per-question detail box in the questionnaire grid.
    seabaseNum: 7,
    medicalKey: "Are you allergic to any medication?",
    panamaKey: "question_43",
  },
  {
    // Seabase stores the medication question under a dedicated constant key
    // (MEDICATION_QUESTION_KEY in medical/QuestionnaireGrid.tsx); its list of
    // medications lives in the separate `questionnaire_medications_detail`
    // field, mapped to Panama `question_45_details` below.
    seabaseNum: 8,
    medicalKey: "Non-prescription or prescription medication",
    panamaKey: "question_45",
  },
];

/** Panama field carrying the "list your medications" free text (Seabase Q8). */
const PANAMA_MEDICATION_DETAIL_FIELD: keyof PanamaCertificate = "question_45_details";
/** Panama field carrying the additional-questions comments block. */
const PANAMA_DECLARATION_COMMENTS_FIELD: keyof PanamaCertificate = "declaration_comments";

/**
 * Append `addition` to an existing free-text `base` without overwriting it, per
 * the merge rules (never silently replace existing Panama comments/details).
 * Returns the merged string; skips the append when it is already present.
 */
function appendText(base: string, addition: string): string {
  const existing = (base ?? "").trim();
  const extra = (addition ?? "").trim();
  if (!extra) return existing;
  if (!existing) return extra;
  if (existing.includes(extra)) return existing;
  return `${existing}\n${extra}`;
}

/**
 * Build the labelled free-text block carrying Seabase's per-question details
 * (Q1–Q6) into a Panama details/comments field. Each non-empty Seabase detail
 * is emitted with its Seabase question number and label so nothing is merged
 * without attribution (mapping spec §2.2).
 */
function buildQuestionDetailBlock(questionnaire: Record<string, string>): string {
  const lines: string[] = [];
  for (const { seabaseNum, medicalKey, detailKey } of QUESTION_FIELDS) {
    if (!detailKey) continue;
    const detail = (questionnaire[detailKey] ?? "").trim();
    if (detail) {
      lines.push(`Seabase Q${seabaseNum} (${medicalKey}): ${detail}`);
    }
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Physical-examination mapping (Seabase Findings <-> Panama Physical
// Exploration)
// ---------------------------------------------------------------------------

/**
 * A correspondence between one Seabase "Physical Examination Findings" body
 * system and the Panama "Physical Exploration" row(s) it maps to.
 *
 * Storage & value models differ, so the mapping is transformed rather than
 * copied:
 *   - Seabase stores each body system in a per-column boolean map
 *     (`findings_a` / `findings_b` / `findings_c`), where a CHECKED box means
 *     a NORMAL finding. Abnormal detail lives in the parallel
 *     `findings_*_remarks` free-text map (there is no first-class "abnormal"
 *     flag on the checkbox itself).
 *   - Panama stores each row in the `physical_exploration` map with an explicit
 *     `"N"` (Normal) / `"A"` (Abnormal) / "" (unset) value.
 *
 * Value translation (see {@link seabaseFindingToPanama} /
 * {@link combinePanamaExploration}):
 *   - Import (Medical -> Panama): checked -> "N"; unchecked WITH a remark ->
 *     "A"; unchecked with no remark -> unrecorded (skipped). Treating a bare
 *     unchecked box as "A" would fabricate an abnormal finding for rows the
 *     examiner never touched, so it is deliberately skipped (mapping spec
 *     safety rule: missing data is not a negative/normal result).
 *   - Export (Panama -> Medical): "N" -> checked (true); "A" -> unchecked
 *     (false); "" -> unrecorded (skipped). Any abnormal note the examiner typed
 *     on the Panama comments is not split back per-row, so existing Seabase
 *     remarks are preserved.
 *
 * When `panamaKeys` holds more than one entry the Seabase finding is a broader
 * grouping Panama splits apart (Mouth+Throat, Lungs+Chest):
 *   - Import: the single Seabase value fans out to every Panama row.
 *   - Export: the rows collapse back — "A" if ANY split is abnormal, "N" if all
 *     present splits are normal, unrecorded otherwise.
 */
type FindingsColumn = "findings_a" | "findings_b" | "findings_c";

interface PhysicalExamFieldMap {
  /** Which Seabase findings column the source lives in. */
  medicalColumn: FindingsColumn;
  /** Key in that findings column's map (its display label). */
  medicalKey: string;
  /** One or more Panama `physical_exploration` keys this maps to. */
  panamaKeys: string[];
}

const PHYSICAL_EXAM_FIELDS: PhysicalExamFieldMap[] = [
  { medicalColumn: "findings_a", medicalKey: "Head, Scalp", panamaKeys: ["head"] },
  // Seabase groups mouth + throat; Panama keeps them separate.
  { medicalColumn: "findings_a", medicalKey: "Mouth, Throat", panamaKeys: ["mouth", "throat"] },
  { medicalColumn: "findings_a", medicalKey: "Nose, Sinuses", panamaKeys: ["nose"] },
  { medicalColumn: "findings_c", medicalKey: "Dental (Teeth/gums)", panamaKeys: ["dental_exam"] },
  { medicalColumn: "findings_a", medicalKey: "Ears", panamaKeys: ["ears_general"] },
  { medicalColumn: "findings_a", medicalKey: "Eyes External", panamaKeys: ["eyes"] },
  { medicalColumn: "findings_a", medicalKey: "Pupils", panamaKeys: ["pupils"] },
  // Seabase groups chest + lungs; Panama keeps them separate.
  { medicalColumn: "findings_b", medicalKey: "Chest and Lungs", panamaKeys: ["lungs", "chest"] },
  { medicalColumn: "findings_b", medicalKey: "Breast, Axilla", panamaKeys: ["breast_examination"] },
  { medicalColumn: "findings_b", medicalKey: "Heart", panamaKeys: ["heart"] },
  { medicalColumn: "findings_a", medicalKey: "Skin", panamaKeys: ["skin"] },
  { medicalColumn: "findings_b", medicalKey: "Abdomen", panamaKeys: ["abdomen_and_viscera"] },
  { medicalColumn: "findings_c", medicalKey: "Anus, Rectum", panamaKeys: ["anus_not_rectal_exam"] },
  { medicalColumn: "findings_c", medicalKey: "Genito-Urinary System", panamaKeys: ["gu_system"] },
  { medicalColumn: "findings_c", medicalKey: "Extremities", panamaKeys: ["upper_and_lower"] },
  { medicalColumn: "findings_b", medicalKey: "Back", panamaKeys: ["spine_cervical_thoracic_lumbar"] },
  { medicalColumn: "findings_c", medicalKey: "Reflexes", panamaKeys: ["neurologic_full_brief"] },
];

/**
 * Translate a Seabase finding (checkbox + remark) into a Panama exploration
 * value. `"N"` when the box is checked (normal); `"A"` when unchecked but a
 * remark records an abnormal finding; "" (skip) when unchecked with no remark,
 * since that is an unrecorded row rather than a confirmed abnormal result.
 */
function seabaseFindingToPanama(
  checked: unknown,
  remark: unknown
): PanamaExplorationValue {
  if (checked === true) return "N";
  const hasRemark = typeof remark === "string" && remark.trim() !== "";
  return hasRemark ? "A" : "";
}

/** Normalise a stored Panama exploration answer to `"N"`, `"A"`, or "". */
function normalizeExploration(value: unknown): PanamaExplorationValue {
  return value === "N" || value === "A" ? value : "";
}

/**
 * Combine several Panama split exploration answers into a single Seabase
 * finding. `"A"` if any split is abnormal; `"N"` if all present splits are
 * normal; "" when no split has a recorded answer.
 */
function combinePanamaExploration(
  values: PanamaExplorationValue[]
): PanamaExplorationValue {
  if (values.some((v) => v === "A")) return "A";
  if (values.some((v) => v === "N")) return "N";
  return "";
}

// ---------------------------------------------------------------------------
// Fitness assessment mapping
// ---------------------------------------------------------------------------

/**
 * Correspondence between a Panama fitness service (a fit/unfit boolean pair)
 * and the single Medical `fitness_*_services` string column.
 */
interface FitnessFieldMap {
  fitField: keyof PanamaCertificate;
  unfitField: keyof PanamaCertificate;
  medical: keyof MedicalExam;
}

const FITNESS_FIELDS: FitnessFieldMap[] = [
  { fitField: "fitness_deck_fit", unfitField: "fitness_deck_unfit", medical: "fitness_deck_services" },
  { fitField: "fitness_engine_fit", unfitField: "fitness_engine_unfit", medical: "fitness_engine_services" },
  { fitField: "fitness_catering_fit", unfitField: "fitness_catering_unfit", medical: "fitness_catering_services" },
  { fitField: "fitness_other_fit", unfitField: "fitness_other_unfit", medical: "fitness_other_services" },
];

/**
 * Convert a Panama fit/unfit boolean pair into a Medical status string.
 * Lowercase to match the Seabase fitness radios (`fit` / `unfit`).
 */
function fitnessPairToMedical(fit: boolean, unfit: boolean): string {
  if (fit && !unfit) return "fit";
  if (unfit && !fit) return "unfit";
  return "";
}

/** Convert a Medical fitness status string into a fit/unfit boolean pair. */
function medicalToFitnessPair(value: string | undefined): { fit: boolean; unfit: boolean } {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "fit") return { fit: true, unfit: false };
  if (v === "unfit") return { fit: false, unfit: true };
  return { fit: false, unfit: false };
}

/**
 * Fit-for-look-out determination. The two forms use different vocabularies for
 * the same concept:
 *   - Seabase (Medical) `fit_for_lookout`: `yes` / `no`.
 *   - Panama `fitness_lookout`: `fit` / `not_fit`.
 * These translate between them in each direction. An unrecognised value maps
 * to "" so a blank/unknown state is never fabricated into a positive answer.
 */
function lookoutMedicalToPanama(value: string | undefined): string {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "yes") return "fit";
  if (v === "no") return "not_fit";
  return "";
}

/** Translate a Panama look-out value (`fit`/`not_fit`) into Seabase `yes`/`no`. */
function lookoutPanamaToMedical(value: string | undefined): string {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "fit") return "yes";
  if (v === "not_fit") return "no";
  return "";
}

/**
 * Restriction choice. The two forms express the same assessment differently:
 *   - Seabase (Medical) `final_recommendation`: a dropdown whose relevant
 *     values are `FIT FOR SEA DUTY` / `FIT TO WORK` (no restrictions),
 *     `FIT WITH RESTRICTION` (restricted), and `UNFIT`.
 *   - Panama `fitness_restriction`: `without` / `with` / "".
 * Map the Seabase recommendation onto the Panama restriction checkbox:
 *   - A fit recommendation (`FIT FOR SEA DUTY` / `FIT TO WORK`) -> `without`.
 *   - A restricted recommendation (contains `RESTRICTION`) -> `with`.
 *   - `UNFIT` or any other value -> "" (neither restriction box applies to an
 *     unfit assessment, so nothing is fabricated).
 */
function recommendationMedicalToPanamaRestriction(value: string | undefined): string {
  const v = (value ?? "").trim().toUpperCase();
  if (!v) return "";
  if (v.includes("UNFIT")) return "";
  if (v.includes("RESTRICTION")) return "with";
  if (v.includes("FIT")) return "without";
  return "";
}

// ---------------------------------------------------------------------------
// Fitness / certification date mapping
// ---------------------------------------------------------------------------

/**
 * Correspondence between a Panama split date (day / month-abbreviation / year)
 * and a single Medical ISO-ish date string column.
 */
interface DateFieldMap {
  dayField: keyof PanamaCertificate;
  monthField: keyof PanamaCertificate;
  yearField: keyof PanamaCertificate;
  medical: keyof MedicalExam;
}

const DATE_FIELDS: DateFieldMap[] = [
  { dayField: "cert_issued_day", monthField: "cert_issued_month", yearField: "cert_issued_year", medical: "date_of_fitness" },
  { dayField: "cert_expiry_day", monthField: "cert_expiry_month", yearField: "cert_expiry_year", medical: "valid_until" },
];

/**
 * Month abbreviations used by the Panama certificate date dropdowns.
 * Index 0 = January, matching `components/panama/constants.ts` MONTH_OPTIONS.
 */
const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Two-digit zero pad for day/month components. */
function pad2(value: string): string {
  const n = value.trim();
  if (!n) return "";
  return n.length === 1 ? `0${n}` : n;
}

/**
 * Compose a Panama split date into a `YYYY-MM-DD` string for the medical exam.
 * The Panama month is an abbreviation (`Jan`..`Dec`); it is converted back to a
 * two-digit number. Returns "" unless all three components resolve.
 */
function composeDate(day: string, monthAbbr: string, year: string): string {
  const d = pad2(day);
  const y = year.trim();
  const monthIndex = MONTH_ABBR.findIndex(
    (m) => m.toLowerCase() === monthAbbr.trim().toLowerCase()
  );
  if (!d || !y || monthIndex < 0) return "";
  const m = pad2(String(monthIndex + 1));
  return `${y}-${m}-${d}`;
}

/**
 * Decompose a medical `YYYY-MM-DD` (or otherwise parseable) date into Panama
 * day / month-abbreviation / year components. Returns empty components on an
 * unparseable value.
 */
function decomposeDate(value: string | undefined): { day: string; month: string; year: string } {
  const empty = { day: "", month: "", year: "" };
  if (!value || !value.trim()) return empty;

  let year: number;
  let monthNumber: number;
  let day: number;

  const iso = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    year = Number(iso[1]);
    monthNumber = Number(iso[2]);
    day = Number(iso[3]);
  } else {
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) return empty;
    year = parsed.getFullYear();
    monthNumber = parsed.getMonth() + 1;
    day = parsed.getDate();
  }

  const monthAbbr = MONTH_ABBR[monthNumber - 1];
  if (!monthAbbr) return empty;
  return { day: String(day), month: monthAbbr, year: String(year) };
}

// ---------------------------------------------------------------------------
// Public: Medical -> Panama (silent auto-refresh / import)
// ---------------------------------------------------------------------------

/**
 * Produce a copy of a Panama record with all synced sections refreshed from
 * the given medical (Seabase) record. Only overlapping fields are touched;
 * every other Panama field is left exactly as-is.
 *
 * Used for the silent auto-import when a patient loads on the Panama page.
 *
 * @param panama  the current Panama record
 * @param medical the latest medical exam for the same seafarer (or null)
 * @returns a new Panama record with synced fields populated from `medical`
 */
export function applyMedicalToPanama(
  panama: PanamaCertificate,
  medical: MedicalExam | null | undefined
): PanamaCertificate {
  if (!medical) return panama;

  const next: PanamaCertificate = { ...panama };

  // Scalar sections (vitals + vision acuity + color vision). A present medical
  // value is copied/translated in; an empty medical value leaves Panama as-is.
  for (const { panama: pKey, medical: mKey, toPanama } of SCALAR_FIELDS) {
    const raw = medical[mKey];
    if (typeof raw === "string" && raw.trim() !== "") {
      (next[pKey] as unknown) = toPanama ? toPanama(raw) : raw;
    }
  }

  // Fitness: derive fit/unfit boolean pairs from the medical status strings.
  for (const { fitField, unfitField, medical: mKey } of FITNESS_FIELDS) {
    const value = medical[mKey];
    if (typeof value === "string" && value.trim() !== "") {
      const { fit, unfit } = medicalToFitnessPair(value);
      (next[fitField] as unknown) = fit;
      (next[unfitField] as unknown) = unfit;
    }
  }

  // Fit for look-out. An UNFIT final recommendation forces "Not fit for
  // look-out duty" (an unfit seafarer cannot be fit for look-out), overriding
  // the Seabase fit_for_lookout answer. Otherwise the recorded fit_for_lookout
  // answer is translated in (yes -> fit, no -> not_fit); an empty/unknown
  // value leaves Panama as-is.
  const recommendationUnfit =
    typeof medical.final_recommendation === "string" &&
    medical.final_recommendation.trim().toUpperCase().includes("UNFIT");
  if (recommendationUnfit) {
    (next.fitness_lookout as unknown) = "not_fit";
  } else if (typeof medical.fit_for_lookout === "string" && medical.fit_for_lookout.trim() !== "") {
    const lookout = lookoutMedicalToPanama(medical.fit_for_lookout);
    if (lookout) {
      (next.fitness_lookout as unknown) = lookout;
    }
  }

  // Restriction choice (Seabase recommendation -> Panama without/with). A fit
  // recommendation checks "Without restrictions"; a restricted one checks
  // "With restrictions". UNFIT / blank leave Panama as-is so an unfit
  // assessment never fabricates a restriction box.
  if (typeof medical.final_recommendation === "string" && medical.final_recommendation.trim() !== "") {
    const restriction = recommendationMedicalToPanamaRestriction(medical.final_recommendation);
    if (restriction) {
      (next.fitness_restriction as unknown) = restriction;
    }
  }

  // Visual aids required (yes/no).
  if (typeof medical.visual_aids_required === "string" && medical.visual_aids_required.trim() !== "") {
    const v = medical.visual_aids_required.trim().toLowerCase();
    if (v === "yes" || v === "no") {
      (next.fitness_visual_aid as unknown) = v;
    }
  }

  // Dates: decompose medical date strings into Panama day/month/year fields.
  for (const { dayField, monthField, yearField, medical: mKey } of DATE_FIELDS) {
    const value = medical[mKey];
    if (typeof value === "string" && value.trim() !== "") {
      const { day, month, year } = decomposeDate(value);
      if (day && month && year) {
        (next[dayField] as unknown) = day;
        (next[monthField] as unknown) = month;
        (next[yearField] as unknown) = year;
      }
    }
  }

  // Physician: Panama's combined "name and registration" is sourced from the
  // Seabase authorized physician. Matches the format Panama's own physician
  // picker produces ("Name — Registration"). Import-only: the combined string
  // is not split back into the two medical fields on export.
  const physicianName = composePhysicianName(medical);
  if (physicianName) {
    (next.physician_name as unknown) = physicianName;
  }

  // III. Statement — import-only auto-population from Seabase.
  //
  // These identity/date fields are derived from the seafarer and the medical
  // exam, not entered on the Panama form, so they are refreshed on import but
  // never carried back to Seabase (not part of SCALAR_FIELDS) and never raise
  // the "update Seabase too?" prompt. Each value is only filled when it is
  // currently blank, so an examiner's manual edit is never overwritten.
  applyStatementFromMedical(next, medical);

  // Diagnostic "Other test" performed dates (Chest X-ray, EKG) <- the Seabase
  // PEME date. Import-only and fill-if-blank, like the Statement fields.
  applyOtherTestDatesFromMedical(next, medical);

  // Medical conditions: fan a recorded Seabase answer out to its Panama
  // declaration key(s). An unrecorded Seabase answer leaves Panama as-is.
  const history = medical.medical_history ?? {};
  const conditions = { ...next.conditions };
  let conditionsChanged = false;
  for (const { medicalKey, panamaKeys } of CONDITION_FIELDS) {
    const answer = normalizeYesNo(history[medicalKey]);
    if (!answer) continue;
    for (const key of panamaKeys) {
      conditions[key] = answer;
      conditionsChanged = true;
    }
  }
  if (conditionsChanged) {
    next.conditions = conditions;
  }

  // Additional questions: copy a recorded Seabase answer into its Panama
  // question field. An unrecorded Seabase answer leaves Panama as-is. Partial
  // mappings (Q5 -> Q41) only carry a "yes" over; a Seabase "no" is left for
  // manual confirmation rather than assumed to exclude the broader Panama
  // question.
  const questionnaire = medical.questionnaire ?? {};
  for (const { medicalKey, panamaKey, partial } of QUESTION_FIELDS) {
    const answer = normalizeYesNo(questionnaire[medicalKey]);
    if (!answer) continue;
    if (partial && answer !== "yes") continue;
    (next[panamaKey] as unknown) = answer;
  }

  // Medication list (Seabase Q8 detail) -> Panama "list your medications".
  const medicationDetail = String(medical.questionnaire_medications_detail ?? "").trim();
  if (medicationDetail) {
    (next[PANAMA_MEDICATION_DETAIL_FIELD] as unknown) = appendText(
      String(next[PANAMA_MEDICATION_DETAIL_FIELD] ?? ""),
      medicationDetail
    );
  }

  // Per-question details (Q1–Q6) + questionnaire comments -> Panama's
  // additional-questions comments, labelled and appended (never overwritten).
  const detailBlock = buildQuestionDetailBlock(questionnaire);
  const seabaseComments = String(medical.questionnaire_comments ?? "").trim();
  let mergedComments = String(next[PANAMA_DECLARATION_COMMENTS_FIELD] ?? "");
  if (detailBlock) mergedComments = appendText(mergedComments, detailBlock);
  if (seabaseComments) {
    mergedComments = appendText(mergedComments, `Seabase comments: ${seabaseComments}`);
  }
  if (mergedComments.trim() !== String(next[PANAMA_DECLARATION_COMMENTS_FIELD] ?? "").trim()) {
    (next[PANAMA_DECLARATION_COMMENTS_FIELD] as unknown) = mergedComments;
  }

  // Physical exploration: translate each recorded Seabase finding into its
  // Panama row(s). Unrecorded findings (unchecked with no remark) are skipped
  // so Panama rows the examiner never touched are left as-is.
  const exploration = { ...next.physical_exploration };
  let explorationChanged = false;
  for (const { medicalColumn, medicalKey, panamaKeys } of PHYSICAL_EXAM_FIELDS) {
    const checked = medical[medicalColumn]?.[medicalKey];
    const remark = medical[`${medicalColumn}_remarks` as keyof MedicalExam] as
      | Record<string, string>
      | undefined;
    const value = seabaseFindingToPanama(checked, remark?.[medicalKey]);
    if (!value) continue;
    for (const key of panamaKeys) {
      exploration[key] = value;
      explorationChanged = true;
    }
  }
  if (explorationChanged) {
    next.physical_exploration = exploration;
  }

  return next;
}

/**
 * Build Panama's "Physician's name and registration" value from a medical
 * record's authorized physician. Returns the name alone when no registration
 * (medical certification no.) is recorded, or "" when there is no physician.
 */
function composePhysicianName(medical: MedicalExam): string {
  const name = String(medical.authorized_physician ?? "").trim();
  if (!name) return "";
  const registration = String(medical.medical_certification_no ?? "").trim();
  return registration ? `${name} — ${registration}` : name;
}

/**
 * Populate the Panama "III. Statement" identity and date fields from the
 * seafarer and the Seabase medical exam. Import-only — these are derived
 * values, so they are only written when the destination is currently blank
 * (an examiner's manual edit is never overwritten) and are never carried back
 * to Seabase.
 *
 * Field sources:
 *   - "Name and signature of person undergoing examination" (both the
 *     examinee and practitioner blocks) <- the patient full name already on
 *     the Panama record (e.g. "MUTUC, JOHN REY, LOPEZ").
 *   - "Name and signature of Witness" (both blocks) and the "release ... to
 *     Dr." line <- the Seabase authorized physician.
 *   - Statement date and practitioner date (day / month-abbr / year) <- the
 *     Seabase date of the PEME. The explicit "Date of Initial PEME"
 *     (`date_initial_peme`) is preferred; when the examiner left it blank the
 *     date of fitness and finally the exam's created date are used as
 *     fallbacks so the statement date still reflects when the PEME occurred.
 *
 * Mutates `next` in place.
 */
function applyStatementFromMedical(
  next: PanamaCertificate,
  medical: MedicalExam
): void {
  /** Write `value` into `key` only when the current value is blank. */
  const fillIfBlank = (key: keyof PanamaCertificate, value: string) => {
    if (!value) return;
    if (String(next[key] ?? "").trim() !== "") return;
    (next[key] as unknown) = value;
  };

  // Patient full name -> examinee + practitioner "person undergoing examination".
  const patientName = String(next.full_name ?? "").trim();
  fillIfBlank("statement_name", patientName);
  fillIfBlank("statement_practitioner_name", patientName);

  // ID / passport -> examinee + practitioner "ID Number or passport" rows.
  // Prefer the passport number, falling back to the seaman's book number.
  const idNumber =
    String(next.passport_no ?? "").trim() ||
    String(next.seamans_book_no ?? "").trim();
  fillIfBlank("statement_id_number", idNumber);
  fillIfBlank("statement_practitioner_id_number", idNumber);

  // Authorized physician -> witness fields and the "release ... to Dr." line.
  const physician = String(medical.authorized_physician ?? "").trim();
  fillIfBlank("statement_witness_name", physician);
  fillIfBlank("statement_practitioner_witness", physician);
  fillIfBlank("statement_release_to_dr", physician);

  // Date of the PEME -> statement date + practitioner date (split fields).
  // Prefer the explicit "Date of Initial PEME"; fall back to the date of
  // fitness and then the exam's created date so a blank initial-PEME field
  // doesn't leave the statement date empty.
  const pemeDate = firstParseableDate([
    medical.date_initial_peme,
    medical.date_of_fitness,
    medical.created_date,
  ]);
  if (pemeDate) {
    const { day, month, year } = pemeDate;
    fillIfBlank("statement_day", day);
    fillIfBlank("statement_month", month);
    fillIfBlank("statement_year", year);
    fillIfBlank("statement_practitioner_date_day", day);
    fillIfBlank("statement_practitioner_date_month", month);
    fillIfBlank("statement_practitioner_date_year", year);
  }
}

/**
 * Decompose the first parseable date in `candidates` into Panama
 * day / month-abbreviation / year components. Returns null when none of the
 * candidates yields a complete date.
 */
function firstParseableDate(
  candidates: Array<string | undefined>
): { day: string; month: string; year: string } | null {
  for (const candidate of candidates) {
    if (!candidate || !candidate.trim()) continue;
    const { day, month, year } = decomposeDate(candidate);
    if (day && month && year) return { day, month, year };
  }
  return null;
}

/**
 * Resolve the Seabase PEME date as an ISO `yyyy-mm-dd` string, preferring the
 * explicit "Date of Initial PEME" and falling back to the date of fitness and
 * the exam's created date. Returns "" when none resolves.
 */
function resolvePemeIsoDate(medical: MedicalExam): string {
  const parts = firstParseableDate([
    medical.date_initial_peme,
    medical.date_of_fitness,
    medical.created_date,
  ]);
  if (!parts) return "";
  const monthIndex = MONTH_ABBR.findIndex(
    (m) => m.toLowerCase() === parts.month.toLowerCase()
  );
  if (monthIndex < 0) return "";
  return `${parts.year}-${pad2(String(monthIndex + 1))}-${pad2(parts.day)}`;
}

/**
 * Populate the "Performed (day/month/year)" date for the date-based "Other
 * test" rows (Chest X-ray, EKG) from the Seabase PEME date. Import-only and
 * fill-if-blank: only sets the date when the row has no performed date yet, so
 * an examiner's manual edit is never overwritten.
 *
 * Mutates `next` in place.
 */
function applyOtherTestDatesFromMedical(
  next: PanamaCertificate,
  medical: MedicalExam
): void {
  const isoDate = resolvePemeIsoDate(medical);
  if (!isoDate) return;

  const dateKeys = ["chest_xray", "ekg"];
  const otherTests = { ...(next.lab_other_tests ?? {}) };
  let changed = false;
  for (const key of dateKeys) {
    const existing = otherTests[key];
    if (existing && String(existing.performed_date ?? "").trim() !== "") continue;
    // Seed the row from any existing values, defaulting a brand-new row to the
    // date-test default shown in the UI (checked, Observations "NORMAL").
    otherTests[key] = {
      checked: existing?.checked ?? true,
      normal: existing?.normal ?? "",
      abnormal: existing?.abnormal ?? "",
      observations: existing?.observations ?? "NORMAL",
      performed_date: isoDate,
    };
    changed = true;
  }
  if (changed) {
    next.lab_other_tests = otherTests;
  }
}

// ---------------------------------------------------------------------------
// Public: change detection (drives the Panama-side confirmation prompt)
// ---------------------------------------------------------------------------

const normalize = (v: unknown): string =>
  v === null || v === undefined ? "" : String(v).trim();

/**
 * Compare two Panama records and report whether any field that maps to the
 * medical (Seabase) record changed between them.
 *
 * @param before the Panama record as it was loaded/last synced
 * @param after  the current (edited) Panama record
 * @returns true when at least one synced field differs
 */
export function hasSyncedChanges(
  before: PanamaCertificate,
  after: PanamaCertificate
): boolean {
  return getChangedSyncFields(before, after).length > 0;
}

/**
 * List the synced field identifiers that changed between two Panama records.
 *
 * @param before the baseline Panama record
 * @param after  the edited Panama record
 * @returns array of changed synced-field identifiers (empty when none changed)
 */
export function getChangedSyncFields(
  before: PanamaCertificate,
  after: PanamaCertificate
): string[] {
  const changed: string[] = [];

  // Scalar sections (Panama-side raw comparison; transforms not needed here).
  for (const { panama: pKey } of SCALAR_FIELDS) {
    if (normalize(before[pKey]) !== normalize(after[pKey])) changed.push(String(pKey));
  }

  // Fitness pairs.
  for (const { fitField, unfitField } of FITNESS_FIELDS) {
    const bStatus = fitnessPairToMedical(!!before[fitField], !!before[unfitField]);
    const aStatus = fitnessPairToMedical(!!after[fitField], !!after[unfitField]);
    if (bStatus !== aStatus) changed.push(String(fitField));
  }

  // Fit for look-out (compare the Seabase value each side would carry back).
  if (
    lookoutPanamaToMedical(normalize(before.fitness_lookout)) !==
    lookoutPanamaToMedical(normalize(after.fitness_lookout))
  ) {
    changed.push("fitness_lookout");
  }

  // Visual aids.
  if (normalize(before.fitness_visual_aid) !== normalize(after.fitness_visual_aid)) {
    changed.push("fitness_visual_aid");
  }

  // Dates (compare the composed value so partial edits that don't yet form a
  // complete date don't trigger a false positive).
  for (const { dayField, monthField, yearField } of DATE_FIELDS) {
    const bDate = composeDate(normalize(before[dayField]), normalize(before[monthField]), normalize(before[yearField]));
    const aDate = composeDate(normalize(after[dayField]), normalize(after[monthField]), normalize(after[yearField]));
    if (bDate !== aDate) changed.push(String(dayField));
  }

  // Medical conditions: compare the value each Seabase condition would receive
  // (the combined answer across its Panama split keys) so one-to-many groups
  // don't report a spurious change.
  const beforeConditions = before.conditions ?? {};
  const afterConditions = after.conditions ?? {};
  for (const { medicalKey, panamaKeys } of CONDITION_FIELDS) {
    const bValue = combinePanamaConditions(panamaKeys.map((k) => normalizeYesNo(beforeConditions[k])));
    const aValue = combinePanamaConditions(panamaKeys.map((k) => normalizeYesNo(afterConditions[k])));
    if (bValue !== aValue) changed.push(`condition:${medicalKey}`);
  }

  // Additional questions (question_37..45): report only edits that actually
  // propagate. For partial mappings (Q41), compare the value that would carry
  // back ("yes" only) so a "no" edit doesn't raise a false prompt.
  for (const { medicalKey, panamaKey, partial } of QUESTION_FIELDS) {
    const project = (v: unknown) => {
      const a = normalizeYesNo(v);
      return partial && a !== "yes" ? "" : a;
    };
    if (project(before[panamaKey]) !== project(after[panamaKey])) {
      changed.push(`question:${medicalKey}`);
    }
  }

  // Medication list detail (Q45 -> Seabase questionnaire_medications_detail).
  if (normalize(before[PANAMA_MEDICATION_DETAIL_FIELD]) !== normalize(after[PANAMA_MEDICATION_DETAIL_FIELD])) {
    changed.push("question:medication_detail");
  }

  // Physical exploration: compare the combined value each Seabase finding would
  // receive so one-to-many groups (Mouth/Throat, Lungs/Chest) don't report a
  // spurious change.
  const beforeExploration = before.physical_exploration ?? {};
  const afterExploration = after.physical_exploration ?? {};
  for (const { medicalKey, panamaKeys } of PHYSICAL_EXAM_FIELDS) {
    const bValue = combinePanamaExploration(panamaKeys.map((k) => normalizeExploration(beforeExploration[k])));
    const aValue = combinePanamaExploration(panamaKeys.map((k) => normalizeExploration(afterExploration[k])));
    if (bValue !== aValue) changed.push(`physical_exam:${medicalKey}`);
  }

  return changed;
}

// ---------------------------------------------------------------------------
// Public: Panama -> Medical (build update payload after user confirms)
// ---------------------------------------------------------------------------

/**
 * Build a partial Medical update payload from a Panama record, covering only
 * the synced sections. The caller merges this onto the existing medical record
 * and sends it to `api.entities.MedicalExam.update`.
 *
 * @param panama the (saved) Panama record whose synced fields should propagate
 * @returns a partial MedicalExam with the overlapping fields populated
 */
export function applyPanamaToMedical(panama: PanamaCertificate): Partial<MedicalExam> {
  const payload: Partial<MedicalExam> = {};

  // Scalar sections (vitals + vision acuity + color vision).
  for (const { panama: pKey, medical: mKey, toMedical } of SCALAR_FIELDS) {
    const raw = panama[pKey];
    const value = typeof raw === "string" ? raw : "";
    (payload[mKey] as unknown) = toMedical ? toMedical(value) : value;
  }

  // Fitness pairs -> lowercase status strings the Seabase radios expect.
  for (const { fitField, unfitField, medical: mKey } of FITNESS_FIELDS) {
    (payload[mKey] as unknown) = fitnessPairToMedical(!!panama[fitField], !!panama[unfitField]);
  }

  // Fit for look-out (fit/not_fit -> yes/no) back to Seabase.
  (payload.fit_for_lookout as unknown) = lookoutPanamaToMedical(panama.fitness_lookout);

  // Visual aids required (lowercase yes/no).
  const visualAid = String(panama.fitness_visual_aid ?? "").trim().toLowerCase();
  (payload.visual_aids_required as unknown) = visualAid === "yes" || visualAid === "no" ? visualAid : "";

  // Dates: compose Panama day/month/year into medical ISO date strings.
  for (const { dayField, monthField, yearField, medical: mKey } of DATE_FIELDS) {
    (payload[mKey] as unknown) = composeDate(
      String(panama[dayField] ?? ""),
      String(panama[monthField] ?? ""),
      String(panama[yearField] ?? "")
    );
  }

  // Medical conditions: collapse Panama's declaration answers back into the
  // Seabase `medical_history` map. Only conditions with a recorded Panama
  // answer are written, so Seabase conditions Panama doesn't cover (Cancer,
  // Rheumatic Fever, etc.) are left untouched when the caller merges this map
  // onto the existing history.
  const historyPatch = buildMedicalHistoryPatch(panama);
  if (Object.keys(historyPatch).length > 0) {
    payload.medical_history = historyPatch;
  }

  // Additional questions: collapse Panama's question_NN answers back into the
  // Seabase `questionnaire` map. Only answered questions are written, so the
  // caller can merge this onto the existing map without dropping details or
  // the unmapped food-allergy question.
  const questionnairePatch = buildQuestionnairePatch(panama);
  if (Object.keys(questionnairePatch).length > 0) {
    payload.questionnaire = questionnairePatch;
  }

  // Medication list (Panama Q45 detail) -> Seabase "list your medications".
  const medicationDetail = String(panama[PANAMA_MEDICATION_DETAIL_FIELD] ?? "").trim();
  if (medicationDetail) {
    payload.questionnaire_medications_detail = medicationDetail;
  }

  // Physical exploration -> Seabase findings checkboxes + remarks. Only mapped
  // body systems with a recorded Panama value are written; the caller merges
  // each column onto the existing findings map so unmapped rows are preserved.
  const findingsPatch = buildFindingsPatch(panama);
  for (const key of Object.keys(findingsPatch) as (keyof FindingsPatch)[]) {
    (payload[key] as unknown) = findingsPatch[key];
  }

  return payload;
}

/**
 * Build the `medical_history` patch carrying Panama declaration answers back
 * to Seabase. Returns only the entries with a recorded Panama answer; callers
 * merge this onto the existing `medical_history` so unmapped Seabase
 * conditions are preserved.
 *
 * @param panama the Panama record whose declaration answers should propagate
 * @returns a partial `medical_history` map (Seabase key -> "yes"/"no")
 */
export function buildMedicalHistoryPatch(
  panama: PanamaCertificate
): Record<string, string> {
  const conditions = panama.conditions ?? {};
  const patch: Record<string, string> = {};
  for (const { medicalKey, panamaKeys } of CONDITION_FIELDS) {
    const combined = combinePanamaConditions(
      panamaKeys.map((k) => normalizeYesNo(conditions[k]))
    );
    if (combined) patch[medicalKey] = combined;
  }
  return patch;
}

/**
 * Build the `questionnaire` patch carrying Panama's additional-question
 * answers back to Seabase. Returns only the questions with a recorded Panama
 * answer; callers merge this onto the existing `questionnaire` map so unmapped
 * Seabase questionnaire entries (details, comments) are preserved.
 *
 * @param panama the Panama record whose additional-question answers propagate
 * @returns a partial `questionnaire` map (Seabase key -> "yes"/"no")
 */
export function buildQuestionnairePatch(
  panama: PanamaCertificate
): Record<string, string> {
  const patch: Record<string, string> = {};
  for (const { medicalKey, panamaKey, partial } of QUESTION_FIELDS) {
    const answer = normalizeYesNo(panama[panamaKey]);
    if (!answer) continue;
    // Partial mappings (Q41 -> Q5): only a Panama "yes" carries back; a Panama
    // "no" must not narrow the broader Seabase question.
    if (partial && answer !== "yes") continue;
    patch[medicalKey] = answer;
  }
  return patch;
}

/** Per-column patch of Seabase findings (checkbox) + remarks. */
interface FindingsPatch {
  findings_a: Record<string, boolean>;
  findings_b: Record<string, boolean>;
  findings_c: Record<string, boolean>;
  findings_a_remarks: Record<string, string>;
  findings_b_remarks: Record<string, string>;
  findings_c_remarks: Record<string, string>;
}

/** Note stamped on a findings remark when Panama recorded an abnormal result. */
const PANAMA_ABNORMAL_REMARK = "Abnormal (imported from Panama)";

/**
 * Build the Seabase findings patch carrying Panama's physical-exploration
 * answers back. For each mapped body system with a recorded Panama value:
 *   - `"N"` -> checkbox `true` (normal).
 *   - `"A"` -> checkbox `false` (not normal) plus a remark flag, so the
 *     abnormal finding is not silently lost (Seabase has no first-class
 *     abnormal flag on the checkbox).
 * One-to-many groups (Mouth/Throat, Lungs/Chest) collapse via
 * {@link combinePanamaExploration}. Only recorded values are written, so
 * unmapped Seabase findings are preserved when the caller merges the patch.
 *
 * @param panama the Panama record whose exploration answers should propagate
 * @returns a partial per-column findings + remarks patch (may be empty)
 */
export function buildFindingsPatch(panama: PanamaCertificate): Partial<FindingsPatch> {
  const exploration = panama.physical_exploration ?? {};
  const checks: Record<FindingsColumn, Record<string, boolean>> = {
    findings_a: {},
    findings_b: {},
    findings_c: {},
  };
  const remarks: Record<FindingsColumn, Record<string, string>> = {
    findings_a: {},
    findings_b: {},
    findings_c: {},
  };
  let changed = false;

  for (const { medicalColumn, medicalKey, panamaKeys } of PHYSICAL_EXAM_FIELDS) {
    const combined = combinePanamaExploration(
      panamaKeys.map((k) => normalizeExploration(exploration[k]))
    );
    if (!combined) continue;
    checks[medicalColumn][medicalKey] = combined === "N";
    if (combined === "A") {
      remarks[medicalColumn][medicalKey] = PANAMA_ABNORMAL_REMARK;
    }
    changed = true;
  }

  if (!changed) return {};

  const patch: Partial<FindingsPatch> = {};
  (["findings_a", "findings_b", "findings_c"] as const).forEach((col) => {
    if (Object.keys(checks[col]).length > 0) patch[col] = checks[col];
    const remarkCol = `${col}_remarks` as keyof FindingsPatch;
    if (Object.keys(remarks[col]).length > 0) {
      (patch[remarkCol] as Record<string, string>) = remarks[col];
    }
  });
  return patch;
}

// ---------------------------------------------------------------------------
// Public: Medical Physical Examination (vitals) -> Panama Clinical Data
// ---------------------------------------------------------------------------

/**
 * Report whether the medical Physical Examination vitals that map to Panama's
 * Clinical Data section changed between two medical records.
 *
 * Scoped to the vitals/clinical fields only — this drives the reverse
 * ("update Panama too?") prompt raised on the Seabase page.
 *
 * @param before the baseline medical record (as loaded/last synced)
 * @param after  the edited medical record
 * @returns true when at least one mapped vitals field differs
 */
export function hasMedicalVitalsChanges(
  before: MedicalExam,
  after: MedicalExam
): boolean {
  return VITALS_FIELDS.some(({ medical }) => normalize(before[medical]) !== normalize(after[medical]));
}

/**
 * Build a partial Panama update payload carrying the medical Physical
 * Examination vitals into the Panama Clinical Data fields.
 *
 * @param medical the (saved) medical record whose vitals should propagate
 * @returns a partial PanamaCertificate with the Clinical Data fields populated
 */
export function applyMedicalVitalsToPanama(
  medical: MedicalExam
): Partial<PanamaCertificate> {
  const payload: Partial<PanamaCertificate> = {};
  for (const { panama, medical: mKey } of VITALS_FIELDS) {
    const value = medical[mKey];
    (payload[panama] as unknown) = typeof value === "string" ? value : "";
  }
  return payload;
}
