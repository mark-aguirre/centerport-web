"""panama.csv -> public.panama_certificates.

The widest legacy export (335 columns) and the only one whose target stores
dates decomposed into day / "Mon" / year column triples. Legacy prefixes:

  ``pp_``   Panama patient block     -> general information
  ``decl_`` examinee's declaration   -> conditions JSONB + question_37..45
  ``cov_``  Covid-19 block           -> covid_1..covid_6_*
  ``cd_``   clinical data            -> height / weight / vitals
  ``sght_`` sight                    -> sight_* columns
  ``hear_`` tonal audiometry         -> hearing_{right,left}_{500..8000}
  ``phx_``  physical exploration     -> physical_exploration JSONB
  ``dx_``   diagnostic tests         -> lab_tests / lab_other_tests JSONB
  ``prm_``  result master            -> fitness assessment + certificate

Panama dates are day-first throughout ("25/11/2027"), unlike the month-first
result-master dates in the other exports.

Three JSONB contracts matter here and are reproduced exactly: ``conditions``
maps the post-V25 snake_case keys, ``physical_exploration`` uses "N"/"A", and
``lab_tests`` / ``lab_other_tests`` hold objects whose normal/abnormal cells
carry an "X" marker rather than a boolean.
"""

from __future__ import annotations

import re
from typing import Any, Iterable, Mapping

from common import (
    ModuleSpec,
    RowContext,
    clean,
    iso_date,
    jsonb,
    mapped,
    number_like,
    split_iso_date,
    text,
    title_case_name,
    yes_no,
)

# ---------------------------------------------------------------------------
# conditions (post-V25 keys)
# ---------------------------------------------------------------------------

#: legacy declaration column -> one or more current condition keys. Where a
#: legacy column covers several current keys, V25 split it the same way
#: (condition_3 -> ear/nose/throat, condition_33 -> back/joint).
CONDITIONS = {
    "decl_HighBloodPressure": ("high_blood_pressure",),
    "decl_Eyeproblem": ("eye_vision_problem",),
    "decl_EarNoseThroat": ("ear_problem", "nose_problem", "throat_problem"),
    "decl_HeartSurgery": ("heart_surgery",),
    "decl_Varicoseveins": ("varicose_veins",),
    "decl_AsthmaBronchitis": ("asthma_bronchitis",),
    "decl_BloodDisorder": ("blood_disorders",),
    "decl_Diabetes": ("diabetes",),
    "decl_ThyroidProblem": ("thyroid_problems",),
    "decl_DigestiveDisorders": ("digestive_disorders",),
    "decl_KidneyDisorders": ("kidney_problems",),
    "decl_SkinProblem": ("skin_problems",),
    "decl_Allergies": ("allergies",),
    "decl_Epilipsy": ("epilepsy_seizures",),
    "decl_SickleCell": ("sickle_cell_disease",),
    "decl_Herinas": ("hernias",),
    "decl_GenitalDisorders": ("genital_disorders",),
    "decl_Pregnancy": ("pregnancy",),
    "decl_Sleepproblem": ("sleep_problem",),
    "decl_DoyouSmoke": ("smoking",),
    "decl_Surgeries": ("surgeries",),
    "decl_Infectious": ("infectious_diseases",),
    "decl_DizzinessFainting": ("dizziness_fainting",),
    "decl_Lossofconsciousness": ("loss_of_consciousness",),
    "decl_PsychiatricProblem": ("psychiatric_problems",),
    "decl_Depression": ("depression",),
    "decl_Lossofmemory": ("loss_of_memory",),
    "decl_BalanceProblems": ("balance_problems",),
    "decl_SevereHeadAches": ("severe_headaches",),
    "decl_Vasculardisease": ("heart_vascular_disease",),
    "decl_RestrictedMobility": ("restricted_mobility",),
    "decl_BackJointProblem": ("back_problem", "joint_problem"),
    "decl_Amputation": ("amputation",),
    "decl_FracturesDislocation": ("fractures_dislocation",),
    "decl_Covid19": ("covid_19",),
}

