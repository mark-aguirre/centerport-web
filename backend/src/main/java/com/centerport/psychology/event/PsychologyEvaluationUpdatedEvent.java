package com.centerport.psychology.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when an existing psychology evaluation record is updated.
 *
 * Carries the aggregate ID and business ID for correlation. Consumers
 * can look up full details from the repository if needed.
 *
 * @see com.centerport.psychology.PsychologyEvaluationService
 */
@Getter
public class PsychologyEvaluationUpdatedEvent extends DomainEvent {

    private final String evalId;

    public PsychologyEvaluationUpdatedEvent(UUID aggregateId, String evalId) {
        super(aggregateId);
        this.evalId = evalId;
    }
}
