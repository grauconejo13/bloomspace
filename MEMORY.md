# Bloomspace Memory

## Project Summary

Bloomspace is a revival/rebuild of my first hackathon project from nwHacks 2025 in Vancouver.

The app is a community wellness garden where users create digital flowers, attach kind messages, and plant them in a shared garden. The rebuild keeps the original hackathon idea but turns it into a more polished product: users can draw a bloom, plant it, view it in the garden, and share a watermarked Bloomspace card.

Bloomspace is currently positioned as a public beta / portfolio-ready project, not a monetized product.

## Stack

* React + Vite frontend
* Tailwind CSS
* React Router
* Node.js + Express backend
* Supabase for flower storage and analytics
* Render for backend hosting
* Vercel for frontend hosting
* `localStorage` fallback for MVP resilience
* `sessionStorage` for browser-session limits and analytics session IDs
* Playwright for regression testing

## Routes

* `/`
* `/create`
* `/garden`
* `/about`

## Current Features

* Home page with soft garden/wellness theme
* Navbar and Footer
* CreateFlower page
* Drawing canvas
* Brush color controls
* Brush size controls
* Clear canvas
* Undo and redo drawing strokes
* Message/caption textarea
* Optional author/location-style bloom metadata
* Confirmation modal before planting
* Duplicate submission protection during final plant confirmation
* 3-bloom-per-browser-session limit
* Friendly session-limit message
* Garden page with flower cards
* Flower detail view/modal
* Flower lifespan system
* Watering mechanic
* Supabase-backed shared garden
* `localStorage` fallback under `bloomspaceFlowers`
* Share Bloom success screen after planting
* PNG share-card generation
* Bloomspace watermark on share cards
* Native Web Share API support when available
* PNG download fallback when native sharing is unavailable
* Supabase wake-up/cold-start handling
* Friendly “Bloomspace is waking up” message for slow garden loads
* Retry message/button if the garden database cannot be reached
* Privacy-friendly analytics event tracking
* Playwright regression scripts for core flows

## Flower Lifespan Rule

* A planted flower blooms for 3 days.
* Watering does not stack extra days.
* Watering refreshes the flower back to 3 days from the current time.
* Expired flowers are hidden from the public garden.
* Water count is tracked as community support/refreshed count.

## Current Flower Object Shape

```js
{
  id,
  image,
  message,
  author: "Anonymous Gardener",
  plantedAt,
  expiresAt,
  wateredCount,
  clientPlantId
}
```

## Session Plant Limit

Bloomspace currently limits users to 3 successful planted blooms per browser session.

Rules:

* Limit is tracked with `sessionStorage`.
* Drawing, clearing, undoing, redoing, or failed saves do not count.
* Count increments only after a successful plant.
* On the 4th attempt, the plant button is disabled.
* The user sees: “You’ve planted 3 blooms this session 🌸 Come back later or refresh your session.”

## Duplicate Submission Protection

A bug was found where the “Are you sure you want to post this?” confirmation button could be clicked repeatedly, causing 10+ duplicate blooms.

Fixes added:

* `isSubmitting` state in `CreateFlower.jsx`
* `isSubmittingRef` synchronous guard to block same-tick spam clicks
* Disabled Cancel and Confirm buttons during planting
* Confirm button label changes to “Planting…”
* Backdrop click and Escape close are blocked while submitting
* `clientPlantId` is generated once per plant attempt
* Backend in-memory idempotency cache returns the same flower for repeated `clientPlantId` requests

Future improvement:

* Add a permanent unique `clientPlantId` column/index in Supabase for database-level idempotency.

## Share Bloom Feature

After a successful plant, Bloomspace shows a success screen instead of immediately navigating away.

The user can:

* View the planted bloom preview
* Share the bloom using the native Web Share API
* Download a generated PNG fallback if sharing is unsupported
* Share the PNG manually to platforms not listed in the native share sheet

The generated share card includes:

* Bloom image/drawing
* Bloom message
* Optional signature/location-style text
* Subtle Bloomspace watermark
* “planted in Bloomspace 🌱” footer/tagline

Planned improvement:

* Add the Bloomspace URL to the share card and native share text.

## Supabase Wake-Up Handling

Supabase free-tier projects can take around 10–15 seconds to wake after inactivity.

Added handling:

