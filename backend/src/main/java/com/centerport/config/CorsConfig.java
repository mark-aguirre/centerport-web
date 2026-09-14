package com.centerport.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Global CORS configuration exposed as a {@link CorsConfigurationSource} bean.
 *
 * <p>The bean is consumed by Spring Security's filter chain
 * (see {@code SecurityConfig}) via {@code http.cors(...)}, so CORS is enforced
 * as part of the security chain rather than only by Spring MVC. This guarantees
 * that CORS pre-flight ({@code OPTIONS}) requests are handled correctly even
 * though every non-public endpoint requires a bearer token.
 *
 * <h2>Allowed origins</h2>
 * Configurable via {@code app.cors.allowed-origins} (comma-separated). Defaults
 * to {@code http://localhost:3000} for the local Next.js dev server. When the
 * frontend runs on a different machine, set this to that machine's exact origin
 * (scheme + host + port), e.g. {@code http://192.168.0.20:3000}. Wildcard
 * origins ({@code *}) are intentionally NOT used because credentials are
 * enabled, and the two are incompatible per the CORS spec.
 *
 * <h2>Credentials</h2>
 * {@code allowCredentials(true)} is kept so the browser may send cookies /
 * the Authorization header. Because credentials are allowed, origins must be
 * listed explicitly.
 */
@Configuration
public class CorsConfig {

    private static final List<String> ALLOWED_METHODS =
            List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");

    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private List<String> allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(ALLOWED_METHODS);
        config.setAllowedHeaders(List.of("*"));
        // Expose headers the frontend may need to read from responses.
        config.setExposedHeaders(List.of("Location", "Content-Disposition"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
