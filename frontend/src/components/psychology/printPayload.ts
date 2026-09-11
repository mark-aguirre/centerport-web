/**
 * PrintIO payload builder for the Psychological Evaluation report.
 *
 * Flattens a `PsychologyRecord` into the flat template variable names expected
 * by the PrintIO psychology template. This is a pure data transformation with
 * no React dependency, so it lives outside the report menu component.
 *
 * @see ReportMenu — the client component that consumes this builder
 * @see handlePrintRequest (`@/lib/printio`) — server-side PrintIO proxy
 */

import type { PsychologyRecord } from "./types";

/** Build the "First Middle Last" display name, dropping empty parts. */
const fullNameOf = (data: PsychologyRecord): string =>
  [data.first_name, data.middle_name, data.last_name].filter(Boolean).join(" ").trim();

/**
 * Lowercase every string value in a flat payload, leaving keys untouched.
 *
 * PrintIO receives the template values in lowercase; keys must still mirror the
 * template variable names exactly, so only the values are transformed.
 */
const lowercaseValues = (
  payload: Record<string, string>,
): Record<string, string> =>
  Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, value.toLowerCase()]),
  );

/**
 * Builds the PrintIO payload for the psychological evaluation report.
 *
 * Keys mirror the PrintIO template variables exactly. Every value is coalesced
 * to a string (empty when absent) and lowercased.
 *
 * NOTE: `referred-by`, `field20`, and `field21` have no corresponding field on
 * the psychology record and are sent as empty strings until a data source is
 * available.
 */
export function buildPsychologyPayload(data: PsychologyRecord): Record<string, string> {
  return lowercaseValues({
    patientFullname: fullNameOf(data),
    // No corresponding field on the psychology record.
    "referred-by": "",
    date_of_examination: data.date_of_examination ?? "",
    position: data.position ?? "",

    // I. Intellectual Level
    intellectual_level: data.intellectual_level ?? "",

    // II. Personality Traits and Characteristics (1-7 rating)
    trait_perseverance: data.trait_perseverance ?? "",
    trait_obedience: data.trait_obedience ?? "",
    // No corresponding fields on the psychology record.
    field20: "",
    field21: "",
    trait_self_discipline: data.trait_self_discipline ?? "",
    trait_enthusiasm: data.trait_enthusiasm ?? "",
    trait_withstand_boredom: data.trait_withstand_boredom ?? "",
    trait_stress_tolerance: data.trait_stress_tolerance ?? "",
    trait_faces_reality: data.trait_faces_reality ?? "",
    trait_confidence: data.trait_confidence ?? "",
    trait_tough_mindedness: data.trait_tough_mindedness ?? "",
    trait_adaptability: data.trait_adaptability ?? "",
    trait_practicality: data.trait_practicality ?? "",
    trait_assertiveness: data.trait_assertiveness ?? "",
    trait_teamwork: data.trait_teamwork ?? "",
    trait_deference: data.trait_deference ?? "",
    trait_self_esteem: data.trait_self_esteem ?? "",
    trait_aggressive_tendencies: data.trait_aggressive_tendencies ?? "",
    trait_initiative: data.trait_initiative ?? "",
    trait_relaxed: data.trait_relaxed ?? "",
    trait_independence: data.trait_independence ?? "",
    trait_resourcefulness: data.trait_resourcefulness ?? "",
    trait_goal_orientation: data.trait_goal_orientation ?? "",

    // III. Conclusion / Remarks
    remarks: data.remarks ?? "",
    conclusion: data.conclusion??"",
    // Certification
    psychometrician: data.psychometrician ?? "",
    psychologist: data.psychologist ?? "",
    psychometrician_license_no: data.psychometrician_license_no ?? "",
    psychologist_license_no: data.psychologist_license_no ?? "",
  });
}
