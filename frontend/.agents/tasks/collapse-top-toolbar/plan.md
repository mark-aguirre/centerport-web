# Implementation Plan — Collapse / Minimize the Top Toolbar

Add an Office/Windows-style "hide ribbon" feature to the CenterPort top navigation.
When collapsed, the tall quick-access icon toolbar (TopNav Row 2) is hidden to
reclaim vertical space; a toggle button in the menu bar (Row 1) expands it again.
The preference persists across reloads via `localStorage`, matching the existing
full-width / nav-mode toggles.

## Design decisions (grounded in the code)

- **State lives in `layout-provider.tsx`.** Add `toolbarCollapsed: boolean` +
  `toggleToolbarCollapsed()` (and a `setToolbarCollapsed` setter for symmetry with
  `fullWidth`). It is persisted in `localStorage` under a new key
  `centerport-toolbar-collapsed`, read with `useSyncExternalStore` and written via a
  dispatched `StorageEvent`, exactly like `fullWidth`. No new state manager — this is
  the explicit instruction and matches `navMode` / `fullWidth`.
- **What hides vs. stays when collapsed:**
  - **Row 1 (menu bar + right-side controls): always visible.** It holds the new
    collapse toggle, so it must never hide.
  - **Row 2 (quick-access colorful icon toolbar): hidden when collapsed.** This is
    the tall band (`w-24` tiles, ~64px) and the real vertical-space win — the
    "ribbon" being hidden.
  - **Row 3 (CRUD action strip, `#app-header-actions`): stays mounted, unchanged.**
    `form-toolbar.tsx` portals CRUD buttons/search into `#app-header-actions` via
    `usePortalTarget` (`getElementById` through `useSyncExternalStore`). Collapsing
    must NOT unmount this node or the CRUD buttons/search vanish. Row 3 keeps its
    existing `showActionBar` gating and is independent of `toolbarCollapsed`.
- **Why hide Row 2 (not Row 3):** Row 2 is pure navigation duplicated in Row 1's
  dropdowns, so hiding it loses no functionality — the model matches Office's "hide
  ribbon" (commands remain reachable from the menus). Row 3 carries live form
  actions and must remain.
- **navMode = sidebar:** `TopNav` renders only in `navMode === "topbar"` (see
  `app-layout.tsx`). The toggle lives inside `TopNav` Row 1, so in sidebar mode it is
  simply absent — a no-op by construction. No extra guarding needed.
- **Anti-flash on reload:** mirror the `data-full-width` approach. Add a blocking
  `<script>` in `app/layout.tsx` that sets `data-toolbar-collapsed="true"` on
  `<html>` from `localStorage` before paint, and have `LayoutProvider` keep that
  attribute in sync in an effect. Row 2's visibility is driven by the
  `toolbarCollapsed` value (default `false` on both server and first client paint, so
  hydration stays consistent); the attribute only guards the pre-hydration flash and
  can also back an optional CSS fallback. Keep `suppressHydrationWarning` where the
  surrounding header already uses it.
- **Icon + accessibility:** use `lucide-react` `ChevronUp` (collapse) / `ChevronDown`
  (expand) in a ghost icon `Button` wrapped in `Tooltip`, following
  `full-width-toggle.tsx` / `nav-mode-toggle.tsx` byte-for-byte in structure. Set
  `aria-label` and tooltip text to "Collapse toolbar" / "Expand toolbar", and
  `aria-expanded={!toolbarCollapsed}` on the button so screen readers announce state.

## Steps

