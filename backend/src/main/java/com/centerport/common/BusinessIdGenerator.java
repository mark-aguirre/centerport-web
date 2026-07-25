package com.centerport.common;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * Generates human-readable sequential business IDs in the format
 * {@code {PREFIX} + 8-digit zero-padded number}.
 *
 * Each aggregate has its own PostgreSQL sequence (e.g., {@code cmsi_seq},
 * {@code med_seq}) ensuring concurrency-safe unique ID generation without
 * application-level locking.
 *
 * Input Validation:
 * The prefix is validated against an alphanumeric pattern before being used
 * to construct the sequence name, preventing SQL injection via malicious input.
 *
 * @see BaseEntity
 */
@Component
@RequiredArgsConstructor
public class BusinessIdGenerator {

    private static final Pattern VALID_PREFIX = Pattern.compile("^[A-Za-z][A-Za-z0-9]{0,9}$");

    private final JdbcTemplate jdbcTemplate;

    /**
     * Generates the next business ID for the given prefix.
     * Uses a PostgreSQL sequence named {@code {prefix_lowercase}_seq} to obtain
     * the next value.
     *
     * @param prefix the business-ID prefix (e.g., "CMSI", "MED", "PEME")
     * @return formatted ID like {@code "CMSI00000001"}
     * @throws IllegalArgumentException if prefix is null, blank, or contains
     *                                  non-alphanumeric characters
     */
    public String generateId(String prefix) {
        validatePrefix(prefix);

        String sequenceName = prefix.toLowerCase() + "_seq";
        Long nextVal = jdbcTemplate.queryForObject(
                "SELECT nextval('" + sequenceName + "')",
                Long.class
        );
        return prefix.toUpperCase() + String.format("%08d", nextVal);
    }

    private static void validatePrefix(String prefix) {
        if (prefix == null || prefix.isBlank()) {
            throw new IllegalArgumentException("Business ID prefix must not be blank");
        }
        if (!VALID_PREFIX.matcher(prefix).matches()) {
            throw new IllegalArgumentException(
                    "Business ID prefix must be 1-10 alphanumeric characters starting with a letter: " + prefix);
        }
    }
}
