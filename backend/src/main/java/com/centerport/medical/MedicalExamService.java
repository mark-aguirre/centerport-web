package com.centerport.medical;

import com.centerport.common.BusinessIdGenerator;
import com.centerport.common.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for MedicalExam CRUD operations.
 * Manages transactional boundaries, business-ID generation (MED prefix) on create,
 * and ensures client-supplied system fields are ignored.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class MedicalExamService {

    private final MedicalExamRepository repository;
    private final MedicalExamMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    /**
     * Returns all medical exams sorted by createdDate descending.
     */
    @Transactional(readOnly = true)
    public List<MedicalExamDto> findAll() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdDate"))
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Finds a medical exam by UUID or throws NotFoundException.
     */
    @Transactional(readOnly = true)
    public MedicalExamDto findById(UUID id) {
        MedicalExam entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("MedicalExam", id));
        return mapper.toDto(entity);
    }

    /**
     * Creates a new medical exam. Client-supplied system fields (id, examId, createdDate,
     * updatedDate) are ignored. A business ID with prefix MED is generated server-side.
     */
    public MedicalExamDto create(MedicalExamDto dto) {
        MedicalExam entity = mapper.toEntity(dto);

        // Ignore any client-supplied system fields
        entity.setId(null);
        entity.setExamId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);

        // Generate server-managed business ID
        entity.setExamId(businessIdGenerator.generateId("MED"));

        MedicalExam saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing medical exam. Mutable data fields are updated from the DTO;
     * system fields (id, examId, createdDate) are preserved. updatedDate is refreshed
     * automatically via BaseEntity's @PreUpdate.
     */
    public MedicalExamDto update(UUID id, MedicalExamDto dto) {
        MedicalExam existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("MedicalExam", id));

        // Update mutable fields only; system fields are ignored by the mapper
        mapper.updateEntity(dto, existing);

        MedicalExam saved = repository.save(existing);
        return mapper.toDto(saved);
    }
}
