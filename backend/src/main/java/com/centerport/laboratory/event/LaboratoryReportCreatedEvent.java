package com.centerport.laboratory.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when a new laboratory report is created.
 *
 * Carries the aggregate ID, business ID, and patient name for downstream
 * audit logging and notification workflows.
 *
 * Immutability:
 * All fields are {@code final} — safe for async event listeners.
 *
 * @see LaboratoryReportUpdatedEvent
 * @see com.centerport.common.event.DomainEvent
 */
@Getter
public class LaboratoryReportCreatedEvent extends DomainEvent {

    private final String reportId;
    private final String patientLastName;
    private final String patientFirstName;

    public LaboratoryReportCreatedEvent(UUID aggregateId, String reportId,
                                        String patientLastName, String patientFirstName) {
        super(aggregateId);
        this.reportId = reportId;
        this.patientLastName = patientLastName;
        this.patientFirstName = patientFirstName;
    }
}
