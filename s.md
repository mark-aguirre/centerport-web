---
name: springboot-enterprise-ai-skill
description: >
  Comprehensive enterprise Spring Boot development skill for generating production-ready
  REST APIs. Covers layered architecture, CRUD generation, JWT authentication, Spring Security 6,
  OpenAPI documentation, MapStruct mappings, JPA relationships, auditing, soft deletes,
  Specification-based search, global API response wrappers, RFC 9457 ProblemDetail errors,
  Flyway/Liquibase migrations, unit/integration testing, caching, and observability.
version: 2.0
author: Custom AI Skill
tags:
  - springboot
  - java
  - rest
  - backend
  - jpa
  - dto
  - validation
  - exception
  - clean-code
  - architecture
  - security
  - jwt
  - openapi
  - mapstruct
  - auditing
  - soft-delete
  - specifications
  - flyway
  - liquibase
  - testing
  - caching
  - observability
---

# Spring Boot Enterprise AI Skill v2

## Purpose

This skill defines the comprehensive standards that every generated Spring Boot project must follow.
It serves as an enterprise-grade knowledge base for consistently generating high-quality,
production-ready Spring Boot applications.

Whenever generating code, always follow these guidelines unless explicitly instructed otherwise.

---

# 1. Technology Stack

| Category | Technology |
|----------|-----------|
| Language | Java 21+ |
| Framework | Spring Boot 3.2+ |
| Web | Spring Web (MVC) |
| Persistence | Spring Data JPA / Hibernate 6 |
| Validation | Spring Validation (Jakarta Bean Validation 3.0) |
| Security | Spring Security 6 + JWT |
| Mapping | MapStruct 1.5+ |
| Database | PostgreSQL (default) |
| Migrations | Flyway (primary) or Liquibase |
| Build | Maven (Gradle acceptable if requested) |
| Docs | SpringDoc OpenAPI 2.x |
| Caching | Spring Cache + Caffeine (or Redis) |
| Logging | SLF4J + Logback (structured JSON in production) |
| Testing | JUnit 5, Mockito, Testcontainers |
| Utilities | Lombok |
| Observability | Micrometer + Spring Boot Actuator |

---

# 2. Project Structure

```
src/main/java/com/{company}/{project}
│
├── Application.java
├── config/
│     ├── SecurityConfig.java
│     ├── JwtConfig.java
│     ├── OpenApiConfig.java
│     ├── CacheConfig.java
│     ├── JacksonConfig.java
│     ├── AuditConfig.java
│     └── CorsConfig.java
├── common/
│     ├── BaseEntity.java
│     ├── AuditableEntity.java
│     ├── ApiResponse.java
│     ├── PagedResponse.java
│     └── Constants.java
├── controller/
├── dto/
│     ├── request/
│     └── response/
├── entity/
├── enums/
├── exception/
│     ├── GlobalExceptionHandler.java
│     ├── ResourceNotFoundException.java
│     ├── BadRequestException.java
│     ├── ConflictException.java
│     ├── UnauthorizedException.java
│     └── ForbiddenException.java
├── mapper/
├── repository/
│     └── specification/
├── security/
│     ├── JwtTokenProvider.java
│     ├── JwtAuthenticationFilter.java
│     ├── UserDetailsServiceImpl.java
│     └── SecurityUtils.java
├── service/
│     └── impl/
└── util/

src/main/resources/
├── application.yml
├── application-dev.yml
├── application-prod.yml
├── db/
│     └── migration/
│           ├── V1__create_users_table.sql
│           └── V2__create_roles_table.sql
└── logback-spring.xml

src/test/java/com/{company}/{project}
├── controller/
├── service/
├── repository/
└── integration/
```

---

# 3. Layer Responsibilities

## 3.1 Controller Layer

Responsible only for:

- Defining HTTP endpoints with proper annotations
- Request validation (via `@Valid`)
- Delegating to services
- Returning `ResponseEntity` with appropriate status codes
- OpenAPI annotations for documentation

Never:

- Access repositories directly
- Write business logic
- Perform database operations
- Catch generic exceptions
- Transform entities to DTOs (delegate to service or mapper)

Template:

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management endpoints")
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    @ApiResponse(responseCode = "200", description = "User found")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(
            @PathVariable Long id) {

        UserResponse user = userService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping
    @Operation(summary = "Get all users with pagination and filtering")
    public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getUsers(
            @ParameterObject Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UserStatus status) {

        PagedResponse<UserResponse> users = userService.findAll(pageable, search, status);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PostMapping
    @Operation(summary = "Create a new user")
    @ApiResponse(responseCode = "201", description = "User created")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody CreateUserRequest request) {

        UserResponse created = userService.create(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "User created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing user")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {

        UserResponse updated = userService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "User updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user")
    @ApiResponse(responseCode = "204", description = "User deleted")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 3.2 Service Layer

Responsible for:

- All business logic and rules
- Transaction management
- Validation beyond DTO constraints
- Calling repositories
- Entity-to-DTO transformation (via mapper)
- Throwing typed business exceptions
- Logging business events

Services must never return JPA entities to callers outside the service layer.

Template:

```java
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getById(Long id) {
        User user = findUserOrThrow(id);
        return userMapper.toResponse(user);
    }

    @Override
    public PagedResponse<UserResponse> findAll(Pageable pageable, String search, UserStatus status) {
        Specification<User> spec = UserSpecification.builder()
                .search(search)
                .status(status)
                .notDeleted()
                .build();

        Page<User> page = userRepository.findAll(spec, pageable);
        List<UserResponse> content = page.getContent().stream()
                .map(userMapper::toResponse)
                .toList();

        return PagedResponse.of(content, page);
    }

    @Override
    @Transactional
    public UserResponse create(CreateUserRequest request) {
        validateEmailUniqueness(request.getEmail());

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        log.info("User created: id={}, email={}", saved.getId(), saved.getEmail());

        return userMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = findUserOrThrow(id);
        userMapper.updateEntity(request, user);

        User saved = userRepository.save(user);
        log.info("User updated: id={}", saved.getId());

        return userMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User user = findUserOrThrow(id);
        user.setDeleted(true);
        userRepository.save(user);
        log.info("User soft-deleted: id={}", id);
    }

    private User findUserOrThrow(Long id) {
        return userRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    private void validateEmailUniqueness(String email) {
        if (userRepository.existsByEmailAndDeletedFalse(email)) {
            throw new ConflictException("User with email " + email + " already exists");
        }
    }
}
```

---

## 3.3 Repository Layer

Repositories perform data access only. They must not contain business logic.

Template:

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long>,
        JpaSpecificationExecutor<User> {

    Optional<User> findByIdAndDeletedFalse(Long id);

    Optional<User> findByEmailAndDeletedFalse(String email);

    boolean existsByEmailAndDeletedFalse(String email);

    @Query("SELECT u FROM User u WHERE u.deleted = false AND u.status = :status")
    Page<User> findAllByStatus(@Param("status") UserStatus status, Pageable pageable);
}
```

---

# 4. CRUD Generation Patterns

## 4.1 Standard CRUD Template

Every resource should follow this generation pattern:

1. **Entity** — JPA entity with auditing and soft delete
2. **Repository** — `JpaRepository` + `JpaSpecificationExecutor`
3. **Service Interface** — contract definition
4. **Service Implementation** — business logic
5. **Controller** — REST endpoints
6. **DTOs** — Request and Response objects
7. **Mapper** — MapStruct interface
8. **Specification** — search/filter support
9. **Migration** — Flyway SQL script

## 4.2 Entity Template

```java
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLRestriction("deleted = false")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status;

    // -- Auditing fields --
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(updatable = false, length = 100)
    private String createdBy;

    @LastModifiedBy
    @Column(length = 100)
    private String updatedBy;

    // -- Soft delete --
    @Column(nullable = false)
    @Builder.Default
    private boolean deleted = false;

    private LocalDateTime deletedAt;

    private String deletedBy;
}
```

## 4.3 Request DTO Templates

```java
// Create request
public record CreateUserRequest(
        @NotBlank(message = "First name is required")
        @Size(max = 100, message = "First name must not exceed 100 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 100, message = "Last name must not exceed 100 characters")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
                message = "Password must contain at least one uppercase, one lowercase, and one digit")
        String password,

        @NotNull(message = "Status is required")
        UserStatus status
) {}

// Update request (partial updates)
public record UpdateUserRequest(
        @Size(max = 100, message = "First name must not exceed 100 characters")
        String firstName,

        @Size(max = 100, message = "Last name must not exceed 100 characters")
        String lastName,

        @Email(message = "Email must be valid")
        String email,

        UserStatus status
) {}
```

## 4.4 Response DTO Template

```java
public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        UserStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String createdBy
) {}

// Summary DTO for lists or embedded references
public record UserSummaryResponse(
        Long id,
        String firstName,
        String lastName,
        String email
) {}
```

## 4.5 Service Interface Template

```java
public interface UserService {

    UserResponse getById(Long id);

    PagedResponse<UserResponse> findAll(Pageable pageable, String search, UserStatus status);

    UserResponse create(CreateUserRequest request);

    UserResponse update(Long id, UpdateUserRequest request);

    void delete(Long id);
}
```

---

# 5. JWT Authentication and Authorization

## 5.1 JWT Token Provider

```java
@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    private SecretKey key;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(userDetails, jwtExpirationMs);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails, refreshExpirationMs);
    }

    private String generateToken(UserDetails userDetails, long expirationMs) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(expirationMs);

        Collection<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("roles", roles)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
```

## 5.2 JWT Authentication Filter

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        try {
            String jwt = extractTokenFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromToken(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        return null;
    }
}
```

## 5.3 Authentication Controller

```java
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and get JWT tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse authResponse = authService.authenticate(request);
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(authResponse, "Registration successful"));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {

        AuthResponse authResponse = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout and invalidate token")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }
}
```

## 5.4 Auth DTOs

```java
public record LoginRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {}

public record RegisterRequest(
        @NotBlank(message = "First name is required")
        String firstName,

        @NotBlank(message = "Last name is required")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 128)
        String password
) {}

public record RefreshTokenRequest(
        @NotBlank(message = "Refresh token is required")
        String refreshToken
) {}

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        UserResponse user
) {
    public AuthResponse {
        tokenType = "Bearer";
    }
}
```

---

# 6. Spring Security 6 Configuration

