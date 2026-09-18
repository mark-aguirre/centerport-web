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

import type { PanamaCertificate } from "@/components/panama/types";
import type { MedicalExam } from "@/components/medical/types";

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

/** All scalar field mappings across the synced sections. */
const SCALAR_FIELDS: ScalarFieldMap[] = [
  ...VITALS_FIELDS,
  ...VISION_ACUITY_FIELDS,
  COLOR_VISION_FIELD,
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
