package com.centerport.immunology.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when an existing immunology report is updated.
 *
 * Carries the aggregate ID and business ID for correlation in audit
 * logging and downstream event consumers.
 *
 * Immutability:
 * All fields are {@code final} — safe for async event listeners.
 *
 * @see ImmunologyReportCreatedEvent
 * @see com.centerport.common.event.DomainEvent
 */
@Getter
public class ImmunologyReportUpdatedEvent extends DomainEvent {

    private final String reportId;

    public ImmunologyReportUpdatedEvent(UUID aggregateId, String reportId) {
        super(aggregateId);
        this.reportId = reportId;
    }
}