#: Questions 37-45, in the order the form numbers them.
QUESTIONS = {
    "question_37": "decl_Repatriated",
    "question_38": "decl_Hospitalized",
    "question_39": "decl_SeaDuty",
    "question_40": "decl_Revoke",
    "question_41": "decl_ConsiderDisease",
    "question_42": "decl_FitToPerformDuries",
    "question_43": "decl_AllergicToAnyMedication",
    "question_44": "decl_AlternativeSupliment",
    "question_45": "decl_TakenMedications",
}

# ---------------------------------------------------------------------------
# physical_exploration (post-V26/V27/V28 keys)
# ---------------------------------------------------------------------------

#: current key -> legacy column. V27 split mouth_nose_throat into three keys
#: and V28 split lungs_and_chest into two, so one legacy column legitimately
#: feeds several keys here, exactly as those migrations copied the data.
EXPLORATION = {
    "head": "phx_Head",
    "mouth": "phx_Mouth",
    "nose": "phx_Mouth",
    "throat": "phx_Mouth",
    "dental_exam": "phx_Dental",
    "ears_general": "phx_Ears",
    "tympanic_membrane": "phx_Tympanic",
    "eyes": "phx_Eyes",
    "pupils": "phx_Pupils",
    "ophthalmoscopy": "phx_OfThalmoscopy",
    "eye_movement": "phx_EyeMovement",
    "lungs": "phx_Lungs",
    "chest": "phx_Lungs",
    "heart": "phx_Heart",
    "skin": "phx_Skin",
    "varicose_veins": "phx_VaricoseVenis",
    "vascular_incl_pedal": "phx_Vascular",
    "abdomen_and_viscera": "phx_Abdomen",
    "hernias": "phx_Hernias",
    "anus_not_rectal_exam": "phx_Anus",
    "gu_system": "phx_Gu",
    "upper_and_lower": "phx_Upper",
    "spine_cervical_thoracic_lumbar": "phx_Spine",
    "neurologic_full_brief": "phx_Neurologic",
    "psychiatric": "phx_Psychiatric",
    "general_appearance": "phx_GeneralAppearance",
    "breast_examination": "phx_Breast",
}

# ---------------------------------------------------------------------------
# lab_tests / lab_other_tests
# ---------------------------------------------------------------------------

#: key -> (performed flag, normal cell, abnormal cell, observations cell)
LAB_TESTS = {
    "hemogram": ("dx_Hemogram", "dx_HemogramNormal", "dx_HemogramAbNormal", "dx_HemogramOservation"),
    "lipid_profile": ("dx_Lipid", "dx_LipidNormal", "dx_LipidAbNormal", "dx_LipidObservation"),
    "creatinine": ("dx_Creatinine", "dx_CreatinineNormal", "dx_CreatinineAbnormal", "dx_CreatinineObservation"),
    "cholesterol": ("dx_Cholesterol", "dx_CholesterolNormal", "dx_CholesterolAbnormal", "dx_CholesterolObservation"),
    "triglycerides": ("dx_Triglycerides", "dx_TriglyceridesNormal", "dx_TriglyceridesAbnormal", "dx_TriglyceridesObservation"),
    "glucose_fasting": ("dx_Glucose", "dx_GlucoseNormal", "dx_GlucoseAbNormal", "dx_GlucoseObservation"),
    "urea_nitrogen": ("dx_Nitrogen", "dx_NitrogenNormal", "dx_NitrogenAbnormal", "dx_NitrogenObservation"),
    "rh_typing": ("dx_RhTyping", "dx_RhTypingNormal", "dx_RhTypingAbnormal", "dx_RhTypingObservation"),
    "hiv": ("dx_Hiv", "dx_HivNormal", "dx_HivAbnormal", "dx_HivObservation"),
    "vdrl": ("dx_Vdrl", "dx_VdrlNormal", "dx_VdrlAbnormal", "dx_VdrlObservation"),
    "gch_pregnant": ("dx_Gch", "dx_GchNormal", "dx_GchAbnormal", "dx_GchObservation"),
    "general_urin": ("dx_GeneralUrien", "dx_GeneralUrineNormal", "dx_GeneralUrineAbNormal", "dx_GeneralUrineObservation"),
    "stool_transit": ("dx_Stool", "dx_StoolNormal", "dx_StoolAbNormal", "dx_StoolObservation"),
    "drug_test": ("dx_Drugtest", "dx_DrugTestNormal", "dx_DrugTestAbNormal", "dx_DrugTestObservation"),
    "alcohol": ("dx_Alcohol", "dx_AlcoholNormal", "dx_AlcoholAbNormal", "dx_AlcoholObservation"),
}

