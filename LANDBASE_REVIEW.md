# Landbase PEME Page — Implementation & Functionality Review

## Overview

The Landbase PEME (Pre-Employment Medical Examination) module is a full-stack feature that manages medical examination records for land-based seafarer employment. It follows a standard CRUD pattern with a Spring Boot backend and a Next.js (App Router) frontend.

---

## Architecture Summary

| Layer         | Technology                              | Location                                          |
|---------------|----------------------------------------|---------------------------------------------------|
| Database      | PostgreSQL + Flyway migration          | `V1__init.sql` → `landbase_pemes` table           |
| Entity        | JPA/Hibernate + Lombok                 | `LandbasePeme.java`                               |
| Repository    | Spring Data JPA + Specification        | `LandbasePemeRepository.java`                     |
| Service       | Transactional service + domain events  | `LandbasePemeService.java`                        |
| Mapper        | MapStruct                              | `LandbasePemeMapper.java`                         |
| DTO           | Validated POJO                         | `LandbasePemeDto.java`                            |
| Controller    | REST + OpenAPI annotations             | `LandbasePemeController.java`                     |
| Domain Events | Spring Application Events              | `LandbasePemeCreatedEvent`, `LandbasePemeUpdatedEvent` |
| Frontend Page | Next.js App Router (client component)  | `app/(app)/landbase/page.tsx`                     |
| Form Hook     | Custom React hook (state machine)      | `hooks/use-landbase-form.ts`                      |
| Sections      | 7 modular section components           | `components/landbase/*.tsx`                       |
| Types         | TypeScript interfaces + constants      | `components/landbase/types.ts`                    |
| Utilities     | Flatten / sanitize / humanize helpers  | `components/landbase/utils.ts`                    |
| API Client    | Typed HTTP methods                     | `lib/api.ts` (LandbasePeme entity methods)        |

---

## Backend Implementation

### Database Schema (`landbase_pemes` table)

- **Primary Key**: UUID `id`
- **Business ID**: `peme_id` (VARCHAR 12, UNIQUE) — auto-generated with "PEME" prefix via sequence
- **Foreign Key**: `seafarer_profile_id` → `seafarer_profiles(id)` with index
- **Timestamps**: `created_date`, `updated_date` (managed by `BaseEntity`)
- **Data Sections**:
  - Past Medical History (JSONB `medical_history` + text fields)
  - Questionnaire (7 yes/no questions + comments + Q8 with details)
  - Ancillary Examinations (14+ fields for lab results)
  - Remarks (text)
  - Results (3 pass/findings status fields)
  - Recommendation (fitness determination + certification dates + physician info)

### Entity (`LandbasePeme.java`)

- Extends `BaseEntity` (provides UUID id, createdDate, updatedDate via `@PrePersist`/`@PreUpdate`)
- Uses `@Enumerated(EnumType.STRING)` for all enum-typed fields — safe for readability and migration
- Medical history stored as `Map<String, String>` with `@JdbcTypeCode(SqlTypes.JSON)` — flexible schema for varying condition lists
- `@ManyToOne(fetch = FetchType.LAZY)` to `SeafarerProfile` — correct lazy fetch for performance

### Repository (`LandbasePemeRepository.java`)

- Extends both `JpaRepository` and `JpaSpecificationExecutor` — supports pagination, sorting, and dynamic specification-based queries

### Service (`LandbasePemeService.java`)

- **Class-level `@Transactional(readOnly = true)`** with write methods individually annotated `@Transactional` — correct pattern for read-heavy services
- **Search**: Builds a JPA Specification joining `seafarerProfile` for name/PEME-ID search (case-insensitive LIKE)
- **Create flow**:
  1. Resolves seafarer profile from provided UUID
  2. Maps DTO → entity, clears system fields
  3. Generates business ID ("PEME" prefix)
  4. Persists and publishes `LandbasePemeCreatedEvent`
- **Update flow**:
  1. Fetches existing entity (404 if missing)
  2. Resolves potentially updated profile link
  3. Maps mutable fields via `mapper.updateEntity()`
  4. Persists and publishes `LandbasePemeUpdatedEvent`
- **Event publishing**: Uses Spring `ApplicationEventPublisher` for audit/notification workflows

### Mapper (`LandbasePemeMapper.java`)

- MapStruct with `componentModel = "spring"`
- `toDto`: maps nested `seafarerProfile` entity → DTO, extracts `seafarerProfile.id` → `seafarerProfileId`
- `toEntity`/`updateEntity`: ignores system fields and relationship (handled by service)
- Includes `profileToDto` for nested profile conversion

### Controller (`LandbasePemeController.java`)

| Method | Endpoint                | Description                       |
|--------|------------------------|-----------------------------------|
| GET    | `/api/landbase-pemes`  | Paginated list with optional search |
| GET    | `/api/landbase-pemes/{id}` | Get single record by UUID     |
| POST   | `/api/landbase-pemes`  | Create new PEME record            |
| PUT    | `/api/landbase-pemes/{id}` | Update existing PEME record   |

