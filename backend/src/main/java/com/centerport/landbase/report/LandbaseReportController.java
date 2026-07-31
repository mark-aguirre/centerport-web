package com.centerport.landbase.report;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * REST controller for generating Landbase PEME PDF reports.
 *
 * Exposes a single endpoint that accepts the PEME record UUID and the
 * desired report type, and returns the generated PDF as a binary download.
 *
 * @see LandbaseReportService
 * @see LandbaseReportType
 */
@Slf4j
@RestController
@RequestMapping("/api/landbase-pemes")
@RequiredArgsConstructor
@Tag(name = "Landbase Reports", description = "PDF report generation for landbase PEME records")
public class LandbaseReportController {

    private final LandbaseReportService reportService;

    /**
     * Generate and download a PDF report for a landbase PEME record.
     *
     * @param id         the UUID of the PEME record
     * @param reportType the report template slug (e.g. "landbase-detailed", "landbase-mer-1")
     * @return PDF binary content with appropriate headers for browser download/preview
     */
    @GetMapping("/{id}/reports/{reportType}")
    @Operation(
            summary = "Generate a PDF report for a landbase PEME record",
            description = "Generates the specified report type and returns it as a PDF download. " +
                    "Valid report types: landbase-detailed, landbase-mer-1, landbase-mer-2, landbase-mlc, landbase-summary"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "PDF generated successfully"),
            @ApiResponse(responseCode = "404", description = "PEME record not found"),
            @ApiResponse(responseCode = "400", description = "Invalid report type")
    })
    public ResponseEntity<byte[]> generateReport(
            @Parameter(description = "UUID of the landbase PEME record")
            @PathVariable UUID id,
            @Parameter(description = "Report template name (e.g. landbase-detailed, landbase-mer-1, landbase-mer-2, landbase-mlc, landbase-summary)")
            @PathVariable String reportType) {

        log.info("Report generation requested — PEME: {}, type: {}", id, reportType);

        LandbaseReportType type = LandbaseReportType.fromTemplateName(reportType);
        byte[] pdfBytes = reportService.generateReport(id, type);

        String filename = reportType + "_" + id + ".pdf";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", filename);
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
