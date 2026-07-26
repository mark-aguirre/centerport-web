package com.centerport.common.exception;

/**
 * Thrown when a request conflicts with the current state of a resource
 * (e.g., duplicate unique fields, concurrent modification).
 * Mapped to HTTP 409 by the global exception handler.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
