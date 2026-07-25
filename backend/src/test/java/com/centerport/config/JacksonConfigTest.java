package com.centerport.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class JacksonConfigTest {

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new JacksonConfig().objectMapper();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class SamplePojo {
        private String firstName;
        private String lastName;
        private LocalDateTime createdDate;
        private int recordCount;
    }

    @Test
    void shouldSerializeCamelCaseFieldsAsSnakeCase() throws Exception {
        SamplePojo pojo = new SamplePojo("John", "Doe", null, 5);

        String json = objectMapper.writeValueAsString(pojo);

        assertThat(json).contains("\"first_name\"");
        assertThat(json).contains("\"last_name\"");
        assertThat(json).contains("\"record_count\"");
        assertThat(json).doesNotContain("firstName");
        assertThat(json).doesNotContain("lastName");
        assertThat(json).doesNotContain("recordCount");
    }

    @Test
    void shouldSerializeLocalDateTimeAsIso8601String() throws Exception {
        LocalDateTime dateTime = LocalDateTime.of(2024, 1, 15, 10, 30, 0);
        SamplePojo pojo = new SamplePojo("John", "Doe", dateTime, 1);

        String json = objectMapper.writeValueAsString(pojo);

        assertThat(json).contains("\"2024-01-15T10:30:00\"");
        assertThat(json).doesNotContain("\"created_date\":[");
        assertThat(json).doesNotContain("\"created_date\":1");
    }

    @Test
    void shouldDeserializeFromSnakeCaseJson() throws Exception {
        String json = """
                {
                    "first_name": "Jane",
                    "last_name": "Smith",
                    "created_date": "2024-06-20T14:45:30",
                    "record_count": 3
                }
                """;

        SamplePojo pojo = objectMapper.readValue(json, SamplePojo.class);

        assertThat(pojo.getFirstName()).isEqualTo("Jane");
        assertThat(pojo.getLastName()).isEqualTo("Smith");
        assertThat(pojo.getCreatedDate()).isEqualTo(LocalDateTime.of(2024, 6, 20, 14, 45, 30));
        assertThat(pojo.getRecordCount()).isEqualTo(3);
    }

    @Test
    void shouldNotFailOnUnknownProperties() throws Exception {
        String json = """
                {
                    "first_name": "John",
                    "last_name": "Doe",
                    "record_count": 1,
                    "unknown_field": "ignored"
                }
                """;

        SamplePojo pojo = objectMapper.readValue(json, SamplePojo.class);

        assertThat(pojo.getFirstName()).isEqualTo("John");
        assertThat(pojo.getLastName()).isEqualTo("Doe");
    }
}
