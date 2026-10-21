/**
 * PrintIO payload builder for the HIV report.
 *
 * Maps the flat {@link HivReport} form model onto the exact field names
 * expected by the hosted PrintIO "hiv" template. Keys MUST match the template
 * variables verbatim — including the intentional `sec` spelling (the template's
 * sex field) — and every value is coerced to a string.
 *
 * Boolean fields (`isRapid`, `isParticle`, `isEia`, `isNonreactive`,
 * `isReactive`) are emitted as `"true"` / `"false"` strings.
 *
 * @see fetchPrintPdf — posts this payload to `/api/print/hiv`
 */

import { fetchPhotoAsBase64 } from "@/lib/photo";
import type { HivReport } from "./types";

/** Boolean marker convention used by the template's `is*` fields. */
const flag = (value: boolean): string => (value ? "true" : "false");

/**
 * Builds the flat PrintIO payload for the HIV template.
 *
 * The patient photo is resolved from the profile's stored `photo_url` and
 * embedded as a base64 data URL, because PrintIO is an external service that
 * cannot fetch the same-origin proxy path. This mirrors the landbase/MLC/
 * medical payload builders.
 *
 * @param data - the current HIV report record
 * @returns a flat `Record<string, string>` keyed by PrintIO template variables
 */
export async function buildHivPayload(
  data: HivReport
): Promise<Record<string, string>> {
  const fullName = [data.first_name, data.middle_name, data.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const photoBase64 = await fetchPhotoAsBase64(data.photo_url);

  // The single reactivity result drives the two mutually exclusive flags.
  const isNonreactive = data.result === "Nonreactive";
  const isReactive = data.result === "Reactive";

  return {
    patient_full_name: fullName,
    age: data.age ?? "",
    // NOTE: "sec" mirrors the PrintIO template's field name for sex; do not "fix" it.
    sec: data.gender ?? "",
    civil_status: data.civil_status ?? "",
    address: data.address ?? "",
    date_of_exam: data.result_date ?? "",
    patient_photo: photoBase64,

    // Examining physician
    physician_name: data.examining_physician ?? "",
    physician_license: data.physician_license_no ?? "",

    // Medical technologist (expiry maps to the report's expire date)
    medtech: data.med_tech ?? "",
    medtech_license: data.hiv_proficiency_cert_no ?? "",
    medtech_expiry_date: data.expire_date ?? "",

    // Screening methods used
    isRapid: flag(data.test_rapid),
    isParticle: flag(data.test_particle_agglutination),
    isEia: flag(data.test_eia_cma_elfa),

    // Result
    isNonreactive: flag(isNonreactive),
    isReactive: flag(isReactive),
  };
}
