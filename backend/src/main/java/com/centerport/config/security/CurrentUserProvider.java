package com.centerport.config.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;

/**
 * Resolves the username of the currently authenticated principal for audit
 * stamping (created_by / updated_by).
 *
 * <p>The application authenticates through Keycloak OIDC, so the principal is
 * normally an {@link OidcUser} whose {@code preferred_username} is the natural
 * identity to record. This provider reads the value straight from the active
 * {@link SecurityContextHolder} so services do not need to thread an
 * {@code @AuthenticationPrincipal} parameter through every call.
 *
 * <p>When no authenticated user is present (e.g. a background job or an
 * unauthenticated context), it falls back to {@code "system"} so audit columns
 * are never null.
 */
@Component
public class CurrentUserProvider {

    /** Fallback identity recorded when no authenticated principal is available. */
    public static final String SYSTEM = "system";

    /**
     * Returns the {@code preferred_username} of the current OIDC principal, the
     * authentication name when the principal is not an {@link OidcUser}, or
     * {@link #SYSTEM} when there is no authenticated user.
     *
     * @return the current username for audit stamping (never null/blank)
     */
    public String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return SYSTEM;
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof OidcUser oidcUser) {
            String username = oidcUser.getPreferredUsername();
            if (username != null && !username.isBlank()) {
                return username;
            }
        }
        String name = auth.getName();
        return (name != null && !name.isBlank()) ? name : SYSTEM;
    }
}
