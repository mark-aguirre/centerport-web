package com.centerport.transaction;

/**
 * Lifecycle status of a {@link Transaction}.
 *
 * <p>A DRAFT is built client-side and is not persisted; the backend persists a
 * transaction only when it is settled. A SETTLED transaction may later be
 * VOIDED, but is never physically deleted.
 */
public enum TransactionStatus {
    DRAFT,
    SETTLED,
    VOIDED
}
