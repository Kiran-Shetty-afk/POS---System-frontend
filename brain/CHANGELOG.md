# Brain / project changelog

All entries are dated and versioned for uniqueness.

---

## brain-2026-04-10-019

**Date:** 2026-04-10

**Summary:** Vite dev proxy for `/auth` forwarded **browser GET** requests (e.g. Back/refresh on `/auth/login`) to Spring, which only allows POST on `/auth/login`, returning JSON `Request method 'GET' is not supported`. The `/auth` proxy now uses a `bypass` so GET requests serve the SPA `index.html`; POST (and other API verbs) still proxy to `:5000`.

**Changed:** `vite.config.js`

---

## brain-2026-04-10-018

**Date:** 2026-04-10

**Summary:** Fixed Super Admin (and all roles) seeing `PageNotFound` (404) after login and when using the browser Back button toward that broken state. Root cause: `navigate()` ran before `getUserProfile` finished, so `App` still had `userProfile === null` and rendered the logged-out route tree where `/super-admin` only matched the `*` catch-all. Login now `await`s `dispatch(getUserProfile(jwt)).unwrap()` before any role-based `navigate(..., { replace: true })`.

**Changed:** `src/pages/common/Auth/Login.jsx`

---

## brain-2026-04-10-017

**Date:** 2026-04-10

**Summary:** Reset remote `main` to `59f64c7` (`feat(exports): wire CSV downloads…`) via `git reset --hard` and `git push --force-with-lease`. Removed two commits that were causing problems: `f89a81d` (auth back-navigation / paint fix) and `9817158` (cashier shift summary PDF and routing session fixes). Anyone who had already pulled those commits should reset or rebase to match `origin/main`.

**Changed:** Git history only (no file edits in this step).

---

## brain-2026-04-10-016

**Date:** 2026-04-10

**Summary:** Fixed logged-in users hitting 404 or auth when using the browser Back button or refreshing on app routes. Root cause: `userProfile` was null on the first paint while JWT existed, so `App` rendered the logged-out route tree and `*` matched → `PageNotFound`. Session is now restored in one async pass (profile + store fetch for store admin/manager) behind a full-screen loader until complete. Post-login and onboarding navigations use `replace: true` so Back does not return to login. Added `/auth` → `/auth/login` index redirect and explicit `ROLE_ADMIN` → `/super-admin` after login.

**Changed:** `src/App.jsx`, `src/pages/common/Auth/Login.jsx`, `src/pages/onboarding/Onboarding.jsx`, `src/routes/AuthRoutes.jsx`

---

## brain-2026-04-10-015

**Date:** 2026-04-10

**Summary:** CSV export wired across app surfaces that had Export/Download UI: Branch Reports (per-chart + Export All via `branchAnalytics` thunks + `unwrap()`), Branch Employee Performance dialog (summary rows from on-screen metrics), Super Admin Exports page (generate + recent-row download), Store Admin Sales (daily sales + payment methods from `storeAnalytics`). Reuses shared `src/utils/csvExport.js`.

**Changed:** `src/pages/Branch Manager/Reports/Reports.jsx`, `src/pages/Branch Manager/Employees/EmployeeDialogs.jsx`, `src/pages/SuperAdminDashboard/ExportsPage.jsx`, `src/pages/store/store-admin/Sales.jsx`

---

## brain-2026-04-10-014

**Date:** 2026-04-10

**Summary:** Branch Transactions “Export Transactions” builds a UTF-8 CSV (with BOM for Excel) from Redux `orders` (`getOrdersByBranch`): Order ID, date, cashier, customer, amount, payment, status, type. Added `src/utils/csvExport.js` (`buildCsv`, `downloadCsvFile`).

**Changed:** `src/pages/Branch Manager/Transaction/Transactions.jsx`, `src/utils/csvExport.js`

---

## brain-2026-04-10-013

**Date:** 2026-04-10

**Summary:** Removed POS Terminal header keyboard shortcut hint (`F1…` / `Ctrl+Enter`) from `POSHeader`.

