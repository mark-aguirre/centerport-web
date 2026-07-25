package com.centerport.mlc;

import com.centerport.common.BusinessIdGenerator;
import com.centerport.common.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for MlcRecord CRUD operations.
 * Manages transactional boundaries, business-ID generation (MLC prefix) on create,
 * and ensures client-supplied system fields are ignored.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class MlcRecordService {

    private final MlcRecordRepository repository;
    private final MlcRecordMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    /**
     * Returns all MLC records sorted by createdDate descending.
     */
    @Transactional(readOnly = true)
    public List<MlcRecordDto> findAll() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdDate"))
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Finds an MLC record by UUID or throws NotFoundException.
     */
    @Transactional(readOnly = true)
    public MlcRecordDto findById(UUID id) {
        MlcRecord entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("MlcRecord", id));
        return mapper.toDto(entity);
    }

    /**
     * Creates a new MLC record. Client-supplied system fields (id, mlcId, createdDate,
     * updatedDate) are ignored. A business ID with prefix MLC is generated server-side.
     */
    public MlcRecordDto create(MlcRecordDto dto) {
        MlcRecord entity = mapper.toEntity(dto);

        // Ignore any client-supplied system fields
        entity.setId(null);
        entity.setMlcId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);

        // Generate server-managed business ID
        entity.setMlcId(businessIdGenerator.generateId("MLC"));

        MlcRecord saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing MLC record. Mutable data fields are updated from the DTO;
     * system fields (id, mlcId, createdDate) are preserved. updatedDate is refreshed
     * automatically via BaseEntity's @PreUpdate.
     */
    public MlcRecordDto update(UUID id, MlcRecordDto dto) {
        MlcRecord existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("MlcRecord", id));

        // Update mutable fields only; system fields are ignored by the mapper
        mapper.updateEntity(dto, existing);

        MlcRecord saved = repository.save(existing);
        return mapper.toDto(saved);
    }
}