#: The three result-only other tests: (flag, normal, abnormal, observations).
OTHER_TESTS_RESULT = {
    "breast_examination": ("dx_Breast", "dx_BreastExaminationNormal", "dx_BreastExaminationAbNormal", "dx_BreastExaminationObservation"),
    "pap_test": ("dx_PapTest", "dx_PaptestJNormal", "dx_PapAbnormal", "dx_PapObservation"),
    "psa_men": ("dx_Psa", "dx_PsaNormal", "dx_PsaAbNormal", "dx_PsaObservation"),
}

#: The two dated other tests: (flag, date, observations).
OTHER_TESTS_DATED = {
    "chest_xray": ("dx_Xray", "dx_XrayDate", "dx_XrayObservation"),
    "ekg": ("dx_Ekg", "dx_EkgDate", "dx_EkgObservation"),
}

SIGHT = {
    "sight_unaided_distant_right": "sght_UnaidedRightEyeDistant",
    "sight_unaided_distant_left": "sght_UnAidedLeftEyeDistant",
    "sight_unaided_distant_binocular": "sght_UnAidedBonocularDistant",
    "sight_unaided_short_right": "sght_UnaidedRightEyeShort",
    "sight_unaided_short_left": "sght_UnAidedLeftEyeShort",
    "sight_aided_distant_right": "sght_AidedRightEyeDistant",
    "sight_aided_distant_left": "sght_AidedLeftEyeDistant",
    "sight_aided_distant_binocular": "sght_AidedBinocularDistant",
    "sight_aided_short_right": "sght_AidedRightEyeShort",
    "sight_aided_short_left": "sght_AidedLeftEyeShort",
}

HEARING = {
    "hearing_right_500": "hear_500HzRightEar",
    "hearing_right_1000": "hear_1kRightEar",
    "hearing_right_2000": "hear_2kRightEar",
    "hearing_right_3000": "hear_3kRightEar",
    "hearing_right_4000": "hear_4kRight",
    "hearing_right_6000": "hear_6kRight",
    "hearing_right_8000": "hear_8kRight",
    "hearing_left_500": "hear_500HzLeftEar",
    "hearing_left_1000": "hear_1kLeftEar",
    "hearing_left_2000": "hear_2kLeftEar",
    "hearing_left_3000": "hear_3kLeftEar",
    "hearing_left_4000": "hear_4kleft",
    "hearing_left_6000": "hear_6kLeft",
    "hearing_left_8000": "hear_8kLeft",
}

SHIP_TYPE = {
    "bulk": "Others",
    "reefer": "Others",
    "reefer vessel": "Others",
    "container": "Container",
    "tanker": "Tanker",
    "passenger": "Passenger",
}

TRADE_AREA = {
    "worldwide": "Oceangoing",
    "oceangoing": "Oceangoing",
    "near-coastal": "Near-Coastal",
    "near coastal": "Near-Coastal",
}


def _joined(src: Mapping[str, str], columns: Iterable[str]) -> str | None:
    """Joins the legacy numbered comment columns into one block of text."""
    parts = [clean(src.get(column)) for column in columns]
    kept = [part for part in parts if part]
    return "\n".join(kept) or None


