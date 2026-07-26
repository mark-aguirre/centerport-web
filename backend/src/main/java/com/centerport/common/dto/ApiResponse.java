package com.centerport.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import org.slf4j.MDC;

import java.time.LocalDateTime;

/**
 * Standard API response wrapper providing a consistent JSON structure
 * for all successful endpoint responses.
 *
 * Response format:
 * <pre>
 * {
 *   "success": true,
 *   "message": "optional message",
 *   "data": { ... },
 *   "timestamp": "2024-01-15T10:30:00",
 *   "request_id": "uuid"
 * }
 * </pre>
 *
 * @param <T> the type of the response payload
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean success;
    private final String message;
    private final T data;
    private final LocalDateTime timestamp;
    private final String requestId;

    private ApiResponse(boolean success, String message, T data, LocalDateTime timestamp, String requestId) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
        this.requestId = requestId != null ? requestId : MDC.get("requestId");
    }

    /**
     * Creates a successful response wrapping the given data.
     *
     * @param data the response payload
     * @param <T>  the payload type
     * @return a success response
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .build();
    }

    /**
     * Creates a successful response wrapping the given data with a message.
     *
     * @param data    the response payload
     * @param message a human-readable message
     * @param <T>     the payload type
     * @return a success response with message
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .build();
    }

    /**
     * Creates an error response with the given message and no data payload.
     *
     * @param message the error description
     * @param <T>     the (absent) payload type
     * @return an error response
     */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}