- Returns proper HTTP status codes (201 Created with Location header, 200 OK)
- Wrapped in `ApiResponse<T>` for consistent response envelope
- OpenAPI/Swagger annotations for documentation
- Default pagination: size=20, sort by createdDate DESC

### Domain Events

- `LandbasePemeCreatedEvent`: carries aggregate ID, business ID (pemeId), and patient name
- `LandbasePemeUpdatedEvent`: carries aggregate ID and business ID
- Both extend `DomainEvent` base class
- Consumed by `AuditEventListener` for downstream workflows

---

## Frontend Implementation

### Page Component (`app/(app)/landbase/page.tsx`)

- **Client component** wrapped in `<Suspense>` (required for `useSearchParams`)
- Orchestrates 7 section components via a declarative `SECTIONS` array registry
- Staggered `framer-motion` fade-in animations per section
- Uses `useLandbaseForm` hook for all state and actions
- Loading state shows centered spinner
- Validation alert displayed below toolbar when save is blocked

### Form State Machine (`use-landbase-form.ts`)

**Modes:**
- **View Mode**: All fields disabled, shows New/Edit/Print buttons
- **Edit Mode (New)**: Empty form, Save/Cancel/Print visible
- **Edit Mode (Existing)**: Pre-filled form, Save/Cancel/Print visible

**Initialization:**
- If `?id=<uuid>` query param exists → fetches that specific record
- Otherwise → fetches the most recently updated PEME record
- If no records exist → shows empty form ready for new entry

**CRUD Operations:**
- `handleNew()`: Resets to EMPTY_PEME, enters edit mode, focuses first field
- `handleEdit()`: Snapshots current data (for cancel), enables fields
- `handleCancel()`: Restores snapshot (existing) or resets (new), returns to view mode
- `handleSave()`: Validates (profile + name required), sanitizes payload, calls create/update API, returns to view mode on success
- `handlePrint()`: Triggers `window.print()`

**Seafarer Profile Integration:**
- `handleSearch()`: Debounced profile search via `useProfileSearch` hook
- `handleSelectResult()`: Looks up existing PEME linked to that profile; if found loads it, otherwise populates only personal info fields

**Validation:**
- Requires `seafarer_profile_id` (linked patient)
- Requires `last_name` and `first_name`
- Shows inline alert for profile validation, toast for field validation

### Section Components

All sections follow a consistent pattern:
- Accept `LandbaseSectionProps { data, onChange, disabled }`
- Use `createFieldUpdater(data, onChange)` utility for single-field updates
- Include "Set Normal" button for quick data entry with sensible defaults

| Section                         | Responsibility                                                    |
|--------------------------------|-------------------------------------------------------------------|
| `PersonalInfoSection`          | Read-only personal info (delegates to common component)           |
| `PastMedicalHistorySection`    | 3-column grid of 31 medical conditions (Yes/No) + supplementary fields |
| `QuestionnaireSection`         | 8 health declaration questions (Yes/No) + comments                |
| `AncillaryExaminationsSection` | 14+ lab/diagnostic test results with mixed input types            |
| `RemarksSection`               | Free-text physician remarks/restrictions                          |
| `ResultsSection`               | 3-category pass/findings radio summary                            |
| `RecommendationSection`        | Fitness determination, certification dates, physician info        |

### Type System (`types.ts`)

- Strongly typed with union types for all enum fields
- `EMPTY_PEME` constant for initialization and reset
- `LandbaseSectionProps` shared interface for component contracts
- Medical history stored as `Record<string, MedicalConditionValue>` (flexible key set)

### Utilities (`utils.ts`)

- `flattenProfileIntoRecord()`: Transforms nested API response to flat form model
- `stripSystemFields()`: Removes id/peme_id/timestamps before API submission
- `sanitizePayload()`: Converts empty strings to null (prevents backend enum deserialization errors)
- `createFieldUpdater()`: DRY pattern for single-field onChange handlers
- `humanizeField()`: snake_case/camelCase → "Human Label" for error messages

### API Client (`lib/api.ts`)

- `filter({ id })`: Fetch single record or all (up to 100)
- `list(orderBy, limit)`: Paginated list with field mapping (snake_case → camelCase sort fields)
- `create(data)`: POST new PEME
- `update(id, data)`: PUT existing PEME
- `search(keyword, limit)`: Keyword search against name/PEME-ID

---

## Strengths

1. **Clean layered architecture**: Clear separation between controller, service, mapper, and repository layers
2. **Domain events**: Proper event-driven design for audit trails and future extensibility
3. **Consistent API design**: Wrapped responses, proper HTTP semantics, OpenAPI documentation
4. **Strong typing**: Both backend (Java enums) and frontend (TypeScript unions) enforce valid values
5. **Modular frontend sections**: Each section is independent, testable, and reorderable via the SECTIONS array
6. **"Set Normal" pattern**: Practical UX optimization for the most common medical outcomes — saves significant data entry time
7. **Specification-based search**: Flexible, composable query filtering across joined entities
8. **Payload sanitization**: Frontend correctly converts empty strings to null to avoid enum deserialization issues
9. **MapStruct mapper**: Compile-time type-safe mapping with explicit field protection
10. **Lazy loading**: SeafarerProfile fetched lazily — avoids N+1 on list operations when combined with specification joins
11. **Business ID generation**: Server-side sequential IDs with domain prefix ("PEME-000001") for human-readable identification
12. **Profile reuse**: Smart search that checks if an existing PEME exists for a selected seafarer before creating a new one

