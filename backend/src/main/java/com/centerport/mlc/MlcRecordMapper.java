package com.centerport.mlc;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link MlcRecord} entity and
 * {@link MlcRecordDto}.
 *
 * Provides three mapping operations:
 * - {@code toDto} — entity to DTO for API responses
 * - {@code toEntity} — DTO to new entity for creation
 * - {@code updateEntity} — DTO fields merged onto an existing entity
 *
 * System Field Protection:
 * The {@code updateEntity} method ignores server-managed fields
 * ({@code id}, {@code mlcId}, {@code createdDate}, {@code updatedDate})
 * so they are preserved from the existing entity during PUT updates.
 *
 * @see MlcRecord
 * @see MlcRecordDto
 * @see MlcRecordService
 */
@Mapper(componentModel = "spring")
public interface MlcRecordMapper {

    /**
     * Converts an {@link MlcRecord} entity to its DTO representation.
     *
     * @param entity the persisted MLC record
     * @return the corresponding DTO with all fields mapped
     */
    MlcRecordDto toDto(MlcRecord entity);

    /**
     * Converts a {@link MlcRecordDto} to a new {@link MlcRecord} entity.
     *
     * Used during record creation. System fields should be cleared by the
     * service layer after this mapping.
     *
     * @param dto the inbound DTO
     * @return a new entity instance with all DTO fields mapped
     */
    MlcRecord toEntity(MlcRecordDto dto);

    /**
     * Merges mutable fields from the DTO onto an existing entity.
     *
     * System-managed fields ({@code id}, {@code mlcId}, {@code createdDate},
     * {@code updatedDate}) are explicitly ignored to prevent client-supplied
     * values from overwriting server state.
     *
     * @param dto    the inbound DTO with updated field values
     * @param entity the existing entity to update in place
     */    @Mapping(target = "id", ignore = true)
    @Mapping(target = "mlcId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(MlcRecordDto dto, @MappingTarget MlcRecord entity);
}
