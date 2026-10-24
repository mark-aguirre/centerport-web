package com.centerport.personnel.assignment;

import com.centerport.personnel.PersonnelRole;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.List;
import java.util.Set;

/**
 * A module/facility to which medical personnel can be assigned as the default
 * signatory for one or more roles.
 *
 * <p>Each module declares the {@link PersonnelRole roles} that may be assigned
 * to it, enforcing the matrix from the specification:
 * <table>
 *   <caption>Module → assignable roles</caption>
 *   <tr><td>Laboratory</td><td>Medical Technologist, Pathologist</td></tr>
 *   <tr><td>Seabase</td><td>Authorized Physician, Medical Director</td></tr>
 *   <tr><td>MLC</td><td>Authorized Physician, Medical Director</td></tr>
 *   <tr><td>Landbase</td><td>Authorized Physician, Medical Director</td></tr>
 *   <tr><td>Psychology</td><td>Psychometrician, Psychologist</td></tr>
 *   <tr><td>Immunology</td><td>Medical Technologist, Pathologist</td></tr>
 *   <tr><td>Panama</td><td>Authorized Physician, Medical Director</td></tr>
 *   <tr><td>HIV</td><td>Medical Technologist, Pathologist, Authorized Physician</td></tr>
 *   <tr><td>Ultrasound</td><td>X-Ray Technologist, Radiologist</td></tr>
 *   <tr><td>X-Ray</td><td>X-Ray Technologist, Radiologist</td></tr>
 * </table>
 *
 * <p>Serialized as stable upper-snake codes ({@code "LABORATORY"}, ...).
 */
public enum PersonnelModule {
    LABORATORY("LABORATORY", "Laboratory",
            List.of(PersonnelRole.MED_TECH, PersonnelRole.PATHOLOGIST)),
    SEABASE("SEABASE", "Seabase",
            List.of(PersonnelRole.AUTHORIZED_PHYSICIAN, PersonnelRole.MEDICAL_DIRECTOR)),
    MLC("MLC", "MLC",
            List.of(PersonnelRole.AUTHORIZED_PHYSICIAN, PersonnelRole.MEDICAL_DIRECTOR)),
    LANDBASE("LANDBASE", "Landbase",
            List.of(PersonnelRole.AUTHORIZED_PHYSICIAN, PersonnelRole.MEDICAL_DIRECTOR)),
    PSYCHOLOGY("PSYCHOLOGY", "Psychology",
            List.of(PersonnelRole.PSYCHOMETRICIAN, PersonnelRole.PSYCHOLOGIST)),
    IMMUNOLOGY("IMMUNOLOGY", "Immunology",
            List.of(PersonnelRole.MED_TECH, PersonnelRole.PATHOLOGIST)),
    PANAMA("PANAMA", "Panama",
            List.of(PersonnelRole.AUTHORIZED_PHYSICIAN, PersonnelRole.MEDICAL_DIRECTOR)),
    HIV("HIV", "HIV",
            List.of(PersonnelRole.MED_TECH, PersonnelRole.PATHOLOGIST, PersonnelRole.AUTHORIZED_PHYSICIAN)),
    ULTRASOUND("ULTRASOUND", "Ultrasound",
            List.of(PersonnelRole.XRAY_TECH, PersonnelRole.RADIOLOGIST)),
    XRAY("XRAY", "X-Ray",
            List.of(PersonnelRole.XRAY_TECH, PersonnelRole.RADIOLOGIST));

    private final String code;
    private final String label;
    private final Set<PersonnelRole> allowedRoles;

    PersonnelModule(String code, String label, List<PersonnelRole> allowedRoles) {
        this.code = code;
        this.label = label;
        this.allowedRoles = Set.copyOf(allowedRoles);
    }

    @JsonValue
    public String getCode() {
        return code;
    }

    public String getLabel() {
        return label;
    }

    /** The roles that may be assigned to this module. */
    public Set<PersonnelRole> allowedRoles() {
        return allowedRoles;
    }

    /** True if {@code role} is assignable to this module. */
    public boolean allows(PersonnelRole role) {
        return role != null && allowedRoles.contains(role);
    }

    @JsonCreator
    public static PersonnelModule fromCode(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        for (PersonnelModule m : values()) {
            if (m.code.equalsIgnoreCase(value) || m.name().equalsIgnoreCase(value)) {
                return m;
            }
        }
        throw new IllegalArgumentException("Invalid PersonnelModule: " + value);
    }
}