## 6.1 Security Configuration

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(jwtAuthenticationEntryPoint())
                .accessDeniedHandler(jwtAccessDeniedHandler()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/**").hasAnyRole("ADMIN", "MANAGER")
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

            ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                    HttpStatus.UNAUTHORIZED, "Authentication required");
            problem.setTitle("Unauthorized");
            problem.setInstance(URI.create(request.getRequestURI()));

            new ObjectMapper().writeValue(response.getOutputStream(), problem);
        };
    }

    @Bean
    public AccessDeniedHandler jwtAccessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);

            ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                    HttpStatus.FORBIDDEN, "Access denied");
            problem.setTitle("Forbidden");
            problem.setInstance(URI.create(request.getRequestURI()));

            new ObjectMapper().writeValue(response.getOutputStream(), problem);
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization", "X-Request-Id"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
```

## 6.2 UserDetailsService Implementation

```java
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with email: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                        .toList())
                .accountLocked(user.getStatus() == UserStatus.LOCKED)
                .disabled(user.getStatus() == UserStatus.INACTIVE)
                .build();
    }
}
```

## 6.3 Security Utilities

```java
@UtilityClass
public class SecurityUtils {

    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "system";
        }
        return authentication.getName();
    }

    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) return false;
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    public static boolean isCurrentUser(String username) {
        return getCurrentUsername().equals(username);
    }
}
```

## 6.4 Method-Level Security

```java
// In service layer - use @PreAuthorize for role-based access
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(Long id) { ... }

// Owner-or-admin pattern
@PreAuthorize("hasRole('ADMIN') or @securityUtils.isOwner(#id)")
public UserResponse getUser(Long id) { ... }

// Custom security expressions
@Component("securityUtils")
@RequiredArgsConstructor
public class SecurityExpressionUtils {

    private final UserRepository userRepository;

    public boolean isOwner(Long resourceId) {
        String currentUser = SecurityUtils.getCurrentUsername();
        return userRepository.findById(resourceId)
                .map(user -> user.getEmail().equals(currentUser))
                .orElse(false);
    }
}
```

---

# 7. OpenAPI / Swagger Documentation

## 7.1 OpenAPI Configuration

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Enterprise API")
                        .version("1.0.0")
                        .description("Enterprise REST API Documentation")
                        .contact(new Contact()
                                .name("API Team")
                                .email("api@company.com"))
                        .license(new License()
                                .name("Proprietary")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token")));
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .pathsToMatch("/api/v1/**")
                .build();
    }

    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
                .group("admin")
                .pathsToMatch("/api/v1/admin/**")
                .build();
    }
}
```

## 7.2 Documentation Annotations Best Practices

```java
// On controller class
@Tag(name = "Users", description = "User management endpoints")

// On endpoint method
@Operation(
        summary = "Create a new user",
        description = "Creates a new user account. Requires ADMIN role.")
@ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User created successfully",
                content = @Content(schema = @Schema(implementation = UserResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid request body",
                content = @Content(schema = @Schema(implementation = ProblemDetail.class))),
        @ApiResponse(responseCode = "409", description = "Email already exists",
                content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
})

// On DTO fields (for schema generation)
public record CreateUserRequest(
        @Schema(description = "User's first name", example = "John", maxLength = 100)
        @NotBlank
        String firstName,

        @Schema(description = "User's email address", example = "john@example.com")
        @Email
        String email
) {}
```

## 7.3 SpringDoc Properties

```yaml
# application.yml
springdoc:
  api-docs:
    path: /v3/api-docs
    enabled: true
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
    operations-sorter: method
    tags-sorter: alpha
    display-request-duration: true
  show-actuator: false
  default-produces-media-type: application/json
  default-consumes-media-type: application/json
```

---

# 8. MapStruct Mappings

## 8.1 Basic Mapper

```java
@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    UserResponse toResponse(User entity);

    UserSummaryResponse toSummaryResponse(User entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "password", ignore = true)
    User toEntity(CreateUserRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "password", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(UpdateUserRequest request, @MappingTarget User entity);

    List<UserResponse> toResponseList(List<User> entities);
}
```

## 8.2 Mapper with Nested Objects and Custom Mappings

```java
@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {AddressMapper.class, RoleMapper.class})
public interface UserMapper {

    @Mapping(source = "department.name", target = "departmentName")
    @Mapping(source = "roles", target = "roleNames", qualifiedByName = "rolesToNames")
    @Mapping(target = "fullName", expression = "java(entity.getFirstName() + \" \" + entity.getLastName())")
    UserResponse toResponse(User entity);

    @Named("rolesToNames")
    default List<String> rolesToNames(Set<Role> roles) {
        if (roles == null) return List.of();
        return roles.stream()
                .map(Role::getName)
                .toList();
    }

    @AfterMapping
    default void setComputedFields(@MappingTarget UserResponse.UserResponseBuilder builder, User entity) {
        builder.isActive(entity.getStatus() == UserStatus.ACTIVE);
    }
}
```

## 8.3 Mapper with Enum Conversion

```java
@Mapper(componentModel = "spring")
public interface StatusMapper {

    default UserStatus toUserStatus(String status) {
        if (status == null) return null;
        return UserStatus.valueOf(status.toUpperCase());
    }

    default String fromUserStatus(UserStatus status) {
        if (status == null) return null;
        return status.name().toLowerCase();
    }
}
```

## 8.4 MapStruct Configuration

```xml
<!-- pom.xml dependency and annotation processor -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>${mapstruct.version}</version>
</dependency>

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <annotationProcessorPaths>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>${mapstruct.version}</version>
            </path>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </path>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok-mapstruct-binding</artifactId>
                <version>0.2.0</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

---

# 9. JPA Relationships

## 9.1 One-to-Many / Many-to-One

```java
// Parent entity (One side)
@Entity
@Table(name = "departments")
@Getter @Setter @NoArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<User> users = new ArrayList<>();

    // Helper methods for bidirectional consistency
    public void addUser(User user) {
        users.add(user);
        user.setDepartment(this);
    }

    public void removeUser(User user) {
        users.remove(user);
        user.setDepartment(null);
    }
}

// Child entity (Many side) — owns the relationship
@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;
}
```

## 9.2 Many-to-Many

```java
// User entity
@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    // Helper methods
    public void addRole(Role role) {
        roles.add(role);
        role.getUsers().add(this);
    }

    public void removeRole(Role role) {
        roles.remove(role);
        role.getUsers().remove(this);
    }
}

// Role entity
@Entity
@Table(name = "roles")
@Getter @Setter @NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @ManyToMany(mappedBy = "roles")
    @Builder.Default
    private Set<User> users = new HashSet<>();
}
```

## 9.3 One-to-One

```java
@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true,
              fetch = FetchType.LAZY)
    private UserProfile profile;

    public void setProfile(UserProfile profile) {
        this.profile = profile;
        if (profile != null) {
            profile.setUser(this);
        }
    }
}

@Entity
@Table(name = "user_profiles")
@Getter @Setter @NoArgsConstructor
public class UserProfile {

    @Id
    private Long id;  // Shares PK with User

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @Column(length = 500)
    private String bio;

    private String avatarUrl;
}
```

## 9.4 JPA Best Practices

| Practice | Guidance |
|----------|----------|
| Default fetch | Always use `FetchType.LAZY` for associations |
| N+1 queries | Use `@EntityGraph` or `JOIN FETCH` in JPQL |
| Bidirectional sync | Always maintain both sides of the relationship |
| Cascade | Use `CascadeType.ALL` only for parent-owned children |
| OrphanRemoval | Enable for truly dependent children only |
| equals/hashCode | Implement based on business key or `@NaturalId`, never on `@Id` |
| toString | Exclude lazy-loaded associations to prevent unexpected queries |

## 9.5 EntityGraph for Performance

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = {"roles", "department"})
    Optional<User> findWithRolesAndDepartmentById(Long id);

    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(@Param("email") String email);
}
```

---

# 10. Auditing

## 10.1 Auditing Configuration

```java
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()
                    || auth instanceof AnonymousAuthenticationToken) {
                return Optional.of("system");
            }
            return Optional.of(auth.getName());
        };
    }
}
```

## 10.2 Base Auditable Entity

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public abstract class AuditableEntity {

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(updatable = false, length = 100)
    private String createdBy;

    @LastModifiedBy
    @Column(length = 100)
    private String updatedBy;

    @Version
    private Long version;
}
```

## 10.3 Using Auditable Base

```java
@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor
public class Order extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalAmount;
}
```

## 10.4 Audit Trail Table (Event Sourcing Lite)

```java
@Entity
@Table(name = "audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String entityType;

    @Column(nullable = false)
    private Long entityId;

    @Column(nullable = false, length = 50)
    private String action; // CREATE, UPDATE, DELETE

    @Column(columnDefinition = "jsonb")
    private String previousState;

    @Column(columnDefinition = "jsonb")
    private String newState;

    @Column(nullable = false, length = 100)
    private String performedBy;

    @Column(nullable = false)
    private LocalDateTime performedAt;

    @Column(length = 50)
    private String ipAddress;
}
```

## 10.5 Audit Event Listener

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditEventListener {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onAuditEvent(AuditEvent event) {
        try {
            AuditLog log = AuditLog.builder()
                    .entityType(event.entityType())
                    .entityId(event.entityId())
                    .action(event.action())
                    .previousState(objectMapper.writeValueAsString(event.previousState()))
                    .newState(objectMapper.writeValueAsString(event.newState()))
                    .performedBy(SecurityUtils.getCurrentUsername())
                    .performedAt(LocalDateTime.now())
                    .build();

            auditLogRepository.save(log);
        } catch (Exception e) {
            log.error("Failed to save audit log for {} #{}", event.entityType(), event.entityId(), e);
        }
    }
}

public record AuditEvent(
        String entityType,
        Long entityId,
        String action,
        Object previousState,
        Object newState
) {}
```

---

# 11. Soft Deletes

## 11.1 Soft Delete Base Entity

```java
@MappedSuperclass
@Getter
@Setter
public abstract class SoftDeletableEntity extends AuditableEntity {

    @Column(nullable = false)
    @Builder.Default
    private boolean deleted = false;

    private LocalDateTime deletedAt;

    @Column(length = 100)
    private String deletedBy;

    public void softDelete(String deletedBy) {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
        this.deletedBy = deletedBy;
    }

    public void restore() {
        this.deleted = false;
        this.deletedAt = null;
        this.deletedBy = null;
    }
}
```

## 11.2 Hibernate @SQLRestriction (Hibernate 6.3+)

```java
@Entity
@Table(name = "users")
@SQLRestriction("deleted = false")  // Replaces deprecated @Where
@Getter @Setter @NoArgsConstructor
public class User extends SoftDeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
}
```

## 11.3 Repository Methods for Soft Delete

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long>,
        JpaSpecificationExecutor<User> {

    // With @SQLRestriction, standard queries automatically filter deleted records
    // These methods exist for explicit clarity or when you need to include deleted

    Optional<User> findByIdAndDeletedFalse(Long id);

    @Query("SELECT u FROM User u WHERE u.deleted = true")
    Page<User> findAllDeleted(Pageable pageable);

    @Modifying
    @Query("UPDATE User u SET u.deleted = true, u.deletedAt = :now, u.deletedBy = :by WHERE u.id = :id")
    void softDelete(@Param("id") Long id,
                    @Param("now") LocalDateTime now,
                    @Param("by") String deletedBy);

    @Modifying
    @Query("UPDATE User u SET u.deleted = false, u.deletedAt = null, u.deletedBy = null WHERE u.id = :id")
    void restore(@Param("id") Long id);
}
```

## 11.4 Soft Delete Service Pattern

```java
@Override
@Transactional
public void delete(Long id) {
    User user = findUserOrThrow(id);
    user.softDelete(SecurityUtils.getCurrentUsername());
    userRepository.save(user);
    log.info("User soft-deleted: id={}", id);
}

@Override
@Transactional
public void restore(Long id) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    if (!user.isDeleted()) {
        throw new BadRequestException("User is not deleted");
    }
    user.restore();
    userRepository.save(user);
    log.info("User restored: id={}", id);
}

@Override
@Transactional
public void hardDelete(Long id) {
    // Only for admin/cleanup operations
    User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    userRepository.delete(user);
    log.warn("User hard-deleted: id={}", id);
}
```

---

# 12. Search with JPA Specifications

## 12.1 Specification Builder Pattern

```java
public class UserSpecification {

    private UserSpecification() {}

    public static Specification<User> hasSearch(String search) {
        if (!StringUtils.hasText(search)) return null;
        String pattern = "%" + search.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("firstName")), pattern),
                cb.like(cb.lower(root.get("lastName")), pattern),
                cb.like(cb.lower(root.get("email")), pattern)
        );
    }

    public static Specification<User> hasStatus(UserStatus status) {
        if (status == null) return null;
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<User> hasDepartment(Long departmentId) {
        if (departmentId == null) return null;
        return (root, query, cb) -> cb.equal(root.get("department").get("id"), departmentId);
    }

    public static Specification<User> isNotDeleted() {
        return (root, query, cb) -> cb.isFalse(root.get("deleted"));
    }

    public static Specification<User> createdBetween(LocalDateTime from, LocalDateTime to) {
        if (from == null && to == null) return null;
        return (root, query, cb) -> {
            if (from != null && to != null) {
                return cb.between(root.get("createdAt"), from, to);
            } else if (from != null) {
                return cb.greaterThanOrEqualTo(root.get("createdAt"), from);
            } else {
                return cb.lessThanOrEqualTo(root.get("createdAt"), to);
            }
        };
    }

    // Combines all specifications using fluent API
    public static Specification<User> buildSpec(String search, UserStatus status,
                                                  Long departmentId,
                                                  LocalDateTime from, LocalDateTime to) {
        return Specification.where(isNotDeleted())
                .and(hasSearch(search))
                .and(hasStatus(status))
                .and(hasDepartment(departmentId))
                .and(createdBetween(from, to));
    }
}
```

## 12.2 Generic Specification Builder

```java
/**
 * Reusable specification builder for any entity with common search patterns.
 */
public class GenericSpecificationBuilder<T> {

    private Specification<T> spec;

    public GenericSpecificationBuilder() {
        this.spec = Specification.where(null);
    }

    public GenericSpecificationBuilder<T> and(Specification<T> other) {
        if (other != null) {
            this.spec = this.spec.and(other);
        }
        return this;
    }

    public GenericSpecificationBuilder<T> or(Specification<T> other) {
        if (other != null) {
            this.spec = this.spec.or(other);
        }
        return this;
    }

    public GenericSpecificationBuilder<T> equals(String field, Object value) {
        if (value != null) {
            this.spec = this.spec.and(
                    (root, query, cb) -> cb.equal(root.get(field), value));
        }
        return this;
    }

    public GenericSpecificationBuilder<T> like(String field, String value) {
        if (StringUtils.hasText(value)) {
            this.spec = this.spec.and(
                    (root, query, cb) -> cb.like(
                            cb.lower(root.get(field)), "%" + value.toLowerCase() + "%"));
        }
        return this;
    }

    public GenericSpecificationBuilder<T> between(String field, Comparable<?> from, Comparable<?> to) {
        if (from != null && to != null) {
            this.spec = this.spec.and(
                    (root, query, cb) -> cb.between(root.get(field), (Comparable) from, (Comparable) to));
        }
        return this;
    }

    public GenericSpecificationBuilder<T> in(String field, Collection<?> values) {
        if (values != null && !values.isEmpty()) {
            this.spec = this.spec.and(
                    (root, query, cb) -> root.get(field).in(values));
        }
        return this;
    }

    public Specification<T> build() {
        return this.spec;
    }
}
```

## 12.3 Search Filter DTO

```java
public record UserSearchFilter(
        @Schema(description = "Search text (name, email)")
        String search,

        @Schema(description = "Filter by status")
        UserStatus status,

        @Schema(description = "Filter by department ID")
        Long departmentId,

        @Schema(description = "Created from date")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        LocalDateTime createdFrom,

        @Schema(description = "Created to date")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        LocalDateTime createdTo
) {}
```

## 12.4 Service Usage

```java
@Override
@Transactional(readOnly = true)
public PagedResponse<UserResponse> search(UserSearchFilter filter, Pageable pageable) {
    Specification<User> spec = UserSpecification.buildSpec(
            filter.search(),
            filter.status(),
            filter.departmentId(),
            filter.createdFrom(),
            filter.createdTo());

    Page<User> page = userRepository.findAll(spec, pageable);
    List<UserResponse> content = page.getContent().stream()
            .map(userMapper::toResponse)
            .toList();

    return PagedResponse.of(content, page);
}
```

## 12.5 Controller Usage

```java
@GetMapping("/search")
@Operation(summary = "Search users with advanced filters")
public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> searchUsers(
        @ParameterObject UserSearchFilter filter,
        @ParameterObject Pageable pageable) {

    PagedResponse<UserResponse> results = userService.search(filter, pageable);
    return ResponseEntity.ok(ApiResponse.success(results));
}
```

---

# 13. Global API Response Wrapper

## 13.1 Standard API Response

```java
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean success;
    private final String message;
    private final T data;
    private final LocalDateTime timestamp;
    private final String requestId;

    private ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
        this.requestId = MDC.get("requestId");
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, null, data);
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
```

## 13.2 Paged Response

```java
@Getter
@Builder
public class PagedResponse<T> {

