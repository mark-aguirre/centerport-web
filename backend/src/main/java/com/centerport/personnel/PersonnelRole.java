package com.centerport.personnel;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Structured role/category for a {@link MedicalPersonnel} record.
 *
 * <p>Replaces the free-text {@code specialization} field as the authoritative,
 * machine-readable classification that drives module assignments. Serialized as
 * stable upper-snake codes ({@code "MED_TECH"}, {@code "PATHOLOGIST"}, ...) so
 * the frontend and database agree on a single vocabulary.
 *
 * <p>The role determines which module a person may be assigned to (see
 * {@link com.centerport.personnel.assignment.PersonnelModule#allowedRoles()}):
 * <ul>
 *   <li>Laboratory — {@link #MED_TECH}, {@link #PATHOLOGIST}</li>
 *   <li>Seabase / MLC / Landbase — {@link #AUTHORIZED_PHYSICIAN}, {@link #MEDICAL_DIRECTOR}</li>
 *   <li>Psychology — {@link #PSYCHOMETRICIAN}, {@link #PSYCHOLOGIST}</li>
 * </ul>
 */
public enum PersonnelRole {
    MED_TECH("MED_TECH", "Medical Technologist"),
    PATHOLOGIST("PATHOLOGIST", "Pathologist"),
    AUTHORIZED_PHYSICIAN("AUTHORIZED_PHYSICIAN", "Authorized Physician"),
    MEDICAL_DIRECTOR("MEDICAL_DIRECTOR", "Medical Director"),
    PSYCHOMETRICIAN("PSYCHOMETRICIAN", "Psychometrician"),
    PSYCHOLOGIST("PSYCHOLOGIST", "Psychologist");

    private final String code;
    private final String label;

    PersonnelRole(String code, String label) {
        this.code = code;
        this.label = label;
    }

    @JsonValue
    public String getCode() {
        return code;
    }

    /** Human-readable label for display purposes. */
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static PersonnelRole fromCode(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        for (PersonnelRole r : values()) {
            if (r.code.equalsIgnoreCase(value) || r.name().equalsIgnoreCase(value)) {
                return r;
            }
        }
        throw new IllegalArgumentException("Invalid PersonnelRole: " + value);
    }
}
