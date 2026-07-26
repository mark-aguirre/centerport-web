package com.centerport.medical.event;

import com.centerport.common.event.DomainEvent;
import lombok.Getter;

import java.util.UUID;

/**
 * Published when an existing medical examination record is updated.
 *
 * Carries the aggregate ID and business ID for correlation. Consumers
 * can look up full details from the repository if needed.
 *
 * @see com.centerport.medical.MedicalExamService
 */
@Getter
public class MedicalExamUpdatedEvent extends DomainEvent {

    private final String examId;

    public MedicalExamUpdatedEvent(UUID aggregateId, String examId) {
        super(aggregateId);
        this.examId = examId;
    }
}