- [ ] 1. Add toolbar-collapsed state to the layout provider.
      In `LayoutProvider`, add constant `TOOLBAR_COLLAPSED_KEY = "centerport-toolbar-collapsed"`,
      snapshot helpers `getToolbarCollapsedSnapshot` (returns
      `localStorage.getItem(TOOLBAR_COLLAPSED_KEY) === "true"`) and
      `getToolbarCollapsedServerSnapshot` (returns `false`), a
      `useSyncExternalStore` call reusing `subscribeToStorage`, and the
      `setToolbarCollapsed` / `toggleToolbarCollapsed` callbacks that write
      `localStorage` and dispatch `new StorageEvent("storage", { key: TOOLBAR_COLLAPSED_KEY })`
      — copy the `fullWidth` implementation exactly. Add an effect that sets/removes
      `document.documentElement` attribute `data-toolbar-collapsed` from the value
      (mirrors the `data-full-width` effect). Extend `LayoutContextValue` and the
      provider `value` with `toolbarCollapsed`, `setToolbarCollapsed`,
      `toggleToolbarCollapsed`.
      Files: `src/components/layout-provider.tsx`
      Verify: `npm run type-check` — no errors; `useLayout()` now exposes the new members.

- [ ] 2. Create the ToolbarCollapseToggle control.
      New ghost icon button + tooltip following `full-width-toggle.tsx` exactly.
      Reads `{ toolbarCollapsed, toggleToolbarCollapsed }` from `useLayout()`. Renders
      `ChevronDown` when collapsed (tap to expand) and `ChevronUp` when expanded (tap
      to collapse). Sets `aria-label` = "Expand toolbar" / "Collapse toolbar",
      `aria-expanded={!toolbarCollapsed}`, `className="h-8 w-8"`, and tooltip content
      matching the label.
      Files: `src/components/layout/toolbar-collapse-toggle.tsx` (new)
      Verify: `npm run type-check` and `npm run lint` — compiles and lints clean.

- [ ] 3. Wire the toggle into TopNav Row 1 and gate Row 2 on the collapsed state.
      In `top-nav.tsx`: import `ToolbarCollapseToggle` and pull `toolbarCollapsed`
      from the existing `useLayout()` destructure (currently `{ fullWidth }`). Render
      `<ToolbarCollapseToggle />` inside the Row 1 right-side controls `div`
      (alongside `NavModeToggle` / `FullWidthToggle`). Wrap the Row 2 block (the
      `overflow-x-auto` quick-access toolbar) so it renders only when
      `!toolbarCollapsed` (conditional render, or an `hidden` class driven by the
      flag — either is fine as long as Row 2 is the only thing affected). Leave Row 1
      and the Row 3 `showActionBar` block untouched so `#app-header-actions` stays
      mounted whenever its normal gating allows.
      Files: `src/components/layout/top-nav.tsx`
      Verify: `npm run type-check` — no errors.

- [ ] 4. Add the pre-hydration anti-flash script for the collapsed attribute.
      In `app/layout.tsx`, extend the existing blocking `<script>` with a block that
      reads `centerport-toolbar-collapsed` and sets
      `document.documentElement.setAttribute("data-toolbar-collapsed","true")` when
      `=== "true"` (wrapped in try/catch like the full-width block).
      Files: `src/app/layout.tsx`
      Verify: `npm run type-check` — no errors.

- [ ] 5. Full verification and manual smoke check.
      Files: none (verification only).
      Verify: run `npm run type-check` and `npm run lint` from `frontend/` — both
      pass with no new errors/warnings. Then `npm run dev` and manually confirm, in
      topbar mode: (a) the collapse button in Row 1 hides Row 2 and the vertical space
      is reclaimed; (b) on a form page (e.g. a Seabase/profile CRUD screen) the Row 3
      CRUD buttons and search still appear while collapsed (portal target intact);
      (c) reloading the page preserves the collapsed/expanded state with no visible
      flash of Row 2; (d) switching to sidebar mode hides the toggle entirely and the
      app behaves as before.

## Notes / assumptions

- No automated test framework exists in `frontend/` (package.json defines only
  `dev`, `build`, `start`, `lint`, `type-check`), so verification is `type-check` +
  `lint` plus the manual smoke check above — consistent with how the sibling toggles
  ship.
