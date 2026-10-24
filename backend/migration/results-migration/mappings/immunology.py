"""immunology.csv -> public.immunology_reports.

The legacy table stores each reactivity twice: a numeric code (``imm_HBsAg``)
and a readable label (``imm_HBsAg_text``). The label is the source of truth
here because the code's meaning is not documented anywhere and the label
already matches the app's two-word "Non Reactive" / "Reactive" vocabulary.
"""

from __future__ import annotations

from typing import Any, Mapping

from common import ModuleSpec, RowContext, iso_date, mapped, text, title_case_name

# The frontend's REACTIVITY_OPTIONS, exactly as spelled there.
REACTIVITY = {
    "non reactive": "Non Reactive",
    "nonreactive": "Non Reactive",
    "non-reactive": "Non Reactive",
    "negative": "Non Reactive",
    "reactive": "Reactive",
    "positive": "Reactive",
    # Legacy "NOT SET" means the test was not run; leave the field unset.
    "not set": None,
}


def _reactivity(value: Any, ctx: RowContext, label: str) -> str | None:
    cleaned = text(value)
    if cleaned is None:
        return None
    if cleaned.strip().lower() == "not set":
        return None
    return mapped(cleaned, REACTIVITY, unmapped=ctx.unmapped, label=label)


def build_row(src: Mapping[str, str], ctx: RowContext) -> dict[str, Any]:
    return {
        # Report header
        "result_date": iso_date(src.get("imm_ResultDate")),
        "med_tech": title_case_name(text(src.get("imm_MedTech"), 255)),
        "med_tech_license_no": text(src.get("imm_MedTechLicense"), 100),
        "pathologist": title_case_name(text(src.get("imm_Pathologist"), 255)),
        "pathologist_license_no": text(src.get("imm_PathologistLicense"), 100),
        "laboratory_no": text(src.get("imm_LaboratoryNo"), 100),
        # Immunology / serology
        "psa_result": text(src.get("imm_psa"), 100),
        "other_test_name": text(src.get("imm_otherName"), 255),
        "other_reference": text(src.get("imm_otherRefValue"), 100),
        "other_result": text(src.get("imm_Other"), 100),
        "hbsag_result": _reactivity(src.get("imm_HBsAg_text"), ctx, "hbsag_result"),
        "rpr_result": _reactivity(src.get("imm_RPR_text"), ctx, "rpr_result"),
        "anti_hbs_result": _reactivity(src.get("imm_AntiHBS_text"), ctx, "anti_hbs_result"),
        "anti_hbs_cut_off": text(src.get("imm_cutOff"), 50),
        "anti_hbs_result_line": text(src.get("imm_AntiHBSResult"), 100),
    }


SPEC = ModuleSpec(
    name="immunology",
    csv_file="immunology.csv",
    table="immunology_reports",
    business_id_column="report_id",
    business_id_prefix="IMM",
    sequence="imm_seq",
    papin_columns=("imm_Papin", "pat_papin"),
    build_row=build_row,
    created_date_column="imm_DateCreated",
    notes=(
        "psa_reference has no legacy counterpart (the legacy PSA value in "
        "imm_psa already embeds its unit) and is left NULL."
    ),
)
