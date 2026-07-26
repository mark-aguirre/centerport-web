package com.centerport.mlc.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when a new MLC (Maritime Labour Convention) record is created.
 *
 * Carries the aggregate ID, business ID, and patient name for
 * downstream audit and notification workflows.
 *
 * @see com.centerport.mlc.MlcRecordService
 */
@Getter
public class MlcRecordCreatedEvent extends DomainEvent {

    private final String mlcId;
    private final String patientLastName;
    private final String patientFirstName;

    public MlcRecordCreatedEvent(UUID aggregateId, String mlcId,
                                 String patientLastName, String patientFirstName) {
        super(aggregateId);
        this.mlcId = mlcId;
        this.patientLastName = patientLastName;
        this.patientFirstName = patientFirstName;
    }
}
