package com.centerport.dashboard;

import com.centerport.landbase.LandbasePemeRepository;
import com.centerport.medical.MedicalExamRepository;
import com.centerport.mlc.MlcRecordRepository;
import com.centerport.panama.PanamaCertificateRepository;
import com.centerport.profile.SeafarerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

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

    /**
     * Computes dashboard statistics by querying all relevant repositories.
     *
     * - Patients: total seafarer profiles (all are considered active)
     * - Records this year: medical exams + landbase PEMEs created since Jan 1
     * - Lab tests: Panama certificates with lab data; pending = those without fitness assessment
     * - Vessels: distinct vessel names from MLC records; "in port" = vessels with records in last 30 days
     *
     * @return aggregated stats DTO
     */
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
}
