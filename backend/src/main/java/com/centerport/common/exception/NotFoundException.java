package com.centerport.common.exception;

/**
 * Thrown when a requested resource cannot be found. Mapped to HTTP 404 by the
 * global exception handler.
 */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException(String resourceName, Object id) {
        super(resourceName + " not found with id: " + id);
    }
}
