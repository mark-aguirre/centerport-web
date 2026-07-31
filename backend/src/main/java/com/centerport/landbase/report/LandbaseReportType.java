package com.centerport.landbase.report;

import java.util.Arrays;

/**
 * Enumerates the available landbase PEME report templates.
 *
 * Each value maps to a JRXML file under {@code reports/landbase/} on the classpath.
 */
public enum LandbaseReportType {

    DETAILED("landbase-detailed", "Landbase Detailed Report"),
    MER_1("landbase-mer-1", "Medical Examination Report Form 1"),
    MER_2("landbase-mer-2", "Medical Examination Report Form 2"),
    MLC("landbase-mlc", "MLC Medical Certificate"),
    SUMMARY("landbase-summary", "Landbase Summary Report");

    private final String templateName;
    private final String displayName;

    LandbaseReportType(String templateName, String displayName) {
        this.templateName = templateName;
        this.displayName = displayName;
    }

    /** Returns the JRXML template filename (without extension). */
    public String getTemplateName() {
        return templateName;
    }

    /** Returns a human-readable label for the report. */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Resolve a report type from its template name (kebab-case slug).
     *
     * @param name the template slug (e.g. "landbase-detailed")
     * @return the matching enum value
     * @throws IllegalArgumentException if no match is found
     */
    public static LandbaseReportType fromTemplateName(String name) {
        return Arrays.stream(values())
                .filter(t -> t.templateName.equals(name))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Unknown report type: " + name + ". Valid types: " +
                        Arrays.toString(Arrays.stream(values())
                                .map(LandbaseReportType::getTemplateName)
                                .toArray())));
    }
}
