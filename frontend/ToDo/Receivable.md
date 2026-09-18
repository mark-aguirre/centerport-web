# Prompt: Receivable Report Page

Build a **Receivable Report** page under the `(app)` route group for generating and
reviewing receivables filtered by account, payment type, package classification, and
date range.

Follow the CenterPort frontend conventions: App Router page under `(app)`, shared
`common`/`ui` components, the `api` client in `lib/api.ts`, and the design-system
theme (semantic tokens, compact density, `text-xs`/`text-[11px]` scale). Do **not**
introduce a new data-fetching client, styling approach, or table pattern when an
established one already exists.

## Route & Placement

- Create the route at `src/app/(app)/receivable/report/page.tsx`.
  (Use the `/receivable/report` path so it does **not** collide with the POS-style
  Transaction module in `Transaction.md`, which owns `/transactions`.)
- Register it in `src/config/navigation.ts` so it appears in the sidebar/mobile nav
  (`{ title: "Receivable Report", href: "/receivable/report", icon: <LucideIcon> }`).
- Wrap the page body in `<PageContainer>` and use `<PageTitle>` for the header
  (title: `Receivable Report`, description: a short helper line).
- If the page reads `useSearchParams`, wrap the content in a `<Suspense>` boundary.
- Keep the file a Client Component (`"use client"`) since it manages filter and
  report state.

## 1. Filters Section

Group all filters in a section card
(`bg-card rounded-lg p-4 shadow-sm border border-primary/10`) with a
`<SectionHeader title="Filters" icon={Filter} />`. Lay filters out on a grid
(`grid grid-cols-3 gap-2`, wrapping as needed). Use the shared form components rather
than raw inputs where they fit.

### 1.1 Account

**Control:** searchable select — use the shared `form-autocomplete` (or
`record-selector`) from `components/common`.

- Load company accounts from the backend via the `api` client.
- Allow searching and selecting a single account.
- Show a required asterisk and validate when the field is required.

### 1.2 Payment Type

**Control:** `<FormSelect>` from `components/common`.

Options come from system configuration / payment-type records, e.g.:

- Application Paid
- Company Account
- Cash
- Other configured payment categories

Load the options through `lib/api.ts` rather than hardcoding where possible.

### 1.3 Package Filter

**Control:** inline radio group following the design-system radio pattern
(`w-4 h-4 accent-primary` inputs, `text-xs text-foreground/80` labels,
`cursor-pointer` on each wrapping `<label>`, `role="radiogroup"` + `aria-label`).

Options:

- Package
- Not Package
- All  ← **default**

### 1.4 Date Range

Two `<FormField type="date">` controls:

- **From Date**
- **To Date**

Default the range to the **current month** (first day → today) using `date-fns`.

## 2. Actions

Place actions on the upper-right of the header or the filter card footer using
shadcn `<Button size="sm">`. All clickable elements use `cursor-pointer`.

### 2.1 Generate

`<Button size="sm">` with `<FileText className="w-4 h-4 mr-1" /> Generate`. While
running, swap the icon for `<Loader2 className="w-4 h-4 mr-1 animate-spin" />` and
disable the button.

On click:

1. Validate the selected filter values.
2. Verify the account is selected when required.
3. Validate the date range:

   ```text
   From Date <= To Date
   ```

4. On invalid input, surface the message with a **sonner** toast (or inline
   `text-destructive` helper) and stop.
5. On success, fetch the report through the `api` client and render the results.

### 2.2 Clear / Reset (optional)

`variant="outline"` button that resets filters to defaults (Package = All,
date range = current month, cleared account/payment type) and clears results.

## 3. Results

Render the generated report in a section card below the filters.

- Use the shared table/grid primitives from `components/ui` — not a new table.
- Column headers: `text-[11px] font-bold text-primary/70 uppercase tracking-wider`.
- Body cells: `text-xs text-foreground/80`; right-align and currency-format all
  amount columns (peso, two decimals) via the app currency helper, e.g. `₱3,400.00`.
- **Loading state:** centered `<Loader2 className="w-8 h-8 animate-spin text-primary" />`.
- **Empty state:** shared `empty-state-card` from `components/common` with a message
  prompting the user to adjust filters and Generate again.
- Show a total record count and, where relevant, a summary/total row.
- Responsive horizontal scroll on narrow viewports.

## 4. Printing / Export (if required)

If a printable report is needed, route it through the external PrintIO service using
the shared helpers (`lib/printio.ts`, `lib/print-request.ts`, `lib/print-pdf.ts`) and
a feature `printPayload`-style mapper. Do not build a bespoke PDF path.

## 5. Data Access

- Add typed endpoints for the report and its lookups (accounts, payment types) to
  `lib/api.ts`, built on the shared `httpClient`. Keep receivable types in
  `components/receivable/types.ts` and import them into `lib/api.ts`.
- Pass backend paths (e.g. `/api/receivables/report`) to the client — the
  `/api/backend` prefix is added automatically. Never call the backend host directly
  from the browser and never read `BACKEND_API_URL` in client code.
- This report reads over settled transactions (see `Transaction.md`), surfacing the
  amounts owed (typically the **Billed Agency** billing type). Keep the transaction
  types in `components/transaction/types.ts`; add report-specific types under
  `components/receivable/types.ts` if needed.

## 6. Before Done

- Run `npm run type-check` and `npm run lint`.
- Confirm dark mode via semantic tokens (no hardcoded colors).
- Verify keyboard access, focus styles, and `aria-label`s on filter controls and
  icon-only actions.
