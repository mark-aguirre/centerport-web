"""psychology.csv -> public.psychology_evaluations.

The 21 personality-trait ratings map one-to-one onto the legacy columns, but
the names diverge: legacy "venturesome" is the app's initiative, legacy
"noise/vibration/temperature tolerance" is stress tolerance, legacy
"realistic" is tough-mindedness, and the legacy interpersonal pair
"relationship with peer / superior" is teamwork / deference. The legacy
``psy_emo_stress`` and ``psy_obj_jealousy`` columns are empty in every row, so
nothing is lost to those renames.

One mapping is an inference rather than a verified fact: the legacy
recommendation code 1/2/3 is assumed to follow the same order as the app's
three conclusion options. CONCLUSION_BY_CODE is isolated below so it is easy
to correct.
"""

from __future__ import annotations

from typing import Any, Mapping

from common import (
    ModuleSpec,
    RowContext,
    age_from_birthdate,
    clean,
    iso_date,
    mapped,
    text,
    title_case_name,
    yes_no,
)

#: The legacy export uses exactly seven codes and the app offers exactly seven
#: intellectual levels, so this is a clean one-to-one mapping. Observed counts:
#: AVG 2055, AAVG 1594, BAVG 1590, VS 609, SUP 593, M 204, BL 150.
INTELLECTUAL_LEVEL = {
    "vs": "Very Superior",
    "vsup": "Very Superior",
    "sup": "Superior",
    "aavg": "Above Average",
    "avg": "Average",
    "bavg": "Below Average",
    "bl": "Borderline",
    "m": "Mentally Deficient",
    "md": "Mentally Deficient",
}

#: Legacy psy_recommendation is a numeric code matching the order of the app's
#: three conclusion options. Supporting evidence: the distribution is 1 x6550,
#: 3 x243, 2 x5, and the rows carrying "extremely low IQ ... not recommended"
#: narrative in psy_not_rec_details are code 3.
CONCLUSION_BY_CODE = {
    "1": "Recommended",
    "2": "For Further Evaluation",
    "3": "Not Recommended",
}

#: legacy column -> target trait column
TRAITS = {
    # Sense of responsibility
    "psy_res_persevering": "trait_perseverance",
    "psy_res_obedient": "trait_obedience",
    "psy_res_selfdiscipline": "trait_self_discipline",
    "psy_res_enthusiastic": "trait_enthusiasm",
    "psy_res_venturesome": "trait_initiative",
    # Emotional stability
    "psy_emo_isolation_boredom": "trait_withstand_boredom",
    "psy_emo_noise_vibration_temp": "trait_stress_tolerance",
    "psy_emo_reality": "trait_faces_reality",
    "psy_emo_confident": "trait_confidence",
    "psy_emo_relaxed": "trait_relaxed",
    # Objectivity
    "psy_obj_realistic": "trait_tough_mindedness",
    "psy_obj_adaptable": "trait_adaptability",
    "psy_obj_practicalminded": "trait_practicality",
    # Motivation
    "psy_mot_assertive": "trait_assertiveness",
    "psy_mot_independent": "trait_independence",
    "psy_mot_resourceful": "trait_resourcefulness",
    # Interpersonal and personal adjustment
    "psy_iapa_rel_peer": "trait_teamwork",
    "psy_iapa_rel_superior": "trait_deference",
    "psy_iapa_self_esteem": "trait_self_esteem",
    "psy_iapa_aggressive_tendencies": "trait_aggressive_tendencies",
    # Goal orientation
    "psy_goal_orientation": "trait_goal_orientation",
}


def _rating(value: Any) -> str | None:
    """Keeps only a valid 1-7 rating; legacy writes "-" for "not rated"."""
    out = clean(value)
    if out is None:
        return None
    return out if out in {"1", "2", "3", "4", "5", "6", "7"} else None


def build_row(src: Mapping[str, str], ctx: RowContext) -> dict[str, Any]:
    if clean(src.get("psy_PTR_medTech")) or clean(src.get("psy_Lic_Validity_Medtech")):
        ctx.drop("psy_PTR_* / psy_Lic_Validity_* (no target column)")

    exam_date = iso_date(
        src.get("psy_result_date") or src.get("psy_result_date_normalized")
    )

    row: dict[str, Any] = {
        # Patient snapshot
        "date_of_birth": iso_date(src.get("pat_birthdate")),
        "age": age_from_birthdate(src.get("pat_birthdate"), exam_date),
        # Examination details
        "date_of_examination": exam_date,
        "psychometrician": title_case_name(text(src.get("psy_medtech"), 255)),
        "psychometrician_license_no": text(src.get("psy_medtech_license"), 100),
        "psychologist": title_case_name(text(src.get("psy_pathologist"), 255)),
        "psychologist_license_no": text(src.get("psy_pathologist_license"), 100),
        # Tests used
        "intelligence_test_used": yes_no(src.get("psy_intel_test")) == "yes",
        "intelligence_test_name": text(src.get("psy_intel_result"), 255),
        "personal_test_used": yes_no(src.get("psy_person_test")) == "yes",
        "personal_test_name": text(src.get("psy_person_result"), 255),
        "others_test_used": yes_no(src.get("psy_other_test")) == "yes",
        "others_test_name": text(src.get("psy_other_result"), 255),
        # I. Intellectual level
        "intellectual_level": mapped(
            src.get("psy_intelectual_level"),
            INTELLECTUAL_LEVEL,
            unmapped=ctx.unmapped,
            label="intellectual_level",
        ),
        # III. Conclusion / remarks
        "conclusion": mapped(
            src.get("psy_recommendation"),
            CONCLUSION_BY_CODE,
            unmapped=ctx.unmapped,
            label="conclusion",
        ),
        "remarks": clean(src.get("psy_not_rec_details"))
        or clean(src.get("psy_ff_eval_details")),
    }

    # II. Personality traits
    for legacy, target in TRAITS.items():
        row[target] = _rating(src.get(legacy))

    return row


SPEC = ModuleSpec(
    name="psychology",
    csv_file="psychology.csv",
    table="psychology_evaluations",
    business_id_column="eval_id",
    business_id_prefix="PSYCH",
    sequence="psych_seq",
    papin_columns=("psy_papin", "pat_papin"),
    build_row=build_row,
    notes=(
        "eval_id is VARCHAR(16), so PSYCH + 8 digits (13 chars) fits. "
        "Legacy psy_emo_stress and psy_obj_jealousy are empty in every row."
    ),
)
