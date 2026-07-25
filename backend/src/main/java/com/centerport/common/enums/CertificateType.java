package com.centerport.common.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Maritime medical certificate type indicating which regulatory standard applies.
 * Used in MLC records to distinguish ILO/MLC, STCW, and Flag State certificates.
 */
public enum CertificateType {
    ILO_MLC("ILO/MLC"),
    STCW("STCW"),
    FLAG_STATE("Flag State");

    private final String value;

    CertificateType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static CertificateType fromValue(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        for (CertificateType c : values()) {
            if (c.value.equals(value)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Invalid CertificateType: " + value);
    }
}
