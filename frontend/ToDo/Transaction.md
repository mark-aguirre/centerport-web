# Transaction — POS-Style Transaction Flow

Build the **Transaction** module under the `(app)` route group as a POS-style
transaction workspace. Follow the CenterPort frontend conventions: App Router pages
under `(app)`, shared `common`/`ui` components, the `api` client in `lib/api.ts`, the
`use-<entity>-form` hook pattern on `useEntityForm`, and the design-system theme
(semantic tokens, compact density, `text-xs`/`text-[11px]` scale). Do **not**
introduce a new data-fetching client, styling approach, or table pattern when an
established one already exists.

> **Naming note.** This module is a point-of-sale sale/charge flow, not an accounting
> "receivable" (money owed but not yet collected). "Receivable" applies only to the
> **Billed Agency** case and is covered by the separate **Receivable Report** page
> (`Receivable.md`, routed at `/receivable/report`). Keep the UI, routes, and backend
> model named after the transaction, and reserve "receivable" for reporting on amounts
> owed. See §22 and §21.

## 1. Overview

Instead of a simple CRUD screen, the Transaction page acts as a **transaction
workspace** where the user can:

1. Select a customer
2. Add products/services
3. Review and configure transaction items
4. Adjust professional fees
5. Select the billing/payment type
6. Mark items as Personal Account when applicable
7. Review the transaction total
8. Settle the transaction
9. Void a previously settled transaction when necessary

### Main Concept

```text
Customer → Add Products → Build Transaction → Configure Items → Review
→ Settle → SETTLED → VOID (if necessary) → VOIDED
```

---

## 2. Route Structure

The Transaction module has two primary areas, both under the `(app)` route group and
registered in `src/config/navigation.ts`:

```text
Transaction
├── Transaction History      → src/app/(app)/transactions/page.tsx
└── New Transaction          → src/app/(app)/transactions/new/page.tsx
```

- History lists and searches existing transactions.
- The new-transaction page is the POS-style workspace.
- Both are Client Components (`"use client"`); wrap any `useSearchParams` usage in a
  `<Suspense>` boundary, and wrap content in `<PageContainer>` with `<PageTitle>`.
- Feature components live in `components/transaction/`; types in
  `components/transaction/types.ts`; form state in `hooks/use-transaction-form.ts`.

---

## 3. Transaction History

The main Transaction page lists existing transactions inside a section card
(`bg-card rounded-lg p-4 shadow-sm border border-primary/10`).

Header (`<PageTitle title="Transaction" ... />`) with a primary action on the
upper-right: `<Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Transaction</Button>`.

Filters row (use shared form components):

- **Search** — `search-bar` from `components/common`.
- **Status** — `<FormSelect>` (All / DRAFT / SETTLED / VOIDED).
- **Date range** — two `<FormField type="date">` (From / To).

Results grid — use the shared table/grid primitives from `components/ui`:

| Column | Description |
| --- | --- |
| Transaction # | Unique transaction number |
| Customer | Customer associated with the transaction |
| Date | Creation / settlement date |
| Total | Total amount (right-aligned, currency-formatted) |
| Billing Type | Application Paid or Billed Agency |
| Status | DRAFT, SETTLED, or VOIDED |
| Actions | View / Void where applicable |

Grid conventions: column headers `text-[11px] font-bold text-primary/70 uppercase
tracking-wider`; body cells `text-xs text-foreground/80`; `Loader2` loading state;
shared `empty-state-card` for empty results; status shown as a small badge using
semantic tokens (e.g. `bg-primary/10` for SETTLED, `bg-destructive/10` for VOIDED —
never hardcoded colors). Currency-format `Total` with the app helper, e.g. `₱1,550.00`.

---

## 4. New Transaction

Clicking **New Transaction** opens the workspace. Recommended layout, expressed as
section cards inside `<PageContainer>`:

```text
NEW TRANSACTION

[ Customer card ]        ← searchable customer selector
[ Add Product card ]     ← searchable product/service selector
[ Transaction Items ]    ← the cart grid
[ Transaction Defaults ] ← billing type + professional fee
[ Totals + actions ]     ← Items / Prof Fees / TOTAL, [ Cancel ] [ Settle ]
```

Use `SectionHeader` on each card and the design-system spacing (`space-y-3` between
cards, `gap-2` within grids).

---

## 5. Step 1 — Select Customer

The transaction begins with a customer, selected via `record-selector` /
`form-autocomplete` from `components/common` (searchable, loaded through `api`).

After selection, show read-only detail (`text-xs`, labels
`text-[11px] font-semibold text-primary/60 uppercase tracking-wider`):

```text
Customer:        Juan Dela Cruz
Application No:  APP-2026-00123
Agency:          ABC Corporation
```

### Rules

- Customer is required.
- Product selection is disabled until a customer is selected.
- Settle stays disabled until a customer and at least one item exist.
- Customer cannot be changed after settlement.

---

## 6. Step 2 — Add Product / Service

