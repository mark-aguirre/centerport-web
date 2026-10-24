"""laboratory.csv -> public.laboratory_reports.

The legacy export joins four detail tables onto the result master: hematology
(``hem_*``), clinical chemistry (``chem_*``), urinalysis (``urin_*``) and
fecalysis (``fec_*``). All four land in the single wide ``laboratory_reports``
row, which is how the app stores them too.

Chemistry carries each analyte twice, in SI and conventional units, which maps
onto the ``*_result_si`` / ``*_result_conv`` column pair, with the legacy
``chem_*_high`` flag driving the ``*_high`` BOOLEAN.

The four ``*_repeat_tests`` tables are intentionally left empty: every
``*_repeat_test_id`` in the export merely echoes the parent result id, and
``rm_repeat_test_tag`` is "N" wherever it is populated, so there are no repeat
runs to migrate.
"""

from __future__ import annotations

from typing import Any, Mapping

from common import (
    ModuleSpec,
    RowContext,
    blood_type,
    clean,
    iso_date,
    number_like,
    text,
    title_case_name,
)

#: Legacy chemistry analytes: (legacy SI column, legacy conventional column,
#: legacy high flag, target column stem).
CHEMISTRY = [
    ("chem_fbs", "chem_fbs_con", "chem_fbs_high", "fbs"),
    ("chem_bun", "chem_bun_con", "chem_bun_high", "bun"),
    ("chem_creatinine", "chem_creatinine_con", "chem_creatinine_high", "creatinine"),
    (
        "chem_cholesterol_susp",
        "chem_cholesterol_susp_con",
        "chem_cholesterol_high",
        "cholesterol",
    ),
    (
        "chem_cholesterol_elev",
        "chem_cholesterol_elev_con",
        "chem_triglycerides_high",
        "triglycerides",
    ),
    ("chem_uric_acid", "chem_uric_acid_con", "chem_uric_acid_high", "uric_acid"),
    ("chem_sgot", "chem_sgot_con", "chem_sgot_high", "sgot"),
    ("chem_sgpt", "chem_sgpt_con", "chem_sgpt_high", "sgpt"),
    ("chem_alk_phos", "chem_alk_phos_con", "chem_alk_high", "alk_phos"),
]


def _high(value: Any) -> bool | None:
    """Reads a legacy 0/1 "above range" flag."""
    out = clean(value)
    if out is None:
        return None
    return out.strip() in {"1", "Y", "y", "true", "True"}


def load_constants(conn) -> dict[str, Any]:
    """Copies the admin reference ranges onto every migrated report.

    The hematology form renders its normal ranges from the report row
    (``data.hemoglobin_normal_min``), and the app seeds those row columns from
    the ``hematology_default_values`` / ``clinical_chemistry_default_values``
    admin tables when an examiner creates a report. The legacy export has no
    ranges of its own, so copying the current defaults reproduces what the app
    would have stored and keeps migrated reports printable.
    """
    with conn.cursor() as cur:
        cur.execute(
            """
            select hemoglobin, hematocrit, rbc_count, wbc_count, platelet,
                   esr_male, esr_female, lymphocytes, stab_cells
              from public.hematology_default_values
             order by created_date limit 1
            """
        )
        hema = cur.fetchone()
        cur.execute(
            """
            select fbs_si, bun_si, creatinine_si, cholesterol_si,
                   triglycerides_si, uric_acid_si,
                   fbs_conv, bun_conv, creatinine_conv, cholesterol_conv,
                   triglycerides_conv, uric_acid_conv,
                   sgot_si, sgpt_si, alk_phos_si
              from public.clinical_chemistry_default_values
             order by created_date limit 1
            """
        )
        chem = cur.fetchone()

    constants: dict[str, Any] = {}

    if hema:
        (
            hemoglobin,
            hematocrit,
            rbc_count,
            wbc_count,
            platelet,
            esr_male,
            esr_female,
            lymphocytes,
            stab_cells,
        ) = hema
        ranges = {
            "hemoglobin": hemoglobin,
            "hematocrit": hematocrit,
            "rbc_count": rbc_count,
            "wbc_count": wbc_count,
            "platelet": platelet,
            "lymphocytes": lymphocytes,
            "stab_cells": stab_cells,
        }
        for stem, raw in ranges.items():
            low, high = _split_range(raw)
            constants[f"{stem}_normal_min"] = low
            constants[f"{stem}_normal_max"] = high
        constants["esr_normal_male"] = (esr_male or "").strip() or None
        constants["esr_normal_female"] = (esr_female or "").strip() or None

    if chem:
        (
            fbs_si,
            bun_si,
            creatinine_si,
            cholesterol_si,
            triglycerides_si,
            uric_acid_si,
            fbs_conv,
            bun_conv,
            creatinine_conv,
            cholesterol_conv,
            triglycerides_conv,
            uric_acid_conv,
            sgot_si,
            sgpt_si,
            alk_phos_si,
        ) = chem
        si_normal = {
            "fbs": fbs_si,
            "bun": bun_si,
            "creatinine": creatinine_si,
            "cholesterol": cholesterol_si,
            "triglycerides": triglycerides_si,
            "uric_acid": uric_acid_si,
        }
        for stem, raw in si_normal.items():
            constants[f"{stem}_si_normal"] = (raw or "").strip() or None
        unit_cells = {
            "fbs": (fbs_si, fbs_conv),
            "bun": (bun_si, bun_conv),
            "creatinine": (creatinine_si, creatinine_conv),
            "cholesterol": (cholesterol_si, cholesterol_conv),
            "triglycerides": (triglycerides_si, triglycerides_conv),
            "uric_acid": (uric_acid_si, uric_acid_conv),
            "sgot": (sgot_si, None),
            "sgpt": (sgpt_si, None),
            "alk_phos": (alk_phos_si, None),
        }
        for stem, (si, conv) in unit_cells.items():
            constants[f"{stem}_si"] = (si or "").strip() or None
            if conv is not None:
                constants[f"{stem}_conv"] = (conv or "").strip() or None

    return constants