    private final List<T> content;
    private final int page;
    private final int size;
    private final long totalElements;
    private final int totalPages;
    private final boolean first;
    private final boolean last;
    private final boolean hasNext;
    private final boolean hasPrevious;

    public static <T> PagedResponse<T> of(List<T> content, Page<?> page) {
        return PagedResponse.<T>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
}
```

## 13.3 Request ID Filter

```java
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestIdFilter extends OncePerRequestFilter {

    private static final String REQUEST_ID_HEADER = "X-Request-Id";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestId = request.getHeader(REQUEST_ID_HEADER);
        if (!StringUtils.hasText(requestId)) {
            requestId = UUID.randomUUID().toString();
        }

        MDC.put("requestId", requestId);
        response.setHeader(REQUEST_ID_HEADER, requestId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove("requestId");
        }
    }
}
```

---

# 14. RFC 9457 ProblemDetail Error Responses

## 14.1 Global Exception Handler

```java
@RestControllerAdvice
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final String VIOLATIONS_PROPERTY = "violations";
    private static final URI VALIDATION_TYPE = URI.create("https://api.company.com/errors/validation");
    private static final URI NOT_FOUND_TYPE = URI.create("https://api.company.com/errors/not-found");
    private static final URI CONFLICT_TYPE = URI.create("https://api.company.com/errors/conflict");
    private static final URI UNAUTHORIZED_TYPE = URI.create("https://api.company.com/errors/unauthorized");
    private static final URI FORBIDDEN_TYPE = URI.create("https://api.company.com/errors/forbidden");
    private static final URI INTERNAL_TYPE = URI.create("https://api.company.com/errors/internal");

    // --- Custom Business Exceptions ---

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFound(ResourceNotFoundException ex,
                                                 HttpServletRequest request) {
        log.warn("Resource not found: {}", ex.getMessage());

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setType(NOT_FOUND_TYPE);
        problem.setTitle("Resource Not Found");
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("resource", ex.getResourceName());
        problem.setProperty("field", ex.getFieldName());
        problem.setProperty("value", ex.getFieldValue());

        return problem;
    }

    @ExceptionHandler(ConflictException.class)
    public ProblemDetail handleConflict(ConflictException ex,
                                         HttpServletRequest request) {
        log.warn("Conflict: {}", ex.getMessage());

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT, ex.getMessage());
        problem.setType(CONFLICT_TYPE);
        problem.setTitle("Resource Conflict");
        problem.setInstance(URI.create(request.getRequestURI()));

        return problem;
    }

    @ExceptionHandler(BadRequestException.class)
    public ProblemDetail handleBadRequest(BadRequestException ex,
                                           HttpServletRequest request) {
        log.warn("Bad request: {}", ex.getMessage());

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Bad Request");
        problem.setInstance(URI.create(request.getRequestURI()));

        return problem;
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ProblemDetail handleUnauthorized(UnauthorizedException ex,
                                             HttpServletRequest request) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.UNAUTHORIZED, ex.getMessage());
        problem.setType(UNAUTHORIZED_TYPE);
        problem.setTitle("Unauthorized");
        problem.setInstance(URI.create(request.getRequestURI()));

        return problem;
    }

    @ExceptionHandler(ForbiddenException.class)
    public ProblemDetail handleForbidden(ForbiddenException ex,
                                          HttpServletRequest request) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.FORBIDDEN, ex.getMessage());
        problem.setType(FORBIDDEN_TYPE);
        problem.setTitle("Forbidden");
        problem.setInstance(URI.create(request.getRequestURI()));

        return problem;
    }

    // --- Validation Errors ---

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        List<Map<String, String>> violations = ex.getBindingResult()
                .getFieldErrors().stream()
                .map(error -> Map.of(
                        "field", error.getField(),
                        "message", Objects.requireNonNullElse(error.getDefaultMessage(), "Invalid value"),
                        "rejected", String.valueOf(error.getRejectedValue())))
                .toList();

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "Validation failed");
        problem.setType(VALIDATION_TYPE);
        problem.setTitle("Validation Error");
        problem.setProperty(VIOLATIONS_PROPERTY, violations);

        return ResponseEntity.badRequest().body(problem);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "Malformed JSON request body");
        problem.setTitle("Invalid Request Body");

        return ResponseEntity.badRequest().body(problem);
    }

    // --- Catch-All ---

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex,
                                                 HttpServletRequest request) {
        log.error("Unexpected error on {}: {}", request.getRequestURI(), ex.getMessage(), ex);

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again later.");
        problem.setType(INTERNAL_TYPE);
        problem.setTitle("Internal Server Error");
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("requestId", MDC.get("requestId"));

        return problem;
    }
}
```

## 14.2 Custom Exception Definitions

```java
@Getter
public class ResourceNotFoundException extends RuntimeException {

    private final String resourceName;
    private final String fieldName;
    private final Object fieldValue;

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: %s", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
}

public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}

