package com.centerport.panama;

import com.centerport.common.BusinessIdGenerator;
import com.centerport.common.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for PanamaCertificate CRUD operations.
 * Manages transactional boundaries, business-ID generation (PAN prefix) on create,
 * and ensures client-supplied system fields are ignored.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class PanamaCertificateService {

    private final PanamaCertificateRepository repository;
    private final PanamaCertificateMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    /**
     * Returns all Panama certificates sorted by createdDate descending.
     */
    @Transactional(readOnly = true)
    public List<PanamaCertificateDto> findAll() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdDate"))
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Finds a Panama certificate by UUID or throws NotFoundException.
     */
    @Transactional(readOnly = true)
    public PanamaCertificateDto findById(UUID id) {
        PanamaCertificate entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("PanamaCertificate", id));
        return mapper.toDto(entity);
    }

    /**
     * Creates a new Panama certificate. Client-supplied system fields (id, panamaId,
     * createdDate, updatedDate) are ignored. A business ID with prefix PAN is generated
     * server-side.
     */
    public PanamaCertificateDto create(PanamaCertificateDto dto) {
        PanamaCertificate entity = mapper.toEntity(dto);

        // Ignore any client-supplied system fields
        entity.setId(null);
        entity.setPanamaId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);

        // Generate server-managed business ID
        entity.setPanamaId(businessIdGenerator.generateId("PAN"));

        PanamaCertificate saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing Panama certificate. Mutable data fields are updated from the DTO;
     * system fields (id, panamaId, createdDate) are preserved. updatedDate is refreshed
     * automatically via BaseEntity's @PreUpdate.
     */
    public PanamaCertificateDto update(UUID id, PanamaCertificateDto dto) {
        PanamaCertificate existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("PanamaCertificate", id));

        // Update mutable fields only; system fields are ignored by the mapper
        mapper.updateEntity(dto, existing);

        PanamaCertificate saved = repository.save(existing);
        return mapper.toDto(saved);
    }
}
