package com.centerport.medical.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when a new medical examination record is created.
 *
 * Consumers can use this event to trigger downstream workflows such as
 * certificate readiness checks, audit trail recording, or notification
 * dispatch.
 *
 * @see com.centerport.medical.MedicalExamService
 */
@Getter
public class MedicalExamCreatedEvent extends DomainEvent {

    private final String examId;
    private final String patientLastName;
    private final String patientFirstName;

    public MedicalExamCreatedEvent(UUID aggregateId, String examId,
                                   String patientLastName, String patientFirstName) {
        super(aggregateId);
        this.examId = examId;
        this.patientLastName = patientLastName;
        this.patientFirstName = patientFirstName;
    }
}