public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
```

## 14.3 ProblemDetail Response Examples

**404 Not Found:**
```json
{
  "type": "https://api.company.com/errors/not-found",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "User not found with id: 42",
  "instance": "/api/v1/users/42",
  "resource": "User",
  "field": "id",
  "value": 42
}
```

**400 Validation Error:**
```json
{
  "type": "https://api.company.com/errors/validation",
  "title": "Validation Error",
  "status": 400,
  "detail": "Validation failed",
  "violations": [
    {
      "field": "email",
      "message": "must be a valid email",
      "rejected": "invalid-email"
    },
    {
      "field": "firstName",
      "message": "must not be blank",
      "rejected": ""
    }
  ]
}
```

**500 Internal Server Error:**
```json
{
  "type": "https://api.company.com/errors/internal",
  "title": "Internal Server Error",
  "status": 500,
  "detail": "An unexpected error occurred. Please try again later.",
  "instance": "/api/v1/users",
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

## 14.4 Spring Boot Configuration for ProblemDetail

```yaml
# application.yml
spring:
  mvc:
    problemdetails:
      enabled: true  # Enables RFC 9457 by default in Spring Boot 3.x
```

---

# 15. Database Migrations

## 15.1 Flyway (Primary Choice)

### Configuration

```yaml
# application.yml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    validate-on-migrate: true
    out-of-order: false
    table: flyway_schema_history
```

### Naming Convention

```
V{version}__{description}.sql

Examples:
V1__create_users_table.sql
V2__create_roles_table.sql
V3__create_user_roles_junction.sql
V4__add_avatar_url_to_users.sql
V5__create_audit_logs_table.sql
```

### Migration Template: Create Table

```sql
-- V1__create_users_table.sql
CREATE TABLE users (
    id              BIGSERIAL       PRIMARY KEY,
    first_name      VARCHAR(100)    NOT NULL,
    last_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password        VARCHAR(255)    NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_by      VARCHAR(100),
    deleted         BOOLEAN         NOT NULL DEFAULT FALSE,
    deleted_at      TIMESTAMP,
    deleted_by      VARCHAR(100),
    version         BIGINT          NOT NULL DEFAULT 0
);

CREATE INDEX idx_users_email ON users (email) WHERE deleted = false;
CREATE INDEX idx_users_status ON users (status) WHERE deleted = false;
CREATE INDEX idx_users_deleted ON users (deleted);
```

### Migration Template: Alter Table

```sql
-- V4__add_avatar_url_to_users.sql
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);

COMMENT ON COLUMN users.avatar_url IS 'URL to user avatar image';
COMMENT ON COLUMN users.phone_number IS 'User phone number with country code';
```

### Migration Template: Create Junction Table

```sql
-- V3__create_user_roles_junction.sql
CREATE TABLE user_roles (
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id     BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);
```

### Migration Template: Seed Data

```sql
-- V10__seed_default_roles.sql
INSERT INTO roles (name, description) VALUES
    ('ADMIN', 'System administrator with full access'),
    ('MANAGER', 'Manager with elevated permissions'),
    ('USER', 'Standard user with basic access')
ON CONFLICT (name) DO NOTHING;
```

## 15.2 Liquibase (Alternative)

### Configuration

```yaml
# application.yml
spring:
  liquibase:
    enabled: true
    change-log: classpath:db/changelog/db.changelog-master.yaml
```

### Master Changelog

```yaml
# db/changelog/db.changelog-master.yaml
databaseChangeLog:
  - include:
      file: db/changelog/changes/001-create-users-table.yaml
  - include:
      file: db/changelog/changes/002-create-roles-table.yaml
  - include:
      file: db/changelog/changes/003-create-user-roles-table.yaml
```

### Changeset Template

```yaml
# db/changelog/changes/001-create-users-table.yaml
databaseChangeLog:
  - changeSet:
      id: 001-create-users-table
      author: developer
      changes:
        - createTable:
            tableName: users
            columns:
              - column:
                  name: id
                  type: BIGINT
                  autoIncrement: true
                  constraints:
                    primaryKey: true
                    nullable: false
              - column:
                  name: first_name
                  type: VARCHAR(100)
                  constraints:
                    nullable: false
              - column:
                  name: last_name
                  type: VARCHAR(100)
                  constraints:
                    nullable: false
              - column:
                  name: email
                  type: VARCHAR(255)
                  constraints:
                    nullable: false
                    unique: true
              - column:
                  name: created_at
                  type: TIMESTAMP
                  defaultValueComputed: CURRENT_TIMESTAMP
                  constraints:
                    nullable: false
              - column:
                  name: deleted
                  type: BOOLEAN
                  defaultValueBoolean: false
                  constraints:
                    nullable: false
        - createIndex:
            indexName: idx_users_email
            tableName: users
            columns:
              - column:
                  name: email
```

## 15.3 Migration Best Practices

| Practice | Guidance |
|----------|----------|
| Immutability | Never modify a migration once applied |
| Backwards compatibility | Migrations should not break the running application |
| Small changes | One logical change per migration |
| Testing | Test migrations against a copy of production data |
| Rollback | Include rollback scripts for critical migrations |
| Indexes | Always add indexes in the same migration as the column |
| Data migrations | Separate data migrations from schema migrations |
| Naming | Use descriptive names that explain the change |

---

# 16. Unit and Integration Testing Templates

## 16.1 Controller Test (MockMvc)

```java
@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("GET /api/v1/users/{id} - Should return user when found")
    void getUser_WhenExists_ReturnsUser() throws Exception {
        // given
        Long userId = 1L;
        UserResponse response = new UserResponse(
                userId, "John", "Doe", "john@example.com",
                UserStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now(), "admin");

        when(userService.getById(userId)).thenReturn(response);

        // when & then
        mockMvc.perform(get("/api/v1/users/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(userId))
                .andExpect(jsonPath("$.data.email").value("john@example.com"));
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("GET /api/v1/users/{id} - Should return 404 when not found")
    void getUser_WhenNotExists_Returns404() throws Exception {
        // given
        Long userId = 999L;
        when(userService.getById(userId))
                .thenThrow(new ResourceNotFoundException("User", "id", userId));

        // when & then
        mockMvc.perform(get("/api/v1/users/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Resource Not Found"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/v1/users - Should create user with valid request")
    void createUser_WithValidRequest_ReturnsCreated() throws Exception {
        // given
        CreateUserRequest request = new CreateUserRequest(
                "John", "Doe", "john@example.com", "Password1", UserStatus.ACTIVE);

        UserResponse response = new UserResponse(
                1L, "John", "Doe", "john@example.com",
                UserStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now(), "admin");

        when(userService.create(any(CreateUserRequest.class))).thenReturn(response);

        // when & then
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1L));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/v1/users - Should return 400 for invalid request")
    void createUser_WithInvalidRequest_Returns400() throws Exception {
        // given - missing required fields
        CreateUserRequest request = new CreateUserRequest(
                "", "", "invalid-email", "short", null);

        // when & then
        mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Validation Error"))
                .andExpect(jsonPath("$.violations").isArray());
    }

    @Test
    @DisplayName("GET /api/v1/users - Should return 401 for unauthenticated request")
    void getUsers_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(get("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
```

## 16.2 Service Test (Mockito)

```java
@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("getById - Should return user response when user exists")
    void getById_WhenExists_ReturnsResponse() {
        // given
        Long userId = 1L;
        User user = User.builder()
                .id(userId)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .status(UserStatus.ACTIVE)
                .build();

        UserResponse expectedResponse = new UserResponse(
                userId, "John", "Doe", "john@example.com",
                UserStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now(), "admin");

        when(userRepository.findByIdAndDeletedFalse(userId)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(expectedResponse);

        // when
        UserResponse result = userService.getById(userId);

        // then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(userId);
        assertThat(result.email()).isEqualTo("john@example.com");

        verify(userRepository).findByIdAndDeletedFalse(userId);
        verify(userMapper).toResponse(user);
    }

    @Test
    @DisplayName("getById - Should throw ResourceNotFoundException when user not found")
    void getById_WhenNotExists_ThrowsException() {
        // given
        Long userId = 999L;
        when(userRepository.findByIdAndDeletedFalse(userId)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.getById(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User")
                .hasMessageContaining("999");

        verify(userRepository).findByIdAndDeletedFalse(userId);
        verifyNoInteractions(userMapper);
    }

    @Test
    @DisplayName("create - Should create user and encode password")
    void create_WithValidRequest_CreatesUser() {
        // given
        CreateUserRequest request = new CreateUserRequest(
                "John", "Doe", "john@example.com", "Password1", UserStatus.ACTIVE);

        User userEntity = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .build();

        User savedUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .status(UserStatus.ACTIVE)
                .build();

        UserResponse expectedResponse = new UserResponse(
                1L, "John", "Doe", "john@example.com",
                UserStatus.ACTIVE, LocalDateTime.now(), LocalDateTime.now(), "system");

        when(userRepository.existsByEmailAndDeletedFalse("john@example.com")).thenReturn(false);
        when(userMapper.toEntity(request)).thenReturn(userEntity);
        when(passwordEncoder.encode("Password1")).thenReturn("$2a$12$encoded");
        when(userRepository.save(userEntity)).thenReturn(savedUser);
        when(userMapper.toResponse(savedUser)).thenReturn(expectedResponse);

        // when
        UserResponse result = userService.create(request);

        // then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        verify(passwordEncoder).encode("Password1");
        verify(userRepository).save(userEntity);
    }

    @Test
    @DisplayName("create - Should throw ConflictException for duplicate email")
    void create_WithDuplicateEmail_ThrowsConflict() {
        // given
        CreateUserRequest request = new CreateUserRequest(
                "John", "Doe", "existing@example.com", "Password1", UserStatus.ACTIVE);

        when(userRepository.existsByEmailAndDeletedFalse("existing@example.com")).thenReturn(true);

        // when & then
        assertThatThrownBy(() -> userService.create(request))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("existing@example.com");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("delete - Should soft delete user")
    void delete_WhenExists_SoftDeletes() {
        // given
        Long userId = 1L;
        User user = User.builder().id(userId).deleted(false).build();

        when(userRepository.findByIdAndDeletedFalse(userId)).thenReturn(Optional.of(user));

        // when
        userService.delete(userId);

        // then
        assertThat(user.isDeleted()).isTrue();
        verify(userRepository).save(user);
    }
}
```

## 16.3 Repository Test (@DataJpaTest)

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@ActiveProfiles("test")
class UserRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .password("$2a$12$encoded")
                .status(UserStatus.ACTIVE)
                .deleted(false)
                .build();
        entityManager.persistAndFlush(testUser);
    }

    @Test
    @DisplayName("findByIdAndDeletedFalse - Should find active user")
    void findByIdAndDeletedFalse_WhenActive_ReturnsUser() {
        Optional<User> found = userRepository.findByIdAndDeletedFalse(testUser.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("john@example.com");
    }

    @Test
    @DisplayName("findByIdAndDeletedFalse - Should not find soft-deleted user")
    void findByIdAndDeletedFalse_WhenDeleted_ReturnsEmpty() {
        testUser.setDeleted(true);
        entityManager.persistAndFlush(testUser);

        Optional<User> found = userRepository.findByIdAndDeletedFalse(testUser.getId());

        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("existsByEmailAndDeletedFalse - Should detect existing email")
    void existsByEmailAndDeletedFalse_WhenExists_ReturnsTrue() {
        boolean exists = userRepository.existsByEmailAndDeletedFalse("john@example.com");

        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("Specification - Should filter by status")
    void findAll_WithStatusSpec_FiltersCorrectly() {
        User inactiveUser = User.builder()
                .firstName("Jane")
                .lastName("Doe")
                .email("jane@example.com")
                .password("$2a$12$encoded")
                .status(UserStatus.INACTIVE)
                .deleted(false)
                .build();
        entityManager.persistAndFlush(inactiveUser);

        Specification<User> spec = UserSpecification.hasStatus(UserStatus.ACTIVE);
        List<User> results = userRepository.findAll(spec);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getStatus()).isEqualTo(UserStatus.ACTIVE);
    }
}
```

## 16.4 Integration Test (@SpringBootTest)

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
@AutoConfigureMockMvc
class UserIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private String adminToken;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        // Generate admin token for authenticated requests
        UserDetails adminDetails = org.springframework.security.core.userdetails.User
                .withUsername("admin@example.com")
                .password("encoded")
                .roles("ADMIN")
                .build();
        adminToken = jwtTokenProvider.generateAccessToken(adminDetails);
    }

    @Test
    @DisplayName("Full CRUD lifecycle integration test")
    void userCrudLifecycle() throws Exception {
        // CREATE
        CreateUserRequest createRequest = new CreateUserRequest(
                "John", "Doe", "john@example.com", "Password1", UserStatus.ACTIVE);

        String createResponse = mockMvc.perform(post("/api/v1/users")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long userId = objectMapper.readTree(createResponse).path("data").path("id").asLong();

        // READ
        mockMvc.perform(get("/api/v1/users/{id}", userId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("john@example.com"));

        // UPDATE
        UpdateUserRequest updateRequest = new UpdateUserRequest(
                "Johnny", null, null, null);

        mockMvc.perform(put("/api/v1/users/{id}", userId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.firstName").value("Johnny"));

        // DELETE (soft)
        mockMvc.perform(delete("/api/v1/users/{id}", userId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());

        // VERIFY DELETED
        mockMvc.perform(get("/api/v1/users/{id}", userId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Pagination and search integration test")
    void searchWithPagination() throws Exception {
        // Seed data
        for (int i = 0; i < 25; i++) {
            CreateUserRequest req = new CreateUserRequest(
                    "User" + i, "Test", "user" + i + "@example.com",
                    "Password1", UserStatus.ACTIVE);

            mockMvc.perform(post("/api/v1/users")
                    .header("Authorization", "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(req)));
        }

        // Search with pagination
        mockMvc.perform(get("/api/v1/users")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("page", "0")
                        .param("size", "10")
                        .param("sort", "firstName,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content.length()").value(10))
                .andExpect(jsonPath("$.data.totalElements").value(25))
                .andExpect(jsonPath("$.data.totalPages").value(3));
    }
}
```

## 16.5 Test Configuration

```yaml
# application-test.yml
spring:
  datasource:
    # Testcontainers will override this via @ServiceConnection
    url: jdbc:tc:postgresql:16-alpine:///testdb
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  flyway:
    enabled: false  # Use ddl-auto for tests, or enable for migration testing

app:
  jwt:
    secret: dGVzdC1zZWNyZXQta2V5LWZvci1qdW5pdC10ZXN0cy1vbmx5LW5vdC1mb3ItcHJvZHVjdGlvbg==
    expiration-ms: 3600000
    refresh-expiration-ms: 86400000
```

## 16.6 Testing Best Practices

| Practice | Guidance |
|----------|----------|
| Naming | Use `@DisplayName` for readable test descriptions |
| Structure | Follow Given/When/Then (Arrange/Act/Assert) pattern |
| Independence | Each test should be independent and repeatable |
| Assertions | Use AssertJ for fluent, readable assertions |
| Containers | Use Testcontainers for database tests (no H2) |
| Mocking | Mock only external dependencies, not the class under test |
| Coverage | Aim for 80%+ line coverage on service layer |
| Edge cases | Test null inputs, empty collections, boundary values |
| Security | Test authenticated and unauthenticated access |
| Validation | Test all validation constraints with invalid data |

---

# 17. Performance and Caching

## 17.1 Spring Cache Configuration

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(Duration.ofMinutes(10))
                .recordStats());
        return cacheManager;
    }

    // Alternative: Redis cache for distributed environments
    // @Bean
    // public RedisCacheManager redisCacheManager(RedisConnectionFactory factory) {
    //     RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
    //             .entryTtl(Duration.ofMinutes(10))
    //             .serializeKeysWith(
    //                 RedisSerializationContext.SerializationPair.fromSerializer(
    //                     new StringRedisSerializer()))
    //             .serializeValuesWith(
    //                 RedisSerializationContext.SerializationPair.fromSerializer(
    //                     new GenericJackson2JsonRedisSerializer()));
    //
    //     return RedisCacheManager.builder(factory)
    //             .cacheDefaults(config)
    //             .withCacheConfiguration("users",
    //                 config.entryTtl(Duration.ofMinutes(5)))
    //             .build();
    // }
}
```

## 17.2 Caching in Services

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Cacheable(value = "users", key = "#id")
    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        log.debug("Cache miss for user id={}", id);
        User user = findUserOrThrow(id);
        return userMapper.toResponse(user);
    }

    @Override
    @CachePut(value = "users", key = "#result.id()")
    @Transactional
    public UserResponse create(CreateUserRequest request) {
        // ... creation logic
        return userMapper.toResponse(saved);
    }

    @Override
    @CachePut(value = "users", key = "#id")
    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        // ... update logic
        return userMapper.toResponse(saved);
    }

    @Override
    @CacheEvict(value = "users", key = "#id")
    @Transactional
    public void delete(Long id) {
        // ... delete logic
    }

    // Evict all cached users (e.g., after bulk operations)
    @CacheEvict(value = "users", allEntries = true)
    public void evictAllUsersCache() {
        log.info("Evicted all users cache entries");
    }
}
```

