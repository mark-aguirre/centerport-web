package com.centerport.common;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import com.centerport.common.util.BusinessIdGenerator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("BusinessIdGenerator")
class BusinessIdGeneratorTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    private BusinessIdGenerator generator;

    @BeforeEach
    void setUp() {
        generator = new BusinessIdGenerator(jdbcTemplate);
    }

    @Test
    @DisplayName("generates first value as PREFIX + 00000001")
    void generateId_firstValue_returnsOne() {
        when(jdbcTemplate.queryForObject("SELECT nextval('cmsi_seq')", Long.class))
                .thenReturn(1L);

        String result = generator.generateId("CMSI");

        assertThat(result).isEqualTo("CMSI00000001");
    }

    @Test
    @DisplayName("formats result with 8 zero-padded digits")
    void generateId_format_eightDigitsZeroPadded() {
        when(jdbcTemplate.queryForObject("SELECT nextval('med_seq')", Long.class))
                .thenReturn(42L);

        String result = generator.generateId("MED");

        assertThat(result).isEqualTo("MED00000042");
    }

    @Test
    @DisplayName("increments correctly on subsequent calls")
    void generateId_increment_returnsSequentialValues() {
        when(jdbcTemplate.queryForObject("SELECT nextval('cmsi_seq')", Long.class))
                .thenReturn(1L, 2L, 3L);

        String first = generator.generateId("CMSI");
        String second = generator.generateId("CMSI");
        String third = generator.generateId("CMSI");

        assertThat(first).isEqualTo("CMSI00000001");
        assertThat(second).isEqualTo("CMSI00000002");
        assertThat(third).isEqualTo("CMSI00000003");
    }

    @Test
    @DisplayName("normalizes prefix to uppercase in output")
    void generateId_lowercasePrefix_outputIsUppercase() {
        when(jdbcTemplate.queryForObject("SELECT nextval('med_seq')", Long.class))
                .thenReturn(5L);

        String result = generator.generateId("med");

        assertThat(result).isEqualTo("MED00000005");
    }

    @Test
    @DisplayName("uses lowercase prefix for sequence name")
    void generateId_uppercasePrefix_usesLowercaseSequenceName() {
        when(jdbcTemplate.queryForObject("SELECT nextval('cmsi_seq')", Long.class))
                .thenReturn(100L);

        String result = generator.generateId("CMSI");

        assertThat(result).isEqualTo("CMSI00000100");
    }

    @Test
    @DisplayName("handles large sequence values without truncation")
    void generateId_largeValue_noTruncation() {
        when(jdbcTemplate.queryForObject("SELECT nextval('med_seq')", Long.class))
                .thenReturn(99999999L);

        String result = generator.generateId("MED");

        assertThat(result).isEqualTo("MED99999999");
    }
}
