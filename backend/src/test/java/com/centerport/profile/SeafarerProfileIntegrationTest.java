package com.centerport.profile;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration test using Testcontainers PostgreSQL.
 * Performs a full CRUD round-trip verifying business-ID format, timestamps, and field persistence.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ActiveProfiles("test")
class SeafarerProfileIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private TestRestTemplate restTemplate;

    private static String createdId;
    private static String createdProfileId;
    private static String createdDate;

    @Test
    @Order(1)
    void createProfile_returns201WithBusinessId() {
        Map<String, Object> request = Map.of(
                "last_name", "Dela Cruz",
                "first_name", "Juan",
                "middle_name", "Santos",
                "city", "Manila",
                "contact_no", "09171234567"
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/profiles", request, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        Map body = response.getBody();
        assertThat(body).isNotNull();

        // Verify server-generated fields
        assertThat(body.get("id")).isNotNull();
        assertThat(body.get("profile_id")).isNotNull();
        assertThat(body.get("created_date")).isNotNull();
        assertThat(body.get("updated_date")).isNotNull();

        // Verify business-ID format: CMSI + 8 digits
        String profileId = (String) body.get("profile_id");
        assertThat(profileId).matches("CMSI\\d{8}");
        assertThat(profileId).isEqualTo("CMSI00000001");

        // Verify data fields
        assertThat(body.get("last_name")).isEqualTo("Dela Cruz");
        assertThat(body.get("first_name")).isEqualTo("Juan");

        // Store for subsequent tests
        createdId = (String) body.get("id");
        createdProfileId = profileId;
        createdDate = (String) body.get("created_date");
    }

    @Test
    @Order(2)
    void getById_returnsCreatedProfile() {
        ResponseEntity<Map> response = restTemplate.getForEntity(
                "/api/profiles/{id}", Map.class, createdId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Map body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("id")).isEqualTo(createdId);
        assertThat(body.get("profile_id")).isEqualTo(createdProfileId);
        assertThat(body.get("last_name")).isEqualTo("Dela Cruz");
        assertThat(body.get("first_name")).isEqualTo("Juan");
        assertThat(body.get("created_date")).isEqualTo(createdDate);
    }

    @Test
    @Order(3)
    void listProfiles_returnsArrayWithCreatedProfile() {
        ResponseEntity<List> response = restTemplate.getForEntity(
                "/api/profiles", List.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSizeGreaterThanOrEqualTo(1);
    }

    @Test
    @Order(4)
    void updateProfile_preservesSystemFields() throws InterruptedException {
        // Small delay to ensure updated_date changes
        Thread.sleep(50);

        Map<String, Object> updateRequest = Map.of(
                "last_name", "Garcia",
                "first_name", "Maria",
                "middle_name", "Santos",
                "city", "Cebu",
                "contact_no", "09181234567"
        );

        ResponseEntity<Map> response = restTemplate.exchange(
                "/api/profiles/{id}", HttpMethod.PUT,
                new HttpEntity<>(updateRequest), Map.class, createdId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Map body = response.getBody();
        assertThat(body).isNotNull();

        // Verify mutable fields are updated
        assertThat(body.get("last_name")).isEqualTo("Garcia");
        assertThat(body.get("first_name")).isEqualTo("Maria");
        assertThat(body.get("city")).isEqualTo("Cebu");

        // Verify system fields are preserved
        assertThat(body.get("id")).isEqualTo(createdId);
        assertThat(body.get("profile_id")).isEqualTo(createdProfileId);
        assertThat(body.get("created_date")).isEqualTo(createdDate);

        // Verify updated_date is refreshed
        assertThat(body.get("updated_date")).isNotNull();
        assertThat(body.get("updated_date")).isNotEqualTo(createdDate);
    }

    @Test
    @Order(5)
    void getById_afterUpdate_reflectsChanges() {
        ResponseEntity<Map> response = restTemplate.getForEntity(
                "/api/profiles/{id}", Map.class, createdId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        Map body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("last_name")).isEqualTo("Garcia");
        assertThat(body.get("first_name")).isEqualTo("Maria");
        assertThat(body.get("profile_id")).isEqualTo(createdProfileId);
    }

    @Test
    @Order(6)
    void getById_nonExistent_returns404() {
        ResponseEntity<Map> response = restTemplate.getForEntity(
                "/api/profiles/{id}", Map.class, "00000000-0000-0000-0000-000000000000");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        Map body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("status")).isEqualTo(404);
    }

    @Test
    @Order(7)
    void createProfile_secondProfile_getsNextBusinessId() {
        Map<String, Object> request = Map.of(
                "last_name", "Santos",
                "first_name", "Pedro"
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/profiles", request, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        Map body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("profile_id")).isEqualTo("CMSI00000002");
    }

    @Test
    @Order(8)
    void createProfile_missingLastName_returns400() {
        Map<String, Object> request = Map.of(
                "first_name", "Invalid"
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/profiles", request, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @Order(9)
    void createProfile_clientSuppliedSystemFieldsAreIgnored() {
        Map<String, Object> request = Map.of(
                "id", "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
                "profile_id", "FAKE12345678",
                "created_date", "2000-01-01T00:00:00",
                "updated_date", "2000-01-01T00:00:00",
                "last_name", "TestIgnore",
                "first_name", "System"
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/profiles", request, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        Map body = response.getBody();
        assertThat(body).isNotNull();

        // Server should ignore client-supplied id
        assertThat(body.get("id")).isNotEqualTo("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");

        // Server should ignore client-supplied profile_id and generate its own
        String profileId = (String) body.get("profile_id");
        assertThat(profileId).isNotEqualTo("FAKE12345678");
        assertThat(profileId).startsWith("CMSI");
        assertThat(profileId).hasSize(12); // CMSI (4) + 8 digits = 12 chars total

        // Server should ignore client-supplied timestamps
        assertThat(body.get("created_date")).isNotEqualTo("2000-01-01T00:00:00");
        assertThat(body.get("updated_date")).isNotEqualTo("2000-01-01T00:00:00");

        // Verify data fields are still persisted
        assertThat(body.get("last_name")).isEqualTo("TestIgnore");
        assertThat(body.get("first_name")).isEqualTo("System");
    }
}