## 17.3 Query Performance

```java
// Use projections for read-only queries that don't need full entity
public interface UserSummaryProjection {
    Long getId();
    String getFirstName();
    String getLastName();
    String getEmail();
}

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Projection query - loads only needed columns
    @Query("SELECT u.id as id, u.firstName as firstName, u.lastName as lastName, u.email as email " +
           "FROM User u WHERE u.deleted = false")
    Page<UserSummaryProjection> findAllSummaries(Pageable pageable);

    // Batch fetch to avoid N+1
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id IN :ids")
    List<User> findAllWithRolesByIds(@Param("ids") List<Long> ids);
}
```

## 17.4 Connection Pool Configuration

```yaml
# application.yml
spring:
  datasource:
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      idle-timeout: 300000       # 5 minutes
      max-lifetime: 1200000      # 20 minutes
      connection-timeout: 20000  # 20 seconds
      pool-name: AppHikariPool
      leak-detection-threshold: 60000  # 1 minute
```

## 17.5 JPA Performance Tuning

```yaml
spring:
  jpa:
    open-in-view: false  # CRITICAL: disable to avoid lazy loading in view layer
    properties:
      hibernate:
        default_batch_fetch_size: 20
        order_inserts: true
        order_updates: true
        jdbc:
          batch_size: 50
          batch_versioned_data: true
        query:
          in_clause_parameter_padding: true
          plan_cache_max_size: 2048
```

## 17.6 Pagination Performance

```java
// For large datasets, use keyset (cursor) pagination instead of OFFSET
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.id > :lastId AND u.deleted = false ORDER BY u.id ASC")
    List<User> findNextPage(@Param("lastId") Long lastId, Pageable pageable);

    // Count query for total (execute once, cache result)
    @Query("SELECT COUNT(u) FROM User u WHERE u.deleted = false")
    @Cacheable(value = "userCount", unless = "#result == 0")
    long countActive();
}
```

## 17.7 HTTP Caching Headers

```java
@GetMapping("/{id}")
public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable Long id) {
    UserResponse user = userService.getById(id);

    return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(Duration.ofMinutes(5)).mustRevalidate())
            .eTag(String.valueOf(user.hashCode()))
            .body(ApiResponse.success(user));
}

// Conditional request support
@GetMapping("/{id}")
public ResponseEntity<ApiResponse<UserResponse>> getUser(
        @PathVariable Long id,
        WebRequest webRequest) {

    UserResponse user = userService.getById(id);
    String etag = String.valueOf(user.hashCode());

    if (webRequest.checkNotModified(etag)) {
        return null; // Returns 304 Not Modified
    }

    return ResponseEntity.ok()
            .eTag(etag)
            .body(ApiResponse.success(user));
}
```

---

# 18. Production Logging and Observability

## 18.1 Logback Configuration (Structured JSON)

```xml
<!-- logback-spring.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <springProperty scope="context" name="APP_NAME" source="spring.application.name"/>

    <!-- Console appender for development -->
    <springProfile name="dev,local">
        <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
            <encoder>
                <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
            </encoder>
        </appender>

        <root level="INFO">
            <appender-ref ref="CONSOLE"/>
        </root>

        <logger name="com.company" level="DEBUG"/>
        <logger name="org.hibernate.SQL" level="DEBUG"/>
    </springProfile>

    <!-- JSON appender for production -->
    <springProfile name="prod,staging">
        <appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">
            <encoder class="net.logstash.logback.encoder.LogstashEncoder">
                <customFields>{"app":"${APP_NAME}","env":"${SPRING_PROFILES_ACTIVE:-prod}"}</customFields>
                <includeMdcKeyName>requestId</includeMdcKeyName>
                <includeMdcKeyName>userId</includeMdcKeyName>
                <includeMdcKeyName>traceId</includeMdcKeyName>
                <includeMdcKeyName>spanId</includeMdcKeyName>
            </encoder>
        </appender>

        <root level="INFO">
            <appender-ref ref="JSON"/>
        </root>

        <logger name="com.company" level="INFO"/>
        <logger name="org.hibernate.SQL" level="WARN"/>
        <logger name="org.springframework.security" level="WARN"/>
    </springProfile>
</configuration>
```

## 18.2 Logging Best Practices

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        // INFO: Business events and state changes
        log.info("Creating order: customerId={}, items={}", request.customerId(), request.items().size());

        try {
            Order order = processOrder(request);

            // INFO: Successful operations with business context
            log.info("Order created: orderId={}, total={}, customerId={}",
                    order.getId(), order.getTotalAmount(), order.getCustomerId());

            return orderMapper.toResponse(order);

        } catch (InsufficientStockException e) {
            // WARN: Expected business exceptions
            log.warn("Order creation failed due to insufficient stock: customerId={}, product={}",
                    request.customerId(), e.getProductId());
            throw e;

        } catch (Exception e) {
            // ERROR: Unexpected failures with full stack trace
            log.error("Unexpected error creating order: customerId={}", request.customerId(), e);
            throw new InternalException("Failed to create order", e);
        }
    }
}
```

### Logging Level Guidelines

| Level | When to Use |
|-------|-------------|
| TRACE | Detailed internal flow (disabled in production) |
| DEBUG | Diagnostic information useful during development |
| INFO | Business events, state transitions, successful operations |
| WARN | Recoverable issues, degraded service, expected exceptions |
| ERROR | Failures requiring attention, unexpected exceptions |

### What to Log

- Business events: order created, user registered, payment processed
- State transitions: status changes, workflow steps
- Performance: slow queries (>500ms), cache misses
- Security: login attempts, authorization failures, suspicious activity
- External calls: API requests/responses (timing, status, not bodies)

### What NEVER to Log

- Passwords, tokens, API keys, secrets
- Full credit card numbers or SSNs
- Request/response bodies containing sensitive data
- Personal health information (PHI)
- Full stack traces for expected business exceptions

## 18.3 Spring Boot Actuator

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,loggers
      base-path: /actuator
  endpoint:
    health:
      show-details: when_authorized
      probes:
        enabled: true
    loggers:
      enabled: true
  info:
    env:
      enabled: true
    git:
      mode: full
  health:
    diskspace:
      enabled: true
    db:
      enabled: true
    redis:
      enabled: true
```

## 18.4 Micrometer Metrics

```java
@Configuration
public class MetricsConfig {

    @Bean
    public MeterRegistryCustomizer<MeterRegistry> commonTags(
            @Value("${spring.application.name}") String appName) {
        return registry -> registry.config()
                .commonTags("application", appName);
    }
}

// Custom business metrics in services
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final MeterRegistry meterRegistry;
    private final Counter orderCreatedCounter;
    private final Timer orderProcessingTimer;

    @PostConstruct
    void initMetrics() {
        orderCreatedCounter = Counter.builder("orders.created")
                .description("Number of orders created")
                .tag("type", "all")
                .register(meterRegistry);

        orderProcessingTimer = Timer.builder("orders.processing.duration")
                .description("Time to process an order")
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(meterRegistry);
    }

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        return orderProcessingTimer.record(() -> {
            OrderResponse response = doCreateOrder(request);
            orderCreatedCounter.increment();

            meterRegistry.gauge("orders.pending",
                    orderRepository.countByStatus(OrderStatus.PENDING));

            return response;
        });
    }
}
```

## 18.5 Distributed Tracing

```yaml
# application.yml (Spring Boot 3.x with Micrometer Tracing)
management:
  tracing:
    sampling:
      probability: 1.0  # 100% in dev, reduce in production
  zipkin:
    tracing:
      endpoint: http://localhost:9411/api/v2/spans

logging:
  pattern:
    correlation: "[${spring.application.name:},%X{traceId:-},%X{spanId:-}] "
```

```java
// Custom span for important operations
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final ObservationRegistry observationRegistry;

    @Override
    @Observed(name = "payment.process",
              contextualName = "process-payment",
              lowCardinalityKeyValues = {"payment.type", "credit-card"})
    public PaymentResponse processPayment(PaymentRequest request) {
        // Automatically creates a span with timing and tags
        return doProcessPayment(request);
    }
}
```

## 18.6 Health Indicators

```java
@Component
public class ExternalApiHealthIndicator implements HealthIndicator {

    private final RestTemplate restTemplate;
    private final String externalApiUrl;

    @Override
    public Health health() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(
                    externalApiUrl + "/health", String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return Health.up()
                        .withDetail("externalApi", "Available")
                        .withDetail("responseTime", "< 1s")
                        .build();
            }

            return Health.down()
                    .withDetail("externalApi", "Unhealthy")
                    .withDetail("statusCode", response.getStatusCode())
                    .build();

        } catch (Exception e) {
            return Health.down()
                    .withDetail("externalApi", "Unreachable")
                    .withException(e)
                    .build();
        }
    }
}
```

## 18.7 Request/Response Logging Filter

```java
@Component
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        long startTime = System.currentTimeMillis();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();

        try {
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();

            if (duration > 500) {
                log.warn("Slow request: {} {} {} - {}ms (status={})",
                        method, uri, queryString, duration, status);
            } else {
                log.info("Request: {} {} - {}ms (status={})",
                        method, uri, duration, status);
            }
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/actuator") || path.startsWith("/swagger");
    }
}
```

---

# 19. Application Configuration

## 19.1 application.yml (Base)

