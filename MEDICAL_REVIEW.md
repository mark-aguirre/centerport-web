# Medical Exam Page — Implementation & Functionality Review

## Overview

The Medical Exam module implements the Pre-Employment Medical Examination (PEME) workflow for maritime personnel. It captures approximately 150 data points across physical examination, vision, audiometry, medical history, laboratory results, ancillary examinations, fitness assessment, and certification. The backend provides a complete Spring Boot CRUD API with domain events and keyword search, and the frontend connects to it via a real HTTP API client with full CRUD form behavior.

---

## Architecture Summary

| Layer         | Technology                              | Location                                                                 |
|---------------|----------------------------------------|--------------------------------------------------------------------------|
| Database      | PostgreSQL + Flyway                    | `V1__init.sql` → `medical_exams` table                                   |
| Entity        | JPA + Hibernate (JSONB, Enums)         | `backend/.../medical/MedicalExam.java`                                   |
| Repository    | Spring Data JPA + Specification        | `backend/.../medical/MedicalExamRepository.java`                         |
| Service       | Spring @Service + @Transactional       | `backend/.../medical/MedicalExamService.java`                            |
| Mapper        | MapStruct (spring component model)     | `backend/.../medical/MedicalExamMapper.java`                             |
| DTO           | Lombok @Data + Jakarta Validation      | `backend/.../medical/MedicalExamDto.java`                                |
| Controller    | Spring REST + OpenAPI (Swagger)        | `backend/.../medical/MedicalExamController.java`                         |
| Domain Events | Spring ApplicationEventPublisher       | `backend/.../medical/event/MedicalExam{Created,Updated}Event.java`       |
| Frontend Page | Next.js 16 App Router (client render)  | `frontend/src/app/(app)/medical/page.tsx`                                |
| Form Hook     | Custom hook with real backend API      | `frontend/src/hooks/use-medical-form.ts`                                 |
| Sections      | 19 modular section components          | `frontend/src/components/medical/`                                       |
| Types         | TypeScript interfaces + unions         | `frontend/src/components/medical/types.ts`                               |
| API Client    | HTTP client with typed methods         | `frontend/src/lib/api.ts` → `api.entities.MedicalExam`                   |

---

## Backend Implementation

### Database Schema (`medical_exams` table)

- **Primary Key**: `id UUID`
- **Business ID**: `exam_id VARCHAR(12)`, unique, format `MED00000001`, generated via `med_seq` PostgreSQL sequence
- **Foreign Key**: `seafarer_profile_id UUID NOT NULL` → `seafarer_profiles(id)` with index `idx_medical_exams_seafarer_profile_id`
- **Timestamps**: `created_date TIMESTAMP NOT NULL`, `updated_date TIMESTAMP NOT NULL` (managed by BaseEntity lifecycle hooks)
- **Data Sections**:
  - Personal: `date_of_birth`, `age` (VARCHAR)
  - Vital Signs: 13 VARCHAR(50) columns (height, BP systolic/diastolic, pulse, respiration, temp, weight, BMI, O2 sat, etc.)
  - Vision: 17 VARCHAR(50) columns (far/near OD/OS corrected/uncorrected, color, STCW, contact lenses, date)
  - Audiometry: 10 VARCHAR columns (AS/AD right/left, satisfactory)
  - Speech: 1 VARCHAR column
  - Condition Questions: 3 VARCHAR columns
  - Physical Systems: 8 finding/remarks pairs (skin, HEENT, neck, chest_lungs, cardiovascular, abdomen, extremities, neurological) — VARCHAR(50) for enum + TEXT for remarks
  - Findings: 3 JSONB columns (`findings_a`, `findings_b`, `findings_c`)
  - Visual Acuity (legacy): 4 columns
  - Questionnaire: 1 JSONB + 2 TEXT columns
  - Medical History: 1 JSONB + 9 TEXT columns
  - Ancillary Exams: 18 VARCHAR/TEXT columns
  - Lab Results: 8 result/remarks pairs (VARCHAR(50) + TEXT)
  - Final Recommendation: 7 columns
  - Fitness: 5 VARCHAR columns
  - Dates/Certification: 6 VARCHAR columns
  - Diagnosis: 3 columns (TEXT + VARCHAR)
  - Treatment Plan: 5 columns
  - Physician: 2 VARCHAR columns