**Changed:** `src/pages/cashier/components/POSHeader.jsx`

---

## brain-2026-04-10-012

**Date:** 2026-04-10

**Summary:** Cashier sidebar visible on all nested routes: from `md` breakpoint the nav is fixed and always shown with `md:ml-64` on main content; below `md`, a layout-level menu bar opens the drawer (only POS had a menu before). Overlay and sidebar close control are mobile-only. `POSHeader` no longer duplicates the menu button; keyboard shortcuts badge tucks on small screens.

**Changed:** `src/pages/cashier/CashierDashboardLayout.jsx`, `src/pages/cashier/components/POSHeader.jsx`, `src/pages/cashier/Sidebar/CashierSideBar.jsx`

---

## brain-2026-04-10-011

**Date:** 2026-04-10

**Summary:** Cashier sidebar `navItems` order documented explicitly: POS Terminal, then Order History, Returns/Refunds, Customers, Shift Summary. `CashierSideBar` active link now uses React Router `useLocation().pathname` instead of the global `location` object.

**Changed:** `src/pages/cashier/CashierDashboardLayout.jsx`, `src/pages/cashier/Sidebar/CashierSideBar.jsx`

---

## brain-2026-04-10-010

**Date:** 2026-04-10

**Summary:** Resolved ESLint errors and warnings across the repo: Vite config `__dirname` for ESM; `react-refresh/only-export-components` disabled for `src/components/ui/**` (shadcn-style re-exports); `no-unused-vars` extended with `argsIgnorePattern` / `caughtErrorsIgnorePattern` for intentional `_` prefixes; removed or fixed unused variables/imports; corrected regex escapes; replaced `if (true)` in shift end handler; wrapped data-fetching effects with `useCallback` where hooks deps required it; debounced product search via `useRef` + `useCallback`; Settings nav now calls `onNavigate` so `setActiveSection` is used; trimmed dead mock data in Reports.

**Changed:** `eslint.config.js`, `vite.config.js`, and numerous files under `src/` (see `git diff`).

---

## brain-2026-04-10-009

**Date:** 2026-04-10

**Summary:** Branch manager notification bell uses branch inventory from `getInventoryByBranch` → `GET /api/inventories/branch/{branchId}` (same as the Inventory page), plus `getProductsByStore` for product names. Only **low stock** lines appear (uses `minQuantity` / `reorderPoint` / etc. when present, otherwise quantity ≤ 5). Footer links to `/branch/inventory`.

**Changed:**

- `src/components/layout/DashboardNotifications.jsx` — `variant="branch"` inventory flow
- `src/pages/Branch Manager/Dashboard/BranchManagerTopbar.jsx` — `viewAllPath` → `/branch/inventory`

---

## brain-2026-04-10-008

**Date:** 2026-04-10

**Summary:** Store admin (POS) notification bell uses the same alerts API as the Alerts page: `getStoreAlerts(storeAdminId)` → `GET /api/store/analytics/{storeAdminId}/alerts`. Payload is flattened into rows (low stock, inactive cashiers, no sales today, refund spikes). (Branch inventory notifications: see brain-2026-04-10-009.)

**Changed:**

- `src/components/layout/DashboardNotifications.jsx` — `variant="store"` loads alerts when `userProfile.id` is available; refetch on popover open; header/footer copy for alerts

---

## brain-2026-04-10-007

**Date:** 2026-04-10

**Summary:** Super Admin notification bell uses the same pending-requests data as the Pending Requests page: `getAllStores("PENDING")` (`GET /api/stores?status=PENDING`). (Store alerts API integration is documented in brain-2026-04-10-008; Branch still uses local demo notifications.)

**Changed:**

- `src/components/layout/DashboardNotifications.jsx` — `variant="superAdmin"` fetches pending stores, maps them to list rows; refetch on popover open without full-screen spinner; “Mark all read” is UI-only (`readIds`); footer links to `/super-admin/requests`
- `src/pages/SuperAdminDashboard/components/SuperAdminTopbar.jsx` — `viewAllPath` set to `/super-admin/requests`