After a customer is selected, add products/services via a searchable selector
(`record-selector` / `form-autocomplete`). Selecting a product appends it to the
Transaction Items list; the selector stays available so multiple products can be added.

Example — selecting `Medical Certificate` produces:

| # | Description | Price | Professional Fee | Billing Type |
| - | --- | ---: | ---: | --- |
| 1 | Medical Certificate | ₱500.00 | ₱100.00 | Application Paid |

---

## 7. Transaction Items

The item list is the center of the POS screen. Render with the shared `ui` grid;
right-align amount columns and currency-format them.

| Column | Description |
| --- | --- |
| # | Item number |
| Description | Product/service description |
| Price | Transaction price |
| Professional Fee | Professional fee assigned to the item |
| Billing Type | Application Paid or Billed Agency |
| Personal Account | Whether the item is a personal account |
| Actions | Edit / Remove (icon buttons, `cursor-pointer`, `aria-label`) |

---

## 8. Billing Type

The default billing type is **Application Paid**. Show the current value with a
`<FormSelect>` (not a generic button):

```text
Billing Type
[ Application Paid ▼ ]   → Application Paid | Billed Agency
```

### Values

- **Application Paid** — the application/customer is responsible; treated as paid
  through the application process.
- **Billed Agency** — the amount is intended to be billed to the agency.

---

## 9. Billing Type as a Default

The selected billing type initially acts as a **transaction default**. New items
inherit it:

| Item | Description | Billing Type |
| ---- | --- | --- |
| 1 | Medical Certificate | Application Paid |
| 2 | Laboratory Test | Application Paid |

Each item can override the default when business rules allow:

| Item | Description | Billing Type |
| ---- | --- | --- |
| 1 | Medical Certificate | Application Paid |
| 2 | Laboratory Test | Billed Agency |

This provides flexibility without configuring every item individually.

---

## 10. Professional Fee

Professional Fee is configurable. Transaction default:

```text
Professional Fee
[ ₱100.00 ]
```

New items inherit the default, but the actual fee is stored **at the item level**:

| Item | Product | Price | Professional Fee |
| ---- | --- | ---: | ---: |
| 1 | Medical Certificate | ₱500 | ₱100 |
| 2 | Laboratory Test | ₱800 | ₱150 |

The user can edit the fee when permitted.

---

## 11. Personal Account

Personal Account is preferably an **item-level** property (toggle, e.g. a shadcn
switch or `yes-no-radio`, `cursor-pointer`):

```text
Medical Certificate
Personal Account [ OFF ]
```

When enabled, the system does **not** modify the master Product record. Instead store
`personalAccount = true` and generate the display description dynamically:

```text
Product description: Medical Certificate
personalAccount:     true
Display:             Medical Certificate - Personal Account
```

This keeps product master data clean.

---

## 12. Why Personal Account Should Be Item-Level

A transaction can then contain both normal and personal items:

| Item | Description | Personal Account |
| ---- | --- | --- |
| 1 | Medical Certificate - Personal Account | Yes |
| 2 | Laboratory Test | No |
| 3 | Physical Examination | No |

If business rules require it to apply to the entire transaction, promote the setting
to the transaction level instead.

---

## 13. Editing a Transaction Item

Clicking an item opens an edit dialog (shadcn `Dialog`, form controls via `FormField`
/ `FormSelect`, actions as `<Button size="sm">`):

```text
Edit Transaction Item

Product:            Medical Certificate
Description:        [ Medical Certificate ]
Price:              [ ₱500.00 ]
Professional Fee:   [ ₱100.00 ]
Billing Type:       [ Application Paid ▼ ]
Personal Account:   [ OFF ]

                    [ Remove ] [ Save ]
```

The user can modify the item before settlement.

---

## 14. Product Price Snapshot

Store the price at the time the item is added — do not rely on the current Product
price afterward.

```text
When added:   Medical Certificate  ₱500   → TXN-000123 stores ₱500
Price changes: Medical Certificate  ₱600   → TXN-000123 still shows ₱500
```

The item stores a `price_snapshot`.

---

## 15. Description Snapshot

Same principle for the description — store `description_snapshot` rather than always
reading the current Product description. For Personal Account:

```text
descriptionSnapshot: Medical Certificate - Personal Account
```

This guarantees historical transactions stay accurate if master data changes.

---

## 16. Transaction Total

Show the financial breakdown clearly:

```text
Items                 ₱1,300.00
Professional Fees       ₱250.00
------------------------------------
TOTAL                 ₱1,550.00
```

The **backend** is authoritative for the calculation. The frontend may compute/display
for responsiveness, but the backend recalculates and validates before settlement.

---

## 17. Settle

`<Button size="sm">` is the final action, enabled only when:

```text
✓ Customer selected
✓ At least one product selected
✓ Valid prices
✓ Valid professional fees
✓ Valid billing type
```

Clicking Settle opens a confirmation dialog:

```text
Confirm Settlement

Customer:  Juan Dela Cruz
Items:     2

Items                 ₱1,300.00
Professional Fees       ₱250.00
------------------------------------
TOTAL                 ₱1,550.00

Billing Types:
  Application Paid      ₱500.00
  Billed Agency         ₱800.00

              [ Back ] [ Confirm Settle ]
```

After confirmation: `DRAFT → SETTLED`. Surface the result with a **sonner** toast.

---

## 18. Cancel

Cancel applies to an unfinished transaction (`DRAFT → discard`). Confirm before
discarding:

```text
Cancel Transaction?
All currently selected items will be removed.
[ Continue Editing ] [ Cancel Transaction ]
```

If drafts are not persisted, no database record is needed for a cancelled transaction.

---

## 19. Void

Void applies to an already settled transaction (`SETTLED → VOIDED`). A settled
transaction is **never** physically deleted. Clicking Void opens:

```text
Void Transaction

Transaction:  TXN-000123
Customer:     Juan Dela Cruz
Reason:       [ Customer requested cancellation ]

              [ Back ] [ Confirm Void ]
```

The system records `voidedAt`, `voidedBy`, `voidReason` for an audit trail.

---

## 20. Transaction Status

Recommended statuses:

```text
DRAFT   SETTLED   VOIDED   (optional: CANCELLED if drafts are persisted)
```

State flow:

```text
DRAFT ──CANCEL──▶ DISCARDED
  │
  └──SETTLE──▶ SETTLED ──VOID──▶ VOIDED
```

---

## 21. Recommended Backend Data Model

Name the backend model after the transaction (not "receivable") to stay consistent
with the UI and routes. Reserve "receivable" for reporting on amounts owed.

### Transaction

```text
transaction
------------------------------------------------
transaction_seq, customer_seq, status,
created_at, created_by, settled_at, settled_by,
voided_at, voided_by, void_reason, total_amount
```

### Transaction Item

```text
transaction_item
------------------------------------------------
transaction_item_seq, transaction_seq, product_seq,
description_snapshot, price_snapshot,
professional_fee, payment_type, personal_account
```

> **Backend note.** The backend model is outside these frontend ToDo files. If the
> existing backend already uses `receivable` / `receivable_item`, coordinate a rename
> (or an agreed mapping) so the API paths and table names match the `transaction`
> terminology used here. Flag this rather than silently diverging.

---

## 22. Separation of Concepts

Do not use `Payment Type` to mean an actual payment method. What the UI calls
"Payment Type" is really a **Billing Type / Payment Responsibility**:

```text
Billing Type            Payment Method (future)
├── Application Paid     ├── Cash
└── Billed Agency        ├── GCash
                         ├── Bank Transfer
                         └── Credit Card
```

Keep these separate to avoid a future database redesign when real payment processing
is added. By the same reasoning, keep the **transaction** (what happened) separate
from a **receivable** (money owed but not yet collected) — the latter is a reporting
view over Billed Agency amounts, handled by the Receivable Report page.

---

## 23. UI Terminology

| Concept | Recommended UI label |
| --- | --- |
| Payment Type | Billing Type |
| Professional Fee | Professional Fee |
| Personal Account | Personal Account |
| Select Product | Add Product / Service |
| List | Transaction Items |
| The module / record | Transaction |
| Settle / Cancel / Void | Settle / Cancel / Void |

"Cart" is fine internally (POS-like behavior), but **Transaction Items** reads better
in the business UI. Use "Receivable" only for the amounts-owed report, not for this
transaction module.

---

## 24. Final User Flow

```text
1. Open Transaction
2. Click "+ New Transaction"
3. Select Customer
4. Search / Select Product
5. Product added to Transaction Items
6. Add more products if needed
7. Configure: Billing Type, Professional Fee, Personal Account
8. Edit individual items if necessary
9. Review items and total
10. Click Settle → Confirm Settlement
11. Transaction becomes SETTLED
12. If necessary, later Void the transaction
```

---

## 25. Design Principle

> **Products define what is being sold/charged. Transaction Items define what actually
> happened in the transaction.**

```text
Product  →  provides defaults
Transaction Item  →  stores transaction snapshot
Transaction  →  represents the completed transaction
```

This keeps the design POS-friendly while preserving historical accuracy,
auditability, and room for future billing/payment features.

---

## 26. Data Access & Before Done

- Add typed endpoints to `lib/api.ts` (list/create/update transactions, add/edit/remove
  items, settle, void, plus customer/product lookups) built on the shared `httpClient`.
  Keep types in `components/transaction/types.ts`.
- Pass backend paths (e.g. `/api/transactions`) to the client — the `/api/backend`
  prefix is added automatically. Never call the backend host directly and never read
  `BACKEND_API_URL` in client code.
- Run `npm run type-check` and `npm run lint`. Confirm dark mode via semantic tokens,
  and verify keyboard access, focus styles, and `aria-label`s on icon-only actions.