def _split_range(raw: str | None) -> tuple[str | None, str | None]:
    """Splits "11-17" into ("11", "17"), matching the frontend's splitRange.

    The separator is the first hyphen after the leading character, so a
    negative lower bound stays intact. A value with no separator lands wholly
    in the minimum, exactly as the hook does it.
    """
    value = (raw or "").strip()
    if not value:
        return None, None
    separator = value.find("-", 1)
    if separator == -1:
        return value, None
    return value[:separator].strip() or None, value[separator + 1 :].strip() or None


def build_row(src: Mapping[str, str], ctx: RowContext) -> dict[str, Any]:
    # Serology that the current schema keeps on immunology_reports instead.
    for legacy in ("chem_vdrl", "chem_hbsag", "chem_widal_test", "chem_malarial_smear"):
        if clean(src.get(legacy)):
            ctx.drop(f"{legacy} (serology, now lives in immunology_reports)")

    row: dict[str, Any] = {
        # Report header
        "result_date": iso_date(
            src.get("rm_result_date") or src.get("rm_result_date_normalized")
        ),
        "med_tech": title_case_name(text(src.get("rm_medtech"), 255)),
        "med_tech_license_no": text(src.get("rm_medtech_license"), 100),
        "pathologist": title_case_name(text(src.get("rm_pathologist"), 255)),
        "pathologist_license_no": text(src.get("rm_pathologist_license"), 100),
        "laboratory_no": text(src.get("rm_specimen_no"), 100),
        # ------------------------------------------------------------------
        # Hematology
        # ------------------------------------------------------------------
        "hematology_result_date": iso_date(src.get("hem_result_date")),
        "hemoglobin": number_like(src.get("hem_hemoglobin")),
        "hematocrit": number_like(src.get("hem_hematocrit")),
        "rbc_count": number_like(src.get("hem_rbc_count")),
        "wbc_count": number_like(src.get("hem_wbc_count")),
        "platelet": number_like(src.get("hem_platelet")),
        "blood_type": blood_type(src.get("hem_blood_type"), ctx.unmapped, "blood_type"),
        "esr": number_like(src.get("hem_esr")),
        # Differential count
        "lymphocytes": number_like(src.get("hem_lymphocytes")),
        "segmenters": number_like(src.get("hem_segmenters")),
        "eosinophils": number_like(src.get("hem_eosinophils")),
        "monocytes": number_like(src.get("hem_monocytes")),
        "myelocytes": number_like(src.get("hem_myelocytes")),
        "juveniles": number_like(src.get("hem_juveniles")),
        "stab_cells": number_like(src.get("hem_stab_cells")),
        "basophils": number_like(src.get("hem_basophils")),
        "others_diff": text(src.get("hem_others"), 50),
        # ------------------------------------------------------------------
        # Clinical chemistry
        # ------------------------------------------------------------------
        "chemistry_result_date": iso_date(src.get("chem_result_date")),
        "hba1c_result": number_like(src.get("chem_ahbe")),
        "hba1c_high": _high(src.get("chem_hbA1c_H")),
        # ------------------------------------------------------------------
        # Urinalysis
        # ------------------------------------------------------------------
        "urinalysis_result_date": iso_date(src.get("urin_result_date")),
        # Macroscopic
        "urine_color": text(src.get("urin_color") or src.get("urin_color_remarks"), 50),
        "urine_transparency": text(src.get("urin_transparency"), 50),
        # Chemical
        "urine_leucocytes": text(src.get("urin_leukocytes"), 50),
        "urine_nitrite": text(src.get("urin_nitrite"), 50),
        "urine_urobilinogen": text(src.get("urin_urobilinogen"), 50),
        "urine_protein": text(src.get("urin_protein") or src.get("urin_albumin"), 50),
        "urine_ph": text(src.get("urin_ph") or src.get("urin_reaction"), 20),
        "urine_blood": text(src.get("urin_blood"), 50),
        "urine_specific_gravity": text(src.get("urin_specific_gravity"), 20),
        "urine_ketone": text(src.get("urin_ketone"), 50),
        "urine_bilirubin": text(src.get("urin_bilirubin") or src.get("urin_urine_bile"), 50),
        "urine_glucose": text(src.get("urin_sugar"), 50),
        "urine_others": text(src.get("urin_others_chem"), 100),
        # Microscopic
        "urine_rbc": text(src.get("urin_red_blood_cells") or src.get("urin_rbc"), 20),
        "urine_wbc": text(src.get("urin_white_blood_cells") or src.get("urin_pus"), 20),
        "urine_amorphous_urates": text(src.get("urin_amorphous_urates"), 20),
        "urine_amorphous_phosphate": text(src.get("urin_amorphous_phosphates"), 20),
        "urine_epithelial_cells": text(src.get("urin_epithelial_cells"), 20),
        "urine_mucus_threads": text(src.get("urin_mucus_threads"), 20),
        "urine_microscopic_others": text(src.get("urin_microscopic_others"), 50),
        # Crystals
        "urine_uric_acid": text(src.get("urin_uric_acid"), 20),
        "urine_calcium_oxalate": text(src.get("urin_calcium_oxalate"), 20),
        "urine_crystals_others": text(
            src.get("urin_others_crystals") or src.get("urin_triple_phosphate"), 50
        ),
        # Cast
        "urine_fine_granular": text(src.get("urin_fine_granular"), 20),
        "urine_coarse_granular": text(src.get("urin_coarse_granular"), 20),
        "urine_cast_others": text(
            src.get("urin_cast_others") or src.get("urin_hyaline"), 50
        ),
        # ------------------------------------------------------------------
        # Fecalysis
        # ------------------------------------------------------------------
        "fecalysis_result_date": iso_date(src.get("fec_result_date")),
        "fecal_color": text(src.get("fec_color") or src.get("fec_color_others"), 50),
        "fecal_consistency": text(src.get("fec_consistency"), 50),
        "fecal_rbc": text(src.get("fec_red_blood_cells"), 50),
        "fecal_wbc": text(src.get("fec_white_blood_cells") or src.get("fec_pus_cells"), 50),
        "fecal_others": text(src.get("fec_others"), 100),
        "fecal_ova_parasite": text(src.get("fec_ova_parasite"), 100),
        "fecal_amoeba": text(src.get("fec_amoeba"), 100),
        "fecal_occult_blood": text(src.get("fec_occult_blood"), 50),
    }

    for si_column, conv_column, high_column, stem in CHEMISTRY:
        row[f"{stem}_result_si"] = number_like(src.get(si_column))
        row[f"{stem}_result_conv"] = number_like(src.get(conv_column))
        row[f"{stem}_high"] = _high(src.get(high_column))

    return row


SPEC = ModuleSpec(
    name="laboratory",
    csv_file="laboratory.csv",
    table="laboratory_reports",
    business_id_column="report_id",
    business_id_prefix="LAB",
    sequence="lab_seq",
    papin_columns=("rm_papin", "pat_papin"),
    build_row=build_row,
    load_constants=load_constants,
    notes=(
        "Legacy chem_cholesterol_elev holds the triglycerides result (the "
        "legacy form reused the cholesterol row), which is why it maps to the "
        "triglycerides columns. The *_repeat_tests tables stay empty: the "
        "export has no repeat runs."
    ),
)