```yaml
spring:
  application:
    name: enterprise-api

  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:appdb}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      idle-timeout: 300000
      max-lifetime: 1200000
      connection-timeout: 20000
      pool-name: AppHikariPool

  jpa:
    open-in-view: false
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        default_batch_fetch_size: 20
        jdbc:
          batch_size: 50
        query:
          plan_cache_max_size: 2048

  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

  jackson:
    serialization:
      write-dates-as-timestamps: false
      fail-on-empty-beans: false
    deserialization:
      fail-on-unknown-properties: false
    default-property-inclusion: non_null

  mvc:
    problemdetails:
      enabled: true

server:
  port: ${SERVER_PORT:8080}
  servlet:
    context-path: /
  error:
    include-message: always
    include-binding-errors: always
    include-stacktrace: never

app:
  jwt:
    secret: ${JWT_SECRET}
    expiration-ms: 900000          # 15 minutes
    refresh-expiration-ms: 604800000  # 7 days
  cors:
    allowed-origins: ${CORS_ORIGINS:http://localhost:3000}
```

## 19.2 application-dev.yml

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

  flyway:
    enabled: true

logging:
  level:
    com.company: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE

springdoc:
  swagger-ui:
    enabled: true
```

## 19.3 application-prod.yml

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

  datasource:
    hikari:
      minimum-idle: 10
      maximum-pool-size: 50

logging:
  level:
    com.company: INFO
    org.hibernate: WARN
    org.springframework: WARN

springdoc:
  swagger-ui:
    enabled: false
  api-docs:
    enabled: false

management:
  tracing:
    sampling:
      probability: 0.1  # 10% sampling in production
```

---

# 20. REST Endpoint Standards

## 20.1 URL Conventions

Use nouns, not verbs. Use plural resource names. Use kebab-case for multi-word resources.

```
GET    /api/v1/users                 # List with pagination
GET    /api/v1/users/{id}            # Get by ID
POST   /api/v1/users                 # Create
PUT    /api/v1/users/{id}            # Full update
PATCH  /api/v1/users/{id}            # Partial update
DELETE /api/v1/users/{id}            # Delete

# Nested resources
GET    /api/v1/users/{userId}/orders          # List user orders
POST   /api/v1/users/{userId}/orders          # Create order for user
GET    /api/v1/users/{userId}/orders/{orderId} # Get specific order

# Actions (when CRUD doesn't fit)
POST   /api/v1/users/{id}/activate
POST   /api/v1/users/{id}/deactivate
POST   /api/v1/orders/{id}/cancel
POST   /api/v1/orders/{id}/ship

# Search
GET    /api/v1/users/search?q=john&status=ACTIVE
```

**Avoid:**
```
/createUser
/deleteUser
/getUsers
/user/list
/api/v1/getUserById
```

## 20.2 HTTP Status Codes

| Operation | Success | Common Errors |
|-----------|---------|---------------|
| GET (single) | 200 OK | 404 Not Found |
| GET (list) | 200 OK | 400 Bad Request (invalid params) |
| POST | 201 Created | 400, 409 Conflict |
| PUT | 200 OK | 400, 404 |
| PATCH | 200 OK | 400, 404 |
| DELETE | 204 No Content | 404 |
| Auth | 200 OK | 401 Unauthorized |
| Forbidden | — | 403 Forbidden |
| Server Error | — | 500 Internal Server Error |

## 20.3 API Versioning

```java
// URL path versioning (preferred)
@RequestMapping("/api/v1/users")

// Header versioning (alternative)
@GetMapping(headers = "X-API-Version=2")
```

## 20.4 Pagination Response Format

```json
{
  "success": true,
  "data": {
    "content": [
      { "id": 1, "name": "John Doe" },
      { "id": 2, "name": "Jane Doe" }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 45,
    "totalPages": 3,
    "first": true,
    "last": false,
    "hasNext": true,
    "hasPrevious": false
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

## 20.5 Filtering and Sorting

```
# Multiple filters
GET /api/v1/users?status=ACTIVE&department=IT&role=ADMIN

# Date ranges
GET /api/v1/orders?createdFrom=2024-01-01&createdTo=2024-01-31

# Sorting (Spring Data default)
GET /api/v1/users?sort=lastName,asc&sort=firstName,asc

# Search
GET /api/v1/users?search=john
```

---

# 21. Validation

## 21.1 Request Validation

Always validate request DTOs using Jakarta Bean Validation annotations.

```java
public record CreateProductRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 200, message = "Name must be between 2 and 200 characters")
        String name,

        @Size(max = 2000, message = "Description must not exceed 2000 characters")
        String description,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        @Digits(integer = 8, fraction = 2, message = "Price must have at most 8 integer and 2 decimal digits")
        BigDecimal price,

        @NotNull(message = "Category ID is required")
        @Positive(message = "Category ID must be positive")
        Long categoryId,

        @NotEmpty(message = "At least one tag is required")
        @Size(max = 10, message = "Maximum 10 tags allowed")
        List<@NotBlank(message = "Tag must not be blank") String> tags,

        @Pattern(regexp = "^[A-Z]{2}-\\d{6}$", message = "SKU must match format: XX-000000")
        String sku
) {}
```

## 21.2 Custom Validators

```java
// Annotation
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
@Documented
public @interface UniqueEmail {
    String message() default "Email already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// Validator implementation
@Component
@RequiredArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {

    private final UserRepository userRepository;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) return true; // Let @NotBlank handle null
        return !userRepository.existsByEmailAndDeletedFalse(email);
    }
}
```

## 21.3 Cross-Field Validation

```java
// Annotation
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateRangeValidator.class)
public @interface ValidDateRange {
    String message() default "End date must be after start date";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    String startField();
    String endField();
}

// Usage
@ValidDateRange(startField = "startDate", endField = "endDate")
public record CreateEventRequest(
        @NotBlank String name,
        @NotNull @FutureOrPresent LocalDate startDate,
        @NotNull @Future LocalDate endDate
) {}
```

## 21.4 Validation Groups

```java
// Define groups
public interface OnCreate {}
public interface OnUpdate {}

// Use in DTO
public record UserRequest(
        @Null(groups = OnCreate.class, message = "ID must not be provided on create")
        @NotNull(groups = OnUpdate.class, message = "ID is required on update")
        Long id,

        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String name,

        @NotBlank(groups = OnCreate.class, message = "Password is required")
        @Null(groups = OnUpdate.class, message = "Use change-password endpoint")
        String password
) {}

// Controller usage
@PostMapping
public ResponseEntity<ApiResponse<UserResponse>> create(
        @Validated(OnCreate.class) @RequestBody UserRequest request) { ... }

@PutMapping("/{id}")
public ResponseEntity<ApiResponse<UserResponse>> update(
        @Validated(OnUpdate.class) @RequestBody UserRequest request) { ... }
```

---

# 22. Transaction Management

## 22.1 Transaction Rules

```java
// Class-level: all public methods are read-only transactions
@Service
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {

    // Override for write operations
    @Override
    @Transactional
    public OrderResponse create(CreateOrderRequest request) { ... }

    // Read-only inherits from class level
    @Override
    public OrderResponse getById(Long id) { ... }

    // Explicit propagation for nested transactions
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAuditEvent(AuditEvent event) { ... }
}
```

## 22.2 Transaction Best Practices

| Practice | Guidance |
|----------|----------|
| Default read-only | Set `@Transactional(readOnly = true)` at class level |
| Write methods | Annotate with `@Transactional` to override |
| Propagation | Use `REQUIRED` (default) unless you need isolation |
| Rollback | Default rolls back on unchecked exceptions; specify checked if needed |
| Timeout | Set `timeout` for long-running operations |
| Never in controllers | Transactions belong in the service layer only |
| Keep short | Avoid long transactions; don't call external APIs inside a transaction |

## 22.3 Event Publishing Within Transactions

```java
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public OrderResponse create(CreateOrderRequest request) {
        Order order = orderRepository.save(buildOrder(request));

        // Event published after transaction commits
        eventPublisher.publishEvent(new OrderCreatedEvent(order.getId(), order.getCustomerId()));

        return orderMapper.toResponse(order);
    }
}

// Listener runs after commit (won't fail the transaction)
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void onOrderCreated(OrderCreatedEvent event) {
        log.info("Sending order confirmation: orderId={}", event.orderId());
        // Send email, notify external system, etc.
    }
}
```

---

# 23. Naming Standards

## 23.1 Class Naming

| Type | Convention | Example |
|------|-----------|---------|
| Entity | Singular noun | `User`, `Order`, `Product` |
| Controller | `{Entity}Controller` | `UserController` |
| Service Interface | `{Entity}Service` | `UserService` |
| Service Impl | `{Entity}ServiceImpl` | `UserServiceImpl` |
| Repository | `{Entity}Repository` | `UserRepository` |
| Mapper | `{Entity}Mapper` | `UserMapper` |
| Create DTO | `Create{Entity}Request` | `CreateUserRequest` |
| Update DTO | `Update{Entity}Request` | `UpdateUserRequest` |
| Response DTO | `{Entity}Response` | `UserResponse` |
| Summary DTO | `{Entity}SummaryResponse` | `UserSummaryResponse` |
| Specification | `{Entity}Specification` | `UserSpecification` |
| Exception | `{Descriptive}Exception` | `ResourceNotFoundException` |
| Config | `{Feature}Config` | `SecurityConfig` |
| Filter | `{Feature}Filter` | `JwtAuthenticationFilter` |
| Enum | Singular descriptive | `UserStatus`, `OrderType` |

## 23.2 Method Naming

| Operation | Service Method | Repository Method |
|-----------|---------------|-------------------|
| Get by ID | `getById(Long id)` | `findById(Long id)` |
| Find all | `findAll(Pageable)` | `findAll(Pageable)` |
| Search | `search(FilterDto, Pageable)` | `findAll(Spec, Pageable)` |
| Create | `create(CreateRequest)` | `save(Entity)` |
| Update | `update(Long id, UpdateRequest)` | `save(Entity)` |
| Delete | `delete(Long id)` | `delete(Entity)` |
| Check existence | `exists(criteria)` | `existsBy...(value)` |
| Count | `count(criteria)` | `countBy...(value)` |

## 23.3 Package Naming

```
com.company.project          # Root package
com.company.project.config   # Configuration classes
com.company.project.common   # Shared utilities, base classes
com.company.project.user     # Feature-based (alternative to layer-based)
com.company.project.order
```

---

# 24. Clean Code Principles

## 24.1 SOLID Principles in Spring Boot

### Single Responsibility
```java
// BAD: Service doing too much
@Service
public class UserService {
    public void registerUser(...) { ... }
    public void sendEmail(...) { ... }     // Not user business logic
    public void generateReport(...) { ... } // Not user business logic
}

// GOOD: Separated concerns
@Service
public class UserService { public void register(...) { ... } }

@Service
public class EmailService { public void send(...) { ... } }

@Service
public class ReportService { public void generate(...) { ... } }
```

### Open/Closed
```java
// Use strategy pattern for extensible behavior
public interface NotificationStrategy {
    void notify(User user, String message);
    NotificationType getType();
}

@Component
@RequiredArgsConstructor
public class NotificationService {
    private final List<NotificationStrategy> strategies;

    public void notify(User user, String message, NotificationType type) {
        strategies.stream()
                .filter(s -> s.getType() == type)
                .findFirst()
                .orElseThrow(() -> new UnsupportedOperationException("No strategy for: " + type))
                .notify(user, message);
    }
}
```

### Dependency Inversion
```java
// Always depend on abstractions
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final PaymentGateway paymentGateway;  // Interface, not concrete class
    private final NotificationService notificationService;  // Interface
}
```

## 24.2 Code Organization Rules

- Controllers should be thin (< 20 lines per method)
- Service methods should do one thing well (< 30 lines ideal)
- Extract private helper methods for complex logic
- Use meaningful variable and method names
- Avoid magic strings — use constants or enums
- Favor composition over inheritance
- Keep method parameter count ≤ 4 (use DTOs for more)
- No business logic in controllers or repositories

## 24.3 Constructor Injection (Always)

```java
// ALWAYS: Constructor injection via Lombok
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
}

