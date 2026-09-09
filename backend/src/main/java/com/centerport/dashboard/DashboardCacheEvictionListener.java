package com.centerport.dashboard;

import com.centerport.common.event.DomainEvent;
import com.centerport.config.RedisCacheConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Invalidates the cached dashboard statistics whenever a domain change occurs.
 *
 * {@link DashboardService#getStats()} caches aggregated counts pulled from
 * several modules (profiles, medical exams, landbase PEMEs, MLC records,
 * Panama certificates). Those write operations happen in other services and
 * cannot evict {@code dashboardStats} directly. Instead, every domain write
 * publishes a {@link DomainEvent}; this listener reacts to any such event and
 * clears the dashboard cache so the next request recomputes fresh totals.
 *
 * Timing:
 * Uses {@link TransactionPhase#AFTER_COMMIT} so the cache is only evicted once
 * the originating transaction has actually persisted. If the write rolls back,
 * no eviction happens and the cached value stays valid.
 *
 * @see DashboardService
 * @see DomainEvent
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DashboardCacheEvictionListener {

    private final CacheManager cacheManager;

    /**
     * Clears the {@code dashboardStats} cache after any domain event commits.
     *
     * @param event the committed domain event (type is irrelevant — any write
     *              can change a dashboard count)
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDomainEvent(DomainEvent event) {
        var cache = cacheManager.getCache(RedisCacheConfig.DASHBOARD_STATS_CACHE);
        if (cache != null) {
            cache.clear();
            log.debug("Evicted dashboardStats cache after {}", event.getEventType());
        }
    }
}