---

## Areas for Improvement

### Backend

| Issue | Severity | Detail |
|-------|----------|--------|
| No DELETE endpoint | Low | No soft or hard delete exposed. May be intentional for medical record compliance, but should be explicitly documented. |
| No pagination metadata in search | Low | Search uses the same list endpoint. Works fine, but dedicated search could optimize differently. |
| Date fields as String | Medium | `dateInitialPeme`, `dateOfFitness`, `validUntil` are `String` instead of `LocalDate`. Loses type safety and database-level date operations. |
| No field-level validation | Medium | Only `@NotNull` on `seafarerProfileId`. Backend doesn't validate enum values or date formats — relies on frontend + JPA enum mapping. |
| Potential N+1 on list | Low | The specification joins `seafarerProfile` for search, but when search is null, the unrestricted spec may trigger lazy loading on DTO mapping. Consider `@EntityGraph` or fetch join for the list query. |
| Hardcoded physician lists | Low | Frontend has hardcoded physician options. Should be a lookup/reference-data endpoint. |

### Frontend

| Issue | Severity | Detail |
|-------|----------|--------|
| No form dirty-state tracking | Low | No confirmation prompt when navigating away with unsaved changes. |
| No error boundary | Low | API failures in `handleSelectResult` are silently swallowed. |
| Date validation | Medium | Date fields accept string input without format validation before submission. |
| No loading state for profile search within handleSelectResult | Low | The secondary PEME lookup within `handleSelectResult` doesn't show a loading indicator. |
| PersonalInfoSection always disabled | Info | Intentionally read-only (editable only on /profile), but the `disabled` prop from parent is overridden to `true`. Could remove the prop passthrough for clarity. |
| No optimistic updates | Low | Save waits for server response before updating UI — acceptable for medical data but could add a saving overlay. |
| Accessibility | Medium | Radio groups use `hideLabels` which may affect screen reader experience — ensure `ariaLabel` props are fully surfacing to assistive tech. |

### Architecture

| Issue | Severity | Detail |
|-------|----------|--------|
| No unit/integration tests found | High | No test files detected for the landbase module (neither backend nor frontend). |
| No API versioning | Low | Endpoints at `/api/landbase-pemes` without version prefix. Fine for internal apps. |
| Medical history schema flexibility | Info | JSONB column for medical history allows schema drift. The condition list is only enforced in the frontend constants. |

---

## Data Flow Summary

```
[User Action]
     │
     ▼
[FormToolbar] ──────── Search ────────► useProfileSearch (debounced)
     │                                        │
     ▼                                        ▼
[useLandbaseForm] ◄───── handleSelectResult ─── Profile results
     │
     │ handleSave()
     ▼
[sanitizePayload + stripSystemFields]
     │
     ▼
[api.entities.LandbasePeme.create/update]
     │  (HTTP POST/PUT /api/landbase-pemes)
     ▼
[LandbasePemeController]
     │
     ▼
[LandbasePemeService]
     │  - resolveProfile()
     │  - mapper.toEntity() / mapper.updateEntity()
     │  - businessIdGenerator.generateId("PEME")
     │  - repository.save()
     │  - eventPublisher.publishEvent()
     ▼
[LandbasePemeRepository → PostgreSQL]
     │
     ▼
[LandbasePemeCreatedEvent / LandbasePemeUpdatedEvent]
     │
     ▼
[AuditEventListener] → Audit log
```

---

## Functional Coverage

| Feature                          | Status |
|----------------------------------|--------|
| Create new PEME record           | Done   |
| Update existing PEME record      | Done   |
| View PEME in read-only mode      | Done   |
| Search by patient name / PEME ID | Done   |
| Pagination & sorting             | Done   |
| Link to seafarer profile         | Done   |
| Auto-load latest record          | Done   |
| Load specific record by UUID     | Done   |
| Set Normal (bulk defaults)       | Done   |
| Print                            | Done   |
| Domain events (audit)            | Done   |
| Delete PEME record               | Not implemented |
| Form dirty-state warning         | Not implemented |
| Unit/integration tests           | Not implemented |
| Field-level backend validation   | Partial (only profile ID required) |

---

## Conclusion

The Landbase PEME module is a well-structured, production-quality implementation following established enterprise patterns (layered architecture, domain events, MapStruct, specification-based queries). The frontend is cleanly componentized with a clear state machine in the custom hook. The "Set Normal" UX pattern is thoughtful for the medical examination use case. Primary gaps are the lack of automated tests and some minor validation improvements on both sides of the stack.