- Row 2 is chosen as the collapsible band because it is the tall, purely-navigational
  strip; if product later wants Row 1 to also shrink, that is an additive follow-up
  and does not change the state/persistence design here.

## Implementation note (iteration 1 — SUPERSEDED)

> NOTE: the row-hiding approach described below was replaced during the same
> iteration by COMPACT mode per a requirement change. See "Implementation note
> (compact mode — final)" at the end of this file for the shipped behavior.

Implemented per the plan. Summary for the reviewer:

**Files changed/created:**
- `src/components/layout-provider.tsx` — added `TOOLBAR_COLLAPSED_KEY`
  (`centerport-toolbar-collapsed`), `getToolbarCollapsedSnapshot` /
  `getToolbarCollapsedServerSnapshot`, a `useSyncExternalStore` call reusing
  `subscribeToStorage`, a `data-toolbar-collapsed` sync effect, and
  `toolbarCollapsed` / `setToolbarCollapsed` / `toggleToolbarCollapsed` on the
  context value and `LayoutContextValue`. Copied the `fullWidth` implementation
  exactly (localStorage + dispatched `StorageEvent`). No new state manager.
- `src/components/layout/toolbar-collapse-toggle.tsx` (new) — ghost icon `Button`
  in a `Tooltip`, following `full-width-toggle.tsx` structure. `ChevronUp` =
  collapse (expanded state), `ChevronDown` = expand (collapsed state).
  `aria-label` + tooltip = "Collapse toolbar" / "Expand toolbar";
  `aria-expanded={!toolbarCollapsed}`.
- `src/components/layout/top-nav.tsx` — imported and rendered
  `<ToolbarCollapseToggle />` first in the Row 1 right-side controls; pulled
  `toolbarCollapsed` from `useLayout()`; added `hidden` (via `cn`) to Row 2 (the
  quick-access toolbar) when collapsed, plus a `data-toolbar-quick-access`
  marker and `suppressHydrationWarning` for the pre-hydration CSS hook.
- `src/app/layout.tsx` — extended the blocking `<script>` to set
  `data-toolbar-collapsed="true"` on `<html>` from localStorage before paint.
- `src/app/globals.css` — `@layer base` rule hiding
  `[data-toolbar-quick-access]` under `html[data-toolbar-collapsed="true"]` so
  Row 2 does not flash in before hydration.

**Behavior / persistence / portal decisions:**
- Persistence is identical to `fullWidth`: localStorage key
  `centerport-toolbar-collapsed`, read via `useSyncExternalStore`, written with
  a dispatched `StorageEvent` (same-tab + cross-tab). Survives reload; anti-flash
  via the blocking script + CSS.
- Portal target intact: only Row 2 is hidden. Row 3 (`#app-header-actions`,
  the FormToolbar portal target) is untouched and stays mounted whenever its
  existing `showActionBar` gating allows, so CRUD buttons/search never disappear
  when collapsed.
- navMode = sidebar: `TopNav` (and therefore the toggle) only renders in topbar
  mode, so the toggle is absent in sidebar mode by construction — a no-op with no
  extra guarding, matching how the sibling toggles rely on their render location.
- Toggle stays visible when collapsed (it lives in Row 1, which never hides).

**Verification (run from `frontend/`):**
- `npm run type-check` → `tsc --noEmit`, exit 0, no errors.
- `npm run lint` → `eslint`, no findings, clean.
- No dev server started. No automated test framework exists in `frontend/`
  (package.json defines only dev/build/start/lint/type-check), consistent with
  how the sibling toggles ship.

## Implementation note (compact mode — final)

Requirement changed mid-iteration: do NOT hide any rows. Instead the top
toolbar gains a COMPACT mode — the quick-access toolbar (Row 2) stays fully
visible but its icons shrink and text labels are hidden. Nothing is unmounted.