### Entity (`MedicalExam.java`)

- Extends `BaseEntity` (UUID `id`, `createdDate`, `updatedDate` with `@PrePersist`/`@PreUpdate`)
- `@ManyToOne(fetch = FetchType.LAZY)` to `SeafarerProfile` via `seafarer_profile_id`
- Enums stored as `@Enumerated(EnumType.STRING)`: `BPClassification`, `ExamFinding` (x9), `VisualAcuityResult`, `LabStatus` (x8), `ConsultationStatus`
- JSONB maps: `@JdbcTypeCode(SqlTypes.JSON)` for `findingsA`, `findingsB`, `findingsC`, `questionnaire`, `medicalHistory`
- All date fields stored as `String` (not `LocalDate`)

### Repository (`MedicalExamRepository.java`)

- Extends `JpaRepository<MedicalExam, UUID>` and `JpaSpecificationExecutor<MedicalExam>`
- No custom query methods defined
- Specification support used by service for keyword search

### Service (`MedicalExamService.java`)

- `@Transactional(readOnly = true)` at class level, `@Transactional` on mutations
- Injects `SeafarerProfileRepository` to resolve profile references
- **findAll(search, pageable)**: Builds search specification, returns paginated DTOs. Matches keyword against seafarer profile's lastName, firstName, or examId (case-insensitive LIKE).
- **findById**: Fetches by UUID, throws `NotFoundException` with logging on miss
- **create flow**:
  1. Resolve `SeafarerProfile` from `dto.getSeafarerProfileId()` (throws 404 if not found)
  2. Map DTO → entity via `mapper.toEntity(dto)`
  3. Clear system fields (id, examId, createdDate, updatedDate)
  4. Set resolved profile on entity: `entity.setSeafarerProfile(profile)`
  5. Generate business ID: `businessIdGenerator.generateId("MED")`
  6. `repository.save(entity)`
  7. Publish `MedicalExamCreatedEvent` using resolved profile's name
  8. Return `mapper.toDto(saved)`
- **update flow**:
  1. Fetch existing by UUID or throw `NotFoundException`
  2. Resolve `SeafarerProfile` from DTO (allows profile re-linking)
  3. Set profile on existing entity
  4. `mapper.updateEntity(dto, existing)` — merges fields
  5. `repository.save(existing)`
  6. Publish `MedicalExamUpdatedEvent` (aggregateId, examId)
  7. Return `mapper.toDto(saved)`

### Mapper (`MedicalExamMapper.java`)

- `@Mapper(componentModel = "spring")`
- **toDto**: Maps `seafarerProfile.id` → `seafarerProfileId`, and full `seafarerProfile` → `SeafarerProfileDto` via `profileToDto`
- **toEntity**: Ignores `id`, `examId`, `createdDate`, `updatedDate`, `seafarerProfile` (profile resolved by service)
- **updateEntity**: Same ignores, merges all other fields onto `@MappingTarget`

### Controller (`MedicalExamController.java`)

| Method | Endpoint               | Description                                      | Status Codes      |
|--------|------------------------|--------------------------------------------------|-------------------|
| GET    | `/api/medical-exams`   | List/search exams, paginated (20/page, desc)     | 200               |
| GET    | `/api/medical-exams/{id}` | Get single exam by UUID                       | 200, 404          |
| POST   | `/api/medical-exams`   | Create new exam                                  | 201, 400          |
| PUT    | `/api/medical-exams/{id}` | Update existing exam                          | 200, 400, 404     |

