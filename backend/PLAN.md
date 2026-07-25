# CenterPort Backend — Spring Boot Build Plan

Backend API to replace the frontend's localStorage mock (`frontend/src/lib/api.ts` +
`use-local-storage-form.ts`). Serves the Next.js 16 maritime seafarer medical-examination app.

---

## 1. Goal & Scope

The frontend currently persists everything client-side via a `base44`-style mock client and a
generic `useLocalStorageForm` hook. This plan defines a Spring Boot REST API that provides the same
CRUD contract, plus file upload, so the frontend can swap `localStorage` for real HTTP calls with
minimal UI changes.

**In scope (v1):** 5 domain entities, CRUD, sequential business IDs, file upload, validation, CORS.
**Deferred:** auth/login (no auth code exists in frontend yet), laboratory/seabase modules
(placeholders only), reporting/PDF generation.

---

## 2. Tech Stack

| Concern            | Choice                                             |
|--------------------|----------------------------------------------------|
| Language           | Java 21 (LTS)                                       |
| Framework          | Spring Boot 3.x (Web, Validation, Data JPA)         |
| Build              | Maven (or Gradle)                                   |
| DB                 | PostgreSQL (local dev, see §4.1), H2 in-memory (test)|
| Migrations         | Flyway                                               |
| Mapping            | MapStruct (entity <-> DTO)                           |
| Boilerplate        | Lombok                                               |
| Docs               | springdoc-openapi (Swagger UI)                       |
| Testing            | JUnit 5, Spring Boot Test, Testcontainers           |

---

## 3. Domain Model (mapped from frontend TypeScript)

Five aggregate entities. Every entity has: `id` (UUID PK), a sequential business ID, plus
`created_date` / `updated_date` ISO timestamps. All mirror existing TS interfaces exactly so the
frontend types line up.

| Entity            | TS source                              | Business ID | Prefix   |
|-------------------|----------------------------------------|-------------|----------|
| SeafarerProfile   | `src/lib/api.ts`                       | profile_id  | `CMSI`   |
| MedicalExam       | `src/components/medical/types.ts`      | exam_id     | `MED`    |
| LandbasePeme      | `src/components/landbase/types.ts`     | peme_id     | (define) |
| MlcRecord         | `src/components/mlc/types.ts`          | mlc_id      | (define) |
| PanamaCertificate | `src/components/panama/types.ts`       | panama_id   | (define) |

### Design notes per entity

- **SeafarerProfile** — flat: personal info, employment, family, education, previous work.
  All string fields (frontend stores everything as string). Root "person" reference for the others.
- **MedicalExam** — largest (~150 fields). Contains several `Record<string, ...>` maps:
  `findings_a/b/c` (`Map<String,Boolean>`), `questionnaire` and `medical_history`
  (`Map<String,String>`). Persist maps as JSONB columns (or child tables — see §4).
- **LandbasePeme** — PEME form. `medical_history` = `Map<String,String>` (yes/no/empty). Rich enums.
- **MlcRecord** — MLC 2006 health cert. `visual_aids` = `List<String>`. Enum-heavy.
- **PanamaCertificate** — Panama registry. Nested value objects:
  `LabTestResult { normal, abnormal, observations }`,
  `OtherLabTestResult { checked, normal, abnormal, observations }`,
  plus `conditions` (`Map<String,YesNo>`), `physical_exploration` (`Map<String,String>` = N/A/empty),
  `lab_tests` (`Map<String,LabTestResult>`), `lab_other_tests` (`Map<String,OtherLabTestResult>`).

### Enums
Frontend uses string-literal unions (Gender, CivilStatus, BloodType, ExamResult, ReactiveResult,
RecommendationValue, FitnessDetermination, CertificateType, YesNo, etc.). Model as Java enums, but
**serialize using the exact frontend string values** (`@JsonValue`) — e.g. `"Fit for Employment"`,
`"non_reactive"`, `"A+"`. Empty-string `""` option maps to `null`.

---

## 4. Persistence Strategy

Two viable approaches for the many `Record<string,...>` maps and nested value objects:

**Option A (recommended for v1): JSONB columns.**
Store dynamic maps and nested VOs as PostgreSQL `jsonb` (via Hibernate `@JdbcTypeCode(SqlTypes.JSON)`).
Fast to build, matches the frontend's loose/flexible shape, no rigid child schema.

**Option B: normalized child tables.**
Break maps into rows (e.g. `medical_exam_findings(exam_id, key, value)`). More queryable/reportable,
more code. Choose later if reporting needs it.

Start with **Option A**. Scalar fields become real columns; dynamic maps/VOs become JSONB.

### 4.1 Local Dev DB Connection

Local PostgreSQL:

| Setting  | Value                                |
|----------|--------------------------------------|
| JDBC URL | `jdbc:postgresql://localhost:5432/`  |
| Username | `postgres`                           |
| Password | `root`                               |

The JDBC URL needs a database name appended — create/use a `centerport` DB, i.e.
`jdbc:postgresql://localhost:5432/centerport`.

`application-dev.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/centerport
    username: postgres
    password: root
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate   # Flyway owns the schema
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  flyway:
    enabled: true
```

Create DB once: `createdb -U postgres centerport` (or via psql `CREATE DATABASE centerport;`).

