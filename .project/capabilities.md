# Capabilities and project discovery

## Documented capabilities
Drawing canvas with brush editing; community garden; bloom watering and expiry; bloom share cards; local fallback; Express/Supabase persistence; privacy-filtered analytics.

## Verified (2026-11-23)
- Planting limit: 3 successful plants per rolling 24 hours per browser (`localStorage`), confirmed in `client/src/utils/plantLimit.js` and the UI message.
- Regression scripts (`test:duplicate-submit`, `test:wakeup-banner`) pass in GitHub Actions CI against a local preview build with mocked `/api/*`.

## Verification required
- Backend resilience, idempotency and data privacy need ongoing tests (no server tests exist yet; CI only syntax-checks `server.js`).
- Production smoke test (Supabase, Render, Vercel).

## Not a claim
This metadata describes functionality found in repository docs and package scripts. It is not an independent live feature audit.

## Discovery
Canonical tags: `web-app`, `creative-media`, `health-wellness`, `backend-api`, `database`, `privacy`.
