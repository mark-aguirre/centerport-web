"""xray.csv -> public.xray_reports.

The legacy radiology detail table (``rad_*``) carries the report body, while
the result master (``rm_*``) carries the signatories. Where both hold the same
field the ``rad_*`` copy wins, because the export flags a small number of rows
where the two disagree (``radiology_papin_mismatch``).
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
        "xray_no": text(src.get("rad_reference_no") or src.get("rm_reference_no"), 100),
        "radiology_findings": clean(src.get("rad_findings")),
        "impression": clean(src.get("rad_impression")),
    }


SPEC = ModuleSpec(
    name="xray",
    csv_file="xray.csv",
    table="xray_reports",
    business_id_column="report_id",
    business_id_prefix="XRAY",
    sequence="xray_seq",
    papin_columns=("rad_papin", "rm_papin", "pat_papin"),
    build_row=build_row,
    notes=(
        "rad_examination is populated in a single test row and has no target "
        "column on xray_reports; it is not carried over."
    ),
)
