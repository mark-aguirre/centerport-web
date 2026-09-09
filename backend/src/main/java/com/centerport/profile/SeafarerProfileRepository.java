package com.centerport.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link SeafarerProfile} entities.
 *
 * Inherits standard CRUD, paging/sorting, and specification-based filtering
 * from {@link JpaRepository} and {@link JpaSpecificationExecutor}.
 *
 * @see SeafarerProfileService consumer of this repository
 */
public interface SeafarerProfileRepository extends JpaRepository<SeafarerProfile, UUID>,
        JpaSpecificationExecutor<SeafarerProfile> {

    /**
     * Finds an existing profile that matches the given identity, treated as the
     * natural duplicate key: last name + first name + birthdate, all compared
     * case-insensitively. Used to prevent creating duplicate profiles for the
     * same person.
     *
     * @param lastName  the last name to match (case-insensitive)
     * @param firstName the first name to match (case-insensitive)
     * @param birthdate the birthdate to match (case-insensitive; stored as a string)
     * @return the first matching profile, if any
     */
    @Query("""
            SELECT p FROM SeafarerProfile p
            WHERE LOWER(p.lastName) = LOWER(:lastName)
              AND LOWER(p.firstName) = LOWER(:firstName)
              AND LOWER(COALESCE(p.birthdate, '')) = LOWER(COALESCE(:birthdate, ''))
            """)
    Optional<SeafarerProfile> findByIdentity(
            @Param("lastName") String lastName,
            @Param("firstName") String firstName,
            @Param("birthdate") String birthdate);
}