**Files changed/created (final state):**
- `src/components/layout-provider.tsx` — state is `toolbarCompact` with
  `setToolbarCompact` / `toggleToolbarCompact`, persisted under localStorage key
  `centerport-toolbar-compact` via `useSyncExternalStore` + dispatched
  `StorageEvent` (copied from the `fullWidth` implementation). A `useEffect`
  keeps `data-toolbar-compact` on `<html>` in sync. There are ZERO remaining
  references to `toolbarCollapsed` / `toggleToolbarCollapsed` anywhere in
  `src/` (grepped — no matches).
- `src/components/layout/toolbar-collapse-toggle.tsx` — ghost icon `Button` in a
  `Tooltip`, same shape as `full-width-toggle.tsx`. `Shrink` icon = enter compact
  (normal state); `Expand` icon = restore (compact state). `aria-label` +
  tooltip = "Compact toolbar" / "Expand toolbar"; `aria-pressed={toolbarCompact}`.
  (Component filename kept as `toolbar-collapse-toggle.tsx` to match the plan's
  path; it exports `ToolbarCollapseToggle`.)
- `src/components/layout/top-nav.tsx` — renders `<ToolbarCollapseToggle />` first
  in the Row 1 right-side controls; pulls `toolbarCompact` from `useLayout()`.
  Row 2 is NEVER hidden. In compact mode: row padding tightens
  (`py-0.5` vs `py-1.5`); each tile narrows (`w-12` vs `w-24`, `gap-0` vs
  `gap-1`); the icon shrinks to `h-5 w-5` (20px) from `h-7 w-7` (28px) — about
  71%, a gentle reduction per the "~75-80%, comfortably clickable" adjustment,
  NOT half; and the text label `<span>` is not rendered (icon-only). The Link
  keeps `title` + a new `aria-label={label}` so icon-only buttons stay
  accessible. `data-toolbar-quick-access` + `suppressHydrationWarning` remain on
  the Row 2 container for the anti-flash hook.
- `src/app/layout.tsx` — blocking `<script>` sets `data-toolbar-compact="true"`
  on `<html>` from localStorage before paint.
- `src/app/globals.css` — `@layer base` rule that, under
  `html[data-toolbar-compact="true"]`, tightens `[data-toolbar-quick-access]`
  vertical padding pre-hydration to roughly match the compact look and limit the
  resize flash. (It does NOT hide the row — compact keeps it visible.)

**Behavior / persistence / portal decisions:**
- ReferenceError resolved: the old `toolbarCollapsed && "hidden"` on the Row 2
  className is gone; the symbol no longer exists and is not referenced anywhere.
- Portal target intact: no rows are hidden, so Row 3 (`#app-header-actions`, the
  FormToolbar portal target) is always mounted when its existing `showActionBar`
  gating allows — CRUD buttons/search are never affected by compact mode.
- Persistence identical to `fullWidth`: key `centerport-toolbar-compact`, read
  via `useSyncExternalStore`, written with a dispatched `StorageEvent`
  (same-tab + cross-tab). Survives reload.
- Anti-flash: the server + first-client snapshot is `false`, so hydration stays
  consistent; the blocking script sets `data-toolbar-compact` before paint and
  the CSS fallback tightens the row padding so the compact size does not
  noticeably flash. The precise half-step icon/label styling is driven by the
  React `toolbarCompact` flag post-hydration (a small, acceptable size settle on
  first paint — labels/icon utility classes are too dynamic to fully replicate in
  static CSS without brittleness).
- navMode = sidebar: `TopNav` (and the toggle) render only in topbar mode, so the
  toggle is absent in sidebar mode by construction — a no-op needing no extra
  guarding, matching how the sibling toggles rely on their render location.
- Toggle stays visible in compact mode (it lives in Row 1, which is unchanged).

**Verification (run from `frontend/`):**
- `npm run type-check` → `tsc --noEmit`, exit 0, no errors.
- `npm run lint` → `eslint`, no findings (empty output), clean.
- No dev server started.
