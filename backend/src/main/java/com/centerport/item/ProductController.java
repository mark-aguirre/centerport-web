package com.centerport.item;

import com.centerport.common.dto.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Read-only product lookup for the transaction workspace's product selector.
 *
 * Products are simply active {@link Item}s exposed through a slimmer
 * {@link ProductDto}. This keeps the selector decoupled from the full Item
 * listing contract while sharing the same underlying catalog and search.
 *
 * @see ItemService
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Read-only product lookup for transactions")
public class ProductController {

    private final ItemService itemService;

    /**
     * Searches active products (items) by keyword.
     *
     * @param keyword optional search term matching name or description
     * @param limit   maximum number of results (defaults to 10)
     * @return matching products
     */
    @GetMapping("/search")
    @Operation(summary = "Search products by keyword")
    public ResponseEntity<ApiResponse<List<ProductDto>>> search(
            @Parameter(description = "Search keyword — matches product name or description")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "Maximum number of results")
            @RequestParam(required = false, defaultValue = "10") int limit) {

        List<ProductDto> results = itemService.search(keyword).stream()
                .limit(Math.max(1, limit))
                .map(item -> ProductDto.builder()
                        .id(item.getId())
                        .productId(item.getItemId())
                        .name(item.getName())
                        .description(item.getDescription())
                        .price(item.getPrice())
                        .professionalFee(item.getProfessionalFee())
                        .build())
                .toList();

        return ResponseEntity.ok(ApiResponse.success(results));
    }
}
