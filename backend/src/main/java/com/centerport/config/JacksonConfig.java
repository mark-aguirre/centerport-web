package com.centerport.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configures the global Jackson {@link ObjectMapper} for consistent JSON
 * serialization/deserialization across all REST endpoints.
 *
 * Conventions Applied:
 * - Property naming: snake_case (matches frontend TypeScript interfaces)
 * - Date/time: ISO-8601 strings via JavaTimeModule (not timestamps)
 * - Unknown properties: silently ignored to support forward-compatible clients
 *
 * @see com.centerport.config.OpenApiConfig
 */
@Configuration
public class JacksonConfig {

    /**
     * Creates the application-wide {@link ObjectMapper} bean with project conventions.
     *
     * @return configured {@code ObjectMapper} instance
     */
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        return mapper;
    }
}
