package com.centerport.config;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.interceptor.CacheOperationInvocationContext;
import org.springframework.cache.interceptor.CacheResolver;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

/**
 * Resolves the target {@link Cache} at runtime from the invoked service bean.
 *
 * The abstract base services ({@code AbstractProfileLinkedService},
 * {@code AbstractRepeatTestService}) share one set of caching annotations
 * across many concrete subclasses. A static {@code cacheNames} attribute can't
 * express "use this subclass's own cache", so those annotations delegate here.
 * This resolver reads {@link CacheNamed#getCacheName()} off the target bean and
 * resolves the matching cache from the {@link CacheManager}.
 *
 * @see CacheNamed
 */
@Component("entityCacheResolver")
public class EntityCacheResolver implements CacheResolver {

    private final CacheManager cacheManager;

    public EntityCacheResolver(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @Override
    @NonNull
    public Collection<? extends Cache> resolveCaches(
            @NonNull CacheOperationInvocationContext<?> context) {
        Object target = context.getTarget();
        if (!(target instanceof CacheNamed named)) {
            throw new IllegalStateException(
                    "entityCacheResolver applied to a bean that is not CacheNamed: "
                            + target.getClass().getName());
        }
        String cacheName = named.getCacheName();
        Cache cache = cacheManager.getCache(cacheName);
        if (cache == null) {
            throw new IllegalStateException("No cache registered for name: " + cacheName);
        }
        return List.of(cache);
    }
}
