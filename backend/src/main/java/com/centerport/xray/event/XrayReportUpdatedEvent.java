package com.centerport.xray.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when an existing x-ray report is updated.
 *
 * Carries the aggregate ID and business ID for correlation in audit
 * logging and downstream event consumers.
 *
 * Immutability:
 * All fields are {@code final} — safe for async event listeners.
 *
 * @see XrayReportCreatedEvent
 * @see com.centerport.common.event.DomainEvent
 */
@Getter
public class XrayReportUpdatedEvent extends DomainEvent {

    private final String reportId;

    public XrayReportUpdatedEvent(UUID aggregateId, String reportId) {
        super(aggregateId);
        this.reportId = reportId;
    }
}
