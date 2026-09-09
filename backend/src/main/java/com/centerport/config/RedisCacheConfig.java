package com.centerport.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.databind.jsontype.PolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.CacheErrorHandler;
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
 * {@link ObjectMapper} (separate from the web {@link JacksonConfig} mapper) with
 * default typing activated so an {@code @class} hint is embedded and cached
 * objects can be deserialized back into their concrete types. {@link JavaTimeModule}
 * is registered so {@code java.time} values round-trip correctly.
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
@Slf4j
@Configuration
@EnableCaching
public class RedisCacheConfig implements CachingConfigurer {

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
     * Unlike the web mapper, this one is handed to
     * {@link GenericJackson2JsonRedisSerializer} so that arbitrary cached objects
     * (DTOs, collections, maps) can be reconstructed to their concrete types on
     * read. {@link JavaTimeModule} is registered so {@code java.time} values
     * round-trip correctly.
     *
     * @return configured mapper for cache serialization
     */
    private ObjectMapper cacheObjectMapper() {
        // Restrict polymorphic deserialization to application and JDK value types
        // as a guard against unsafe payloads. This validator is consulted by the
        // default-typing resolver activated below.
        PolymorphicTypeValidator ptv = BasicPolymorphicTypeValidator.builder()
                .allowIfSubType("com.centerport.")
                .allowIfSubType("java.util.")
                .allowIfSubType("java.time.")
                .build();

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        mapper.setPolymorphicTypeValidator(ptv);

        // Default typing MUST be activated explicitly here.
        //
        // GenericJackson2JsonRedisSerializer only auto-installs its own "@class"
        // type resolver when it constructs its OWN internal ObjectMapper (its
        // no-arg constructor). When a custom ObjectMapper is supplied to the
        // constructor — as we do below, to register JavaTimeModule — that
        // auto-configuration is bypassed and NO type metadata is written.
        //
        // Without type metadata, cached values are read back as LinkedHashMap /
        // ArrayList instead of their concrete types, and the @Cacheable proxy
        // throws ClassCastException on the first cache hit (e.g. DashboardStatsDto,
        // PagedResponse, List<D>).
        //
        // Use DefaultTyping.EVERYTHING, NOT NON_FINAL. findByProfileId caches a
        // top-level List, and List.of(...) / List.copyOf(...) return FINAL
        // immutable list classes. Under NON_FINAL, Jackson skips writing type info
        // for a final root collection (producing a bare "[ {..}, {..} ]"), but the
        // read side deserializes into Object, expects the wrapper-array form
        // ["java.util.ArrayList", [...]], and fails with:
        //   "Unexpected token (START_OBJECT), expected VALUE_STRING ... type id".
        // EVERYTHING forces type info on those final collections too, keeping the
        // write and read formats symmetric. Natural scalar types (String, Boolean,
        // numbers) are still excluded. The PolymorphicTypeValidator above bounds
        // which types may be instantiated on read.
        mapper.activateDefaultTyping(ptv, ObjectMapper.DefaultTyping.EVERYTHING,
                JsonTypeInfo.As.PROPERTY);

        return mapper;
    }

    /**
     * Makes the cache non-fatal and self-healing.
     *
     * By default Spring's {@code RedisCache} rethrows any error from a cache
     * operation, so a single unreadable entry (e.g. one written under a previous
     * serialization format, or a corrupt payload) turns every request that touches
     * that key into a 500 until the entry's TTL expires.
     *
     * This handler downgrades cache failures to non-fatal:
     * <ul>
     *   <li>GET errors — evict the offending key and treat the lookup as a miss,
     *       so the underlying method runs and repopulates the entry in the current
     *       format.</li>
     *   <li>PUT / EVICT / CLEAR errors — log and swallow; a caching problem must
     *       never fail a business operation whose data change already succeeded.</li>
     * </ul>
     *
     * @return a resilient {@link CacheErrorHandler}
     */
    @Override
    public CacheErrorHandler errorHandler() {
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException exception, Cache cache, Object key) {
                log.warn("Cache GET failed [{}::{}] — evicting and treating as miss: {}",
                        cache.getName(), key, exception.getMessage());
                try {
                    cache.evict(key);
                } catch (RuntimeException evictError) {
                    log.warn("Failed to evict bad cache entry [{}::{}]: {}",
                            cache.getName(), key, evictError.getMessage());
                }
                // Swallow: a null return makes Spring treat this as a cache miss.
            }

            @Override
            public void handleCachePutError(RuntimeException exception, Cache cache, Object key, Object value) {
                log.warn("Cache PUT failed [{}::{}] — value not cached: {}",
                        cache.getName(), key, exception.getMessage());
            }

            @Override
            public void handleCacheEvictError(RuntimeException exception, Cache cache, Object key) {
                log.warn("Cache EVICT failed [{}::{}]: {}",
                        cache.getName(), key, exception.getMessage());
            }

            @Override
            public void handleCacheClearError(RuntimeException exception, Cache cache) {
                log.warn("Cache CLEAR failed [{}]: {}", cache.getName(), exception.getMessage());
            }
        };
    }
}
