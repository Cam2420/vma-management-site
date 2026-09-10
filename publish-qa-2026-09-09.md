# September 9 release checks

## Scope
- Publish the approved homepage, pricing and process-page refinements.
- Monthly price: $449. Annual: $4,999/yr upfront, with the approved two additional months free (14 months total).
- Preserve the newer audit landing page and its assets from origin/main.
- Remove unnecessary customer-facing em dashes, without changing compound-word hyphens or timing ranges.

## Verification
- Homepage, pricing, process, privacy and terms checked at 1440, 1280, 1024, 768, 430, 390 and 320 CSS pixels.
- No page-width overflow or clipped visible headings found. The pricing section's intentionally screen-reader-only heading is excluded from visual clipping checks.
- Pricing annual and monthly modes checked, including the annual price at 320px.
- All seven included-service and five additional-service descriptions expanded successfully.
- All ten homepage FAQ answers expanded successfully.
- All three homepage outcome tabs displayed their matching panels.
- All 16 trade images retained; lazy-loaded images checked in the viewport.
- Audit landing page checked at 390px after merging the existing published work.
- Shared logo, header CTA and footer contact targets have a 44px minimum height. Mobile footer has extra clearance for the existing corner widgets.
- Local asset references, structured-data JSON, duplicate IDs, JavaScript syntax and git whitespace checks passed for the five main pages.
- No pricing-page browser console errors observed during interaction checks.

## Boundaries
- Existing widget scripts and booking destinations preserved. Audit CTAs use the approved public audit URL.
- No audit forms, live messages, calls, bookings or payments submitted during QA.
- Responsive checks use browser viewport emulation, not physical-device testing.
- Deployment uses the repository's existing GitHub-to-Vercel workflow; no manual Vercel deployment.
