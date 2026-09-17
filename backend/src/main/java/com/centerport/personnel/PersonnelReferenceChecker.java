package com.centerport.personnel;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Determines whether a medical personnel record is referenced by any existing
 * report or certificate.
 *
 * <p>Signatory data is <b>denormalized</b> onto report records as plain
 * name/license strings (there is no foreign key from a report to
 * {@code medical_personnel}). Consequently the only reliable way to know
 * whether deleting a person would orphan a historical signature is to scan the
 * report tables for a matching name or license number.
 *
 * <p>This check backs the delete guard in {@link MedicalPersonnelService#delete}:
 * when a person is referenced, deletion is refused and the caller is directed to
 * deactivate instead — which preserves the historical snapshot while removing the
 * person from future selection.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PersonnelReferenceChecker {

    private final JdbcTemplate jdbcTemplate;

    /**
     * One report table and the signatory columns on it that may hold a
     * personnel name or license number.
     */
    private record ReferenceSource(String table, List<String> nameColumns, List<String> licenseColumns) {
    }

    /**
     * Report tables and their signatory columns. Kept in code (not config) so it
     * stays close to the entities it mirrors; extend this list when a new report
     * type stores signatory strings.
     */
    private static final List<ReferenceSource> SOURCES = List.of(
            new ReferenceSource("laboratory_reports",
                    List.of("med_tech", "pathologist"),
                    List.of("med_tech_license_no", "pathologist_license_no")),
            new ReferenceSource("medical_exams",
                    List.of("authorized_physician", "medical_director", "examining_physician"),
                    List.of("medical_certification_no", "license_no")),
            new ReferenceSource("mlc_records",
                    List.of("examining_physician", "medical_director"),
                    List.of()),
            new ReferenceSource("landbase_pemes",
                    List.of("authorized_physician", "medical_director"),
                    List.of("medical_certification_no")),
            new ReferenceSource("panama_certificates",
                    List.of("physician_name"),
                    List.of()),
            new ReferenceSource("psychology_evaluations",
                    List.of("psychometrician", "psychologist"),
                    List.of("psychometrician_license_no", "psychologist_license_no"))
    );

    /**
     * Returns {@code true} if the given name or license number appears as a
     * signatory on any existing report.
     *
     * <p>The check is defensive: any table/column that does not exist (e.g. a
     * report type not yet migrated) is skipped rather than failing the whole
     * check, so an incidental schema difference never blocks a legitimate delete
     * or, worse, silently allows an unsafe one — a missing column simply cannot
     * contribute a match.
     *
     * @param name      the personnel name to look for (may be null/blank)
     * @param licenseNo the personnel license number to look for (may be null/blank)
     * @return true if a reference exists in any known report table
     */
    public boolean isReferenced(String name, String licenseNo) {
        boolean hasName = name != null && !name.isBlank();
        boolean hasLicense = licenseNo != null && !licenseNo.isBlank();
        if (!hasName && !hasLicense) {
            return false;
        }

        for (ReferenceSource source : SOURCES) {
            if (hasName && matchesAny(source.table(), source.nameColumns(), name)) {
                return true;
            }
            if (hasLicense && matchesAny(source.table(), source.licenseColumns(), licenseNo)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Runs a single {@code EXISTS} query over the given columns of a table for a
     * case-insensitive exact match of {@code value}.
     */
    private boolean matchesAny(String table, List<String> columns, String value) {
        if (columns.isEmpty()) {
            return false;
        }
        StringBuilder where = new StringBuilder();
        for (int i = 0; i < columns.size(); i++) {
            if (i > 0) {
                where.append(" OR ");
            }
            // Column and table names are compile-time constants from SOURCES, not
            // user input, so interpolating them is safe; the value is bound.
            where.append("LOWER(").append(columns.get(i)).append(") = LOWER(?)");
        }
        String sql = "SELECT EXISTS (SELECT 1 FROM " + table + " WHERE " + where + ")";
        Object[] args = new Object[columns.size()];
        for (int i = 0; i < columns.size(); i++) {
            args[i] = value;
        }
        try {
            Boolean result = jdbcTemplate.queryForObject(sql, Boolean.class, args);
            return Boolean.TRUE.equals(result);
        } catch (RuntimeException ex) {
            // A missing table/column (or other query error) must not mask a real
            // reference — log and treat this source as "no match" so the scan
            // continues across the remaining tables.
            log.warn("Reference check skipped for {} ({}): {}", table, columns, ex.getMessage());
            return false;
        }
    }
}
