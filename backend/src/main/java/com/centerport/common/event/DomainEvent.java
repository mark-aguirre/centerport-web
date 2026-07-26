package com.centerport.common.event;

import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

/**
 * Abstract base for all domain events in the system.
 *
 * Provides standard metadata that every event carries: a unique event ID,
 * the instant the event occurred, the source aggregate's UUID, and a
 * human-readable event type name for routing and audit logging.
 *
 * Immutability:
 * All fields are {@code final} and set at construction time. Subclasses
 * must follow the same pattern — declare additional fields as {@code final}
 * and initialize via their constructor.
 *
 * @see AuditEventListener
 */
@Getter
public abstract class DomainEvent {

    private final UUID eventId;
    private final Instant occurredAt;
    private final UUID aggregateId;

    protected DomainEvent(UUID aggregateId) {
        this.eventId = UUID.randomUUID();
        this.occurredAt = Instant.now();
        this.aggregateId = aggregateId;
    }

    /**
     * Returns the event type name used for routing and logging.
     * Default implementation returns the simple class name.
     * Override for custom naming conventions.
     */
    public String getEventType() {
        return this.getClass().getSimpleName();
    }
}