---

## brain-2026-04-10-006

**Date:** 2026-04-10

**Summary:** Dashboard headers: working notification bell (popover with sample items, mark read, unread badge) and user menu (profile summary, Settings link, logout) shared across Store, Branch Manager, and Super Admin topbars.

**Changed:**

- `src/components/layout/DashboardNotifications.jsx` — new
- `src/components/layout/DashboardUserMenu.jsx` — new
- `src/pages/store/Dashboard/StoreTopbar.jsx`, `src/pages/Branch Manager/Dashboard/BranchManagerTopbar.jsx`, `src/pages/SuperAdminDashboard/components/SuperAdminTopbar.jsx` — wired components; Store search field includes leading search icon

**Note:** Notification list is client-side demo data until a notifications API exists. Logout uses existing `user/logout` thunk and `navigate("/auth/login")`.

---

## brain-2026-04-10-005

**Date:** 2026-04-10

**Summary:** Fixed 404 when logged-in users press the browser Back button from `/store` (or other app areas) onto an `/auth/...` history entry.

**Changed:**

- `src/App.jsx` — for each authenticated role’s route tree, added `path="/auth/*"` with `<Navigate to="…" replace />` to the role home (`/store`, `/super-admin`, `/cashier`, `/branch`, or `/auth/onboarding` when store setup is incomplete).

**Reason:** Logged-in layouts did not register `/auth/*`, so restoring `/auth/login` from history matched the catch-all and rendered `PageNotFound`.

---

## brain-2026-04-10-004

**Date:** 2026-04-10

**Summary:** Vite dev proxy: strip `Origin` when forwarding to the backend so Spring does not return 403 “Invalid CORS request” for browser-originated requests.

**Changed:**

- `vite.config.js` — shared `devApiProxy` with `proxyReq.removeHeader("origin")`
- `src/Redux Toolkit/features/auth/authThunk.js` — removed noisy `console.log` of credentials on login

**Reason:** Proxied requests still carried `Origin: http://localhost:5174`, which the API’s CORS rules rejected even though the browser saw same-origin requests to Vite.

---

## brain-2026-04-10-003

**Date:** 2026-04-10

**Summary:** Fixed React `jsx` DOM warning on the landing page and dev CORS for API calls.

**Changed:**

- `src/pages/common/Landing/HeroSection.jsx`, `src/pages/common/Landing/components/TypewriterText.jsx` — removed invalid `jsx` prop on `<style>` (styled-jsx syntax without Next/styled-jsx transform)
- `vite.config.js` — dev server proxy from Vite to `http://localhost:5000` for `/api`, `/auth`, `/onboarding`, `/users`
- `src/utils/api.js` — in development, use relative `baseURL` so requests go through the proxy; optional `VITE_API_BASE_URL` for overrides

**Reason:** Browser warnings and blocked login requests when the app origin (e.g. `:5174`) differed from the API origin (`:5000`).

---

## brain-2026-04-10-002

**Date:** 2026-04-10

**Summary:** Removed the landing page “mobile app” showcase section (download iOS/Android, feature list, and mock phone UI).

**Changed:**

- `src/pages/common/Landing/Landing.jsx` — dropped `MobileAppShowcase` import and render
- Deleted `src/pages/common/Landing/MobileAppShowcase.jsx`

**Reason:** Product request to remove the download-mobile-app block from the marketing landing page.

---

## brain-2026-04-10-001

**Date:** 2026-04-10

**Summary:** Initialized the `brain/` knowledge base.

**Added:**

- `INDEX.md` — master index of numbered brain documents
- `01-project-overview.md` — repository purpose and high-level layout
- `02-stack-and-conventions.md` — stack table and conventions snapshot
- `CHANGELOG.md` — this file

**Reason:** Establish a single place for durable project context separate from the default Vite template `README.md`.
