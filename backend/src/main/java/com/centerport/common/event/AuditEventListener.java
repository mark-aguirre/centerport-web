package com.centerport.common.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Centralized audit listener for all domain events.
 *
 * Logs every domain event with structured metadata (type, aggregate ID,
 * event ID, timestamp) to provide a complete audit trail without requiring
 * each module to implement its own logging.
 *
 * Listener Semantics:
 * This listener is synchronous and participates in the publishing
 * transaction. If async processing is needed for specific events,
 * create a dedicated listener annotated with
 * {@code @Async("eventTaskExecutor")}.
 *
 * @see DomainEvent
 * @see com.centerport.config.AsyncConfig
 */
@Slf4j
@Component
public class AuditEventListener {

    /**
     * Logs all domain events for centralized audit trail.
     *
     * @param event the domain event to audit
     */
    @EventListener
    public void onDomainEvent(DomainEvent event) {
        log.info("Domain event published — type: {}, aggregateId: {}, eventId: {}, occurredAt: {}",
                event.getEventType(), event.getAggregateId(),
                event.getEventId(), event.getOccurredAt());
    }
}
