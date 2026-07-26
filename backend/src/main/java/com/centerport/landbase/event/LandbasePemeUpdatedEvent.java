package com.centerport.landbase.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when an existing landbase PEME record is updated.
 *
 * Carries the aggregate ID and business ID for correlation.
 *
 * @see com.centerport.landbase.LandbasePemeService
 */
@Getter
public class LandbasePemeUpdatedEvent extends DomainEvent {

    private final String pemeId;

    public LandbasePemeUpdatedEvent(UUID aggregateId, String pemeId) {
        super(aggregateId);
        this.pemeId = pemeId;
    }
}
