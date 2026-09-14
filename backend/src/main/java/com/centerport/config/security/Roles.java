package com.centerport.config.security;

/**
 * Central definition of the Keycloak realm role names used for authorization.
 *
 * <p>These constants hold the <b>bare</b> role name (no {@code ROLE_} prefix),
 * matching the value that appears in the Keycloak token's
 * {@code realm_access.roles} array. They are intended for use with Spring
 * Security's {@code hasRole(..)} / {@code hasAnyRole(..)} expressions and the
 * URL rules in {@code SecurityConfig}, both of which add the {@code ROLE_}
 * prefix themselves.
 *
 * <p>In {@code @PreAuthorize} annotations use them as, e.g.:
 * <pre>{@code @PreAuthorize("hasAnyRole('" + Roles.ADMIN + "','" + Roles.LABORATORY + "')")}</pre>
 * or simply the literal string {@code @PreAuthorize("hasAnyRole('ADMIN','LABORATORY')")}.
 */
public final class Roles {

    private Roles() {
    }

    public static final String ADMIN = "ADMIN";
    public static final String INFORMATION = "INFORMATION";
    public static final String PSYCHOLOGY = "PSYCHOLOGY";
    public static final String LABORATORY = "LABORATORY";
    public static final String RELEASING = "RELEASING";
    public static final String ACCOUNTING = "ACCOUNTING";
}
