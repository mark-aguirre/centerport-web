package com.centerport.psychology.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when a new psychology evaluation record is created.
 *
 * Consumers can use this event to trigger downstream workflows such as
 * audit trail recording or notification dispatch.
 *
 * @see com.centerport.psychology.PsychologyEvaluationService
 */
@Getter
public class PsychologyEvaluationCreatedEvent extends DomainEvent {

    private final String evalId;
    private final String patientLastName;
    private final String patientFirstName;

    public PsychologyEvaluationCreatedEvent(UUID aggregateId, String evalId,
                                            String patientLastName, String patientFirstName) {
        super(aggregateId);
        this.evalId = evalId;
        this.patientLastName = patientLastName;
        this.patientFirstName = patientFirstName;
    }
}
