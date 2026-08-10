package com.centerport.dashboard;

import com.centerport.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller exposing aggregated dashboard statistics.
 *
 * Single endpoint at {@code GET /api/dashboard/stats} returns
 * operational counts for the main dashboard display.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Aggregated operational statistics")
public class DashboardController {

    private final DashboardService service;

    /**
     * Returns aggregated statistics for the operational dashboard.
     *
     * @return patient count, records this year, lab test counts, vessel counts
     */
    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics",
               description = "Returns aggregated counts: total patients, records this year, lab tests (total + pending), and vessels (total + recently active).")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Statistics retrieved")
    })
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStats() {
        DashboardStatsDto stats = service.getStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
