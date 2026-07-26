package com.centerport.mlc.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when an existing MLC record is updated.
 *
 * Carries the aggregate ID and business ID for correlation.
 *
 * @see com.centerport.mlc.MlcRecordService
 */
@Getter
public class MlcRecordUpdatedEvent extends DomainEvent {

    private final String mlcId;

    public MlcRecordUpdatedEvent(UUID aggregateId, String mlcId) {
        super(aggregateId);
        this.mlcId = mlcId;
    }
}
