package com.centerport.profile.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when an existing seafarer profile is updated.
 *
 * Carries the aggregate ID and business ID for correlation.
 *
 * @see com.centerport.profile.SeafarerProfileService
 */
@Getter
public class SeafarerProfileUpdatedEvent extends DomainEvent {

    private final String profileId;

    public SeafarerProfileUpdatedEvent(UUID aggregateId, String profileId) {
        super(aggregateId);
        this.profileId = profileId;
    }
}
