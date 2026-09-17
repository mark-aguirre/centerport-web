package com.centerport.dashboard;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDateTime;

/**
 * A single entry in the dashboard "Recent Activity" feed.
 *
 * Activity items are aggregated across heterogeneous domain records (profiles,
 * medical exams, landbase PEMEs, Panama certificates, MLC records, patient
 * visits). Each source record is projected into this uniform shape so the
 * frontend can render one timeline regardless of origin.
 *
 * Fields:
 * <ul>
 *   <li>{@code type} — a stable machine key for the source kind (e.g.
 *       {@code "medical_exam"}, {@code "profile"}); the frontend maps it to an
 *       icon.</li>
 *   <li>{@code title} — a short human-readable label (e.g. "Medical exam
 *       recorded").</li>
 *   <li>{@code description} — supporting detail, typically the patient name and
 *       business id.</li>
 *   <li>{@code businessId} — the source record's business identifier (e.g.
 *       {@code MED00000001}), for reference.</li>
 *   <li>{@code timestamp} — when the record was created; the feed is sorted by
 *       this, newest first.</li>
 * </ul>
 *
 * {@code @Jacksonized} lets Jackson reconstruct this immutable, builder-based
 * DTO when the activity list is read back from the Redis cache. Jackson's global
 * snake_case strategy serializes {@code businessId} as {@code business_id}, etc.
 */
@Getter
@Builder
@Jacksonized
public class ActivityItemDto {

    private final String type;
    private final String title;
    private final String description;
    private final String businessId;
    private final LocalDateTime timestamp;
}
