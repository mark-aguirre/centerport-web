package com.centerport.transaction;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.BadRequestException;
import com.centerport.common.exception.ConflictException;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.item.Item;
import com.centerport.item.ItemRepository;
import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Service layer for POS {@link Transaction} operations.
 *
 * <p>The backend is authoritative for the transaction total: on settle it
 * re-derives every line's amount from the item snapshots supplied by the client
 * and sums them, ignoring any client-provided total. Settling validates the
 * customer and referenced products, persists the transaction as
 * {@link TransactionStatus#SETTLED}, and generates a business ID
 * (prefix {@code TXN}). Voiding moves a settled transaction to
 * {@link TransactionStatus#VOIDED}; a settled transaction is never deleted.
 *
 * @see TransactionRepository
 * @see BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TransactionService {

    private static final String BUSINESS_ID_PREFIX = "TXN";

    private final TransactionRepository repository;
    private final TransactionMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;
    private final ItemRepository itemRepository;
    private final SeafarerProfileRepository profileRepository;

    // === Queries ===

    /**
     * Lists transactions for the history page with optional filters.
     *
     * @param search   optional keyword matching transaction ID
     * @param status   optional status filter (DRAFT/SETTLED/VOIDED)
     * @param from     optional inclusive start date
     * @param to       optional inclusive end date
     * @param pageable pagination and sorting
     * @return paged transaction summaries
     */
    public PagedResponse<TransactionSummaryDto> list(
            String search, String status, LocalDate from, LocalDate to, Pageable pageable) {

        Specification<Transaction> spec = buildListSpec(search, status, from, to);
        Page<Transaction> page = repository.findAll(spec, pageable);

        Map<UUID, String> names = resolveCustomerNames(page.getContent());
        List<TransactionSummaryDto> content = page.getContent().stream()
                .map(t -> mapper.toSummary(t, names.get(t.getCustomerId())))
                .toList();

        return PagedResponse.of(content, page);
    }

    /**
     * Fetches a single transaction (with items) by UUID.
     *
     * @param id the transaction UUID
     * @return the full transaction DTO
     * @throws NotFoundException if not found
     */
    public TransactionDto findById(UUID id) {
        Transaction entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction", id));
        return mapper.toDto(entity, resolveCustomerName(entity.getCustomerId()));
    }

    // === Commands ===

    /**
     * Settles a new transaction: validates the customer and products, builds
     * item snapshots, recomputes the total server-side, and persists the
     * transaction as SETTLED.
     *
     * @param payload the settle request
     * @return the persisted, settled transaction
     * @throws NotFoundException   if the customer or a referenced product is missing
     * @throws BadRequestException if the payload is otherwise invalid
     */
    @Transactional
    public TransactionDto settle(TransactionPayload payload) {
        SeafarerProfile customer = profileRepository.findById(payload.getCustomerId())
                .orElseThrow(() -> new NotFoundException("Customer", payload.getCustomerId()));

        if (payload.getItems() == null || payload.getItems().isEmpty()) {
            throw new BadRequestException("A transaction must have at least one item");
        }

        // Batch-load referenced products to validate existence and avoid N+1.
        List<UUID> productIds = payload.getItems().stream()
                .map(TransactionItemDto::getProductId)
                .distinct()
                .toList();
        Map<UUID, Item> products = itemRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Item::getId, Function.identity()));

        Transaction transaction = new Transaction();
        transaction.setCustomerId(customer.getId());
        transaction.setStatus(TransactionStatus.SETTLED);
        transaction.setDefaultBillingType(payload.getDefaultBillingType());
        transaction.setDefaultProfessionalFee(
                nonNull(payload.getDefaultProfessionalFee()));

        BigDecimal total = BigDecimal.ZERO;
        for (TransactionItemDto dto : payload.getItems()) {
            Item product = products.get(dto.getProductId());
            if (product == null) {
                throw new NotFoundException("Item", dto.getProductId());
            }

            TransactionItem item = new TransactionItem();
            item.setProductId(product.getId());
            item.setDescriptionSnapshot(dto.getDescriptionSnapshot());
            item.setPriceSnapshot(nonNull(dto.getPriceSnapshot()));
            item.setProfessionalFee(nonNull(dto.getProfessionalFee()));
            item.setBillingType(dto.getBillingType());
            item.setPersonalAccount(Boolean.TRUE.equals(dto.getPersonalAccount()));
            transaction.addItem(item);

            total = total.add(item.getPriceSnapshot()).add(item.getProfessionalFee());
        }

        transaction.setTotalAmount(total);
        transaction.setSettledAt(LocalDateTime.now());
        transaction.setTransactionId(businessIdGenerator.generateId(BUSINESS_ID_PREFIX));

        Transaction saved = repository.save(transaction);
        log.info("Transaction settled — transactionId: {}, customerId: {}, total: {}, items: {}",
                saved.getTransactionId(), saved.getCustomerId(), saved.getTotalAmount(),
                saved.getItems().size());

        return mapper.toDto(saved, resolveCustomerName(saved.getCustomerId()));
    }

    /**
     * Voids a settled transaction, recording the reason and timestamp. A settled
     * transaction is never physically deleted.
     *
     * @param id     the transaction UUID
     * @param reason the void reason (audit trail)
     * @return the voided transaction
     * @throws NotFoundException if the transaction does not exist
     * @throws ConflictException if the transaction is not currently SETTLED
     */
    @Transactional
    public TransactionDto voidTransaction(UUID id, String reason) {
        Transaction transaction = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction", id));

        if (transaction.getStatus() != TransactionStatus.SETTLED) {
            throw new ConflictException(
                    "Only a settled transaction can be voided (current status: "
                            + transaction.getStatus() + ")");
        }

        transaction.setStatus(TransactionStatus.VOIDED);
        transaction.setVoidedAt(LocalDateTime.now());
        transaction.setVoidReason(reason);

        Transaction saved = repository.save(transaction);
        log.info("Transaction voided — transactionId: {}, id: {}",
                saved.getTransactionId(), id);

        return mapper.toDto(saved, resolveCustomerName(saved.getCustomerId()));
    }

    // === Helpers ===

    private static BigDecimal nonNull(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    /** Resolves a single customer's display name (first + last), null-safe. */
    private String resolveCustomerName(UUID customerId) {
        return profileRepository.findById(customerId)
                .map(TransactionService::displayName)
                .orElse(null);
    }

    /** Batch-resolves customer display names for a list of transactions. */
    private Map<UUID, String> resolveCustomerNames(List<Transaction> transactions) {
        if (transactions.isEmpty()) {
            return Map.of();
        }
        List<UUID> ids = transactions.stream()
                .map(Transaction::getCustomerId)
                .distinct()
                .toList();
        return profileRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(SeafarerProfile::getId, TransactionService::displayName));
    }

    private static String displayName(SeafarerProfile profile) {
        String first = profile.getFirstName() != null ? profile.getFirstName() : "";
        String last = profile.getLastName() != null ? profile.getLastName() : "";
        String name = (first + " " + last).trim();
        return name.isBlank() ? "(unnamed)" : name;
    }

    /**
     * Builds the history-list specification from the optional filters. The date
     * bounds are applied against {@code createdDate} at day granularity.
     */
    private Specification<Transaction> buildListSpec(
            String search, String status, LocalDate from, LocalDate to) {

        Specification<Transaction> spec = Specification.where(null);

        if (search != null && !search.isBlank()) {
            String pattern = "%" + search.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("transactionId")), pattern));
        }

        if (status != null && !status.isBlank() && !"All".equalsIgnoreCase(status)) {
            TransactionStatus parsed = parseStatus(status);
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), parsed));
        }

        if (from != null) {
            LocalDateTime start = from.atStartOfDay();
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("createdDate"), start));
        }

        if (to != null) {
            LocalDateTime end = to.atTime(LocalTime.MAX);
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("createdDate"), end));
        }

        return spec;
    }

    private static TransactionStatus parseStatus(String status) {
        try {
            return TransactionStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid transaction status: " + status);
        }
    }
}
