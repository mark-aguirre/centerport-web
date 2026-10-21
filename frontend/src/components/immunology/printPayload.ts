/**
 * PrintIO payload builder for the Immunology / Serology report.
 *
 * Maps the flat {@link ImmunologyReport} form model onto the exact field names
 * expected by the hosted PrintIO "immunology" template. Keys MUST match the
 * template variables verbatim — including the intentional misspelling
 * `medtech_lecense` — and every value is coerced to a string (`?? ""`).
 *
 * @see fetchPrintPdf — posts this payload to `/api/print/immunology`
 */

import type { ImmunologyReport } from "./types";

/**
 * Builds the flat PrintIO payload for the immunology template.
 *
 * @param data - the current immunology report record
 * @returns a flat `Record<string, string>` keyed by PrintIO template variables
 */
export function buildImmunologyPayload(
  data: ImmunologyReport
): Record<string, string> {
  const fullName = `${data.last_name ?? ""}${
    data.first_name ? ", " + data.first_name : ""
  }${data.middle_name ? " " + data.middle_name : ""}`.trim();

  return {
    name: fullName,
    age: data.age ?? "",
    lab_no: data.laboratory_no ?? "",
    date: data.result_date ?? "",
    sex: data.gender ?? "",

    // Tumor marker
    psa: data.psa_result ?? "",
    others: data.other_result ?? "",

    // Immunology / serology tests (reactivity values passed through verbatim)
    anti_hbs: data.anti_hbs_result ?? "",
    hbsag: data.hbsag_result ?? "",
    rpr: data.rpr_result ?? "",

    // Signatories
    medtech_name: data.med_tech ?? "",
    pathologist_name: data.pathologist ?? "",
    // NOTE: "medtech_lecense" mirrors the PrintIO template's misspelling; do not "fix" it.
    medtech_lecense: data.med_tech_license_no ?? "",
    pathologist_license: data.pathologist_license_no ?? "",
  };
}