> **Security note:** these are local dev creds only. Do NOT commit real/prod passwords. For anything
> beyond localhost, move username/password to env vars (`${DB_USER}` / `${DB_PASSWORD}`) and keep the
> resolved values out of version control.

---

## 5. Project Structure

```
backend/
  pom.xml
  src/main/java/com/centerport/
    CenterportApplication.java
    common/            # base entity, ID generator, exceptions, error handler
    config/            # CORS, OpenAPI, Jackson
    profile/           # entity, repository, service, controller, dto, mapper
    medical/
    landbase/
    mlc/
    panama/
    upload/            # file upload controller + storage service
  src/main/resources/
    application.yml
    application-dev.yml
    db/migration/      # Flyway V1__init.sql ...
```

Package-by-feature (one package per domain) to match the frontend's per-module layout.

---

## 6. REST API Contract

Mirror the mock client so frontend changes stay small. Base path `/api`.

Per entity (example: profiles):

| Method | Path                     | Maps to mock call            |
|--------|--------------------------|------------------------------|
| GET    | `/api/profiles`          | `list("-created_date", n)`   |
| GET    | `/api/profiles/{id}`     | `filter({ id })`             |
| POST   | `/api/profiles`          | `create(data)`               |
| PUT    | `/api/profiles/{id}`     | `update(id, data)`           |
| DELETE | `/api/profiles/{id}`     | (new — not in mock)          |

Repeat for `/api/medical-exams`, `/api/landbase-pemes`, `/api/mlc-records`, `/api/panama-certificates`.

**List:** support `?sort=-created_date&limit=n` to match `list(orderBy, limit)` semantics.
**Server rules:** server generates `id` (UUID), sequential business ID, and timestamps — ignore
client-sent values for those. `updated_date` refreshed on every PUT.

### File upload
`POST /api/files` (multipart `file`) → `{ "file_url": "..." }`, matching
`base44.integrations.Core.UploadFile`. v1: save to disk/local dir and return served URL. Used by the
profile photo (`photo_url`). Later: swap to S3 without changing the response shape.

---

## 7. Sequential Business ID Generation

Frontend logic: find max numeric suffix, increment, zero-pad to 8 digits, prefix.
E.g. `CMSI00000001`, `MED00000001`.
Server-side: generate inside the create transaction. Use a per-entity DB sequence or a
`SELECT max(...)` guarded by the transaction to avoid duplicates under concurrency (sequence
preferred). Keep the exact prefix + 8-digit zero-pad format.

---

## 8. Cross-Cutting Concerns

- **CORS** — allow the Next.js dev origin (`http://localhost:3000`) and the deployed frontend origin.
- **Validation** — `@Valid` DTOs; `last_name` required (matches frontend `validate`). Return 400 with
  a structured error body.
- **Error handling** — `@RestControllerAdvice` → consistent JSON `{ timestamp, status, error, message }`.
  404 for missing records (mock threw `"Profile not found"`).
- **JSON naming** — frontend uses `snake_case` field names. Configure Jackson
  `PropertyNamingStrategy.SNAKE_CASE` (or `@JsonProperty`) so DTOs serialize to match TS interfaces.
- **Timestamps** — ISO-8601 strings (`Instant`/`OffsetDateTime`) to match `new Date().toISOString()`.
- **Logging** — structured request logging with a request ID.

---

## 9. Frontend Integration

- Replace `src/lib/api.ts` mock with a thin `fetch` client hitting `/api/*`; keep the same
  method names (`filter`, `list`, `create`, `update`) so callers/hooks stay unchanged.
- `useLocalStorageForm` → generalize to call the HTTP client (business ID + timestamps now come from
  server; drop client-side `generateNextId`).
- Add `NEXT_PUBLIC_API_BASE_URL` env var.
- Keep TS interfaces as the single source of truth for field names — DTOs must match them 1:1.

---

## 10. Build Phases

1. **Scaffold** — Spring Initializr (Web, JPA, Validation, Flyway, Lombok, PostgreSQL, springdoc).
   CORS + OpenAPI + snake_case Jackson config. `common` base entity + ID generator + error handler.
2. **Profile vertical slice** — SeafarerProfile end-to-end (entity, repo, service, controller, DTO,
   mapper, Flyway migration, tests). Proves the pattern + ID generation + timestamps.
3. **File upload** — `/api/files` local-disk storage; wire profile photo.
4. **Remaining entities** — MedicalExam, LandbasePeme, MlcRecord, PanamaCertificate (JSONB for maps/VOs),
   one slice at a time, reusing the profile pattern.
5. **Frontend swap** — replace mock client, generalize the form hook, point at the API.
6. **Harden** — integration tests (Testcontainers), pagination/sort, seed data, dockerize, CI.

---

## 11. Open Questions

- Business ID prefixes for Landbase / MLC / Panama? (Profile=`CMSI`, Medical=`MED` known; others TBD.)
- Auth required for v1? No frontend auth today; `created_by` field exists but unused. Add JWT later.
- JSONB (Option A) vs normalized child tables (Option B) — confirm reporting needs.
- Should DELETE be exposed? Mock had no delete. Add for admin/cleanup?
- Single DB shared with any existing `frontend` data, or greenfield?
