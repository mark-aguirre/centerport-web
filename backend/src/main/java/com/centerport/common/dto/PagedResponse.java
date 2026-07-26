package com.centerport.common.dto;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Pagination wrapper that provides a clean DTO structure for paginated
 * endpoint responses.
 *
 * Response format:
 * <pre>
 * {
 *   "content": [...],
 *   "page": 0,
 *   "size": 20,
 *   "total_elements": 45,
 *   "total_pages": 3,
 *   "first": true,
 *   "last": false,
 *   "has_next": true,
 *   "has_previous": false
 * }
 * </pre>
 *
 * @param <T> the type of the content elements
 */
@Getter
@Builder
public class PagedResponse<T> {

    private final List<T> content;
    private final int page;
    private final int size;
    private final long totalElements;
    private final int totalPages;
    private final boolean first;
    private final boolean last;
    private final boolean hasNext;
    private final boolean hasPrevious;

    /**
     * Creates a {@code PagedResponse} from a mapped content list and a Spring
     * {@link Page} object (which provides the pagination metadata).
     *
     * @param content the mapped list of DTOs for this page
     * @param page    the original Spring Data page (used for metadata only)
     * @param <T>     the content element type
     * @return a new paged response
     */
    public static <T> PagedResponse<T> of(List<T> content, Page<?> page) {
        return PagedResponse.<T>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
}
