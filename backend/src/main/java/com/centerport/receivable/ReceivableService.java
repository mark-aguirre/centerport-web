package com.centerport.receivable;

import com.centerport.employer.Employer;
import com.centerport.employer.EmployerRepository;
import com.centerport.item.Item;
import com.centerport.item.ItemRepository;
import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileRepository;
import com.centerport.receivable.ReceivableDtos.PaymentTypeOption;
import com.centerport.receivable.ReceivableDtos.ReceivableAccount;
import com.centerport.receivable.ReceivableDtos.ReceivableReport;
import com.centerport.receivable.ReceivableDtos.ReceivableReportRow;
import com.centerport.transaction.Transaction;
import com.centerport.transaction.TransactionItem;
import com.centerport.transaction.TransactionItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
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
 * Service for the Receivable Report — a read-only reporting view over settled
 * transactions.
 *
 * <p>An "account" is an employer/agency; a settled transaction line belongs to
 * an account via its customer profile's employer. The report filters settled
 * line items by account, payment (billing) type, package classification, and a
 * settled-at date range, and returns per-line rows plus totals.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ReceivableService {

    /**
     * Configured payment-type options. Kept as a small fixed list here (the
     * transaction billing types plus common categories); promote to a table if
     * the business needs them to be user-managed.
     */
    private static final List<PaymentTypeOption> PAYMENT_TYPES = List.of(
            new PaymentTypeOption("APPLICATION_PAID", "Application Paid"),
            new PaymentTypeOption("BILLED_AGENCY", "Billed Agency"),
            new PaymentTypeOption("CASH", "Cash"),
            new PaymentTypeOption("COMPANY_ACCOUNT", "Company Account"));

    private final EmployerRepository employerRepository;
    private final TransactionItemRepository transactionItemRepository;
    private final SeafarerProfileRepository profileRepository;
    private final ItemRepository itemRepository;

    /** Returns selectable accounts (active employers), sorted by name. */
    public List<ReceivableAccount> listAccounts() {
        return employerRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .filter(e -> Boolean.TRUE.equals(e.getActive()))
                .map(e -> ReceivableAccount.builder().id(e.getId()).name(e.getName()).build())
                .toList();
    }

    /** Returns the configured payment-type options. */
    public List<PaymentTypeOption> listPaymentTypes() {
        return PAYMENT_TYPES;
    }

    /**
     * Generates the receivable report.
     *
     * @param accountId     the selected account (employer) UUID; required
     * @param paymentType   optional payment/billing type label (null/blank = all)
     * @param packageFilter one of "Package", "Not Package", "All"
     * @param from          inclusive start date
     * @param to            inclusive end date
     * @return the report rows plus totals
     */
    public ReceivableReport generate(
            UUID accountId, String paymentType, String packageFilter, LocalDate from, LocalDate to) {

        String accountName = employerRepository.findById(accountId)
                .map(Employer::getName)
                .orElse(null);

        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(LocalTime.MAX);
        String billingType = (paymentType == null || paymentType.isBlank()) ? null : paymentType;

        List<TransactionItem> items = transactionItemRepository.findSettledItems(start, end, billingType);

        // Batch-load related customers and products for account-name matching and
        // the package classification, avoiding per-row queries.
        Map<UUID, SeafarerProfile> customers = loadCustomers(items);
        Map<UUID, Item> products = loadProducts(items);

        boolean wantPackage = "Package".equalsIgnoreCase(packageFilter);
        boolean wantNotPackage = "Not Package".equalsIgnoreCase(packageFilter);

        List<ReceivableReportRow> rows = items.stream()
                .filter(ti -> matchesAccount(ti, customers, accountName))
                .filter(ti -> matchesPackage(ti, products, wantPackage, wantNotPackage))
                .map(ti -> toRow(ti, customers, products, accountName))
                .toList();

        BigDecimal total = rows.stream()
                .map(ReceivableReportRow::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        log.info("Receivable report generated — account: {}, rows: {}, total: {}",
                accountName, rows.size(), total);

        return ReceivableReport.builder()
                .rows(rows)
                .totalCount(rows.size())
                .totalAmount(total)
                .build();
    }

    // === Helpers ===

    private Map<UUID, SeafarerProfile> loadCustomers(List<TransactionItem> items) {
        List<UUID> ids = items.stream()
                .map(ti -> ti.getTransaction().getCustomerId())
                .distinct()
                .toList();
        return profileRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(SeafarerProfile::getId, Function.identity()));
    }

    private Map<UUID, Item> loadProducts(List<TransactionItem> items) {
        List<UUID> ids = items.stream()
                .map(TransactionItem::getProductId)
                .distinct()
                .toList();
        return itemRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Item::getId, Function.identity()));
    }

    /** A line matches the account when its customer's employer equals the account name. */
    private boolean matchesAccount(
            TransactionItem ti, Map<UUID, SeafarerProfile> customers, String accountName) {
        if (accountName == null) {
            return false;
        }
        SeafarerProfile customer = customers.get(ti.getTransaction().getCustomerId());
        return customer != null && accountName.equalsIgnoreCase(safe(customer.getEmployer()));
    }

    private boolean matchesPackage(
            TransactionItem ti, Map<UUID, Item> products, boolean wantPackage, boolean wantNotPackage) {
        if (!wantPackage && !wantNotPackage) {
            return true; // "All"
        }
        Item product = products.get(ti.getProductId());
        boolean isPackage = product != null && Boolean.TRUE.equals(product.getIsPackage());
        return wantPackage == isPackage;
    }

    private ReceivableReportRow toRow(
            TransactionItem ti, Map<UUID, SeafarerProfile> customers,
            Map<UUID, Item> products, String accountName) {
        Transaction t = ti.getTransaction();
        SeafarerProfile customer = customers.get(t.getCustomerId());
        Item product = products.get(ti.getProductId());
        boolean isPackage = product != null && Boolean.TRUE.equals(product.getIsPackage());
        BigDecimal amount = nonNull(ti.getPriceSnapshot()).add(nonNull(ti.getProfessionalFee()));

        return ReceivableReportRow.builder()
                .id(ti.getId().toString())
                .transactionId(t.getTransactionId())
                .customerName(displayName(customer))
                .accountName(accountName)
                .description(ti.getDescriptionSnapshot())
                .paymentType(ti.getBillingType())
                .isPackage(isPackage)
                .amount(amount)
                .date(t.getSettledAt() != null ? t.getSettledAt().toLocalDate() : null)
                .build();
    }

    private static BigDecimal nonNull(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private static String safe(String value) {
        return value == null ? "" : value;
    }

    private static String displayName(SeafarerProfile profile) {
        if (profile == null) {
            return "(unknown)";
        }
        String name = (safe(profile.getFirstName()) + " " + safe(profile.getLastName())).trim();
        return name.isBlank() ? "(unnamed)" : name;
    }
}
