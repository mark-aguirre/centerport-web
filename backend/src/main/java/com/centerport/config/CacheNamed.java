package com.centerport.config;

/**
 * Implemented by services whose Redis cache name is determined at runtime from
 * the concrete bean rather than a static annotation attribute.
 *
 * The shared abstract base services annotate their read/write methods with
 * {@code cacheResolver = "entityCacheResolver"}; that resolver calls
 * {@link #getCacheName()} on the target bean to select the correct cache. This
 * lets one set of annotations on a base class route to a different cache per
 * concrete subclass (e.g. {@code labReport} vs {@code medicalExam}).
 *
 * @see EntityCacheResolver
 */
public interface CacheNamed {

    /**
     * @return the Redis cache name for this service's entity type
     */
    String getCacheName();
}
