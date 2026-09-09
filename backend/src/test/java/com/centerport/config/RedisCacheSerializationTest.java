package com.centerport.config;

import com.centerport.common.dto.PagedResponse;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.databind.jsontype.PolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Verifies that cache values round-trip through the exact serializer setup used
 * in {@link RedisCacheConfig}: a custom ObjectMapper (with JavaTimeModule) that
 * must have default typing activated so an {@code @class} hint is embedded.
 *
 * This reproduces the read paths that were failing at runtime:
 *  - a single DTO (findById)
 *  - a top-level List of DTOs (findByProfileId)  <-- the wrapper-array case
 *  - a PagedResponse (findAll)
 *  - java.time values inside DTOs
 */
class RedisCacheSerializationTest {

    /** Mirror of RedisCacheConfig.cacheObjectMapper(). */
    private static GenericJackson2JsonRedisSerializer serializer() {
        PolymorphicTypeValidator ptv = BasicPolymorphicTypeValidator.builder()
                .allowIfSubType("com.centerport.")
                .allowIfSubType("java.util.")
                .allowIfSubType("java.time.")
                .build();

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        mapper.setPolymorphicTypeValidator(ptv);
        mapper.activateDefaultTyping(ptv, ObjectMapper.DefaultTyping.EVERYTHING,
                JsonTypeInfo.As.PROPERTY);

        return new GenericJackson2JsonRedisSerializer(mapper);
    }

    /** Minimal DTO-like type living under com.centerport with a java.time field. */
    public static class SampleDto {
        public String name;
        public LocalDate examDate;

        public SampleDto() {
        }

        public SampleDto(String name, LocalDate examDate) {
            this.name = name;
            this.examDate = examDate;
        }
    }

    @Test
    void singleObjectRoundTrips() {
        GenericJackson2JsonRedisSerializer s = serializer();
        SampleDto original = new SampleDto("alpha", LocalDate.of(2026, 1, 15));

        byte[] bytes = s.serialize(original);
        Object read = s.deserialize(bytes);

        SampleDto result = assertInstanceOf(SampleDto.class, read);
        assertEquals("alpha", result.name);
        assertEquals(LocalDate.of(2026, 1, 15), result.examDate);
    }

    @Test
    void topLevelListRoundTrips() {
        // This is the findByProfileId case that threw
        // "Unexpected token (START_OBJECT), expected VALUE_STRING ... type id".
        GenericJackson2JsonRedisSerializer s = serializer();
        List<SampleDto> original = List.of(
                new SampleDto("a", LocalDate.of(2026, 2, 1)),
                new SampleDto("b", LocalDate.of(2026, 3, 2)));

        byte[] bytes = s.serialize(original);
        Object read = s.deserialize(bytes);

        List<?> result = assertInstanceOf(List.class, read);
        assertEquals(2, result.size());
        SampleDto first = assertInstanceOf(SampleDto.class, result.get(0));
        assertEquals("a", first.name);
        assertEquals(LocalDate.of(2026, 2, 1), first.examDate);
    }

    @Test
    void pagedResponseRoundTrips() {
        GenericJackson2JsonRedisSerializer s = serializer();
        PagedResponse<SampleDto> original = PagedResponse.<SampleDto>builder()
                .content(List.of(new SampleDto("x", LocalDate.of(2026, 4, 4))))
                .page(0).size(20).totalElements(1).totalPages(1)
                .first(true).last(true).hasNext(false).hasPrevious(false)
                .build();

        byte[] bytes = s.serialize(original);
        Object read = s.deserialize(bytes);

        PagedResponse<?> result = assertInstanceOf(PagedResponse.class, read);
        assertEquals(1, result.getTotalElements());
        assertNotNull(result.getContent());
        assertEquals(1, result.getContent().size());
        assertInstanceOf(SampleDto.class, result.getContent().get(0));
    }
}