def _na_flag(value: Any) -> str | None:
    """Reads a legacy "X" / "+" / "NA" lab marker cell.

    These cells are deliberately not passed through the shared ``clean``
    helper: it treats "NA" as a blank placeholder, but here "NA" is a
    meaningful marker that the app stores as "N/A" (its own default for the
    gender-specific tests). Only truly empty cells become None.
    """
    if value is None:
        return None
    out = str(value).strip()
    if not out or out in {"-", "--"}:
        return None
    return "N/A" if out.upper() in {"NA", "N/A"} else out


def _lab_entry(src: Mapping[str, str], flag: str, normal: str, abnormal: str, obs: str) -> dict[str, Any]:
    return {
        "checked": yes_no(src.get(flag)) == "yes",
        "normal": _na_flag(src.get(normal)) or "",
        "abnormal": _na_flag(src.get(abnormal)) or "",
        "observations": clean(src.get(obs)) or "",
    }


def _compact_date(value: Any) -> str | None:
    """Parses the Covid test date, stored compactly as DDMMYYYY.

    Legacy also writes a literal row of underscores when no test was done.
    """
    out = clean(value)
    if out is None or set(out) <= {"_"}:
        return None
    digits = re.sub(r"\D", "", out)
    if len(digits) == 8:
        return iso_date(f"{digits[0:2]}/{digits[2:4]}/{digits[4:8]}", day_first=True)
    return iso_date(out, day_first=True)


