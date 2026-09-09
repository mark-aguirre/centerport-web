package com.centerport.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.databind.jsontype.PolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.cache.RedisCacheManagerBuilderCustomizer;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * Enables Spring's caching abstraction backed by Redis and defines how cache
 * entries are serialized and how long they live.
 *
 * Serialization:
 * Keys are stored as plain strings; values are stored as JSON via
 * {@link GenericJackson2JsonRedisSerializer}. The serializer uses a dedicated
 * {@link ObjectMapper} (separate from the web {@link JacksonConfig} mapper)
 * that embeds type information so cached objects can be deserialized back into
 * their concrete types. {@link JavaTimeModule} is registered so
 * {@code java.time} values round-trip correctly.
 *
 * TTLs:
 * A conservative 10-minute default applies to every cache. Named caches with
 * different freshness needs are given explicit TTLs via the builder customizer.
 *
 * Cache names:
 * <ul>
 *   <li>{@code dashboardStats} — aggregated dashboard counts, refreshed every 5 minutes</li>
 * </ul>
 *
 * @see com.centerport.dashboard.DashboardService
 */
@Configuration
@EnableCaching
public class RedisCacheConfig {

    /** Cache name for aggregated dashboard statistics. */
    public static final String DASHBOARD_STATS_CACHE = "dashboardStats";

    // ----- Profile-linked module caches (single item keyed by UUID) -----
    public static final String LAB_REPORT_CACHE = "labReport";
    public static final String MEDICAL_EXAM_CACHE = "medicalExam";
    public static final String LANDBASE_PEME_CACHE = "landbasePeme";
    public static final String MLC_RECORD_CACHE = "mlcRecord";
    public static final String PANAMA_CERT_CACHE = "panamaCert";
    public static final String PSYCH_EVAL_CACHE = "psychEval";
    public static final String SEAFARER_PROFILE_CACHE = "seafarerProfile";
    public static final String MEDICAL_PERSONNEL_CACHE = "medicalPersonnel";
    public static final String PATIENT_VISIT_CACHE = "patientVisit";

    // ----- Repeat-test module caches -----
    public static final String HEMA_REPEAT_CACHE = "hematologyRepeatTest";
    public static final String CHEM_REPEAT_CACHE = "chemistryRepeatTest";
    public static final String URIN_REPEAT_CACHE = "urinalysisRepeatTest";
    public static final String FECA_REPEAT_CACHE = "fecalysisRepeatTest";

    /**
     * All domain cache names, used to apply the shared per-entity TTL in one place.
     * Each entity uses a single logical cache; list/paginated/single-item entries
     * are namespaced by distinct keys within that cache (see the services).
     */
    private static final String[] DOMAIN_CACHES = {
            LAB_REPORT_CACHE, MEDICAL_EXAM_CACHE, LANDBASE_PEME_CACHE,
            MLC_RECORD_CACHE, PANAMA_CERT_CACHE, PSYCH_EVAL_CACHE,
            SEAFARER_PROFILE_CACHE, MEDICAL_PERSONNEL_CACHE, PATIENT_VISIT_CACHE,
            HEMA_REPEAT_CACHE, CHEM_REPEAT_CACHE, URIN_REPEAT_CACHE, FECA_REPEAT_CACHE
    };

    private static final Duration DEFAULT_TTL = Duration.ofMinutes(10);
    private static final Duration DASHBOARD_STATS_TTL = Duration.ofMinutes(5);
    private static final Duration DOMAIN_TTL = Duration.ofMinutes(15);

    /**
     * Base cache configuration applied to all caches: string keys, JSON values,
     * no caching of nulls, and a default TTL.
     *
     * @return the default {@link RedisCacheConfiguration}
     */
    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        GenericJackson2JsonRedisSerializer valueSerializer =
                new GenericJackson2JsonRedisSerializer(cacheObjectMapper());

        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(DEFAULT_TTL)
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(valueSerializer));
    }

    /**
     * Registers per-cache TTL overrides for caches that need a freshness policy
     * different from the default.
     *
     * @return customizer applying named-cache TTLs
     */
    @Bean
    public RedisCacheManagerBuilderCustomizer redisCacheManagerBuilderCustomizer() {
        return builder -> {
            builder.withCacheConfiguration(DASHBOARD_STATS_CACHE,
                    cacheConfiguration().entryTtl(DASHBOARD_STATS_TTL));
            for (String cache : DOMAIN_CACHES) {
                builder.withCacheConfiguration(cache,
                        cacheConfiguration().entryTtl(DOMAIN_TTL));
            }
        };
    }

    /**
     * Dedicated {@link ObjectMapper} for cache value serialization.
     *
     * Unlike the web mapper, this one embeds polymorphic type metadata so that
     * arbitrary cached objects (DTOs, collections) can be reconstructed to their
     * concrete types on read. A restrictive {@link PolymorphicTypeValidator}
     * limits deserialization to application and JDK types to guard against
     * unsafe polymorphic payloads.
     *
     * @return configured mapper for cache serialization
     */
    private ObjectMapper cacheObjectMapper() {
        PolymorphicTypeValidator ptv = BasicPolymorphicTypeValidator.builder()
                .allowIfSubType("com.centerport.")
                .allowIfSubType("java.util.")
                .allowIfSubType("java.time.")
                .build();

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        mapper.activateDefaultTyping(ptv, ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY);
        return mapper;
    }
}
