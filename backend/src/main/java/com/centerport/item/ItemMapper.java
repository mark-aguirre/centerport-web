package com.centerport.item;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link Item} entity and
 * {@link ItemDto}.
 *
 * The {@code updateEntity} method ignores system-managed fields so that
 * {@code id}, {@code itemId}, {@code createdDate}, and {@code updatedDate}
 * are preserved from the existing entity during PUT updates.
 *
 * @see ItemService consumer of this mapper
 */
@Mapper(componentModel = "spring")
public interface ItemMapper {

    /** Converts an entity to its DTO representation. */
    ItemDto toDto(Item entity);

    /** Converts a DTO to a new entity instance. */
    Item toEntity(ItemDto dto);

    /**
     * Updates an existing entity from a DTO, preserving system-managed fields.
     *
     * @param dto    the source DTO with updated field values
     * @param entity the target entity to update in place
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "itemId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(ItemDto dto, @MappingTarget Item entity);
}
