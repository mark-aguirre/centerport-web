package com.centerport.transaction;

import com.centerport.common.dto.ApiResponse;
import com.centerport.common.dto.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

/**
 * REST controller for POS {@link Transaction} operations.
 *
 * Exposes endpoints at {@code /api/transactions} for listing history, fetching
 * a single transaction, settling a new transaction, and voiding a settled one.
 *
 * @see TransactionService
 */
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Point-of-sale transaction settle/void and history")
public class TransactionController {

    private final TransactionService service;

    /**
     * Lists transactions for the history page with optional filters.
     *
     * @param search   optional keyword matching the transaction ID
     * @param status   optional status filter (All/DRAFT/SETTLED/VOIDED)
     * @param from     optional inclusive start date (ISO)
     * @param to       optional inclusive end date (ISO)
     * @param pageable pagination and sorting
     * @return paged transaction summaries
     */
    @GetMapping
    @Operation(summary = "List transactions with filters",
               description = "Returns paginated transaction summaries filtered by search, status, and date range.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Transactions retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<TransactionSummaryDto>>> list(
            @Parameter(description = "Search keyword — matches transaction number")
            @RequestParam(required = false) String search,
            @Parameter(description = "Status filter: All, DRAFT, SETTLED, or VOIDED")
            @RequestParam(required = false) String status,
            @Parameter(description = "Inclusive start date (ISO, e.g. 2026-09-01)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @Parameter(description = "Inclusive end date (ISO, e.g. 2026-09-30)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @ParameterObject
            @PageableDefault(size = 50, sort = "createdDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<TransactionSummaryDto> page = service.list(search, status, from, to, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /**
     * Gets a single transaction (with items) by UUID.
     *
     * @param id the transaction UUID
     * @return the full transaction
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get transaction by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Transaction found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    public ResponseEntity<ApiResponse<TransactionDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    /**
     * Settles a new transaction (create + SETTLED in one step). The backend
     * recalculates and validates the total before persisting.
     *
     * @param payload the settle request
     * @return 200 with the settled transaction
     */
    @PostMapping("/settle")
    @Operation(summary = "Settle a new transaction")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Transaction settled"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Customer or product not found")
    })
    public ResponseEntity<ApiResponse<TransactionDto>> settle(@Valid @RequestBody TransactionPayload payload) {
        TransactionDto settled = service.settle(payload);
        return ResponseEntity.ok(ApiResponse.success(settled, "Transaction settled successfully"));
    }

    /**
     * Voids a settled transaction.
     *
     * @param id      the transaction UUID
     * @param request the void reason
     * @return 200 with the voided transaction
     */
    @PostMapping("/{id}/void")
    @Operation(summary = "Void a settled transaction")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Transaction voided"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Transaction not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Transaction is not settled")
    })
    public ResponseEntity<ApiResponse<TransactionDto>> voidTransaction(
            @PathVariable UUID id,
            @Valid @RequestBody VoidRequest request) {
        TransactionDto voided = service.voidTransaction(id, request.getReason());
        return ResponseEntity.ok(ApiResponse.success(voided, "Transaction voided successfully"));
    }
}
