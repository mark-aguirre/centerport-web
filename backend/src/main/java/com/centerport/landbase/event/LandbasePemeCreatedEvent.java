package com.centerport.landbase.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when a new landbase PEME record is created.
 *
 * Carries the aggregate ID, business ID, and patient name for
 * downstream audit and notification workflows.
 *
 * @see com.centerport.landbase.LandbasePemeService
 */
@Getter
public class LandbasePemeCreatedEvent extends DomainEvent {

    private final String pemeId;
    private final String patientLastName;
    private final String patientFirstName;

    public LandbasePemeCreatedEvent(UUID aggregateId, String pemeId,
                                    String patientLastName, String patientFirstName) {
        super(aggregateId);
        this.pemeId = pemeId;
        this.patientLastName = patientLastName;
        this.patientFirstName = patientFirstName;
    }
}
