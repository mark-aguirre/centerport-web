package com.centerport.common.exception;

/**
 * Thrown when a client request is invalid due to business rule violations
 * that go beyond simple bean-validation constraints.
 * Mapped to HTTP 400 by the global exception handler.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
