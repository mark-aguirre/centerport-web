package com.centerport.item;

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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

/**
 * REST controller for {@link Item} CRUD operations.
 *
 * Exposes endpoints at {@code /api/items} for listing/searching, fetching,
 * creating, updating, and deleting billable items.
 *
 * @see ItemService
 */
@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@Tag(name = "Items", description = "CRUD operations for billable services, examinations, and packages")
public class ItemController {

    private final ItemService service;

    /**
     * Returns paginated items, optionally filtered by a search keyword.
     *
     * @param search   optional keyword matching name or description
     * @param pageable pagination and sorting parameters
     * @return paged list of items
     */
    @GetMapping
    @Operation(summary = "List items with pagination and optional search",
               description = "Returns paginated items. Optionally filter by name or description.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Items retrieved")
    })
    public ResponseEntity<ApiResponse<PagedResponse<ItemDto>>> list(
            @Parameter(description = "Search keyword — matches name or description (case-insensitive)")
            @RequestParam(required = false) String search,
            @ParameterObject
            @PageableDefault(size = 50, sort = "updatedDate", direction = Sort.Direction.DESC)
            Pageable pageable) {

        PagedResponse<ItemDto> page = service.findAll(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    /**
     * Returns a single item by UUID.
     *
     * @param id the item UUID
     * @return the matching item
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get item by UUID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Item found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Item not found")
    })
    public ResponseEntity<ApiResponse<ItemDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    /**
     * Creates a new item record.
     *
     * @param dto the item data
     * @return 201 with the persisted item including server-generated fields
     */
    @PostMapping
    @Operation(summary = "Create a new item")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Item created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<ItemDto>> create(@Valid @RequestBody ItemDto dto) {
        ItemDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location)
                .body(ApiResponse.success(created, "Item created successfully"));
    }

    /**
     * Updates an existing item record.
     *
     * @param id  the item UUID
     * @param dto the updated item data
     * @return 200 with the updated item
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing item")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Item updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Item not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<ItemDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody ItemDto dto) {
        return ResponseEntity.ok(ApiResponse.success(service.update(id, dto), "Item updated successfully"));
    }

    /**
     * Deletes an item record.
     *
     * @param id the item UUID
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an item")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Item deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Item not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Item deleted successfully"));
    }
}