- Response envelope: `ApiResponse<T>` with success message
- Location header on create (201)
- Default pagination: size=20, sort=createdDate DESC
- `?search=` query parameter for keyword filtering
- OpenAPI `@Tag`, `@Operation`, `@ApiResponses` annotations
- No DELETE endpoint (by design for medical compliance records)

### Domain Events

- **MedicalExamCreatedEvent**: extends `DomainEvent`, carries `examId`, `patientLastName`, `patientFirstName`
- **MedicalExamUpdatedEvent**: extends `DomainEvent`, carries `examId`
- Published synchronously within transaction via `ApplicationEventPublisher`
- Consumed by `AuditEventListener` (global listener)

---

## Frontend Implementation

### Page Component (`src/app/(app)/medical/page.tsx`)

- Client-side rendered (`"use client"`)
- Wrapped in `<Suspense>` for `useSearchParams` compatibility
- Uses `SECTIONS` array pattern with 7 entries:
  1. `PersonalInfoSection` (personal data)
  2. `PhysicalExaminationSection` (orchestrates 10 sub-sections)
  3. `MedicalHistorySection` (detailed condition grid + history)
  4. `LaboratoryResultsSection` (8 lab tests with status/remarks)
  5. `DiagnosisSection` (primary/secondary diagnosis + ICD-10)
  6. `TreatmentPlanSection` (treatment, medications, referral, physician)
  7. `RemarksSection` (free-text notes)
- Framer Motion staggered animation (0.06s delay per section)
- `FormToolbar` provides New/Edit/Save/Cancel/Print + profile search
- Profile search integrated via `useProfileSearch` hook
- `handleSelectProfile` fills personal info fields AND captures `seafarer_profile_id`
- Loading state shows centered spinner
- `saveAlert` displayed as destructive Alert when validation fails

**Button Visibility Logic:**
- **Edit**: Hidden when no personal information is loaded (`data.last_name` is empty) — prevents editing a blank form
- **Save**: Always visible in edit mode, but handler validates `seafarer_profile_id` is present — shows `saveAlert` "Please select a patient before saving" if missing
- **New**: Always visible in view mode
- **Print**: Always visible

### Form State Machine (`use-medical-form.ts`)

**Modes:**
- **View mode**: Fields disabled via `<fieldset disabled>`, New/Edit/Print buttons visible
- **Edit mode (new)**: Fields enabled, empty form, Save/Cancel/Print visible
- **Edit mode (existing)**: Fields enabled with loaded data, Save/Cancel/Print visible

**Initialization:**
- Reads `?id=` search param to load existing record from backend API
- If no ID param, loads most recently updated exam from backend
- If backend returns no records, starts with empty form in view mode

**CRUD Operations:**
- `handleNew`: Resets to `EMPTY_EXAM`, enters edit mode, focuses first field
- `handleEdit`: Snapshots current data as `originalData`, enters edit mode
- `handleCancel`: Restores `originalData` (or existing record, or empty), returns to view mode
- `handleSave`: Validates → strips system fields → calls `api.entities.MedicalExam.create/update` → flattens response → shows toast → returns to view mode
- `handlePrint`: Calls `window.print()` — no state change

**Validation (in handleSave):**
1. `seafarer_profile_id` must be present — shows `saveAlert` if missing
2. `last_name` and `first_name` must be filled — shows toast error if missing

**Related Entity Integration:**
- Profile search calls real backend API (`api.entities.SeafarerProfile.search`)
- On select, fills 14 personal info fields from the profile
- Captures `profile.id` as `seafarer_profile_id` — enables backend save

### Section Components