* Backend `/api/flowers/ping` endpoint
* Minimal Supabase query using `select("id").limit(1)`
* App-level fire-and-forget ping on mount
* Garden page shows wake-up message only if loading takes longer than 5 seconds
* Garden page shows fallback flowers/content instead of going blank
* Retry notice/button appears if database fetch fails

Wake-up message:

“🌱 Bloomspace is waking up… Our little garden has been resting. This may take a few moments.”

Failure/retry message:

“We couldn't reach the garden's database right now — showing flowers saved on this device.”

## Analytics

Bloomspace uses lightweight privacy-friendly analytics through the Render backend and Supabase.

Analytics table:

```sql
analytics_events
```

Tracked events:

* `page_view`
* `garden_view`
* `flower_created`
* `flower_shared`
* `share_downloaded`

Allowed but not wired yet:

* `support_clicked`
* `photo_uploaded`

Privacy rules:

* Do not track flower messages.
* Do not track image contents.
* Do not track names.
* Do not track emails.
* Do not track author/location text.
* Metadata is filtered server-side as defense-in-depth.
* Analytics calls must never block or break the app.

## Original Hackathon Concept

Bloomspace began as a nwHacks 2025 project focused on mental wellness.

The original idea was an interactive garden where users could:

* Draw flowers
* Publish flowers to a shared garden
* Save their drawings
* Click flowers to reveal inspiring messages

The team also imagined future features such as:

* A wellness to-do list
* Flower lifespans
* User-specific saved flowers

## Rebuild Direction

This rebuild keeps the original drawing + message + garden concept, but expands it into a calmer product experience.

Current direction:

* Users create a bloom.
* Users attach a short kind message.
* Users plant it in a shared garden.
* Users can water flowers to refresh their lifespan.
* Users can share a watermarked Bloomspace card.
* Bloomspace acts as both a wellness app and a portfolio/exposure project.

Design principles:

* Soft, gentle, and calming
* Not overly gamified
* No intrusive monetization
* Shareable but not spammy
* Public beta first, monetization later if there is real demand

## Monetization / Support Direction

Bloomspace should not be aggressively monetized right now.

Current approach:

* Keep the core experience free.
* Use Bloomspace as a portfolio and exposure project.
* Add optional “Support the Plants 🌱” later.
* Keep support/donation links subtle, likely in the footer or About page.

Possible future monetization:

* Optional donations
* Premium share-card themes
* Seasonal garden themes
* Printable bloom cards/postcards
* Organization/community gardens

Avoid for now:

* Ads
* Paywalling basic planting
* Paywalling basic sharing
* Monetization before launch validation

## Launch Status

Bloomspace is close to public beta.

Completed major launch-prep items:

* Drawing canvas
* Undo/redo
* Garden view
* Lifespan/watering mechanic
* Share Bloom card
* Native share + PNG fallback
* 3-bloom session limit
* Duplicate submission prevention
* Supabase wake-up UX
* Privacy-friendly analytics
* Regression testing

Remaining before public launch:

* Manually test Supabase wake-up message
* Run analytics SQL in Supabase
* Deploy Render backend first
* Deploy Vercel frontend second
* Smoke test production flow
* Finish About page story
* Add favicon/browser logo
* Add Bloomspace URL to share card/share text
* Add optional “Support the Plants 🌱”
* Contact previous hackathon teammate for testing
* Pin/share on LinkedIn and CodePen after final smoke test

## Deployment Notes

Current hosting setup:

* Frontend: Vercel
* Backend: Render
* Database/storage/analytics: Supabase

Deployment order:

1. Run any required Supabase SQL.
2. Deploy Render backend.
3. Deploy Vercel frontend.
4. Smoke test app in production.

## Testing Notes

Important manual tests:

* Create → draw → plant → success screen
* Confirm button spam-click should create only one bloom
* Enter-key spam should create only one bloom
* Share Bloom works on mobile
* PNG fallback works on desktop
* 3-bloom session limit blocks 4th plant
* Garden loads after refresh
* Supabase wake-up message appears only after slow load
* Retry button appears if backend/database fails
* Analytics rows appear after page view, garden view, flower creation, and share/download

Important automated checks:

* Duplicate submission Playwright test
* 3-plant session limit Playwright test
* Share Bloom Playwright test
* Supabase wake-up/retry Playwright test
* Drawing/undo/redo/clear regression checks
