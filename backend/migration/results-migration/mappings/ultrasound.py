"""ultrasound.csv -> public.ultrasound_reports.

Structurally identical to the x-ray export, with one extra field: the legacy
``rad_examination`` (study region) maps onto ``examination``, which the x-ray
table does not have.
"""

from __future__ import annotations

from typing import Any, Mapping

from common import ModuleSpec, RowContext, clean, iso_date, text, title_case_name


def build_row(src: Mapping[str, str], ctx: RowContext) -> dict[str, Any]:
    return {
        # Report header
        "result_date": iso_date(
            src.get("rad_result_date") or src.get("rm_result_date_normalized")
        ),
        "xray_tech": title_case_name(text(src.get("rm_medtech"), 255)),
        "xray_tech_license_no": text(src.get("rm_medtech_license"), 100),
        "radiologist": title_case_name(
            text(src.get("rad_radiologist") or src.get("rm_pathologist"), 255)
        ),
        "radiologist_license_no": text(
            src.get("rad_rad_license") or src.get("rm_pathologist_license"), 100
        ),
        # Result
        "examination": text(src.get("rad_examination"), 255),
        "ultrasound_no": text(
            src.get("rad_reference_no") or src.get("rm_reference_no"), 100
        ),
        "radiology_findings": clean(src.get("rad_findings")),
        "impression": clean(src.get("rad_impression")),
    }


SPEC = ModuleSpec(
    name="ultrasound",
    csv_file="ultrasound.csv",
    table="ultrasound_reports",
    business_id_column="report_id",
    business_id_prefix="UTZ",
    sequence="utz_seq",
    papin_columns=("rad_papin", "rm_papin", "pat_papin"),
    build_row=build_row,
)
