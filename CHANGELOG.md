# Changelog

All notable changes to Bloomspace will be documented here.

## v1.0.0 — First Public Bloom

Bloomspace began as a small hackathon-style garden for creating, saving, and sharing digital blooms. The first version focused on making the experience feel gentle, expressive, and complete enough for real users to try.

### Added

* Built the main flower creation flow.
* Added a drawing canvas for creating blooms by hand.
* Added brush color and brush size controls.
* Added clear canvas support.
* Added undo and redo for drawing strokes.
* Added bloom message/caption support.
* Added author and location fields for the bloom card.
* Added the garden view for displaying planted blooms.
* Added local fallback behavior so the app can still show saved flowers if the backend is unavailable.
* Added Supabase-backed flower storage through the Render backend.
* Added a confirmation modal before planting a flower.
* Added duplicate submission protection so rapid clicks, Enter-key spam, or repeated modal confirms cannot create many duplicate flowers.
* Added a `clientPlantId` idempotency key for safer plant requests.
* Added a 3-bloom-per-browser-session limit using `sessionStorage`.
* Added a friendly session-limit message after 3 blooms are planted.
* Added a shareable Bloomspace card generated as a PNG.
* Added Bloomspace watermark branding to shared cards.
* Added native Web Share support where available.
* Added PNG download fallback when native sharing is not supported.
* Added share status messages for preparing, sharing, downloading, and error states.
* Added Supabase wake-up handling for free-tier cold starts.
* Added a lightweight `/api/flowers/ping` endpoint to warm up the backend/database.
* Added a “Bloomspace is waking up” message when garden loading takes longer than expected.
* Added a retry message and button when the garden database cannot be reached.
* Added privacy-friendly analytics events through the Render backend and Supabase.
* Added analytics tracking for:

  * `page_view`
  * `garden_view`
  * `flower_created`
  * `flower_shared`
  * `share_downloaded`
* Added allowed future analytics events for:

  * `support_clicked`
  * `photo_uploaded`
* Added server-side analytics validation.
* Added metadata filtering to avoid storing names, messages, image contents, email, author, or location data in analytics.
* Added Playwright regression tests for duplicate submission prevention.
* Added Playwright verification for share flow, session limit, wake-up handling, and drawing behavior.

### Fixed

* Fixed repeated planting caused by clicking the confirmation button multiple times.
* Fixed Enter-key/modal spam creating duplicate blooms.
* Fixed session count incrementing multiple times during duplicate submissions.
* Fixed missing user feedback during Supabase cold-start delays.
* Fixed garden failure state so users are not left with a blank page.
* Fixed confirmation modal behavior so buttons are disabled while planting.
* Fixed share fallback behavior for browsers that do not support native image sharing.
* Fixed drawing state so undo, redo, clear, save, and share remain consistent.

### Changed

* Changed the post-plant flow to show a success screen instead of immediately navigating away.
* Changed sharing to create a polished Bloomspace card users can keep or post elsewhere.
* Changed garden loading to show sample/fallback content instead of feeling broken during backend delays.
* Changed analytics to be app-owned instead of relying only on Vercel, Render, or Supabase dashboards.
* Changed planting behavior to be safer and more resistant to accidental duplicate requests.

### Not included yet

* Custom domain.
* Monetization or paywall.
* User accounts.
* Public user profiles.
* Full moderation/reporting tools.
* Photo upload flow.
* Support the Plants link/button.
* Advanced analytics dashboard.
* Permanent database-level idempotency constraint.
* Custom favicon/browser logo.
* Open Graph/social preview image.

### Notes

Bloomspace v1.0 is intended as a public beta and portfolio-ready release. The focus is on a calm first-time experience: create a bloom, plant it, view it in the garden, and share it beautifully.