| Section                      | Responsibility                                                      |
|-----------------------------|---------------------------------------------------------------------|
| PersonalInfoSection          | Name, DOB, passport, nationality, employer via common component     |
| PhysicalExaminationSection   | Orchestrator for 10 sub-sections below                              |
| PastMedicalHistoryGrid       | 3-column Y/N condition grid (31 conditions) + extras                |
| QuestionnaireGrid            | 8 Yes/No questions + comments + medications detail                  |
| VitalsSection                | Height, weight, BP, pulse, respiration, temp, BMI (9 fields)        |
| VisionSection                | Corrected/uncorrected far/near OD/OS + color/VA/STCW/contacts      |
| AudiometrySpeechSection      | AS/AD hearing per ear + satisfactory + speech assessment             |
| ConditionQuestionsSection    | 3 Yes/No condition assessments (sea aggravation, ID docs, lookout)  |
| FindingsGrid                 | A/B/C body system checkbox columns (20 items)                       |
| AncillaryExamsSection        | Chest X-ray, ECG, CBC, HIV, HbsAg, RPR, blood type, psych test     |
| FinalRecommendationSection   | Remarks + certification results (Basic OOH, Additional, Flag/Post)  |
| FitnessAssessmentSection     | Fitness for Deck/Engine/Catering/Other + dates + physician info     |
| MedicalHistorySection        | 2-column condition grid + surgical/family/allergy/social history    |
| LaboratoryResultsSection     | 8 lab tests with Normal/With Findings/Pending + remarks             |
| DiagnosisSection             | Primary/secondary diagnosis + ICD-10 code                           |
| TreatmentPlanSection         | Treatment plan, medications, follow-up, referral, physician         |
| RemarksSection               | Free-text remarks textarea                                          |
| YesNoRadioRow                | Reusable Y/N radio component (shared utility)                       |

**Shared pattern**: All sections receive `MedicalSectionProps` (`data`, `onChange`, `disabled?`). Each wraps content in `<fieldset disabled={disabled}>` to natively disable all child form controls in view mode. `PhysicalExaminationSection` passes `disabled` to all 10 sub-sections.

### Type System (`types.ts`)

- Full `MedicalExam` interface with ~150+ fields using snake_case naming
- Type aliases for enums: `Gender`, `CivilStatus`, `BPClassification`, `VisualAcuityResult`, `ExamFinding`, `LabStatus`, `ConsultationStatus`
- `Record<string, boolean>` for findings maps, `Record<string, string>` for questionnaire/history maps
- System fields (`id`, `exam_id`, `created_date`, `updated_date`) are optional
- `seafarer_profile_id` (optional string) — UUID linking to the seafarer profile
- `seafarer_profile` (optional object) — nested profile data returned in responses
- `MedicalSectionProps` shared interface with `data`, `onChange`, `disabled?`

### API Client (`src/lib/api.ts` → `api.entities.MedicalExam`)

| Method   | Description                                                    |
|----------|----------------------------------------------------------------|
| `filter` | Fetch by UUID or list all (up to 100)                          |
| `list`   | Paginated list with sort direction parsing                     |
| `create` | POST to `/api/medical-exams`                                   |
| `update` | PUT to `/api/medical-exams/{id}`                               |
| `search` | Keyword search via `?search=` param (patient name or exam ID)  |

- Field mapping: frontend snake_case sort fields → backend camelCase (`created_date` → `createdDate`)
- Pagination handling via `PagedResponse<T>` wrapper
- Leverages shared `httpClient` which auto-unwraps `ApiResponse<T>.data`

---

## Strengths

1. **Full-stack integration** — Frontend calls real backend API endpoints for all CRUD operations. Data persists to PostgreSQL via the backend service layer.

2. **Clean layered backend architecture** — Entity, Repository, Service, Mapper, Controller, DTO separation with proper annotations and Javadoc.

3. **Profile resolution on save** — Service resolves `SeafarerProfile` by UUID before persisting, ensuring referential integrity and enabling event data.

4. **Domain events** — `MedicalExamCreatedEvent` and `MedicalExamUpdatedEvent` enable decoupled audit logging and future downstream workflows.

