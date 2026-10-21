package com.centerport.hiv.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when an existing HIV report is updated.
 *
 * Carries the aggregate ID and business ID for correlation in audit
 * logging and downstream event consumers.
 *
 * Immutability:
 * All fields are {@code final} — safe for async event listeners.
 *
 * @see HivReportCreatedEvent
 * @see com.centerport.common.event.DomainEvent
 */
@Getter
public class HivReportUpdatedEvent extends DomainEvent {

    private final String reportId;

    public HivReportUpdatedEvent(UUID aggregateId, String reportId) {
        super(aggregateId);
        this.reportId = reportId;
    }
}
