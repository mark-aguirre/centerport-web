package com.centerport.dashboard;

import lombok.Builder;
import lombok.Getter;

/**
 * DTO carrying aggregated dashboard statistics.
 *
 * Each stat mirrors a tile on the operational dashboard:
 * patients (total profiles), records (exams this year),
 * lab tests (certificates with lab data), and vessels (distinct vessel names).
 */
@Getter
@Builder
public class DashboardStatsDto {

    private final long totalPatients;
    private final long recordsThisYear;
    private final long totalLabTests;
    private final long pendingLabTests;
    private final long totalVessels;
    private final long vesselsInPort;
}
