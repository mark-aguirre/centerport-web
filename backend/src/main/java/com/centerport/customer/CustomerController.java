package com.centerport.customer;

import com.centerport.common.dto.ApiResponse;
import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Read-only customer lookup for the transaction workspace's customer selector.
 *
 * Customers are seafarer profiles surfaced through a slim {@link CustomerDto}.
 * Search matches last name, first name, or the profile business ID
 * (case-insensitive), mirroring the profile search used elsewhere.
 *
 * @see SeafarerProfileRepository
 */
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Tag(name = "Customers", description = "Read-only customer (profile) lookup for transactions")
public class CustomerController {

    private final SeafarerProfileRepository profileRepository;

    /**
     * Searches customers by keyword (last name, first name, or profile ID).
     *
     * @param keyword optional search term
     * @param limit   maximum number of results (defaults to 10)
     * @return matching customers
     */
    @GetMapping("/search")
    @Operation(summary = "Search customers by keyword")
    public ResponseEntity<ApiResponse<List<CustomerDto>>> search(
            @Parameter(description = "Search keyword — matches name or application (profile) number")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "Maximum number of results")
            @RequestParam(required = false, defaultValue = "10") int limit) {

        int size = Math.max(1, limit);
        Specification<SeafarerProfile> spec = buildSearchSpec(keyword);
        PageRequest pageable = PageRequest.of(0, size,
                Sort.by(Sort.Direction.DESC, "updatedDate"));

        List<CustomerDto> results = profileRepository.findAll(spec, pageable)
                .getContent().stream()
                .map(this::toCustomer)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(results));
    }

    /** Maps a profile to the slim customer view. */
    private CustomerDto toCustomer(SeafarerProfile profile) {
        String name = (safe(profile.getFirstName()) + " " + safe(profile.getLastName())).trim();
        return CustomerDto.builder()
                .id(profile.getId())
                .name(name.isBlank() ? "(unnamed)" : name)
                .applicationNo(profile.getProfileId())
                .agency(profile.getEmployer())
                .build();
    }

    /**
     * Builds a case-insensitive keyword specification matching last name, first
     * name, or profile ID. Returns an unrestricted spec when blank.
     */
    private Specification<SeafarerProfile> buildSearchSpec(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return Specification.where(null);
        }
        String pattern = "%" + keyword.trim().toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("lastName")), pattern),
                cb.like(cb.lower(root.get("firstName")), pattern),
                cb.like(cb.lower(root.get("profileId")), pattern));
    }

    private static String safe(String value) {
        return value == null ? "" : value;
    }
}
