package com.centerport.panama.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when an existing Panama certificate record is updated.
 *
 * Carries the aggregate ID and business ID for correlation.
 *
 * @see com.centerport.panama.PanamaCertificateService
 */
@Getter
public class PanamaCertificateUpdatedEvent extends DomainEvent {

    private final String panamaId;

    public PanamaCertificateUpdatedEvent(UUID aggregateId, String panamaId) {
        super(aggregateId);
        this.panamaId = panamaId;
    }
}
