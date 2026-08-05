# INKOTANYISINCE90 — Pre-Deployment Refactor Tracker

Status legend: [ ] = not started, [x] = done

## Structural / Critical
- [x] C1 Fix `dnsmpi/layout.tsx` nested `<html>/<body>` + duplicate CartProvider
- [x] C2 Remove duplicate `<Footer />` from `mens`/`womens` pages
- [x] C3 Fix `next.config.ts` (restored `turbopack.root` to pin workspace root)
- [x] C4 Fix `globals.css` undefined `--font-inter` reference
- [x] C5 Make `mens`/`womens` use `getStoredProducts()` (admin-added products)
- [x] C6 Recreate `ProductDetails.tsx` (was deleted but still imported by product page)
- [x] C7 Secure admin login via server-side `ADMIN_PASSWORD` env (removed client-side `admin123` fallback)

## Responsive / Layout
- [x] R1 Fix `cart/page.tsx` rigid 2-column grid → collapse on mobile
- [x] R2 Fix checkout form split columns (`35%/65%`) → stack on mobile
- [x] R3 Enlarge touch targets in CartDrawer / cart page
- [x] R4 Standardize header heights / `tshirts` page padding

## Visual / Polish
- [x] V1 Remove client-side inline `<link>` font tags (cart, order-status, cookies)
- [x] V2 Add product name + price to `ProductCard`
- [x] V3 Add full SEO metadata (openGraph, twitter, metadataBase, robots)
- [x] V4 Add loading / error / not-found boundaries
- [x] V5 Improve z-index / stacking consistency
- [x] V6 Remove dead Google Fonts preconnect from `layout.tsx`

## Functional / Cleanup
- [x] F1 Remove dead components (ProductHeader, ProductScroll, RelatedProducts, AddToCartForm)
- [x] F2 Remove unused dependencies (axios, dotenv, cloudinary, supabase, uuid, free-regular-svg-icons)
- [x] F3 Add `data/*.json` to `.gitignore`
- [x] F4 Remove fake "Cloudflare" captcha branding on dnsmpi
- [x] F5 Remove dead `.cloudflare-icon` CSS from dnsmpi
- [x] F6 Add `.env.example` documenting env vars

## Database / Persistence (Supabase)
- [x] DB1 Install `@supabase/supabase-js` dependency
- [x] DB2 Add `src/lib/supabase.ts` (server-only admin client, guarded by env vars)
- [x] DB3 Add `supabase/schema.sql` (orders, subscribers, dnsmpi_requests, admin_products + RLS)
- [x] DB4 Add `src/lib/db.ts` (order persistence layer: Supabase-first, file fallback)
- [x] DB5 Point payment initiate/callback/status routes at `db.ts`
- [x] DB6 Migrate DNSMPI route to write to Supabase (file fallback when unconfigured)
- [x] DB7 Migrate `subscribers.ts` to use Supabase (file fallback when unconfigured)
- [x] DB8 Add `.env.example` documenting `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- [x] DB9 Allow `.env.example` / `.env.local.example` to be committed in `.gitignore`
- [x] DB10 Document Supabase setup in README

## Verification
- [x] `npx tsc --noEmit` passes
- [x] `npm run build` passes — 54 pages generated, robots.txt + sitemap.xml served, no warnings