// NEVER: Field injection
@Autowired
private UserRepository userRepository;  // Anti-pattern
```

## 24.4 Null Safety

```java
// Return Optional from repository, never null from services
public UserResponse getById(Long id) {
    return userRepository.findById(id)
            .map(userMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
}

// Use Optional for nullable parameters in specifications
public static Specification<User> hasStatus(UserStatus status) {
    return Optional.ofNullable(status)
            .map(s -> (Specification<User>) (root, q, cb) -> cb.equal(root.get("status"), s))
            .orElse(null);
}
```

---

# 25. Anti-Patterns

Never generate code that:

| Anti-Pattern | Why It's Wrong | Correct Approach |
|-------------|----------------|------------------|
| Return JPA entities from controllers | Exposes internal structure, lazy loading issues | Always use DTOs |
| Field injection (`@Autowired`) | Untestable, hidden dependencies | Constructor injection |
| Business logic in controllers | Violates SRP, untestable | Delegate to services |
| `try/catch` in every endpoint | Clutters code, inconsistent errors | Global exception handler |
| Return HTTP 200 for errors | Misleads clients | Proper status codes |
| `System.out.println()` | No log levels, not configurable | SLF4J logging |
| Return `null` | NPE risk, unclear semantics | Throw exceptions or Optional |
| Magic strings/numbers | Unmaintainable | Constants or enums |
| Expose stack traces | Security vulnerability | ProblemDetail with safe messages |
| Massive service methods | Hard to test, violates SRP | Extract helper methods |
| Mix validation with persistence | Coupling concerns | Validate in DTO, check in service |
| `CascadeType.ALL` everywhere | Unintended deletes/updates | Use only for owned children |
| `FetchType.EAGER` | N+1 queries, memory waste | Always LAZY, use EntityGraph |
| `spring.jpa.open-in-view=true` | Hidden queries in view layer | Disable, fetch in service |
| Catching `Exception` broadly | Hides bugs, swallows errors | Catch specific exceptions |
| Mutable shared state | Thread safety issues | Immutable DTOs, stateless services |
| Hard-coded configuration | Not environment-portable | Use `@Value` or `@ConfigurationProperties` |
| Synchronous external calls in transactions | Transaction timeout, resource locks | Call after commit or use async |

---

# 26. Maven POM Template

## 26.1 Complete POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.0</version>
        <relativePath/>
    </parent>

    <groupId>com.company</groupId>
    <artifactId>enterprise-api</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>Enterprise API</name>
    <description>Enterprise REST API</description>

    <properties>
        <java.version>21</java.version>
        <mapstruct.version>1.5.5.Final</mapstruct.version>
        <jjwt.version>0.12.5</jjwt.version>
        <springdoc.version>2.5.0</springdoc.version>
        <testcontainers.version>1.19.7</testcontainers.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-cache</artifactId>
        </dependency>

        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-database-postgresql</artifactId>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Mapping -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>${mapstruct.version}</version>
        </dependency>

        <!-- OpenAPI Documentation -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>${springdoc.version}</version>
        </dependency>

        <!-- Cache -->
        <dependency>
            <groupId>com.github.ben-manes.caffeine</groupId>
            <artifactId>caffeine</artifactId>
        </dependency>

        <!-- Observability -->
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-registry-prometheus</artifactId>
        </dependency>
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-tracing-bridge-otel</artifactId>
        </dependency>

        <!-- Logging -->
        <dependency>
            <groupId>net.logstash.logback</groupId>
            <artifactId>logstash-logback-encoder</artifactId>
            <version>7.4</version>
        </dependency>

        <!-- Utilities -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>postgresql</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-testcontainers</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.testcontainers</groupId>
                <artifactId>testcontainers-bom</artifactId>
                <version>${testcontainers.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>${lombok.version}</version>
                        </path>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok-mapstruct-binding</artifactId>
                            <version>0.2.0</version>
                        </path>
                        <path>
                            <groupId>org.mapstruct</groupId>
                            <artifactId>mapstruct-processor</artifactId>
                            <version>${mapstruct.version}</version>
                        </path>
                    </annotationProcessorPaths>
                    <compilerArgs>
                        <arg>-Amapstruct.defaultComponentModel=spring</arg>
                    </compilerArgs>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

# 27. Docker and Deployment

## 27.1 Dockerfile (Multi-stage)

```dockerfile
# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B
COPY src ./src
RUN ./mvnw package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
```

## 27.2 Docker Compose (Development)

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=appdb
      - DB_USERNAME=postgres
      - DB_PASSWORD=postgres
      - JWT_SECRET=dev-secret-key-base64-encoded-minimum-256-bits-long
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

# 28. Async Processing and Scheduling

## 28.1 Async Configuration

```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Override
    @Bean(name = "taskExecutor")
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (throwable, method, params) ->
                LoggerFactory.getLogger(method.getDeclaringClass())
                        .error("Async error in {}: {}", method.getName(), throwable.getMessage(), throwable);
    }
}
```

## 28.2 Async Service Usage

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final EmailClient emailClient;

    @Async
    @Override
    public CompletableFuture<Void> sendWelcomeEmail(String email, String name) {
        log.info("Sending welcome email to {}", email);
        try {
            emailClient.send(email, "Welcome", buildWelcomeBody(name));
            return CompletableFuture.completedFuture(null);
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}", email, e);
            return CompletableFuture.failedFuture(e);
        }
    }
}
```

## 28.3 Scheduling

```java
@Configuration
@EnableScheduling
@ConditionalOnProperty(name = "app.scheduling.enabled", havingValue = "true")
public class SchedulingConfig {
}

@Component
@RequiredArgsConstructor
@Slf4j
public class CleanupScheduler {

    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 2 * * *") // Daily at 2 AM
    @SchedulerLock(name = "cleanupDeletedUsers", lockAtMostFor = "30m")
    public void cleanupDeletedUsers() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(30);
        int count = userRepository.deleteByDeletedTrueAndDeletedAtBefore(threshold);
        log.info("Cleaned up {} soft-deleted users older than 30 days", count);
    }
}
```

---

# 29. File Upload and Download

## 29.1 File Upload Controller

```java
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Tag(name = "Files", description = "File upload and download endpoints")
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a file")
    public ResponseEntity<ApiResponse<FileResponse>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "directory", defaultValue = "") String directory) {

        FileResponse response = fileStorageService.store(file, directory);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "File uploaded successfully"));
    }

    @GetMapping("/{fileId}")
    @Operation(summary = "Download a file")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) {
        FileResource fileResource = fileStorageService.loadAsResource(fileId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileResource.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileResource.filename() + "\"")
                .body(fileResource.resource());
    }
}
```

## 29.2 File Storage Service

```java
@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private final Path storageLocation;

    public FileStorageServiceImpl(@Value("${app.file.upload-dir}") String uploadDir) {
        this.storageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @Override
    public FileResponse store(MultipartFile file, String directory) {
        validateFile(file);

        String fileId = UUID.randomUUID().toString();
        String originalFilename = StringUtils.cleanPath(
                Objects.requireNonNull(file.getOriginalFilename()));
        String extension = getExtension(originalFilename);
        String storedFilename = fileId + "." + extension;

        Path targetLocation = storageLocation.resolve(directory).resolve(storedFilename);
        Files.createDirectories(targetLocation.getParent());
        file.transferTo(targetLocation);

        log.info("File stored: id={}, name={}, size={}", fileId, originalFilename, file.getSize());

        return new FileResponse(fileId, originalFilename, file.getSize(), file.getContentType());
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        if (file.getSize() > 10 * 1024 * 1024) { // 10MB
            throw new BadRequestException("File size exceeds maximum limit of 10MB");
        }
        // Validate content type, extension, etc.
    }
}
```

---

# 30. Configuration Properties

## 30.1 Type-Safe Configuration

```java
@ConfigurationProperties(prefix = "app")
@Validated
public record AppProperties(
        @Valid Jwt jwt,
        @Valid Cors cors,
        @Valid FileStorage fileStorage
) {
    public record Jwt(
            @NotBlank String secret,
            @Positive long expirationMs,
            @Positive long refreshExpirationMs
    ) {}

    public record Cors(
            List<String> allowedOrigins,
            List<String> allowedMethods,
            List<String> allowedHeaders
    ) {}

    public record FileStorage(
            @NotBlank String uploadDir,
            long maxFileSize,
            List<String> allowedExtensions
    ) {}
}
```

## 30.2 Enable Configuration Properties

```java
@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

## 30.3 Usage in Services

```java
@Service
@RequiredArgsConstructor
public class JwtService {
    private final AppProperties appProperties;

    public String generateToken(UserDetails user) {
        long expiration = appProperties.jwt().expirationMs();
        // ... use type-safe properties
    }
}
```

---

# 31. Rate Limiting and Resilience

## 31.1 Rate Limiting with Bucket4j

```java
@Component
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String clientId = getClientIdentifier(request);
        Bucket bucket = buckets.computeIfAbsent(clientId, this::createBucket);

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);

            ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                    HttpStatus.TOO_MANY_REQUESTS, "Rate limit exceeded. Try again later.");
            problem.setTitle("Too Many Requests");

            new ObjectMapper().writeValue(response.getOutputStream(), problem);
        }
    }

    private Bucket createBucket(String clientId) {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1))))
                .build();
    }

    private String getClientIdentifier(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        return forwarded != null ? forwarded.split(",")[0].trim() : request.getRemoteAddr();
    }
}
```

## 31.2 Resilience Patterns (Retry, Circuit Breaker)

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class ExternalPaymentService {

    private final RestClient restClient;

    @Retry(name = "payment", fallbackMethod = "paymentFallback")
    @CircuitBreaker(name = "payment", fallbackMethod = "paymentFallback")
    public PaymentResult processPayment(PaymentRequest request) {
        return restClient.post()
                .uri("/payments")
                .body(request)
                .retrieve()
                .body(PaymentResult.class);
    }

    private PaymentResult paymentFallback(PaymentRequest request, Exception ex) {
        log.error("Payment service unavailable, returning failure: {}", ex.getMessage());
        return PaymentResult.failed("Payment service temporarily unavailable");
    }
}
```

```yaml
# application.yml - Resilience4j config
resilience4j:
  retry:
    instances:
      payment:
        max-attempts: 3
        wait-duration: 1s
        retry-exceptions:
          - java.io.IOException
          - java.util.concurrent.TimeoutException
  circuitbreaker:
    instances:
      payment:
        failure-rate-threshold: 50
        wait-duration-in-open-state: 30s
        sliding-window-size: 10
```

---

# 32. API Versioning Strategy

## 32.1 URL Path Versioning (Recommended)

```java
// V1 controller
@RestController
@RequestMapping("/api/v1/users")
public class UserControllerV1 {
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseV1> getUser(@PathVariable Long id) { ... }
}

// V2 controller (new response format)
@RestController
@RequestMapping("/api/v2/users")
public class UserControllerV2 {
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseV2> getUser(@PathVariable Long id) { ... }
}
```

## 32.2 Deprecation Strategy

```java
@Deprecated(since = "2.0", forRemoval = true)
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users (v1) [DEPRECATED]", description = "Use /api/v2/users instead")
public class UserControllerV1 {

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID",
               deprecated = true,
               description = "Deprecated. Use GET /api/v2/users/{id} instead.")
    public ResponseEntity<UserResponseV1> getUser(@PathVariable Long id) {
        // Add deprecation header
        return ResponseEntity.ok()
                .header("Deprecation", "true")
                .header("Sunset", "2025-06-01")
                .header("Link", "</api/v2/users>; rel=\"successor-version\"")
                .body(userService.getByIdV1(id));
    }
}
```

