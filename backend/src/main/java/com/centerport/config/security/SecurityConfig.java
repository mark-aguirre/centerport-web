package com.centerport.config.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestCustomizers;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.MediaTypeRequestMatcher;
import org.springframework.http.MediaType;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Spring Security configuration — backend-driven Keycloak login (OAuth2 Client).
 *
 * <p>The backend runs the OpenID Connect Authorization Code flow itself:
 * <ol>
 *   <li>The browser is sent to {@code /oauth2/authorization/keycloak}, which
 *       redirects to Keycloak's login page.</li>
 *   <li>Keycloak redirects back to {@code /login/oauth2/code/keycloak}; Spring
 *       performs the server-side code&rarr;token exchange using the confidential
 *       client secret.</li>
 *   <li>The user is then authenticated via a normal {@code JSESSIONID} session
 *       cookie. Access/refresh tokens stay on the server and never reach the
 *       browser.</li>
 * </ol>
 *
 * <h2>Authorization</h2>
 * {@link KeycloakOidcUserService} maps Keycloak realm roles
 * ({@code realm_access.roles}) to {@code ROLE_*} authorities. URL rules below
 * (matched to the real controller paths) enforce the module access map, and
 * {@link EnableMethodSecurity} enables {@code @PreAuthorize} for finer checks.
 *
 * <h2>SPA-friendly behaviour</h2>
 * The frontend is a Next.js SPA that talks to the API through a same-origin
 * proxy using {@code fetch}. A fetch cannot follow a 302 redirect to Keycloak's
 * HTML login page, so unauthenticated <b>API</b> requests return
 * {@code 401 Unauthorized} instead of redirecting. The SPA detects the 401 and
 * performs a full-page navigation to the login entry point. Browser
 * navigations to non-API paths still get the normal OAuth2 redirect.
 *
 * <h2>CSRF</h2>
 * CSRF protection is disabled and the session cookie is relied upon with
 * {@code SameSite=Lax} (set in {@code application} / servlet config) plus the
 * same-origin Next.js proxy. State-changing requests therefore cannot be forged
 * cross-site. If the topology changes (e.g. the browser calls the backend
 * directly cross-site), re-enable CSRF with a cookie token repository.
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    /** Public paths that do not require authentication. */
    private static final String[] PUBLIC_PATHS = {
            "/actuator/health",
            "/actuator/health/**",
            "/actuator/info",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**"
    };

    private final CorsConfigurationSource corsConfigurationSource;
    private final KeycloakOidcUserService oidcUserService;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public SecurityConfig(CorsConfigurationSource corsConfigurationSource,
                          KeycloakOidcUserService oidcUserService) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.oidcUserService = oidcUserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            ClientRegistrationRepository clientRegistrationRepository) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                // Session-cookie auth behind a same-origin proxy with SameSite=Lax.
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(PUBLIC_PATHS).permitAll()

                        // --- Module access rules (matched to real endpoints) ---
                        .requestMatchers("/api/dashboard/**").hasAnyRole(
                                Roles.ADMIN, Roles.INFORMATION, Roles.PSYCHOLOGY,
                                Roles.LABORATORY, Roles.RELEASING)
                        .requestMatchers("/api/visits/**").hasAnyRole(
                                Roles.ADMIN, Roles.INFORMATION)
                        .requestMatchers("/api/profiles/**").hasAnyRole(
                                Roles.ADMIN, Roles.INFORMATION, Roles.RELEASING)
                        .requestMatchers("/api/psychology-evaluations/**").hasAnyRole(
                                Roles.ADMIN, Roles.PSYCHOLOGY)
                        .requestMatchers("/api/laboratory-reports/**").hasAnyRole(
                                Roles.ADMIN, Roles.LABORATORY)
                        .requestMatchers("/api/medical-exams/**").hasAnyRole(
                                Roles.ADMIN, Roles.RELEASING)
                        .requestMatchers("/api/mlc-records/**").hasAnyRole(
                                Roles.ADMIN, Roles.RELEASING)
                        .requestMatchers("/api/landbase-pemes/**").hasAnyRole(
                                Roles.ADMIN, Roles.RELEASING)
                        .requestMatchers("/api/panama-certificates/**").hasAnyRole(
                                Roles.ADMIN, Roles.RELEASING)
                        .requestMatchers("/api/accounting/**").hasAnyRole(
                                Roles.ADMIN, Roles.ACCOUNTING)
                        .requestMatchers("/api/employers/**").hasAnyRole(
                                Roles.ADMIN, Roles.INFORMATION, Roles.RELEASING)
                        .requestMatchers("/api/medical-personnel/**").authenticated()
                        .requestMatchers("/api/files/**").authenticated()

                        .anyRequest().authenticated())

                // Backend runs the Keycloak login; map realm roles to authorities.
                .oauth2Login(oauth2 -> oauth2
                        // Send PKCE (code_challenge/S256) on the authorization
                        // request. The Keycloak client requires PKCE, and Spring
                        // does not enable it for confidential clients by default,
                        // so without this Keycloak rejects the login with
                        // "Missing parameter: code_challenge_method".
                        .authorizationEndpoint(authorization -> authorization
                                .authorizationRequestResolver(
                                        pkceAuthorizationRequestResolver(clientRegistrationRepository)))
                        .userInfoEndpoint(userInfo -> userInfo.oidcUserService(oidcUserService))
                        // After successful login, return the browser to the SPA.
                        .defaultSuccessUrl(frontendUrl, true))

                // RP-initiated logout: clear the local session AND end the
                // Keycloak SSO session, then return to the SPA.
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler(oidcLogoutSuccessHandler(clientRegistrationRepository)))

                // For unauthenticated API (fetch) requests return 401 instead of
                // a 302 to Keycloak; browser navigations still redirect to login.
                .exceptionHandling(ex -> ex
                        .defaultAuthenticationEntryPointFor(
                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                                new AntPathRequestMatcher("/api/**"))
                        .defaultAuthenticationEntryPointFor(
                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                                acceptsJson()));

        return http.build();
    }

    /**
     * Builds an authorization request resolver that adds PKCE parameters
     * ({@code code_challenge} + {@code code_challenge_method=S256}) to the
     * Authorization Code request.
     *
     * <p>Spring Security only enables PKCE automatically for public clients.
     * This client is confidential (it has a secret), so PKCE must be turned on
     * explicitly. The Keycloak client is configured to require PKCE, so without
     * this the authorization request is rejected with
     * {@code error=invalid_request, "Missing parameter: code_challenge_method"}
     * and login can never complete. PKCE is layered on top of the confidential
     * client secret, which Keycloak fully supports.
     */
    private OAuth2AuthorizationRequestResolver pkceAuthorizationRequestResolver(
            ClientRegistrationRepository clientRegistrationRepository) {
        DefaultOAuth2AuthorizationRequestResolver resolver =
                new DefaultOAuth2AuthorizationRequestResolver(
                        clientRegistrationRepository, "/oauth2/authorization");
        resolver.setAuthorizationRequestCustomizer(
                OAuth2AuthorizationRequestCustomizers.withPkce());
        return resolver;
    }

    /**
     * Matches requests whose {@code Accept} header prefers JSON — i.e. SPA
     * {@code fetch} calls. These get a 401 rather than an OAuth2 redirect.
     */
    private MediaTypeRequestMatcher acceptsJson() {
        MediaTypeRequestMatcher matcher =
                new MediaTypeRequestMatcher(MediaType.APPLICATION_JSON);
        matcher.setUseEquals(false);
        return matcher;
    }

    /**
     * Builds the handler that logs the user out of Keycloak (RP-initiated
     * logout) and returns the browser to the frontend afterwards.
     */
    private LogoutSuccessHandler oidcLogoutSuccessHandler(
            ClientRegistrationRepository clientRegistrationRepository) {
        OidcClientInitiatedLogoutSuccessHandler handler =
                new OidcClientInitiatedLogoutSuccessHandler(clientRegistrationRepository);
        handler.setPostLogoutRedirectUri(frontendUrl);
        return handler;
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }
}
