-- ============================================================================
-- V34: Create items and transactions tables (POS billing domain)
-- ============================================================================
-- Introduces the point-of-sale billing model:
--   * items             — master list of billable services / examinations /
--                         packages (also serves as the "product" catalog).
--   * transactions      — a settled/voided sale/charge against a customer
--                         (a seafarer profile). Named after the transaction,
--                         NOT "receivable"; "receivable" is a reporting view
--                         over Billed Agency amounts (see the report endpoints).
--   * transaction_items — line-item snapshots (price + description captured at
--                         the time the item was added), preserving historical
--                         accuracy if item master data later changes.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- items
-- ---------------------------------------------------------------------------
CREATE TABLE items (
    id                UUID PRIMARY KEY,
    item_id           VARCHAR(12) UNIQUE,
    name              VARCHAR(255) NOT NULL,
    description       VARCHAR(1000),
    price             NUMERIC(12, 2) NOT NULL DEFAULT 0,
    professional_fee  NUMERIC(12, 2) NOT NULL DEFAULT 0,
    is_package        BOOLEAN NOT NULL DEFAULT FALSE,
    active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_date      TIMESTAMP NOT NULL,
    updated_date      TIMESTAMP NOT NULL
);

CREATE SEQUENCE itm_seq START WITH 1 INCREMENT BY 1;

CREATE INDEX idx_items_name ON items (LOWER(name));
CREATE INDEX idx_items_active ON items (active);
CREATE INDEX idx_items_is_package ON items (is_package);

-- ---------------------------------------------------------------------------
-- transactions
-- ---------------------------------------------------------------------------
CREATE TABLE transactions (
    id                       UUID PRIMARY KEY,
    transaction_id           VARCHAR(12) UNIQUE,
    customer_id              UUID NOT NULL,
    status                   VARCHAR(20) NOT NULL,
    default_billing_type     VARCHAR(40) NOT NULL,
    default_professional_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount             NUMERIC(12, 2) NOT NULL DEFAULT 0,
    settled_at               TIMESTAMP,
    voided_at                TIMESTAMP,
    void_reason              VARCHAR(1000),
    created_date             TIMESTAMP NOT NULL,
    updated_date             TIMESTAMP NOT NULL,
    CONSTRAINT fk_transactions_customer
        FOREIGN KEY (customer_id) REFERENCES seafarer_profiles (id)
);

CREATE SEQUENCE txn_seq START WITH 1 INCREMENT BY 1;

CREATE INDEX idx_transactions_customer ON transactions (customer_id);
CREATE INDEX idx_transactions_status ON transactions (status);
CREATE INDEX idx_transactions_created_date ON transactions (created_date);

-- ---------------------------------------------------------------------------
-- transaction_items
-- ---------------------------------------------------------------------------
CREATE TABLE transaction_items (
    id                   UUID PRIMARY KEY,
    transaction_id       UUID NOT NULL,
    product_id           UUID NOT NULL,
    description_snapshot  VARCHAR(1000) NOT NULL,
    price_snapshot       NUMERIC(12, 2) NOT NULL DEFAULT 0,
    professional_fee     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    billing_type         VARCHAR(40) NOT NULL,
    personal_account     BOOLEAN NOT NULL DEFAULT FALSE,
    line_no              INT NOT NULL DEFAULT 0,
    created_date         TIMESTAMP NOT NULL,
    updated_date         TIMESTAMP NOT NULL,
    CONSTRAINT fk_transaction_items_transaction
        FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE CASCADE,
    CONSTRAINT fk_transaction_items_product
        FOREIGN KEY (product_id) REFERENCES items (id)
);

CREATE INDEX idx_transaction_items_transaction ON transaction_items (transaction_id);
CREATE INDEX idx_transaction_items_billing_type ON transaction_items (billing_type);
CREATE INDEX idx_transaction_items_product ON transaction_items (product_id);

-- ============================================================================
-- Seed data: a few billable items so the catalog / product search is usable.
-- ============================================================================
INSERT INTO items (id, item_id, name, description, price, professional_fee, is_package, active, created_date, updated_date)
VALUES
    (gen_random_uuid(), 'ITM00000001', 'Medical Certificate',   'Medical Certificate',          500.00, 100.00, FALSE, TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'ITM00000002', 'Laboratory Test',       'General laboratory test',      800.00, 150.00, FALSE, TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'ITM00000003', 'Physical Examination',  'Physical examination',         400.00,  80.00, FALSE, TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'ITM00000004', 'PEME Package',          'Pre-employment medical package', 3400.00, 0.00, TRUE,  TRUE, NOW(), NOW());

ALTER SEQUENCE itm_seq RESTART WITH 5;
