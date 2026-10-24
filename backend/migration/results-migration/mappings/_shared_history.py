"""The past-medical-history JSONB contract shared by seabase and landbase.

Both ``medical_exams.medical_history`` and ``landbase_pemes.medical_history``
are ``Record<string, "yes" | "no">`` keyed by the full condition label as it
appears in the form. The two frontend grids declare the key set independently
but identically, so the mapping lives here once.

The keys are reproduced byte-for-byte, including the inconsistent
capitalization and the trailing colon on "Allergies (Specify):" — the grid
looks conditions up by exact string, so a near-miss renders as unanswered.
"""

from __future__ import annotations

from typing import Any, Mapping

from common import clean, yes_no

#: legacy column -> exact JSONB key used by the form
CONDITION_KEYS = {
    "mh_head_injury": "Head or Neck Injury",
    "mh_frequent_headaches": "Frequent Headaches",
    "mh_frequent_dizziness": "Frequent Dizziness",
    "mh_fainting_spells": "Fainting Spells, Fits, Seizures or other Neurological Disorders",
    "mh_insomnia": "Insomnia or sleep disorders, Manias, Phobias",
    "mh_depression": "Depression, other Mental Disorders",
    "mh_trachoma": "Trachoma, other eye Disorders",
    "mh_deafness": "Deafness, other Ear Disorders",
    "mh_nose_throat_disorder": "Nose or Throat Disorders",
    "mh_tuberculosis": "Tuberculosis",
    "mh_other_lung_disorder": "Other Lung Disorders",
    "mh_high_blood_pressure": "High Blood Pressure",
    "mh_heart_disease": "Heart Disease/Heart Pain",
    "mh_rheumatic_fever": "Rheumatic Fever",
    "mh_diabetes_mellitus": "Diabetes Mellitus",
    "mh_other_endocrine_disorder": "Other Endocrine Disorders (e.g. Goiter)",
    "mh_cancer_tumor": "Cancer or Tumor",
    "mh_blood_disorders": "Blood Disorders",
    "mh_stomach_pain": "Stomach Pain, Gastritis or Ulcer",
    "mh_other_abdominal_disorder": "Other Abdominal Disorders",
    "mh_kidney_bladder_disorder": "Kidney or Bladder Disorder",
    "mh_back_injury": "Back Injury: Joint Pain/Arthritis/Rheumatism",
    "mh_genetic_hereditary": "Genetic, Hereditary or Familial Disorders",
    "mh_sexually_transmit_disease": "Sexually Transmitted Diseases",
    "mh_last_menstrual_period": "Last Menstrual Period",
    "mh_tropical_disease": "Tropical Diseases",
    "mh_schistosomiasis": "Schistosomiasis",
    "mh_asthma": "Asthma",
    "mh_allergies": "Allergies (Specify):",
    "mh_gynecological_disorder": "Gynecological Disorder (For female)",
    "mh_operations": "Operations (Specify)",
}

#: legacy free-text column -> the " Details" key stored in the same map.
#: Note "Allergies (Specify) Details" has no colon, unlike its answer key.
DETAIL_KEYS = {
    "mh_other_abdominal_specify": "Other Abdominal Disorders Details",
    "mh_allergies_specify": "Allergies (Specify) Details",
    "mh_operations_specify": "Operations (Specify) Details",
}


def build_medical_history(src: Mapping[str, str]) -> dict[str, str]:
    """Builds the medical_history JSONB map from the legacy ``mh_*`` columns.

    Only answered conditions are written. An unanswered legacy cell ("-" or
    blank) is omitted rather than defaulted to "no", so a migrated record does
    not claim the seafarer denied a condition nobody asked about.
    """
    history: dict[str, str] = {}
    for legacy, key in CONDITION_KEYS.items():
        answer = yes_no(src.get(legacy))
        if answer is not None:
            history[key] = answer
    for legacy, key in DETAIL_KEYS.items():
        detail = clean(src.get(legacy))
        if detail is not None:
            history[key] = detail
    return history


#: The seabase questionnaire keys are the full question sentences. Legacy
#: stores the answers positionally in mh2_column1..8 with matching comments.
QUESTIONNAIRE_KEYS = {
    "mh2_column1": "Have you ever been signed off as sick or repatriated from a ship?",
    "mh2_column2": "Have you ever been hospitalized?",
    "mh2_column3": "Have you ever been declared unfit for sea duty?",
    "mh2_column4": "Has your medical certificate ever been restricted or revoked?",
    "mh2_column5": "Are you aware that you have any medical problem, disease or illness?",
    "mh2_column6": "Do you feel healthy and fit to perform the duties of your designated position/occupation?",
    "mh2_column7": "Are you allergic to any medication?",
    "mh2_column8": "Non-prescription or prescription medication",
}

#: Questions 1-6 carry a " Details" sibling key; 7 and 8 do not (their text
#: goes to questionnaire_comments and questionnaire_medications_detail).
QUESTIONNAIRE_DETAIL_COLUMNS = {
    "mh2_column1_comment": "Have you ever been signed off as sick or repatriated from a ship? Details",
    "mh2_column2_comment": "Have you ever been hospitalized? Details",
    "mh2_column3_comment": "Have you ever been declared unfit for sea duty? Details",
    "mh2_column4_comment": "Has your medical certificate ever been restricted or revoked? Details",
    "mh2_column5_comment": "Are you aware that you have any medical problem, disease or illness? Details",
    "mh2_column6_comment": "Do you feel healthy and fit to perform the duties of your designated position/occupation? Details",
}


def build_questionnaire(src: Mapping[str, str]) -> dict[str, str]:
    """Builds the seabase ``questionnaire`` JSONB map."""
    answers: dict[str, str] = {}
    for legacy, key in QUESTIONNAIRE_KEYS.items():
        answer = yes_no(src.get(legacy))
        if answer is not None:
            answers[key] = answer
    for legacy, key in QUESTIONNAIRE_DETAIL_COLUMNS.items():
        detail = clean(src.get(legacy))
        if detail is not None:
            answers[key] = detail
    return answers
