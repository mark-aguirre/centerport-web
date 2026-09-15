package com.centerport.profile;

import com.centerport.config.RedisCacheConfig;
import com.centerport.profile.event.SeafarerProfileUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Invalidates profile-linked module caches when a seafarer profile changes.
 *
 * Every profile-linked module (laboratory, medical, landbase, MLC, Panama,
 * psychology, patient visit) caches its read results as fully-serialized DTOs
 * that embed a <em>snapshot</em> of the seafarer profile (name, employer,
 * position, address, etc.) taken at cache-write time. Those caches live under
 * the individual module cache names, and {@link SeafarerProfileService#update}
 * only evicts the {@code seafarerProfile} cache — it has no way to reach the
 * embedded snapshots held in the other module caches.
 *
 * Without this listener, editing a profile field (e.g. address) leaves the
 * stale snapshot in each module cache until its 15-minute TTL expires, so a
 * report generated in that window shows the old value even though the database
 * is correct.
 *
 * This listener reacts to {@link SeafarerProfileUpdatedEvent} and clears every
 * cache whose entries embed a profile snapshot, forcing the next read to
 * re-map from the freshly persisted profile.
 *
 * Timing:
 * Uses {@link TransactionPhase#AFTER_COMMIT} so eviction happens only once the
 * profile update has actually committed. If the update rolls back, the caches
 * are left intact.
 *
 * @see SeafarerProfileService
 * @see SeafarerProfileUpdatedEvent
 * @see com.centerport.dashboard.DashboardCacheEvictionListener
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ProfileLinkedCacheEvictionListener {

    /** Module caches whose cached DTOs embed a copy of the seafarer profile. */
    private static final String[] PROFILE_LINKED_CACHES = {
            RedisCacheConfig.LAB_REPORT_CACHE,
            RedisCacheConfig.MEDICAL_EXAM_CACHE,
            RedisCacheConfig.LANDBASE_PEME_CACHE,
            RedisCacheConfig.MLC_RECORD_CACHE,
            RedisCacheConfig.PANAMA_CERT_CACHE,
            RedisCacheConfig.PSYCH_EVAL_CACHE,
            RedisCacheConfig.PATIENT_VISIT_CACHE,
    };

    private final CacheManager cacheManager;

    /**
     * Clears every profile-linked module cache after a profile update commits.
     *
     * @param event the committed profile-update event
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onProfileUpdated(SeafarerProfileUpdatedEvent event) {
        for (String cacheName : PROFILE_LINKED_CACHES) {
            var cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
            }
        }
        log.debug("Evicted profile-linked caches after profile update — profileId: {}",
                event.getProfileId());
    }
}
