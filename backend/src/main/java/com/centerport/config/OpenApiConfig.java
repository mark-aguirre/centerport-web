package com.centerport.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configures the OpenAPI/Swagger specification metadata exposed at
 * {@code /swagger-ui.html} and {@code /v3/api-docs}.
 *
 * Provides title, version, and description for the generated API documentation
 * consumed by frontend developers and external integrators.
 *
 * @see com.centerport.config.JacksonConfig
 */
@Configuration
public class OpenApiConfig {

    /**
     * Builds the root {@link OpenAPI} descriptor for the CenterPort API.
     *
     * @return configured OpenAPI metadata bean
     */
    @Bean
    public OpenAPI centerportOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("CenterPort API")
                        .version("1.0")
                        .description("Maritime seafarer medical examination API"));
    }
}
