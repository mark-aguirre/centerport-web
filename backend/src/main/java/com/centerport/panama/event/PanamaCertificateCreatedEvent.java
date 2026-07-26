package com.centerport.panama.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when a new Panama certificate record is created.
 *
 * Carries the aggregate ID, business ID, and patient name for
 * downstream audit and notification workflows.
 *
 * @see com.centerport.panama.PanamaCertificateService
 */
@Getter
public class PanamaCertificateCreatedEvent extends DomainEvent {

    private final String panamaId;
    private final String fullName;

    public PanamaCertificateCreatedEvent(UUID aggregateId, String panamaId, String fullName) {
        super(aggregateId);
        this.panamaId = panamaId;
        this.fullName = fullName;
    }
}
