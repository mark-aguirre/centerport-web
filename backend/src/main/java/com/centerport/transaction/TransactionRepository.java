package com.centerport.transaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link Transaction} entities.
 *
 * Inherits standard CRUD, paging/sorting, and specification-based filtering
 * (used by the history list) from {@link JpaRepository} and
 * {@link JpaSpecificationExecutor}.
 */
public interface TransactionRepository extends JpaRepository<Transaction, UUID>,
        JpaSpecificationExecutor<Transaction> {
}