---

# 33. Data Export (CSV, Excel, PDF)

## 33.1 CSV Export

```java
@GetMapping(value = "/export/csv", produces = "text/csv")
@Operation(summary = "Export users as CSV")
public ResponseEntity<StreamingResponseBody> exportCsv(
        @ParameterObject UserSearchFilter filter) {

    StreamingResponseBody stream = outputStream -> {
        try (PrintWriter writer = new PrintWriter(outputStream)) {
            writer.println("ID,First Name,Last Name,Email,Status,Created At");
            userService.streamAll(filter, user -> {
                writer.printf("%d,%s,%s,%s,%s,%s%n",
                        user.id(), user.firstName(), user.lastName(),
                        user.email(), user.status(), user.createdAt());
            });
        }
    };

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"users.csv\"")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(stream);
}
```

## 33.2 Streaming Large Datasets

```java
// Service: stream results to avoid loading all into memory
@Override
@Transactional(readOnly = true)
public void streamAll(UserSearchFilter filter, Consumer<UserResponse> consumer) {
    Specification<User> spec = UserSpecification.buildSpec(
            filter.search(), filter.status(), filter.departmentId(),
            filter.createdFrom(), filter.createdTo());

    try (Stream<User> stream = userRepository.findAll(spec).stream()) {
        stream.map(userMapper::toResponse).forEach(consumer);
    }
}
```

---

# 34. Multi-Tenancy Patterns

## 34.1 Schema-per-Tenant

```java
@Component
public class TenantContext {
    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();

    public static String getCurrentTenant() {
        return CURRENT_TENANT.get();
    }

    public static void setCurrentTenant(String tenant) {
        CURRENT_TENANT.set(tenant);
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}

// Filter to extract tenant from header or JWT
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 2)
public class TenantFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String tenant = request.getHeader("X-Tenant-ID");
        if (StringUtils.hasText(tenant)) {
            TenantContext.setCurrentTenant(tenant);
        }
        try {
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
```

## 34.2 Discriminator Column (Shared Schema)

```java
@MappedSuperclass
@Getter @Setter
public abstract class TenantAwareEntity extends AuditableEntity {

    @Column(nullable = false, updatable = false, length = 50)
    private String tenantId;

    @PrePersist
    public void prePersist() {
        if (this.tenantId == null) {
            this.tenantId = TenantContext.getCurrentTenant();
        }
    }
}

// Automatic filtering via Hibernate filter
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = String.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Entity
public class Order extends TenantAwareEntity { ... }
```

---

# 35. Event-Driven Communication

## 35.1 Spring Application Events

```java
// Event definition
public record UserRegisteredEvent(
        Long userId,
        String email,
        String firstName,
        LocalDateTime registeredAt
) {}

// Publisher (in service)
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public UserResponse create(CreateUserRequest request) {
        User user = createAndSaveUser(request);

        eventPublisher.publishEvent(new UserRegisteredEvent(
                user.getId(), user.getEmail(), user.getFirstName(), LocalDateTime.now()));

        return userMapper.toResponse(user);
    }
}

// Listener (decoupled handler)
@Component
@RequiredArgsConstructor
@Slf4j
public class UserRegistrationListener {

    private final EmailService emailService;
    private final AnalyticsService analyticsService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Async
    public void onUserRegistered(UserRegisteredEvent event) {
        log.info("Handling user registration event: userId={}", event.userId());
        emailService.sendWelcomeEmail(event.email(), event.firstName());
        analyticsService.trackRegistration(event.userId());
    }
}
```

---

# 36. Jackson Configuration

## 36.1 Jackson Config

```java
@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        mapper.enable(SerializationFeature.INDENT_OUTPUT); // Only for dev
        return mapper;
    }
}
```

## 36.2 Custom Serializers/Deserializers

```java
// For enums with display values
public enum OrderStatus {
    PENDING("Pending"),
    PROCESSING("Processing"),
    SHIPPED("Shipped"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled");

    @JsonValue
    private final String displayName;

    @JsonCreator
    public static OrderStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(s -> s.displayName.equalsIgnoreCase(value) || s.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown status: " + value));
    }
}

// Trimming string deserializer
@JsonComponent
public class StringTrimDeserializer extends JsonDeserializer<String> {
    @Override
    public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getValueAsString();
        return value != null ? value.trim() : null;
    }
}
```

---

# 37. Security Hardening Checklist

## 37.1 HTTP Security Headers

```java
// Add to SecurityConfig filter chain
http.headers(headers -> headers
        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'"))
        .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
        .httpStrictTransportSecurity(hsts -> hsts
                .maxAgeInSeconds(31536000)
                .includeSubDomains(true))
        .contentTypeOptions(Customizer.withDefaults())
        .referrerPolicy(referrer -> referrer
                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)));
```

## 37.2 Input Sanitization

```java
@UtilityClass
public class InputSanitizer {

    private static final PolicyFactory POLICY = new HtmlPolicyBuilder()
            .allowElements("b", "i", "em", "strong")
            .toFactory();

    public static String sanitize(String input) {
        if (input == null) return null;
        return POLICY.sanitize(input);
    }

    public static String sanitizePlainText(String input) {
        if (input == null) return null;
        return input.replaceAll("[<>\"'&]", "");
    }
}
```

## 37.3 Security Checklist

| Item | Status |
|------|--------|
| CSRF disabled (stateless JWT) | ✓ |
| CORS configured properly | ✓ |
| Passwords hashed with BCrypt (cost 12+) | ✓ |
| JWT tokens short-lived (15 min access) | ✓ |
| Refresh token rotation | ✓ |
| Rate limiting on auth endpoints | ✓ |
| Input validation on all endpoints | ✓ |
| SQL injection prevention (parameterized queries) | ✓ |
| No sensitive data in logs | ✓ |
| No stack traces in responses | ✓ |
| HTTPS enforced in production | ✓ |
| Security headers configured | ✓ |
| Dependencies regularly updated | ✓ |
| Secrets in environment variables | ✓ |
| Account lockout after failed attempts | ✓ |

---

# 38. AI Generation Rules

When generating Spring Boot code, always follow these rules:

## 38.1 Architecture Rules

1. Always use layered architecture (Controller → Service → Repository)
2. Always create DTOs (never expose entities)
3. Always validate request bodies with `@Valid` and Jakarta annotations
4. Always use constructor injection (`@RequiredArgsConstructor`)
5. Always use `ResponseEntity` with appropriate status codes
6. Always implement centralized exception handling with `@RestControllerAdvice`
7. Always use custom, typed exceptions (never generic `Exception`)
8. Always return proper HTTP status codes per operation
9. Prefer MapStruct for DTO mapping
10. Use pagination for all collection endpoints
11. Follow REST naming conventions (plural nouns, no verbs)
12. Use `@Transactional(readOnly = true)` at class level, override for writes
13. Use SLF4J (`@Slf4j`) for all logging
14. Generate clean, readable, maintainable code
15. Follow SOLID principles throughout
16. Produce production-ready code by default

## 38.2 Security Rules

17. Never expose passwords, tokens, or secrets in responses or logs
18. Always hash passwords with BCrypt (cost factor ≥ 12)
19. Use Spring Security 6 with stateless JWT
20. Implement method-level security for sensitive operations
21. Validate authorization in the service layer for ownership checks

## 38.3 Data Rules

22. Always use Flyway migrations (never `ddl-auto` in production)
23. Implement soft delete by default
24. Enable JPA Auditing (createdAt, updatedAt, createdBy, updatedBy)
25. Use `@SQLRestriction` for automatic soft-delete filtering
26. Always use `FetchType.LAZY` for associations
27. Use `@EntityGraph` or `JOIN FETCH` to avoid N+1 queries
28. Disable `spring.jpa.open-in-view`

## 38.4 Quality Rules

29. Add OpenAPI annotations on controllers and DTOs
30. Implement request ID correlation (MDC + X-Request-Id header)
31. Use structured JSON logging in production
32. Add health checks and Prometheus metrics
33. Implement caching for frequently-read, rarely-changing data
34. Use Testcontainers for integration tests (never H2)
35. Aim for 80%+ coverage on service layer

## 38.5 Code Style Rules

36. Use Java records for DTOs when immutability is desired
37. Use Lombok `@Builder` for entities
38. Keep controller methods under 15 lines
39. Keep service methods under 30 lines (extract helpers)
40. No magic strings — use constants or enums
41. Use `Optional` correctly (never as field types)
42. Favor early returns over deep nesting

---

# 39. Quick Reference Cheat Sheet

## 39.1 Entity Checklist

- [ ] Extends `AuditableEntity` or `SoftDeletableEntity`
- [ ] Has `@Entity` and `@Table` annotations
- [ ] Uses `@Id` with `GenerationType.IDENTITY`
- [ ] Has `@SQLRestriction("deleted = false")` if soft-deletable
- [ ] All associations are `FetchType.LAZY`
- [ ] Bidirectional relationships have helper methods
- [ ] Uses `@Builder` and `@NoArgsConstructor`
- [ ] Has proper `@Column` constraints (nullable, length, unique)

## 39.2 Service Checklist

- [ ] Implements an interface
- [ ] `@Service` and `@RequiredArgsConstructor`
- [ ] `@Transactional(readOnly = true)` at class level
- [ ] Write methods have `@Transactional`
- [ ] Uses mapper for entity ↔ DTO conversion
- [ ] Throws typed exceptions (never returns null)
- [ ] Has `@Slf4j` logging
- [ ] Validates business rules before persistence

## 39.3 Controller Checklist

- [ ] `@RestController` with versioned `@RequestMapping`
- [ ] `@RequiredArgsConstructor` (single service dependency ideal)
- [ ] `@Tag` for OpenAPI grouping
- [ ] Each method has `@Operation` and `@ApiResponse` annotations
- [ ] `@Valid` on all `@RequestBody` parameters
- [ ] Returns `ResponseEntity<ApiResponse<T>>`
- [ ] Uses proper HTTP status codes (201 for POST, 204 for DELETE)
- [ ] Thin methods (delegate to service immediately)

## 39.4 Repository Checklist

- [ ] Extends `JpaRepository<Entity, Long>` and `JpaSpecificationExecutor<Entity>`
- [ ] Custom queries use `@Query` with JPQL (not native SQL)
- [ ] Has soft-delete-aware finder methods
- [ ] Uses `@EntityGraph` for eager association loading when needed

## 39.5 Migration Checklist

- [ ] Follows naming convention `V{n}__{description}.sql`
- [ ] Includes proper indexes
- [ ] Has `NOT NULL` constraints where appropriate
- [ ] Uses `DEFAULT` values for booleans and timestamps
- [ ] Partial indexes for soft-delete filtering (PostgreSQL)

---

# 40. Success Criteria

Generated code should:

- **Compile** without modification
- **Follow** Spring Boot 3.x and Java 21+ best practices
- **Be production-ready** with proper error handling, logging, and security
- **Be RESTful** with proper HTTP methods, status codes, and URL conventions
- **Be testable** with clear separation of concerns and injectable dependencies
- **Be maintainable** with clean code principles and consistent naming
- **Use DTOs** for all API communication (never expose entities)
- **Use centralized exception handling** with RFC 9457 ProblemDetail responses
- **Use validation** with descriptive error messages
- **Use proper HTTP status codes** for each operation type
- **Follow clean architecture** with thin controllers and rich services
- **Follow enterprise coding standards** for Fortune 500 deployments
- **Include observability** with structured logging, metrics, and health checks
- **Be secure** with JWT authentication, input validation, and security headers
- **Be performant** with caching, pagination, and optimized queries
- **Be documented** with OpenAPI annotations on all public endpoints

---

# End of Spring Boot Enterprise AI Skill v2
