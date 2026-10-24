"""hiv.csv -> public.hiv_reports.

The legacy screen-test flags are 0/1 integers and map onto the three BOOLEAN
``test_*`` columns. The result vocabulary here is "Nonreactive"/"Reactive" —
one word, unlike immunology's "Non Reactive" — and that difference is
deliberate in the frontend, so it is not normalized away.
"""

from __future__ import annotations

from typing import Any, Mapping

from common import (
    ModuleSpec,
    RowContext,
    boolean,
    iso_date,
    mapped,
    text,
    title_case_name,
)

HIV_RESULT = {
    "nonreactive": "Nonreactive",
    "non reactive": "Nonreactive",
    "non-reactive": "Nonreactive",
    "negative": "Nonreactive",
    "reactive": "Reactive",
    "positive": "Reactive",
}


def build_row(src: Mapping[str, str], ctx: RowContext) -> dict[str, Any]:
    if text(src.get("rm_remarks")):
        # Legacy rm_remarks on HIV rows holds a stray licence number, not a
        # remark, and hiv_reports has no remarks column either way.
        ctx.drop("rm_remarks (licence number, no target column)")

    return {
        # Report header
        "result_date": iso_date(
            src.get("rm_result_date") or src.get("rm_result_date_normalized")
        ),
        "expire_date": iso_date(src.get("rm_valid_until")),
        "med_tech": title_case_name(text(src.get("rm_medtech"), 255)),
        "hiv_proficiency_cert_no": text(src.get("rm_medtech_license"), 100),
        "pathologist": title_case_name(text(src.get("rm_pathologist"), 255)),
        "pathologist_license_no": text(src.get("rm_pathologist_license"), 100),
        "examining_physician": title_case_name(
            text(src.get("rm_repeat_test_requestby"), 255)
        ),
        # HIV-1 screen test
        "test_rapid": boolean(src.get("hiv_rapid")),
        "test_particle_agglutination": boolean(src.get("hiv_particle_agglutination")),
        "test_eia_cma_elfa": boolean(src.get("hiv_eia_cmia_elfa")),
        "test_others": text(src.get("hiv_others_specify"), 255),
        "result": mapped(
            src.get("hiv_results") or src.get("hiv_results_normalized"),
            HIV_RESULT,
            unmapped=ctx.unmapped,
            label="result",
        ),
    }


SPEC = ModuleSpec(
    name="hiv",
    csv_file="hiv.csv",
    table="hiv_reports",
    business_id_column="report_id",
    business_id_prefix="HIV",
    sequence="hiv_seq",
    papin_columns=("rm_papin", "pat_papin"),
    build_row=build_row,
    notes=(
        "physician_license_no has no legacy counterpart and is left NULL. "
        "rm_repeat_test_requestby is the requesting physician and is the only "
        "legacy field that matches examining_physician."
    ),
)