5. **JSONB for dynamic data** — PostgreSQL JSONB for findings, questionnaire, and medical history avoids join table explosion while keeping data queryable.

6. **Business ID generation** — `MED00000001` format via PostgreSQL sequence provides human-readable, sequential identifiers.

7. **Keyword search** — Backend supports `?search=` parameter with case-insensitive matching against patient name and exam ID via JPA Specification.

8. **View/Edit mode enforcement** — `<fieldset disabled={disabled}>` natively disables all child form controls without needing per-element prop drilling.

9. **Button visibility guards** — Edit button hidden when no record is loaded. Save validates profile linkage before allowing persistence.

10. **Component modularity** — 19 section components with shared props interface. All sections now rendered in the page (7 top-level, 10 as sub-sections of PhysicalExaminationSection).

11. **Profile search integration** — Debounced search against backend, fills personal info AND captures `seafarer_profile_id` for proper FK linkage.

12. **System field protection** — Backend mapper ignores system fields; frontend `stripSystemFields` removes them from payloads.

---

## Areas for Improvement

### Backend

| Issue | Severity | Detail |
|-------|----------|--------|
| Date fields stored as String | Medium | `date_of_birth`, `date_initial_peme`, `date_of_fitness`, `valid_until`, `follow_up_date`, `vision_date_taken` are all VARCHAR. Using `LocalDate` would enable date arithmetic, range queries, and proper DB indexing. |
| Minimal DTO validation | Medium | Only `seafarerProfileId` has `@NotNull`. Medical compliance data should validate critical fields (dates, fitness determinations) server-side. |
| N+1 risk on findAll | Medium | `findAll` loads exams, then `toDto` accesses `seafarerProfile` (LAZY). Without `@EntityGraph` or fetch join, each row triggers a separate profile query. |
| No unit/integration tests | High | Zero test files for the medical module. A medical compliance system needs thorough testing of create/update flows, validation, and event publishing. |
| Hardcoded physician options | Low | Physician names are only on the frontend (dropdown). Should be a lookup table or at minimum validated server-side. |

### Frontend