def build_row(src: Mapping[str, str], ctx: RowContext) -> dict[str, Any]:
    # The current condition list has no attempted-suicide key (legacy
    # condition_27 was dropped in V25), so a positive answer is preserved as
    # a line of conditions_details rather than lost.
    suicide_note = None
    if yes_no(src.get("decl_Attemptedsuicide")) == "yes":
        suicide_note = "Attempted suicide: yes (migrated from legacy declaration)"
        ctx.drop("decl_Attemptedsuicide=yes (kept in conditions_details)")

    conditions: dict[str, str] = {}
    for legacy, keys in CONDITIONS.items():
        answer = yes_no(src.get(legacy))
        if answer is not None:
            for key in keys:
                conditions[key] = answer

    exploration: dict[str, str] = {}
    for key, legacy in EXPLORATION.items():
        answer = yes_no(src.get(legacy))
        if answer is not None:
            exploration[key] = "N" if answer == "yes" else "A"

    lab_tests = {
        key: _lab_entry(src, *columns) for key, columns in LAB_TESTS.items()
    }
    lab_other_tests = {
        key: _lab_entry(src, *columns) for key, columns in OTHER_TESTS_RESULT.items()
    }
    for key, (flag, date_column, obs_column) in OTHER_TESTS_DATED.items():
        lab_other_tests[key] = {
            "checked": yes_no(src.get(flag)) == "yes",
            "normal": "",
            "abnormal": "",
            "observations": clean(src.get(obs_column)) or "",
            "performed_date": iso_date(src.get(date_column), day_first=True) or "",
        }

    issued_day, issued_month, issued_year = split_iso_date(
        src.get("prm_MedicalCertificateIssued"), day_first=True
    )
    expiry_day, expiry_month, expiry_year = split_iso_date(
        src.get("prm_MedicalCertificateExpiration"), day_first=True
    )

    with_restrictions = yes_no(src.get("prm_WithRestrictions"))
    without_restrictions = yes_no(src.get("prm_WithOutRestrictions"))
    if with_restrictions == "yes":
        restriction = "with"
    elif without_restrictions == "yes":
        restriction = "without"
    else:
        restriction = None

    visual_aid_yes = yes_no(src.get("prm_cbVisualAidRequiredYes"))
    visual_aid_no = yes_no(src.get("prm_cbVisualAidRequiredNo"))
    if visual_aid_yes == "yes":
        visual_aid = "yes"
    elif visual_aid_no == "yes":
        visual_aid = "no"
    else:
        visual_aid = None

    row: dict[str, Any] = {
        # General information. The examination date is the certificate's
        # issue date, which the form shows as the day/month/year triple.
        "day": issued_day,
        "month": issued_month,
        "year": issued_year,
        "rh_typing": text(src.get("pp_RhTyping"), 50),
        "lookout_duties": text(src.get("pp_LookOutDuties"), 255),
        "routine_emergency_duties": clean(src.get("pp_EmergencyDuties")),
        "type_of_ship": mapped(
            src.get("pp_TypeOfShip"), SHIP_TYPE, unmapped=ctx.unmapped, label="type_of_ship"
        ),
        "type_of_ship_details": text(src.get("pp_TypeOfShip"), 255),
        "trade_area": mapped(
            src.get("pp_TradeArea"), TRADE_AREA, unmapped=ctx.unmapped, label="trade_area"
        ),
        "trade_area_details": text(src.get("pp_TradeArea"), 255),
        # Declaration
        "conditions": jsonb(conditions),
        "conditions_details": "\n".join(
            part
            for part in (
                _joined(
                    src,
                    (
                        "decl_Comment1",
                        "decl_Comment2",
                        "decl_Comment3",
                        "decl_Comment4",
                        "decl_Comment5",
                    ),
                ),
                suicide_note,
            )
            if part
        )
        or None,
        "declaration_comments": _joined(
            src,
            (
                "decl_AlternativeSuplimentComment1",
                "decl_AlternativeSuplimentComment2",
                "decl_AlternativeSuplimentComment3",
                "decl_AlternativeSuplimentComment4",
                "decl_AlternativeSuplimentComment5",
                "decl_AlternativeSuplimentComment6",
            ),
        ),
        "question_45_details": _joined(
            src,
            (
                "decl_TakenMedicationsComment1",
                "decl_TakenMedicationsComment2",
                "decl_TakenMedicationsComment3",
                "decl_TakenMedicationsComment4",
                "decl_TakenMedicationsComment5",
            ),
        ),
        # Covid-19
        "covid_1": yes_no(src.get("cov_ContactInCovidPositive")),
        "covid_2": yes_no(src.get("cov_CovidTest")),
        "covid_3_date": _compact_date(src.get("cov_CovidDateTest")),
        "covid_4": yes_no(src.get("cov_HadFeverLast30Days")),
        "covid_5": yes_no(src.get("cov_VaccinationCovid")),
        "covid_6_vaccine_type": text(src.get("cov_VaccineType"), 255),
        "covid_6_num_doses": text(src.get("cov_NumberofDoses"), 50),
        "covid_6_boosters": text(src.get("cov_Booster"), 50),
        # Statement
        "statement_previous_exam_details": clean(src.get("prm_PreviousMedical")),
        # Clinical data
        "height_cm": number_like(src.get("cd_Height")),
        "weight_kg": number_like(src.get("cd_Weight")),
        "bmi": number_like(src.get("cd_BMI")),
        "oxygen_saturation": number_like(src.get("cd_Oxygen")),
        "heart_rate": number_like(src.get("cd_HeartRate")),
        "respiratory_rate": number_like(src.get("cd_Respiratory")),
        "blood_pressure_systolic": number_like(src.get("cd_BloodPressure")),
        "blood_pressure_diastolic": number_like(src.get("cd_Diatolic")),
        # Sight: colour vision and visual fields are marker columns.
        "sight_color_vision": "Normal"
        if yes_no(src.get("sght_NormalColorVision")) == "yes"
        else ("Defective" if yes_no(src.get("sght_DefectiveColorVision")) == "yes" else None),
        "sight_color_method": text(src.get("sght_Comments"), 255),
        "sight_fields_right_normal": "Normal" if _na_flag(src.get("sght_NormalRightEye")) else None,
        "sight_fields_right_defective": "Defective" if _na_flag(src.get("sght_DefectiveRightEye")) else None,
        "sight_fields_left_normal": "Normal" if _na_flag(src.get("sght_NormalLeftEye")) else None,
        "sight_fields_left_defective": "Defective" if _na_flag(src.get("sght_DefectiveLeftEye")) else None,
        # Physical exploration
        "physical_exploration": jsonb(exploration),
        "physical_exploration_comments": _joined(
            src,
            (
                "phx_PhysicalExplorationComment1",
                "phx_PhysicalExplorationComment2",
                "phx_PhysicalExplorationComment3",
                "phx_PhysicalExplorationComment4",
            ),
        ),
        # Diagnostic tests
        "lab_tests": jsonb(lab_tests),
        "lab_other_tests": jsonb(lab_other_tests),
        "other_diag_test": clean(src.get("dx_OtherTest")),
        "other_diag_result": clean(src.get("dx_OtherTestResult")),
        "other_diag_comments": _joined(
            src,
            (
                "dx_DiagnosticComment1",
                "dx_DiagnosticComment2",
                "dx_DiagnosticComment3",
                "dx_DiagnosticComment4",
            ),
        ),
        # Fitness assessment
        "fitness_lookout": "fit"
        if yes_no(src.get("prm_FitForLookOut")) == "yes"
        else ("not_fit" if yes_no(src.get("prm_NonFitForLookOut")) == "yes" else None),
        "fitness_deck_fit": yes_no(src.get("prm_DeckServiceFit")) == "yes",
        "fitness_deck_unfit": yes_no(src.get("prm_DeckServiceUnFit")) == "yes",
        "fitness_engine_fit": yes_no(src.get("prm_EngineFit")) == "yes",
        "fitness_engine_unfit": yes_no(src.get("prm_EngineUnFit")) == "yes",
        "fitness_catering_fit": yes_no(src.get("prm_CateringFit")) == "yes",
        "fitness_catering_unfit": yes_no(src.get("prm_CateringUnFit")) == "yes",
        "fitness_other_fit": yes_no(src.get("prm_OtherServiceFit")) == "yes",
        "fitness_other_unfit": yes_no(src.get("prm_OtherUnFit")) == "yes",
        "fitness_restriction": restriction,
        "fitness_restriction_details": _joined(
            src,
            (
                "prm_assessmentComment1",
                "prm_assessmentComment2",
                "prm_assessmentComment3",
                "prm_assessmentComment4",
                "prm_assessmentComment5",
            ),
        ),
        "fitness_visual_aid": visual_aid,
        # Certificate
        "cert_issued_day": issued_day,
        "cert_issued_month": issued_month,
        "cert_issued_year": issued_year,
        "cert_expiry_day": expiry_day,
        "cert_expiry_month": expiry_month,
        "cert_expiry_year": expiry_year,
        "cert_number": text(src.get("prm_NumberOfMedicalCertificate"), 255),
        "physician_name": title_case_name(text(src.get("prm_PhysicianName"), 255)),
    }

    for target, legacy in QUESTIONS.items():
        row[target] = yes_no(src.get(legacy))
    for target, legacy in SIGHT.items():
        row[target] = text(src.get(legacy), 50)
    for target, legacy in HEARING.items():
        row[target] = text(src.get(legacy), 50)

    return row


SPEC = ModuleSpec(
    name="panama",
    csv_file="panama.csv",
    table="panama_certificates",
    business_id_column="panama_id",
    business_id_prefix="PAN",
    sequence="pan_seq",
    papin_columns=("pp_Papin", "prm_Papin", "pat_papin"),
    build_row=build_row,
    jsonb_columns=("conditions", "physical_exploration", "lab_tests", "lab_other_tests"),
    notes=(
        "The alcohol and drugs condition keys have no legacy source (legacy "
        "condition_20 only recorded smoking) and stay unset. The statement "
        "block's signature, witness and name fields have no legacy "
        "counterpart. Legacy hear_9k* and the 4k/6k/8k header columns carry "
        "frequency labels, not thresholds, so they are not migrated."
    ),
)
