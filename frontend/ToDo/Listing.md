# Prompt: Item Listing & Management Page

Build an **Item Listing** page under the `(app)` route group for maintaining
billable items — medical services, laboratory examinations, packages, and other
chargeable items. The page lets authorized users search, view, add, edit, and
delete items along with their descriptions and prices.

Follow the CenterPort frontend conventions: App Router page under `(app)`, shared
`common`/`ui` components, the `api` client in `lib/api.ts`, and the design-system
theme (semantic tokens, compact density, `text-xs`/`text-[11px]` scale). Do **not**
introduce a new data-fetching client, styling approach, or table pattern when an
established one already exists.

## Route & Placement

- Create the route at `src/app/(app)/listing/page.tsx`.
- Register it in `src/config/navigation.ts` so it appears in the sidebar/mobile nav
  (`{ title: "Item Listing", href: "/listing", icon: <LucideIcon> }`).
- Wrap the page body in `<PageContainer>` and use `<PageTitle>` for the header.
- If the page reads `useSearchParams`, wrap the content in a `<Suspense>` boundary.
- Keep the file a Client Component (`"use client"`) since it manages search and grid state.

## 1. Page Header

Use `<PageTitle>` at the top of the container:

- **title:** `Item Listing`
- **description:** `Manage available services, examinations, packages, and their prices.`

Place primary actions on the upper-right using shadcn `<Button size="sm">`:

- **Add Item** — filled button, `<Plus className="w-4 h-4 mr-1" /> Add Item`.
- **Refresh** — `variant="outline"`, `<RefreshCw className="w-4 h-4 mr-1" /> Refresh`.
  Swap the icon for `<Loader2 className="w-4 h-4 mr-1 animate-spin" />` while loading.

## 2. Search Section

Reuse the shared `search-bar` from `components/common` where possible; otherwise
follow the raw-input styling from the design system. Place it in a section card
(`bg-card rounded-lg p-4 shadow-sm border border-primary/10`) above the grid.

### 2.1 Search Field

**Control:** text input (`h-8`, `text-xs`, `bg-white border border-primary/30 rounded-md`,
`dark:bg-input/30`) with a leading `<Search className="w-4 h-4 text-muted-foreground" />`.

- Search across **Item name**, **Description**, and **Price**.
- Case-insensitive; trim leading/trailing whitespace before matching.
- Execute on **Enter**.
- Optionally support search-as-you-type with a short debounce (~250-300ms).

### 2.2 Clear Button

Provide a **Clear** button beside the field (`variant="outline" size="sm"`,
`cursor-pointer`). When clicked:

1. Clear the search value.
2. Reset results to the full item list.
3. Return the grid to the first page.
4. Refocus the search input.

## 3. Results Grid

Display matching items in a sortable, paginated data grid inside a section card.
Use the shared table/grid primitives from `components/ui` rather than a new table.

### 3.1 Columns

| Column | Description |
|---|---|
| Item | Name of the medical service, laboratory examination, package, or billable item |
| Description | Description of the item or service |
| Price | Current price (right-aligned, currency-formatted) |
| Actions | Edit / Delete controls |

Column headers use `text-[11px] font-bold text-primary/70 uppercase tracking-wider`.
Body cells use `text-xs text-foreground/80`.

### 3.2 Grid Features

- Single-row selection with the selected row highlighted (`bg-primary/5` or similar
  semantic token — never a hardcoded color).
- Column sorting.
- Pagination with a configurable page size.
- Alternating row colors using muted tokens (`bg-muted/30`).
- Total record count shown near the grid footer.
- **Loading state:** centered `<Loader2 className="w-8 h-8 animate-spin text-primary" />`.
- **Empty state:** use the shared `empty-state-card` from `components/common`.
- Responsive horizontal scroll on narrow viewports.
- Right-aligned, currency-formatted **Price** column.

Format prices with the application's currency helper (peso, two decimals), e.g.:

```text
₱3,400.00
```

## 4. Actions & Feedback

- **Edit** opens the item in edit mode (dialog or dedicated edit view following the
  existing form pattern — `use-<entity>-form` on `useEntityForm`, `FormField` /
  `FormSelect`, `FormToolbar` for save/cancel).
- **Delete** confirms before removing, then refreshes the grid.
- Surface success/error with **sonner** toasts.
- All clickable elements (buttons, row actions, icon buttons) must use `cursor-pointer`.

## 5. Data Access

- Add typed endpoints for items to `lib/api.ts` (list, create, update, delete),
  built on the shared `httpClient`. Keep item types in `components/listing/types.ts`
  and import them into `lib/api.ts`.
- Pass backend paths (e.g. `/api/items`) to the client — the `/api/backend` prefix
  is added automatically. Never call the backend host directly from the browser.

## 6. Before Done

- Run `npm run type-check` and `npm run lint`.
- Confirm dark mode via semantic tokens (no hardcoded colors).
- Verify keyboard access, focus styles, and `aria-label`s on icon-only actions.
