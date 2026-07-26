package com.centerport.profile.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when a new seafarer profile is created.
 *
 * Carries the aggregate ID, business ID, and patient name for
 * downstream audit and notification workflows.
 *
 * @see com.centerport.profile.SeafarerProfileService
 */
@Getter
public class SeafarerProfileCreatedEvent extends DomainEvent {

    private final String profileId;
    private final String lastName;
    private final String firstName;

    public SeafarerProfileCreatedEvent(UUID aggregateId, String profileId,
                                       String lastName, String firstName) {
        super(aggregateId);
        this.profileId = profileId;
        this.lastName = lastName;
        this.firstName = firstName;
    }
}
