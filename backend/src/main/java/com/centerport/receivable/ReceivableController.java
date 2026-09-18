package com.centerport.receivable;

import com.centerport.common.dto.ApiResponse;
import com.centerport.common.exception.BadRequestException;
import com.centerport.receivable.ReceivableDtos.PaymentTypeOption;
import com.centerport.receivable.ReceivableDtos.ReceivableAccount;
import com.centerport.receivable.ReceivableDtos.ReceivableReport;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for the Receivable Report — read-only reporting over settled
 * transactions, plus its supporting lookups (accounts, payment types).
 *
 * @see ReceivableService
 */
@RestController
@RequestMapping("/api/receivables")
@RequiredArgsConstructor
@Tag(name = "Receivables", description = "Receivable report generation and lookups")
public class ReceivableController {

    private final ReceivableService service;

    /** Lists selectable company accounts (active employers). */
    @GetMapping("/accounts")
    @Operation(summary = "List receivable report accounts")
    public ResponseEntity<ApiResponse<List<ReceivableAccount>>> listAccounts() {
        return ResponseEntity.ok(ApiResponse.success(service.listAccounts()));
    }

    /** Lists configured payment-type options. */
    @GetMapping("/payment-types")
    @Operation(summary = "List receivable report payment types")
    public ResponseEntity<ApiResponse<List<PaymentTypeOption>>> listPaymentTypes() {
        return ResponseEntity.ok(ApiResponse.success(service.listPaymentTypes()));
    }

    /**
     * Generates the receivable report for the given filters.
     *
     * @param accountId     the selected account UUID (required)
     * @param packageFilter package classification ("Package"/"Not Package"/"All")
     * @param from          inclusive start date (ISO)
     * @param to            inclusive end date (ISO)
     * @param paymentType   optional payment/billing type label
     * @return the report rows plus totals
     */
    @GetMapping("/report")
    @Operation(summary = "Generate the receivable report")
    public ResponseEntity<ApiResponse<ReceivableReport>> generate(
            @Parameter(description = "Selected account UUID (required)")
            @RequestParam("account_id") UUID accountId,
            @Parameter(description = "Package classification: Package, Not Package, or All")
            @RequestParam(value = "package_filter", required = false, defaultValue = "All") String packageFilter,
            @Parameter(description = "Inclusive start date (ISO)")
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @Parameter(description = "Inclusive end date (ISO)")
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @Parameter(description = "Optional payment/billing type label")
            @RequestParam(value = "payment_type", required = false) String paymentType) {

        if (to.isBefore(from)) {
            throw new BadRequestException("From date must be on or before To date");
        }

        ReceivableReport report = service.generate(accountId, paymentType, packageFilter, from, to);
        return ResponseEntity.ok(ApiResponse.success(report));
    }
}
