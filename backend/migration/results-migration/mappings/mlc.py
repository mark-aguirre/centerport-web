"""seafarer_mlc.csv -> public.mlc_records.

Almost all of the legacy physical-examination block is empty on MLC rows (the
measurements live on the seabase record); what MLC actually carries is the
authorized physician's declaration, which maps cleanly onto the yes/no
declaration columns.

Two details worth knowing:
- ``visual_aids`` is a JSON **array**, not an object, and "no aids worn" is
  the empty array rather than NULL.
- Legacy MLC dates are day-first ("27/04/2018"), unlike every other export
  here, so the date helper is called with ``day_first=True``.
"""

from __future__ import annotations

from typing import Any, Mapping

from common import (
    ModuleSpec,
    RowContext,
    age_from_birthdate,
    clean,
    iso_date,
    jsonb,
    mapped,
    text,
    title_case_name,
    yes_no,
)

FITNESS_DETERMINATION = {
    "fit for sea duty": "Fit for Sea Duty",
    "fit": "Fit for Sea Duty",
    "fit for sea service": "Fit for Sea Duty",
    "fit with restriction": "Fit with Restriction",
    "fit w/ restriction": "Fit with Restriction",
    "unfit": "Unfit",
    "unfit for sea duty": "Unfit",
}

VISUAL_AID_BY_LEGACY = {
    "spectacles": "spectacles",
    "contactlens": "contact_lenses",
    "contact lens": "contact_lenses",
    "contactlenses": "contact_lenses",
    "contact lenses": "contact_lenses",
}


def _visual_aids(value: Any, ctx: RowContext) -> str:
    """Builds the visual_aids JSON array from the legacy single-choice column.

    The frontend filters "none" out of this array, so an absent or unknown
    legacy value becomes ``[]`` — which is how the app itself represents
    "no aids worn".
    """
    out = clean(value)
    if out is None:
        return jsonb([])
    key = out.strip().lower()
    aid = VISUAL_AID_BY_LEGACY.get(key)
    if aid is None:
        ctx.unmapped[f"visual_aids={out}"] += 1
        return jsonb([])
    return jsonb([aid])


def build_row(src: Mapping[str, str], ctx: RowContext) -> dict[str, Any]:
    exam_date = iso_date(
        src.get("rm_result_date") or src.get("rm_result_date_normalized")
    )
    limitation = yes_no(src.get("pe_isLimitation"))

    return {
        # Seafarer details carried on the certificate
        "date_of_birth": iso_date(src.get("pat_birthdate")),
        "age": age_from_birthdate(src.get("pat_birthdate"), exam_date),
        "sirb_no": text(src.get("pat_sirb"), 255),
        "rank": text(src.get("pat_position"), 255),
        "shipping_company": text(src.get("pat_employer"), 255),
        # Certificate details
        "fitness_determination": mapped(
            src.get("rm_recommendation"),
            FITNESS_DETERMINATION,
            unmapped=ctx.unmapped,
            label="fitness_determination",
        ),
        "date_of_examination": exam_date,
        "date_issued": iso_date(src.get("rm_fitness_date")),
        "valid_until": iso_date(src.get("rm_valid_until")),
        "examining_physician": title_case_name(text(src.get("rm_pathologist"), 255)),
        "medical_director": title_case_name(text(src.get("rm_medtech"), 255)),
        "limitations_remarks": clean(src.get("rm_restriction")),
        # Declaration of the authorized physician
        "id_documents_checked": yes_no(src.get("pe_IDENTITY_CONFIRMED")),
        "hearing_meets_standards": yes_no(src.get("pe_SATISFACTORY_HEARING")),
        "unaided_hearing_satisfactory": yes_no(
            src.get("pe_UNAIDED_HEARING_SATISFACTORY")
        ),
        "visual_acuity_meets_standards": yes_no(
            src.get("pe_SATISFACTORY_SIGHT_UNAID")
        ),
        "colour_vision_meets_standards": yes_no(src.get("pe_ISHIHARA_C")),
        "visual_aids": _visual_aids(src.get("pe_VISUAL_AIDS_WORN"), ctx),
        "date_colour_vision_test": iso_date(
            src.get("pe_COLOR_VISION_DATE_TAKEN"), day_first=True
        ),
        "fit_for_lookout": yes_no(src.get("pe_FIT_FOR_LOOKOUT")),
        # Legacy stores "has a limitation"; the column asks the inverse.
        "no_limitations": None
        if limitation is None
        else ("no" if limitation == "yes" else "yes"),
        "limitations_details": clean(src.get("pe_limitationComment")),
        # Final recommendation
        "date_of_fitness": iso_date(src.get("rm_fitness_date")),
        "valid_until_date": iso_date(src.get("rm_valid_until")),
        "medical_certification_no": text(src.get("rm_reference_no"), 255),
    }


SPEC = ModuleSpec(
    name="mlc",
    csv_file="seafarer_mlc.csv",
    table="mlc_records",
    business_id_column="mlc_id",
    business_id_prefix="MLC",
    sequence="mlc_seq",
    papin_columns=("rm_papin", "pat_papin"),
    build_row=build_row,
    jsonb_columns=("visual_aids",),
    notes=(
        "certificate_type, vessel_name, vessel_type, manning_agency, "
        "issuing_authority and applicant_condition_risk have no legacy "
        "counterpart and are left NULL. date_initial_peme is also NULL: the "
        "legacy export carries only the current examination date."
    ),
)