| Issue | Severity | Detail |
|-------|----------|--------|
| No dirty-state tracking | Medium | No unsaved-changes warning. Navigating away or clicking Cancel without "Are you sure?" discards work silently. |
| No loading indicators for search | Low | `searchLoading` is passed to `FormToolbar` but individual sections have no loading states for async operations. |
| Accessibility gaps in radio groups | Low | Most radio groups use `name` attribute for grouping but lack `role="radiogroup"` and `aria-label` (QuestionnaireGrid and LaboratoryResultsSection have them; others don't). |
| Hardcoded physician/director dropdowns | Low | Physician names in `TreatmentPlanSection` and `FitnessAssessmentSection` are hardcoded arrays. Should come from a backend lookup endpoint. |

### Architecture

| Issue | Severity | Detail |
|-------|----------|--------|
| Schema drift risk with JSONB | Medium | `findings_a/b/c`, `questionnaire`, `medical_history` structures are enforced only by frontend constants (FINDINGS_A, QUESTIONNAIRE_ITEMS, etc.). No server-side schema validation ensures consistency. |
| Personal info duplication | Info | Personal info (name, DOB, passport, etc.) is stored on both `seafarer_profiles` and `medical_exams`. The entity has these as denormalized fields AND a FK reference. This is intentional (snapshot at exam time) but worth documenting. |
| No API versioning | Info | Acceptable for internal app, but noted for completeness. |
| No unit/integration tests | High | Neither backend nor frontend modules have test coverage. |

**Severity Guide:**
- **High**: Affects reliability, data integrity, or is a significant gap
- **Medium**: Reduces type safety, validation coverage, or developer experience
- **Low**: Minor improvement that doesn't affect correctness
- **Info**: Design choice worth noting but not necessarily wrong

---

## Data Flow Summary

```
[User Action: Search Profile]
     │
     ▼
[FormToolbar] ──── onSearch ────► useProfileSearch (debounced 300ms)
     │                                   │
     │                                   ▼
     │                        api.entities.SeafarerProfile.search()
     │                                   │  HTTP GET /api/profiles?search=...
     │                                   ▼
     │                        Backend (SeafarerProfile module)
     │                                   │
     ▼                                   ▼
[handleSelectProfile] ◄──── onSelectResult ─── Results dropdown
     │
     │  Fills 14 personal info fields + captures seafarer_profile_id
     ▼
[useMedicalForm]
     │
     │ handleSave()
     ▼
[validate: seafarer_profile_id required → saveAlert if missing]
[validate: last_name + first_name required → toast if missing]
     │
     ▼
[stripSystemFields(data)]
     │
     ▼
[api.entities.MedicalExam.create/update]
     │  HTTP POST /api/medical-exams  (or PUT /api/medical-exams/{id})
     ▼
[MedicalExamController]
     │
     ▼
[MedicalExamService]
     │  1. resolveProfile(dto.seafarerProfileId)
     │  2. mapper.toEntity() / mapper.updateEntity()
     │  3. entity.setSeafarerProfile(profile)
     │  4. businessIdGenerator.generateId("MED")  [create only]
     │  5. repository.save()
     │  6. eventPublisher.publishEvent()
     ▼
[MedicalExamRepository → PostgreSQL]
     │
     ▼
[MedicalExamCreatedEvent / MedicalExamUpdatedEvent]
     │
     ▼
[AuditEventListener] → Audit log
     │
     ▼
[Response → flattenResponse() → setData() → view mode]
```

---

## Functional Coverage

| Feature                                    | Status     |
|-------------------------------------------|------------|
| Create medical exam (full-stack)          | Done       |
| Update medical exam (full-stack)          | Done       |
| List/paginate exams (backend)             | Done       |
| Search exams by name/ID (backend)         | Done       |
| List/paginate exams (frontend)            | Not implemented — no list view |
| Delete exam                               | Not implemented (intentional for compliance) |
| Link to Seafarer Profile                  | Done — UUID captured and resolved |
| Personal Info section                     | Done       |
| Physical Examination (vitals)             | Done       |
| Vision assessment                         | Done       |
| Audiometry & Speech                       | Done       |
| Condition Questions                       | Done       |
| Findings Grid (A/B/C)                     | Done       |
| Past Medical History (PEME style)         | Done       |
| Questionnaire (8 questions)               | Done       |
| Ancillary Examinations                    | Done       |
| Final Recommendation                      | Done       |
| Fitness Assessment + Dates/Certification  | Done       |
| Medical History (detailed) section        | Done       |
| Laboratory Results section                | Done       |
| Diagnosis section                         | Done       |
| Treatment Plan section                    | Done       |
| Remarks section                           | Done       |
| View/Edit mode toggle                     | Done — fieldset disabled + button guards |
| Edit button guard (no data = hidden)      | Done       |
| Save guard (no profile = blocked)         | Done — saveAlert shown |
| Print                                     | Done — window.print() |
| Domain events (audit)                     | Done       |
| Business ID generation                    | Done — server-side MED sequence |
| Form validation (frontend)                | Done — profile + name required |
| Backend integration                       | Done       |
| Unit/integration tests                    | **Not implemented** |

---

## Conclusion

The Medical Exam module is now a fully connected full-stack feature. The backend provides clean CRUD with profile resolution, domain events, keyword search, and business ID generation. The frontend calls the real API for all persistence, captures the seafarer profile UUID from search, enforces view/edit mode via `<fieldset disabled>`, and guards against invalid saves (Edit hidden when no record, Save blocked when no profile selected). All 19 section components are rendered and functional. The primary remaining gaps are automated tests and a frontend list/dashboard view for browsing existing exams.
