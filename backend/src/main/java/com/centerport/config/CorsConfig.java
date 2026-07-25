package com.centerport.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

/**
 * Global CORS configuration for all API endpoints.
 *
 * Allowed Origins:
 * Configurable via {@code app.cors.allowed-origins} property (comma-separated list).
 * Defaults to {@code http://localhost:3000} for local frontend development.
 *
 * Permitted Methods:
 * GET, POST, PUT, DELETE, OPTIONS — covering full CRUD plus preflight requests.
 *
 * Credentials:
 * Enabled to support cookie-based sessions or Authorization headers from the
 * frontend SPA.
 *
 * @see com.centerport.config.JacksonConfig
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private List<String> allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.toArray(String[]::new))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
