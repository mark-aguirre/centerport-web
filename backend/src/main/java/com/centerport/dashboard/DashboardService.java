package com.centerport.dashboard;

import com.centerport.landbase.LandbasePeme;
import com.centerport.landbase.LandbasePemeRepository;
import com.centerport.medical.MedicalExam;
import com.centerport.medical.MedicalExamRepository;
import com.centerport.mlc.MlcRecord;
import com.centerport.mlc.MlcRecordRepository;
import com.centerport.panama.PanamaCertificate;
import com.centerport.panama.PanamaCertificateRepository;
import com.centerport.config.RedisCacheConfig;
import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileRepository;
import com.centerport.visit.PatientVisit;
import com.centerport.visit.PatientVisitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service that aggregates operational statistics for the dashboard.
 *
 * Pulls counts from multiple repositories to build a single snapshot
 * of system activity — patients, records, lab tests, and vessels.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardService {

    private final SeafarerProfileRepository profileRepository;
    private final MedicalExamRepository medicalExamRepository;
    private final LandbasePemeRepository landbasePemeRepository;
    private final MlcRecordRepository mlcRecordRepository;
    private final PanamaCertificateRepository panamaCertificateRepository;
    private final PatientVisitRepository patientVisitRepository;

    /** Max activity items returned by {@link #getRecentActivity()}. */
    private static final int ACTIVITY_LIMIT = 8;

    /**
     * How many recent rows to pull from each source before merging. Pulling the
     * top {@code ACTIVITY_LIMIT} from every source guarantees the global
     * top-{@code ACTIVITY_LIMIT} after the merge, regardless of how the newest
     * items are distributed across sources.
     */
    private static final int PER_SOURCE_LIMIT = ACTIVITY_LIMIT;

    /**
     * Computes dashboard statistics by querying all relevant repositories.
     *
     * - Patients: total seafarer profiles (all are considered active)
     * - Records this year: medical exams + landbase PEMEs created since Jan 1
     * - Lab tests: Panama certificates with lab data; pending = those without fitness assessment
     * - Vessels: distinct vessel names from MLC records; "in port" = vessels with records in last 30 days
     *
     * Results are cached in Redis under {@link RedisCacheConfig#DASHBOARD_STATS_CACHE}
     * and refreshed per that cache's TTL, avoiding repeated multi-repository
     * count queries on every dashboard load.
     *
     * @return aggregated stats DTO
     */
    @Cacheable(RedisCacheConfig.DASHBOARD_STATS_CACHE)
    public DashboardStatsDto getStats() {
        log.debug("Computing dashboard statistics");

        // Patients — total profiles
        long totalPatients = profileRepository.count();

        // Records this year — medical exams + landbase PEMEs created since Jan 1
        LocalDateTime startOfYear = LocalDateTime.now()
                .withMonth(1).withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0).withNano(0);

        long medicalExamsThisYear = medicalExamRepository.countCreatedSince(startOfYear);
        long landbasePemesThisYear = landbasePemeRepository.countCreatedSince(startOfYear);
        long recordsThisYear = medicalExamsThisYear + landbasePemesThisYear;

        // Lab tests — certificates with lab data populated
        long totalLabTests = panamaCertificateRepository.countWithLabTests();
        long pendingLabTests = panamaCertificateRepository.countPendingLabTests(startOfYear);

        // Vessels — distinct vessel names from MLC records
        long totalVessels = mlcRecordRepository.countDistinctVessels();
        LocalDateTime last30Days = LocalDateTime.now().minusDays(30);
        long vesselsInPort = mlcRecordRepository.countDistinctVesselsCreatedSince(last30Days);

        return DashboardStatsDto.builder()
                .totalPatients(totalPatients)
                .recordsThisYear(recordsThisYear)
                .totalLabTests(totalLabTests)
                .pendingLabTests(pendingLabTests)
                .totalVessels(totalVessels)
                .vesselsInPort(vesselsInPort)
                .build();
    }

    /**
     * Builds the dashboard "Recent Activity" feed.
     *
     * Pulls the most recent records from each activity source (patient visits,
     * medical exams, landbase PEMEs, Panama certificates, MLC records, and new
     * seafarer profiles), projects each into a uniform {@link ActivityItemDto},
     * merges them, sorts by timestamp (newest first), and returns the top
     * {@link #ACTIVITY_LIMIT}.
     *
     * Each source is queried for its own top {@link #PER_SOURCE_LIMIT} ordered by
     * {@code updatedDate} desc, so the merged result always contains the true
     * global most-recently-touched items no matter how they are spread across
     * sources. Using {@code updatedDate} (not {@code createdDate}) means edits to
     * existing records also surface as recent activity — a freshly edited record
     * rises to the top even though it was created long ago.
     *
     * Results are cached in Redis under
     * {@link RedisCacheConfig#DASHBOARD_ACTIVITY_CACHE} and evicted on any domain
     * write by {@link DashboardCacheEvictionListener}, mirroring the stats cache.
     *
     * @return recent activity items, newest first, at most {@link #ACTIVITY_LIMIT}
     */
    @Cacheable(RedisCacheConfig.DASHBOARD_ACTIVITY_CACHE)
    public List<ActivityItemDto> getRecentActivity() {
        log.debug("Computing dashboard recent activity");

        PageRequest recent = PageRequest.of(
                0, PER_SOURCE_LIMIT, Sort.by(Sort.Direction.DESC, "updatedDate"));

        List<ActivityItemDto> items = new ArrayList<>();

        // Patient visits — profile referenced by plain UUID, resolved in batch.
        List<PatientVisit> visits = patientVisitRepository.findBy(recent);
        Map<UUID, SeafarerProfile> profilesById = resolveVisitProfiles(visits);
        for (PatientVisit v : visits) {
            SeafarerProfile p = profilesById.get(v.getSeafarerProfileId());
            items.add(ActivityItemDto.builder()
                    .type("visit")
                    .title(actionTitle(v.getCreatedDate(), v.getUpdatedDate(),
                            "Patient visit logged", "Patient visit updated"))
                    .description(join(fullName(p), v.getPurposeOfVisit()))
                    .businessId(v.getVisitId())
                    .timestamp(v.getUpdatedDate())
                    .build());
        }

        // Medical exams.
        for (MedicalExam e : medicalExamRepository.findRecentWithProfile(recent)) {
            items.add(ActivityItemDto.builder()
                    .type("medical_exam")
                    .title(actionTitle(e.getCreatedDate(), e.getUpdatedDate(),
                            "Medical exam recorded", "Medical exam updated"))
                    .description(fullName(e.getSeafarerProfile()))
                    .businessId(e.getExamId())
                    .timestamp(e.getUpdatedDate())
                    .build());
        }

        // Landbase PEMEs.
        for (LandbasePeme peme : landbasePemeRepository.findRecentWithProfile(recent)) {
            items.add(ActivityItemDto.builder()
                    .type("landbase_peme")
                    .title(actionTitle(peme.getCreatedDate(), peme.getUpdatedDate(),
                            "Landbase PEME recorded", "Landbase PEME updated"))
                    .description(fullName(peme.getSeafarerProfile()))
                    .businessId(peme.getPemeId())
                    .timestamp(peme.getUpdatedDate())
                    .build());
        }

        // Panama certificates (lab/certificate activity).
        for (PanamaCertificate c : panamaCertificateRepository.findRecentWithProfile(recent)) {
            items.add(ActivityItemDto.builder()
                    .type("panama_certificate")
                    .title(actionTitle(c.getCreatedDate(), c.getUpdatedDate(),
                            "Panama certificate recorded", "Panama certificate updated"))
                    .description(fullName(c.getSeafarerProfile()))
                    .businessId(c.getPanamaId())
                    .timestamp(c.getUpdatedDate())
                    .build());
        }

        // MLC records (vessel/seabase activity).
        for (MlcRecord m : mlcRecordRepository.findRecentWithProfile(recent)) {
            items.add(ActivityItemDto.builder()
                    .type("mlc_record")
                    .title(actionTitle(m.getCreatedDate(), m.getUpdatedDate(),
                            "MLC record entered", "MLC record updated"))
                    .description(join(fullName(m.getSeafarerProfile()), m.getVesselName()))
                    .businessId(m.getMlcId())
                    .timestamp(m.getUpdatedDate())
                    .build());
        }

        // Seafarer profiles.
        for (SeafarerProfile p : profileRepository.findBy(recent)) {
            items.add(ActivityItemDto.builder()
                    .type("profile")
                    .title(actionTitle(p.getCreatedDate(), p.getUpdatedDate(),
                            "Patient profile registered", "Patient profile updated"))
                    .description(fullName(p))
                    .businessId(p.getProfileId())
                    .timestamp(p.getUpdatedDate())
                    .build());
        }

        return items.stream()
                .filter(i -> i.getTimestamp() != null)
                .sorted(Comparator.comparing(ActivityItemDto::getTimestamp).reversed())
                .limit(ACTIVITY_LIMIT)
                .toList();
    }

    /**
     * Chooses the activity title based on whether the record was just created or
     * later edited.
     *
     * A record is treated as "updated" when its {@code updatedDate} is meaningfully
     * later than its {@code createdDate}. Both are set to the same instant on
     * insert (see {@code BaseEntity#onCreate}), so on first save they are equal and
     * the "created" title is used.
     *
     * @param created     the record's creation timestamp (may be null)
     * @param updated     the record's last-updated timestamp (may be null)
     * @param createdTitle title to use for a newly created record
     * @param updatedTitle title to use for an edited record
     * @return the appropriate title
     */
    private String actionTitle(LocalDateTime created, LocalDateTime updated,
                               String createdTitle, String updatedTitle) {
        if (created == null || updated == null) {
            return createdTitle;
        }
        return updated.isAfter(created) ? updatedTitle : createdTitle;
    }

    /**
     * Batch-loads the seafarer profiles referenced by the given visits, keyed by
     * profile UUID, so visit descriptions can include the patient name without a
     * per-row query.
     *
     * @param visits the visits whose profiles to resolve
     * @return map of profile id to profile (missing profiles are simply absent)
     */
    private Map<UUID, SeafarerProfile> resolveVisitProfiles(List<PatientVisit> visits) {
        List<UUID> profileIds = visits.stream()
                .map(PatientVisit::getSeafarerProfileId)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
        if (profileIds.isEmpty()) {
            return Map.of();
        }
        return profileRepository.findAllById(profileIds).stream()
                .collect(Collectors.toMap(SeafarerProfile::getId, p -> p));
    }

    /**
     * Formats a profile's display name as "LAST, First", tolerating nulls.
     *
     * @param profile the profile (may be null)
     * @return a display name, or "Unknown patient" when unavailable
     */
    private String fullName(SeafarerProfile profile) {
        if (profile == null) {
            return "Unknown patient";
        }
        String name = join(profile.getLastName(), profile.getFirstName());
        return name.isEmpty() ? "Unknown patient" : name;
    }

    /**
     * Joins non-blank parts with ", ", skipping null/blank values.
     *
     * @param parts the pieces to join
     * @return the joined string (possibly empty)
     */
    private String join(String... parts) {
        return java.util.Arrays.stream(parts)
                .filter(s -> s != null && !s.isBlank())
                .collect(Collectors.joining(", "));
    }
}
