package com.centerport;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot entry point for the CenterPort maritime seafarer medical
 * examination system.
 *
 * Bootstraps all autoconfiguration, component scanning, and embedded Tomcat.
 * Domain modules (landbase, medical, mlc, panama, profile) are auto-discovered
 * via package scanning from this root package.
 */
@SpringBootApplication
public class CenterportApplication {

    public static void main(String[] args) {
        SpringApplication.run(CenterportApplication.class, args);
    }
}
